package com.sga.config;

import com.sga.entity.Usuario;
import com.sga.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByEmail("admin@escola.com")) {
            Usuario admin = Usuario.builder()
                    .email("admin@escola.com")
                    .nome("Administrador")
                    .senha(passwordEncoder.encode("Admin@2024!"))
                    .tipo(Usuario.TipoUsuario.ADMINISTRADOR)
                    .ativo(true)
                    .senhaTemporaria(true)
                    .build();
            usuarioRepository.save(admin);
            log.info("Admin padrão criado — email: admin@escola.com (senha temporária definida)");
        }
    }
}
