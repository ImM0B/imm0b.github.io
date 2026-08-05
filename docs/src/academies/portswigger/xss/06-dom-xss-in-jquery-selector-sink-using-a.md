---
title: "06 - DOM XSS in jQuery selector sink using a hashchange event"
---

# 06 - DOM XSS in jQuery selector sink using a hashchange event

https://youtu.be/5OiWO5Qr-iI

```javascript
$(window).on('hashchange', function(){
                            var post = $('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')');
                            if (post) post.get(0).scrollIntoView();
                        });
```

Este código es un fragmento de JavaScript que se ejecuta en un entorno de navegador y utiliza jQuery para realizar una acción específica cuando cambia el hash en la URL (es decir, la parte de la URL después del `#`). Voy a desglosar lo que hace línea por línea:

1. **`$(window).on('hashchange', function(){`**  
   Este código adjunta un controlador de eventos al objeto `window` que escucha el evento `hashchange`. ==El evento `hashchange` se dispara cada vez que el hash en la URL cambia,== es decir, cuando cambias la parte de la URL después del `#`.

2. **`var post = $('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')');`**  
   Aquí se define una variable `post` que contiene un elemento del DOM (Document Object Model). Este selector busca un elemento `h2` dentro de un `section` con la clase `blog-list` que contiene el texto del hash actual.  

   - `decodeURIComponent(window.location.hash.slice(1))`:  
     - `window.location.hash` obtiene el hash de la URL actual, incluyendo el `#` al inicio.
     - `.slice(1)` elimina el `#` del inicio del hash.
     - `decodeURIComponent()` decodifica cualquier carácter especial en la URL (como `%20` por espacios) en su representación normal.
   - `$('section.blog-list h2:contains(...)')`: Este es un selector de jQuery que busca un elemento `h2` dentro de la sección con la clase `blog-list` que contiene el texto del hash.

3. **`if (post) post.get(0).scrollIntoView();`**  
   Aquí se verifica si se ha encontrado el elemento `post`. Si existe, el código llama al método `scrollIntoView()` en ese elemento. Este método desplaza la página automáticamente para que el elemento `h2` encontrado sea visible en la ventana del navegador.

### Resumen

Este código escucha los cambios en el hash de la URL y, cuando detecta uno, busca un encabezado `h2` dentro de una sección con la clase `blog-list` que contenga el texto correspondiente al hash. Si encuentra tal encabezado, desplaza la página hasta que ese encabezado esté visible.

==Mi explicación :== 

window.location.hash -> retorna el valor completo \#text
window.location.hash.slice(1) -> text

A pesar de que no exista el elemento `<img%20src=1%20onerror=print()>` , se crea en tiempo de ejecución , no se guarda en el dom.
var post = $('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')');

Solución : 

```javascript
<iframe 
  src="https://0af700c504488d60810d93da00ab0042.web-security-academy.net/" 
  onload="this.src+='#<img%20src=1%20onerror=print()>'">
</iframe>
```
