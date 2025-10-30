package com.sga.controller;

import com.sga.entity.Nota;
import com.sga.service.NotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * Controller para gerenciamento de notas.
 * Fornece endpoints REST para operações CRUD com notas.
 */
@RestController
@RequestMapping("/notas")
@RequiredArgsConstructor
@Tag(name = "Notas", description = "API para gerenciamento de notas")
public class NotaController {

    private final NotaService notaService;

    @PostMapping
    @Operation(summary = "Criar nova nota")
    public ResponseEntity<Nota> criarNota(@RequestBody Nota nota) {
        Nota notaSalva = notaService.criarNota(nota);
        return ResponseEntity.status(HttpStatus.CREATED).body(notaSalva);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter nota por ID")
    public ResponseEntity<Nota> obterNotaPorId(@PathVariable Long id) {
        Nota nota = notaService.obterNotaPorId(id);
        return ResponseEntity.ok(nota);
    }

    @GetMapping
    @Operation(summary = "Listar todas as notas")
    public ResponseEntity<List<Nota>> listarTodasNotas() {
        List<Nota> notas = notaService.listarTodasNotas();
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/aluno/{alunoId}")
    @Operation(summary = "Listar notas de um aluno")
    public ResponseEntity<List<Nota>> listarNotasPorAluno(@PathVariable Long alunoId) {
        List<Nota> notas = notaService.listarNotasPorAluno(alunoId);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/turma/{turmaId}")
    @Operation(summary = "Listar notas de uma turma")
    public ResponseEntity<List<Nota>> listarNotasPorTurma(@PathVariable Long turmaId) {
        List<Nota> notas = notaService.listarNotasPorTurma(turmaId);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}")
    @Operation(summary = "Listar notas de um aluno em uma turma")
    public ResponseEntity<List<Nota>> listarNotasPorAlunoETurma(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        List<Nota> notas = notaService.listarNotasPorAlunoETurma(alunoId, turmaId);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/avaliacao/{avaliacao}")
    @Operation(summary = "Buscar notas por avaliação")
    public ResponseEntity<List<Nota>> buscarPorAvaliacao(@PathVariable String avaliacao) {
        List<Nota> notas = notaService.buscarPorAvaliacao(avaliacao);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}/media")
    @Operation(summary = "Calcular média de notas de um aluno em uma turma")
    public ResponseEntity<BigDecimal> calcularMediaAluno(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        BigDecimal media = notaService.calcularMediaAluno(alunoId, turmaId);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/turma/{turmaId}/media")
    @Operation(summary = "Calcular média de notas de uma turma")
    public ResponseEntity<BigDecimal> calcularMediaTurma(@PathVariable Long turmaId) {
        BigDecimal media = notaService.calcularMediaTurma(turmaId);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/turma/{turmaId}/maxima")
    @Operation(summary = "Encontrar nota máxima de uma turma")
    public ResponseEntity<BigDecimal> encontrarNotaMaxima(@PathVariable Long turmaId) {
        BigDecimal notaMaxima = notaService.encontrarNotaMaxima(turmaId);
        return ResponseEntity.ok(notaMaxima);
    }

    @GetMapping("/turma/{turmaId}/minima")
    @Operation(summary = "Encontrar nota mínima de uma turma")
    public ResponseEntity<BigDecimal> encontrarNotaMinima(@PathVariable Long turmaId) {
        BigDecimal notaMinima = notaService.encontrarNotaMinima(turmaId);
        return ResponseEntity.ok(notaMinima);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar nota")
    public ResponseEntity<Nota> atualizarNota(@PathVariable Long id, @RequestBody Nota nota) {
        Nota notaAtualizada = notaService.atualizarNota(id, nota);
        return ResponseEntity.ok(notaAtualizada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar nota")
    public ResponseEntity<Void> deletarNota(@PathVariable Long id) {
        notaService.deletarNota(id);
        return ResponseEntity.noContent().build();
    }
}
