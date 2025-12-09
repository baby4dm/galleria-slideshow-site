async function loadData() {
  const res = await fetch("/data/data.json");
  const items = await res.json();
  renderGallery(items);
}

function getColumnsCount() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1440) return 2;
  return 4;
}

function renderGallery(items) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const cols = getColumnsCount();

  const columns = [];
  for (let i = 0; i < cols; i++) {
    const col = document.createElement("div");
    col.className = "flex flex-col gap-10 w-full";
    columns.push(col);
    gallery.appendChild(col);
  }

  if (cols === 1) {
    items.forEach((item) => {
      appendToColumn(columns[0], item);
    });
    return;
  }

  if (cols === 2) {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const a = items[i];
      const b = i + 1 < items.length ? items[i + 1] : undefined;
      rows.push([a, b]);
    }

    rows.forEach((row, rIdx) => {
      const [left, right] = row;
      if (rIdx === 5 || rIdx === 6) {
        if (right !== undefined) {
          if (right) appendToColumn(columns[0], right);
          if (left) appendToColumn(columns[1], left);
          return;
        }
      }

      if (left) appendToColumn(columns[0], left);
      if (right) appendToColumn(columns[1], right);
      if (
        right === undefined &&
        left &&
        row.length === 2 &&
        row[1] === undefined
      ) {
        const last = columns[0].lastElementChild;
        if (
          last &&
          last.querySelector &&
          last.querySelector("img") &&
          last.querySelector("img").src.endsWith(getFilename(left))
        ) {
          columns[0].removeChild(last);
          appendToColumn(columns[1], left);
        }
      }
    });

    return;
  }

  if (cols === 4) {
    const rowsCount = Math.ceil(items.length / 4);

    for (let r = 0; r < rowsCount; r++) {
      let idx0 = r * 4 + 0;
      let idx1 = r * 4 + 1;
      let idx2 = r * 4 + 2;
      let idx3 = r * 4 + 3;

      if (r === 2) {
        idx0 = 8;
        idx1 = 9;
        idx2 = 13;
        idx3 = 10;
      }

      if (r === 3) {
        idx0 = 11;
        idx1 = 12;
        idx2 = undefined;
        idx3 = 14;
      }

      const idxs = [idx0, idx1, idx2, idx3];

      idxs.forEach((idx, colIndex) => {
        if (idx === undefined) return;
        if (idx >= 0 && idx < items.length) {
          appendToColumn(columns[colIndex], items[idx]);
        }
      });
    }

    return;
  }
}

function appendToColumn(columnEl, item) {
  if (!item) return;

  const wrapper = document.createElement("div");
  wrapper.className = "gallery-item";

  const img = document.createElement("img");
  img.src =
    item.images?.thumbnail ||
    item.images?.small ||
    item.images?.[0] ||
    item.src ||
    "";
  img.alt = item.title || "";
  img.className = "gallery-img";
  wrapper.appendChild(img);

  const overlay = document.createElement("div");
  overlay.className = "gallery-overlay";
  overlay.innerHTML = `
    <h2>${item.name || item.title || "Undefined"}</h2>
    <p>${item.artist?.name || item.author || "Undefined"}</p>
  `;
  wrapper.appendChild(overlay);

  columnEl.appendChild(wrapper);
}

function getFilename(item) {
  if (!item) return "";
  const src =
    (item.images &&
      (item.images.thumbnail || item.images.small || item.images[0])) ||
    item.src ||
    "";
  return src.split("/").pop();
}

window.addEventListener("resize", () => {
  clearTimeout(window.__renderGalleryTimer);
  window.__renderGalleryTimer = setTimeout(() => {
    loadData();
  }, 120);
});

loadData();
