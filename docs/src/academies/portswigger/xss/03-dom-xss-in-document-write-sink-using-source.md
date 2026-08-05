---
title: "03 - DOM XSS in document.write sink using source location.search"
---

# 03 - DOM XSS in document.write sink using source location.search

==¿Como sacar todos los scripts de una página web?==
### **Extraer los `<script>` usando la función de búsqueda**
   - Una vez que tengas todas las páginas en el "Target", ve a la pestaña **"Target"** y selecciona el sitio web que quieres analizar.
   - Haz clic derecho en el dominio del sitio web y selecciona **"Engagement tools"** > **"Find scripts"**.
   - Aparecerá un cuadro de búsqueda donde puedes buscar por etiquetas específicas.
   - Busca la etiqueta `<script>`. Esto te mostrará todas las instancias de `<script>` en las páginas capturadas.
   - Puedes hacer clic en los resultados para ver más detalles y copiar el código de los scripts si lo necesitas.

```javascript
function trackSearch(query) {
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+query+'">');
}
var query = (new URLSearchParams(window.location.search)).get('search');
  if(query) {
    trackSearch(query);
}
```
