---
title: "Theory"
---

# Theory

If the **==cache key==** of an incoming request matches the key of a previous request, then the cache considers them to be equivalent. As a result, it will serve a copy of the cached response that was generated for the original request. This applies to all subsequent requests with the matching cache key, until the cached response expires.

**==Identify and evaluate unkeyed inputs==**

1. **Caché web y claves de caché:** Cuando un servidor de caché recibe una solicitud, decide si puede responder con una versión guardada en caché en lugar de consultar al servidor original. Para hacer esta decisión, utiliza algo llamado *clave de caché*, que es un conjunto de ciertos parámetros de la solicitud, como la URL y algunos encabezados. Si una solicitud tiene la misma clave de caché que una respuesta en caché, se usa esa respuesta en lugar de generar una nueva.

2. **Entradas sin clave o "unkeyed inputs":** Aquí es donde el ataque entra en juego. No todos los parámetros de la solicitud se utilizan para decidir si la respuesta es la misma (no todos son parte de la clave de caché). Los encabezados y otros parámetros que el servidor no usa para generar la clave de caché se denominan "unkeyed inputs" o "entradas sin clave". Esto significa que, aunque estos parámetros pueden alterar la respuesta generada por el servidor, no afectan la decisión de la caché de servir una respuesta ya guardada.

3. **Manipulación de entradas sin clave para envenenar la caché:** Si puedes identificar parámetros sin clave (unkeyed inputs) que afectan la respuesta, podrías usarlos para insertar un contenido malicioso (tu *payload*) en la respuesta generada por el servidor. Si el servidor guarda en caché esa respuesta alterada, la próxima vez que alguien haga una solicitud con la misma clave de caché, recibirá tu contenido "envenenado" en lugar de la respuesta legítima.

4. **Identificación de entradas sin clave:** Para identificar estos parámetros, puedes agregar valores aleatorios a los encabezados u otros parámetros de la solicitud y ver si cambian la respuesta. Por ejemplo, podrías probar con diferentes encabezados personalizados o valores en la URL. Si ves que el servidor responde de manera diferente con ciertos valores, pero la caché no los toma en cuenta, entonces has encontrado una posible entrada sin clave para manipular la respuesta y, potencialmente, envenenar la caché.

5. **Uso de herramientas:** Herramientas como **Burp Comparer** pueden ayudarte a identificar estos cambios comparando respuestas con y sin los parámetros alterados.


**Unkeyed input** : si cambias el contenido de ese input se cachea su contenido para otros clientes, por lo que si solo modificas un unkeyed input no se hace una petición fresca al servidor y recibes una respuesta cacheada, tendrías que hacer una petición al servidor con algo más cambiado (como un parámetro por get) para recibir una respuesta fresca.

Importante añadir un ==caché buster== a cada request,it is important to make sure that your requests ==all have a unique cache key== so that they will only be served to you.
Para hacer esto añadimos un parámetro propio para que no quede cacheada para otras personas.
