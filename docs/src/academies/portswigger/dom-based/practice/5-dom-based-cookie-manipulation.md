---
title: "5 - DOM-based cookie manipulation"
---

# 5 - DOM-based cookie manipulation

```html
<script>
    document.cookie = 'lastViewedProduct=' + window.location + '; SameSite=None; Secure'
</script>
```

Guarda una cookie llamada lastViewedProduct como la url actual.

- **`SameSite=None`**: Permite que la cookie se envíe junto con solicitudes de sitios cruzados (cross-site requests). Esto es necesario para que la cookie se envíe en escenarios como formularios POST desde un dominio diferente.
- **`Secure`**: La cookie solo se enviará a través de conexiones HTTPS, asegurando que no se transmita en texto claro.

La cookie actualizará el valor del enlace "Last Viewed Product" que al actualizar la página se reflejará en el DOM, si pulsamos en el enlace se ejecuta print()

==Como explotarlo en el lab:==

```html
<iframe 
  src="https://0a4000310477b9b68292a3cf002b0064.web-security-academy.net/product?productId=1&'><script>print()</script>" 
  onload="if(!window.x)this.src='https://YOUR-LAB-ID.web-security-academy.net';window.x=1;">
</iframe>
```

### Desglose del `onload`:

```javascript
onload="if(!window.x)this.src='https://YOUR-LAB-ID.web-security-academy.net';window.x=1;"
```

1. **`if(!window.x)`**:
   - Este es un condicional que verifica si `window.x` no está definido o es `false` (en otras palabras, si es la primera vez que se carga el `iframe`).
   - `window.x` es una propiedad global que se está utilizando para rastrear si esta es la primera carga del `iframe`. Si `window.x` no está definido, el código dentro del `if` se ejecuta.

2. **`this.src='https://YOUR-LAB-ID.web-security-academy.net'`**:
   - `this` se refiere al `iframe` en sí.
   - Si la condición anterior es verdadera (`window.x` no está definido), entonces la fuente (`src`) del `iframe` se cambia a `'https://YOUR-LAB-ID.web-security-academy.net'`.
   - Esto significa que, después de que el `iframe` ha cargado inicialmente la URL con el `productId=1` y el script de `print()`, se recarga con una nueva URL (`https://YOUR-LAB-ID.web-security-academy.net`).

3. **`window.x=1`**:
   - Una vez que la URL del `iframe` ha sido cambiada, `window.x` se establece en `1`.
   - Esto asegura que la próxima vez que el `iframe` se cargue (debido al cambio de `src`), la condición `if(!window.x)` no se cumplirá, evitando un ciclo infinito de recargas.

En resumen cada vez que se establece un nuevo src se vuelve a cargar el iframe, el manejo de window.x se hace con el mótivo de no recibir recargas infinitas
