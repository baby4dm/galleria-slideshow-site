function getStartIndex() {
  const params = new URLSearchParams(window.location.search);
  const i = parseInt(params.get("index"), 10);
  return isNaN(i) ? 0 : i;
}

let paintings = [];
let index = getStartIndex();

const heroImg = document.getElementById("hero-img");
const nameEl = document.getElementById("name");
const artistEl = document.getElementById("artist");
const yearEl = document.getElementById("year");
const descEl = document.getElementById("description");
const sourceEl = document.getElementById("source");
const artistImg = document.getElementById("artist-img");

const nameFooter = document.getElementById("name-footer");
const artistFooter = document.getElementById("artist-footer");

const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

const progressEl = document.getElementById("progress");

const slideBtn = document.getElementById("slideshow-btn");
const viewBtn = document.querySelector("button.bg-black");
const galleryContainer = document.getElementById("gallery-img-container");
const galleryImg = document.getElementById("gallery-img");
const closeBtn = document.getElementById("close-gallery");

viewBtn.addEventListener("click", (e) => {
  e.preventDefault();
  galleryImg.src = document.getElementById("hero-img").src;
  galleryContainer.classList.remove("hidden");

  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  galleryContainer.classList.add("hidden");

  document.body.style.overflow = "";
});

galleryContainer.addEventListener("click", (e) => {
  if (e.target === galleryContainer) {
    galleryContainer.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

async function loadPaintings() {
  const res = await fetch("/src/data/data.json");
  paintings = await res.json();
  renderSlide();
}

function getHero(p) {
  const isDesktop = window.innerWidth > 767;
  return isDesktop ? p.images.hero.large : p.images.hero.small;
}

function renderSlide() {
  const p = paintings[index];

  heroImg.src = getHero(p);

  nameEl.textContent = p.name;
  artistEl.textContent = p.artist.name;
  yearEl.textContent = p.year;
  descEl.textContent = p.description;

  if (sourceEl) sourceEl.href = p.source;

  if (artistImg) {
    artistImg.src = p.artist.image;
    artistImg.alt = p.artist.name;
  }

  nameFooter.textContent = p.name;
  artistFooter.textContent = p.artist.name;

  const percent = ((index + 1) / paintings.length) * 100;
  progressEl.style.width = percent + "%";

  positionArtistImage();
}

function next() {
  index = (index + 1) % paintings.length;
  renderSlide();
}

function prev() {
  index = (index - 1 + paintings.length) % paintings.length;
  renderSlide();
}

nextBtn.addEventListener("click", next);
backBtn.addEventListener("click", prev);

window.addEventListener("resize", renderSlide);

if (slideBtn) {
  slideBtn.textContent = "STOP SLIDESHOW";
  slideBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
  });
}

function positionArtistImage() {
  const artistImg = document.getElementById("artist-img");
  const infoBlock = document.getElementById("info-block");

  if (!artistImg || !infoBlock) return;

  const base = 170;
  const defaultHeight = 300;

  const actual = infoBlock.offsetHeight;

  console.log("InfoBlock height:", actual);

  const extra = Math.max(actual - base, 0);

  const bottom = -(base + defaultHeight - extra);

  artistImg.style.bottom = `${bottom}px`;

  console.log("Applied bottom:", bottom);
}

window.addEventListener("load", positionArtistImage);
window.addEventListener("resize", positionArtistImage);

loadPaintings();
