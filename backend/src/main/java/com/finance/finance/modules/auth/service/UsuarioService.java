package com.finance.finance.modules.auth.service;

import com.finance.finance.modules.auth.dto.UsuarioRequestDTO;
import com.finance.finance.modules.auth.dto.UsuarioResponseDTO;
import com.finance.finance.modules.auth.mapper.UsuarioMapper;
import com.finance.finance.modules.auth.model.Usuario;
import com.finance.finance.modules.auth.repository.UsuarioRepository;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        validarEmailUnico(dto.getEmail(), null);
        Usuario usuario = UsuarioMapper.toEntity(dto);
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        return UsuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarOuFalhar(id);
        validarEmailUnico(dto.getEmail(), id);
        UsuarioMapper.updateEntity(usuario, dto);
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        return UsuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public void desativar(Long id) {
        Usuario usuario = buscarOuFalhar(id);
        usuario.setSituacao(Situacao.INATIVO);
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public PageResponse<UsuarioResponseDTO> listar(PaginationRequest paginationRequest) {
        Pageable pageable = paginationRequest.toPageable("id");
        Page<UsuarioResponseDTO> page = usuarioRepository.findAll(pageable)
                .map(UsuarioMapper::toResponseDTO);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return UsuarioMapper.toResponseDTO(buscarOuFalhar(id));
    }

    private Usuario buscarOuFalhar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
    }

    private void validarEmailUnico(String email, Long idAtual) {
        boolean emailEmUso = idAtual == null
                ? usuarioRepository.existsByEmail(email)
                : usuarioRepository.existsByEmailAndIdNot(email, idAtual);

        if (emailEmUso) {
            throw new BusinessException("Já existe um usuário cadastrado com este email");
        }
    }
}
