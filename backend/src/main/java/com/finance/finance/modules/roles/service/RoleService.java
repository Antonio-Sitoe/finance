package com.finance.finance.modules.roles.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.roles.dto.PermissaoCatalogDTO;
import com.finance.finance.modules.roles.dto.PermissaoGrantedDTO;
import com.finance.finance.modules.roles.dto.PermissaoItemDTO;
import com.finance.finance.modules.roles.dto.RoleCreateRequestDTO;
import com.finance.finance.modules.roles.dto.RoleDetailDTO;
import com.finance.finance.modules.roles.dto.RoleListItemDTO;
import com.finance.finance.modules.roles.dto.RoleUpdateRequestDTO;
import com.finance.finance.modules.roles.model.Permissao;
import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.repository.PermissaoRepository;
import com.finance.finance.modules.roles.repository.RoleRepository;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissaoRepository permissaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PermissionCacheService permissionCacheService;

    @Transactional(readOnly = true)
    public List<RoleListItemDTO> listar() {
        return roleRepository.findAllOrdered().stream()
                .map(role -> RoleListItemDTO.builder()
                        .id(role.getId())
                        .codigo(role.getCodigo())
                        .nome(role.getNome())
                        .descricao(role.getDescricao())
                        .sistema(role.isSistema())
                        .totalUsuarios(usuarioRepository.countByRoleId(role.getId()))
                        .build())
                .toList();
    }

    public RoleListItemDTO criar(RoleCreateRequestDTO dto) {
        String codigo = dto.getCodigo().trim().toUpperCase(Locale.ROOT);
        if (roleRepository.existsByCodigo(codigo)) {
            throw new BusinessException("Já existe uma role com o código: " + codigo);
        }

        Role role = Role.builder()
                .codigo(codigo)
                .nome(dto.getNome().trim())
                .descricao(dto.getDescricao())
                .sistema(false)
                .permissoes(new HashSet<>())
                .build();
        role = roleRepository.save(role);

        return RoleListItemDTO.builder()
                .id(role.getId())
                .codigo(role.getCodigo())
                .nome(role.getNome())
                .descricao(role.getDescricao())
                .sistema(role.isSistema())
                .totalUsuarios(0)
                .build();
    }

    @Transactional(readOnly = true)
    public RoleDetailDTO buscarPorId(Long id) {
        Role role = roleRepository.findByIdWithPermissoes(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada com id: " + id));
        return toDetail(role);
    }

    public RoleDetailDTO atualizar(Long id, RoleUpdateRequestDTO dto) {
        Role role = roleRepository.findByIdWithPermissoes(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada com id: " + id));

        if (role.isSistema()) {
            throw new BusinessException("A role de sistema não pode ser editada");
        }

        Set<Permissao> permissoes = new HashSet<>(permissaoRepository.findAllById(dto.getPermissaoIds()));
        if (permissoes.size() != dto.getPermissaoIds().stream().distinct().count()) {
            throw new BusinessException("Uma ou mais permissões são inválidas");
        }

        role.setNome(dto.getNome().trim());
        role.setDescricao(dto.getDescricao());
        role.setPermissoes(permissoes);
        roleRepository.save(role);
        permissionCacheService.invalidate(role.getId());

        return toDetail(role);
    }

    public void apagar(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada com id: " + id));

        if (role.isSistema()) {
            throw new BusinessException("A role de sistema não pode ser apagada");
        }

        long users = usuarioRepository.countByRoleId(id);
        if (users > 0) {
            throw new BusinessException("Não é possível apagar uma role com utilizadores associados");
        }

        roleRepository.delete(role);
        permissionCacheService.invalidate(id);
    }

    @Transactional(readOnly = true)
    public PermissaoCatalogDTO catalogo() {
        Map<String, List<PermissaoItemDTO>> modulos = new LinkedHashMap<>();
        for (Permissao p : permissaoRepository.findAllByOrderByModuloAscAcaoAsc()) {
            modulos.computeIfAbsent(p.getModulo(), k -> new ArrayList<>())
                    .add(PermissaoItemDTO.builder()
                            .id(p.getId())
                            .codigo(p.getCodigo())
                            .acao(p.getAcao())
                            .metodo(p.getMetodo())
                            .path(p.getPathPattern())
                            .descricao(p.getDescricao())
                            .build());
        }
        return PermissaoCatalogDTO.builder().modulos(modulos).build();
    }

    private RoleDetailDTO toDetail(Role role) {
        Set<Long> grantedIds = role.getPermissoes().stream()
                .map(Permissao::getId)
                .collect(Collectors.toSet());

        Map<String, List<PermissaoGrantedDTO>> matriz = new LinkedHashMap<>();
        for (Permissao p : permissaoRepository.findAllByOrderByModuloAscAcaoAsc()) {
            matriz.computeIfAbsent(p.getModulo(), k -> new ArrayList<>())
                    .add(PermissaoGrantedDTO.builder()
                            .id(p.getId())
                            .codigo(p.getCodigo())
                            .acao(p.getAcao())
                            .metodo(p.getMetodo())
                            .path(p.getPathPattern())
                            .granted(role.isSistema() || grantedIds.contains(p.getId()))
                            .build());
        }

        return RoleDetailDTO.builder()
                .id(role.getId())
                .codigo(role.getCodigo())
                .nome(role.getNome())
                .descricao(role.getDescricao())
                .sistema(role.isSistema())
                .matriz(matriz)
                .build();
    }
}
