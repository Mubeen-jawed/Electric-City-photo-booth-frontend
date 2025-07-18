document.addEventListener("DOMContentLoaded", function () {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // Select all containers with class .video-wrapper
  const videoWrappers = document.querySelectorAll(".video-wrapper");

  videoWrappers.forEach((wrapper) => {
    const video = wrapper.querySelector(".video-tag");
    const playButton = wrapper.querySelector(".play-btn");

    if (video) {
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");

      video.muted = true;
    }

    if (isAuthenticated && playButton) {
      playButton.remove();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("isAuthenticated") === "true") {
    const editableMedia = document.querySelectorAll(".editable-img");
    editableMedia.forEach((element) => {
      const isVideo = element.tagName.toLowerCase() === "video";
      const dataName = element.getAttribute("data-name");
      if (!dataName) return;

      // Create main wrapper with light pink theme
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: relative;
        display: inline-block;
        width: 100%;
        background: #fdf2f8;
        border: 2px dashed #f8bbd9;
        border-radius: 16px;
        padding: 20px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(248, 187, 217, 0.2);
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      // Add hover effects
      wrapper.addEventListener("mouseenter", () => {
        wrapper.style.background = "#fce7f3";
        wrapper.style.borderColor = "#ec4899";
        wrapper.style.transform = "translateY(-2px)";
        wrapper.style.boxShadow = "0 8px 20px rgba(248, 187, 217, 0.3)";
      });

      wrapper.addEventListener("mouseleave", () => {
        wrapper.style.background = "#fdf2f8";
        wrapper.style.borderColor = "#f8bbd9";
        wrapper.style.transform = "translateY(0)";
        wrapper.style.boxShadow = "0 4px 12px rgba(248, 187, 217, 0.2)";
      });

      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);

      // Create upload instructions container
      const instructionsContainer = document.createElement("div");
      instructionsContainer.style.cssText = `
        text-align: center;
        margin-bottom: 16px;
        color: #831843;
      `;

      // Create main upload text
      const uploadText = document.createElement("div");
      uploadText.style.cssText = `
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #be185d;
      `;
      uploadText.textContent = isVideo
        ? "Drop your video here or click to browse"
        : "Drop your image here or click to browse";

      // Create file format and size info
      const fileInfo = document.createElement("div");
      fileInfo.style.cssText = `
        font-size: 12px;
        color: #a21caf;
        line-height: 1.4;
        margin-bottom: 4px;
      `;

      if (isVideo) {
        fileInfo.innerHTML = `
          <div style="margin-bottom: 4px;">
            <strong>Supported formats:</strong> MP4, WebM, AVI
          </div>
          <div>
            <strong>Recommended:</strong> MP4 format, max 50MB, 1920x1080 resolution
          </div>
        `;
      } else {
        fileInfo.innerHTML = `
          <div style="margin-bottom: 4px;">
            <strong>Supported formats:</strong> JPG, PNG, GIF, WebP
          </div>
          <div>
            <strong>Recommended:</strong> JPG/PNG format, max 1MB, min 800x600 resolution
          </div>
        `;
      }

      // Create upload icon
      const uploadIcon = document.createElement("div");
      uploadIcon.style.cssText = `
        font-size: 32px;
        color: #ec4899;
        margin-bottom: 12px;
        opacity: 0.8;
        transition: all 0.3s ease;
      `;
      uploadIcon.innerHTML = `<i class="fas fa-cloud-upload-alt"></i>`;

      // Assemble instructions
      instructionsContainer.appendChild(uploadIcon);
      instructionsContainer.appendChild(uploadText);
      instructionsContainer.appendChild(fileInfo);
      wrapper.appendChild(instructionsContainer);

      // Style the media element
      element.style.cssText = `
        width: 100%;
        height: auto;
        display: block;
        border-radius: 12px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-top: 8px;
      `;

      // Create enhanced loader
      const loader = document.createElement("div");
      loader.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(253, 242, 248, 0.95);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #be185d;
        font-weight: 600;
        font-size: 14px;
        z-index: 20;
        border-radius: 16px;
        border: 2px dashed #f8bbd9;
      `;

      loader.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #f8bbd9;
          border-top: 3px solid #ec4899;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        "></div>
        <div style="margin-bottom: 8px;">Uploading your ${
          isVideo ? "video" : "image"
        }...</div>
        <div style="
          width: 200px;
          height: 6px;
          background: #f8bbd9;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        ">
          <div style="
            height: 100%;
            background: linear-gradient(90deg, #ec4899, #be185d);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 3px;
            animation: progress 2s ease-in-out infinite;
          "></div>
        </div>
        <div style="font-size: 12px; color: #a21caf;">
          Please wait while we process your file...
        </div>
      `;

      wrapper.appendChild(loader);

      // Create enhanced edit button
      const editBtn = document.createElement("button");
      editBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #ec4899, #be185d);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        z-index: 10;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        opacity: 0;
        transform: scale(0.8);
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      editBtn.setAttribute("data-name", dataName);
      editBtn.innerHTML = `<i class="fas fa-edit"></i>`;

      // Button hover effects
      editBtn.addEventListener("mouseenter", () => {
        editBtn.style.background = "linear-gradient(135deg, #be185d, #ec4899)";
        editBtn.style.transform = "scale(1.1)";
        editBtn.style.boxShadow = "0 6px 16px rgba(236, 72, 153, 0.6)";
      });

      editBtn.addEventListener("mouseleave", () => {
        editBtn.style.background = "linear-gradient(135deg, #ec4899, #be185d)";
        editBtn.style.transform = "scale(1)";
        editBtn.style.boxShadow = "0 4px 12px rgba(236, 72, 153, 0.4)";
      });

      // Show/hide edit button on wrapper hover
      wrapper.addEventListener("mouseenter", () => {
        editBtn.style.opacity = "1";
        editBtn.style.transform = "scale(1)";
        uploadIcon.style.transform = "scale(1.1)";
        uploadIcon.style.opacity = "1";
      });

      wrapper.addEventListener("mouseleave", () => {
        editBtn.style.opacity = "0";
        editBtn.style.transform = "scale(0.8)";
        uploadIcon.style.transform = "scale(1)";
        uploadIcon.style.opacity = "0.8";
      });

      wrapper.appendChild(editBtn);

      // Create success overlay
      const successOverlay = document.createElement("div");
      successOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(34, 197, 94, 0.9);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 25;
        border-radius: 16px;
        color: white;
        font-weight: 600;
        text-align: center;
      `;
      successOverlay.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 12px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <div style="font-size: 16px;">
          ${isVideo ? "Video" : "Image"} uploaded successfully!
        </div>
      `;
      wrapper.appendChild(successOverlay);

      // Create drag and drop overlay
      const dropOverlay = document.createElement("div");
      dropOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(236, 72, 153, 0.9);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 15;
        border-radius: 16px;
        color: white;
        font-weight: 600;
        text-align: center;
        border: 3px dashed white;
      `;
      dropOverlay.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <div style="font-size: 18px; margin-bottom: 8px;">
          Drop your ${isVideo ? "video" : "image"} here
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          ${
            isVideo
              ? "MP4, WebM, AVI up to 50MB"
              : "JPG, PNG, GIF, WebP up to 10MB"
          }
        </div>
      `;
      wrapper.appendChild(dropOverlay);

      // Add drag and drop functionality
      wrapper.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropOverlay.style.display = "flex";
      });

      wrapper.addEventListener("dragleave", (e) => {
        if (!wrapper.contains(e.relatedTarget)) {
          dropOverlay.style.display = "none";
        }
      });

      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        dropOverlay.style.display = "none";
        const file = e.dataTransfer.files[0];
        if (file) {
          handleFileUpload(file);
        }
      });

      // Handle file upload function
      function handleFileUpload(file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("name", dataName);

        loader.style.display = "flex";

        fetch(
          "https://disciplinary-myrta-wajahat2020-3153049d.koyeb.app/api/images/upload",
          {
            method: "POST",
            body: formData,
          }
        )
          .then(async (res) => {
            const text = await res.text();
            try {
              return JSON.parse(text);
            } catch (err) {
              console.error("Invalid JSON response:", text);
              throw new Error("Invalid server response");
            }
          })
          .then((data) => {
            loader.style.display = "none";

            if (data.success) {
              successOverlay.style.display = "flex";
              successOverlay.style.animation = "successPulse 0.8s ease-in-out";

              setTimeout(() => {
                successOverlay.style.display = "none";
              }, 2000);

              const newSrc = `/uploads/${data.filename}?${Date.now()}`;
              if (isVideo) {
                const source = element.querySelector("source");
                if (source) {
                  source.src = newSrc;
                } else {
                  element.src = newSrc;
                }
                element.load();
              } else {
                element.src = newSrc;
              }
            } else {
              alert("Upload failed: " + data.message);
            }
          })
          .catch((err) => {
            loader.style.display = "none";
            console.error("Upload error:", err);
            console.log("Error uploading media. Please try again.");
          });
      }

      // Handle click to upload
      wrapper.addEventListener("click", (e) => {
        if (e.target === editBtn || editBtn.contains(e.target)) return;

        // If authenticated, prioritize upload functionality
        if (localStorage.getItem("isAuthenticated") === "true") {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = isVideo
            ? "video/mp4,video/webm,video/avi"
            : "image/jpeg,image/png,image/gif,image/webp";
          fileInput.click();

          fileInput.onchange = () => {
            const file = fileInput.files[0];
            if (file) {
              handleFileUpload(file);
            }
          };
          return; // Exit early, don't proceed to play functionality
        }

        // If not authenticated, allow normal play functionality
        if (e.target.tagName.toLowerCase() === "video") {
          const video = e.target;
          const btn = video.parentElement.querySelector(".play-btn");
          togglePlay(video.id, btn);
        }
      });

      // Handle edit button click
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = isVideo
          ? "video/mp4,video/webm,video/avi"
          : "image/jpeg,image/png,image/gif,image/webp";
        fileInput.click();

        fileInput.onchange = () => {
          const file = fileInput.files[0];
          if (file) {
            handleFileUpload(file);
          }
        };
      });
    });
  }
});

// Add required CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
  }
  
  @keyframes successPulse {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

function showPackage(type) {
  // Hide all package sections
  const tabs = document.querySelectorAll(".package-tab");
  tabs.forEach((tab) => (tab.style.display = "none"));
  document.getElementById(type).style.display = "block";

  // Remove active classes from all buttons
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("bg-pink-400", "text-white");
    btn.classList.add("bg-gray-200", "text-gray-800");
  });

  // Add active class to the correct button using data-type
  const activeBtn = document.querySelector(`.tab-btn[data-type="${type}"]`);
  if (activeBtn) {
    activeBtn.classList.add("bg-pink-400", "text-white");
    activeBtn.classList.remove("bg-gray-200", "text-gray-800");
  }
}

// Set default package
document.addEventListener("DOMContentLoaded", () => showPackage("birthday"));
// wedding form

function openWeddingForm(packageName) {
  document.getElementById("weddingFormModal").classList.remove("hidden");
  document.getElementById("selectedPackage").value = packageName;
}

function closeWeddingForm() {
  document.getElementById("weddingFormModal").classList.add("hidden");
}

function closeThankYou() {
  document.getElementById("thankYouPopup").classList.add("hidden");
}

document.getElementById("weddingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch("https://formsubmit.co/ajax/electriccityphotoboothsllc@gmail.com", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("weddingFormModal").classList.add("hidden");
      document.getElementById("thankYouPopup").classList.remove("hidden");
      document.getElementById("weddingForm").reset();
    })
    .catch((error) => {
      alert("⚠️ Submission failed. Please try again.");
    });
});

//birthday form

function openBirthdayForm(packageName) {
  document.getElementById("birthdayFormModal").classList.remove("hidden");
  document.getElementById("birthdaySelectedPackage").value = packageName;
}

function closeBirthdayForm() {
  document.getElementById("birthdayFormModal").classList.add("hidden");
}

function closeBirthdayThankYou() {
  document.getElementById("birthdayThankYouPopup").classList.add("hidden");
}

document
  .getElementById("birthdayForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch("https://formsubmit.co/ajax/electriccityphotoboothsllc@gmail.com", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("birthdayFormModal").classList.add("hidden");
        document
          .getElementById("birthdayThankYouPopup")
          .classList.remove("hidden");
        document.getElementById("birthdayForm").reset();
      })
      .catch((error) => {
        alert("⚠️ Submission failed. Please try again.");
      });
  });

//party form

function openPartyForm(packageName) {
  document.getElementById("partyFormModal").classList.remove("hidden");
  document.getElementById("partySelectedPackage").value = packageName;
}

function closePartyForm() {
  document.getElementById("partyFormModal").classList.add("hidden");
}

function closePartyThankYou() {
  document.getElementById("partyThankYouPopup").classList.add("hidden");
}

document.getElementById("partyForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch("https://formsubmit.co/ajax/electriccityphotoboothsllc@gmail.com", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("partyFormModal").classList.add("hidden");
      document.getElementById("partyThankYouPopup").classList.remove("hidden");
      document.getElementById("partyForm").reset();
    })
    .catch((error) => {
      alert("⚠️ Submission failed. Please try again.");
    });
});

//animated gallery

const gifSlider = document.getElementById("gifSlider");
let currentIndex = 0;

// Automatically scrolls every 4 seconds
// setInterval(() => {
//   const totalVideos = gifSlider.children.length;
//   currentIndex = (currentIndex + 1) % totalVideos;
//   gifSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
// }, 4000);

//client review\
//equipmet video play

function togglePlay(videoId, btn) {
  const video = document.getElementById(videoId);

  // Ensure video can play with sound on interaction
  video.muted = false;

  if (video.paused) {
    video
      .play()
      .then(() => {
        btn.innerHTML = "⏸";
      })
      .catch((error) => {
        console.error("Playback failed:", error);
      });
  } else {
    video.pause();
    btn.innerHTML = "▶";
  }
}
