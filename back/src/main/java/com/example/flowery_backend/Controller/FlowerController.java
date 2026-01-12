package com.example.flowery_backend.Controller;

import com.example.flowery_backend.Service.CommmonApiService;
import com.example.flowery_backend.Service.FlowerService;
import com.example.flowery_backend.model.Entity.FlowerDto;
import com.example.flowery_backend.model.Entity.FlowerSearchResult;
import com.example.flowery_backend.model.request.FlowerRequest;
import com.example.flowery_backend.model.response.Response;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Flower", description = "꽃 관련 API")
@RequestMapping("/api/flower")
@RestController
@RequiredArgsConstructor
public class FlowerController extends CommmonApiService {

  private final FlowerService flowerService;

  @Operation(
      summary = "조건 기반 꽃 정보 조회",
      description = "꽃 이름(flowNm), 월(fMonth), 일(fDay), 해시태그(tagName) 중 하나 이상으로 조건 검색합니다."
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "조회 성공",
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = Response.class))
      ),
      @ApiResponse(
          responseCode = "404",
          description = "조건에 맞는 꽃이 없습니다.",
          content = @Content
      )
  })
  @PostMapping("/searchFlowerAdvanced")
  public ResponseEntity<Response> searchFlowerAdvanced(@RequestBody FlowerRequest request) {

    List<FlowerDto> flowerDtoList = flowerService.searchFlowersWithFilters(
        request.getFlowNm(),
        request.getFMonth(),
        request.getFDay(),
        request.getTagName()
    );

    Set<String> tagSet = new HashSet<>();
    for (FlowerDto dto : flowerDtoList) {
      List<String> hashtags = dto.getHashtags();
      if (hashtags != null) {
        tagSet.addAll(hashtags);
      }
    }

    FlowerSearchResult result = new FlowerSearchResult(
        flowerDtoList,
        new ArrayList<>(tagSet)
    );

    Response<FlowerSearchResult> response = new Response<>(
        "SUCCESS",
        flowerDtoList.size(),
        result
    );

    return ResponseEntity.ok(response);
  }


  @Operation(
      summary = "오늘의 꽃 정보 조회",
      description = "금월 가장 가까운 오늘의 꽃을 추천합니다."
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "조회 성공",
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = Response.class))
      ),
      @ApiResponse(
          responseCode = "404",
          description = "조건에 맞는 꽃이 없습니다.",
          content = @Content
      )
  })
  @PostMapping("/recommendFlower")
  public ResponseEntity<Response> recommendFlower() {

    FlowerDto flowerDto = flowerService.recommendFlower();
    Response<FlowerDto> response = new Response<>(
        "SUCCESS",
        flowerDto != null ? 1 : 0,
        flowerDto
    );
    return ResponseEntity.ok(response);
  }

}
