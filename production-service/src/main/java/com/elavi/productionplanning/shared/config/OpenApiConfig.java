package com.elavi.productionplanning.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mercury Flooring Production API")
                        .version("1.0")
                        .description("API documentation for the Mercury Flooring Production Planning Service.")
                        .contact(new Contact()
                                .name("Mercury Flooring Team")
                                .email("dev@mercuryflooring.com"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
