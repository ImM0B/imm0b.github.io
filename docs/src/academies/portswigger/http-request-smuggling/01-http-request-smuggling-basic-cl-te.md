---
title: "01 - HTTP request smuggling, basic CL.TE vulnerability"
---

# 01 - HTTP request smuggling, basic CL.TE vulnerability

```HTTP
POST / HTTP/1.1
Host: vulnerable-website.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED
```

**Frontend**
13 Bytes -> `0\r\n\r\nSMUGGLED`

**Backend**

Lee hasta 0r\n\r\n

SMUGGLED cuela como una nueva petición al backend


---

### 💥 ¿Por qué es esto peligroso?

#### 1. **Inyección de solicitudes**

- El atacante puede "colar" la solicitud `SMUGGLED` sin que pase por filtros, firewalls, autenticación, etc.
    
- Ejemplo: puede inyectar un `GET /admin` o `DELETE /user/123`.
    

#### 2. **Bypass de seguridad**

- El servidor front-end cree que solo pasó una solicitud legítima.
    
- El servidor back-end procesa dos: una legítima y otra inyectada.
    

#### 3. **Secuestro de sesión**

- Si el contenido de `SMUGGLED` aprovecha cookies, sesiones u otros headers activos, puede acceder o modificar cosas sin autorización.
    

#### 4. **Cache poisoning**

- Puede envenenar el caché con respuestas maliciosas que luego otros usuarios reciben.
    

---


```http
POST / HTTP/1.1
Host: YOUR-LAB-ID.web-security-academy.net
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 6
Transfer-Encoding: chunked

0

G
```

---

### 🔬 ¿Qué pasa realmente?

#### 🔹 El **servidor front-end**:

- **No soporta `chunked encoding`**, por lo tanto **ignora el header `Transfer-Encoding: chunked`**.
    
- Solo interpreta `Content-Length: 6`.
    
- Entonces **considera el cuerpo de la solicitud como de solo 6 bytes**:
    
    ```
    0\r\n\r\nG
    ```
    
    Que son exactamente 6 bytes:
    
    - `0` → 1 byte
        
    - `\r\n` → 2 bytes
        
    - `\r\n` → 2 bytes
        
    - `G` → 1 byte  
        Total: 6 bytes
        
- Cree que el cuerpo termina ahí, y reenvía TODO lo que sigue al servidor back-end.
    

---

#### 🔹 El **servidor back-end**:

- **Sí interpreta `Transfer-Encoding: chunked`**, y ve que:
    
    - El chunk `0` indica que **termina la solicitud**.
        
    - Pero luego hay contenido sobrante:
        
        ```
        G
        ```
        
- Esto lo trata como **el inicio de la siguiente solicitud**:
    
    ```
    GPOST / HTTP/1.1
    ...
    ```
    
- En algún momento, el navegador, proxy o herramienta como Burp puede enviar una solicitud real `POST / HTTP/1.1...`, que se pegará justo después de la `G`, formando:  
    **`GPOST`** (una palabra malformada, pero detectada como una nueva petición inválida).
    
---

Cuando reenviemos la solicitud del repeater, se enviará un GPOST, porque se concatenará la G con la segunda petición.

# **Acordarse de usar HTTP1.1**
