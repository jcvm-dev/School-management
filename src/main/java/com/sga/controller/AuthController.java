package com.sga.controller;

import com.sga.dto.AlterarSenhaRequest;
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
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "API para autenticação e autorização")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login de usuário", description = "Autentica um usuário e define cookie HttpOnly com o token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "401", description = "Email ou senha inválidos"),
        @ApiResponse(responseCode = "429", description = "Muitas tentativas de login")
    })
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse servletResponse) {

        LoginResponse response = authService.login(loginRequest);

        ResponseCookie cookie = ResponseCookie.from("auth_token", response.getToken())
                .httpOnly(true)
                .secure(false) // definir true em produção com HTTPS
                .path("/")
                .maxAge(Duration.ofMillis(response.getExpiresIn()))
                .sameSite("Lax")
                .build();
        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Não retornar o token no body — está no cookie HttpOnly
        response.setToken(null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Encerra a sessão removendo o cookie de autenticação")
    public ResponseEntity<Void> logout(HttpServletResponse servletResponse) {
        ResponseCookie cookie = ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registrar")
    @Operation(summary = "Registrar novo usuário", description = "Cria um novo usuário no sistema (requer ADMINISTRADOR)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "409", description = "Email já cadastrado")
    })
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario usuarioRegistrado = authService.registrar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRegistrado);
    }

    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário autenticado")
    public ResponseEntity<Usuario> obterUsuarioAutenticado(@RequestAttribute("userId") Long userId) {
        Usuario usuario = authService.obterUsuarioAutenticado(userId);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/alterar-senha")
    @Operation(summary = "Alterar senha", description = "Altera a senha do usuário autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Senha alterada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Senha atual incorreta ou nova senha inválida")
    })
    public ResponseEntity<Void> alterarSenha(
            @Valid @RequestBody AlterarSenhaRequest request,
            @RequestAttribute("userId") Long userId) {
        authService.alterarSenha(userId, request);
        return ResponseEntity.noContent().build();
    }
}
