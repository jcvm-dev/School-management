package com.sga.service;

import com.sga.entity.Frequencia;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.FrequenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

/**
 * Serviço para gerenciamento de frequências.
 * Implementa a lógica de negócio para operações com frequências.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FrequenciaService {

    private final FrequenciaRepository frequenciaRepository;

    /**
     * Cria um novo registro de frequência.
     *
     * @param frequencia dados da frequência a ser criada
     * @return frequência criada
     */
    public Frequencia criarFrequencia(Frequencia frequencia) {
        return frequenciaRepository.save(frequencia);
    }

    /**
     * Busca um registro de frequência pelo ID.
     *
     * @param id ID da frequência
     * @return frequência encontrada
     * @throws ResourceNotFoundException se a frequência não existe
     */
    @Transactional(readOnly = true)
    public Frequencia obterFrequenciaPorId(Long id) {
        return frequenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Frequência não encontrada com ID: " + id));
    }

    /**
     * Lista todas as frequências.
     *
     * @return lista de todas as frequências
     */
    @Transactional(readOnly = true)
    public List<Frequencia> listarTodasFrequencias() {
        return frequenciaRepository.findAll();
    }

    /**
     * Lista todas as frequências de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de frequências do aluno
     */
    @Transactional(readOnly = true)
    public List<Frequencia> listarFrequenciasPorAluno(Long alunoId) {
        return frequenciaRepository.findByAlunoId(alunoId);
    }

    /**
     * Lista todas as frequências de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de frequências da turma
     */
    @Transactional(readOnly = true)
    public List<Frequencia> listarFrequenciasPorTurma(Long turmaId) {
        return frequenciaRepository.findByTurmaId(turmaId);
    }

    /**
     * Lista todas as frequências de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return lista de frequências do aluno na turma
     */
    @Transactional(readOnly = true)
    public List<Frequencia> listarFrequenciasPorAlunoETurma(Long alunoId, Long turmaId) {
        return frequenciaRepository.findByAlunoIdAndTurmaId(alunoId, turmaId);
    }

    /**
     * Lista todas as frequências de uma turma em uma data específica.
     *
     * @param turmaId ID da turma
     * @param dataAula data da aula
     * @return lista de frequências da turma na data
     */
    @Transactional(readOnly = true)
    public List<Frequencia> listarFrequenciasPorTurmaEData(Long turmaId, LocalDate dataAula) {
        return frequenciaRepository.findByTurmaIdAndDataAula(turmaId, dataAula);
    }

    /**
     * Calcula a taxa de presença de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return percentual de presença
     */
    @Transactional(readOnly = true)
    public Double calcularTaxaPresenca(Long alunoId, Long turmaId) {
        return frequenciaRepository.calcularTaxaPresenca(alunoId, turmaId);
    }

    /**
     * Conta o número de presenças de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return número de presenças
     */
    @Transactional(readOnly = true)
    public long contarPresencas(Long alunoId, Long turmaId) {
        return frequenciaRepository.contarPresencas(alunoId, turmaId);
    }

    /**
     * Conta o número de ausências de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return número de ausências
     */
    @Transactional(readOnly = true)
    public long contarAusencias(Long alunoId, Long turmaId) {
        return frequenciaRepository.contarAusencias(alunoId, turmaId);
    }

    /**
     * Conta o número de faltas justificadas de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return número de faltas justificadas
     */
    @Transactional(readOnly = true)
    public long contarFaltasJustificadas(Long alunoId, Long turmaId) {
        return frequenciaRepository.contarFaltasJustificadas(alunoId, turmaId);
    }

    /**
     * Atualiza o status de frequência.
     *
     * @param id ID da frequência
     * @param novoStatus novo status de presença
     * @return frequência atualizada
     * @throws ResourceNotFoundException se a frequência não existe
     */
    public Frequencia atualizarStatusFrequencia(Long id, Frequencia.StatusPresenca novoStatus) {
        Frequencia frequencia = obterFrequenciaPorId(id);
        frequencia.setStatus(novoStatus);
        return frequenciaRepository.save(frequencia);
    }

    /**
     * Atualiza os dados de uma frequência.
     *
     * @param id ID da frequência
     * @param frequenciaAtualizada dados atualizados da frequência
     * @return frequência atualizada
     * @throws ResourceNotFoundException se a frequência não existe
     */
    public Frequencia atualizarFrequencia(Long id, Frequencia frequenciaAtualizada) {
        Frequencia frequencia = obterFrequenciaPorId(id);

        frequencia.setStatus(frequenciaAtualizada.getStatus());
        frequencia.setJustificativa(frequenciaAtualizada.getJustificativa());
        frequencia.setDataAula(frequenciaAtualizada.getDataAula());

        return frequenciaRepository.save(frequencia);
    }

    /**
     * Deleta um registro de frequência.
     *
     * @param id ID da frequência
     * @throws ResourceNotFoundException se a frequência não existe
     */
    public void deletarFrequencia(Long id) {
        Frequencia frequencia = obterFrequenciaPorId(id);
        frequenciaRepository.delete(frequencia);
    }
}
