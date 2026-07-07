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
import source from '!raw-loader!./index.html';

function hasTag(name) {
  return new RegExp(`<${name}(\\s|>|/)`, 'i').test(source);
}

test('creates a basic HTML document', () => {
  expect(hasTag('html')).toBe(true);
  expect(hasTag('head')).toBe(true);
  expect(hasTag('title')).toBe(true);
  expect(hasTag('body')).toBe(true);
  expect(hasTag('h1')).toBe(true);
});

test('contains correct title and heading', () => {
  const doc = new DOMParser().parseFromString(source, 'text/html');

  expect(doc.querySelector('title').textContent).toBe('My first site');
  expect(doc.querySelector('h1').textContent).toBe('Hello World!');
});
```

:::
