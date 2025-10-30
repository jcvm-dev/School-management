package com.sga.repository;

import com.sga.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para a entidade Aluno.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    /**
     * Busca um aluno pela matrícula.
     *
     * @param matricula matrícula do aluno
     * @return Optional contendo o aluno se encontrado
     */
    Optional<Aluno> findByMatricula(String matricula);

    /**
     * Busca um aluno pelo email.
     *
     * @param email email do aluno
     * @return Optional contendo o aluno se encontrado
     */
    Optional<Aluno> findByEmail(String email);

    /**
     * Busca um aluno pelo CPF.
     *
     * @param cpf CPF do aluno
     * @return Optional contendo o aluno se encontrado
     */
    Optional<Aluno> findByCpf(String cpf);

    /**
     * Lista todos os alunos ativos.
     *
     * @return lista de alunos ativos
     */
    List<Aluno> findByAtivoTrue();

    /**
     * Busca alunos pelo nome (busca parcial).
     *
     * @param nome nome ou parte do nome do aluno
     * @return lista de alunos encontrados
     */
    @Query("SELECT a FROM Aluno a WHERE LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Aluno> buscarPorNome(@Param("nome") String nome);

    /**
     * Verifica se um aluno com a matrícula especificada existe.
     *
     * @param matricula matrícula do aluno
     * @return true se existe, false caso contrário
     */
    boolean existsByMatricula(String matricula);

    /**
     * Verifica se um aluno com o email especificado existe.
     *
     * @param email email do aluno
     * @return true se existe, false caso contrário
     */
    boolean existsByEmail(String email);
}
