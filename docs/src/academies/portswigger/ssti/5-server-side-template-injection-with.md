---
title: "5 - Server-side template injection with information disclosure via user-supplied objects"
---

# 5 - Server-side template injection with information disclosure via user-supplied objects

Si hacemos:


\{\% debug \%\}

vemos listamos los objetos y propiedades a los que podemos acceder.
Veamos que podemos acceder a product y a settings.

```
{{settings.SECRET_KEY}}
```
