package com.example.flowery_backend.Repository;

import com.example.flowery_backend.model.Entity.FlowerArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FlowerArticleRepository extends JpaRepository<FlowerArticle, Integer> {

    @Query("""
                SELECT a FROM FlowerArticle a
                WHERE (:title IS NULL OR :title = '' OR a.title LIKE %:title%)
                  AND (:subTitle IS NULL OR :subTitle = '' OR a.subTitle LIKE %:subTitle%)
                  AND (:content IS NULL OR :content = '' OR a.content LIKE %:content%)
            """)
    List<FlowerArticle> filterByFields(
            @Param("title") String title,
            @Param("subTitle") String subTitle,
            @Param("content") String content
    );
}
