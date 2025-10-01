package com.example.flowery_backend.Service;

import com.example.flowery_backend.model.response.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommmonApiService {

    protected <T> ResponseEntity<Response> createResponse(List<T> data, String successMsg, String notFoundMsg) {
        if (!data.isEmpty()) {
            return ResponseEntity.ok(
                    new Response<>(successMsg, data.size(), data)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new Response<>(notFoundMsg, 0, List.of())
            );
        }
    }

}
