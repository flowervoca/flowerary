package com.example.flowery_backend.Controller;

import com.example.flowery_backend.Service.CommmonApiService;
import com.example.flowery_backend.Service.FlowerArticleService;
import com.example.flowery_backend.model.Entity.FlowerArticle;
import com.example.flowery_backend.model.request.FlowerArticleFilterRequest;
import com.example.flowery_backend.model.response.Response;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Flower Articles", description = "꽃 관련 아티클 API")
@RequestMapping("/api/article")
@RestController
@RequiredArgsConstructor
public class FlowerArticleController extends CommmonApiService {

    private final FlowerArticleService flowerArticleService;

    @Operation(
            summary = "전체 꽃 아티클 조회",
            description = "flower_articles 테이블에 등록된 모든 아티클을 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "전체 조회 성공",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Response.class)))
    })
    @GetMapping("/all")
    public ResponseEntity<Response> getAllArticles() {
        List<FlowerArticle> articles = flowerArticleService.findAll();
        return ResponseEntity.ok(new Response<>("전체 조회 성공", articles.size(), articles));
    }

    @Operation(
            summary = "조건 기반 아티클 필터링",
            description = "title, subTitle, content 중 하나 이상 조건으로 아티클을 필터링합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "필터 조회 성공",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Response.class)))
    })
    @PostMapping("/filter")
    public ResponseEntity<Response> filterArticles(@RequestBody FlowerArticleFilterRequest request) {
        List<FlowerArticle> result = flowerArticleService.filter(
                request.getTitle(),
                request.getSubTitle(),
                request.getContent()
        );
        return ResponseEntity.ok(new Response<>("필터 조회 성공", result.size(), result));
    }
}
