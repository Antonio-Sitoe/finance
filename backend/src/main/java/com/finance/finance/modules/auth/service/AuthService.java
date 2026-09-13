package com.finance.finance.modules.auth.service;

import com.finance.finance.modules.auth.security.JwtService;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.auth.dto.ChangePasswordRequestDTO;
import com.finance.finance.modules.auth.dto.ForgotPasswordRequestDTO;
import com.finance.finance.modules.auth.dto.LoginRequestDTO;
import com.finance.finance.modules.auth.dto.LoginResponseDTO;
import com.finance.finance.modules.auth.dto.MeResponseDTO;
import com.finance.finance.modules.auth.dto.MeUpdateRequestDTO;
import com.finance.finance.modules.auth.dto.RefreshRequestDTO;
import com.finance.finance.modules.auth.dto.ResetPasswordRequestDTO;
import com.finance.finance.modules.auth.model.RefreshToken;
import com.finance.finance.modules.auth.repository.PasswordResetTokenRepository;
import com.finance.finance.modules.auth.repository.RefreshTokenRepository;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;
import com.finance.finance.modules.usuario.service.UsuarioService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

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

  @Value("${jwt.refresh-ttl-days}")
  private long refreshTtlDias;

  public LoginResponseDTO login(LoginRequestDTO dto) {
    Usuario usuario = usuarioRepository.findByEmail(dto.getEmail());

    if (usuario == null || usuario.getSituacao() != Situacao.ATIVO
        || !passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
      throw new BusinessException("Email ou senha inválidos");
    }
    usuario.setUltimoAcesso(LocalDateTime.now());
    return new LoginResponseDTO(jwtService.gerarAccessToken(usuario), criarRefreshToken(usuario));
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

  public LoginResponseDTO refresh(RefreshRequestDTO dto) {
    String hash = sha256(dto.getRefreshToken());
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

    return new LoginResponseDTO(
        jwtService.gerarAccessToken(usuario),
        criarRefreshToken(usuario));
  }

  public void logout(Long usuarioId, RefreshRequestDTO dto) {
    String hash = sha256(dto.getRefreshToken());
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
    return MeResponseDTO.builder()
        .id(u.getId())
        .nome(u.getNome())
        .email(u.getEmail())
        .role(u.getPerfil().name()) // Sprint 2: u.getRole().getCodigo()
        .permissoes(List.of()) // Sprint 2: lista real da role
        .ultimoAcesso(u.getUltimoAcesso())
        .criadoEm(u.getCreatedAt())
        .build();
  }

  public MeResponseDTO atualizarMe(Long usuarioId, MeUpdateRequestDTO dto) {
    Usuario u = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    usuarioService.validarEmailUnico(dto.getEmail(), usuarioId);
    u.setNome(dto.getNome());
    u.setEmail(dto.getEmail());
    return me(usuarioId);
  }

  private String sha256(String valor) {
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(md.digest(valor.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new BusinessException("Erro ao gerar hash SHA-256");
    }
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
  }

  public void forgotPassword(ForgotPasswordRequestDTO dto) {
    // 1.9: se user ATIVO → criar PasswordResetToken (hash); sempre return sem erro
  }

  public void resetPassword(ResetPasswordRequestDTO dto) {
    // 1.9: validar token, marcar usedAt, gravar nova senha
    throw new BusinessException("Reset de senha ainda não disponível");
  }
}
