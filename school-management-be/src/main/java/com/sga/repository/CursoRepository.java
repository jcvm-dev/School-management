package com.sga.repository;

import com.sga.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para a entidade Curso.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    /**
     * Busca um curso pelo código.
     *
     * @param codigo código do curso
     * @return Optional contendo o curso se encontrado
     */
    Optional<Curso> findByCodigo(String codigo);

    /**
     * Lista todos os cursos ativos.
     *
     * @return lista de cursos ativos
     */
    List<Curso> findByAtivoTrue();

    /**
     * Busca cursos pelo nome (busca parcial).
     *
     * @param nome nome ou parte do nome do curso
     * @return lista de cursos encontrados
     */
    @Query("SELECT c FROM Curso c WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Curso> buscarPorNome(@Param("nome") String nome);

    /**
     * Busca cursos pelo nível.
     *
     * @param nivel nível do curso
     * @return lista de cursos encontrados
     */
    List<Curso> findByNivel(String nivel);

    /**
     * Verifica se um curso com o código especificado existe.
     *
     * @param codigo código do curso
     * @return true se existe, false caso contrário
     */
    boolean existsByCodigo(String codigo);
}
