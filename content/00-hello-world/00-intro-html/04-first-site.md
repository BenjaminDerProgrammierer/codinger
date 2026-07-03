---
title: Your first HTML document
unit: Intro to HTML
pathway: Hello, World!
---

Now that you know what HTML is and how it is structured, let's create your first HTML document. You will do this right here in the browser, so you don't need to install anything. You will be able to see your changes immediately.

:::exercise
id: 04-first-site
language: html
difficulty: beginner

Prompt:

Create a new HTML document. It should have a title of "My first site" and a level one heading that says "Hello World!". Hint: You can type `!` and then press the `Tab` key to create a basic HTML document structure. This works in the embedded monaco editor, as well as in many code editors like Visual Studio Code thanks to Emmet.

Starter:

```html
```

Tests:

```javascript
const html = document.querySelector('html');
const head = document.querySelector('head');
const title = document.querySelector('title');
const body = document.querySelector('body');
const h1 = document.querySelector('h1');

if (!html) throw new Error('No <html> element found');
if (!head) throw new Error('No <head> element found');
if (!title) throw new Error('No <title> element found');
if (title.textContent !== 'My first site') throw new Error('The <title> element does not have the correct text content. It should be "My first site"');
if (!body) throw new Error('No <body> element found');
if (!h1) throw new Error('No <h1> element found');
if (h1.textContent !== 'Hello World!') throw new Error('The <h1> element does not have the correct text content. It should be "Hello World!"');
```

:::
