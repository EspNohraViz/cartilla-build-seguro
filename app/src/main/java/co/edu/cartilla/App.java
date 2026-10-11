package co.edu.cartilla;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Servicio mínimo de consulta de radicados. Usa solo el JDK (cero dependencias
 * de ejecución) para que el ejemplo muestre con claridad el efecto de agregar una.
 */
public final class App {

    private static final String PAGINA = """
            <!doctype html>
            <html lang="es"><head><meta charset="utf-8"><title>Consulta de radicados</title></head>
            <body><h1>Consulta de radicados</h1>
            <p>Ejemplo: <a href="/api/radicado?numero=RAD-2026-00123">/api/radicado?numero=RAD-2026-00123</a></p>
            </body></html>
            """;

    private App() {
    }

    public static void main(String[] args) throws IOException {
        int puerto = Integer.parseInt(System.getenv().getOrDefault("PUERTO", "8080"));
        HttpServer servidor = HttpServer.create(new InetSocketAddress(puerto), 0);
        servidor.createContext("/", App::inicio);
        servidor.createContext("/api/radicado", App::consultarRadicado);
        servidor.start();
        System.out.println("Servicio escuchando en el puerto " + puerto);
    }

    private static void inicio(HttpExchange ex) throws IOException {
        if (!"/".equals(ex.getRequestURI().getPath())) {
            responder(ex, 404, "text/plain; charset=utf-8", "No encontrado");
            return;
        }
        responder(ex, 200, "text/html; charset=utf-8", PAGINA);
    }

    private static void consultarRadicado(HttpExchange ex) throws IOException {
        String numero = parametro(ex.getRequestURI().getRawQuery(), "numero");
        if (!Validador.esRadicadoValido(numero)) {
            // Lista blanca: si no cumple el formato, se rechaza sin repetir la entrada
            responder(ex, 400, "application/json; charset=utf-8", "{\"error\":\"formato de radicado no válido\"}");
            return;
        }
        String json = "{\"radicado\":\"" + numero + "\",\"estado\":\"EN TRÁMITE\"}";
        responder(ex, 200, "application/json; charset=utf-8", json);
    }

    static String parametro(String query, String nombre) {
        if (query == null) {
            return null;
        }
        for (String par : query.split("&")) {
            String[] kv = par.split("=", 2);
            if (kv.length == 2 && nombre.equals(kv[0])) {
                return URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
            }
        }
        return null;
    }

    /** Cabeceras de seguridad que el análisis dinámico (ZAP) verifica en cada respuesta. */
    static final Map<String, String> CABECERAS_SEGURIDAD = Map.of(); // DEMO: sin cabeceras de seguridad

    private static void responder(HttpExchange ex, int codigo, String tipo, String cuerpo) throws IOException {
        byte[] bytes = cuerpo.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", tipo);
        CABECERAS_SEGURIDAD.forEach((k, v) -> ex.getResponseHeaders().set(k, v));
        ex.sendResponseHeaders(codigo, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
