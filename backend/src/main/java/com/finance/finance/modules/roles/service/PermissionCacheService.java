package com.finance.finance.modules.roles.service;

import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.repository.PermissaoRepository;
import com.finance.finance.modules.roles.repository.RoleRepository;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;

@Service
public class PermissionCacheService {

    private final PermissaoRepository permissaoRepository;
    private final RoleRepository roleRepository;
    private final LoadingCache<Long, Set<String>> cache;

    public PermissionCacheService(PermissaoRepository permissaoRepository, RoleRepository roleRepository) {
        this.permissaoRepository = permissaoRepository;
        this.roleRepository = roleRepository;
        this.cache = Caffeine.newBuilder()
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .maximumSize(500)
                .build(this::loadCodigos);
    }

    private Set<String> loadCodigos(Long roleId) {
        return permissaoRepository.findCodigosByRoleId(roleId).stream().collect(Collectors.toSet());
    }

    public Set<String> getCodigos(Long roleId) {
        return cache.get(roleId);
    }

    public boolean isSistema(Long roleId) {
        return roleRepository.findById(roleId).map(Role::isSistema).orElse(false);
    }

    public void invalidate(Long roleId) {
        cache.invalidate(roleId);
    }

    public void invalidateAll() {
        cache.invalidateAll();
    }
}
