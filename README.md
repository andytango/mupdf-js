# 📰 MuPDF.js 
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
  
  // This method returns Uint8Array
  const pngRaw = mupdf.drawPageAsPNGRaw(doc, 1, 300);
}
```

## Conversion Options

### PNG

```js
// Returns PNG as data uri string
mupdf.drawPageAsPNG(document, page, resolution); 

// Returns PNG data as Uint8Array
mupdf.drawPageAsPNGRaw(document, page, resolution); 
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

# Manual context management

By default, mupdf-js creates a MuPDF context upon initialization and uses it for all calls. However, since the context includes a cache, over time this can lead to an increase in the application's memory consumption. To manage the context independently, mupdf-js supports the following:

```js
import { createMuPdfWithoutContext } from "mupdf-js";

async function handleSomePdf(file) {
  const mupdf = await createMuPdfWithoutContext();
  const ctx = mupdf.createContext();
  const buf = await file.arrayBuffer();
  const arrayBuf = new Uint8Array(buf);
  const doc = mupdf.load(ctx, arrayBuf);
  
  // Each of these returns a string:
  
  const png = mupdf.drawPageAsPNG(ctx, doc, 1, 300);
  const svg = mupdf.drawPageAsSVG(ctx, doc, 1);
  const html = mupdf.drawPageAsHTML(ctx, doc, 1);
  
  // This method returns Uint8Array
  const pngRaw = mupdf.drawPageAsPNGRaw(ctx, doc, 1, 300);
  mupdf.freeDocument(doc);
  mupdf.freeContext(ctx);
}
```

# Custom logging

By default, console.log and console.warn are used for printing errors and other messages. If you prefer to use your custom logger (e.g., pino), you can do the following:


```typescript
import {createMuPdf} from "mupdf-js";
import pino from 'pino';

const logger = pino();

async function handleSomePdf(file) {
  const mupdf = await createMuPdf();
  mupdf.setLogger({
    log: (...args: any[]) => {
      logger.debug(...args);
    },
    errorLog: (...args: any[]) => {
      logger.error(...args);
    },
  });
  //...
}
```

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

# License

AGPL, subject to the [MuPDF license](https://www.mupdf.com/licensing/).
