package com.example.flowery_backend.model.Entity;

import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;


@Data
public class FlowerDto {
    private final Long id;
    private final String flowNm;
    private final String fSctNm;
    private final String fEngNm;
    private final String flowLang;
    private final String fContent;
    private final String fUse;
    private final String fGrow;
    private final String fType;
    private final String fMonth;
    private final String fDay;
    private final String imgUrl1;
    private final String imgUrl2;
    private final String imgUrl3;
    private final List<String> hashtags; // Tag name만 반환

    // 생성자
    public FlowerDto(Flower flower) {
        this.id = flower.getId();
        this.flowNm = flower.getFlowNm();
        this.fSctNm = flower.getFSctNm();
        this.fEngNm = flower.getFEngNm();
        this.flowLang = flower.getFlowLang();
        this.fContent = flower.getFContent();
        this.fUse = flower.getFUse();
        this.fGrow = flower.getFGrow();
        this.fType = flower.getFType();
        this.fMonth = flower.getFMonth();
        this.fDay = flower.getFDay();
        this.imgUrl1 = flower.getImgUrl1();
        this.imgUrl2 = flower.getImgUrl2();
        this.imgUrl3 = flower.getImgUrl3();
        this.hashtags = flower.getHashtags().stream()
                .map(FlowerHashtag::getTagName) // `tagName`만 추출
                .collect(Collectors.toList());
    }

}
