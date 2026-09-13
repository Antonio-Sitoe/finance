package com.finance.finance.modules.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.modules.auth.dto.ResetPasswordRequestDTO;
import com.finance.finance.modules.auth.model.PasswordResetToken;
import com.finance.finance.modules.auth.model.RefreshToken;
import com.finance.finance.modules.auth.repository.PasswordResetTokenRepository;
import com.finance.finance.modules.auth.repository.RefreshTokenRepository;
import com.finance.finance.modules.auth.security.JwtService;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.service.PermissionCacheService;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;
import com.finance.finance.modules.usuario.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UsuarioService usuarioService;
    @Mock
    private PermissionCacheService permissionCacheService;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTtlDias", 7L);
        ReflectionTestUtils.setField(authService, "frontendUrl", "http://localhost:4200");

        Role role = Role.builder().id(1L).codigo("ADMIN").sistema(true).build();
        usuario = new Usuario();
        usuario.setId(10L);
        usuario.setEmail("admin@finance.com");
        usuario.setSenha("hash");
        usuario.setSituacao(Situacao.ATIVO);
        usuario.setRole(role);
    }

    @Test
    void refreshRodaTokenENaoPermiteReutilizar() {
        String cru = "refresh-raw-token";
        RefreshToken antigo = new RefreshToken();
        antigo.setUsuario(usuario);
        antigo.setTokenHash(sha256(cru));
        antigo.setExpiresAt(LocalDateTime.now().plusDays(1));

        when(refreshTokenRepository.findByTokenHash(sha256(cru))).thenReturn(Optional.of(antigo));
        when(jwtService.gerarAccessToken(usuario)).thenReturn("access-1");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));

        AuthService.TokenPair pair = authService.refresh(cru);
        assertNotNull(pair.accessToken());
        assertNotNull(pair.refreshToken());
        assertNotNull(antigo.getRevokedAt());

        assertThrows(BusinessException.class, () -> authService.refresh(cru));
    }

    @Test
    void resetPasswordExpiradoNaoPodeSerUsado() {
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUsuario(usuario);
        prt.setTokenHash(sha256("reset-token"));
        prt.setExpiresAt(LocalDateTime.now().minusMinutes(1));

        when(passwordResetTokenRepository.findByTokenHash(sha256("reset-token")))
                .thenReturn(Optional.of(prt));

        ResetPasswordRequestDTO dto = new ResetPasswordRequestDTO();
        dto.setToken("reset-token");
        dto.setNovaSenha("NovaSenha@1");
        dto.setConfirmacao("NovaSenha@1");

        assertThrows(BusinessException.class, () -> authService.resetPassword(dto));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void resetPasswordUsadoNaoPodeSerReutilizado() {
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUsuario(usuario);
        prt.setTokenHash(sha256("reset-token"));
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));
        prt.setUsedAt(LocalDateTime.now().minusMinutes(5));

        when(passwordResetTokenRepository.findByTokenHash(sha256("reset-token")))
                .thenReturn(Optional.of(prt));

        ResetPasswordRequestDTO dto = new ResetPasswordRequestDTO();
        dto.setToken("reset-token");
        dto.setNovaSenha("NovaSenha@1");
        dto.setConfirmacao("NovaSenha@1");

        assertThrows(BusinessException.class, () -> authService.resetPassword(dto));
    }

    @Test
    void resetPasswordValidoActualizaSenhaEMarcaUsado() {
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUsuario(usuario);
        prt.setTokenHash(sha256("reset-token"));
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));

        when(passwordResetTokenRepository.findByTokenHash(sha256("reset-token")))
                .thenReturn(Optional.of(prt));
        when(passwordEncoder.encode(anyString())).thenReturn("new-hash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class))).thenAnswer(inv -> inv.getArgument(0));
        when(refreshTokenRepository.findAllByUsuarioIdAndRevokedAtIsNull(usuario.getId()))
                .thenReturn(java.util.List.of());

        ResetPasswordRequestDTO dto = new ResetPasswordRequestDTO();
        dto.setToken("reset-token");
        dto.setNovaSenha("NovaSenha@1");
        dto.setConfirmacao("NovaSenha@1");

        authService.resetPassword(dto);

        assertEquals("new-hash", usuario.getSenha());
        assertNotNull(prt.getUsedAt());
        verify(passwordEncoder).encode("NovaSenha@1");
    }

    private static String sha256(String valor) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(valor.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
