package com.example.flowery_backend.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlowerSearchResult {
    private List<FlowerDto> flowers;
    private List<String> uniqueHashtags;
}

