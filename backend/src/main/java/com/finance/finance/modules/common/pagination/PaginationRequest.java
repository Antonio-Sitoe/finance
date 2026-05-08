package com.finance.finance.modules.common.pagination;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Getter
@Setter
public class PaginationRequest {

    @Min(value = 0, message = "A página não pode ser negativa")
    private int page = 0;

    @Min(value = 1, message = "O tamanho da página deve ser no mínimo 1")
    @Max(value = 100, message = "O tamanho da página deve ser no máximo 100")
    private int size = 10;

    private String sortBy = "id";

    private String sortDirection = "asc";

    public Pageable toPageable(String defaultSortBy) {
        String resolvedSortBy = (sortBy == null || sortBy.isBlank()) ? defaultSortBy : sortBy;
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(page, size, Sort.by(direction, resolvedSortBy));
    }
}
