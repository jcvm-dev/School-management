package com.sga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de login.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados para autenticação")
public class LoginRequest {

    @Schema(description = "Email do usuário", example = "usuario@example.com")
    private String email;

    @Schema(description = "Senha do usuário", example = "senha123")
    private String senha;
}
