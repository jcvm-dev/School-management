package com.sga.controller;

import com.sga.entity.Turma;
import com.sga.service.TurmaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller para gerenciamento de turmas.
 * Fornece endpoints REST para operações CRUD com turmas.
 */
@RestController
@RequestMapping("/turmas")
@RequiredArgsConstructor
@Tag(name = "Turmas", description = "API para gerenciamento de turmas")
public class TurmaController {

    private final TurmaService turmaService;

    @PostMapping
    @Operation(summary = "Criar nova turma")
    public ResponseEntity<Turma> criarTurma(@RequestBody Turma turma) {
        Turma turmaSalva = turmaService.criarTurma(turma);
        return ResponseEntity.status(HttpStatus.CREATED).body(turmaSalva);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter turma por ID")
    public ResponseEntity<Turma> obterTurmaPorId(@PathVariable Long id) {
        Turma turma = turmaService.obterTurmaPorId(id);
        return ResponseEntity.ok(turma);
    }

    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Obter turma por código")
    public ResponseEntity<Turma> obterTurmaPorCodigo(@PathVariable String codigo) {
        Turma turma = turmaService.obterTurmaPorCodigo(codigo);
        return ResponseEntity.ok(turma);
    }

    @GetMapping
    @Operation(summary = "Listar todas as turmas")
    public ResponseEntity<List<Turma>> listarTodasTurmas() {
        List<Turma> turmas = turmaService.listarTodasTurmas();
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/ativas")
    @Operation(summary = "Listar turmas ativas")
    public ResponseEntity<List<Turma>> listarTurmasAtivas() {
        List<Turma> turmas = turmaService.listarTurmasAtivas();
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/curso/{cursoId}")
    @Operation(summary = "Listar turmas por curso")
    public ResponseEntity<List<Turma>> buscarTurmasPorCurso(@PathVariable Long cursoId) {
        List<Turma> turmas = turmaService.buscarTurmasPorCurso(cursoId);
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/professor/{professorId}")
    @Operation(summary = "Listar turmas por professor")
    public ResponseEntity<List<Turma>> buscarTurmasPorProfessor(@PathVariable Long professorId) {
        List<Turma> turmas = turmaService.buscarTurmasPorProfessor(professorId);
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar turmas por nome")
    public ResponseEntity<List<Turma>> buscarPorNome(@RequestParam String nome) {
        List<Turma> turmas = turmaService.buscarPorNome(nome);
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/periodo/{periodo}")
    @Operation(summary = "Buscar turmas por período")
    public ResponseEntity<List<Turma>> buscarPorPeriodo(@PathVariable String periodo) {
        List<Turma> turmas = turmaService.buscarPorPeriodo(periodo);
        return ResponseEntity.ok(turmas);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar turma")
    public ResponseEntity<Turma> atualizarTurma(@PathVariable Long id, @RequestBody Turma turma) {
        Turma turmaAtualizada = turmaService.atualizarTurma(id, turma);
        return ResponseEntity.ok(turmaAtualizada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar turma")
    public ResponseEntity<Void> deletarTurma(@PathVariable Long id) {
        turmaService.deletarTurma(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar turma")
    public ResponseEntity<Void> desativarTurma(@PathVariable Long id) {
        turmaService.desativarTurma(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Ativar turma")
    public ResponseEntity<Void> ativarTurma(@PathVariable Long id) {
        turmaService.ativarTurma(id);
        return ResponseEntity.noContent().build();
    }
}
