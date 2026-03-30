package com.sga.service;

import com.sga.entity.Nota;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.NotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

/**
 * Serviço para gerenciamento de notas.
 * Implementa a lógica de negócio para operações com notas.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class NotaService {

    private final NotaRepository notaRepository;

    /**
     * Cria uma nova nota.
     *
     * @param nota dados da nota a ser criada
     * @return nota criada
     */
    public Nota criarNota(Nota nota) {
        return notaRepository.save(nota);
    }

    /**
     * Busca uma nota pelo ID.
     *
     * @param id ID da nota
     * @return nota encontrada
     * @throws ResourceNotFoundException se a nota não existe
     */
    @Transactional(readOnly = true)
    public Nota obterNotaPorId(Long id) {
        return notaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota não encontrada com ID: " + id));
    }

    /**
     * Lista todas as notas.
     *
     * @return lista de todas as notas
     */
    @Transactional(readOnly = true)
    public List<Nota> listarTodasNotas() {
        return notaRepository.findAll();
    }

    /**
     * Lista todas as notas de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de notas do aluno
     */
    @Transactional(readOnly = true)
    public List<Nota> listarNotasPorAluno(Long alunoId) {
        return notaRepository.findByAlunoId(alunoId);
    }

    /**
     * Lista todas as notas de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de notas da turma
     */
    @Transactional(readOnly = true)
    public List<Nota> listarNotasPorTurma(Long turmaId) {
        return notaRepository.findByTurmaId(turmaId);
    }

    /**
     * Lista todas as notas de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return lista de notas do aluno na turma
     */
    @Transactional(readOnly = true)
    public List<Nota> listarNotasPorAlunoETurma(Long alunoId, Long turmaId) {
        return notaRepository.findByAlunoIdAndTurmaId(alunoId, turmaId);
    }

    /**
     * Busca notas por avaliação.
     *
     * @param avaliacao nome da avaliação
     * @return lista de notas da avaliação
     */
    @Transactional(readOnly = true)
    public List<Nota> buscarPorAvaliacao(String avaliacao) {
        return notaRepository.findByAvaliacao(avaliacao);
    }

    /**
     * Calcula a média de notas de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return média das notas
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularMediaAluno(Long alunoId, Long turmaId) {
        return notaRepository.calcularMediaAluno(alunoId, turmaId);
    }

    /**
     * Calcula a média de notas de uma turma.
     *
     * @param turmaId ID da turma
     * @return média das notas da turma
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularMediaTurma(Long turmaId) {
        return notaRepository.calcularMediaTurma(turmaId);
    }

    /**
     * Busca a nota máxima de uma turma.
     *
     * @param turmaId ID da turma
     * @return nota máxima
     */
    @Transactional(readOnly = true)
    public BigDecimal encontrarNotaMaxima(Long turmaId) {
        return notaRepository.encontrarNotaMaxima(turmaId);
    }

    /**
     * Busca a nota mínima de uma turma.
     *
     * @param turmaId ID da turma
     * @return nota mínima
     */
    @Transactional(readOnly = true)
    public BigDecimal encontrarNotaMinima(Long turmaId) {
        return notaRepository.encontrarNotaMinima(turmaId);
    }

    /**
     * Atualiza os dados de uma nota.
     *
     * @param id ID da nota
     * @param notaAtualizada dados atualizados da nota
     * @return nota atualizada
     * @throws ResourceNotFoundException se a nota não existe
     */
    public Nota atualizarNota(Long id, Nota notaAtualizada) {
        Nota nota = obterNotaPorId(id);

        nota.setAvaliacao(notaAtualizada.getAvaliacao());
        nota.setValor(notaAtualizada.getValor());
        nota.setDataAvaliacao(notaAtualizada.getDataAvaliacao());
        nota.setObservacoes(notaAtualizada.getObservacoes());

        return notaRepository.save(nota);
    }

    /**
     * Deleta uma nota.
     *
     * @param id ID da nota
     * @throws ResourceNotFoundException se a nota não existe
     */
    public void deletarNota(Long id) {
        Nota nota = obterNotaPorId(id);
        notaRepository.delete(nota);
    }
}
