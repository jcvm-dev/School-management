package com.sga.repository;

import com.sga.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repositório para a entidade Usuario.
 * Fornece métodos para operações CRUD e consultas específicas.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo email.
     *
     * @param email email do usuário
     * @return Optional contendo o usuário se encontrado
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica se um usuário com o email especificado existe.
     *
     * @param email email do usuário
     * @return true se existe, false caso contrário
     */
    boolean existsByEmail(String email);
}
