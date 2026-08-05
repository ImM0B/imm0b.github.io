---
title: "4 - Targeted web cache poisoning using an unknown header"
---

# 4 - Targeted web cache poisoning using an unknown header

1.  Para que una solicitud (_request_) obtenga una respuesta cacheada cuando se utiliza la cabecera `Vary`, es necesario que los valores de los encabezados especificados en `Vary` coincidan exactamente con los valores de la solicitud que generó la respuesta cacheada. En este caso User-Agent
2. Buscamos una forma de robarle el User-Agent al objetivo (keyed input)  y la enviamos en la request junto con un xss en la cabecera X-Host (unkeyed inpt) `onerror="alert(document.cookie)"`

La cabecera `Vary` en HTTP es utilizada para optimizar el almacenamiento en caché de las respuestas en servidores intermedios, como proxies y CDNs, y también en el propio navegador del usuario. Su función principal es indicar qué encabezados de la solicitud deben ser tenidos en cuenta para determinar si una respuesta almacenada en caché es válida para una solicitud particular. Esto permite que el almacenamiento en caché sea más específico y contextual.

### ¿Cómo Funciona la Cabecera `Vary`?

La cabecera `Vary` le dice al sistema de caché qué encabezados de la solicitud original son relevantes para generar una respuesta específica. Si una solicitud posterior tiene los mismos valores en los encabezados indicados en `Vary`, la respuesta en caché se reutiliza. Si no, se omite la caché y se envía una nueva solicitud al servidor.

### Ejemplos de Uso de `Vary`

1. **Controlar Caché en Función del Idioma**:
   - Si tienes un sitio web que responde en distintos idiomas, puedes utilizar la cabecera `Vary: Accept-Language` para que las respuestas en caché se adapten según el encabezado `Accept-Language` de la solicitud.
   - Ejemplo:
     ```http
     Vary: Accept-Language
     ```
   - Esto significa que si un usuario solicita el recurso en `es-ES` y otro en `en-US`, cada uno tendrá una respuesta cacheada según el idioma.

2. **Adaptar Respuesta Según el Tipo de Contenido**:
   - Puedes usar `Vary: Accept-Encoding` para ofrecer respuestas comprimidas o sin comprimir, según lo que acepte el cliente en su encabezado `Accept-Encoding`.
   - Ejemplo:
     ```http
     Vary: Accept-Encoding
     ```
   - Esto es útil si el servidor admite tanto respuestas comprimidas con `gzip` como sin compresión, y permite que la caché almacene ambas versiones.

3. **Uso Combinado de Encabezados**:
   - Puedes combinar varios encabezados en `Vary` para lograr un control más fino.
   - Ejemplo:
     ```http
     Vary: Accept-Encoding, User-Agent
     ```
   - Aquí, el sistema de caché considera tanto la compresión (`Accept-Encoding`) como el tipo de cliente (`User-Agent`), útil si tienes que ajustar el contenido para diferentes navegadores.

### Ejemplo Completo

Supón que tienes una respuesta de imagen adaptada para dispositivos móviles y de escritorio. Para eso, podrías usar:

```http
Vary: User-Agent
```

De esta manera, el sistema de caché almacena una versión para móviles y otra para escritorio, asegurando que cada dispositivo obtenga la versión óptima sin reconsultar el servidor.

### Beneficios de la Cabecera `Vary`

- **Optimización del Caché**: Permite que las respuestas en caché sean más específicas, evitando respuestas inadecuadas.
- **Reducción de la Carga en el Servidor**: Mejora la eficiencia del sistema de caché al reducir las solicitudes innecesarias al servidor.
- **Mejora de la Experiencia del Usuario**: Permite una entrega de contenido más rápida y específica según las preferencias del usuario (idioma, compresión, etc.).

### Consideraciones
