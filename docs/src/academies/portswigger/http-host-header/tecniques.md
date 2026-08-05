---
title: "Tecniques"
---

# Tecniques

Antes no existían estas vulnerabilidades, porque cada Host apuntaba solo a una IP.
Ahora con el virtual hosting es normal que haya varios host accesibles desde la misma IP.
Tambien puede ser que haya un load balancer o un proxy intermedio actuando, la ip a la que se apunta es la del intermediario.

Si tira 200 podemos inyectar cosas en la cabecera Host, ya que lo está ignorando al tratarse de un puerto
```HTTP
GET /example HTTP/1.1 
Host: vulnerable-website.com:bad-stuff-here
```

Igual solo miran vulnerable-website.com y tu tienes control sobre hacked-subdomain
```HTTP
GET /example HTTP/1.1 
Host: hacked-subdomain.vulnerable-website.com
```

Igual el backend prefiere la segunda cabecera, discrepancias entre frontend y backend
```HTTP
GET /example HTTP/1.1
Host: vulnerable-website.com
Host: bad-stuff-here
```

```HTTP
GET /example HTTP/1.1
    Host: bad-stuff-here
Host: vulnerable-website.com
```

Nos puede servir para inyectar Host maliciosos

```HTTP
GET https://vulnerable-website.com/ HTTP/1.1
Host: bad-stuff-here
```

Spoofear el Host mediante ciertas cabeceras :

```HTTP
GET /example HTTP/1.1
Host: vulnerable-website.com
X-Forwarded-Host: bad-stuff-here


Although X-Forwarded-Host is the de facto standard for this behavior, you may come across other headers that serve a similar purpose, including:

X-Forwarded-Server
X-HTTP-Host-Override
Forwarded
X-Forwarded-Host
X-Original-Host
X-Host
X-Referred-Host
```

Webs privadas y 
```
www.example.com: 12.34.56.78
intranet.example.com: 10.0.0.132
```
