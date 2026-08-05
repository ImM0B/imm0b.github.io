---
title: "3 - Manipulating the WebSocket handshake to exploit vulnerabilities"
---

# 3 - Manipulating the WebSocket handshake to exploit vulnerabilities

Cuando después de probar payloads nos tire : 

```
"This address is blacklisted"
```

Hay que poner la cabecera :

```
X-Forwarded-For: 1.1.1.1
```
