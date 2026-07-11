---
title: Multimedia in HTML
unit: Intro to HTML
pathway: Hello, World!
---

HTML5 shines when it comes to multimedia. It provides native support for audio and video content, allowing developers to embed media directly into web pages without relying on third-party plugins.

The first multimedia element you'll learn about is the image tag `<img>`. This tag is used to show images in your HTML documents. Every image tag requires a `src` attribute, which specifies the path to the image file, and an `alt` attribute, which provides alternative text for the image if it cannot be displayed due to an error or if the user is using a screen reader.

```html
<h1>My Favorite Animal</h1>
<img src="images/cat.jpg" alt="A cute cat" />
```

There are two other common multimedia elements: the `<audio>` tag for playing audio files and the `<video>` tag for showing videos.

The tags can contain a `controls` attribute (without a value), which adds play, pause, and volume controls to the media player. There can be multiple `<source>` tags inside the `<audio>` and `<video>` tags, allowing you to provide different formats of the same media file. This ensures that your media can be played in different browsers, as not all browsers support the same formats.

```html
<h1>My Favorite Song</h1>
<audio controls>
  <source src="audio/song.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

```html
<h1>My Favorite Movie</h1>
<video controls>
  <source src="video/movie.mp4" type="video/mp4">
  Your browser does not support the video element.
</video>
```

:::exercise
id: 07-multimedia-images
language: html
difficulty: beginner

Prompt:

Below the heading, insert an image, an audio file, and a video file. Make sure to include the `src` and `alt` attributes for the image, and the `controls` attribute for the audio and video elements. You may use any media files you like, and provide the raw file paths in the `src` attributes.

Starter:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multimedia is fun</title>
</head>
<body>
    <h1>Multimedia is fun</h1>
</body>
</html>
```

Tests:

```javascript
import source from '!raw-loader!./index.html';

function hasTag(name) {
  return new RegExp(`<${name}(\\s|>|/)`, 'i').test(source);
}

test('document contains image', () => {
  expect(hasTag('img')).toBe(true);
});

test('document contains audio', () => {
  expect(hasTag('audio')).toBe(true);
});

test('document contains video', () => {
  expect(hasTag('video')).toBe(true);
});

test('image has src and alt attributes', () => {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const img = doc.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.hasAttribute('src')).toBe(true);
    expect(img.hasAttribute('alt')).toBe(true);
});

test('audio has controls attribute and source', () => {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const audio = doc.querySelector('audio');
    expect(audio).not.toBeNull();
    expect(audio.hasAttribute('controls')).toBe(true);
    expect(audio.querySelector('source')).not.toBeNull();
});

test('video has controls attribute and source', () => {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const video = doc.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.hasAttribute('controls')).toBe(true);
    expect(video.querySelector('source')).not.toBeNull();
});
```

:::
