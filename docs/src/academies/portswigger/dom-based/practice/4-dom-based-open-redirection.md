---
title: "4 - DOM-based open redirection"
---

# 4 - DOM-based open redirection

El código que has proporcionado es un fragmento HTML con una etiqueta `<a>` que incluye un manejador de eventos `onclick` en JavaScript. Vamos a desglosarlo para entender cómo funciona y sus posibles implicaciones.

### Código Desglosado:

```html
<a href='#' onclick='
    returnUrl = /url=(https?:\/\/.+)/.exec(location);
    location.href = returnUrl ? returnUrl[1] : "/";
'>Back to Blog</a>
```

### ¿Qué hace este código?

1. **Enlace (`<a href='#'>`)**:
   - Este es un enlace que no lleva a ninguna URL específica, sino que tiene un manejador de eventos `onclick` que se ejecuta cuando el usuario hace clic en él.

2. **Manejador de Eventos `onclick`**:
   - **Expresión Regular**: `returnUrl = /url=(https?:\/\/.+)/.exec(location);`
     - Aquí se usa una expresión regular para buscar un patrón específico en la URL actual del navegador (`location`). El patrón busca una subcadena que comience con `url=` seguida de `http://` o `https://` y cualquier otro carácter (`.+`).
     - Si encuentra una coincidencia, la almacena en `returnUrl`.
   - **Redirección**: `location.href = returnUrl ? returnUrl[1] : "/";`
     - Si `returnUrl` contiene una coincidencia, la primera captura (`returnUrl[1]`, que sería la URL después de `url=`) se utiliza como el nuevo destino para `location.href`, es decir, redirige el navegador a esa URL.
     - Si no hay coincidencia (`returnUrl` es `null`), redirige al usuario a la raíz del sitio (`"/"`).

### Ejemplo de Uso:

Si un usuario visita una página con una URL como:

```
http://ejemplo.com/page?url=https://blog.ejemplo.com/post
```

Al hacer clic en el enlace, el script extraerá la URL después de `url=` y redirigirá al usuario a `https://blog.ejemplo.com/post`.
