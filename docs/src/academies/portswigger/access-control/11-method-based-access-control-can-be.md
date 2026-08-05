---
title: "11 - Method-based access control can be circumvented"
---

# 11 - Method-based access control can be circumvented

EL metodo para hacer upgrade de privilegios a otra cuenta en el admin lo podemos usar desde la cuenta de wiener, pero para poder hacer eso, tenemos que hacerlo ccon get : 
```
https://0ad100f7030c760e81c31670004100ba.web-security-academy.net/admin-roles?username=wiener&action=upgrade
```
Porque sino nos tira unauthorized, depende del método GET POST que podamos utilizar el endpoint como un usuario no privilegiado.


Igual no va
```
/admin/deleteUser
```

pero si va
```
/admin/deleteUser.anything
```
