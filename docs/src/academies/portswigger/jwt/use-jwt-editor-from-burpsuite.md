---
title: "Use JWT editor from Burpsuite"
---

# Use JWT editor from Burpsuite

## Before you start

Install the [JWT Editor](https://portswigger.net/bappstore/26aaa5ded2f74beea19e2ed8345a93dd) extension. For more information, see [Installing extensions](https://portswigger.net/burp/documentation/desktop/extensions/installing-extensions).

## Viewing JWTs

1. Identify a request with a JWT that you want to investigate further. Look for the highlighted requests in **Proxy > HTTP history**, these are automatically flagged by the JWT Editor extension.
    
    
2. To view the JWT contents, highlight sections of the token in turn. Notice that the content is automatically decoded in the **Inspector** panel.
    
    
3. Review the contents of the JWT in the **Inspector** panel, to identify interesting information and determine any modifications that you want to make.

## Editing JWTs

To edit a JWT using the JWT Editor extension:

1. Right-click the request with the JWT and select **Send to Repeater**.
2. In the request panel, go to the **JSON Web Token** tab.
3. Edit the JSON data as required in the **Header** and **Payload** fields.
4. Click **Sign**. A new dialog opens.
5. In the dialog, select the appropriate signing key, then click **OK**. The JWT is re-signed to correspond with the new values in the header and payload. If you haven't added a signing key, follow the instructions below.

## Adding a JWT signing key

To add a signing key to Burp using the JWT Editor extension:

1. Go to the **JWT Editor Keys** tab.
2. Click the button for the type of key that you want to add. For example, **New Symmetric Key**. A new dialog opens.
3. In the dialog, add the new key:
    
    - Click **Generate** to create a new key.
    - Alternatively, paste an existing key into the dialog.
4. Edit the key as required.
