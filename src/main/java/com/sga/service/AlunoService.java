package com.sga.service;

import com.sga.entity.Aluno;
import com.sga.exception.DuplicateResourceException;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Serviço para gerenciamento de alunos.
 * Implementa a lógica de negócio para operações com alunos.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AlunoService {

    private final AlunoRepository alunoRepository;

    /**
     * Cria um novo aluno.
     *
     * @param aluno dados do aluno a ser criado
     * @return aluno criado
     * @throws DuplicateResourceException se a matrícula ou email já existe
     */
    public Aluno criarAluno(Aluno aluno) {
        if (alunoRepository.existsByMatricula(aluno.getMatricula())) {
            throw new DuplicateResourceException("Já existe um aluno com a matrícula: " + aluno.getMatricula());
        }
        if (alunoRepository.existsByEmail(aluno.getEmail())) {
            throw new DuplicateResourceException("Já existe um aluno com o email: " + aluno.getEmail());
        }
        return alunoRepository.save(aluno);
    }

    /**
     * Busca um aluno pelo ID.
     *
     * @param id ID do aluno
     * @return aluno encontrado
     * @throws ResourceNotFoundException se o aluno não existe
     */
    @Transactional(readOnly = true)
    public Aluno obterAlunoPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com ID: " + id));
    }

    /**
     * Busca um aluno pela matrícula.
     *
     * @param matricula matrícula do aluno
     * @return aluno encontrado
     * @throws ResourceNotFoundException se o aluno não existe
     */
    @Transactional(readOnly = true)
    public Aluno obterAlunoPorMatricula(String matricula) {
        return alunoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com matrícula: " + matricula));
    }

    /**
     * Busca um aluno pelo email.
     *
     * @param email email do aluno
     * @return aluno encontrado
     * @throws ResourceNotFoundException se o aluno não existe
     */
    @Transactional(readOnly = true)
    public Aluno obterAlunoPorEmail(String email) {
        return alunoRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com email: " + email));
    }

    /**
     * Lista todos os alunos.
     *
     * @return lista de todos os alunos
     */
    @Transactional(readOnly = true)
    public List<Aluno> listarTodosAlunos() {
        return alunoRepository.findAll();
    }

    /**
     * Lista todos os alunos ativos.
     *
     * @return lista de alunos ativos
     */
    @Transactional(readOnly = true)
    public List<Aluno> listarAlunosAtivos() {
        return alunoRepository.findByAtivoTrue();
    }

    /**
     * Busca alunos pelo nome.
     *
     * @param nome nome ou parte do nome do aluno
     * @return lista de alunos encontrados
     */
    @Transactional(readOnly = true)
    public List<Aluno> buscarPorNome(String nome) {
        return alunoRepository.buscarPorNome(nome);
    }

    /**
     * Atualiza os dados de um aluno.
     *
     * @param id ID do aluno
     * @param alunoAtualizado dados atualizados do aluno
     * @return aluno atualizado
     * @throws ResourceNotFoundException se o aluno não existe
     */
    public Aluno atualizarAluno(Long id, Aluno alunoAtualizado) {
        Aluno aluno = obterAlunoPorId(id);

        // Verifica se o email foi alterado e se já existe outro aluno com esse email
        if (!aluno.getEmail().equals(alunoAtualizado.getEmail()) &&
            alunoRepository.existsByEmail(alunoAtualizado.getEmail())) {
            throw new DuplicateResourceException("Já existe um aluno com o email: " + alunoAtualizado.getEmail());
        }

        aluno.setNome(alunoAtualizado.getNome());
        aluno.setEmail(alunoAtualizado.getEmail());
        aluno.setTelefone(alunoAtualizado.getTelefone());
        aluno.setDataNascimento(alunoAtualizado.getDataNascimento());
        aluno.setEndereco(alunoAtualizado.getEndereco());
        aluno.setCidade(alunoAtualizado.getCidade());
        aluno.setEstado(alunoAtualizado.getEstado());
        aluno.setCep(alunoAtualizado.getCep());
        aluno.setAtivo(alunoAtualizado.getAtivo());

        return alunoRepository.save(aluno);
    }

    /**
     * Deleta um aluno.
     *
     * @param id ID do aluno
     * @throws ResourceNotFoundException se o aluno não existe
     */
    public void deletarAluno(Long id) {
        Aluno aluno = obterAlunoPorId(id);
        alunoRepository.delete(aluno);
    }

    /**
     * Desativa um aluno (soft delete).
     *
     * @param id ID do aluno
     * @throws ResourceNotFoundException se o aluno não existe
     */
    public void desativarAluno(Long id) {
        Aluno aluno = obterAlunoPorId(id);
        aluno.setAtivo(false);
        alunoRepository.save(aluno);
    }

    /**
     * Ativa um aluno desativado.
     *
     * @param id ID do aluno
     * @throws ResourceNotFoundException se o aluno não existe
     */
    public void ativarAluno(Long id) {
        Aluno aluno = obterAlunoPorId(id);
        aluno.setAtivo(true);
        alunoRepository.save(aluno);
    }
}
