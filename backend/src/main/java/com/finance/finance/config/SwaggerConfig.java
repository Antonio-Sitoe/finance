package com.finance.finance.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Finance API", version = "v1", description = "Documentação da API financeira", contact = @Contact(name = "Finance Team"), license = @License(name = "Proprietary")))
public class SwaggerConfig {
}
