package com.finance.finance.modules.roles.support;

import java.util.Locale;
import java.util.Set;

import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;

public final class PermissionCodes {

    public static final Set<String> PUBLIC_AUTH_PATHS = Set.of(
            "/api/auth/login",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/auth/refresh");

    public static final Set<String> AUTH_WITHOUT_PERMISSION = Set.of(
            "/api/auth/me",
            "/api/auth/change-password",
            "/api/auth/logout");

    private PermissionCodes() {
    }

    public static boolean isExcludedFromCatalog(String method, String path) {
        String key = method.toUpperCase(Locale.ROOT) + " " + normalizePath(path);
        if (PUBLIC_AUTH_PATHS.stream().anyMatch(p -> key.endsWith(p) || key.contains(p))) {
            return true;
        }
        String normalized = normalizePath(path);
        if (normalized.startsWith("/api/auth/")) {
            return true;
        }
        if (normalized.startsWith("/api/roles") || normalized.startsWith("/api/permissoes")) {
            return true;
        }
        if (normalized.startsWith("/swagger") || normalized.startsWith("/v3/api-docs")
                || normalized.startsWith("/actuator")) {
            return true;
        }
        return false;
    }

    public static boolean isAuthWithoutPermission(String path) {
        String normalized = normalizePath(path);
        return AUTH_WITHOUT_PERMISSION.contains(normalized)
                || normalized.startsWith("/api/auth/me");
    }

    public static String normalizePath(String path) {
        if (!StringUtils.hasText(path)) {
            return "";
        }
        String p = path.trim();
        if (p.length() > 1 && p.endsWith("/")) {
            p = p.substring(0, p.length() - 1);
        }
        return p;
    }

    public static String stripApiPrefix(String path) {
        String normalized = normalizePath(path);
        if (normalized.startsWith("/api/")) {
            return normalized.substring(4);
        }
        if ("/api".equals(normalized)) {
            return "/";
        }
        return normalized;
    }

    public static String firstSegment(String pathWithoutApi) {
        String p = pathWithoutApi.startsWith("/") ? pathWithoutApi.substring(1) : pathWithoutApi;
        if (!StringUtils.hasText(p)) {
            return "root";
        }
        int slash = p.indexOf('/');
        String segment = slash >= 0 ? p.substring(0, slash) : p;
        // remove path variables like {id}
        if (segment.startsWith("{")) {
            return "root";
        }
        return segment.toLowerCase(Locale.ROOT);
    }

    public static String moduloLabel(String segment) {
        if (!StringUtils.hasText(segment)) {
            return "Root";
        }
        return Character.toUpperCase(segment.charAt(0)) + segment.substring(1);
    }

    public static String buildCodigo(String pathWithApi, String javaMethodName) {
        String withoutApi = stripApiPrefix(pathWithApi);
        String segment = firstSegment(withoutApi);
        return segment + "." + javaMethodName;
    }

    public static String pickPrimaryPattern(RequestMappingInfo info) {
        if (info.getPathPatternsCondition() != null
                && !info.getPathPatternsCondition().getPatternValues().isEmpty()) {
            return info.getPathPatternsCondition().getPatternValues().iterator().next();
        }
        if (info.getPatternsCondition() != null
                && !info.getPatternsCondition().getPatterns().isEmpty()) {
            return info.getPatternsCondition().getPatterns().iterator().next();
        }
        return "";
    }

    public static String pickPrimaryHttpMethod(RequestMappingInfo info) {
        if (info.getMethodsCondition() == null || info.getMethodsCondition().getMethods().isEmpty()) {
            return "GET";
        }
        return info.getMethodsCondition().getMethods().iterator().next().name();
    }

    public static String codigoFromHandler(HandlerMethod handlerMethod, String pathWithApi) {
        return buildCodigo(pathWithApi, handlerMethod.getMethod().getName());
    }
}
