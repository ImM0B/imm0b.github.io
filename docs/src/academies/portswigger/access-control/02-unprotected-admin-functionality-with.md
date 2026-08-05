---
title: "02 - Unprotected admin functionality with unpredictable URL"
---

# 02 - Unprotected admin functionality with unpredictable URL

Buscamos `admin` en history y encontramos este script :

```javascript
<script>
var isAdmin = false;
if (isAdmin) {
   var topLinksTag = document.getElementsByClassName("top-links")[0];
   var adminPanelTag = document.createElement('a');
   adminPanelTag.setAttribute('href', '/admin-fot4f5');
   adminPanelTag.innerText = 'Admin panel';
   topLinksTag.append(adminPanelTag);
   var pTag = document.createElement('p');
   pTag.innerText = '|';
   topLinksTag.appendChild(pTag);
}
</script>
```
