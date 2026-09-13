package com.finance.finance.modules.auth.service;

import com.finance.finance.modules.auth.security.JwtService;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.auth.dto.ChangePasswordRequestDTO;
import com.finance.finance.modules.auth.dto.ForgotPasswordRequestDTO;
import com.finance.finance.modules.auth.dto.LoginRequestDTO;
import com.finance.finance.modules.auth.dto.MeResponseDTO;
import com.finance.finance.modules.auth.dto.MeUpdateRequestDTO;
import com.finance.finance.modules.auth.dto.ResetPasswordRequestDTO;
import com.finance.finance.modules.auth.model.PasswordResetToken;
import com.finance.finance.modules.auth.model.RefreshToken;
import com.finance.finance.modules.auth.repository.PasswordResetTokenRepository;
import com.finance.finance.modules.auth.repository.RefreshTokenRepository;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.roles.service.PermissionCacheService;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;
import com.finance.finance.modules.usuario.service.UsuarioService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
  private final UsuarioRepository usuarioRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final UsuarioService usuarioService;
  private final PermissionCacheService permissionCacheService;

  @Value("${jwt.refresh-ttl-days}")
  private long refreshTtlDias;

  @Value("${frontend.url}")
  private String frontendUrl;

  public record TokenPair(String accessToken, String refreshToken) {
  }

  public TokenPair login(LoginRequestDTO dto) {
    Usuario usuario = usuarioRepository.findByEmail(dto.getEmail());

    if (usuario == null || usuario.getSituacao() != Situacao.ATIVO
        || !passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
      throw new BusinessException("Email ou senha inválidos");
    }
    usuario.setUltimoAcesso(LocalDateTime.now());
    usuarioRepository.save(usuario);
    return new TokenPair(jwtService.gerarAccessToken(usuario), criarRefreshToken(usuario));
  }

  private String criarRefreshToken(Usuario usuario) {
    String cru = UUID.randomUUID().toString() + UUID.randomUUID();
    RefreshToken rt = new RefreshToken();
    rt.setUsuario(usuario);
    rt.setTokenHash(sha256(cru));
    rt.setExpiresAt(LocalDateTime.now().plusDays(refreshTtlDias));
    refreshTokenRepository.save(rt);
    return cru;
  }

  public TokenPair refresh(String refreshTokenCru) {
    if (refreshTokenCru == null || refreshTokenCru.isBlank()) {
      throw new BusinessException("Refresh token inválido");
    }
    String hash = sha256(refreshTokenCru);
    RefreshToken antigo = refreshTokenRepository.findByTokenHash(hash)
        .orElseThrow(() -> new BusinessException("Refresh token inválido"));

    if (antigo.getRevokedAt() != null || antigo.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new BusinessException("Refresh token inválido ou expirado");
    }

    antigo.setRevokedAt(LocalDateTime.now());
    Usuario usuario = antigo.getUsuario();
    if (usuario.getSituacao() != Situacao.ATIVO) {
      throw new BusinessException("Refresh token inválido ou expirado");
    }

    return new TokenPair(jwtService.gerarAccessToken(usuario), criarRefreshToken(usuario));
  }

  public void logout(Long usuarioId, String refreshTokenCru) {
    if (refreshTokenCru == null || refreshTokenCru.isBlank()) {
      return;
    }
    String hash = sha256(refreshTokenCru);
    refreshTokenRepository.findByTokenHash(hash).ifPresent(rt -> {
      if (rt.getUsuario().getId().equals(usuarioId) && rt.getRevokedAt() == null) {
        rt.setRevokedAt(LocalDateTime.now());
      }
    });
  }

  @Transactional(readOnly = true)
  public MeResponseDTO me(Long usuarioId) {
    Usuario u = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    return toMeResponse(u);
  }

  public MeResponseDTO atualizarMe(Long usuarioId, MeUpdateRequestDTO dto) {
    Usuario u = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    usuarioService.validarEmailUnico(dto.getEmail(), usuarioId);
    u.setNome(dto.getNome());
    u.setEmail(dto.getEmail());
    return toMeResponse(usuarioRepository.save(u));
  }

  public void changePassword(Long usuarioId, ChangePasswordRequestDTO dto) {
    if (!dto.getNovaSenha().equals(dto.getConfirmacao())) {
      throw new BusinessException("A confirmação não coincide com a nova senha");
    }
    Usuario u = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    if (!passwordEncoder.matches(dto.getSenhaAtual(), u.getSenha())) {
      throw new BusinessException("Senha actual incorrecta");
    }
    if (passwordEncoder.matches(dto.getNovaSenha(), u.getSenha())) {
      throw new BusinessException("A nova senha deve ser diferente da actual");
    }
    u.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
    usuarioRepository.save(u);
  }

  public void forgotPassword(ForgotPasswordRequestDTO dto) {
    Usuario usuario = usuarioRepository.findByEmail(dto.getEmail());
    if (usuario == null || usuario.getSituacao() != Situacao.ATIVO) {
      return;
    }

    LocalDateTime agora = LocalDateTime.now();
    passwordResetTokenRepository.findAllByUsuarioIdAndUsedAtIsNull(usuario.getId())
        .forEach(t -> t.setUsedAt(agora));

    String cru = gerarTokenCru();
    PasswordResetToken prt = new PasswordResetToken();
    prt.setUsuario(usuario);
    prt.setTokenHash(sha256(cru));
    prt.setExpiresAt(agora.plusHours(1));
    passwordResetTokenRepository.save(prt);

    String link = frontendUrl + "/reset-password?token=" + cru;
    log.info("Link de reset de senha para {}: {}", usuario.getEmail(), link);
  }

  public void resetPassword(ResetPasswordRequestDTO dto) {
    if (!dto.getNovaSenha().equals(dto.getConfirmacao())) {
      throw new BusinessException("A confirmação não coincide com a nova senha");
    }

    PasswordResetToken prt = passwordResetTokenRepository.findByTokenHash(sha256(dto.getToken()))
        .orElseThrow(() -> new BusinessException("Token de reset inválido ou expirado"));

    if (prt.getUsedAt() != null || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new BusinessException("Token de reset inválido ou expirado");
    }

    Usuario usuario = prt.getUsuario();
    usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
    usuarioRepository.save(usuario);
    prt.setUsedAt(LocalDateTime.now());
    passwordResetTokenRepository.save(prt);

    LocalDateTime agora = LocalDateTime.now();
    refreshTokenRepository.findAllByUsuarioIdAndRevokedAtIsNull(usuario.getId())
        .forEach(rt -> rt.setRevokedAt(agora));
  }

  private MeResponseDTO toMeResponse(Usuario u) {
    String roleCodigo = u.getRole() != null ? u.getRole().getCodigo() : null;
    List<String> permissoes = List.of();
    if (u.getRole() != null && !u.getRole().isSistema()) {
      permissoes = permissionCacheService.getCodigos(u.getRole().getId()).stream().sorted().toList();
    }
    return MeResponseDTO.builder()
        .id(u.getId())
        .nome(u.getNome())
        .email(u.getEmail())
        .role(roleCodigo)
        .permissoes(permissoes)
        .ultimoAcesso(u.getUltimoAcesso())
        .criadoEm(u.getCreatedAt())
        .build();
  }

  private String gerarTokenCru() {
    byte[] bytes = new byte[32];
    new SecureRandom().nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  private String sha256(String valor) {
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(md.digest(valor.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new BusinessException("Erro ao gerar hash SHA-256");
    }
  }
}
