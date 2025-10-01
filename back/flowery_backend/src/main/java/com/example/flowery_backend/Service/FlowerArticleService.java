package com.example.flowery_backend.Service;

import com.example.flowery_backend.Repository.FlowerArticleRepository;
import com.example.flowery_backend.model.Entity.FlowerArticle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlowerArticleService {

    private final FlowerArticleRepository flowerArticleRepository;

    public List<FlowerArticle> findAll() {
        return flowerArticleRepository.findAll();
    }

    public List<FlowerArticle> filter(String title, String subTitle, String content) {
        return flowerArticleRepository.filterByFields(title, subTitle, content);
    }
}
