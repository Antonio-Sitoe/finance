package com.finance.finance.modules.auth.controller;

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
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
    return authService.login(dto);
  }

  @PostMapping("/refresh")
  public LoginResponseDTO refresh(@Valid @RequestBody RefreshRequestDTO dto) {
    return authService.refresh(dto);
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(@Valid @RequestBody RefreshRequestDTO dto) {
    authService.logout(currentUserId(), dto);
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

  private Long currentUserId() {
    return Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
  }
}
