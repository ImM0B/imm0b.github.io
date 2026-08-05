---
title: "10 - URL-based access control can be circumvented"
---

# 10 - URL-based access control can be circumvented

`X-Original-URL` es una **cabecera HTTP** (HTTP header) personalizada que algunos servidores o proxies (como Nginx, Apache o ciertos balanceadores de carga) utilizan para **preservar la URL original** solicitada por el cliente **antes de que se apliquen redirecciones, reescrituras o reglas de enrutamiento internas**.

También está `X-Rewrite-URL`

### ¿Para qué sirve?

Sirve para que el backend (la aplicación o el servidor final) sepa **cuál fue exactamente la URL que pidió el cliente originalmente**, incluso si el servidor intermedio (como un proxy inverso) la modificó. Esto es útil en escenarios como:

- **Reescrituras internas de URL** (por ejemplo, `/api/user/123` se convierte en `/backend/user.php?id=123`)
    
- **Autenticación y autorización**, donde quieres saber qué URL se solicitó para decidir si permitir el acceso.
    
- **Registros/logs**, para mantener trazabilidad de lo que el usuario realmente pidió.
    

### Ejemplo de uso:

Supón que un cliente hace esta petición:

```
GET /privado/documento.pdf HTTP/1.1
Host: ejemplo.com
```

El servidor Nginx la reescribe internamente a:

```
/descargas/seguras.php?archivo=documento.pdf
```

Pero antes de hacer la reescritura, Nginx podría agregar la cabecera:

```
X-Original-URL: /privado/documento.pdf
```

Así, el backend puede saber que el usuario originalmente pidió `/privado/documento.pdf`, aunque internamente se haya transformado.

---

Así que ponemos cabecera `X-Original-Url: /admin` y en la url ponemos `products` , asi bypasseamos el access control y el servidor confía en X-Original-Url.

Para eliminar a carlos :
`X-Original-Url: /admin/delete`
