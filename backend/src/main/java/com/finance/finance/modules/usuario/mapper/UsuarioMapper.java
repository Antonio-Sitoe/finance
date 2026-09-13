package com.finance.finance.modules.usuario.mapper;

import java.util.Optional;

import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.usuario.dto.UsuarioRequestDTO;
import com.finance.finance.modules.usuario.dto.UsuarioResponseDTO;
import com.finance.finance.modules.usuario.dto.UsuarioUpdateRequestDTO;
import com.finance.finance.modules.usuario.model.Usuario;

public final class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static Usuario toEntity(UsuarioRequestDTO dto, Role role) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setRole(role);
        usuario.setSituacao(dto.getSituacao());
        return usuario;
    }

    public static void updateEntity(Usuario usuario, UsuarioUpdateRequestDTO dto, Role role) {
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setRole(role);
        usuario.setSituacao(dto.getSituacao());
        Optional.ofNullable(dto.getSenha()).ifPresent(usuario::setSenha);
    }

    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        Role role = usuario.getRole();
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .roleId(role != null ? role.getId() : null)
                .roleCodigo(role != null ? role.getCodigo() : null)
                .roleNome(role != null ? role.getNome() : null)
                .situacao(usuario.getSituacao())
                .createdAt(usuario.getCreatedAt())
                .build();
    }
}
