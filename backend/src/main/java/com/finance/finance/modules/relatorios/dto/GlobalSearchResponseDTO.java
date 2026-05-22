package com.finance.finance.modules.relatorios.dto;

public record GlobalSearchResponseDTO(
        Long id,
        String type,
        String title,
        String subtitle,
        String url) {
}