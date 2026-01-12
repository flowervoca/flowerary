package com.example.flowery_backend.model.xml;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Result {

    @XmlElement
    private int dataNo;

    @XmlElement
    private String flowNm;

    @XmlElement
    private String fSctNm;

    @XmlElement
    private String fEngNm;

    @XmlElement
    private String flowLang;

    @XmlElement
    private String fContent;

    @XmlElement
    private String fUse;

    @XmlElement
    private String fGrow;

    @XmlElement
    private String fType;

    @XmlElement
    private String fileName1;

    @XmlElement
    private String fileName2;

    @XmlElement
    private String fileName3;

    @XmlElement
    private String imgUrl1;

    @XmlElement
    private String imgUrl2;
    @XmlElement
    private String imgUrl3;

    @XmlElement
    private String fMonth;

    @XmlElement
    private String fDay;

    @XmlElement
    private String fMeans;

    @XmlElement
    private String fSeason;

    @XmlElement
    private String publishOrg;

    // Getters & Setters
}
