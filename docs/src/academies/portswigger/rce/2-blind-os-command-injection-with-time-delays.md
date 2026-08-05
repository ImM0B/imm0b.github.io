---
title: "2 - Blind OS command injection with time delays"
---

# 2 - Blind OS command injection with time delays

Solo si el primer comando falla, se ejecutará el segundo
```bash
email=x||ping+-c+10+127.0.0.1||
```
