# Build seguro: que no compile lo inseguro

Cartilla digital y caso práctico para el curso **Seguridad en el Desarrollo de Software** (UNIMINUTO, semana 7).

- **Cartilla:** carpeta [`docs/`](docs/), publicada con GitHub Pages.
- **Caso práctico:** aplicación Java 21 en [`app/`](app/) y pipeline en [`.github/workflows/build-seguro.yml`](.github/workflows/build-seguro.yml).

## Compuertas del pipeline

| # | Compuerta | Herramienta | Detiene el build si… |
|---|-----------|-------------|----------------------|
| 1 | Secretos | Gitleaks | hay credenciales en el historial |
| 2 | SAST | SpotBugs + Find Security Bugs | el código tiene un patrón inseguro |
| 3 | SCA | OSV-Scanner | una dependencia tiene una vulnerabilidad conocida |
| 4 | DAST | OWASP ZAP baseline | la aplicación en ejecución tiene alertas |
| 5 | Publicar | SHA-256 + procedencia firmada | — (solo se ejecuta si 1-4 pasan) |

## Ramas de demostración

| Rama | Cambio | Compuerta que lo detiene |
|------|--------|--------------------------|
| `main` | Versión segura | — |
| `demo/log4shell` | Agrega `log4j-core 2.14.1` (CVE-2021-44228) | SCA |
| `demo/hash-debil` | MD5 y `java.util.Random` para generar tokens | SAST |
| `demo/sin-cabeceras` | Elimina las cabeceras de seguridad HTTP | DAST |

## Ejecutar localmente

```bash
cd app
mvn verify                       # compila, prueba, SAST y SBOM
java -jar target/build-seguro-1.0.0.jar
curl "http://localhost:8080/api/radicado?numero=RAD-2026-00123"
```

Autora: Nohra María Vizcaíno Florez · octubre de 2026
