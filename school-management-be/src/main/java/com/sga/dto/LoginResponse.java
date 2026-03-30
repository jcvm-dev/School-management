package com.sga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de autenticação.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Resposta de autenticação com token JWT")
public class LoginResponse {

    @Schema(description = "Token JWT de acesso", example = "eyJhbGciOiJIUzUxMiJ9...")
    private String token;

    @Schema(description = "Tipo de token", example = "Bearer")
    private String tokenType;

    @Schema(description = "ID do usuário", example = "1")
    private Long userId;

    @Schema(description = "Email do usuário", example = "usuario@example.com")
    private String email;

    @Schema(description = "Nome do usuário", example = "João Silva")
    private String nome;

    @Schema(description = "Tipo do usuário", example = "ADMINISTRADOR")
    private String tipo;

    @Schema(description = "Indica se a senha é temporária e deve ser alterada", example = "false")
    private Boolean senhaTemporaria;

    @Schema(description = "Tempo de expiração do token em milissegundos", example = "86400000")
    private Long expiresIn;
}
