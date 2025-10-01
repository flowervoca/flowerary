package com.example.flowery_backend.model.xml;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import java.util.List;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Root {

    private String resultCode;
    private String resultMsg;
    private int resultCnt;
    private int pageNo;
    private int numOfRows;
    private String repcategory;

    @XmlElement(name = "result")
    private List<Result> results;

    public List<Result> getResults() {
        return results;
    }
}
