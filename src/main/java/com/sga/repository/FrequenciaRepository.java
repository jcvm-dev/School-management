package com.sga.repository;

import com.sga.entity.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * Repositório para a entidade Frequencia.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface FrequenciaRepository extends JpaRepository<Frequencia, Long> {

    /**
     * Lista todas as frequências de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de frequências do aluno
     */
    List<Frequencia> findByAlunoId(Long alunoId);

    /**
     * Lista todas as frequências de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de frequências da turma
     */
    List<Frequencia> findByTurmaId(Long turmaId);

    /**
     * Lista todas as frequências de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return lista de frequências do aluno na turma
     */
    List<Frequencia> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    /**
     * Lista todas as frequências de uma turma em uma data específica.
     *
     * @param turmaId ID da turma
     * @param dataAula data da aula
     * @return lista de frequências da turma na data
     */
    List<Frequencia> findByTurmaIdAndDataAula(Long turmaId, LocalDate dataAula);

    /**
     * Calcula a taxa de presença de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return percentual de presença
     */
    @Query("SELECT (COUNT(CASE WHEN f.status = 'PRESENTE' OR f.status = 'ATRASADO' THEN 1 END) * 100.0) / COUNT(f) " +
           "FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.turma.id = :turmaId")
    Double calcularTaxaPresenca(@Param("alunoId") Long alunoId, @Param("turmaId") Long turmaId);

    /**
     * Conta o número de presenças de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return número de presenças
     */
    @Query("SELECT COUNT(f) FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.turma.id = :turmaId " +
           "AND (f.status = 'PRESENTE' OR f.status = 'ATRASADO')")
    long contarPresencas(@Param("alunoId") Long alunoId, @Param("turmaId") Long turmaId);

    /**
     * Conta o número de ausências de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return número de ausências
     */
    @Query("SELECT COUNT(f) FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.turma.id = :turmaId " +
           "AND f.status = 'AUSENTE'")
    long contarAusencias(@Param("alunoId") Long alunoId, @Param("turmaId") Long turmaId);

    /**
     * Conta o número de faltas justificadas de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return número de faltas justificadas
     */
    @Query("SELECT COUNT(f) FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.turma.id = :turmaId " +
           "AND f.status = 'JUSTIFICADO'")
    long contarFaltasJustificadas(@Param("alunoId") Long alunoId, @Param("turmaId") Long turmaId);
}
