package com.sga.repository;

import com.sga.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para a entidade Turma.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    /**
     * Busca uma turma pelo código.
     *
     * @param codigo código da turma
     * @return Optional contendo a turma se encontrada
     */
    Optional<Turma> findByCodigo(String codigo);

    /**
     * Lista todas as turmas ativas.
     *
     * @return lista de turmas ativas
     */
    List<Turma> findByAtivoTrue();

    /**
     * Busca turmas pelo código do curso.
     *
     * @param cursoId ID do curso
     * @return lista de turmas encontradas
     */
    List<Turma> findByCursoId(Long cursoId);

    /**
     * Busca turmas pelo ID do professor.
     *
     * @param professorId ID do professor
     * @return lista de turmas encontradas
     */
    List<Turma> findByProfessorId(Long professorId);

    /**
     * Busca turmas pelo nome (busca parcial).
     *
     * @param nome nome ou parte do nome da turma
     * @return lista de turmas encontradas
     */
    @Query("SELECT t FROM Turma t WHERE LOWER(t.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Turma> buscarPorNome(@Param("nome") String nome);

    /**
     * Busca turmas pelo período.
     *
     * @param periodo período da turma
     * @return lista de turmas encontradas
     */
    List<Turma> findByPeriodo(String periodo);

    /**
     * Verifica se uma turma com o código especificado existe.
     *
     * @param codigo código da turma
     * @return true se existe, false caso contrário
     */
    boolean existsByCodigo(String codigo);
}
