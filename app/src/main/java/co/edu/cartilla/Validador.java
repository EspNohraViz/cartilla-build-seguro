package co.edu.cartilla;

import java.util.regex.Pattern;

/** Validación de entradas por lista blanca: solo se acepta lo que cumple el formato esperado. */
public final class Validador {

    private static final Pattern RADICADO = Pattern.compile("^RAD-\\d{4}-\\d{5}$");

    private Validador() {
    }

    public static boolean esRadicadoValido(String valor) {
        return valor != null && RADICADO.matcher(valor).matches();
    }
}
