package com.example.flowery_backend.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlowerRequest {
    private String flowNm; // 꽃 이름
    private String fMonth; // 꽃의 월
    private String fDay; // 꽃의 날
    private String tagName; // 해시태그 이름
}
