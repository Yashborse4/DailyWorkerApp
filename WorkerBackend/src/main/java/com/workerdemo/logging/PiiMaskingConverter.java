package com.workerdemo.logging;

import ch.qos.logback.classic.pattern.MessageConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Logback converter to mask potential PII (Personally Identifiable Information) in logs.
 * Focuses on emails, phone numbers (simple patterns), and tokens.
 */
public class PiiMaskingConverter extends MessageConverter {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("(?<=.)[^@\\s](?=[^@\\s]*?[^@\\s]@)|(?:(?<=@.)|(?!^)\\G(?=[^@]*$)).(?=.*[^@\\s]@)", Pattern.CASE_INSENSITIVE);
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b");
    private static final Pattern TOKEN_PATTERN = Pattern.compile("(?:bearer|token|password|secret|key|auth|credential)[\\s=:]+([^\\s,]+)", Pattern.CASE_INSENSITIVE);

    @Override
    public String convert(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        if (message == null || message.isEmpty()) {
            return message;
        }

        // Mask Emails
        message = maskEmails(message);

        // Mask Phone Numbers
        message = maskPhones(message);

        // Mask Sensitive Keys
        message = maskSensitiveKeys(message);

        return message;
    }

    private String maskEmails(String message) {
        // Simple mask: user@example.com -> u***@example.com
        Matcher matcher = Pattern.compile("([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})").matcher(message);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String firstChar = matcher.group(1);
            String domain = matcher.group(3);
            matcher.appendReplacement(sb, firstChar + "****@" + domain);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String maskPhones(String message) {
        Matcher matcher = PHONE_PATTERN.matcher(message);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String phone = matcher.group();
            if (phone.length() > 4) {
                matcher.appendReplacement(sb, "****" + phone.substring(phone.length() - 4));
            } else {
                matcher.appendReplacement(sb, "****");
            }
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String maskSensitiveKeys(String message) {
        Matcher matcher = TOKEN_PATTERN.matcher(message);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String prefix = matcher.group().split("[\\s=:]+")[0];
            matcher.appendReplacement(sb, prefix + ": ****");
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}
