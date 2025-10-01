package com.example.flowery_backend.model.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.xml.bind.annotation.XmlElement;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 꽃 정보를 저장하는 엔터티 클래스입니다.
 */
@Builder
@Entity
@Table(name = "flower", schema = "public")
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "f_low_nm")
    private String flowNm;

    @XmlElement
    @Column(name = "f_sct_nm")
    private String fSctNm;

    @XmlElement
    @Column(name = "f_eng_nm")
    private String fEngNm;

    @XmlElement
    @Column(name = "f_low_lang")
    private String flowLang;

    @XmlElement
    @Column(name = "f_content")
    private String fContent;

    @XmlElement
    @Column(name = "f_use")
    private String fUse;

    @XmlElement
    @Column(name = "f_grow")
    private String fGrow;

    @XmlElement
    @Column(name = "f_type")
    private String fType;

    @XmlElement
    @Column(name = "file_name1")
    private String fileName1;

    @XmlElement
    @Column(name = "file_name2")
    private String fileName2;

    @XmlElement
    @Column(name = "file_name3")
    private String fileName3;

    @XmlElement
    @Column(name = "img_url1")
    private String imgUrl1;

    @XmlElement
    @Column(name = "img_url2")
    private String imgUrl2;
    @XmlElement
    @Column(name = "img_url3")
    private String imgUrl3;

    @XmlElement
    @Column(name = "f_month")
    private String fMonth;

    @XmlElement
    @Column(name = "f_day")
    private String fDay;

    @OneToMany(mappedBy = "flower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FlowerHashtag> hashtags = new ArrayList<>();

}
