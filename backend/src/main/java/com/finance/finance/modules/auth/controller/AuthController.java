package com.finance.finance.modules.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import com.finance.finance.modules.auth.dto.MeResponseDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import com.finance.finance.modules.auth.service.AuthService;
import org.springframework.web.bind.annotation.PatchMapping;
import com.finance.finance.modules.auth.dto.LoginRequestDTO;
import com.finance.finance.modules.auth.dto.LoginResponseDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.finance.finance.modules.auth.dto.RefreshRequestDTO;
import com.finance.finance.modules.auth.dto.MeUpdateRequestDTO;
import com.finance.finance.modules.auth.dto.ResetPasswordRequestDTO;
import com.finance.finance.modules.auth.dto.ForgotPasswordRequestDTO;
import com.finance.finance.modules.auth.dto.ChangePasswordRequestDTO;
import com.finance.finance.modules.auth.support.RefreshTokenCookieSupport;
import com.finance.finance.exceptions.BusinessException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final RefreshTokenCookieSupport refreshCookies;

  @PostMapping("/login")
  public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO dto, HttpServletResponse response) {
    AuthService.TokenPair pair = authService.login(dto);
    refreshCookies.write(response, pair.refreshToken());
    return LoginResponseDTO.builder().accessToken(pair.accessToken()).build();
  }

  @PostMapping("/refresh")
  public LoginResponseDTO refresh(
      HttpServletRequest request,
      HttpServletResponse response,
      @RequestBody(required = false) RefreshRequestDTO dto) {
    String raw = resolveRefreshToken(request, dto);
    AuthService.TokenPair pair = authService.refresh(raw);
    refreshCookies.write(response, pair.refreshToken());
    return LoginResponseDTO.builder().accessToken(pair.accessToken()).build();
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(
      HttpServletRequest request,
      HttpServletResponse response,
      @RequestBody(required = false) RefreshRequestDTO dto) {
    String raw = resolveRefreshTokenOptional(request, dto);
    if (StringUtils.hasText(raw)) {
      authService.logout(currentUserId(), raw);
    }
    refreshCookies.clear(response);
  }

  @GetMapping("/me")
  public MeResponseDTO me() {
    return authService.me(currentUserId());
  }

  @PatchMapping("/me")
  public MeResponseDTO atualizarMe(@Valid @RequestBody MeUpdateRequestDTO dto) {
    return authService.atualizarMe(currentUserId(), dto);
  }

  @PostMapping("/change-password")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void changePassword(@Valid @RequestBody ChangePasswordRequestDTO dto) {
    authService.changePassword(currentUserId(), dto);
  }

  @PostMapping("/forgot-password")
  @ResponseStatus(HttpStatus.OK)
  public void forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto) {
    authService.forgotPassword(dto);
  }

  @PostMapping("/reset-password")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void resetPassword(@Valid @RequestBody ResetPasswordRequestDTO dto) {
    authService.resetPassword(dto);
  }

  private String resolveRefreshToken(HttpServletRequest request, RefreshRequestDTO dto) {
    String raw = resolveRefreshTokenOptional(request, dto);
    if (!StringUtils.hasText(raw)) {
      throw new BusinessException("Refresh token inválido");
    }
    return raw;
  }

  private String resolveRefreshTokenOptional(HttpServletRequest request, RefreshRequestDTO dto) {
    String fromCookie = refreshCookies.read(request);
    if (StringUtils.hasText(fromCookie)) {
      return fromCookie;
    }
    if (dto != null && StringUtils.hasText(dto.getRefreshToken())) {
      return dto.getRefreshToken();
    }
    return null;
  }

  private Long currentUserId() {
    return Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
  }
}
