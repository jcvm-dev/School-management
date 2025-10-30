package com.sga.controller;

import com.sga.entity.Curso;
import com.sga.service.CursoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller para gerenciamento de cursos.
 * Fornece endpoints REST para operações CRUD com cursos.
 */
@RestController
@RequestMapping("/cursos")
@RequiredArgsConstructor
@Tag(name = "Cursos", description = "API para gerenciamento de cursos")
public class CursoController {

    private final CursoService cursoService;

    @PostMapping
    @Operation(summary = "Criar novo curso")
    public ResponseEntity<Curso> criarCurso(@RequestBody Curso curso) {
        Curso cursoSalvo = cursoService.criarCurso(curso);
        return ResponseEntity.status(HttpStatus.CREATED).body(cursoSalvo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter curso por ID")
    public ResponseEntity<Curso> obterCursoPorId(@PathVariable Long id) {
        Curso curso = cursoService.obterCursoPorId(id);
        return ResponseEntity.ok(curso);
    }

    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Obter curso por código")
    public ResponseEntity<Curso> obterCursoPorCodigo(@PathVariable String codigo) {
        Curso curso = cursoService.obterCursoPorCodigo(codigo);
        return ResponseEntity.ok(curso);
    }

    @GetMapping
    @Operation(summary = "Listar todos os cursos")
    public ResponseEntity<List<Curso>> listarTodosCursos() {
        List<Curso> cursos = cursoService.listarTodosCursos();
        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/ativos")
    @Operation(summary = "Listar cursos ativos")
    public ResponseEntity<List<Curso>> listarCursosAtivos() {
        List<Curso> cursos = cursoService.listarCursosAtivos();
        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar cursos por nome")
    public ResponseEntity<List<Curso>> buscarPorNome(@RequestParam String nome) {
        List<Curso> cursos = cursoService.buscarPorNome(nome);
        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/nivel/{nivel}")
    @Operation(summary = "Buscar cursos por nível")
    public ResponseEntity<List<Curso>> buscarPorNivel(@PathVariable String nivel) {
        List<Curso> cursos = cursoService.buscarPorNivel(nivel);
        return ResponseEntity.ok(cursos);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar curso")
    public ResponseEntity<Curso> atualizarCurso(@PathVariable Long id, @RequestBody Curso curso) {
        Curso cursoAtualizado = cursoService.atualizarCurso(id, curso);
        return ResponseEntity.ok(cursoAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar curso")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id) {
        cursoService.deletarCurso(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar curso")
    public ResponseEntity<Void> desativarCurso(@PathVariable Long id) {
        cursoService.desativarCurso(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Ativar curso")
    public ResponseEntity<Void> ativarCurso(@PathVariable Long id) {
        cursoService.ativarCurso(id);
        return ResponseEntity.noContent().build();
    }
}
