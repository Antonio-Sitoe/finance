package com.finance.finance.modules.auth.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import jakarta.servlet.FilterChain;

class AuthRateLimitFilterTest {

    @Test
    void bloqueiaAposCincoTentativasDeLogin() throws Exception {
        AuthRateLimitFilter filter = new AuthRateLimitFilter();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr("127.0.0.1");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
        }
        verify(chain, times(5)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());

        MockHttpServletRequest blocked = new MockHttpServletRequest("POST", "/api/auth/login");
        blocked.setRemoteAddr("127.0.0.1");
        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();
        filter.doFilter(blocked, blockedResponse, chain);

        assertEquals(429, blockedResponse.getStatus());
        verify(chain, times(5)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }
}
