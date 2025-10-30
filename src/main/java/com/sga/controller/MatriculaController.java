package com.sga.controller;

import com.sga.entity.Matricula;
import com.sga.service.MatriculaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller para gerenciamento de matrículas.
 * Fornece endpoints REST para operações CRUD com matrículas.
 */
@RestController
@RequestMapping("/matriculas")
@RequiredArgsConstructor
@Tag(name = "Matrículas", description = "API para gerenciamento de matrículas")
public class MatriculaController {

    private final MatriculaService matriculaService;

    @PostMapping
    @Operation(summary = "Criar nova matrícula")
    public ResponseEntity<Matricula> criarMatricula(@RequestBody Matricula matricula) {
        Matricula matriculaSalva = matriculaService.criarMatricula(matricula);
        return ResponseEntity.status(HttpStatus.CREATED).body(matriculaSalva);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter matrícula por ID")
    public ResponseEntity<Matricula> obterMatriculaPorId(@PathVariable Long id) {
        Matricula matricula = matriculaService.obterMatriculaPorId(id);
        return ResponseEntity.ok(matricula);
    }

    @GetMapping
    @Operation(summary = "Listar todas as matrículas")
    public ResponseEntity<List<Matricula>> listarTodasMatriculas() {
        List<Matricula> matriculas = matriculaService.listarTodasMatriculas();
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/aluno/{alunoId}")
    @Operation(summary = "Listar matrículas por aluno")
    public ResponseEntity<List<Matricula>> listarMatriculasPorAluno(@PathVariable Long alunoId) {
        List<Matricula> matriculas = matriculaService.listarMatriculasPorAluno(alunoId);
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/turma/{turmaId}")
    @Operation(summary = "Listar matrículas por turma")
    public ResponseEntity<List<Matricula>> listarMatriculasPorTurma(@PathVariable Long turmaId) {
        List<Matricula> matriculas = matriculaService.listarMatriculasPorTurma(turmaId);
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/aluno/{alunoId}/ativas")
    @Operation(summary = "Listar matrículas ativas de um aluno")
    public ResponseEntity<List<Matricula>> listarMatriculasAtivasPorAluno(@PathVariable Long alunoId) {
        List<Matricula> matriculas = matriculaService.listarMatriculasAtivasPorAluno(alunoId);
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/turma/{turmaId}/ativas")
    @Operation(summary = "Listar matrículas ativas de uma turma")
    public ResponseEntity<List<Matricula>> listarMatriculasAtivasPorTurma(@PathVariable Long turmaId) {
        List<Matricula> matriculas = matriculaService.listarMatriculasAtivasPorTurma(turmaId);
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/turma/{turmaId}/contar")
    @Operation(summary = "Contar matrículas ativas em uma turma")
    public ResponseEntity<Long> contarMatriculasAtivasPorTurma(@PathVariable Long turmaId) {
        long count = matriculaService.contarMatriculasAtivasPorTurma(turmaId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Atualizar status da matrícula")
    public ResponseEntity<Matricula> atualizarStatusMatricula(
            @PathVariable Long id,
            @RequestParam Matricula.StatusMatricula status) {
        Matricula matriculaAtualizada = matriculaService.atualizarStatusMatricula(id, status);
        return ResponseEntity.ok(matriculaAtualizada);
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar matrícula")
    public ResponseEntity<Matricula> cancelarMatricula(@PathVariable Long id) {
        Matricula matriculaCancelada = matriculaService.cancelarMatricula(id);
        return ResponseEntity.ok(matriculaCancelada);
    }

    @PatchMapping("/{id}/trancar")
    @Operation(summary = "Trancar matrícula")
    public ResponseEntity<Matricula> trancarMatricula(@PathVariable Long id) {
        Matricula matriculaTrancada = matriculaService.trancarMatricula(id);
        return ResponseEntity.ok(matriculaTrancada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar matrícula")
    public ResponseEntity<Void> deletarMatricula(@PathVariable Long id) {
        matriculaService.deletarMatricula(id);
        return ResponseEntity.noContent().build();
    }
}
