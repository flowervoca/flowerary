package com.example.flowery_backend.Controller;

import com.example.flowery_backend.Service.CommmonApiService;
import com.example.flowery_backend.Service.FlowerHashtagService;
import com.example.flowery_backend.model.response.Response;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "FlowerHashTag", description = "꽃 해시태그 관련 API")
@RequestMapping("/api/flowerHashTag")
@Controller
@RequiredArgsConstructor
public class FlowerHashtagController extends CommmonApiService {
    private final FlowerHashtagService flowerHashtagService;


    @Operation(
            summary = "전체 꽃 해시태그 목록 조회",
            description = "시스템에 등록된 모든 꽃 해시태그 정보를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Response.class))
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "해시태그가 없습니다.",
                    content = @Content
            )
    })
    @GetMapping("/getFlowerHashtag")
    @ResponseBody
    public ResponseEntity<Response> getFlowerHashtag() {

        return createResponse(
                flowerHashtagService.getFlowerHashtag(),
                "조회 성공",
                "해시태그가 없습니다."
        );
    }

}
