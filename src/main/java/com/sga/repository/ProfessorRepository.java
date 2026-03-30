package com.sga.repository;

import com.sga.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para a entidade Professor.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    /**
     * Busca um professor pela matrícula.
     *
     * @param matricula matrícula do professor
     * @return Optional contendo o professor se encontrado
     */
    Optional<Professor> findByMatricula(String matricula);

    /**
     * Busca um professor pelo email.
     *
     * @param email email do professor
     * @return Optional contendo o professor se encontrado
     */
    Optional<Professor> findByEmail(String email);

    /**
     * Busca um professor pelo CPF.
     *
     * @param cpf CPF do professor
     * @return Optional contendo o professor se encontrado
     */
    Optional<Professor> findByCpf(String cpf);

    /**
     * Lista todos os professores ativos.
     *
     * @return lista de professores ativos
     */
    List<Professor> findByAtivoTrue();

    /**
     * Busca professores pelo nome (busca parcial).
     *
     * @param nome nome ou parte do nome do professor
     * @return lista de professores encontrados
     */
    @Query("SELECT p FROM Professor p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Professor> buscarPorNome(@Param("nome") String nome);

    /**
     * Verifica se um professor com a matrícula especificada existe.
     *
     * @param matricula matrícula do professor
     * @return true se existe, false caso contrário
     */
    boolean existsByMatricula(String matricula);

    /**
     * Verifica se um professor com o email especificado existe.
     *
     * @param email email do professor
     * @return true se existe, false caso contrário
     */
    boolean existsByEmail(String email);
}
