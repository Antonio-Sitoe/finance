package com.finance.finance.modules.usuario.mapper;

import java.util.Optional;

import com.finance.finance.modules.usuario.dto.UsuarioRequestDTO;
import com.finance.finance.modules.usuario.dto.UsuarioResponseDTO;
import com.finance.finance.modules.usuario.dto.UsuarioUpdateRequestDTO;
import com.finance.finance.modules.usuario.model.Usuario;

public final class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static Usuario toEntity(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setPerfil(dto.getPerfil());
        usuario.setSituacao(dto.getSituacao());
        return usuario;
    }

    public static void updateEntity(Usuario usuario, UsuarioUpdateRequestDTO dto) {
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setPerfil(dto.getPerfil());
        usuario.setSituacao(dto.getSituacao());
        Optional.ofNullable(dto.getSenha()).ifPresent(usuario::setSenha);
    }

    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .situacao(usuario.getSituacao())
                .createdAt(usuario.getCreatedAt())
                .build();
    }
}
