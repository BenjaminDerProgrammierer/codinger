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
const unorderedList = document.querySelector('ul');
if (!unorderedList) throw new Error('No <ul> element found');
const orderedList = document.querySelector('ol');
if (!orderedList) throw new Error('No <ol> element found');
const unorderedListItems = unorderedList.querySelectorAll('li');
if (unorderedListItems.length < 3) throw new Error('The <ul> element should have at least three <li> elements');
const orderedListItems = orderedList.querySelectorAll('li');
if (orderedListItems.length < 3) throw new Error('The <ol> element should have at least three <li> elements');
```

:::
