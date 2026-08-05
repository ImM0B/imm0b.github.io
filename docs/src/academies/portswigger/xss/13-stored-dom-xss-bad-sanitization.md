---
title: "13 - Stored DOM XSS (Bad Sanitization)"
---

# 13 - Stored DOM XSS (Bad Sanitization)

Esta es una función para cargar los comentarios del endpoint /post/comment, se hace una petición GET /post/comment?postId=1 para obtener el json de un comentario en específico y se hace un post con csrf=y8eedikVPUiZFVDFK48JJjyUlfCegVs3&postId=9&comment=test&name=Test&email=test%40test.com&website= para publicar uno.

```javascript
function loadComments(postCommentPath) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let comments = JSON.parse(this.responseText);
            displayComments(comments);
        }
    };
    xhr.open("GET", postCommentPath + window.location.search);
    xhr.send();

    function escapeHTML(html) {
        return html.replace('<', '&lt;').replace('>', '&gt;');
    }

    function displayComments(comments) {
        let userComments = document.getElementById("user-comments");

        for (let i = 0; i < comments.length; ++i) //Itera sobre todos los comentarios
        {
            comment = comments[i];
            let commentSection = document.createElement("section");
            commentSection.setAttribute("class", "comment");

            let firstPElement = document.createElement("p");

            let avatarImgElement = document.createElement("img");
            avatarImgElement.setAttribute("class", "avatar");
            //Sanitiza el avatar
            avatarImgElement.setAttribute("src", comment.avatar ? escapeHTML(comment.avatar) : "/resources/images/avatarDefault.svg");

            if (comment.author) {
                if (comment.website) {
                    let websiteElement = document.createElement("a");
                    websiteElement.setAttribute("id", "author");
                    websiteElement.setAttribute("href", comment.website);
                    firstPElement.appendChild(websiteElement)
                }
                //Comenta el autor
                let newInnerHtml = firstPElement.innerHTML + escapeHTML(comment.author)
                firstPElement.innerHTML = newInnerHtml
            }
            if (comment.date) { //No se puede inyectar nada
                let dateObj = new Date(comment.date)
                let month = '' + (dateObj.getMonth() + 1);
                let day = '' + dateObj.getDate();
                let year = dateObj.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                dateStr = [day, month, year].join('-');

                let newInnerHtml = firstPElement.innerHTML + " | " + dateStr
                firstPElement.innerHTML = newInnerHtml
            }

            firstPElement.appendChild(avatarImgElement);

            commentSection.appendChild(firstPElement);

            if (comment.body) {
                let commentBodyPElement = document.createElement("p");
                //Sanitiza body
                commentBodyPElement.innerHTML = escapeHTML(comment.body);

                commentSection.appendChild(commentBodyPElement);
            }
            commentSection.appendChild(document.createElement("p"));

            userComments.appendChild(commentSection);
        }
    }
};
```

Tu explicación es correcta. Estás describiendo cómo un atacante puede eludir una protección de XSS que utiliza la función `replace()` en JavaScript para codificar los corchetes angulares (`<` y `>`) de manera insuficiente.

### Resumen del ataque:

1. **Protección Insuficiente:**
   - El sitio web intenta prevenir ataques de XSS utilizando la función `replace()` para reemplazar `<` y `>` por sus equivalentes codificados (`&lt;` y `&gt;`).
   - Sin embargo, si `replace()` se usa con un solo argumento como cadena (`'<', '&lt;'`), solo reemplaza la primera aparición de ese carácter en la cadena de entrada.

2. **Bypass del Filtro:**
   - Al insertar `<><img src=1 onerror=alert(1)>` como comentario, los primeros corchetes angulares (`<>`) son reemplazados por sus versiones codificadas, pero los siguientes (`<img src=1 onerror=alert(1)>`) quedan intactos.
   - Esto permite que el código `<img src=1 onerror=alert(1)>` se interprete como HTML, lo que puede resultar en la ejecución del código JavaScript contenido en la etiqueta `img`.

### Ejemplo de Código:

Si el código de la función `replace()` se usa incorrectamente de la siguiente manera:
```javascript
function sanitizeInput(input) {
    return input.replace('<', '&lt;').replace('>', '&gt;');
}
```

Y luego pasas el comentario malicioso:

```html
<><img src=1 onerror=alert(1)>
```

El resultado sería:
```html
&lt;&gt;<img src=1 onerror=alert(1)>
```

Los primeros corchetes angulares se codifican, pero el contenido siguiente se procesa como HTML válido, permitiendo la ejecución del `onerror=alert(1)`.

### Prevención Correcta:

Para mitigar adecuadamente este tipo de ataque, se debería usar una expresión regular global que reemplace todas las ocurrencias de los caracteres peligrosos:
```javascript
function sanitizeInput(input) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

O, idealmente, usar una biblioteca de sanitización probada y diseñada para prevenir XSS de manera segura.


**Para sanitizar esto lo que se debería hacer es guardarlo en la base de datos ya sanitizado, no sanitizarlo con código JS cuando vuelva del backend**
