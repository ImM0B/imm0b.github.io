---
title: "12 - Reflected DOM XSS (Eval)"
---

# 12 - Reflected DOM XSS (Eval)

https://youtu.be/bg_xH4Dp-6E


```javascript
function search(path) {
```
- **`function search(path)`**: Define una función llamada `search` que acepta un argumento `path`. Este argumento es una cadena que representa la ruta a la que se enviará una solicitud HTTP.

```javascript
    var xhr = new XMLHttpRequest();
```
- **`var xhr = new XMLHttpRequest();`**: Crea un nuevo objeto `XMLHttpRequest`, ==que se usa para realizar solicitudes HTTP asíncronas que esperan xml== a un servidor.

```javascript
    xhr.onreadystatechange = function() {
```
- **`xhr.onreadystatechange = function() {`**: Define una función de devolución de llamada (callback) que se ejecutará cada vez que cambie el estado de `xhr` (por ejemplo, cuando se reciba una respuesta del servidor).

```javascript
        if (this.readyState == 4 && this.status == 200) { 
```
- **`if (this.readyState == 4 && this.status == 200) {`**: Comprueba si la solicitud ha terminado (`readyState == 4`) y si se recibió una respuesta exitosa (`status == 200`).

```javascript
            eval('var searchResultsObj = ' + this.responseText);
```
- **`eval('var searchResultsObj = ' + this.responseText);`**: Utiliza `eval` para ejecutar el código contenido en `this.responseText`, creando un objeto `searchResultsObj`. `this.responseText` contiene la respuesta del servidor en formato de texto, que aquí se espera sea un JSON.

```javascript
            displaySearchResults(searchResultsObj);
```
- **`displaySearchResults(searchResultsObj);`**: Llama a la función `displaySearchResults`, pasando el objeto `searchResultsObj` como argumento. Esta función se encarga de mostrar los resultados de la búsqueda en la página.

```javascript
        }
```
- **`}`**: Cierra el bloque `if`.

```javascript
    };
```
- **`};`**: Cierra la función anónima asignada a `xhr.onreadystatechange`.

```javascript
    xhr.open("GET", path + window.location.search); 
```
- **`xhr.open("GET", path + window.location.search);`**: Abre una solicitud HTTP de tipo `GET` a la URL que es la combinación de `path` y `window.location.search` (la parte de consulta de la URL actual). Esto configura la solicitud, pero aún no la envía.

```javascript
    xhr.send();
```
- **`xhr.send();`**: Envía la solicitud HTTP al servidor.

```javascript
    function displaySearchResults(searchResultsObj) {
```
- **`function displaySearchResults(searchResultsObj)`**: Define la función `displaySearchResults`, que toma `searchResultsObj` como argumento y se encarga de mostrar los resultados de la búsqueda en la página web.

```javascript
        var blogHeader = document.getElementsByClassName("blog-header")[0];
        var blogList = document.getElementsByClassName("blog-list")[0];
```
- **`var blogHeader = document.getElementsByClassName("blog-header")[0];`**: Obtiene el primer elemento del DOM con la clase `blog-header` y lo almacena en la variable `blogHeader`.
- **`var blogList = document.getElementsByClassName("blog-list")[0];`**: Obtiene el primer elemento del DOM con la clase `blog-list` y lo almacena en la variable `blogList`.

```javascript
        var searchTerm = searchResultsObj.searchTerm
        var searchResults = searchResultsObj.results
```
- **`var searchTerm = searchResultsObj.searchTerm;`**: Extrae el término de búsqueda desde `searchResultsObj` y lo guarda en la variable `searchTerm`.
- **`var searchResults = searchResultsObj.results;`**: Extrae los resultados de búsqueda desde `searchResultsObj` y los guarda en la variable `searchResults`.

```javascript
        var h1 = document.createElement("h1");
        h1.innerText = searchResults.length + " search results for '" + searchTerm + "'";
        blogHeader.appendChild(h1);
        var hr = document.createElement("hr");
        blogHeader.appendChild(hr)
```
- **`var h1 = document.createElement("h1");`**: Crea un nuevo elemento `<h1>`.
- **`h1.innerText = searchResults.length + " search results for '" + searchTerm + "'";`**: Establece el texto del elemento `<h1>` para mostrar el número de resultados de búsqueda encontrados y el término de búsqueda.
- **`blogHeader.appendChild(h1);`**: Añade el elemento `<h1>` al elemento `blogHeader`.
- **`var hr = document.createElement("hr");`**: Crea un nuevo elemento `<hr>` (una línea horizontal).
- **`blogHeader.appendChild(hr);`**: Añade el elemento `<hr>` al elemento `blogHeader`.

```javascript
        for (var i = 0; i < searchResults.length; ++i)
        {
            var searchResult = searchResults[i];
```
- **`for (var i = 0; i < searchResults.length; ++i)`**: Inicia un bucle `for` que itera a través de cada resultado de búsqueda.
- **`var searchResult = searchResults[i];`**: Obtiene el resultado de búsqueda en la posición `i` del array `searchResults` y lo guarda en la variable `searchResult`.

```javascript
            if (searchResult.id) {
                var blogLink = document.createElement("a");
                blogLink.setAttribute("href", "/post?postId=" + searchResult.id);
```
- **`if (searchResult.id) {`**: Verifica si el resultado de búsqueda tiene un `id`.
- **`var blogLink = document.createElement("a");`**: Crea un nuevo elemento `<a>` (enlace).
- **`blogLink.setAttribute("href", "/post?postId=" + searchResult.id);`**: Establece el atributo `href` del enlace para que apunte a la URL del post correspondiente al `id` del resultado de búsqueda.

```javascript
                if (searchResult.headerImage) {
                    var headerImage = document.createElement("img");
                    headerImage.setAttribute("src", "/image/" + searchResult.headerImage);
                    blogLink.appendChild(headerImage);
                }
```
- **`if (searchResult.headerImage) {`**: Verifica si el resultado de búsqueda tiene una imagen de encabezado (`headerImage`).
- **`var headerImage = document.createElement("img");`**: Crea un nuevo elemento `<img>` (imagen).
- **`headerImage.setAttribute("src", "/image/" + searchResult.headerImage);`**: Establece el atributo `src` de la imagen para que apunte a la URL de la imagen de encabezado.
- **`blogLink.appendChild(headerImage);`**: Añade la imagen como hijo del enlace (`<a>`).

```javascript
                blogList.appendChild(blogLink);
            }
```
- **`blogList.appendChild(blogLink);`**: Añade el enlace (`<a>`) con la imagen de encabezado al elemento `blogList`.

```javascript
            blogList.innerHTML += "<br/>";
```
- **`blogList.innerHTML += "<br/>";`**: Añade un salto de línea (`<br/>`) al contenido HTML del elemento `blogList`.

```javascript
            if (searchResult.title) {
                var title = document.createElement("h2");
                title.innerText = searchResult.title;
                blogList.appendChild(title);
            }
```
- **`if (searchResult.title) {`**: Verifica si el resultado de búsqueda tiene un título (`title`).
- **`var title = document.createElement("h2");`**: Crea un nuevo elemento `<h2>` (encabezado).
- **`title.innerText = searchResult.title;`**: Establece el texto del encabezado `<h2>` con el título del resultado de búsqueda.
- **`blogList.appendChild(title);`**: Añade el encabezado `<h2>` al elemento `blogList`.

```javascript
            if (searchResult.summary) {
                var summary = document.createElement("p");
                summary.innerText = searchResult.summary;
                blogList.appendChild(summary);
            }
```
- **`if (searchResult.summary) {`**: Verifica si el resultado de búsqueda tiene un resumen (`summary`).
- **`var summary = document.createElement("p");`**: Crea un nuevo elemento `<p>` (párrafo).
- **`summary.innerText = searchResult.summary;`**: Establece el texto del párrafo `<p>` con el resumen del resultado de búsqueda.
- **`blogList.appendChild(summary);`**: Añade el párrafo `<p>` al elemento `blogList`.

```javascript
            if (searchResult.id) {
                var viewPostButton = document.createElement("a");
                viewPostButton.setAttribute("class", "button is-small");
                viewPostButton.setAttribute("href", "/post?postId=" + searchResult.id);
                viewPostButton.innerText = "View post";
            }
```
- **`if (searchResult.id) {`**: Verifica nuevamente si el resultado de búsqueda tiene un `id`.
- `var viewPostButton = document.createElement("a");`**: Crea un nuevo elemento `<a>` (enlace), que se utilizará como botón para ver la publicación completa.
- **`viewPostButton.setAttribute("class", "button is-small");`**: Establece la clase del enlace para que se estilice como un botón pequeño.
- **`viewPostButton.setAttribute("href", "/post?postId=" + searchResult.id);`**: Establece el atributo `href` del botón para que apunte a la URL del post correspondiente.
- **`viewPostButton.innerText = "View post";`**: Establece el texto del botón como "View post".

```javascript
        }

        var linkback = document.createElement("div");
        linkback.setAttribute("class", "is-linkback");
        var backToBlog = document.createElement("a");
        backToBlog.setAttribute("href", "/");
        backToBlog.innerText = "Back to Blog";
        linkback.appendChild(backToBlog);
        blogList.appendChild(linkback);
    }
}
```
- **`var linkback = document.createElement("div");`**: Crea un nuevo elemento `<div>` que se utilizará como contenedor para un enlace de retorno.
- **`linkback.setAttribute("class", "is-linkback");`**: Establece la clase del contenedor `<div>` como `is-linkback`.
- **`var backToBlog = document.createElement("a");`**: Crea un nuevo elemento `<a>` (enlace) que permitirá al usuario volver a la página principal del blog.
- **`backToBlog.setAttribute("href", "/");`**: Establece el atributo `href` del enlace para que apunte a la página principal del blog.
- **`backToBlog.innerText = "Back to Blog";`**: Establece el texto del enlace como "Back to Blog".
- **`linkback.appendChild(backToBlog);`**: Añade el enlace de retorno al contenedor `<div>`.
- **`blogList.appendChild(linkback);`**: Añade el contenedor `<div>` con el enlace de retorno al elemento `blogList`.

El script de abajo llama a una función del script de arriba:
```html
<script src="/resources/js/searchResults.js"></script>
<script>search('search-results')</script>
```

Si capturamos con el burpsuite se están haciendo dos peticiones, la get del propio servidor y la que realiza de forma asíncrona el código con :

```javascript
    xhr.open("GET", path + window.location.search); 
    xhr.send();
```

==Payload== -> `\"-alert()}//`
SI hacemos la petición asíncrona con texto normal : 

GET /search-results?search=regerg
```json
{"results":[],"searchTerm":"regerg"}
```

GET /search-results?search=\\"-alert()}//
```json
{"results":[],"searchTerm":"\"-alert()}//"}
{"results":[],"searchTerm":""-alert()}//"}
```

SI le pasamos una doble comilla , esta se escapa con \\", podemos escaparla con \\\\"

La razón por la cual `"{"results":[],"searchTerm":""-alert()}//"}` funciona y es interpretado correctamente por JavaScript se debe a la manera en que `eval` procesa el código y cómo la sintaxis de JavaScript trata las cadenas, los operadores y los comentarios.

### Análisis del código:

1. **Estructura JSON**:
   ```json
   {"results":[],"searchTerm":""-alert()}//}
   ```
   Este es un JSON que contiene un array vacío `results` y una propiedad `searchTerm`.

2. **Parte conflictiva**:
   - `"searchTerm": ""-alert()}//"`
   - Aquí, `"searchTerm": ""` es una cadena vacía asignada a `searchTerm`.
   - Luego, `-alert()` es un intento de realizar una operación matemática (resta) con la función `alert()`.
   - Finalmente, `}//` es un comentario de una sola línea en JavaScript.

### Cómo lo procesa `eval`:

1. **Primero**: `eval` evalúa el JSON como un string de código JavaScript.
2. **Cadena vacía**: 
   ```javascript
   "searchTerm": ""
   ```
   Esto asigna una cadena vacía a `searchTerm`.
   
3. **Operación de resta**:
   ```javascript
   -alert()
   ```
   Aquí, el operador de resta intenta aplicar `-` a lo que retorna `alert()`. En JavaScript, `alert()` retorna `undefined`, por lo que el resultado sería `NaN` (Not a Number) porque no puedes restar `undefined`.

4. **Comentarios en JavaScript**:
   ```javascript
   // Esto es un comentario
   ```
   Después de la función `alert()`, el resto del código `}//` es tratado como un comentario, por lo que es ignorado.

### Por qué funciona:

- **`eval` permite la ejecución dinámica** de código JavaScript, lo que significa que cualquier código pasado en forma de string es evaluado como si fuera código JavaScript regular.
  
- **Los comentarios en JSON no son válidos,** pero `eval` lo interpreta como un código de JavaScript, no como JSON puro, y trata `//` como un comentario, ignorando el resto de la línea.

- **El JSON se procesa hasta que llega al comentario**, y debido a que JavaScript permite este tipo de sintaxis, el código no lanza un error.


Básicamente hay diferencia entre usar eval() y usar json.parse()
Con eval estamos interpretando objetos javascript, el siguinte bloque es código válido JS :
```json
   {"results":[],"searchTerm":""-alert()}
   ```
Por eso cuando usamos eval() es ejecuta.
SI usamos json.parse() no se ejecuta y da un error , porque no es json, no podemos meter valores fuera de las comillas
