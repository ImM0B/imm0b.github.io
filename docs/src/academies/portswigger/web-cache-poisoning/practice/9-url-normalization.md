---
title: "9 - URL normalization"
---

# 9 - URL normalization

### Podemos usar find **normalised param** 

```http
GET /ERROR HTTP/2
```

```html
<p>Not Found: /ERROR</p>
```

Abrir esto en el navegador lo url encodea 
```http
GET /"><script>alert(1)</script> HTTP/2
```

Pero cuando el navegador devuelve una respuesta cacheada, osea que tu hayas recibido un MISS , pero que al hacerlo en el navegador vaya a recibir un HIT : entonces ahí la caché no lo url decodea y entonces ejecutará.

Sería hacer una petición para que haga MISS y luego enviarle el enlace a la víctima para que haga HIT con el XSS sin url encodear.
