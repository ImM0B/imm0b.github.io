---
title: "DOM-based XSS"
---

# DOM-based XSS

https://portswigger.net/web-security/cross-site-scripting/dom-based

**SOURCE VS SINK**
To test for DOM XSS in an HTML ==sink==, place a random alphanumeric string into the ==source== (such as location.search), then use developer tools to inspect the HTML and find where your string appears.
