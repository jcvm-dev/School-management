package com.sga.service;

import com.sga.entity.Curso;
import com.sga.exception.DuplicateResourceException;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Serviço para gerenciamento de cursos.
 * Implementa a lógica de negócio para operações com cursos.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CursoService {

    private final CursoRepository cursoRepository;

    /**
     * Cria um novo curso.
     *
     * @param curso dados do curso a ser criado
     * @return curso criado
     * @throws DuplicateResourceException se o código já existe
     */
    public Curso criarCurso(Curso curso) {
        if (cursoRepository.existsByCodigo(curso.getCodigo())) {
            throw new DuplicateResourceException("Já existe um curso com o código: " + curso.getCodigo());
        }
        return cursoRepository.save(curso);
    }

    /**
     * Busca um curso pelo ID.
     *
     * @param id ID do curso
     * @return curso encontrado
     * @throws ResourceNotFoundException se o curso não existe
     */
    @Transactional(readOnly = true)
    public Curso obterCursoPorId(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado com ID: " + id));
    }

    /**
     * Busca um curso pelo código.
     *
     * @param codigo código do curso
     * @return curso encontrado
     * @throws ResourceNotFoundException se o curso não existe
     */
    @Transactional(readOnly = true)
    public Curso obterCursoPorCodigo(String codigo) {
        return cursoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado com código: " + codigo));
    }

    /**
     * Lista todos os cursos.
     *
     * @return lista de todos os cursos
     */
    @Transactional(readOnly = true)
    public List<Curso> listarTodosCursos() {
        return cursoRepository.findAll();
    }

    /**
     * Lista todos os cursos ativos.
     *
     * @return lista de cursos ativos
     */
    @Transactional(readOnly = true)
    public List<Curso> listarCursosAtivos() {
        return cursoRepository.findByAtivoTrue();
    }

    /**
     * Busca cursos pelo nome.
     *
     * @param nome nome ou parte do nome do curso
     * @return lista de cursos encontrados
     */
    @Transactional(readOnly = true)
    public List<Curso> buscarPorNome(String nome) {
        return cursoRepository.buscarPorNome(nome);
    }

    /**
     * Busca cursos pelo nível.
     *
     * @param nivel nível do curso
     * @return lista de cursos encontrados
     */
    @Transactional(readOnly = true)
    public List<Curso> buscarPorNivel(String nivel) {
        return cursoRepository.findByNivel(nivel);
    }

    /**
     * Atualiza os dados de um curso.
     *
     * @param id ID do curso
     * @param cursoAtualizado dados atualizados do curso
     * @return curso atualizado
     * @throws ResourceNotFoundException se o curso não existe
     */
    public Curso atualizarCurso(Long id, Curso cursoAtualizado) {
        Curso curso = obterCursoPorId(id);

        if (!curso.getCodigo().equals(cursoAtualizado.getCodigo()) &&
            cursoRepository.existsByCodigo(cursoAtualizado.getCodigo())) {
            throw new DuplicateResourceException("Já existe um curso com o código: " + cursoAtualizado.getCodigo());
        }

        curso.setNome(cursoAtualizado.getNome());
        curso.setDescricao(cursoAtualizado.getDescricao());
        curso.setCargaHoraria(cursoAtualizado.getCargaHoraria());
        curso.setNivel(cursoAtualizado.getNivel());
        curso.setAtivo(cursoAtualizado.getAtivo());

        return cursoRepository.save(curso);
    }

    /**
     * Deleta um curso.
     *
     * @param id ID do curso
     * @throws ResourceNotFoundException se o curso não existe
     */
    public void deletarCurso(Long id) {
        Curso curso = obterCursoPorId(id);
        cursoRepository.delete(curso);
    }

    /**
     * Desativa um curso (soft delete).
     *
     * @param id ID do curso
     * @throws ResourceNotFoundException se o curso não existe
     */
    public void desativarCurso(Long id) {
        Curso curso = obterCursoPorId(id);
        curso.setAtivo(false);
        cursoRepository.save(curso);
    }

    /**
     * Ativa um curso desativado.
     *
     * @param id ID do curso
     * @throws ResourceNotFoundException se o curso não existe
     */
    public void ativarCurso(Long id) {
        Curso curso = obterCursoPorId(id);
        curso.setAtivo(true);
        cursoRepository.save(curso);
    }
}
