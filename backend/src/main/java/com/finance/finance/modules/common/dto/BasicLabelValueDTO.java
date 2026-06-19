package com.finance.finance.modules.common.dto;

import lombok.Builder;

@Builder
public record BasicLabelValueDTO<T>(String label,
        T value) {
}
