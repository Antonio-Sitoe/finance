package com.finance.finance.modules.auth.service;

import com.finance.finance.modules.auth.dto.UsuarioAnalytcsResponseDto;
import com.finance.finance.modules.auth.dto.UsuarioRequestDTO;
import com.finance.finance.modules.auth.dto.UsuarioResponseDTO;
import com.finance.finance.modules.auth.dto.UsuarioUpdateRequestDTO;
import com.finance.finance.modules.auth.mapper.UsuarioMapper;
import com.finance.finance.modules.auth.model.Usuario;
import com.finance.finance.modules.auth.repository.UsuarioRepository;
import com.finance.finance.modules.common.enums.Perfil;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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

    public UsuarioResponseDTO atualizar(Long id, UsuarioUpdateRequestDTO dto) {
        Usuario usuario = buscarOuFalhar(id);
        validarEmailUnico(dto.getEmail(), id);
        UsuarioMapper.updateEntity(usuario, dto);
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        return UsuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public void desativar(Long id) {
        Usuario usuario = buscarOuFalhar(id);
        usuario.setSituacao(Situacao.INATIVO);
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public PageResponse<UsuarioResponseDTO> listar(PaginationRequest paginationRequest, Perfil perfil,
            Situacao situacao, String search) {
        Pageable pageable = paginationRequest.toPageable("id");
        Specification<Usuario> spec = Specification.unrestricted();

        if (perfil != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("perfil"), perfil));
        }

        if (situacao != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
        }

        if (search != null && !search.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("nome"), "%" + search + "%"));
        }

        return PageResponse.from(usuarioRepository.findAll(spec, pageable).map(UsuarioMapper::toResponseDTO));
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return UsuarioMapper.toResponseDTO(buscarOuFalhar(id));
    }

    @Transactional(readOnly = true)
    public UsuarioAnalytcsResponseDto buscarAnalytics() {
        Long totalUsuarios = usuarioRepository.count();
        Long totalAtivos = usuarioRepository.count((root, query, cb) -> cb.equal(root.get("situacao"), Situacao.ATIVO));
        Long totalInativos = usuarioRepository
                .count((root, query, cb) -> cb.equal(root.get("situacao"), Situacao.INATIVO));
        Long totalAdministradores = usuarioRepository
                .count((root, query, cb) -> cb.equal(root.get("perfil"), Perfil.ADMIN));
        return new UsuarioAnalytcsResponseDto(totalUsuarios, totalAtivos, totalInativos, totalAdministradores);
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
