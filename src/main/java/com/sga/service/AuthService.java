package com.sga.service;

import com.sga.dto.LoginRequest;
import com.sga.dto.LoginResponse;
import com.sga.entity.Usuario;
import com.sga.exception.ResourceNotFoundException;
import com.sga.repository.UsuarioRepository;
import com.sga.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Serviço para autenticação de usuários.
 * Implementa a lógica de login e geração de tokens JWT.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    /**
     * Realiza o login de um usuário.
     *
     * @param loginRequest dados de login (email e senha)
     * @return resposta com token JWT e dados do usuário
     * @throws ResourceNotFoundException se o usuário não existe ou senha incorreta
     */
    public LoginResponse login(LoginRequest loginRequest) {
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com email: " + loginRequest.getEmail()));

        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            throw new ResourceNotFoundException("Email ou senha inválidos");
        }

        if (!usuario.getAtivo()) {
            throw new ResourceNotFoundException("Usuário desativado");
        }

        String token = jwtTokenProvider.generateToken(usuario.getId(), usuario.getEmail());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(usuario.getId())
                .email(usuario.getEmail())
                .nome(usuario.getNome())
                .expiresIn(86400000L) // 24 horas em milissegundos
                .build();
    }

    /**
     * Cria um novo usuário no sistema.
     *
     * @param usuario dados do usuário a ser criado
     * @return usuário criado
     */
    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }

    /**
     * Obtém as informações do usuário autenticado.
     *
     * @param userId ID do usuário
     * @return dados do usuário
     * @throws ResourceNotFoundException se o usuário não existe
     */
    public Usuario obterUsuarioAutenticado(Long userId) {
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + userId));
    }
}
