// addNewImages.js — images + videos + hydrate + delete (robust video load)
(() => {
  const DEPLOYED_URL = "https://due-maryanna-electric-booth-1fc75707.koyeb.app";
  const isPrivateLAN = (h) =>
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    /^10\.\d+\.\d+\.\d+$/.test(h) ||
    /^192\.168\.\d+\.\d+$/.test(h) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h);

  const BACKEND = isPrivateLAN(location.hostname)
    ? `${location.protocol}//${location.hostname}:5000`
    : DEPLOYED_URL;

  if (window.addNewMediaScriptLoaded) return;
  window.addNewMediaScriptLoaded = true;

  const isAuthenticated =
    JSON.parse(localStorage.getItem("isAuthenticated") || "null")?.value ===
    true;

  const admin = document.getElementById("admin");
  const adminSM = document.getElementById("admin-sm");
  const adminVideo = document.getElementById("admin-video");

  if (isAuthenticated) {
    admin.classList.remove("hidden");
    adminSM.classList.remove("hidden");
    adminVideo.classList.remove("hidden");

    adminSM.classList.add("sm:hidden");
  }

  const cssEscape =
    window.CSS?.escape ||
    ((s) => String(s).replace(/[^\w-]/g, (ch) => `\\${ch}`));

  // DB sections
  const IMAGE_SECTION = "gallery";
  const VIDEO_SECTION = "gallery_videos_top";

  // ensure hidden inputs exist
  function ensureInputs() {
    let img = document.getElementById("new-image-input");
    if (!img) {
      img = document.createElement("input");
      img.type = "file";
      img.id = "new-image-input";
      img.accept = "image/*";
      img.hidden = true;
      document.body.appendChild(img);
    } else img.accept = "image/*";

    let vid = document.getElementById("new-video-input");
    if (!vid) {
      vid = document.createElement("input");
      vid.type = "file";
      vid.id = "new-video-input";
      vid.accept = "video/*";
      vid.hidden = true;
      document.body.appendChild(vid);
    } else vid.accept = "video/*";

    return { img, vid };
  }

  function init() {
    // buttons (unique IDs)
    const imgBtn = document.getElementById("upload-button"); // Add New Image
    const vidBtn = document.getElementById("upload-button-video"); // Add New Videos

    const { img: imgInput, vid: vidInput } = ensureInputs();

    // containers
    window.featuredVideos = document.getElementById("featured-videos-desktop"); // grid container
    window.gifSlider = document.getElementById("gifSlider"); // slider container

    const horizontalMobile = document.getElementById(
      "horizontal-images-mobile"
    );
    const horizontalDesktop = document.getElementById(
      "horizontal-images-desktop"
    );
    const verticalMobile = document.getElementById("vertical-images-mobile");
    const verticalDesktop = document.getElementById("vertical-images-desktop");

    if (imgBtn) imgBtn.type = "button";
    if (vidBtn) vidBtn.type = "button";

    document.addEventListener("submit", (e) => e.preventDefault(), true);

    // hydrate on load
    hydrateVideos();
    hydrateImages();

    // open pickers
    imgBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      imgInput.click();
    });
    vidBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      vidInput.click();
    });

    // upload IMAGE
    imgInput.addEventListener("change", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Pick an image file");
        imgInput.value = "";
        return;
      }
      await uploadAndInsert(
        file,
        IMAGE_SECTION,
        `gallery-img-${Date.now()}`,
        "image"
      );
      imgInput.value = "";
    });

    // upload VIDEO
    vidInput.addEventListener("change", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("video/")) {
        alert("Pick a video file");
        vidInput.value = "";
        return;
      }
      await uploadAndInsert(file, VIDEO_SECTION, `gif-${Date.now()}`, "video");
      vidInput.value = "";
    });

    // delete (images & videos)
    document.addEventListener("click", async (e) => {
      const bin = e.target.closest(
        '[data-action="delete-media"],[data-action="delete-image"]'
      );
      if (!bin) return;
      e.preventDefault();
      e.stopPropagation();

      const card = bin.closest(".gallery-card");
      const name = card?.dataset.name;
      if (!name) return;
      if (!confirm("Delete this item?")) return;

      // abort loads
      document
        .querySelectorAll(`.gallery-card[data-name="${cssEscape(name)}"] img`)
        .forEach((img) => {
          img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
        });
      document
        .querySelectorAll(`.gallery-card[data-name="${cssEscape(name)}"] video`)
        .forEach((v) => {
          try {
            v.pause();
            v.removeAttribute("src");
            v.load();
          } catch {}
        });

      try {
        const res = await fetch(
          `${BACKEND}/api/images/${encodeURIComponent(name)}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error(`Delete failed (${res.status})`);
        document
          .querySelectorAll(`.gallery-card[data-name="${cssEscape(name)}"]`)
          .forEach((el) => el.remove());
      } catch (err) {
        console.error("Delete error:", err);
        alert("Could not delete.");
      }
    });
    // ===== helpers =====
    async function uploadAndInsert(file, section, name, kind) {
      const fd = new FormData();
      fd.append("image", file); // backend field
      fd.append("name", name);
      fd.append("section", section);

      try {
        const res = await fetch(`${BACKEND}/api/images/addNewImages`, {
          method: "POST",
          body: fd,
        });
        const ct = res.headers.get("content-type") || "";
        const raw = await res.text();
        const data = ct.includes("application/json") ? JSON.parse(raw) : {};

        const url = data?.name
          ? `${BACKEND}/api/images/${data.name}?ts=${Date.now()}`
          : data?.url
          ? `${data.url}?ts=${Date.now()}`
          : null;

        if (res.ok && data?.success && url) {
          if (kind === "video") {
            prependVideoToGrid(url, data.name || null); // featured grid
            prependVideoToSlider(url, data.name || null); // slider
          } else {
            prependImage(url, data.name || null);
          }
        } else {
          console.warn("Upload failed:", {
            status: res.status,
            data: data || raw,
          });
          alert(data?.message || `Upload failed (status ${res.status})`);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Network error during upload.");
      }
    }

    function hydrateVideos() {
      fetch(`${BACKEND}/api/images/section/${VIDEO_SECTION}`)
        .then((r) => r.json())
        .then(({ success, images }) => {
          if (!success || !Array.isArray(images)) return;
          for (let i = images.length - 1; i >= 0; i--) {
            const doc = images[i];
            if (!doc?.name) continue;
            const url = `${BACKEND}/api/images/${doc.name}?ts=${Date.now()}`;

            if (
              typeof featuredVideos !== "undefined" &&
              featuredVideos &&
              !featuredVideos.querySelector(
                `[data-name="${cssEscape(doc.name)}"]`
              )
            ) {
              prependVideoToGrid(url, doc.name);
            }
            if (
              typeof gifSlider !== "undefined" &&
              gifSlider &&
              !gifSlider.querySelector(`[data-name="${cssEscape(doc.name)}"]`)
            ) {
              prependVideoToSlider(url, doc.name);
            }
          }
        })
        .catch((err) => console.error("hydrate videos error:", err));
    }

    function hydrateImages() {
      fetch(`${BACKEND}/api/images/section/${IMAGE_SECTION}`)
        .then((r) => r.json())
        .then(({ success, images }) => {
          if (!success || !Array.isArray(images)) return;
          const present = getPresentNames();
          for (let i = images.length - 1; i >= 0; i--) {
            const doc = images[i];
            if (!doc?.name || present.has(doc.name)) continue;
            const url = `${BACKEND}/api/images/${doc.name}?ts=${Date.now()}`;
            if (/\.(mp4|webm)(\?|$)/i.test(doc.filename || url)) continue; // only images here
            prependImage(url, doc.name);
          }
        })
        .catch((err) => console.error("hydrate images error:", err));
    }

    function getPresentNames() {
      const set = new Set();
      document
        .querySelectorAll("img[data-name],video[data-name]")
        .forEach((el) => {
          const n = el.getAttribute("data-name");
          if (n) set.add(n);
        });
      document.querySelectorAll('[src*="/api/images/"]').forEach((el) => {
        const m = el.src.match(/\/api\/images\/([^?]+)/);
        if (m && m[1]) set.add(decodeURIComponent(m[1]));
      });
      return set;
    }

    function buildDeleteBtn() {
      const del = document.createElement("button");

      if (isAuthenticated) {
        del.type = "button";
        del.dataset.action = "delete-media";
        del.className =
          "absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 pointer-events-auto";
        del.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path><path d="M14 11v6"></path>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>`;
        return del;
      }
    }

    // IMAGES
    function prependImage(url, name = null) {
      const img = new Image();
      if (name) img.dataset.name = name;
      img.className =
        "rounded-xl block w-full h-auto shadow-md group-hover:shadow-xl transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-90 ";

      img.onload = () => {
        const ar = img.naturalWidth / img.naturalHeight;
        const card = document.createElement("div");
        card.className =
          "gallery-card sm:mt-4 group relative inline-block w-64 sm:block sm:w-full rounded-xl shadow-lg overflow-hidden";
        if (name && isAuthenticated) {
          card.dataset.name = name;
          card.appendChild(buildDeleteBtn());
        }
        card.appendChild(img);

        if (ar >= 1) {
          horizontalMobile?.prepend(card.cloneNode(true));
          horizontalDesktop?.prepend(card);
        } else {
          verticalMobile?.prepend(card.cloneNode(true));
          verticalDesktop?.prepend(card);
        }
      };
      img.onerror = () => console.error("IMG load failed:", url);
      img.src = url;
    }

    // VIDEOS (featured grid) - SIMPLIFIED FIX
    // VIDEOS (featured grid) - SAFE PAINT
    function prependVideoToGrid(url, name = null) {
      if (!featuredVideos) return;

      const video = document.createElement("video");
      if (name) video.dataset.name = name;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto"; // paint sooner
      video.crossOrigin = "anonymous";

      // Put all the rounding/clipping ON the video, not the parent
      video.className = "w-full";
      Object.assign(video.style, {
        display: "block",
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: "16px",
        transform: "translateZ(0)", // own layer
        backfaceVisibility: "hidden",
        willChange: "transform",
        isolation: "isolate",
        zIndex: 1,
        position: "relative",
      });
      video.src = url;

      const card = document.createElement("div");
      // NOTE: no overflow-hidden; keep ancestors harmless
      card.className =
        "gallery-card relative shadow-lg border-2 border-pink-200";
      card.style.overflow = "visible";
      card.style.borderRadius = "16px"; // rounding handled by video

      if (name && isAuthenticated) {
        card.dataset.name = name;
        card.appendChild(buildDeleteBtn());
      }

      video.addEventListener("loadeddata", () => {
        // tiny seek nudge helps Chrome paint
        try {
          if (video.currentTime < 0.03) video.currentTime = 0.03;
        } catch {}
        video.play().catch(() => {});
      });
      video.addEventListener("error", (e) => {
        console.error("VIDEO load failed:", url, e);
      });

      card.appendChild(video);
      featuredVideos.prepend(card);
    }

    // VIDEOS (slider) - SAFE PAINT
    function prependVideoToSlider(url, name = null) {
      if (!gifSlider) return;

      const video = document.createElement("video");
      if (name) video.dataset.name = name;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.controls = false;
      video.crossOrigin = "anonymous";

      video.className = "w-full h-auto shrink-0 ";
      Object.assign(video.style, {
        display: "block",
        width: "100%",
        height: "auto",
        objectFit: "cover",
        background: "#000",
        borderRadius: "16px",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        willChange: "transform",
        isolation: "isolate",
        zIndex: 1,
        position: "relative",
      });
      video.src = url;

      const card = document.createElement("div");
      // NOTE: remove overflow-hidden here
      card.className = "gallery-card relative w-full shrink-0";
      card.style.overflow = "visible";
      card.style.borderRadius = "0";

      if (name && isAuthenticated) {
        card.dataset.name = name;
        card.appendChild(buildDeleteBtn());
      }

      video.addEventListener("loadeddata", () => {
        try {
          if (video.currentTime < 0.03) video.currentTime = 0.03;
        } catch {}
        video.play().catch(() => {});
      });

      card.appendChild(video);
      gifSlider.prepend(card);

      try {
        gifSlider.style.transform = "translateX(0)";
      } catch {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
