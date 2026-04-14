package com.workerdemo.controller;

import com.workerdemo.exception.BusinessException;
import com.workerdemo.exception.ErrorCode;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test-exception")
public class TestExceptionController {

    @GetMapping("/business")
    public void throwBusinessException() {
        throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Test business exception");
    }

    @GetMapping("/runtime")
    public void throwRuntimeException() {
        throw new RuntimeException("Test runtime exception");
    }
}
