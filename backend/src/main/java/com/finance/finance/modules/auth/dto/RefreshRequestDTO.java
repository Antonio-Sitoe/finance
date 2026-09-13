package com.finance.finance.modules.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshRequestDTO {
    /** Opcional: preferir cookie HttpOnly `refresh_token`. */
    private String refreshToken;
}
