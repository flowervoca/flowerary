package com.example.flowery_backend.Repository;

import com.example.flowery_backend.model.Entity.Flower;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FlowerJpaRepository extends JpaRepository<Flower, Long> {

  @Query("""
          SELECT DISTINCT f FROM Flower f
          LEFT JOIN FETCH f.hashtags h
          WHERE (:flowNm IS NULL OR :flowNm = '' OR f.flowNm LIKE %:flowNm%)
            AND (:tagName IS NULL OR :tagName = '' OR h.tagName LIKE %:tagName%)
            AND (:fMonth IS NULL OR :fMonth = '' OR f.fMonth = :fMonth)
            AND (:fDay IS NULL OR :fDay = '' OR f.fDay = :fDay)
      """)
  List<Flower> searchFlowerWithFilters(
      @Param("flowNm") String flowNm,
      @Param("fMonth") String fMonth,
      @Param("fDay") String fDay,
      @Param("tagName") String tagName
  );

  // 금월 최신 1건 (결정적)
  @Query(value = """
      SELECT *
      FROM public.flower
      WHERE f_month::int = EXTRACT(MONTH FROM CURRENT_DATE)::int
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      """, nativeQuery = true)
  Optional<Flower> recommendFlower();


}
