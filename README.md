<div align="center">
  <img src="./logo.svg" alt="QR Studio" width="92" height="92">

# QR Studio

**Generador, personalizador y lector de códigos QR que funciona directamente en el navegador.**

Sin cuentas, sin backend para generar QR y con exportación en PNG o SVG.

[Demo](https://jayroanghelo.com/generator-qr/) · [Reportar un problema](https://github.com/jayroanghelo/generator-qr/issues)

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=fff)
![Client side](https://img.shields.io/badge/processing-client--side-d9ef67)
![No backend](https://img.shields.io/badge/QR_generation-no_backend-111111)

</div>

---

## Qué es

QR Studio es una herramienta web para crear códigos QR estáticos y personalizarlos visualmente sin enviar el contenido a un servicio de generación remoto.

La aplicación incluye generación, personalización, comprobación básica de escaneabilidad, lectura desde cámara o imagen, exportación y generación por lotes.

## Funcionalidades

### Contenido

- URL.
- Texto libre.
- WiFi.
- vCard / contacto.
- Email.
- Teléfono.
- SMS.
- Coordenadas geográficas.
- Redes sociales.
- Enlaces para App Store y Google Play.
- PDF mediante URL.
- Generación por lotes desde texto, TXT o CSV.
- Lectura de QR desde cámara o archivo de imagen.

### Personalización

- Color principal y fondo.
- Fondo transparente.
- Degradados.
- Múltiples formas para módulos y ojos del QR.
- Color independiente para los ojos.
- Logo central.
- Eliminación básica de fondo del logo en local.
- Tamaño y fondo del logo.
- Marcos y texto alrededor del QR.
- Niveles de corrección de errores L, M, Q y H.
- Quiet zone configurable.
- Plantillas visuales predefinidas.

### Exportación

- PNG en 512, 1024, 2048 o 4096 px.
- SVG.
- Copia de PNG al portapapeles cuando el navegador lo permite.
- ZIP para lotes de hasta 500 QR.
- Comprobación local de escaneabilidad usando el lector incluido.

### Guardado local

Los diseños personalizados y el historial se almacenan en `localStorage` del navegador. La contraseña WiFi no se guarda en el historial.

La configuración de diseño también puede exportarse e importarse como JSON.

## Privacidad

La generación del QR, el procesamiento de logos y la lectura de imágenes se realizan en el navegador.

QR Studio no necesita un backend para generar o leer códigos QR. La cámara solo se solicita cuando se usa el lector y se libera al abandonar esa función o iniciar una nueva sesión de lectura.

> Un QR estático no caduca por sí mismo. Si contiene una URL, PDF u otro recurso externo, ese destino sí debe continuar disponible para que el QR siga siendo útil.

## Stack

| Capa | Tecnología |
| --- | --- |
| Interfaz | HTML5 + CSS3 |
| Lógica | JavaScript vanilla |
| Generación QR | Motor local en `public/qr-engine.js` |
| Lectura QR | jsQR |
| Desarrollo / build | Vite 5 |
| Deploy opcional | GitHub Pages mediante `gh-pages` |

No se utiliza React, Vue, Angular ni un backend para la generación.

## Estructura

```text
generator-qr/
├── public/
│   ├── app.js              # Lógica de interfaz y herramientas
│   ├── qr-engine.js        # Codificación QR
│   └── jsqr.js             # Lector QR de terceros
├── index.html              # Interfaz principal
├── styles.css              # Estilos
├── logo.svg                # Identidad visual
├── package.json
├── package-lock.json
├── vite.config.js
├── THIRD_PARTY_NOTICES.md
├── licenses/
│   ├── jsQR-APACHE-2.0.txt
│   └── MIT-NAYUKI.txt
└── README.md
```

Los scripts clásicos se mantienen en `public/` para que Vite los copie sin modificarlos al build de producción.

## Desarrollo local

### Requisitos

- Node.js 18 o superior.
- npm.

### Instalar

```bash
git clone https://github.com/jayroanghelo/generator-qr.git
cd generator-qr
npm install
```

### Ejecutar

```bash
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Build de producción

```bash
npm run build
```

El resultado se genera en:

```text
dist/
```

La configuración usa una base relativa, por lo que el build puede servirse desde la raíz de un dominio o desde un subdirectorio.

Para probar exactamente el build:

```bash
npm run preview
```

## Deploy en GitHub Pages

Con las dependencias instaladas:

```bash
npm run build
npm run deploy
```

El script publica el contenido de `dist/` mediante `gh-pages`.

## APIs del navegador utilizadas

Algunas funciones dependen de APIs modernas del navegador:

- `Canvas API` para renderizado y exportación.
- `FileReader` para logos, imágenes, TXT, CSV y configuraciones.
- `MediaDevices.getUserMedia()` para la cámara.
- `Clipboard API` para copiar imágenes o texto.
- `localStorage` para plantillas e historial.

La cámara y algunas funciones del portapapeles requieren un contexto seguro, normalmente HTTPS o localhost.

## Límites actuales

- Los QR generados son estáticos; QR Studio no ofrece redirecciones dinámicas ni analítica.
- Los lotes están limitados a 500 entradas por operación.
- La eliminación de fondo del logo es un procesamiento local sencillo basado en color, no segmentación por IA.
- El lector depende de la calidad, enfoque y contraste de la imagen.
- Los CSV están pensados para una entrada por fila; en modo URL se intenta detectar automáticamente la columna que contiene el enlace.

## Dependencias y créditos

QR Studio incluye código de terceros para funciones concretas:

- **jsQR**, utilizado para leer códigos QR, bajo Apache License 2.0.
- El núcleo de codificación de `qr-engine.js` está adaptado en parte del proyecto **QR Code generator library** de Project Nayuki, bajo MIT License.

Consulta [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) y [licenses/](./licenses/) para los avisos correspondientes.

## Contribuir

Los issues y pull requests son bienvenidos para bugs, compatibilidad, accesibilidad o mejoras acotadas.

Antes de abrir un PR:

1. Crea una rama desde `main`.
2. Mantén el proyecto en JavaScript vanilla.
3. No añadas un backend para funciones que puedan resolverse localmente.
4. Ejecuta `npm run build` antes de enviar los cambios.
5. Comprueba generación, descarga y lectura de QR en escritorio y móvil.

## Licencia del proyecto

Este repositorio no incluye actualmente una licencia open source para el código propio de QR Studio.

Las dependencias y fragmentos de terceros mantienen sus respectivas licencias, detalladas en [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

---

<div align="center">

Creado por **[Jayro Anghelo](https://jayroanghelo.com)**.

</div>
