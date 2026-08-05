---
title: "5 - Web cache poisoning via an unkeyed query string"
---

# 5 - Web cache poisoning via an unkeyed query string

Los propios parámetros de la url no están keyed, es decir, cambiar los parámetros no va a hacer que se haga una petición única al servidor, en su lugar se responderá con una respuesta cacheada de `/`
