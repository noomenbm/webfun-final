# Freelance Compass

## Project Pitch

**Freelance Compass** is a dynamic web application for beginner freelance web developers who need help pricing projects, comparing service options, and deciding whether a client request is worth taking on.

Many new freelancers know how to build websites, but they struggle with the business side of freelancing. They often do not know how to estimate effort, set fair pricing, compare different types of web projects, or recognize when a project scope is too risky for the budget or timeline.

Freelance Compass solves that problem by combining:

* local structured project and service data
* user input from an interactive calculator form
* a live industry insights widget powered by a public API

The result is a niche web portal that helps users make more confident project and pricing decisions.

---

## Why This App?

This app is designed to support beginner freelance web developers who are still learning how to:

* estimate the size of a client project
* compare different service types
* set pricing ranges
* evaluate whether a project is a good fit

Instead of relying on guesswork, users can explore service benchmarks, search project types, and use a guided decision form to receive a practical recommendation.

---

## User Persona

**Primary user:** beginner freelance web developers

Typical user traits:

* has technical web skills but limited business experience
* wants to freelance part-time or full-time
* needs help pricing services with more confidence
* wants to avoid undercharging, overcommitting, or accepting poor-fit projects

Example persona:

> A junior frontend developer starting freelance work who can build landing pages and small business websites, but is unsure how much to charge or whether a client's deadline and budget are realistic.

---

## The Problem

Beginner freelance web developers often struggle with three related decisions:

* What kind of web project am I being asked to build?
* What pricing range makes sense for this type of work?
* Should I accept this project, renegotiate it, or decline it?

Without a structured process, freelancers may:

* underprice their work
* underestimate project complexity
* accept rushed or low-budget projects
* fail to compare service options clearly

---

## Proposed Solution

Freelance Compass will provide a focused interface where users can:

1. Browse a searchable gallery of freelance web service cards
2. Compare service types such as landing pages, portfolio sites, maintenance work, or accessibility audits
3. Fill out a project evaluation form with client budget, timeline, scope, and add-ons
4. Receive a pricing and project-fit recommendation
5. View a live industry insights widget related to freelance web work

---

## Core Features

### 1. Service Gallery

A dynamic card gallery rendered from a local JavaScript array with at least 6 items.

Possible service cards include:

* Landing Page
* Portfolio Website
* Small Business Website
* Blog / CMS Build
* Website Maintenance
* Accessibility Audit
* Performance Optimization
* SEO Setup

Users will be able to search and filter these cards in real time.

### 2. Project Pricing and Fit Calculator

A form where the user enters project details such as:

* service type
* number of pages
* timeline urgency
* budget
* revisions requested
* content/design responsibility
* extra features such as SEO, accessibility, or CMS setup

The app will use those inputs plus local benchmark data to generate a recommendation such as:

* fair pricing range
* low-budget warning
* scope-risk warning
* accept / renegotiate / decline guidance

### 3. Live Industry Insights Widget

A live widget powered by `fetch()` that displays current web industry insights relevant to freelance web developers.

This widget may include:

* current articles related to web development and freelancing
* trends in service areas such as accessibility, performance, or frontend development
* a small market snapshot that helps users understand what topics are active in the web industry

### 4. Multi-View Interface

The project will include at least three distinct views or sections, such as:

* Home / Dashboard
* Services Gallery
* Pricing Calculator
* Live Insights

---

## Data Mapping

### Service Card Object

Each service card in the local data array may include fields such as:

* `id`
* `title`
* `category`
* `description`
* `difficulty`
* `typicalTimeline`
* `startingPrice`
* `recommendedFor`
* `deliverables`
* `tags`

### Project Evaluation Input Object

The calculator logic may use fields such as:

* `serviceType`
* `pages`
* `deadlineDays`
* `budget`
* `revisions`
* `includesDesign`
* `includesContent`
* `needsCms`
* `needsSeo`
* `needsAccessibility`
* `needsPerformance`

### Recommendation Output Object

The result displayed to the user may include:

* `estimatedPriceMin`
* `estimatedPriceMax`
* `timelineAssessment`
* `budgetAssessment`
* `scopeAssessment`
* `recommendationLabel`
* `recommendationMessage`

### Live Widget Data Object

The fetched widget data may include fields such as:

* `title`
* `source`
* `url`
* `publishedAt`
* `tag`
* `summary`

---

## Technical Approach

This project is built with:

* HTML5 semantic structure
* CSS3 with responsive layout and a consistent design system
* Vanilla JavaScript for rendering, filtering, form validation, and DOM updates
* Local JavaScript arrays/objects for the service gallery and pricing logic
* `fetch()` for the live industry insights widget

---

## Assignment Alignment

This project satisfies the course requirements by including:

* a niche audience and clearly defined problem
* a project pitch in `README.md` before coding
* a dynamic data gallery using local JavaScript data
* real-time filtering/search
* a functional form with custom client-side validation
* a live widget using `fetch()` from a public data source
* at least three distinct views
* responsive design across mobile and desktop

---

## Live Links

* **GitHub repository:** https://github.com/noomenbm/webfun-final
* **Current live deployment (GitHub Pages):** https://noomenbm.github.io/webfun-final/
* **Final Vercel deployment:** https://freelance-compass.vercel.app/#home
* **Figma wireframe:** https://www.figma.com/proto/ihyT071BriZCjLh3fEEqnk/Freelance-Compass-Wireframe?node-id=2-1600&t=S2ObrFTQrB3kT0fz-1

---

## Future Expansion

After the class version is complete, Freelance Compass could expand into a more advanced portfolio project with features such as:

* saved quotes and project scenarios
* proposal generation
* recurring maintenance package comparisons
* user accounts
* charts and trend dashboards
* a richer freelancer market intelligence feed

---

## Challenges & Solutions

One of the main technical challenges in this project was responsive layout refinement across many viewport sizes.

The app includes several components that behave very differently depending on screen width:

* the service gallery toolbar
* the service card grid and expandable details panels
* the calculator form and recommendation panel
* the live insights widget and its responsive card counts

The biggest difficulty was not just making the layout "work" on one mobile width and one desktop width. The harder problem was making sure spacing, alignment, and component sizing still felt intentional on intermediate widths such as tablets and narrow laptops.

The solution was a more systematic testing and refinement process:

* build the layout mobile-first, then scale upward
* test multiple viewport ranges instead of only one mobile and one desktop size
* identify the components that changed structure the most, especially the calculator grid and the insights/service card grids
* use targeted media queries to adjust layout at specific breakpoints instead of relying on one broad rule
* make incremental CSS changes, then re-check the result in browser responsive tools before moving on

This process led to several improvements, such as:

* calculator fields that stack on smaller screens but sit side by side on wider ones
* a header/navigation system that stays expanded on larger screens but collapses into a mobile menu on smaller screens
* service and insights cards that limit visible content and preserve more consistent card heights
* toolbar and section spacing adjustments for tablet and mobile layouts
* expanded/collapsed behaviors that still feel usable on smaller screens

The biggest lesson from this challenge was that responsive design is not solved by one CSS rule. It requires repeated testing, careful breakpoint decisions, and small focused adjustments until the layout feels stable across realistic screen sizes.

---

## Status

The project is functionally complete and in final submission polish.

Completed work includes:

* project pitch, user persona, problem definition, and planning documentation
* low-fidelity wireframes linked through Figma
* a responsive single-page layout with JS-toggled views
* a dynamic local service gallery with search, filtering, sorting, and expandable details
* a pricing and project-fit calculator with custom client-side validation
* a live industry insights widget powered by the DEV.to API
* GitHub Pages deployment
* calculator local storage that restores previous form inputs

Current focus:

* final README cleanup and submission wording
* final deployment to Vercel
* any last small polish fixes discovered during final QA
