"use strict";

// Local project data served from the same site.
const servicesDataURL = "./data/services.json";


const servicesGrid = document.querySelector("#services-grid");
const serviceSearchInput = document.querySelector("#service-search");
const serviceFilterSelect = document.querySelector("#service-filter");
const serviceSortSelect = document.querySelector("#service-sort");
let serviceCatalog = [];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
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
                  <div>
                    <dt>Category</dt>
                    <dd>${service.category}</dd>
                  </div>
                </dl>

                <p class="service-description">${service.description}</p>

                <ul class="service-deliverables" aria-label="${service.title} deliverables">
                  ${service.deliverables
                    .map((deliverable) => `<li>${deliverable}</li>`)
                    .join("")}
                </ul>
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

function setupServiceDetailAnimations() {
  const serviceDetailsElements = document.querySelectorAll(".service-details");

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
      contentElement.dataset.animating = "true";

      if (isOpening) {
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
      } else {
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
      }

      const handleTransitionEnd = (transitionEvent) => {
        if (transitionEvent.propertyName !== "height") {
          return;
        }

        contentElement.removeEventListener("transitionend", handleTransitionEnd);
        contentElement.dataset.animating = "false";

        if (isOpening) {
          contentElement.style.height = "auto";
        } else {
          detailsElement.open = false;
          contentElement.style.height = "0px";
        }
      };

      contentElement.addEventListener("transitionend", handleTransitionEnd);
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
    updateServiceGallery();
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

serviceSearchInput.addEventListener("input", updateServiceGallery);
serviceFilterSelect.addEventListener("change", updateServiceGallery);
serviceSortSelect.addEventListener("change", updateServiceGallery);

loadServiceCatalog();
