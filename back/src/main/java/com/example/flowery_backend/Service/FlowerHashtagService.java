package com.example.flowery_backend.Service;

import com.example.flowery_backend.Repository.FlowerHashtagJpaRepository;
import com.example.flowery_backend.model.Entity.FlowerHashtag;
import com.example.flowery_backend.model.Entity.FlowerHashtagDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlowerHashtagService {

    /**
     * 꽃 해시태그 정보를 저장하는 JPA 레포지토리입니다.
     */
    private final FlowerHashtagJpaRepository flowerHashtagJpaRepository;

    /**
     * 생성자 주입을 통해 FlowerHashtagJpaRepository를 주입받습니다.
     *
     * @param flowerHashtagJpaRepository FlowerHashtagJpaRepository
     */
    public FlowerHashtagService(FlowerHashtagJpaRepository flowerHashtagJpaRepository) {
        this.flowerHashtagJpaRepository = flowerHashtagJpaRepository;
    }

    /**
     * 모든 꽃 해시태그 정보를 조회하는 메서드입니다.
     *
     * @return List<FlowerHashtag> 꽃 해시태그 정보
     */
    @Transactional
    public List<FlowerHashtagDto> getFlowerHashtag() {
        List<FlowerHashtag> flowers = flowerHashtagJpaRepository.findAll();
        return flowers.stream()
                .map(FlowerHashtagDto::new)
                .collect(Collectors.toList());
    }


}
