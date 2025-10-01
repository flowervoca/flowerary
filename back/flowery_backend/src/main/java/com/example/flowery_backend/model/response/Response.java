package com.example.flowery_backend.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response<T> {
    private String resultMsg;
    private int totalCount;
    private T data;
}

