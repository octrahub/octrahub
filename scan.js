const projects = window.OCTRA_PROJECTS;
const categories = window.OCTRA_CATEGORIES;
const state = { query: "", category: "all", status: "all" };

const directory = document.querySelector("#directory");
const searchInput = document.querySelector("#searchInput");
const totalCount = document.querySelector("#totalCount");

function className(value) {
  return value.replace(/\s+/g, "-");
}

function projectMatches(project) {
  const query = state.query.trim().toLowerCase();
  const text = `${project.name} ${project.category} ${project.status} ${project.confidence} ${project.description}`.toLowerCase();
  return (state.category === "all" || project.category === state.category) && (state.status === "all" || project.status === state.status) && (!query || text.includes(query));
}

function setCounts() {
  totalCount.textContent = projects.length;
  document.querySelectorAll("[data-category-count]").forEach((node) => {
    node.textContent = projects.filter((project) => project.category === node.dataset.categoryCount).length;
  });
  document.querySelectorAll("[data-status-count]").forEach((node) => {
    node.textContent = projects.filter((project) => project.status === node.dataset.statusCount).length;
  });
}

function projectLinks(project) {
  return [
    ["site", project.website],
    ["x", project.twitter],
    ["github", project.github],
    ["docs", project.docs],
    ["source", project.source],
  ].filter(([, href]) => href);
}

function renderTable(items) {
  return `
    <table>
      <thead>
        <tr>
          <th>project</th>
          <th>description</th>
          <th>status</th>
          <th>confidence</th>
          <th>links</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (project) => `
              <tr>
                <td data-label="project"><span class="project-name">${project.name}</span></td>
                <td data-label="description">${project.description}</td>
                <td data-label="status"><span class="status ${className(project.status)}">${project.status}</span></td>
                <td data-label="confidence">${project.confidence}</td>
                <td data-label="links">${projectLinks(project).map(([label, href]) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join(" · ")}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function render() {
  const filtered = projects.filter(projectMatches);
  if (!filtered.length) {
    directory.innerHTML = '<div class="empty">no matching projects.</div>';
    return;
  }

  directory.innerHTML = categories
    .map((category) => {
      const items = filtered.filter((project) => project.category === category);
      if (!items.length) return "";
      return `
        <section class="category">
          <div class="category-heading">
            <h2>${category}</h2>
            <span>${items.length} ${items.length === 1 ? "project" : "projects"}</span>
          </div>
          ${renderTable(items)}
        </section>
      `;
    })
    .join("");
}

document.querySelectorAll(".summary-cell").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".summary-cell").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.category = button.dataset.filter || "all";
    state.status = button.dataset.status || "all";
    render();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

setCounts();
render();
