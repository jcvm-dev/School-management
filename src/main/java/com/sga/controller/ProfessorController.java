package com.sga.controller;

import com.sga.entity.Professor;
import com.sga.service.ProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller para gerenciamento de professores.
 * Fornece endpoints REST para operações CRUD com professores.
 */
@RestController
@RequestMapping("/professores")
@RequiredArgsConstructor
@Tag(name = "Professores", description = "API para gerenciamento de professores")
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping
    @Operation(summary = "Criar novo professor", description = "Cria um novo professor no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Professor criado com sucesso"),
        @ApiResponse(responseCode = "409", description = "Professor já existe")
    })
    public ResponseEntity<Professor> criarProfessor(@RequestBody Professor professor) {
        Professor professorSalvo = professorService.criarProfessor(professor);
        return ResponseEntity.status(HttpStatus.CREATED).body(professorSalvo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter professor por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Professor encontrado"),
        @ApiResponse(responseCode = "404", description = "Professor não encontrado")
    })
    public ResponseEntity<Professor> obterProfessorPorId(@PathVariable Long id) {
        Professor professor = professorService.obterProfessorPorId(id);
        return ResponseEntity.ok(professor);
    }

    @GetMapping("/matricula/{matricula}")
    @Operation(summary = "Obter professor por matrícula")
    public ResponseEntity<Professor> obterProfessorPorMatricula(@PathVariable String matricula) {
        Professor professor = professorService.obterProfessorPorMatricula(matricula);
        return ResponseEntity.ok(professor);
    }

    @GetMapping
    @Operation(summary = "Listar todos os professores")
    public ResponseEntity<List<Professor>> listarTodosProfessores() {
        List<Professor> professores = professorService.listarTodosProfessores();
        return ResponseEntity.ok(professores);
    }

    @GetMapping("/ativos")
    @Operation(summary = "Listar professores ativos")
    public ResponseEntity<List<Professor>> listarProfessoresAtivos() {
        List<Professor> professores = professorService.listarProfessoresAtivos();
        return ResponseEntity.ok(professores);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar professores por nome")
    public ResponseEntity<List<Professor>> buscarPorNome(@RequestParam String nome) {
        List<Professor> professores = professorService.buscarPorNome(nome);
        return ResponseEntity.ok(professores);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar professor")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Professor atualizado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Professor não encontrado")
    })
    public ResponseEntity<Professor> atualizarProfessor(@PathVariable Long id, @RequestBody Professor professor) {
        Professor professorAtualizado = professorService.atualizarProfessor(id, professor);
        return ResponseEntity.ok(professorAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar professor")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Professor deletado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Professor não encontrado")
    })
    public ResponseEntity<Void> deletarProfessor(@PathVariable Long id) {
        professorService.deletarProfessor(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar professor")
    public ResponseEntity<Void> desativarProfessor(@PathVariable Long id) {
        professorService.desativarProfessor(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Ativar professor")
    public ResponseEntity<Void> ativarProfessor(@PathVariable Long id) {
        professorService.ativarProfessor(id);
        return ResponseEntity.noContent().build();
    }
}
