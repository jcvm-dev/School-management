package com.sga.service;

import com.sga.entity.Matricula;
import com.sga.exception.DuplicateResourceException;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.MatriculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Serviço para gerenciamento de matrículas.
 * Implementa a lógica de negócio para operações com matrículas.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;

    /**
     * Cria uma nova matrícula.
     *
     * @param matricula dados da matrícula a ser criada
     * @return matrícula criada
     * @throws DuplicateResourceException se o aluno já está matriculado na turma
     */
    public Matricula criarMatricula(Matricula matricula) {
        if (matriculaRepository.findByAlunoIdAndTurmaId(matricula.getAluno().getId(), matricula.getTurma().getId()).isPresent()) {
            throw new DuplicateResourceException("Aluno já está matriculado nesta turma");
        }
        return matriculaRepository.save(matricula);
    }

    /**
     * Busca uma matrícula pelo ID.
     *
     * @param id ID da matrícula
     * @return matrícula encontrada
     * @throws ResourceNotFoundException se a matrícula não existe
     */
    @Transactional(readOnly = true)
    public Matricula obterMatriculaPorId(Long id) {
        return matriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula não encontrada com ID: " + id));
    }

    /**
     * Busca uma matrícula pelo ID do aluno e ID da turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return matrícula encontrada
     * @throws ResourceNotFoundException se a matrícula não existe
     */
    @Transactional(readOnly = true)
    public Matricula obterMatriculaPorAlunoETurma(Long alunoId, Long turmaId) {
        return matriculaRepository.findByAlunoIdAndTurmaId(alunoId, turmaId)
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula não encontrada para o aluno e turma especificados"));
    }

    /**
     * Lista todas as matrículas.
     *
     * @return lista de todas as matrículas
     */
    @Transactional(readOnly = true)
    public List<Matricula> listarTodasMatriculas() {
        return matriculaRepository.findAll();
    }

    /**
     * Lista todas as matrículas de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de matrículas do aluno
     */
    @Transactional(readOnly = true)
    public List<Matricula> listarMatriculasPorAluno(Long alunoId) {
        return matriculaRepository.findByAlunoId(alunoId);
    }

    /**
     * Lista todas as matrículas de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de matrículas da turma
     */
    @Transactional(readOnly = true)
    public List<Matricula> listarMatriculasPorTurma(Long turmaId) {
        return matriculaRepository.findByTurmaId(turmaId);
    }

    /**
     * Lista todas as matrículas ativas de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de matrículas ativas do aluno
     */
    @Transactional(readOnly = true)
    public List<Matricula> listarMatriculasAtivasPorAluno(Long alunoId) {
        return matriculaRepository.findByAlunoIdAndStatus(alunoId, Matricula.StatusMatricula.ATIVA);
    }

    /**
     * Lista todas as matrículas ativas de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de matrículas ativas da turma
     */
    @Transactional(readOnly = true)
    public List<Matricula> listarMatriculasAtivasPorTurma(Long turmaId) {
        return matriculaRepository.findByTurmaIdAndStatus(turmaId, Matricula.StatusMatricula.ATIVA);
    }

    /**
     * Conta o número de matrículas ativas em uma turma.
     *
     * @param turmaId ID da turma
     * @return número de matrículas ativas
     */
    @Transactional(readOnly = true)
    public long contarMatriculasAtivasPorTurma(Long turmaId) {
        return matriculaRepository.countByTurmaIdAndStatus(turmaId, Matricula.StatusMatricula.ATIVA);
    }

    /**
     * Atualiza o status de uma matrícula.
     *
     * @param id ID da matrícula
     * @param novoStatus novo status da matrícula
     * @return matrícula atualizada
     * @throws ResourceNotFoundException se a matrícula não existe
     */
    public Matricula atualizarStatusMatricula(Long id, Matricula.StatusMatricula novoStatus) {
        Matricula matricula = obterMatriculaPorId(id);
        matricula.setStatus(novoStatus);
        return matriculaRepository.save(matricula);
    }

    /**
     * Cancela uma matrícula.
     *
     * @param id ID da matrícula
     * @return matrícula cancelada
     * @throws ResourceNotFoundException se a matrícula não existe
     */
    public Matricula cancelarMatricula(Long id) {
        Matricula matricula = obterMatriculaPorId(id);
        matricula.setStatus(Matricula.StatusMatricula.CANCELADA);
        matricula.setDataCancelamento(java.time.LocalDate.now());
        return matriculaRepository.save(matricula);
    }

    /**
     * Tranca uma matrícula.
     *
     * @param id ID da matrícula
     * @return matrícula trancada
     * @throws ResourceNotFoundException se a matrícula não existe
     */
    public Matricula trancarMatricula(Long id) {
        Matricula matricula = obterMatriculaPorId(id);
        matricula.setStatus(Matricula.StatusMatricula.TRANCADA);
        return matriculaRepository.save(matricula);
    }

    /**
     * Deleta uma matrícula.
     *
     * @param id ID da matrícula
     * @throws ResourceNotFoundException se a matrícula não existe
     */
    public void deletarMatricula(Long id) {
        Matricula matricula = obterMatriculaPorId(id);
        matriculaRepository.delete(matricula);
    }
}
