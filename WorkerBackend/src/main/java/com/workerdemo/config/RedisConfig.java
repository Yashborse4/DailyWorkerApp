package com.workerdemo.config;

import com.workerdemo.websocket.RedisMessageSubscriber;
import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;

/**
 * Hardened Redis configuration with strict timeouts and resilient Lettuce client options.
 * Now manages Redis Pub/Sub to synchronize WebSocket messages across distributed nodes.
 * Optimized for non-blocking startup to remain resilient during infrastructure outages.
 */
@Configuration
@Slf4j
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }

    @Bean
    public ChannelTopic chatTopic() {
        return new ChannelTopic("worker-chat-events");
    }

    @Bean
    public TaskExecutor redisTaskExecutor() {
        return new SimpleAsyncTaskExecutor("redis-pubsub-");
    }

    @Bean
    public RedisMessageListenerContainer redisContainer(RedisConnectionFactory connectionFactory,
                                                        RedisMessageSubscriber messageSubscriber) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer() {
            @Override
            public boolean isAutoStartup() {
                return false;
            }
        };
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(new MessageListenerAdapter(messageSubscriber), chatTopic());
        container.setTaskExecutor(redisTaskExecutor());
        
        // Resilience: Handle connection failures gracefully during runtime
        container.setErrorHandler(e -> {
            log.error("Redis Pub/Sub Error: {}. System will retry automatically.", e.getMessage());
        });
        
        // Set recovery interval to 5 seconds
        container.setRecoveryInterval(5000);
        
        // CRITICAL: Auto-startup is disabled via override to prevent blocking the main ApplicationContext
        
        return container;
    }

    /**
     * Start the Redis container asynchronously once the application is ready.
     * This ensures the web server is online even if Redis synchronization is delayed.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        RedisMessageListenerContainer container = event.getApplicationContext().getBean(RedisMessageListenerContainer.class);
        CompletableFuture.runAsync(() -> {
            try {
                log.info("Starting Redis Pub/Sub Listener Container (Resilient Mode)...");
                container.start();
                log.info("Redis Pub/Sub Listener Container started successfully.");
            } catch (Exception e) {
                log.error("Initial Redis connection failed during listener startup: {}. Container will attempt automatic recovery.", e.getMessage());
            }
        });
    }

    @Bean
    public ClientOptions clientOptions() {
        return ClientOptions.builder()
                .socketOptions(SocketOptions.builder()
                        .connectTimeout(Duration.ofSeconds(2))
                        .keepAlive(true)
                        .build())
                .disconnectedBehavior(ClientOptions.DisconnectedBehavior.REJECT_COMMANDS)
                .autoReconnect(true)
                .build();
    }
}
