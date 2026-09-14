package com.finance.finance.modules.roles.security;

import java.io.IOException;
import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.finance.finance.modules.roles.service.PermissionCacheService;
import com.finance.finance.modules.roles.support.PermissionCodes;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class PermissionAuthorizationFilter extends OncePerRequestFilter {

    private final RequestMappingHandlerMapping handlerMapping;
    private final PermissionCacheService permissionCacheService;
    private final UsuarioRepository usuarioRepository;

    public PermissionAuthorizationFilter(
            @Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping,
            PermissionCacheService permissionCacheService,
            UsuarioRepository usuarioRepository) {
        this.handlerMapping = handlerMapping;
        this.permissionCacheService = permissionCacheService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = PermissionCodes.normalizePath(request.getRequestURI());

        if (isPublicOrInfra(path) || isAuthWithoutPermissionCheck(path)) {
            chain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(String.valueOf(auth.getPrincipal()))) {
            chain.doFilter(request, response);
            return;
        }

        Long userId;
        try {
            userId = Long.valueOf(auth.getName());
        } catch (NumberFormatException ex) {
            chain.doFilter(request, response);
            return;
        }

        Usuario usuario = usuarioRepository.findByIdWithRole(userId).orElse(null);
        if (usuario == null || usuario.getRole() == null) {
            forbid(response, "Utilizador sem role");
            return;
        }

        if (usuario.getRole().isSistema()) {
            chain.doFilter(request, response);
            return;
        }

        if (path.startsWith("/api/roles") || path.startsWith("/api/permissoes")) {
            forbid(response, "Acesso restrito a administradores");
            return;
        }

        String codigo = resolveCodigo(request, path);
        if (codigo == null) {
            chain.doFilter(request, response);
            return;
        }

        Set<String> permissoes = permissionCacheService.getCodigos(usuario.getRole().getId());
        if (!permissoes.contains(codigo)) {
            forbid(response, "Sem permissão: " + codigo);
            return;
        }

        chain.doFilter(request, response);
    }

    private String resolveCodigo(HttpServletRequest request, String path) {
        try {
            HandlerExecutionChain executionChain = handlerMapping.getHandler(request);
            if (executionChain == null || !(executionChain.getHandler() instanceof HandlerMethod handlerMethod)) {
                return null;
            }
            return PermissionCodes.buildCodigo(path, handlerMethod.getMethod().getName());
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isPublicOrInfra(String path) {
        if (PermissionCodes.PUBLIC_AUTH_PATHS.contains(path)) {
            return true;
        }
        return path.startsWith("/swagger")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/actuator")
                || path.equals("/error");
    }

    private boolean isAuthWithoutPermissionCheck(String path) {
        return path.equals("/api/auth/me")
                || path.equals("/api/auth/change-password")
                || path.equals("/api/auth/logout");
    }

    private void forbid(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"" + message.replace("\"", "'") + "\"}");
    }
}
