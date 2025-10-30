package com.sga.controller;

import com.sga.dto.AlunoDTO;
import com.sga.entity.Aluno;
import com.sga.service.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller para gerenciamento de alunos.
 * Fornece endpoints REST para operações CRUD com alunos.
 */
@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
@Tag(name = "Alunos", description = "API para gerenciamento de alunos")
public class AlunoController {

    private final AlunoService alunoService;

    /**
     * Cria um novo aluno.
     *
     * @param alunoDTO dados do aluno a ser criado
     * @return aluno criado com status 201
     */
    @PostMapping
    @Operation(summary = "Criar novo aluno", description = "Cria um novo aluno no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Aluno criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "409", description = "Aluno já existe")
    })
    public ResponseEntity<AlunoDTO> criarAluno(@RequestBody AlunoDTO alunoDTO) {
        Aluno aluno = convertToEntity(alunoDTO);
        Aluno alunoSalvo = alunoService.criarAluno(aluno);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(alunoSalvo));
    }

    /**
     * Obtém um aluno pelo ID.
     *
     * @param id ID do aluno
     * @return aluno encontrado
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obter aluno por ID", description = "Retorna um aluno específico pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<AlunoDTO> obterAlunoPorId(
            @Parameter(description = "ID do aluno")
            @PathVariable Long id) {
        Aluno aluno = alunoService.obterAlunoPorId(id);
        return ResponseEntity.ok(convertToDTO(aluno));
    }

    /**
     * Obtém um aluno pela matrícula.
     *
     * @param matricula matrícula do aluno
     * @return aluno encontrado
     */
    @GetMapping("/matricula/{matricula}")
    @Operation(summary = "Obter aluno por matrícula", description = "Retorna um aluno específico pela matrícula")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<AlunoDTO> obterAlunoPorMatricula(
            @Parameter(description = "Matrícula do aluno")
            @PathVariable String matricula) {
        Aluno aluno = alunoService.obterAlunoPorMatricula(matricula);
        return ResponseEntity.ok(convertToDTO(aluno));
    }

    /**
     * Lista todos os alunos.
     *
     * @return lista de alunos
     */
    @GetMapping
    @Operation(summary = "Listar todos os alunos", description = "Retorna uma lista de todos os alunos")
    @ApiResponse(responseCode = "200", description = "Lista de alunos retornada com sucesso")
    public ResponseEntity<List<AlunoDTO>> listarTodosAlunos() {
        List<Aluno> alunos = alunoService.listarTodosAlunos();
        List<AlunoDTO> alunosDTO = alunos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alunosDTO);
    }

    /**
     * Lista todos os alunos ativos.
     *
     * @return lista de alunos ativos
     */
    @GetMapping("/ativos")
    @Operation(summary = "Listar alunos ativos", description = "Retorna uma lista de todos os alunos ativos")
    @ApiResponse(responseCode = "200", description = "Lista de alunos ativos retornada com sucesso")
    public ResponseEntity<List<AlunoDTO>> listarAlunosAtivos() {
        List<Aluno> alunos = alunoService.listarAlunosAtivos();
        List<AlunoDTO> alunosDTO = alunos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alunosDTO);
    }

    /**
     * Busca alunos pelo nome.
     *
     * @param nome nome ou parte do nome do aluno
     * @return lista de alunos encontrados
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar alunos por nome", description = "Retorna alunos que correspondem ao nome fornecido")
    @ApiResponse(responseCode = "200", description = "Lista de alunos encontrados")
    public ResponseEntity<List<AlunoDTO>> buscarPorNome(
            @Parameter(description = "Nome ou parte do nome do aluno")
            @RequestParam String nome) {
        List<Aluno> alunos = alunoService.buscarPorNome(nome);
        List<AlunoDTO> alunosDTO = alunos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alunosDTO);
    }

    /**
     * Atualiza um aluno.
     *
     * @param id ID do aluno
     * @param alunoDTO dados atualizados do aluno
     * @return aluno atualizado
     */
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar aluno", description = "Atualiza os dados de um aluno existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aluno atualizado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<AlunoDTO> atualizarAluno(
            @Parameter(description = "ID do aluno")
            @PathVariable Long id,
            @RequestBody AlunoDTO alunoDTO) {
        Aluno aluno = convertToEntity(alunoDTO);
        Aluno alunoAtualizado = alunoService.atualizarAluno(id, aluno);
        return ResponseEntity.ok(convertToDTO(alunoAtualizado));
    }

    /**
     * Deleta um aluno.
     *
     * @param id ID do aluno
     * @return resposta sem conteúdo
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar aluno", description = "Remove um aluno do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Aluno deletado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<Void> deletarAluno(
            @Parameter(description = "ID do aluno")
            @PathVariable Long id) {
        alunoService.deletarAluno(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Desativa um aluno.
     *
     * @param id ID do aluno
     * @return resposta sem conteúdo
     */
    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar aluno", description = "Desativa um aluno (soft delete)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Aluno desativado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<Void> desativarAluno(
            @Parameter(description = "ID do aluno")
            @PathVariable Long id) {
        alunoService.desativarAluno(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Ativa um aluno desativado.
     *
     * @param id ID do aluno
     * @return resposta sem conteúdo
     */
    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Ativar aluno", description = "Ativa um aluno que estava desativado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Aluno ativado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<Void> ativarAluno(
            @Parameter(description = "ID do aluno")
            @PathVariable Long id) {
        alunoService.ativarAluno(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Converte uma entidade Aluno para DTO.
     *
     * @param aluno entidade Aluno
     * @return AlunoDTO
     */
    private AlunoDTO convertToDTO(Aluno aluno) {
        return AlunoDTO.builder()
                .id(aluno.getId())
                .matricula(aluno.getMatricula())
                .nome(aluno.getNome())
                .email(aluno.getEmail())
                .telefone(aluno.getTelefone())
                .dataNascimento(aluno.getDataNascimento())
                .endereco(aluno.getEndereco())
                .cidade(aluno.getCidade())
                .estado(aluno.getEstado())
                .cep(aluno.getCep())
                .cpf(aluno.getCpf())
                .ativo(aluno.getAtivo())
                .criadoEm(aluno.getCriadoEm())
                .atualizadoEm(aluno.getAtualizadoEm())
                .build();
    }

    /**
     * Converte um DTO AlunoDTO para entidade Aluno.
     *
     * @param alunoDTO AlunoDTO
     * @return entidade Aluno
     */
    private Aluno convertToEntity(AlunoDTO alunoDTO) {
        return Aluno.builder()
                .id(alunoDTO.getId())
                .matricula(alunoDTO.getMatricula())
                .nome(alunoDTO.getNome())
                .email(alunoDTO.getEmail())
                .telefone(alunoDTO.getTelefone())
                .dataNascimento(alunoDTO.getDataNascimento())
                .endereco(alunoDTO.getEndereco())
                .cidade(alunoDTO.getCidade())
                .estado(alunoDTO.getEstado())
                .cep(alunoDTO.getCep())
                .cpf(alunoDTO.getCpf())
                .ativo(alunoDTO.getAtivo() != null ? alunoDTO.getAtivo() : true)
                .build();
    }
}
