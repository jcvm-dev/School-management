package com.sga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para transferência de dados de Aluno.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Dados de um Aluno")
public class AlunoDTO {

    @Schema(description = "ID do aluno", example = "1")
    private Long id;

    @Schema(description = "Matrícula do aluno", example = "MAT001")
    private String matricula;

    @Schema(description = "Nome do aluno", example = "João Silva")
    private String nome;

    @Schema(description = "Email do aluno", example = "joao@example.com")
    private String email;

    @Schema(description = "Telefone do aluno", example = "(11) 98765-4321")
    private String telefone;

    @Schema(description = "Data de nascimento", example = "2000-01-15")
    private LocalDate dataNascimento;

    @Schema(description = "Endereço do aluno", example = "Rua das Flores, 123")
    private String endereco;

    @Schema(description = "Cidade", example = "São Paulo")
    private String cidade;

    @Schema(description = "Estado", example = "SP")
    private String estado;

    @Schema(description = "CEP", example = "01234-567")
    private String cep;

    @Schema(description = "CPF do aluno", example = "123.456.789-00")
    private String cpf;

    @Schema(description = "Status do aluno", example = "true")
    private Boolean ativo;

    @Schema(description = "Data de criação")
    private LocalDateTime criadoEm;

    @Schema(description = "Data de atualização")
    private LocalDateTime atualizadoEm;
}
