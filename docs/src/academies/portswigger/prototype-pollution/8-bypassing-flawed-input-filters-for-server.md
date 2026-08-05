---
title: "8 - Bypassing flawed input filters for server-side prototype pollution"
---

# 8 - Bypassing flawed input filters for server-side prototype pollution

**Podemos usar  [Server-Side Prototype Pollution Scanner](https://portswigger.net/bappstore/c1d4bd60626d4178a54d36ee802cf7e8)**
Clic derecho en la request y Body Scan, en el apartado de vulnerabilidades sale si una de las pruebas que se ha hecho ha sido exitosa:

Para bypassear posibles filtros de `__proto__` :
```json
"constructor": {
    "prototype": {
      "isAdmin": "true"
    }
  }
```
