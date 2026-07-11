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
import source from '!raw-loader!./index.html';

function hasTag(name) {
  return new RegExp(`<${name}(\\s|>|/)`, 'i').test(source);
}

test('document contains Link', () => {
  expect(hasTag('a')).toBe(true);
});

test('document contains correct link text and href', async () => {
  const doc = new DOMParser().parseFromString(source, 'text/html');

  const link = doc.querySelector('a');
  expect(link).not.toBeNull();
  expect(link.textContent).toBe('Click here to search!');
  expect(link.href).toMatch(/^https?:\/\//);
});
```

:::
