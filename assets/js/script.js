"use strict";

// Local project data served from the same site.
const servicesDataURL = "./data/services.json";

// Single-page multi-view handling
const viewSections = document.querySelectorAll("[data-view-section]");
const viewLinks = document.querySelectorAll("[data-view-link]");
const validViews = new Set(["home", "services", "calculator", "insights"]);
const defaultView = "home";
const navToggleButton = document.querySelector(".nav-toggle");
const headerActions = document.querySelector(".header-actions");


// Service grid handling
const servicesGrid = document.querySelector("#services-grid");
const serviceSearchInput = document.querySelector("#service-search");
const serviceFilterSelect = document.querySelector("#service-filter");
const serviceSortSelect = document.querySelector("#service-sort");
const servicesClearButton = document.querySelector("#services-clear");


// Calculator logic handling
const calculatorForm = document.querySelector("#calculator-form");
const serviceTypeSelect = document.querySelector("#service-type");
const estimatedPagesInput = document.querySelector("#estimated-pages");
const budgetInput = document.querySelector("#budget");
const clientRevisionsSelect = document.querySelector("#client-revisions");
const calculatorClearButton = document.querySelector("#calculator-clear");
const calculatorStorageKey = "freelanceCompassCalculator";

const calculatorErrorElements = {
  serviceType: document.querySelector("#service-type-error"),
  estimatedPages: document.querySelector("#estimated-pages-error"),
  budget: document.querySelector("#budget-error"),
  clientRevisions: document.querySelector("#client-revisions-error"),
};

const calculatorResultElements = {
  priceRange: document.querySelector("#result-price-range"),
  budget: document.querySelector("#result-budget"),
  timeline: document.querySelector("#result-timeline"),
  scope: document.querySelector("#result-scope"),
  label: document.querySelector("#result-label"),
  message: document.querySelector("#result-message"),
};
const resultsCard = document.querySelector(".results-card");
const resultHighlight = document.querySelector(".result-highlight");

const defaultCalculatorResults = {
  priceRange: "$0 - $0",
  budget: "Enter project details to compare budget fit.",
  timeline: "Timeline evaluation will appear here.",
  scope: "Scope evaluation will appear here.",
  label: "Waiting for input",
  message: "Complete the calculator to receive a project-fit recommendation.",
};

let serviceCatalog = [];

function setMobileNavState(isOpen) {
  if (!navToggleButton || !headerActions) {
    return;
  }

  navToggleButton.setAttribute("aria-expanded", String(isOpen));
  headerActions.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
}

function closeMobileNav() {
  setMobileNavState(false);
}

function getRequestedView() {
  const requestedHash = window.location.hash.replace("#", "").trim().toLowerCase();
  return validViews.has(requestedHash) ? requestedHash : defaultView;
}

function setActiveView(viewName) {
  const activeView = validViews.has(viewName) ? viewName : defaultView;

  viewSections.forEach((section) => {
    const isActive = section.dataset.viewSection === activeView;
    section.hidden = !isActive;
  });

  viewLinks.forEach((link) => {
    const isActive = link.dataset.viewLink === activeView;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.body.dataset.activeView = activeView;
  closeMobileNav();
  window.dispatchEvent(
    new CustomEvent("freelance-compass:viewchange", {
      detail: { view: activeView },
    })
  );
  window.scrollTo({ top: 0, behavior: "auto" });
}

function syncViewFromHash() {
  const nextView = getRequestedView();

  if (window.location.hash !== `#${nextView}`) {
    history.replaceState(null, "", `#${nextView}`);
  }

  setActiveView(nextView);
}

function saveCalculatorState() {
  if (!calculatorForm) {
    return;
  }

  const calculatorState = {
    serviceType: serviceTypeSelect.value,
    estimatedPages: estimatedPagesInput.value,
    budget: budgetInput.value,
    complexity: getCheckedValue("complexity"),
    timelineUrgency: getCheckedValue("timelineUrgency"),
    includedWork: getCheckedValues("includedWork"),
    extras: getCheckedValues("extras"),
    clientRevisions: clientRevisionsSelect.value,
  };

  try {
    window.localStorage.setItem(
      calculatorStorageKey,
      JSON.stringify(calculatorState)
    );
  } catch (error) {
    // Storage should never block the rest of the app.
  }
}

function clearCalculatorState() {
  try {
    window.localStorage.removeItem(calculatorStorageKey);
  } catch (error) {
    // Ignore storage failures and keep the UI usable.
  }
}

function setCheckedValues(name, values) {
  const selectedValues = new Set(values);

  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = selectedValues.has(input.value);
  });
}

function applyCalculatorState(savedState) {
  if (!savedState || typeof savedState !== "object") {
    return;
  }

  serviceTypeSelect.value = String(savedState.serviceType || "");
  estimatedPagesInput.value = savedState.estimatedPages || "";
  budgetInput.value = savedState.budget || "";
  clientRevisionsSelect.value = String(savedState.clientRevisions || "");

  const complexityValue = String(savedState.complexity || "");
  const timelineUrgencyValue = String(savedState.timelineUrgency || "");

  document.querySelectorAll('input[name="complexity"]').forEach((input) => {
    input.checked = input.value === complexityValue;
  });

  document.querySelectorAll('input[name="timelineUrgency"]').forEach((input) => {
    input.checked = input.value === timelineUrgencyValue;
  });

  setCheckedValues("includedWork", Array.isArray(savedState.includedWork)
    ? savedState.includedWork.map(String)
    : []);
  setCheckedValues(
    "extras",
    Array.isArray(savedState.extras) ? savedState.extras.map(String) : []
  );
}

function loadCalculatorState() {
  try {
    const rawCalculatorState = window.localStorage.getItem(calculatorStorageKey);

    if (!rawCalculatorState) {
      return null;
    }

    return JSON.parse(rawCalculatorState);
  } catch (error) {
    clearCalculatorState();
    return null;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function roundQuoteAmount(amount) {
  if (amount < 1000) {
    return Math.round(amount / 25) * 25;
  }

  if (amount < 3000) {
    return Math.round(amount / 50) * 50;
  }

  return Math.round(amount / 100) * 100;
}

function getTimelineValue(timelineText) {
  if (timelineText.toLowerCase() === "ongoing") {
    return Number.POSITIVE_INFINITY;
  }

  const numericParts = timelineText.match(/\d+/g);

  if (!numericParts) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(numericParts[0]);
}

function renderServiceGallery(services) {
  if (!services.length) {
    servicesGrid.innerHTML = `
      <article class="service-card">
        <h3>No matching services</h3>
        <p class="service-description">
          Try a different search term or category.
        </p>
      </article>
    `;
    return;
  }

  servicesGrid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card">
          <h3>${service.title}</h3>

          <div class="service-card-top">
            <p class="service-price">${formatCurrency(service.startingPrice)}+</p>
            <p class="service-timeline">${service.typicalTimeline}</p>
          </div>

          <dl class="service-meta">
            <dt class="service-meta-label">Complexity:</dt>
            <dd class="service-meta-value">${service.difficulty}</dd>
          </dl>

          <details class="service-details">
            <summary>View details</summary>

            <div class="service-details-content">
              <div class="service-details-inner">
                <dl class="service-details-meta">
                  <div>
                    <dt>Recommended for</dt>
                    <dd>${service.recommendedFor}</dd>
                  </div>
                </dl>

                <p class="service-description">${service.description}</p>

                <ul class="service-deliverables" aria-label="${service.title} deliverables">
                  ${service.deliverables
                    .map((deliverable) => `<li>${deliverable}</li>`)
                    .join("")}
                </ul>
                <div>
                  <dt>Category</dt>
                  <dd>${service.category}</dd>
                </div>
              </div>
            </div>
          </details>
        </article>
      `
    )
    .join("");

  setupServiceDetailAnimations();
}

function getVisibleServices() {
  const searchTerm = serviceSearchInput.value.trim().toLowerCase();
  const selectedCategory = serviceFilterSelect.value;
  const selectedSort = serviceSortSelect.value;

  const filteredServices = serviceCatalog.filter((service) => {
    const matchesSearch =
      !searchTerm ||
      service.title.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.recommendedFor.toLowerCase().includes(searchTerm) ||
      service.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices];

  switch (selectedSort) {
    case "price-low":
      sortedServices.sort((firstService, secondService) => {
        return firstService.startingPrice - secondService.startingPrice;
      });
      break;
    case "price-high":
      sortedServices.sort((firstService, secondService) => {
        return secondService.startingPrice - firstService.startingPrice;
      });
      break;
    case "timeline-fast":
      sortedServices.sort((firstService, secondService) => {
        return (
          getTimelineValue(firstService.typicalTimeline) -
          getTimelineValue(secondService.typicalTimeline)
        );
      });
      break;
    default:
      sortedServices.sort((firstService, secondService) => {
        return firstService.id - secondService.id;
      });
  }

  return sortedServices;
}

function updateServiceGallery() {
  renderServiceGallery(getVisibleServices());
}

function updateServicesClearButton() {
  if (!servicesClearButton) {
    return;
  }

  const hasActiveFilters =
    serviceSearchInput.value.trim() !== "" ||
    serviceFilterSelect.value !== "all" ||
    serviceSortSelect.value !== "default";

  servicesClearButton.disabled = !hasActiveFilters;
}

function refreshServiceGallery() {
  updateServiceGallery();
  updateServicesClearButton();
}

function clearServiceFilters() {
  serviceSearchInput.value = "";
  serviceFilterSelect.value = "all";
  serviceSortSelect.value = "default";
  refreshServiceGallery();
}

function populateCalculatorServiceOptions() {
  if (!serviceTypeSelect) {
    return;
  }

  const optionsMarkup = serviceCatalog
    .map((service) => {
      return `
        <option value="${service.id}">
          ${service.title}
        </option>
      `;
    })
    .join("");

  serviceTypeSelect.innerHTML = `
    <option value="">Select a service</option>
    ${optionsMarkup}
  `;
}

function clearCalculatorErrors() {
  Object.values(calculatorErrorElements).forEach((errorElement) => {
    if (errorElement) {
      errorElement.textContent = "";
    }
  });
}

function resetCalculatorResults() {
  calculatorResultElements.priceRange.textContent =
    defaultCalculatorResults.priceRange;
  calculatorResultElements.budget.textContent = defaultCalculatorResults.budget;
  calculatorResultElements.timeline.textContent =
    defaultCalculatorResults.timeline;
  calculatorResultElements.scope.textContent = defaultCalculatorResults.scope;
  calculatorResultElements.label.textContent = defaultCalculatorResults.label;
  calculatorResultElements.message.textContent =
    defaultCalculatorResults.message;

  resultsCard.classList.remove("is-active", "just-updated");
  resultHighlight.classList.remove("is-active");
  window.clearTimeout(renderCalculatorRecommendation.updateTimer);
}

function clearCalculatorForm() {
  calculatorForm.reset();
  clearCalculatorErrors();
  resetCalculatorResults();
  clearCalculatorState();
}

function getCheckedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function getCheckedValues(name) {
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`),
    (input) => input.value
  );
}

function getCalculatorFormData() {
  return {
    serviceType: serviceTypeSelect.value,
    estimatedPages: Number(estimatedPagesInput.value),
    budget: Number(budgetInput.value),
    complexity: getCheckedValue("complexity"),
    timelineUrgency: getCheckedValue("timelineUrgency"),
    includedWork: getCheckedValues("includedWork"),
    extras: getCheckedValues("extras"),
    clientRevisions: clientRevisionsSelect.value,
  };
}

function validateCalculatorForm(formData) {
  clearCalculatorErrors();

  let isValid = true;

  if (!formData.serviceType) {
    calculatorErrorElements.serviceType.textContent = "Select a project type.";
    isValid = false;
  }

  if (!Number.isFinite(formData.estimatedPages) || formData.estimatedPages < 1) {
    calculatorErrorElements.estimatedPages.textContent =
      "Enter at least 1 estimated page.";
    isValid = false;
  }

  if (!Number.isFinite(formData.budget) || formData.budget <= 0) {
    calculatorErrorElements.budget.textContent =
      "Enter a valid project budget.";
    isValid = false;
  }

  if (!formData.clientRevisions) {
    calculatorErrorElements.clientRevisions.textContent =
      "Choose a revision level.";
    isValid = false;
  }

  return isValid;
}


// Esstimate calculation
function calculateProjectRecommendation(formData) {
  const selectedService = serviceCatalog.find((service) => {
    return String(service.id) === formData.serviceType;
  });

  const complexityMultipliers = {
    basic: 1,
    medium: 1.2,
    advanced: 1.45,
  };

  const timelineMultipliers = {
    flexible: 1,
    soon: 1.15,
    rush: 1.3,
  };

  const includedWorkCosts = {
    design: 450,
    content: 250,
  };

  const extraServiceCosts = {
    seo: 300,
    accessibility: 450,
    cms: 700,
    performance: 350,
  };

  const revisionCosts = {
    1: 0,
    2: 150,
    3: 300,
  };

  const basePrice = selectedService.startingPrice;
  const additionalPageCost = Math.max(formData.estimatedPages - 1, 0) * 120;
  const includedWorkTotal = formData.includedWork.reduce((total, item) => {
    return total + includedWorkCosts[item];
  }, 0);
  const extrasTotal = formData.extras.reduce((total, item) => {
    return total + extraServiceCosts[item];
  }, 0);

  const subtotal =
    basePrice +
    additionalPageCost +
    includedWorkTotal +
    extrasTotal +
    revisionCosts[formData.clientRevisions];

  const adjustedPrice =
    subtotal *
    complexityMultipliers[formData.complexity || "basic"] *
    timelineMultipliers[formData.timelineUrgency || "flexible"];

  const estimatedMin = roundQuoteAmount(adjustedPrice * 0.92);
  const estimatedMax = roundQuoteAmount(adjustedPrice * 1.12);

  let budgetAssessment = "The budget appears workable for this scope.";
  let timelineAssessment = "The current timeline looks manageable.";
  let scopeAssessment = "The project scope appears reasonable as described.";
  let recommendationLabel = "Accept";
  let recommendationMessage =
    "This project looks like a reasonable fit. Keep the proposal specific.";

  // ====== Decision =========
  if (formData.budget < estimatedMin) {
    budgetAssessment =
      "The client budget is below the estimated minimum for this work.";
    recommendationLabel = "Renegotiate";
    recommendationMessage =
      "The project may still work, but the scope or budget likely needs adjustment.";
  } else if (formData.budget > estimatedMax) {
    budgetAssessment =
      "The client budget is above your estimated range, which gives you flexibility.";
  }

  if (formData.timelineUrgency === "soon") {
    timelineAssessment =
      "The deadline is somewhat tight, so keep revisions and deliverables clearly scoped.";
  }

  if (formData.timelineUrgency === "rush") {
    timelineAssessment =
      "This is a rush timeline and increases delivery pressure.";
    recommendationLabel = formData.budget >= estimatedMax ? "Renegotiate" : "Decline";
    recommendationMessage =
      "The rushed timeline adds delivery risk. Consider negotiating timeline, scope, or price.";
  }

  if (formData.extras.length >= 2 || formData.estimatedPages >= 6) {
    scopeAssessment =
      "This scope is getting heavier, so define deliverables and revision limits very clearly.";
  }

  if (
    formData.timelineUrgency === "rush" &&
    formData.complexity === "advanced" &&
    formData.budget < estimatedMax
  ) {
    recommendationLabel = "Decline";
    recommendationMessage =
      "This combination of advanced scope, rushed timing, and limited budget is high risk.";
  }

  return {
    estimatedMin,
    estimatedMax,
    budgetAssessment,
    timelineAssessment,
    scopeAssessment,
    recommendationLabel,
    recommendationMessage,
  };
}

function renderCalculatorRecommendation(recommendation) {
  calculatorResultElements.priceRange.textContent = `${formatCurrency(
    recommendation.estimatedMin
  )} - ${formatCurrency(recommendation.estimatedMax)}`;
  calculatorResultElements.budget.textContent = recommendation.budgetAssessment;
  calculatorResultElements.timeline.textContent =
    recommendation.timelineAssessment;
  calculatorResultElements.scope.textContent = recommendation.scopeAssessment;
  calculatorResultElements.label.textContent = recommendation.recommendationLabel;
  calculatorResultElements.message.textContent =
    recommendation.recommendationMessage;

  resultsCard.classList.add("is-active");
  resultHighlight.classList.add("is-active");
  resultsCard.classList.remove("just-updated");
  void resultsCard.offsetWidth;
  resultsCard.classList.add("just-updated");

  window.clearTimeout(renderCalculatorRecommendation.updateTimer);
  renderCalculatorRecommendation.updateTimer = window.setTimeout(() => {
    resultsCard.classList.remove("just-updated");
  }, 1400);
}

function revealCalculatorResults() {
  const calculatorSection = document.querySelector(
    '[data-view-section="calculator"]'
  );

  if (calculatorSection?.hidden) {
    history.replaceState(null, "", "#calculator");
    setActiveView("calculator");
  }

  const resultsCardTop =
    resultsCard.getBoundingClientRect().top + window.scrollY;
  let viewportOffset = window.innerHeight * 0.12;

  if (window.innerWidth <= 520) {
    viewportOffset = window.innerHeight * 0.02;
  } else if (window.innerWidth <= 900) {
    viewportOffset = window.innerHeight * 0.12;
  }

  window.scrollTo({
    top: Math.max(resultsCardTop - viewportOffset, 0),
    behavior: "smooth",
  });
}

function setupServiceDetailAnimations() {
  const serviceDetailsElements = document.querySelectorAll(".service-details");

  function animateOpen(detailsElement, contentElement, innerElement) {
    contentElement.dataset.animating = "true";
    detailsElement.open = true;
    contentElement.style.transition = "none";
    contentElement.style.height = "0px";
    contentElement.style.opacity = "0";
    contentElement.style.marginBottom = "0px";
    void contentElement.offsetHeight;
    contentElement.style.transition =
      "height 650ms ease, opacity 360ms ease, margin-bottom 650ms ease";
    contentElement.style.height = `${innerElement.scrollHeight}px`;
    contentElement.style.opacity = "1";
    contentElement.style.marginBottom = "1rem";

    const handleTransitionEnd = (transitionEvent) => {
      if (transitionEvent.propertyName !== "height") {
        return;
      }

      contentElement.removeEventListener("transitionend", handleTransitionEnd);
      contentElement.dataset.animating = "false";
      contentElement.style.height = "auto";
    };

    contentElement.addEventListener("transitionend", handleTransitionEnd);
  }

  function animateClose(detailsElement, contentElement, innerElement) {
    contentElement.dataset.animating = "true";
    const currentHeight = innerElement.scrollHeight;
    contentElement.style.transition = "none";
    contentElement.style.height = `${currentHeight}px`;
    contentElement.style.opacity = "1";
    contentElement.style.marginBottom = "1rem";
    void contentElement.offsetHeight;
    contentElement.style.transition =
      "height 650ms ease, opacity 320ms ease, margin-bottom 650ms ease";
    contentElement.style.height = "0px";
    contentElement.style.opacity = "0";
    contentElement.style.marginBottom = "0px";

    const handleTransitionEnd = (transitionEvent) => {
      if (transitionEvent.propertyName !== "height") {
        return;
      }

      contentElement.removeEventListener("transitionend", handleTransitionEnd);
      contentElement.dataset.animating = "false";
      detailsElement.open = false;
      contentElement.style.height = "0px";
    };

    contentElement.addEventListener("transitionend", handleTransitionEnd);
  }

  serviceDetailsElements.forEach((detailsElement) => {
    const summaryElement = detailsElement.querySelector("summary");
    const contentElement = detailsElement.querySelector(".service-details-content");
    const innerElement = detailsElement.querySelector(".service-details-inner");

    if (
      !summaryElement ||
      !contentElement ||
      !innerElement ||
      summaryElement.dataset.animationBound === "true"
    ) {
      return;
    }

    summaryElement.dataset.animationBound = "true";
    contentElement.style.height = "0px";
    contentElement.style.opacity = "0";
    contentElement.style.marginBottom = "0px";

    summaryElement.addEventListener("click", (event) => {
      event.preventDefault();

      if (contentElement.dataset.animating === "true") {
        return;
      }

      const isOpening = !detailsElement.open;

      if (isOpening) {
        serviceDetailsElements.forEach((otherDetailsElement) => {
          if (otherDetailsElement === detailsElement || !otherDetailsElement.open) {
            return;
          }

          const otherContentElement = otherDetailsElement.querySelector(
            ".service-details-content"
          );
          const otherInnerElement = otherDetailsElement.querySelector(
            ".service-details-inner"
          );

          if (
            !otherContentElement ||
            !otherInnerElement ||
            otherContentElement.dataset.animating === "true"
          ) {
            return;
          }

          animateClose(
            otherDetailsElement,
            otherContentElement,
            otherInnerElement
          );
        });

        animateOpen(detailsElement, contentElement, innerElement);
      } else {
        animateClose(detailsElement, contentElement, innerElement);
      }
    });
  });
}

async function loadServiceCatalog() {
  try {
    const response = await fetch(servicesDataURL);

    if (!response.ok) {
      throw new Error("Unable to load service data.");
    }

    serviceCatalog = await response.json();
    populateCalculatorServiceOptions();
    refreshServiceGallery();

    const savedCalculatorState = loadCalculatorState();

    if (savedCalculatorState) {
      applyCalculatorState(savedCalculatorState);
      clearCalculatorErrors();
      resetCalculatorResults();
    }
  } catch (error) {
    servicesGrid.innerHTML = `
      <article class="service-card">
        <h3>Service data unavailable</h3>
        <p class="service-description">
          The local service catalog could not be loaded right now.
        </p>
      </article>
    `;
  }
}

serviceSearchInput.addEventListener("input", refreshServiceGallery);
serviceFilterSelect.addEventListener("change", refreshServiceGallery);
serviceSortSelect.addEventListener("change", refreshServiceGallery);
servicesClearButton?.addEventListener("click", clearServiceFilters);
calculatorForm.addEventListener("input", saveCalculatorState);
calculatorForm.addEventListener("change", saveCalculatorState);
calculatorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = getCalculatorFormData();

  if (!validateCalculatorForm(formData)) {
    return;
  }

  renderCalculatorRecommendation(calculateProjectRecommendation(formData));
  saveCalculatorState();
  revealCalculatorResults();
});

calculatorClearButton?.addEventListener("click", clearCalculatorForm);

window.addEventListener("hashchange", syncViewFromHash);
window.addEventListener("resize", () => {
  if (window.innerWidth > 640) {
    closeMobileNav();
  }
});

navToggleButton?.addEventListener("click", () => {
  const isOpen = navToggleButton.getAttribute("aria-expanded") === "true";
  setMobileNavState(!isOpen);
});

syncViewFromHash();
loadServiceCatalog();
