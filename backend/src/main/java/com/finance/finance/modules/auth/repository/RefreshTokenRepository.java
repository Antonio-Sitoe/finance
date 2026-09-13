package com.finance.finance.modules.auth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.finance.modules.auth.model.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String hash);

    List<RefreshToken> findAllByUsuarioIdAndRevokedAtIsNull(Long usuarioId);
}
