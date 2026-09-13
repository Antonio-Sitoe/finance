package com.finance.finance.modules.auth.model;

import java.time.LocalDateTime;

import com.finance.finance.modules.common.baseEntity.BaseEntity;
import com.finance.finance.modules.usuario.model.Usuario;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "password_reset_token")
public class PasswordResetToken extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;

  private String tokenHash;
  private LocalDateTime expiresAt;
  private LocalDateTime usedAt;
}
