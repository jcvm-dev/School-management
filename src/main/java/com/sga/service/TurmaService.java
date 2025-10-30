package com.sga.service;

import com.sga.entity.Turma;
import com.sga.exception.DuplicateResourceException;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Serviço para gerenciamento de turmas.
 * Implementa a lógica de negócio para operações com turmas.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TurmaService {

    private final TurmaRepository turmaRepository;

    /**
     * Cria uma nova turma.
     *
     * @param turma dados da turma a ser criada
     * @return turma criada
     * @throws DuplicateResourceException se o código já existe
     */
    public Turma criarTurma(Turma turma) {
        if (turmaRepository.existsByCodigo(turma.getCodigo())) {
            throw new DuplicateResourceException("Já existe uma turma com o código: " + turma.getCodigo());
        }
        return turmaRepository.save(turma);
    }

    /**
     * Busca uma turma pelo ID.
     *
     * @param id ID da turma
     * @return turma encontrada
     * @throws ResourceNotFoundException se a turma não existe
     */
    @Transactional(readOnly = true)
    public Turma obterTurmaPorId(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com ID: " + id));
    }

    /**
     * Busca uma turma pelo código.
     *
     * @param codigo código da turma
     * @return turma encontrada
     * @throws ResourceNotFoundException se a turma não existe
     */
    @Transactional(readOnly = true)
    public Turma obterTurmaPorCodigo(String codigo) {
        return turmaRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com código: " + codigo));
    }

    /**
     * Lista todas as turmas.
     *
     * @return lista de todas as turmas
     */
    @Transactional(readOnly = true)
    public List<Turma> listarTodasTurmas() {
        return turmaRepository.findAll();
    }

    /**
     * Lista todas as turmas ativas.
     *
     * @return lista de turmas ativas
     */
    @Transactional(readOnly = true)
    public List<Turma> listarTurmasAtivas() {
        return turmaRepository.findByAtivoTrue();
    }

    /**
     * Busca turmas pelo ID do curso.
     *
     * @param cursoId ID do curso
     * @return lista de turmas do curso
     */
    @Transactional(readOnly = true)
    public List<Turma> buscarTurmasPorCurso(Long cursoId) {
        return turmaRepository.findByCursoId(cursoId);
    }

    /**
     * Busca turmas pelo ID do professor.
     *
     * @param professorId ID do professor
     * @return lista de turmas do professor
     */
    @Transactional(readOnly = true)
    public List<Turma> buscarTurmasPorProfessor(Long professorId) {
        return turmaRepository.findByProfessorId(professorId);
    }

    /**
     * Busca turmas pelo nome.
     *
     * @param nome nome ou parte do nome da turma
     * @return lista de turmas encontradas
     */
    @Transactional(readOnly = true)
    public List<Turma> buscarPorNome(String nome) {
        return turmaRepository.buscarPorNome(nome);
    }

    /**
     * Busca turmas pelo período.
     *
     * @param periodo período da turma
     * @return lista de turmas encontradas
     */
    @Transactional(readOnly = true)
    public List<Turma> buscarPorPeriodo(String periodo) {
        return turmaRepository.findByPeriodo(periodo);
    }

    /**
     * Atualiza os dados de uma turma.
     *
     * @param id ID da turma
     * @param turmaAtualizada dados atualizados da turma
     * @return turma atualizada
     * @throws ResourceNotFoundException se a turma não existe
     */
    public Turma atualizarTurma(Long id, Turma turmaAtualizada) {
        Turma turma = obterTurmaPorId(id);

        if (!turma.getCodigo().equals(turmaAtualizada.getCodigo()) &&
            turmaRepository.existsByCodigo(turmaAtualizada.getCodigo())) {
            throw new DuplicateResourceException("Já existe uma turma com o código: " + turmaAtualizada.getCodigo());
        }

        turma.setNome(turmaAtualizada.getNome());
        turma.setCurso(turmaAtualizada.getCurso());
        turma.setProfessor(turmaAtualizada.getProfessor());
        turma.setCapacidade(turmaAtualizada.getCapacidade());
        turma.setDataInicio(turmaAtualizada.getDataInicio());
        turma.setDataFim(turmaAtualizada.getDataFim());
        turma.setPeriodo(turmaAtualizada.getPeriodo());
        turma.setAtivo(turmaAtualizada.getAtivo());

        return turmaRepository.save(turma);
    }

    /**
     * Deleta uma turma.
     *
     * @param id ID da turma
     * @throws ResourceNotFoundException se a turma não existe
     */
    public void deletarTurma(Long id) {
        Turma turma = obterTurmaPorId(id);
        turmaRepository.delete(turma);
    }

    /**
     * Desativa uma turma (soft delete).
     *
     * @param id ID da turma
     * @throws ResourceNotFoundException se a turma não existe
     */
    public void desativarTurma(Long id) {
        Turma turma = obterTurmaPorId(id);
        turma.setAtivo(false);
        turmaRepository.save(turma);
    }

    /**
     * Ativa uma turma desativada.
     *
     * @param id ID da turma
     * @throws ResourceNotFoundException se a turma não existe
     */
    public void ativarTurma(Long id) {
        Turma turma = obterTurmaPorId(id);
        turma.setAtivo(true);
        turmaRepository.save(turma);
    }
}
