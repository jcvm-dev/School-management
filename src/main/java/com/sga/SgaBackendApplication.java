package com.sga;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Classe principal da aplicação Spring Boot para o Sistema de Gerenciamento de Alunos (SGA).
 * Esta aplicação fornece uma API RESTful completa para gerenciamento administrativo
 * de instituições educacionais, incluindo gestão de alunos, professores, cursos, turmas,
 * matrículas, notas e frequências.
 */
@SpringBootApplication
public class SgaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SgaBackendApplication.class, args);
    }

    /**
     * Configura a documentação OpenAPI (Swagger) da aplicação.
     * Define informações gerais sobre a API, incluindo título, descrição,
     * versão, contato e licença.
     *
     * @return configuração OpenAPI personalizada
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sistema de Gerenciamento de Alunos (SGA)")
                        .description("API RESTful completa para gerenciamento administrativo de instituições educacionais. " +
                                "Desenvolvida com Spring Boot, PostgreSQL e Docker.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Jefferson Monteiro")
                                .url("https://jcvm.site"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
