---
title: "04 - CSRF where token is not tied to user session"
---

# 04 - CSRF where token is not tied to user session

Interceptamos la request de cambio de correo, creamos un csrf poc con el csrf token fresco,dropeamos la request, lo enviamos a la víctima por el exploit server.
Esto funciona porque el csrf token no está asociado a la cookie de cada usuario. Entonces con que tengamos control de un usuario, podemos usar el mismo csrf token para otra petición
