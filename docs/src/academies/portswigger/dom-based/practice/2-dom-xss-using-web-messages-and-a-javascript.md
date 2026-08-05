---
title: "2 - DOM XSS using web messages and a JavaScript URL"
---

# 2 - DOM XSS using web messages and a JavaScript URL

### Desglose del Código:

1. **Código de Redirección Vulnerable**:
   ```javascript
   window.addEventListener('message', function(e) {
       var url = e.data;
       if (url.indexOf('http:') > -1 || url.indexOf('https:') > -1) {
           location.href = url;
       }
   }, false);
   ```

   - Este código escucha los mensajes enviados a través de `postMessage`.
   - Luego, verifica si el contenido del mensaje (`e.data`) contiene las cadenas `'http:'` o `'https:'`.
   - Si se encuentra una de estas cadenas, se redirige el navegador a la URL especificada en `e.data` usando `location.href`.

2. **El Payload Malicioso**:
   ```html
   <iframe src="https://YOUR-LAB-ID.web-security-academy.net/" onload="this.contentWindow.postMessage('javascript:print()//http:','*')">
   ```

   - Aquí, se utiliza un `iframe` para cargar una URL y enviar un mensaje al contenido de ese iframe utilizando `postMessage`.
   - El mensaje enviado es `'javascript:print()//http:'`.

3. **Cómo Funciona la Inyección**:
   - **`javascript:` URI**: En navegadores, un URI que comienza con `javascript:` indica que el navegador debería interpretar el resto de la cadena como código JavaScript y ejecutarlo. Por ejemplo, `javascript:print()` ejecutaría la función `print()` directamente en el navegador.
   - **Comentando la Validación**: El payload `'javascript:print()//http:'` incluye `'//http:'`, que es un comentario en JavaScript. Esto es ingenioso porque la validación en el código original busca `'http:'` o `'https:'`. Al agregar `'//http:'` al final de la cadena, se engaña al código para que pase la validación y luego todo lo que sigue después de `//` es ignorado en la ejecución de `javascript:print()`, debido a que es tratado como un comentario.

4. **Redirección a `javascript:`**:
   - **Si el payload se recibe**: Si el código vulnerable recibe el mensaje `'javascript:print()//http:'`, el `if` evalúa como verdadero porque encuentra `'http:'`.
   - **Redirección**: Entonces, `location.href = 'javascript:print()//http:'` redirige el navegador a una URI `javascript:`. Esto ejecuta el código `print()`, que abre el cuadro de diálogo de impresión del navegador.

### Resumen:
- **Engaño en la Verificación**: El uso de `'//http:'` como comentario permite engañar la validación en el código original, que está diseñado para redirigir solo si encuentra `'http:'` o `'https:'` en el mensaje.
- **Ejecución del Payload**: Como resultado, el navegador interpreta la cadena `javascript:print()` como código a ejecutar, lo que activa la función `print()`.

Este tipo de ataque es conocido como **JavaScript injection** a través de la URI `javascript:` y es una forma de vulnerabilidad XSS. En un entorno real, este tipo de ataque podría tener consecuencias mucho más serias si el código inyectado realizara acciones más dañinas.


==javascript:print() es una url más==
