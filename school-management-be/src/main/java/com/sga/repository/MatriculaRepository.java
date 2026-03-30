package com.sga.repository;

import com.sga.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para a entidade Matricula.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    /**
     * Busca uma matrícula pelo ID do aluno e ID da turma.
     *
     * @param alunoId ID do aluno
     * @param turmaId ID da turma
     * @return Optional contendo a matrícula se encontrada
     */
    Optional<Matricula> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    /**
     * Lista todas as matrículas de um aluno.
     *
     * @param alunoId ID do aluno
     * @return lista de matrículas do aluno
     */
    List<Matricula> findByAlunoId(Long alunoId);

    /**
     * Lista todas as matrículas de uma turma.
     *
     * @param turmaId ID da turma
     * @return lista de matrículas da turma
     */
    List<Matricula> findByTurmaId(Long turmaId);

    /**
     * Lista todas as matrículas ativas de um aluno.
     *
     * @param alunoId ID do aluno
     * @param status status da matrícula
     * @return lista de matrículas ativas do aluno
     */
    @Query("SELECT m FROM Matricula m WHERE m.aluno.id = :alunoId AND m.status = :status")
    List<Matricula> findByAlunoIdAndStatus(@Param("alunoId") Long alunoId, @Param("status") Matricula.StatusMatricula status);

    /**
     * Lista todas as matrículas ativas de uma turma.
     *
     * @param turmaId ID da turma
     * @param status status da matrícula
     * @return lista de matrículas ativas da turma
     */
    @Query("SELECT m FROM Matricula m WHERE m.turma.id = :turmaId AND m.status = :status")
    List<Matricula> findByTurmaIdAndStatus(@Param("turmaId") Long turmaId, @Param("status") Matricula.StatusMatricula status);

    /**
     * Conta o número de matrículas ativas em uma turma.
     *
     * @param turmaId ID da turma
     * @param status status da matrícula
     * @return número de matrículas
     */
    @Query("SELECT COUNT(m) FROM Matricula m WHERE m.turma.id = :turmaId AND m.status = :status")
    long countByTurmaIdAndStatus(@Param("turmaId") Long turmaId, @Param("status") Matricula.StatusMatricula status);
}
