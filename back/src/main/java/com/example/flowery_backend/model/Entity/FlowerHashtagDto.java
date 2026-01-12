package com.example.flowery_backend.model.Entity;

import lombok.Data;

@Data
public class FlowerHashtagDto {
    private final Long id;
    private final String tagName;
    private final String tagType;
    private final Object flowerId;

    // FlowerHashtag를 인자로 받는 생성자
    public FlowerHashtagDto(FlowerHashtag flowerHashtag) {
        this.id = flowerHashtag.getId();
        this.flowerId = flowerHashtag.getFlowerId();
        this.tagName = flowerHashtag.getTagName();
        this.tagType = flowerHashtag.getTagType();
    }


}

