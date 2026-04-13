# Notes

## Purpose

This file is used to capture project research, planning notes, API ideas, design decisions, and implementation references for the final project.

---

## Project Direction

**Project name:** Freelance Compass

**Core idea:** A niche web app for beginner freelance web developers who need help pricing projects, comparing service types, and deciding whether a client request is worth accepting.

---

## Initial Planning Notes

### Primary user

* Beginner freelance web developers
* Junior frontend developers starting client work
* People with technical skills but limited pricing/business experience

### Core user problems

* Unsure how much to charge
* Unsure how to judge project scope
* Unsure whether a client budget and deadline are realistic

### Core app sections

* Home / Dashboard
* Services Gallery
* Pricing Calculator
* Live Industry Insights Widget

---

## Data Ideas

### Local gallery data

Possible service cards:

* Landing Page
* Portfolio Website
* Small Business Website
* Blog / CMS Build
* Website Maintenance
* Accessibility Audit
* Performance Optimization
* SEO Setup

### Calculator inputs

Possible fields:

* service type
* number of pages
* budget
* timeline
* revisions
* design included
* content included
* SEO needed
* accessibility needed
* CMS needed

---

## API Research Ideas

Potential live widget directions:

* web industry article feed
* freelance market insight feed
* developer trend snapshot
* browser support insight widget

Potential sources to research further:

* DEV / dev.to API
* MDN browser compatibility data
* other public APIs related to web development trends or articles

---

## Fetch API Notes

### Basic flow

Typical `fetch()` workflow:

1. call `fetch(url)`
2. wait for the response
3. check if the response was successful
4. convert the response into JSON with `response.json()`
5. use the returned data to update the DOM

### Important

* `fetch()` is asynchronous
* `fetch()` does not automatically throw an error for HTTP errors like 404 or 500
* should check `response.ok` before using the response data
* should show a loading state while waiting for data
* should show a fallback message if the API request fails
* the live widget should not break the rest of the app if the API is unavailable

### Example pattern to remember

```js
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

### `try/catch` version

Another common pattern is using `async/await` with `try/catch`. This is often easier to read when the function has multiple steps like showing loading UI, checking the response, and then rendering the data.

```js
async function loadInsights() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

Notes:

* `try` contains the code that might fail
* `catch` handles errors without crashing the whole app
* this pattern is useful for API widgets because it keeps success and error logic in one place

---

## API Endpoint Notes

### What an endpoint is

An API endpoint is a specific URL that returns a certain kind of data.

For example:

* one endpoint might return a list of articles
* another endpoint might return information for a specific topic

### What to check when researching an endpoint

Before choosing an API endpoint, I should confirm:

* whether it needs an API key
* whether it allows requests directly from the browser
* whether the JSON response is simple enough to use in Vanilla JS
* whether the endpoint returns fields I actually need
* whether there are usage limits or rate limits

### Useful response fields for this project

For an article/trends widget, useful fields may include:

* title
* description or summary
* url
* source or author
* tag/category
* published date

---

## Live Widget Research

### Goal of the widget

The live widget should support the main idea of `Freelance Compass` and help a beginner freelance web developer understand what is happening in the web industry right now.

### Stronger widget directions

* web development article feed
* freelance market insights for web developers
* trends in accessibility, performance, frontend, or SEO
* browser support insights related to services freelancers may offer

### Weaker widget directions

* weather
* time zone
* generic quote of the day

These are easier technically, but they do not contribute as much to the identity of the app.

### Questions to answer during research

* Which API is easiest to use in a frontend-only project?
* Which API gives useful article or trend data with a simple JSON structure?
* Does it require authentication or an API key?
* Does it return enough data to build a professional-looking widget?
* Can I filter results so they stay relevant to freelance web developers?

---

## DEV.to / Forem API Research

### Current decision

For the class version of this project, the live widget will likely use public DEV / Forem article endpoints as a short-term solution.

Reason:

* the endpoints appear to return recent tagged articles in the browser right now
* this is fast to implement for a frontend-only class project
* the widget is a supporting feature, not the core of the app

Long-term note:

* this may not be the final production approach
* if needed later, the app can move API requests behind a small Vercel serverless function
* a more stable or secured source may replace this after the class submission

### Known API notes so far

Research so far suggests:

* DEV / Forem has official API docs
* some newer API docs mention headers and API keys for versioned API access
* however, some public article endpoints currently appear to work in the browser without a key

Important caution:

* just because an endpoint works right now does not guarantee it will remain the best long-term option
* for this class project, it is acceptable as a proof of concept if the endpoint is working during development and submission

### Planned widget approach

Do not fetch every article available.

Instead:

* fetch a small number of recent articles from selected relevant tags
* combine them into one local array in JavaScript
* display only a few items at a time, such as 4 to 6
* allow the user to filter the already-fetched items by tag in the UI

This should be faster and cleaner than requesting large amounts of content.

### Tag ideas

Possible relevant tags:

* `webdev`
* `javascript`
* `css`
* `frontend`
* other tags related to freelance web work, if useful results exist

### Expected fields to use in the widget

The widget will probably only need a few fields from each article:

* `title`
* `url`
* `tag` or tags
* `published date`
* `author` or source

### UI idea

Widget concept:

* title like `Live Industry Insights`
* small set of article cards or list items
* tag filter buttons such as `All`, `Webdev`, `JavaScript`, `CSS`
* external links to read the full article

### Implementation reminders

* use a loading state before the articles appear
* handle empty results
* handle fetch errors gracefully
* consider deduplicating articles if the same item appears under multiple tags
* keep a fallback message ready if the live feed becomes unavailable

---

## Error Handling Notes

The live widget should account for these states:

* loading state
* success state
* empty state
* error state

Possible fallback behavior:

* show a message like "Industry insights are temporarily unavailable"
* keep the rest of the page fully usable
* avoid breaking the layout if no data is returned

---

## Design Notes

Desired tone:

* professional
* modern
* useful
* more like a lightweight product dashboard

Design goals:

* strong visual identity
* responsive layout
* service cards that connect naturally to the calculator
* a live widget that feels relevant, not filler

---

## Next

* API decisions
* endpoint examples and sample responses
* wireframe ideas
* implementation challenges
* testing notes
* deployment notes
