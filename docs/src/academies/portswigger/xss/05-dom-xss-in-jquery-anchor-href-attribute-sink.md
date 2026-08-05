---
title: "05 - DOM XSS in jQuery anchor href attribute sink using location.search source"
---

# 05 - DOM XSS in jQuery anchor href attribute sink using location.search source

### jQuery para actualizar el enlace de retorno

```javascript
$(function() {
    $('#backLink').attr("href", (new URLSearchParams(window.location.search)).get('returnPath'));
});
```

#### Explicación:
- **`$(function() {...})`:** Este es un atajo en jQuery que ejecuta la función interna cuando el DOM está completamente cargado. Es similar a `document.addEventListener("DOMContentLoaded", function() {...})` en JavaScript puro.
- **`$('#backLink')`:** Selecciona un elemento del DOM con el `id` igual a `backLink`. El símbolo `#` indica que es un `id`.
- **`attr("href", ...)`**: Este método establece un atributo HTML, en este caso, el atributo `href` del enlace seleccionado. 
- **`new URLSearchParams(window.location.search)`**: Crea un objeto `URLSearchParams` a partir de la cadena de consulta (query string) de la URL actual. `window.location.search` devuelve la parte de la URL después del `?`, que contiene los parámetros de la consulta.
- **`.get('returnPath')`**: Obtiene el valor del parámetro `returnPath` de la URL.

**Función general:**
- El código toma el valor del parámetro `returnPath` de la URL actual y lo asigna al atributo `href` del enlace con `id="backLink"`. Esto permite que el enlace "backLink" redirija al usuario a la URL especificada en `returnPath`.

==Backlink es un enlace, hay una función que tiene un listener que espera a que el dom esté cargado para poner como href del enlace el valor del parámetro returnPath de la url.==
javascript:alert()

### JavaScript para manejar el envío del formulario de comentarios

#### Código:

```javascript
document.getElementById("feedbackForm").addEventListener("submit", function(e) {
    submitFeedback(this.getAttribute("method"), this.getAttribute("action"), this.getAttribute("enctype"), this.getAttribute("personal"), new FormData(this));
    e.preventDefault();
});
```

#### Explicación:
- **`document.getElementById("feedbackForm")`:** Selecciona el formulario con el `id="feedbackForm"`.
- **`addEventListener("submit", function(e) {...})`:** Agrega un evento que se ejecuta cuando el formulario se envía. El evento `submit` es capturado y manejado por la función.
- **`submitFeedback(...)`**: Llama a la función `submitFeedback` pasando varios atributos del formulario:
  - `method`: El método HTTP (`GET`, `POST`, etc.).
  - `action`: La URL a la que se envía el formulario.
  - `enctype`: El tipo de codificación usado en el envío de datos (`multipart/form-data`, `application/x-www-form-urlencoded`, etc.).
  - `personal`: Un atributo personalizado que podría controlar si el mensaje de respuesta es personalizado.
  - `new FormData(this)`: Crea un objeto `FormData` que contiene los datos del formulario.
- **`e.preventDefault()`**: Previene el comportamiento predeterminado del formulario, que es recargar la página al enviar.

#### Función `submitFeedback`:

```javascript
function submitFeedback(method, path, encoding, personal, data) {
    var XHR = new XMLHttpRequest();
    XHR.open(method, path);
    if (personal) {
        XHR.addEventListener("load", displayFeedbackMessage(data.get('name')));
    } else {
        XHR.addEventListener("load", displayFeedbackMessage());
    }
    if (encoding === "multipart/form-data") {
        XHR.send(data);
    } else {
        var params = new URLSearchParams(data);
        XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        XHR.send(params.toString());
    }
}
```

#### Explicación:
- **`new XMLHttpRequest()`**: Crea un nuevo objeto `XMLHttpRequest` para realizar una solicitud HTTP.
- **`XHR.open(method, path)`**: Inicializa una solicitud con el método (`GET`, `POST`, etc.) y la URL especificados.
- **`XHR.addEventListener("load", displayFeedbackMessage(...))`**: Agrega un evento para manejar la respuesta cuando la solicitud se complete con éxito (`load`). Dependiendo del valor de `personal`, se llama a `displayFeedbackMessage` con o sin el nombre del usuario.
- **`if (encoding === "multipart/form-data") {...}`**: Verifica si el formulario está usando `multipart/form-data`, que es necesario para enviar archivos.
  - **`XHR.send(data)`**: Envía los datos del formulario como están (para `multipart/form-data`).
  - **`else {...}`**: Si no es `multipart/form-data`, convierte los datos del formulario en una cadena de consulta URL (`application/x-www-form-urlencoded`), establece el encabezado `Content-Type` y envía la solicitud.

#### Función `displayFeedbackMessage`:

```javascript
function displayFeedbackMessage(name) {
    return function() {
        var feedbackResult = document.getElementById("feedbackResult");
        if (this.status === 200) {
            feedbackResult.innerHTML = "Thank you for submitting feedback" + (name ? ", " + name : "") + "!";
            feedbackForm.reset();
        } else {
            feedbackResult.innerHTML =  "Failed to submit feedback: " + this.responseText;
        }
    }
}
```

#### Explicación:
- **`displayFeedbackMessage(name)`**: Esta función genera una función (closure) que se ejecutará cuando la solicitud HTTP se complete.
- **`this.status === 200`**: Verifica si la solicitud fue exitosa (`200` es el código de estado HTTP para "OK").
- **`feedbackResult.innerHTML = ...`**: Muestra un mensaje de éxito o de error en un elemento con `id="feedbackResult"`.
- **`feedbackForm.reset()`**: Si la solicitud fue exitosa, restablece el formulario (`feedbackForm`) para que esté vacío.
