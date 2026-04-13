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

This project will be built with:

* HTML5 semantic structure
* CSS3 with responsive layout and a consistent design system
* Vanilla JavaScript for rendering, filtering, form validation, and DOM updates
* Local JavaScript arrays/objects for the service gallery and pricing logic
* `fetch()` for the live industry insights widget

---

## Planned Assignment Alignment

This project is designed to satisfy the course requirements by including:

* a niche audience and clearly defined problem
* a project pitch in `README.md` before coding
* a dynamic data gallery using local JavaScript data
* real-time filtering/search
* a functional form with custom client-side validation
* a live widget using `fetch()` from a public data source
* at least three distinct views
* responsive design across mobile and desktop

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

This section will document at least one technical hurdle encountered during development and how it was solved.

Planned examples may include:

* connecting the service gallery, calculator, and live widget into one cohesive user flow
* handling API responses and displaying fallback UI when live data is unavailable
* designing calculator logic that stays simple enough for a class project while still feeling useful
* making a complex desktop layout adapt cleanly to mobile screens

This section will be updated as real implementation challenges appear during the build process.

---

## Status

The project is currently in the planning phase. The next steps are to finalize the pitch, map the data model, create the wireframe, and begin building the first view.
