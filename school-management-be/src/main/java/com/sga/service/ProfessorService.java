package com.sga.service;

import com.sga.entity.Professor;
import com.sga.exception.DuplicateResourceException;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Serviço para gerenciamento de professores.
 * Implementa a lógica de negócio para operações com professores.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    /**
     * Cria um novo professor.
     *
     * @param professor dados do professor a ser criado
     * @return professor criado
     * @throws DuplicateResourceException se a matrícula ou email já existe
     */
    public Professor criarProfessor(Professor professor) {
        if (professorRepository.existsByMatricula(professor.getMatricula())) {
            throw new DuplicateResourceException("Já existe um professor com a matrícula: " + professor.getMatricula());
        }
        if (professorRepository.existsByEmail(professor.getEmail())) {
            throw new DuplicateResourceException("Já existe um professor com o email: " + professor.getEmail());
        }
        return professorRepository.save(professor);
    }

    /**
     * Busca um professor pelo ID.
     *
     * @param id ID do professor
     * @return professor encontrado
     * @throws ResourceNotFoundException se o professor não existe
     */
    @Transactional(readOnly = true)
    public Professor obterProfessorPorId(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com ID: " + id));
    }

    /**
     * Busca um professor pela matrícula.
     *
     * @param matricula matrícula do professor
     * @return professor encontrado
     * @throws ResourceNotFoundException se o professor não existe
     */
    @Transactional(readOnly = true)
    public Professor obterProfessorPorMatricula(String matricula) {
        return professorRepository.findByMatricula(matricula)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com matrícula: " + matricula));
    }

    /**
     * Busca um professor pelo email.
     *
     * @param email email do professor
     * @return professor encontrado
     * @throws ResourceNotFoundException se o professor não existe
     */
    @Transactional(readOnly = true)
    public Professor obterProfessorPorEmail(String email) {
        return professorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com email: " + email));
    }

    /**
     * Lista todos os professores.
     *
     * @return lista de todos os professores
     */
    @Transactional(readOnly = true)
    public List<Professor> listarTodosProfessores() {
        return professorRepository.findAll();
    }

    /**
     * Lista todos os professores ativos.
     *
     * @return lista de professores ativos
     */
    @Transactional(readOnly = true)
    public List<Professor> listarProfessoresAtivos() {
        return professorRepository.findByAtivoTrue();
    }

    /**
     * Busca professores pelo nome.
     *
     * @param nome nome ou parte do nome do professor
     * @return lista de professores encontrados
     */
    @Transactional(readOnly = true)
    public List<Professor> buscarPorNome(String nome) {
        return professorRepository.buscarPorNome(nome);
    }

    /**
     * Atualiza os dados de um professor.
     *
     * @param id ID do professor
     * @param professorAtualizado dados atualizados do professor
     * @return professor atualizado
     * @throws ResourceNotFoundException se o professor não existe
     */
    public Professor atualizarProfessor(Long id, Professor professorAtualizado) {
        Professor professor = obterProfessorPorId(id);

        if (!professor.getEmail().equals(professorAtualizado.getEmail()) &&
            professorRepository.existsByEmail(professorAtualizado.getEmail())) {
            throw new DuplicateResourceException("Já existe um professor com o email: " + professorAtualizado.getEmail());
        }

        professor.setNome(professorAtualizado.getNome());
        professor.setEmail(professorAtualizado.getEmail());
        professor.setTelefone(professorAtualizado.getTelefone());
        professor.setDataNascimento(professorAtualizado.getDataNascimento());
        professor.setEndereco(professorAtualizado.getEndereco());
        professor.setCidade(professorAtualizado.getCidade());
        professor.setEstado(professorAtualizado.getEstado());
        professor.setCep(professorAtualizado.getCep());
        professor.setFormacao(professorAtualizado.getFormacao());
        professor.setDataAdmissao(professorAtualizado.getDataAdmissao());
        professor.setAtivo(professorAtualizado.getAtivo());

        return professorRepository.save(professor);
    }

    /**
     * Deleta um professor.
     *
     * @param id ID do professor
     * @throws ResourceNotFoundException se o professor não existe
     */
    public void deletarProfessor(Long id) {
        Professor professor = obterProfessorPorId(id);
        professorRepository.delete(professor);
    }

    /**
     * Desativa um professor (soft delete).
     *
     * @param id ID do professor
     * @throws ResourceNotFoundException se o professor não existe
     */
    public void desativarProfessor(Long id) {
        Professor professor = obterProfessorPorId(id);
        professor.setAtivo(false);
        professorRepository.save(professor);
    }

    /**
     * Ativa um professor desativado.
     *
     * @param id ID do professor
     * @throws ResourceNotFoundException se o professor não existe
     */
    public void ativarProfessor(Long id) {
        Professor professor = obterProfessorPorId(id);
        professor.setAtivo(true);
        professorRepository.save(professor);
    }
}
