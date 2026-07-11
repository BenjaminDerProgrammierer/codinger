---
title: HTML Lists
unit: Intro to HTML
pathway: Hello, World!
---

Another important feature of HTML is the ability to create lists. There are two main types of lists in HTML: ordered lists and unordered lists. Ordered lists have a numbering system, while unordered lists use bullet points. To create a list, use either the `<ol>` tag for ordered lists or the `<ul>` tag for unordered lists. Each item in the list is defined using the `<li>` tag.

```html
<h1>My Favorite Fruits</h1>
<ol>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ol>
```

```html
<h1>Ranking of my Favorite Animals</h1>
<ol>
  <li>Cat</li>
  <li>Dog</li>
  <li>Bird</li>
</ol>
```

:::exercise
id: 06-lists
language: html
difficulty: beginner

Prompt:

Below the heading, create an undordered list and an ordered list with each consisting of at least three items. Choose a topic you like.

Starter:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Lists</title>
</head>
<body>
    <h1>My Lists</h1>
</body>
</html>
```

Tests:

```javascript
import source from '!raw-loader!./index.html';

function hasTag(name) {
  return new RegExp(`<${name}(\\s|>|/)`, 'i').test(source);
}

test('document contains unordered list', () => {
  expect(hasTag('ul')).toBe(true);
});

test('document contains ordered list', () => {
  expect(hasTag('ol')).toBe(true);
});

test('document contains at least three list items in unordered list', () => {
  const doc = new DOMParser().parseFromString(source, 'text/html');
  const unorderedList = doc.querySelector('ul');
  expect(unorderedList).not.toBeNull();
  const unorderedListItems = unorderedList.querySelectorAll('li');
  expect(unorderedListItems.length).toBeGreaterThanOrEqual(3);
});

test('document contains at least three list items in ordered list', () => {
  const doc = new DOMParser().parseFromString(source, 'text/html');
  const orderedList = doc.querySelector('ol');
  expect(orderedList).not.toBeNull();
  const orderedListItems = orderedList.querySelectorAll('li');
  expect(orderedListItems.length).toBeGreaterThanOrEqual(3);
});
```

:::
