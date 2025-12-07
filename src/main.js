async function loadData() {
  const res = await fetch("/data/data.json");
  const data = await res.json();
  renderGallery(data);
}

function renderGallery(items) {
  const gallery = document.getElementById("gallery");

  items.forEach((item) => {
    gallery.innerHTML += `
      <div class="relative group cursor-pointer">
        <img 
          src="${item.images.thumbnail}" 
          alt="${item.name}"
          class="w-full h-auto block"
        />
        <div class="absolute bottom-4 left-4 text-white">
          <h2 class="text-lg font-bold">${item.name}</h2>
          <p class="text-sm opacity-70">${item.artist.name}</p>
        </div>
      </div>
    `;
  });
}

loadData();
