package com.finance.finance.modules.usuario.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.roles.model.Role;
import com.finance.finance.modules.roles.repository.RoleRepository;
import com.finance.finance.modules.usuario.model.Usuario;
import com.finance.finance.modules.usuario.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceLastAdminTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario admin;

    @BeforeEach
    void setUp() {
        Role adminRole = Role.builder().id(1L).codigo("ADMIN").sistema(true).build();
        admin = new Usuario();
        admin.setId(1L);
        admin.setEmail("admin@finance.com");
        admin.setSituacao(Situacao.ATIVO);
        admin.setRole(adminRole);
    }

    @Test
    void naoPermiteDesactivarUltimoAdmin() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.countActiveAdminsExcluding(1L)).thenReturn(0L);

        assertThrows(BusinessException.class, () -> usuarioService.activarOuDesativar(1L));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void permiteDesactivarAdminSeHouverOutro() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.countActiveAdminsExcluding(1L)).thenReturn(1L);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        var res = usuarioService.activarOuDesativar(1L);
        assertEquals(Situacao.INATIVO, res.situacao());
    }
}
