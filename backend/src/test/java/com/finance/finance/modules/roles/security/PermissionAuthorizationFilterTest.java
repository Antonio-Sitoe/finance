package com.finance.finance.modules.roles.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.service.PermissionCacheService;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;

class PermissionAuthorizationFilterTest {

    private RequestMappingHandlerMapping handlerMapping;
    private PermissionCacheService permissionCacheService;
    private UsuarioRepository usuarioRepository;
    private PermissionAuthorizationFilter filter;

    @BeforeEach
    void setUp() {
        handlerMapping = mock(RequestMappingHandlerMapping.class);
        permissionCacheService = mock(PermissionCacheService.class);
        usuarioRepository = mock(UsuarioRepository.class);
        filter = new PermissionAuthorizationFilter(handlerMapping, permissionCacheService, usuarioRepository);
        SecurityContextHolder.clearContext();
    }

    @Test
    void adminSistemaPassaSemVerificarPermissao() throws Exception {
        Role admin = Role.builder().id(1L).codigo("ADMIN").sistema(true).build();
        Usuario u = new Usuario();
        u.setId(1L);
        u.setRole(admin);
        when(usuarioRepository.findByIdWithRole(1L)).thenReturn(Optional.of(u));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("1", null, java.util.List.of()));

        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/clientes");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);
        verify(chain).doFilter(request, response);
    }

    @Test
    void semPermissaoDevolve403() throws Exception {
        Role userRole = Role.builder().id(2L).codigo("USER").sistema(false).build();
        Usuario u = new Usuario();
        u.setId(5L);
        u.setRole(userRole);
        when(usuarioRepository.findByIdWithRole(5L)).thenReturn(Optional.of(u));
        when(permissionCacheService.getCodigos(2L)).thenReturn(Set.of("clientes.listar"));

        HandlerMethod handlerMethod = mock(HandlerMethod.class);
        when(handlerMethod.getMethod()).thenReturn(DummyController.class.getDeclaredMethod("criar"));
        when(handlerMapping.getHandler(any())).thenReturn(new HandlerExecutionChain(handlerMethod));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("5", null, java.util.List.of()));

        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/clientes");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);
        assertEquals(403, response.getStatus());
    }

    static class DummyController {
        public void criar() {
        }
    }
}
