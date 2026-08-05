---
title: "3 - DOM XSS using web messages and JSON.parse"
---

# 3 - DOM XSS using web messages and JSON.parse

```javascript
window.addEventListener('message', function(e) {
    var iframe = document.createElement('iframe'),
        ACMEplayer = {
            element: iframe
        },
        d;
    document.body.appendChild(iframe);
    try {
        d = JSON.parse(e.data); #Lo convierte en un elemento de tipo JSON
    } catch (e) {
        return;
    }
    switch (d.type) {
        case "page-load":
            ACMEplayer.element.scrollIntoView();
            break;
        case "load-channel":
            ACMEplayer.element.src = d.url;
            break;
        case "player-height-changed":
            ACMEplayer.element.style.width = d.width + "px";
            ACMEplayer.element.style.height = d.height + "px";
            break;
    }
}, false);
```

Este código JavaScript escucha los mensajes enviados a la ventana del navegador (`window`) y ejecuta ciertas acciones en función del contenido del mensaje. A continuación, te explico el código paso a paso:

### 1. **Escuchador de Eventos (`window.addEventListener('message', ...)`):**
   - **Función**: El código adjunta un *event listener* al evento `message` de la ventana, que se activa cuando la ventana recibe un mensaje de otro contexto (por ejemplo, de un iframe o de otra ventana del navegador).
   - **Evento**: `message`. Este evento ocurre cuando se recibe un mensaje desde otra ventana o iframe utilizando `window.postMessage`.

### 2. **Creación de un iframe (`var iframe = document.createElement('iframe')`):**
   - Cuando se recibe un mensaje, el código crea un nuevo elemento `iframe` y lo agrega al cuerpo del documento (`document.body.appendChild(iframe)`).
   - **`ACMEplayer`**: Se crea un objeto llamado `ACMEplayer` con una propiedad `element` que apunta al iframe recién creado. Este objeto parece estar pensado para gestionar el iframe.

### 3. **Intento de Parseo del Mensaje (`try { d = JSON.parse(e.data); } catch(e) { return; }`):**
   - El código intenta interpretar el mensaje recibido (`e.data`) ==como un objeto JSON== usando `JSON.parse`. Si el parseo falla (por ejemplo, si el mensaje no es un JSON válido), se interrumpe la ejecución (`return`).

### 4. **Manejo del Mensaje (`switch(d.type) {...}`):**
   - Dependiendo del valor de `d.type`, se ejecuta una de las siguientes acciones:
     - **`case "page-load":`**
       - Mueve el iframe al área visible del viewport usando `scrollIntoView()`.
     - **`case "load-channel":`**
       - Establece la URL del iframe a `d.url`. Esto hace que el iframe cargue la página en esa URL.
     - **`case "player-height-changed":`**
       - Ajusta las dimensiones del iframe (ancho y alto) a los valores `d.width` y `d.height` recibidos en el mensaje.


==Payload que ejecuta print()==

**Desde consola :** 

postMessage("{\"type\":\"load-channel\",\"url\":\"javascript:print()\"}","*")

**Desde exploit server :** 
`
&lt;iframe src=https://YOUR-LAB-ID.web-security-academy.net/ onload='this.contentWindow.postMessage("{\"type\":\"load-channel\",\"url\":\"javascript:print()\"}","*")'>
