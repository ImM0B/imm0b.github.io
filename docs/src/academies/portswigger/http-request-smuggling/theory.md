---
title: "Theory"
---

# Theory

Las vulnerabilidades de este tipo salen porque el frontend server y el backend server interpretan peticiones juntas de distinta forma.

```
POST /search HTTP/1.1 Host: normal-website.com 
Content-Type: application/x-www-form-urlencoded 
Transfer-Encoding: chunked 

b //bytes
q=smuggling //11 bytes de longitud
0 //fin del cuerpo
```

Websites that use HTTP/2 end-to-end are inherently immune to request smuggling attacks. As the HTTP/2 specification introduces a single, robust mechanism for specifying the length of a request, there is no way for an attacker to introduce the required ambiguity.
