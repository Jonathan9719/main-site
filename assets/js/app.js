/**
 * Renders the site from data/resume.json.
 * No framework, no build step — just fetch + DOM.
 * Edit data/resume.json to update all content.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
};
// Escape user data before injecting as HTML.
const esc = (str) =>
  String(str ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

/** Resolve a dotted path like "basics.name" against an object. */
const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

function renderProfiles(profiles = []) {
  const wrap = $("#profiles");
  wrap.innerHTML = "";
  profiles.forEach((p) => {
    const a = el("a", "btn");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = p.network;
    wrap.appendChild(a);
  });
}

function renderHighlights(items = []) {
  const wrap = $("#highlights");
  wrap.innerHTML = "";
  items.forEach((h) => {
    const li = el("li");
    li.appendChild(el("span", "value", esc(h.value)));
    li.appendChild(el("span", "label", esc(h.label)));
    wrap.appendChild(li);
  });
}

function renderTimeline(targetId, entries = [], opts = {}) {
  const wrap = document.getElementById(targetId);
  wrap.innerHTML = "";
  entries.forEach((e) => {
    const entry = el("div", "entry");
    entry.appendChild(el("div", "entry__period", `${esc(e.start)} — ${esc(e.end)}`));

    const body = el("div", "entry__body");
    body.appendChild(el("div", "entry__title", esc(opts.title(e))));
    body.appendChild(el("div", "entry__org", esc(opts.org(e))));
    if (e.summary) body.appendChild(el("p", "entry__summary", esc(e.summary)));
    if (Array.isArray(e.achievements) && e.achievements.length) {
      const ul = el("ul", "entry__list");
      e.achievements.forEach((a) => ul.appendChild(el("li", null, esc(a))));
      body.appendChild(ul);
    }
    entry.appendChild(body);
    wrap.appendChild(entry);
  });
}

function renderProjects(projects = []) {
  const wrap = $("#projects-list");
  wrap.innerHTML = "";
  projects.forEach((p) => {
    const card = el("div", "card" + (p.highlight ? " card--highlight" : ""));
    const title = el("div", "card__title", esc(p.name));
    if (p.url) {
      const a = el("a");
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = p.name;
      title.innerHTML = "";
      title.appendChild(a);
    }
    card.appendChild(title);
    card.appendChild(el("p", "card__desc", esc(p.description)));
    if (Array.isArray(p.tags) && p.tags.length) {
      const tags = el("div", "tags");
      p.tags.forEach((t) => tags.appendChild(el("span", "tag", esc(t))));
      card.appendChild(tags);
    }
    wrap.appendChild(card);
  });
}

function renderAchievements(items = []) {
  const wrap = $("#achievements-list");
  wrap.innerHTML = "";
  items.forEach((a) => {
    const card = el("div", "card");
    card.appendChild(el("div", "card__title", esc(a.title)));
    card.appendChild(el("div", "card__meta", `${esc(a.issuer)} · ${esc(a.date)}`));
    if (a.description) card.appendChild(el("p", "card__desc", esc(a.description)));
    wrap.appendChild(card);
  });
}

function renderSkills(groups = []) {
  const wrap = $("#skills-list");
  wrap.innerHTML = "";
  groups.forEach((g) => {
    const group = el("div", "skill-group");
    group.appendChild(el("div", "skill-group__cat", esc(g.category)));
    const tags = el("div", "tags");
    (g.items || []).forEach((i) => tags.appendChild(el("span", "tag", esc(i))));
    group.appendChild(tags);
    wrap.appendChild(group);
  });
}

/** Fill any element with data-bind="path" from the data object. */
function bindText(data) {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    const val = get(data, node.getAttribute("data-bind"));
    if (val != null) node.textContent = val;
  });
  document.title = `${get(data, "basics.name") || "Portfolio"} — Portfolio & Resume`;
}

function setupTheme() {
  const btn = $(".theme-toggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initial);
  btn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

async function main() {
  setupTheme();
  $("#year").textContent = new Date().getFullYear();

  let data;
  try {
    const res = await fetch("data/resume.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    $("#main").innerHTML =
      `<div class="state">Could not load resume data.<br>` +
      `If you opened this file directly, serve it over HTTP instead ` +
      `(see README). <br><small>${esc(err.message)}</small></div>`;
    return;
  }

  bindText(data);
  renderProfiles(data.basics?.profiles);
  renderHighlights(data.highlights);
  renderTimeline("experience-list", data.experience, {
    title: (e) => e.position,
    org: (e) => e.company,
  });
  renderProjects(data.projects);
  renderAchievements(data.achievements);
  renderSkills(data.skills);
  renderTimeline("education-list", data.education, {
    title: (e) => e.study,
    org: (e) => e.institution,
  });
}

document.addEventListener("DOMContentLoaded", main);
