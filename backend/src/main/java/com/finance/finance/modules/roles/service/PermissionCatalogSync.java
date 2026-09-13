package com.finance.finance.modules.roles.service;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.finance.finance.modules.roles.model.Permissao;
import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.repository.PermissaoRepository;
import com.finance.finance.modules.roles.repository.RoleRepository;
import com.finance.finance.modules.roles.support.PermissionCodes;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PermissionCatalogSync implements ApplicationRunner {

    private final RequestMappingHandlerMapping handlerMapping;
    private final PermissaoRepository permissaoRepository;
    private final RoleRepository roleRepository;
    private final PermissionCacheService permissionCacheService;

    public PermissionCatalogSync(
            @Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping,
            PermissaoRepository permissaoRepository,
            RoleRepository roleRepository,
            PermissionCacheService permissionCacheService) {
        this.handlerMapping = handlerMapping;
        this.permissaoRepository = permissaoRepository;
        this.roleRepository = roleRepository;
        this.permissionCacheService = permissionCacheService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        int upserts = 0;
        for (var entry : handlerMapping.getHandlerMethods().entrySet()) {
            RequestMappingInfo info = entry.getKey();
            HandlerMethod handler = entry.getValue();

            String path = PermissionCodes.pickPrimaryPattern(info);
            String method = PermissionCodes.pickPrimaryHttpMethod(info);
            if (!path.startsWith("/api/")) {
                continue;
            }
            if (PermissionCodes.isExcludedFromCatalog(method, path)) {
                continue;
            }

            String pathPattern = PermissionCodes.stripApiPrefix(path);
            String segment = PermissionCodes.firstSegment(pathPattern);
            String acao = handler.getMethod().getName();
            String codigo = segment + "." + acao;
            String modulo = PermissionCodes.moduloLabel(segment);

            Permissao permissao = permissaoRepository.findByCodigo(codigo).orElseGet(Permissao::new);
            permissao.setCodigo(codigo);
            permissao.setModulo(modulo);
            permissao.setAcao(acao);
            permissao.setMetodo(method.toUpperCase(Locale.ROOT));
            permissao.setPathPattern(pathPattern);
            permissao.setDescricao(method.toUpperCase(Locale.ROOT) + " " + pathPattern);
            permissaoRepository.save(permissao);
            upserts++;
        }

        seedUserReadPermissions();
        permissionCacheService.invalidateAll();
        log.info("PermissionCatalogSync: {} permissões sincronizadas", upserts);
    }

    private void seedUserReadPermissions() {
        Role userRole = roleRepository.findByCodigo("USER").orElse(null);
        if (userRole == null || !userRole.getPermissoes().isEmpty()) {
            return;
        }

        Set<Permissao> leitura = new HashSet<>();
        for (Permissao p : permissaoRepository.findAll()) {
            String acao = p.getAcao().toLowerCase(Locale.ROOT);
            String modulo = p.getModulo().toLowerCase(Locale.ROOT);
            if (modulo.contains("usuario") || modulo.contains("role") || modulo.contains("permiss")) {
                continue;
            }
            if (acao.contains("find") || acao.contains("list") || acao.contains("buscar")
                    || acao.contains("resumo") || acao.contains("analytics")
                    || acao.contains("dashboard") || acao.contains("get")) {
                leitura.add(p);
            }
        }
        userRole.setPermissoes(leitura);
        roleRepository.save(userRole);
        log.info("PermissionCatalogSync: role USER seed com {} permissões de leitura", leitura.size());
    }
}
