---
title: HTML Tags and Elements
unit: Intro to HTML
pathway: Hello, World!
---

As you've learned in the previous sections, HTML is made up of elements, which themselves are made up of tags. To not run into any issues, it is important to write HTML code correctly.

## Tags

They are marked by `<` and `>`. They mostly come in pairs, like `<p>` and `</p>`. The first one is called the *start tag*, while the second one is called the *end tag*. Some tags are self-closing, like `<img />` or `<br />`.

## Attributes

Attributes are used to provide additional information about an element. They are written inside the start tag, and they come in name/value pairs like this: `name="value"`. For example, the `src` attribute of the `<img>` tag specifies the URL of the image to be displayed:

```html
<img src="image.jpg" alt="A description of the image" />
```

## Some important tags

| Tag | Description |
| --- | --- |
| html | The root element of an HTML document |
| head | The head element. Here lies metadata, links to other files to be processed by the browser, as well as the title of the page (to be displayed in the browser tab) |
| body | The body element. Here lies the content of your website |
| meta | A meta tag. It provides metadata about the HTML document, such as character encoding, author, and viewport settings |
| title | The title of the HTML document. It is displayed in the browser tab |
| h1, h2, h3, h4, h5, h6 | Heading elements. They are used to define headings of different levels. `<h1>` is the highest level heading, while `<h6>` is the lowest |
| p | Paragraph element. It is used to define a paragraph of text |
| ul, ol | Unordered and ordered list elements. They are used to create lists of items. `<ul>` creates a bulleted (unordered) list, while `<ol>` creates a numbered (ordered) list |
| li | List item element. It is used to define an item in a list. It must be used inside a `<ul>` or `<ol>` element |
| table, tr, td, th | Table elements. They are used to create tables. You'll learn more about them later. |
| br | Line break element. It is used to create a line break in the text. It is a self-closing tag |
| hr | Horizontal rule element. It is used to create a horizontal line in the text. It is a self-closing tag |
| a | Anchor element. It is used to create hyperlinks to other web pages or resources. It requires an `href` attribute to specify the URL of the link |
| img | Image element. It is used to embed images in the web page. It requires a `src` attribute to specify the URL of the image, and an `alt` attribute to provide alternative text for the image. It is a self-closing tag |
