# Paginators

<details>
  <summary><strong id="menu">Menu</strong></summary>

- [Introduction](#introduction)
- [Features](#features)
- [File Structure Overview](#file-structure-overview)
- [HTML](#html)
- [Paginator](#paginator)
- [How to Add a New JSON Type](#how-to-add-a-new-json-type)
- [Link Handling in Templates](#link-handling-in-templates)
- [Email Address Handling in Templates](#email-address-handling-in-templates)
- [Telephone Number Handling in Templates](#telephone-number-handling-in-templates)
- [CSS](#css)
- [Use of ChatGPT (Free version)](#use-of-chatgpt-free-version)
- [Accessibility](#accessibility)
- [Theme Toggling](#theme-toggling)
- [Testing and Compatibility](#testing-and-compatibility)
- [How to Run](#how-to-run)
- [Build & Deployment Setup for `/docs` Folder](#build--deployment-setup-for-docs-folder)

</details>

## Introduction

A modular, lightweight and accessible pagination system for displaying content from various (and varied) JSON data sources. Supports multiple pages with a customisable number of items per page and dynamic pagination buttons.

[View on GitPage](https://chrisnajman.github.io/paginators)

[Back to menu](#menu)

---

## Features

- Separate JSON files for different content types (`pages.json`, `posts.json`, `users.json`, etc.).
- HTML `<template>` elements for rendering content dynamically. Note: `<template>` element is **required**.
- Modular JS with `render-content.js`, `render-[type]-content.js`, and `paginator.js`.
- URL syncing and browser back/forward support.
- Optional preprocessing/normalization of JSON fields (`normalise-data.js`).
- Supports nested data, arrays, and custom transformations per content type.
- Pagination button rendering with max visible buttons and dynamic updates.
- Paginator is only rendered if there are multiple pages.

[Back to menu](#menu)

---

## File Structure Overview

Relevant paginator-related files are listed below.

- `index.html`, `posts.html`, `users.html` — HTML pages displaying paginated content via `<template>` element.
- `index.js`: Loads main JavaScript modules. Displays them conditionally, according to relevant HTML `body` id.
- **`json/`**
  - `pages.json`: Array of objects, with `"content"` field containing escaped HTML.
  - `posts.json`: Object with key of `"posts"` containing an array of objects.
  - `users.json`: Array of objects with 2-level deep nesting.
- **`js-modules/`**
  - `globals.js`: Global constants (e.g., max visible pagination buttons, HTML `body` ids, etc).
  - `loader.js`: Loader animation logic.
  - **`pagination/`**
    - `paginator.js`: Main paginator initialization logic, handles updates, renders content, pagination buttons, and URL sync.
    - **`components/`**
      - `live-region.js`: Accessibility: announces page changes.
      - `render-page-buttons.js`: Generates pagination buttons.
      - `render-pages-content.js`: Pages-type renderer that calls `render-content.js`.
      - `render-posts-content.js`: Posts-type renderer that calls `render-content.js`.
      - `render-users-content.js`: Users-type renderer that calls `render-content.js`.
      - `render-content.js`: Generic renderer for JSON arrays to templates.
      - `normalise-data.js`: Generic JSON preprocessing / normalization utility.
      - **`render-customisations/`**
        - `normalise-users-data.js`: Example of per-type custom transformations.
    - **`helpers/`**
      - `set-loader-timeout.js`: Utility for controlling loader display timing.
      - `url-sync.js`: Syncs current page with URL and supports back/forward.
  - **`pages/`**
    - `pages.js`: Pages-specific code that fetches JSON and calls `initPaginator`.
  - **`posts/`**
    - `posts.js`: Posts-specific code that fetches JSON and calls `initPaginator`.
  - **`users/`**
    - `users.js`: Users-specific code that fetches JSON and calls `initPaginator`.

### Other

- `theme.js`: Handles theme toggling (light/dark mode) and local storage management.
- `about.html`

[Back to menu](#menu)

---

## HTML

> [!IMPORTANT]
> To successfully output JSON (via `render-content.js`), a `<template>` is used to output each instance of 'page', 'post' and 'user' content types.

[Back to menu](#menu)

---

## Paginator

The paginator makes it easy to move through long lists of items without overwhelming the page. You can choose how many page buttons to display at once — for example, showing just a few nearby pages or spreading out more options.

When there are too many pages to fit, the paginator automatically adds ellipsis (…) to show that more pages exist before or after the visible range. This keeps the navigation clean and simple, while still giving quick access to the first page, last page, and the pages closest to where you are.

[Back to menu](#menu)

---

## How to Add a New JSON Type

### 1. Add the JSON File

Place your file in the `/json/` folder.

**Example**: `json/products.json`

**Structure**: an array of objects or an object containing an array under a specific key (e.g., "items").

```json
[
  {
    "id": 1,
    "title": "Digital camera",
    "price": "£199.90",
    "manufacturer": "Sony"
  },
...
]
```

### 2. Create or Update HTML Template

Add a `<template>` to the corresponding HTML page (or create a new page, e.g. `products.html`):

```html
<template id="article-template-product">
  <article>
    <h2><span data-id></span>. <span data-title></span></h2>
    <p>Price: <span data-price></span></p>
    <p>Manufacturer: <span data-manufacturer></span></p>
  </article>
</template>
```

## 3. Create a Type-Specific Renderer

Create a new JS module in `js-modules/pagination/components/`, e.g., `render-products-content.js`:

```javascript
import renderContent from "./render-content.js"
export default function renderProductsContent(
  data,
  template,
  containerId,
  page,
  itemsPerPage
) {
  renderContent(data, template, containerId, {
    page,
    itemsPerPage,
    contentKeys: [], // optional keys that contain escaped HTML - see 'pages.json' for an example.
    itemsKey: null, // or the array key if JSON is { "items": [...] }
  })
}
```

**Optional**: preprocess your JSON via `normalise-data.js` or a custom file in `render-customisations/normalise-products-data.js` for things like formatting, splitting strings, etc.

### 4. Create a Page-Specific Loader Script

**Example**: `js-modules/products/products.js`

```javascript
import initPaginator from "../pagination/paginator.js"
import renderProductsContent from "../pagination/components/render-products-content.js"

export default async function loadProducts() {
  try {
    const res = await fetch("./json/products.json")
    if (!res.ok) throw new Error(`Failed to load products.json: ${res.status}`)
    const data = await res.json()

    const templateId = "article-template-product"
    const containerId = "products-page-container"

    initPaginator({
      data,
      templateId,
      containerId,
      itemsPerPage: 5, // Modify as required
      // maxButtons: Modify as required, e.g. 'maxButtons: 7'.
      // !If you set the value equal to or greater than the corresponding number of entries in users.json,
      //  there won't be any ellipsis.
      maxButtons: maxVisiblePaginationButtons, // Default = 5
      itemsKey: null, // or "items" if JSON has a key
    })
  } catch (err) {
    console.error(err)
  }
}

document.addEventListener("DOMContentLoaded", loadProducts)
```

### 5. Add Pagination Container

Make sure your HTML page has a container and paginator element:

```html
<div id="products-page-container"></div>
<div id="paginator"></div>
```

### 6. Finish

The new type is now fully integrated into the paginator system.

This pattern keeps everything modular:

- The core `render-content.js` and `paginator.js` remain untouched.
- New JSON types only require a template, a renderer, optional normalization, and a small loader script.

[Back to menu](#menu)

---

## Link Handling in Templates

#### Example

**JSON field**

```json
{
  "website": "https://example.com",
  "url": "https://another.com"
}
```

**HTML Template**:

Note the difference between the placement of the `data-[key]` in the following:

```html
<ul>
  <li>
    <!-- Inner content is hardcoded so `data-website` goes in the 'a' tag itself -->
    <a
      data-website
      data-href="website"
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit website
    </a>
  </li>
  <li>
    <!-- No data-url in the 'a' tag because there's a 'span' to output inner content -->
    <a
      data-href="url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span data-url></span>
      <!-- data-url goes in the 'span' tag -->
    </a>
  </li>
</ul>
```

**Rendered HTML**:

```html
<ul>
  <li>
    <a
      data-website
      data-href="https://example.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit website
    </a>
  </li>
  <li>
    <a
      data-href="https://another.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span data-url></span>
    </a>
  </li>
</ul>
```

### Explanation

- `data-[field-name]` → **required**. This is the `data-` attribute that `render-content.js` uses to find the element in the template.
- `data-href="[field-name]"` → **required**. This tells `render-content.js` which JSON key to use to populate the `href` attribute of the link.
- Inner content ([Link text or inner span]) → **required**. Can be e.g. a `<span data-[key]>` linked to another JSON key, or just plain text. `render-content.js` **does not set this automatically**.
- `target="_blank"` and `rel="noopener noreferrer"` → **optional**, for opening external links safely.

The `render-content.js` script will set the `href` of each `<a>` automatically from the corresponding JSON key.

[Back to menu](#menu)

---

## Email Address Handling in Templates

**JSON field**

```json
"email": "name@name.com",
"email-address": "companyname@ecompanyname.com"

```

**HTML Template**:

```html
<li>
  <a
    data-email
    data-mailto="email"
  ></a>
</li>
<li>
  <a
    data-email-address
    data-mailto="email-address"
  ></a>
</li>
```

**Rendered HTML**:

```html
<ul>
  <li>
    <a
      data-email=""
      data-mailto="email"
      href="mailto:name@name.com"
      >name@name.com</a
    >
  </li>
  <li>
    <a
      data-email-address=""
      data-mailto="email-address"
      href="mailto:ncompanyname@ecompanyname.com"
      >companyname@ecompanyname.com</a
    >
  </li>
</ul>
```

### Explanation

- E.g. `data-mailto="email"` → tells `render-content.js` to look up the JSON field e.g. `"email"` and build a `mailto:` link.
- E.g. `data-email` → required to bind the element to the JSON field e.g. `"email"`.
- The inner text of the `<a> `will automatically display the email address.

[Back to menu](#menu)

---

## Telephone Number Handling in Templates

**JSON field**

```json
"phone": "+44 1234 567890",
"telno": "+44 3333 444444"

```

**HTML Template**:

```html
<ul>
  <li>
    Phone:
    <a
      data-phone
      data-tel="phone"
    ></a>
  </li>
  <li>
    Telno:
    <a
      data-telno
      data-tel="telno"
    ></a>
  </li>
</ul>
```

**Rendered HTML**:

```html
<ul>
  <li>
    <a
      data-phone=""
      data-tel="phone"
      href="tel:+441234567890"
      >+44 1234 567890
    </a>
  </li>
  <li>
    <a
      data-telno=""
      data-tel="telno"
      href="tel:+443333444444"
      >+44 3333 444444
    </a>
  </li>
</ul>
```

### Explanation

- E.g. `data-tel-link="tel"` → tells `render-content.js` to look up the JSON field e.g. `"tel"` and build a `tel:` link.
- E.g.`data-tel` → required to bind the element to the JSON field e.g. `"tel"`.
- The inner text of the `<a> `will automatically display the email address.

[Back to menu](#menu)

---

## CSS

- `style.css`: `@imports` all files in `/css/` folder.
- **`css/`**
  - `root.css`
  - `base.css`
  - `loader.css`
  - `navigation.css`
  - `theme-toggle.css`
  - **`pagination/`**
    - `index.css`: `@imports` all files in `pagination/` folder.
    - `shared.css`
    - `paginator.css`
    - `pages.css`
    - `posts.css`
    - `users.css`

---

## Use of ChatGPT (Free version)

Usually, I only consult the AI when I run into insurmountable difficulties with the JavaScript. This time, as an experiment, I decided to let ChatGPT handle **all** of the JavaScript from scratch, only prodding it when its output was faulty.

This resulted in a huge thread (about 20,000 lines) generated over several days. I ran into difficulties about halfway through: the size of the thread by that time was taxing the capabilities of the server and the page often became inactive. By the time it reached the 20,000 mark, it was almost totally inert, requiring that the browser be shut down after posting a question, then reopening it a few minutes later to see the response.

However, ChatGPT came through in the end, and after much to-ing and fro-ing, it answered all my questions and fixed all the bugs.

The thread may be fat, but the generated code is pretty lean.

[Back to menu](#menu)

---

## Accessibility

The site includes the following accessibility enhancements:

- Fully keyboard-navigable using tab keys.
- ARIA roles and attributes are implemented throughout (e.g. for navigation and live announcements).
- A visually hidden skip link is provided for screen reader users.
- An ARIA live region (`<div id="live-region">`) announces new content loaded when navigating between pages.

[Back to menu](#menu)

---

## Theme Toggling

The application includes a dark mode and light mode toggle:

- The current theme state is stored in **local storage** and applied automatically on page reload.
- Accessible buttons with appropriate ARIA attributes are used to improve usability.

> [!IMPORTANT]
> Remember to change `const LOCAL_STORAGE_PREFIX` in `js-modules/theme.js` to a unique identifier.

[Back to menu](#menu)

---

## Testing and Compatibility

The application has been tested on the following platforms and browsers:

- **Operating System**: Windows 10
- **Browsers**:
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge

### Device View Testing

The layout and functionality have been verified in both browser and device simulation views to ensure responsiveness and usability.

[Back to menu](#menu)

---

## How to Run

1. Clone or download the repository to your local machine.
2. Open the project folder and start a simple HTTP server (e.g., using `Live Server` in VS Code or Python's `http.server` module).
3. Open the project in a modern browser (e.g., Chrome, Firefox, or Edge).

[Back to menu](#menu)

---

## Build & Deployment Setup for `/docs` Folder

If you want to deploy a minified version of this project to **GitHub Pages**, read on.

### 1. Install Required Packages

Run this once in your project root to install dev dependencies:

```bash
npm install
```

### 2. Run the full build process

In the terminal, run:

```bash
npm run build
```

### 3. Deploy to GitHub Pages

Once you've created a repository and pushed the files,

- go to `https://github.com/[your-name]/[your-project-name]/settings/pages`.
- Under "Build and deployment > Branch" make sure you set the branch to `main` and folder to `/docs`.
- Click "Save".

> [!NOTE]
> For a detailed description of the build process, configuration files and npm packages see my [GitHub Pages Optimised Build](https://github.com/chrisnajman/github-pages-optimised-build).

[Back to menu](#menu)
