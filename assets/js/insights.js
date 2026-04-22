"use strict";

const insightsStatus = document.querySelector("#insights-status");
const insightsList = document.querySelector("#insights-list");
const insightsToggleButton = document.querySelector("#insights-toggle");
const insightFilterButtons = document.querySelectorAll(
  ".insights-toolbar .tag-filter"
);

const insightTagConfig = {
  all: [
    "webdev",
    "javascript",
    "css",
    "react",
    "seo",
    "performance",
    "accessibility",
    "freelancing",
  ],
  webdev: ["webdev", "frontend", "web-development", "html", "career"],
  javascript: ["javascript", "js", "typescript"],
  css: ["css", "tailwindcss", "sass", "responsive", "frontend"],
  react: ["react", "reactjs", "nextjs"],
  seo: ["seo", "searchengineoptimization", "marketing"],
  performance: [
    "performance",
    "webperf",
    "corewebvitals",
    "optimization",
  ],
  accessibility: ["accessibility", "a11y", "inclusive-design"],
  freelancing: ["freelancing", "career", "productivity", "business"],
};

let insightsCatalog = [];
let activeInsightTag = "all";
let insightsExpanded = false;
let insightsLoaded = false;
let insightsLoadInFlight = false;

function setInsightsStatus(message) {
  if (insightsStatus) {
    insightsStatus.textContent = message;
  }
}

function normalizeTagList(rawTags) {
  if (Array.isArray(rawTags)) {
    return rawTags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof rawTags === "string") {
    return rawTags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
}

function normalizeInsightArticle(article) {
  return {
    id: article.id,
    title: article.title || "Untitled article",
    description: article.description || "",
    url: article.url || article.canonical_url || "#",
    publishedAt: article.published_at || article.published_timestamp || "",
    readingTime: article.reading_time_minutes || 0,
    positiveReactions: article.positive_reactions_count || 0,
    commentsCount: article.comments_count || 0,
    tags: normalizeTagList(article.tag_list),
    authorName: article.user?.name || "DEV Community",
  };
}

function formatInsightDate(dateString) {
  if (!dateString) {
    return "Recent post";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recent post";
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInsightKeywords(tag) {
  return insightTagConfig[tag] || [tag];
}

function getVisibleInsights() {
  if (activeInsightTag === "all") {
    return insightsCatalog;
  }

  const keywords = getInsightKeywords(activeInsightTag);

  return insightsCatalog.filter((article) => {
    return article.tags.some((tag) => {
      return keywords.some((keyword) => {
        return tag.includes(keyword);
      });
    });
  });
}

function getInsightDisplayCounts() {
  if (window.innerWidth <= 640) {
    return {
      collapsed: 1,
      expanded: 4,
    };
  }

  if (window.innerWidth <= 760) {
    return {
      collapsed: 2,
      expanded: 6,
    };
  }

  return {
    collapsed: 3,
    expanded: 9,
  };
}

function getDisplayedInsights() {
  const visibleInsights = getVisibleInsights();
  const insightCounts = getInsightDisplayCounts();
  const visibleCount = insightsExpanded
    ? insightCounts.expanded
    : insightCounts.collapsed;

  return visibleInsights.slice(0, visibleCount);
}

function createInsightMetaItem(text) {
  const item = document.createElement("span");
  item.className = "insight-meta-item";
  item.textContent = text;
  return item;
}

function createInsightCard(article) {
  const card = document.createElement("article");
  card.className = "insight-card";

  const meta = document.createElement("div");
  meta.className = "insight-card-meta";
  meta.append(
    createInsightMetaItem(formatInsightDate(article.publishedAt)),
    createInsightMetaItem(`${Math.max(article.readingTime, 1)} min read`)
  );

  const title = document.createElement("h3");
  title.className = "insight-title";

  const titleLink = document.createElement("a");
  titleLink.className = "insight-title-link";
  titleLink.href = article.url;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  titleLink.textContent = article.title;

  title.append(titleLink);

  const summary = document.createElement("p");
  summary.className = "insight-summary";
  summary.textContent =
    article.description || "Open the article to read the full insight.";

  const tags = document.createElement("div");
  tags.className = "insight-tags";

  article.tags.slice(0, 3).forEach((tag) => {
    const tagPill = document.createElement("span");
    tagPill.className = "insight-tag";
    tagPill.textContent = `#${tag}`;
    tags.append(tagPill);
  });

  const footer = document.createElement("div");
  footer.className = "insight-card-footer";

  const link = document.createElement("a");
  link.className = "insight-link";
  link.href = article.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Read article";

  footer.append(link);
  card.append(meta, title, summary);

  if (article.tags.length) {
    card.append(tags);
  }

  card.append(footer);

  return card;
}

function renderEmptyInsights(message) {
  if (!insightsList) {
    return;
  }

  insightsList.replaceChildren();

  const emptyCard = document.createElement("article");
  emptyCard.className = "insight-card insight-card-empty";

  const title = document.createElement("h3");
  title.textContent = "No matching insights";

  const body = document.createElement("p");
  body.className = "insight-summary";
  body.textContent = message;

  emptyCard.append(title, body);
  insightsList.append(emptyCard);
}

function renderInsights(insights) {
  if (!insightsList) {
    return;
  }

  if (!insights.length) {
    renderEmptyInsights("Try another topic filter to explore more articles.");
    return;
  }

  insightsList.replaceChildren(...insights.map(createInsightCard));
}

function updateInsightsToggleButton() {
  if (!insightsToggleButton) {
    return;
  }

  const visibleInsights = getVisibleInsights();
  const insightCounts = getInsightDisplayCounts();
  const hasMoreInsights = visibleInsights.length > insightCounts.collapsed;

  insightsToggleButton.hidden = !hasMoreInsights;

  if (!hasMoreInsights) {
    return;
  }

  insightsToggleButton.textContent = insightsExpanded
    ? "Show fewer insights"
    : "Show more insights";
}

function updateInsightFilterButtons() {
  insightFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tag === activeInsightTag);
  });
}

function refreshInsightsView() {
  updateInsightFilterButtons();
  renderInsights(getDisplayedInsights());
  updateInsightsToggleButton();

  if (activeInsightTag === "all") {
    setInsightsStatus("Browse current topics relevant to freelance web developers.");
    return;
  }

  const label =
    activeInsightTag === "webdev" ? "web development" : activeInsightTag;
  setInsightsStatus(`Showing ${label} insights from the DEV Community.`);
}

function animateInsightsListHeight() {
  if (!insightsList) {
    refreshInsightsView();
    return;
  }

  const startingHeight = insightsList.getBoundingClientRect().height;

  refreshInsightsView();

  const endingHeight = insightsList.scrollHeight;

  if (Math.abs(endingHeight - startingHeight) < 2) {
    return;
  }

  insightsList.classList.add("is-animating");
  insightsList.style.height = `${startingHeight}px`;
  void insightsList.offsetHeight;
  insightsList.style.height = `${endingHeight}px`;

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== "height") {
      return;
    }

    insightsList.removeEventListener("transitionend", handleTransitionEnd);
    insightsList.classList.remove("is-animating");
    insightsList.style.height = "";
  };

  insightsList.addEventListener("transitionend", handleTransitionEnd);
}

async function fetchInsightsByTag(tag) {
  const response = await fetch(
    `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&state=fresh&per_page=6`
  );

  if (!response.ok) {
    throw new Error(`Unable to load ${tag} insights.`);
  }

  return response.json();
}

async function loadIndustryInsights() {
  if (insightsLoadInFlight) {
    return;
  }

  insightsLoadInFlight = true;
  setInsightsStatus("Loading industry insights...");

  try {
    const taggedResponses = await Promise.allSettled(
      insightTagConfig.all.map((tag) => fetchInsightsByTag(tag))
    );

    const insightMap = new Map();

    taggedResponses.forEach((response) => {
      if (response.status !== "fulfilled") {
        return;
      }

      response.value.forEach((article) => {
        const normalizedArticle = normalizeInsightArticle(article);
        const mapKey = normalizedArticle.id || normalizedArticle.url;

        if (mapKey && !insightMap.has(mapKey)) {
          insightMap.set(mapKey, normalizedArticle);
        }
      });
    });

    insightsCatalog = Array.from(insightMap.values()).sort(
      (firstArticle, secondArticle) => {
        return (
          new Date(secondArticle.publishedAt) - new Date(firstArticle.publishedAt)
        );
      }
    );

    if (!insightsCatalog.length) {
      setInsightsStatus("No live insights are available right now.");
      renderEmptyInsights(
        "The feed returned no articles at the moment. Please try again later."
      );
      insightsLoaded = false;
      return;
    }

    insightsLoaded = true;
    refreshInsightsView();
  } catch (error) {
    insightsCatalog = [];
    insightsLoaded = false;
    setInsightsStatus("Industry insights are unavailable right now.");
    renderEmptyInsights(
      "The live feed could not be loaded. Please try again later."
    );
  } finally {
    insightsLoadInFlight = false;
  }
}

function ensureInsightsLoaded(activeView = "") {
  if (insightsLoaded || insightsLoadInFlight) {
    return;
  }

  if (activeView === "insights") {
    loadIndustryInsights();
    return;
  }

  window.setTimeout(() => {
    if (!insightsLoaded && !insightsLoadInFlight) {
      loadIndustryInsights();
    }
  }, 250);
}

insightFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeInsightTag = button.dataset.tag || "all";
    insightsExpanded = false;
    refreshInsightsView();
  });
});

insightsToggleButton?.addEventListener("click", () => {
  insightsExpanded = !insightsExpanded;
  animateInsightsListHeight();
});

window.addEventListener("resize", refreshInsightsView);
window.addEventListener("freelance-compass:viewchange", (event) => {
  ensureInsightsLoaded(event.detail?.view || "");
});

ensureInsightsLoaded(window.location.hash.replace("#", "").trim().toLowerCase());
