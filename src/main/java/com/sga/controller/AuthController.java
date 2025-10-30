package com.sga.controller;

import com.sga.dto.LoginRequest;
import com.sga.dto.LoginResponse;
import com.sga.entity.Usuario;
import com.sga.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para autenticação de usuários.
 * Fornece endpoints para login, registro e obtenção de dados do usuário autenticado.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "API para autenticação e autorização")
public class AuthController {

    private final AuthService authService;

    /**
     * Realiza o login de um usuário.
     *
     * @param loginRequest dados de login (email e senha)
     * @return resposta com token JWT e dados do usuário
     */
    @PostMapping("/login")
    @Operation(summary = "Login de usuário", description = "Autentica um usuário e retorna um token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "401", description = "Email ou senha inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Registra um novo usuário no sistema.
     *
     * @param usuario dados do usuário a ser registrado
     * @return usuário criado
     */
    @PostMapping("/registrar")
    @Operation(summary = "Registrar novo usuário", description = "Cria um novo usuário no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "409", description = "Email já cadastrado")
    })
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario usuarioRegistrado = authService.registrar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRegistrado);
    }

    /**
     * Obtém as informações do usuário autenticado.
     *
     * @param userId ID do usuário (extraído do token JWT)
     * @return dados do usuário autenticado
     */
    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário autenticado", description = "Retorna os dados do usuário atualmente autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dados do usuário retornados com sucesso"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<Usuario> obterUsuarioAutenticado(@RequestAttribute("userId") Long userId) {
        Usuario usuario = authService.obterUsuarioAutenticado(userId);
        return ResponseEntity.ok(usuario);
    }
}
