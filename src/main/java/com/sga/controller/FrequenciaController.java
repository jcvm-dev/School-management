package com.sga.controller;

import com.sga.entity.Frequencia;
import com.sga.service.FrequenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Controller para gerenciamento de frequências.
 * Fornece endpoints REST para operações CRUD com frequências.
 */
@RestController
@RequestMapping("/frequencias")
@RequiredArgsConstructor
@Tag(name = "Frequências", description = "API para gerenciamento de frequências")
public class FrequenciaController {

    private final FrequenciaService frequenciaService;

    @PostMapping
    @Operation(summary = "Criar novo registro de frequência")
    public ResponseEntity<Frequencia> criarFrequencia(@RequestBody Frequencia frequencia) {
        Frequencia frequenciaSalva = frequenciaService.criarFrequencia(frequencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(frequenciaSalva);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter frequência por ID")
    public ResponseEntity<Frequencia> obterFrequenciaPorId(@PathVariable Long id) {
        Frequencia frequencia = frequenciaService.obterFrequenciaPorId(id);
        return ResponseEntity.ok(frequencia);
    }

    @GetMapping
    @Operation(summary = "Listar todas as frequências")
    public ResponseEntity<List<Frequencia>> listarTodasFrequencias() {
        List<Frequencia> frequencias = frequenciaService.listarTodasFrequencias();
        return ResponseEntity.ok(frequencias);
    }

    @GetMapping("/aluno/{alunoId}")
    @Operation(summary = "Listar frequências de um aluno")
    public ResponseEntity<List<Frequencia>> listarFrequenciasPorAluno(@PathVariable Long alunoId) {
        List<Frequencia> frequencias = frequenciaService.listarFrequenciasPorAluno(alunoId);
        return ResponseEntity.ok(frequencias);
    }

    @GetMapping("/turma/{turmaId}")
    @Operation(summary = "Listar frequências de uma turma")
    public ResponseEntity<List<Frequencia>> listarFrequenciasPorTurma(@PathVariable Long turmaId) {
        List<Frequencia> frequencias = frequenciaService.listarFrequenciasPorTurma(turmaId);
        return ResponseEntity.ok(frequencias);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}")
    @Operation(summary = "Listar frequências de um aluno em uma turma")
    public ResponseEntity<List<Frequencia>> listarFrequenciasPorAlunoETurma(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        List<Frequencia> frequencias = frequenciaService.listarFrequenciasPorAlunoETurma(alunoId, turmaId);
        return ResponseEntity.ok(frequencias);
    }

    @GetMapping("/turma/{turmaId}/data/{dataAula}")
    @Operation(summary = "Listar frequências de uma turma em uma data específica")
    public ResponseEntity<List<Frequencia>> listarFrequenciasPorTurmaEData(
            @PathVariable Long turmaId,
            @PathVariable String dataAula) {
        List<Frequencia> frequencias = frequenciaService.listarFrequenciasPorTurmaEData(
                turmaId, LocalDate.parse(dataAula));
        return ResponseEntity.ok(frequencias);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}/taxa-presenca")
    @Operation(summary = "Calcular taxa de presença de um aluno em uma turma")
    public ResponseEntity<Double> calcularTaxaPresenca(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        Double taxa = frequenciaService.calcularTaxaPresenca(alunoId, turmaId);
        return ResponseEntity.ok(taxa);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}/presenças")
    @Operation(summary = "Contar presenças de um aluno em uma turma")
    public ResponseEntity<Long> contarPresencas(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        long count = frequenciaService.contarPresencas(alunoId, turmaId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}/ausências")
    @Operation(summary = "Contar ausências de um aluno em uma turma")
    public ResponseEntity<Long> contarAusencias(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        long count = frequenciaService.contarAusencias(alunoId, turmaId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/aluno/{alunoId}/turma/{turmaId}/faltas-justificadas")
    @Operation(summary = "Contar faltas justificadas de um aluno em uma turma")
    public ResponseEntity<Long> contarFaltasJustificadas(
            @PathVariable Long alunoId,
            @PathVariable Long turmaId) {
        long count = frequenciaService.contarFaltasJustificadas(alunoId, turmaId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Atualizar status de frequência")
    public ResponseEntity<Frequencia> atualizarStatusFrequencia(
            @PathVariable Long id,
            @RequestParam Frequencia.StatusPresenca status) {
        Frequencia frequenciaAtualizada = frequenciaService.atualizarStatusFrequencia(id, status);
        return ResponseEntity.ok(frequenciaAtualizada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar frequência")
    public ResponseEntity<Frequencia> atualizarFrequencia(@PathVariable Long id, @RequestBody Frequencia frequencia) {
        Frequencia frequenciaAtualizada = frequenciaService.atualizarFrequencia(id, frequencia);
        return ResponseEntity.ok(frequenciaAtualizada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar frequência")
    public ResponseEntity<Void> deletarFrequencia(@PathVariable Long id) {
        frequenciaService.deletarFrequencia(id);
        return ResponseEntity.noContent().build();
    }
}
