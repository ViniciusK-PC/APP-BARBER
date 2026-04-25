package com.barber.infrastructure.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Barber App API",
                version = "1.0.0",
                description = "API REST para aplicativo de barbearia com Clean Architecture",
                contact = @Contact(
                        name = "Barber App Team",
                        email = "contato@barberapp.com"
                )
        ),
        servers = {
                @Server(url = "http://localhost:8080/api", description = "Servidor Local"),
                @Server(url = "https://app-barber-jlna.onrender.com/api", description = "Servidor Produção")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
