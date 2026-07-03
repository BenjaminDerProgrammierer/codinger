---
title: The structure of an HTML document
unit: Intro to HTML
pathway: Hello, World!
---

This section describes how an HTML document has to be structured. Note that any text inside of `<!--` and `-->` tags, so called comments, are ignored by the browser during rendering. This means you can write explanations or notes inside of the document.

```html
<!DOCTYPE html> <!-- A required document type declaration -->
<html> <!-- [Start of] The root element of the web page -->
  <head> <!-- [Start of] The head element. Here lies metadata, links to other files to be processed by the browser, as well as the title of the page (to be disblayed in the browser tab) -->
    <meta charset="UTF-8"> <!-- A meta tag, more on those later -->
    <title>My demo for the structure of HTML</title> <!-- The title -->
  </head> <!-- End of the head element -->
  <body>
    <!-- Inside of the body element. Here will be the content of your website -->
  </body>
</html> <!-- [End of] The root element of the web page -->
```
