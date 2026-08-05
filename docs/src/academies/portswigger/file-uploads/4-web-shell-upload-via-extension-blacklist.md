---
title: "4 - Web shell upload via extension blacklist bypass"
---

# 4 - Web shell upload via extension blacklist bypass

Subimos la misma shell pero con extensión .phar 

- `.phtml`
- `.php3`, `.php4`, `.php5`, `.php7`, `.php8`
- `.phar`

___

In Burp Repeater, go to the tab for the `POST /my-account/avatar` request and find the part of the body that relates to your PHP file. Make the following changes:
    - Change the value of the `filename` parameter to `.htaccess`.
    - Change the value of the `Content-Type` header to `text/plain`.
    - Replace the contents of the file (your PHP payload) with the following Apache directive:
        
        `AddType application/x-httpd-php .l33t`
        
        This maps an arbitrary extension (`.l33t`) to the executable MIME type `application/x-httpd-php`. As the server uses the `mod_php` module, it knows how to handle this already.
