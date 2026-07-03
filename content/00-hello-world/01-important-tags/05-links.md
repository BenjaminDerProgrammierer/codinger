---
title: HTML Hyperlinks
unit: Intro to HTML
pathway: Hello, World!
---

The primary purpose of HTML is to create hyperlinks, which allow users to navigate between different web pages. Hyperlinks are created using the `<a>` anchor tag. The `href` attribute specifies the URL of the page the link goes to. For example, to create a link to Google, you would write:

```html
<a href="https://www.google.com">Go to Google</a>
```

:::exercise
id: 05-links
language: html
difficulty: beginner

Prompt:

Below the heading, create a hyperlink to your favorite search engine. The link text should say "Click here to search!".

Starter:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Favorite Search Engine</title>
</head>
<body>
    <h1>My favorite search engine</h1>
</body>
</html>
```

Tests:

```javascript
const link = document.querySelector('a');
if (!link) throw new Error('No <a> element found');
if (link.textContent !== 'Click here to search!') throw new Error('The <a> element does not have the correct text content. It should be "Click here to search!"');
if (!link.href) throw new Error('The <a> element does not have an href attribute');
if (!link.href.startsWith('http')) throw new Error('The <a> element href attribute does not point to a valid URL');
fetch(link.href)
    .then(response => {
        if (!response.ok) throw new Error('The <a> element href attribute does not point to a valid URL');
    })
    .catch(error => {
        throw new Error('The <a> element href attribute does not point to a valid URL');
    });
```

:::
