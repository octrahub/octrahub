const projects = window.OCTRA_PROJECTS;
const categoryOrder = window.OCTRA_CATEGORIES;
const directory = document.querySelector("#directory");
const searchInput = document.querySelector("#searchInput");
const statusButtons = document.querySelectorAll("[data-status]");

const state = {
  query: "",
  status: "all",
};

function statusClass(status) {
  return status.replace(/\s+/g, "-");
}

function matches(project) {
  const query = state.query.trim().toLowerCase();
  const content = `${project.name} ${project.category} ${project.status} ${project.confidence} ${project.description}`.toLowerCase();
  const statusMatch = state.status === "all" || project.status === state.status;
  return statusMatch && (!query || content.includes(query));
}

function groupedProjects() {
  const filtered = projects.filter(matches);
  return categoryOrder
    .map((category) => ({
      category,
      items: filtered.filter((project) => project.category === category),
    }))
    .filter((group) => group.items.length);
}

function renderProject(project) {
  const links = [
    ["site", project.website],
    ["x", project.twitter],
    ["github", project.github],
    ["docs", project.docs],
    ["source", project.source],
  ].filter(([, href]) => href);

  return `
    <article class="project-card ${project.featured ? "featured" : ""}">
      <div>
        <h3>${project.name}</h3>
      </div>
      <p>${project.description}</p>
      <div class="project-meta">
        <span class="status ${statusClass(project.status)}">${project.status}</span>
        <span class="tag">${project.category}</span>
        <span class="confidence ${project.confidence}">${project.confidence}</span>
      </div>
      <div class="links">
        ${links.map(([label, href]) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
      </div>
    </article>
  `;
}

function render() {
  const groups = groupedProjects();

  if (!groups.length) {
    directory.innerHTML = `<div class="empty">no projects match the current filters.</div>`;
    return;
  }

  directory.innerHTML = groups
    .map(
      (group) => `
        <section class="category">
          <div class="category-header">
            <h2>${group.category}</h2>
            <span>${group.items.length} ${group.items.length === 1 ? "project" : "projects"}</span>
          </div>
          <div class="project-grid">
            ${group.items.map(renderProject).join("")}
          </div>
        </section>
      `
    )
    .join("");
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    statusButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.status = button.dataset.status;
    render();
  });
});

render();
