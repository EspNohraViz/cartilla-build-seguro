package co.edu.cartilla;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

/**
 * DEMO: generación de tokens de sesión con prácticas inseguras.
 * - java.util.Random es predecible: un atacante puede adivinar el siguiente token.
 * - MD5 es un algoritmo de resumen roto.
 * El análisis estático (Find Security Bugs) debe detener el build.
 */
public final class TokenSesion {

    private static final Random ALEATORIO = new Random();

    private TokenSesion() {
    }

    public static String nuevo(String usuario) throws NoSuchAlgorithmException {
        String semilla = usuario + ALEATORIO.nextLong();
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        byte[] hash = md5.digest(semilla.getBytes(StandardCharsets.UTF_8));
        return new BigInteger(1, hash).toString(16);
    }
}
