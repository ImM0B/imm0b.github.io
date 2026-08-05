---
title: "11 - DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded"
---

# 11 - DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded

https://youtu.be/QpQp2JLn6JA

[Angular Sandbox Escape Cheatsheet · GitHub](https://gist.github.com/jeremybuis/38c01acae19fc2ac6959)

AngularJS is a popular JavaScript library, which scans the contents of HTML nodes containing the `ng-app` attribute (also known as an AngularJS directive).

Angular JS is deprecated and is going to be replace by Angular.

Las "double curly braces" (dobles llaves) se refieren a `{{` y `}}`. Estas se utilizan en varios contextos de programación y plantillas para diferentes propósitos. 

**AngularJS**:
   - En AngularJS, se utilizan dobles llaves para la vinculación de datos.
   - Ejemplo:
     ```html
     <p>&#123;&#123; expression &#125;&#125;</p>
     ```
     Aquí, `expression` es evaluada y su resultado se muestra en el HTML.

&#123;&#123;constructor.constructor('alert(1)')()&#125;&#125;

Defininimos una app y un controlador y los inicializamos

Esta es la forma clásica de crear una función

Podemos llamar al contructor de funciones y alojar en la variable test una función.
Si ponemos `Function('alert()')();` la estamos declarando y llamando en la misma función.

Es equivalente usar el constructor de funciones a llamar a `test.constructor('aqui se sobreescribe la función')`, estamos tomando la referencia a la función.

Si llamamos a `$on.constructor()` estamos sobreescribiendo la función con nuestros propios argumentos, estamos creando esa función y luego llamándola.
`$on.constructor('alert()')()`
No es posible usar `Function('alert()')();` en Angular directamente en el dom, por seguridad.

### Descomposición del Código

1. **`$on`**:
   - En el contexto de AngularJS, `$on` es una función que se utiliza para escuchar eventos.
   
2. **`.constructor`**:
   - En JavaScript, cualquier función tiene una propiedad `constructor`. La propiedad `constructor` de una función es una referencia a la función `Function`, que es el constructor de todas las funciones en JavaScript.
   - Esencialmente, `someFunction.constructor` es una referencia a `Function`.

3. **`('alert()')`**:
   - `Function` es un constructor de funciones. Al pasar una cadena de texto como argumento al constructor `Function`, JavaScript crea una nueva función cuyo cuerpo es el código en esa cadena.
   - `Function('alert()')` crea una nueva función que, cuando se ejecuta, mostrará un cuadro de alerta con el mensaje `undefined` (si no se pasa nada más).

4. **`()`**:
   - Esto invoca inmediatamente la función recién creada.
