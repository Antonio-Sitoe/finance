package com.finance.finance.modules.usuario.service;

import com.finance.finance.modules.usuario.dto.UsuarioAnalytcsResponseDto;
import com.finance.finance.modules.usuario.dto.UsuarioRequestDTO;
import com.finance.finance.modules.usuario.dto.UsuarioResponseDTO;
import com.finance.finance.modules.usuario.dto.UsuarioStatusResponseDTO;
import com.finance.finance.modules.usuario.dto.UsuarioUpdateRequestDTO;
import com.finance.finance.modules.usuario.mapper.UsuarioMapper;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;
import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.repository.RoleRepository;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import java.text.Normalizer;

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
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        validarEmailUnico(dto.getEmail(), null);
        Role role = buscarRole(dto.getRoleId());
        Usuario usuario = UsuarioMapper.toEntity(dto, role);
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        return UsuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioUpdateRequestDTO dto) {
        Usuario usuario = buscarOuFalhar(id);
        validarEmailUnico(dto.getEmail(), id);
        Role role = buscarRole(dto.getRoleId());
        if (usuario.getRole().isSistema() && !role.isSistema()) {
            if (usuarioRepository.countActiveAdminsExcluding(id) == 0) {
                throw new BusinessException("Não é possível remover a role ADMIN do último administrador activo");
            }
        }
        UsuarioMapper.updateEntity(usuario, dto, role);
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        return UsuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public void desativar(Long id) {
        Usuario usuario = buscarOuFalhar(id);
        garantirNaoUltimoAdminActivo(usuario);
        usuario.setSituacao(Situacao.INATIVO);
        usuarioRepository.save(usuario);
    }

    public UsuarioStatusResponseDTO activarOuDesativar(Long id) {
        Usuario usuario = buscarOuFalhar(id);

        String mensagem;
        if (usuario.getSituacao() == Situacao.ATIVO) {
            garantirNaoUltimoAdminActivo(usuario);
            usuario.setSituacao(Situacao.INATIVO);
            mensagem = "Usuário desativado com sucesso";
        } else {
            usuario.setSituacao(Situacao.ATIVO);
            mensagem = "Usuário ativado com sucesso";
        }

        usuarioRepository.save(usuario);
        return new UsuarioStatusResponseDTO(usuario.getId(), usuario.getSituacao(), mensagem);
    }

    @Transactional(readOnly = true)
    public PageResponse<UsuarioResponseDTO> listar(PaginationRequest paginationRequest, Long roleId,
            Situacao situacao, String search) {
        Pageable pageable = paginationRequest.toPageable("id");
        Specification<Usuario> spec = Specification.unrestricted();

        if (roleId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("role").get("id"), roleId));
        }

        if (situacao != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
        }

        if (search != null && !search.isBlank()) {
            String term = "%" + Normalizer.normalize(search.trim(), Normalizer.Form.NFD)
                    .replaceAll("\\p{M}", "")
                    .toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(
                    cb.function("unaccent", String.class, cb.lower(root.get("nome"))),
                    term));
        }

        return PageResponse.from(usuarioRepository.findAll(spec, pageable).map(UsuarioMapper::toResponseDTO));
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return UsuarioMapper.toResponseDTO(buscarOuFalhar(id));
    }

    @Transactional(readOnly = true)
    public UsuarioAnalytcsResponseDto buscarAnalytics() {
        UsuarioAnalytcsResponseDto analytics = usuarioRepository.fetchUsuarioAnalytics();
        Long totalUsuarios = analytics.totalUsuarios() != null ? analytics.totalUsuarios() : 0L;
        Long totalAtivos = analytics.totalAtivos() != null ? analytics.totalAtivos() : 0L;
        Long totalInativos = analytics.totalInativos() != null ? analytics.totalInativos() : 0L;
        Long totalAdministradores = analytics.totalAdministradores() != null ? analytics.totalAdministradores() : 0L;
        return UsuarioAnalytcsResponseDto.builder()
                .totalUsuarios(totalUsuarios)
                .totalAtivos(totalAtivos)
                .totalInativos(totalInativos)
                .totalAdministradores(totalAdministradores)
                .build();
    }

    private void garantirNaoUltimoAdminActivo(Usuario usuario) {
        if (usuario.getRole() != null && usuario.getRole().isSistema()
                && usuario.getSituacao() == Situacao.ATIVO
                && usuarioRepository.countActiveAdminsExcluding(usuario.getId()) == 0) {
            throw new BusinessException("Não é possível desactivar o último administrador activo");
        }
    }

    private Role buscarRole(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada com id: " + roleId));
    }

    private Usuario buscarOuFalhar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
    }

    public void validarEmailUnico(String email, Long idAtual) {
        boolean emailEmUso = idAtual == null
                ? usuarioRepository.existsByEmail(email)
                : usuarioRepository.existsByEmailAndIdNot(email, idAtual);

        if (emailEmUso) {
            throw new BusinessException("Já existe um usuário cadastrado com este email");
        }
    }

}
