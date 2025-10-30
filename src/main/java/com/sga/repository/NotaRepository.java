package com.sga.repository;

import com.sga.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

/**
 * Repositório para a entidade Nota.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    /**
     * Lista todas as notas de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de notas do aluno
     */
    List<Nota> findByAlunoId(Long alunoId);

    /**
     * Lista todas as notas de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de notas da turma
     */
    List<Nota> findByTurmaId(Long turmaId);

    /**
     * Lista todas as notas de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return lista de notas do aluno na turma
     */
    List<Nota> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    /**
     * Busca notas por avaliação.
     *
     * @param avaliacao nome da avaliação
     * @return lista de notas da avaliação
     */
    List<Nota> findByAvaliacao(String avaliacao);

    /**
     * Calcula a média de notas de um aluno em uma turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return média das notas
     */
    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.aluno.id = :alunoId AND n.turma.id = :turmaId")
    BigDecimal calcularMediaAluno(@Param("alunoId") Long alunoId, @Param("turmaId") Long turmaId);

    /**
     * Calcula a média de notas de uma turma.
     *
     * @param turmaId ID da turma
     * @return média das notas da turma
     */
    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.turma.id = :turmaId")
    BigDecimal calcularMediaTurma(@Param("turmaId") Long turmaId);

    /**
     * Busca a nota máxima de uma turma.
     *
     * @param turmaId ID da turma
     * @return nota máxima
     */
    @Query("SELECT MAX(n.valor) FROM Nota n WHERE n.turma.id = :turmaId")
    BigDecimal encontrarNotaMaxima(@Param("turmaId") Long turmaId);

    /**
     * Busca a nota mínima de uma turma.
     *
     * @param turmaId ID da turma
     * @return nota mínima
     */
    @Query("SELECT MIN(n.valor) FROM Nota n WHERE n.turma.id = :turmaId")
    BigDecimal encontrarNotaMinima(@Param("turmaId") Long turmaId);
}
