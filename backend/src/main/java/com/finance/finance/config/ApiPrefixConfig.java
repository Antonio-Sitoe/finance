package com.finance.finance.config;

import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.bind.annotation.RestController;

@Configuration
public class ApiPrefixConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/api",
                handlerType -> AnnotatedElementUtils.hasAnnotation(handlerType, RestController.class));
    }
}
