package com.example.flowery_backend.Repository;

import com.example.flowery_backend.model.Entity.FlowerHashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 꽃 해시태그 정보를 저장하는 JPA 레포지토리 인터페이스입니다.
 * JpaRepository를 상속받아 기본적인 CRUD 메서드를 제공합니다.
 */

@Repository
public interface FlowerHashtagJpaRepository extends JpaRepository<FlowerHashtag, Long> {


}
