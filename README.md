# 📰 MuPDF.js 

> ## 📢 **IMPORTANT NOTE**
> 
> __There is now an official package supported by the MuPDF developers, 
> which is likely to be more up-to-date and better maintained.__ 
> 
> 👉 __[You can find it here](https://www.npmjs.com/package/mupdf).__ 
> 
> __I recommend migrating to the official package, as I am no longer 
> maintaining this one due to time constraints.__
> 
> To nudge you in the right direction, I've pushed a major version of this 
> package that is a stub and will throw an error if you try to use it.
> 
> If you *really* want to use this package, (or if you need it to run legacy 
> code that depends on it, and you can't update that code for some reason) 
> you can still install it by manually installing version 1.1.1.


[![npm](https://img.shields.io/npm/v/mupdf-js)](https://www.npmjs.com/package/mupdf-js)
[![npm](https://img.shields.io/npm/dt/mupdf-js)](https://www.npmjs.com/package/mupdf-js)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/andrew-t/mupdf-js/Node.js%20CI)]

This is a port of [MuPDF](https://mupdf.com/docs/) to javascript and webassembly, giving you the following:

- 🔥 **Blazing fast** rendering of PDFs to **PNG**, **SVG** and even **HTML**
- 💼 Run in the **web browser** or your **server**. Basically any platform that supports Webassembly!
- ☑ Supports Typescript
- 🗺️ A super **simple** API that's also **completely flexible**, see below...

# 🏁 Getting Started

```bash
yarn add mupdf-js
# or
npm i mupdf-js
```

## Basic Usage

Before you do any processing, you'll need to initialise the MuPdf library:

```js
import { createMuPdf } from "mupdf-js";

async function handleSomePdf(file: File) {
  const mupdf = await createMuPdf();
  
  //...
}
```

In the *browser*, you'll most likely retrieve a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) or [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object from an html [`<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) tag, supplied by a user.

You'll need to convert the file firstly to an `ArrayBuffer`, then to a `Uint8Array`:

```js
import { createMuPdf } from "mupdf-js";

async function handleSomePdf(file) {
  const mupdf = await createMuPdf();
  const buf = await file.arrayBuffer();
  const arrayBuf = new Uint8Array(buf);
  
  //...
}
```

Once you have this, you can *load* the file into the MuPdf environment, creating a MuPdf *document*:

```js
import { createMuPdf } from "mupdf-js";

async function handleSomePdf(file) {
  const mupdf = await createMuPdf();
  const buf = await file.arrayBuffer();
  const arrayBuf = new Uint8Array(buf);
  const doc = mupdf.load(arrayBuf);
}
```

You now have three different options to render the PDF document:

```js
import { createMuPdf } from "mupdf-js";

async function handleSomePdf(file) {
  const mupdf = await createMuPdf();
  const buf = await file.arrayBuffer();
  const arrayBuf = new Uint8Array(buf);
  const doc = mupdf.load(arrayBuf);
  
  // Each of these returns a string:
  
  const png = mupdf.drawPageAsPNG(doc, 1, 300);
  const svg = mupdf.drawPageAsSVG(doc, 1);
  const html = mupdf.drawPageAsHTML(doc, 1);
}
```

## Conversion Options

### PNG

```js
mupdf.drawPageAsPNG(document, page, resolution);
```

Arguments:
- document: *a MuPdf document object*
- page: *the page number to be rendered, starting from 1*
- resolution: *the DPI to use for rendering the file*

Returns: *an uncompressed PNG image, encoded as a base64 data URI.*

### SVG

```js
mupdf.drawPageAsSVG(document, page);
```

Arguments:
- document: *a MuPdf document object*
- page: *the page number to be rendered, starting from 1*

Returns: *an SVG file with the PDF document rendered as image tiles.*

### HTML

```js
mupdf.drawPageAsHTML(document, page);
```

Arguments:
- document: *a MuPdf document object*
- page: *the page number to be rendered, starting from 1*

Returns: *an HTML file that uses absolute positioned elements for layout.*

## Text operations

### Get text from page

```js
mupdf.getPageText(document, page);
```

Arguments:
- document: *a MuPdf document object*
- page: *the page number to be rendered, starting from 1*

Returns: *string containing all text collected from page*

### Search on the page

```js
mupdf.searchPageText(document, page, searchString, maxHits);
```

Arguments:
- document: *a MuPdf document object*
- page: *the page number to be rendered, starting from 1*
- searchString: *string to search*
- maxHits: *the maximum possible number of matches (it stops search when reaches this limit)*

Returns: *array of found rectangles of text matches ({x: number, y: number, w: number, h: number}[])*

You should set `maxHits` to an appropriate level that a user would expect (for example 100), or allow users to set their own limit. Alternatively, if you want to allow effectively unlimited search hits (and risk running out of memory), you can set it to C's maximum unsigned 32-bit integer size, which is 4294967295.

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

# License

AGPL, subject to the [MuPDF license](https://www.mupdf.com/licensing/).
