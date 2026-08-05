---
title: "07 - Reflected XSS into attribute with angle brackets HTML-encoded"
---

# 07 - Reflected XSS into attribute with angle brackets HTML-encoded

https://www.youtube.com/watch?v=Nhk9arXIM94

```html
<svg/onload='+/"`/+/onmouseover=1/+/[*/[]/+alert();//'>
```

1. Submit a random alphanumeric string in the search box, then use Burp Suite to intercept the search request and send it to Burp Repeater.
2. Observe that the random string has been reflected inside a quoted attribute.
3. Replace your input with the following payload to escape the quoted attribute and inject an event handler:
    `"onmouseover="alert(1)`
4. Verify the technique worked by right-clicking, selecting "Copy URL", and pasting the URL in the browser. When you move the mouse over the injected element it should trigger an alert.

==El contenido aparece entre comillas dobles , podemos pasarle contenido sin url encodear en la petición pero no desde el search box==
Podemos pasarle una comilla para cerrar el atributo value y añadirle un nuevo atributo onmouseover, modificando así el objeto de tipo input "onmouseover="alert(1)
