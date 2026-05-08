package com.finance.finance.modules.auth.mapper;

import com.finance.finance.modules.auth.dto.UsuarioRequestDTO;
import com.finance.finance.modules.auth.dto.UsuarioResponseDTO;
import com.finance.finance.modules.auth.model.Usuario;

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

    public static void updateEntity(Usuario usuario, UsuarioRequestDTO dto) {
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setPerfil(dto.getPerfil());
        usuario.setSituacao(dto.getSituacao());
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
