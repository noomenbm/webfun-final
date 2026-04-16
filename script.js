"use strict";

const servicesDataURL =
  "https://noomenbm.github.io/webfun-final/data/services.json";

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
          <div class="service-card-top">
            <p class="service-category">${service.category}</p>
            <p class="service-price">${formatCurrency(service.startingPrice)}+</p>
          </div>

          <h3>${service.title}</h3>
          <p class="service-description">${service.description}</p>

          <dl class="service-meta">
            <div>
              <dt>Difficulty</dt>
              <dd>${service.difficulty}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>${service.typicalTimeline}</dd>
            </div>
            <div>
              <dt>Recommended For</dt>
              <dd>${service.recommendedFor}</dd>
            </div>
          </dl>

          <ul class="service-deliverables" aria-label="${service.title} deliverables">
            ${service.deliverables
              .map((deliverable) => `<li>${deliverable}</li>`)
              .join("")}
          </ul>
        </article>
      `
    )
    .join("");
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
