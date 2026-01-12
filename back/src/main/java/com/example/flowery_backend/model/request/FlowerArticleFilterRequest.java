package com.example.flowery_backend.model.request;

import lombok.Data;

@Data
public class FlowerArticleFilterRequest {
    private String title;
    private String subTitle;
    private String content;
}
