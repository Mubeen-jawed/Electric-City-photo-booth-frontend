// Initialize profile visibility based on authentication
function updateProfileVisibility() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const profileSection = document.getElementById("profile-section");
  const mobileProfileSection = document.getElementById(
    "mobile-profile-section"
  );

  if (isAuthenticated) {
    profileSection.style.display = "block";
    mobileProfileSection.style.display = "block";
  } else {
    profileSection.style.display = "none";
    mobileProfileSection.style.display = "none";
  }
}

// Call on page load
updateProfileVisibility();

// Profile dropdown functionality
const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");
const mobileProfileBtn = document.getElementById("mobile-profile-btn");
const mobileProfileDropdown = document.getElementById(
  "mobile-profile-dropdown"
);

// Toggle desktop dropdown
profileBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = profileDropdown.classList.contains("hidden");
  profileDropdown.classList.toggle("hidden", !isHidden);
  profileDropdown.classList.toggle("opacity-0", !isHidden);
  profileDropdown.classList.toggle("translate-y-2", !isHidden);
  mobileProfileDropdown.classList.add("hidden");
});

// Toggle mobile dropdown
mobileProfileBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = mobileProfileDropdown.classList.contains("hidden");
  mobileProfileDropdown.classList.toggle("hidden", !isHidden);
  mobileProfileDropdown.classList.toggle("opacity-0", !isHidden);
  mobileProfileDropdown.classList.toggle("translate-y-2", !isHidden);
  profileDropdown.classList.add("hidden");
});

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  profileDropdown?.classList.add("hidden");
  mobileProfileDropdown?.classList.add("hidden");
});

// Modal functionality
const logoModal = document.getElementById("logo-modal");
const modalContent = document.getElementById("modal-content");
const logoUploadWrapper = document.getElementById("logo-upload-wrapper");
const logoLoader = document.getElementById("logo-loader");
const logoSuccess = document.getElementById("logo-success");

// Open modal
function openLogoModal() {
  logoModal.classList.remove("hidden");
  logoModal.classList.add("flex");
  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  }, 10);
}

// Close modal
function closeLogoModal() {
  modalContent.classList.add("scale-95", "opacity-0");
  modalContent.classList.remove("scale-100", "opacity-100");
  setTimeout(() => {
    logoModal.classList.add("hidden");
    logoModal.classList.remove("flex");
  }, 300);
}

// Change logo button events
document.getElementById("change-logo-btn")?.addEventListener("click", () => {
  openLogoModal();
  profileDropdown.classList.add("hidden");
});

document
  .getElementById("mobile-change-logo-btn")
  ?.addEventListener("click", () => {
    openLogoModal();
    mobileProfileDropdown.classList.add("hidden");
  });

// Close modal events
document
  .getElementById("close-modal")
  ?.addEventListener("click", closeLogoModal);
logoModal?.addEventListener("click", (e) => {
  if (e.target === logoModal) closeLogoModal();
});

// Logo upload functionality
logoUploadWrapper?.addEventListener("click", (e) => {
  if (e.target.closest("#logo-loader") || e.target.closest("#logo-success"))
    return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/jpeg,image/png,image/gif,image/webp";
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) handleLogoUpload(file);
  };
});

// Handle logo upload
function handleLogoUpload(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", "home-logo");

  logoLoader.classList.remove("hidden");
  logoLoader.classList.add("flex");

  fetch(
    "https://disciplinary-myrta-wajahat2020-3153049d.koyeb.app/api/images/upload",
    {
      method: "POST",
      body: formData,
    }
  )
    .then(async (res) => {
      const text = await res.text();
      return JSON.parse(text);
    })
    .then((data) => {
      logoLoader.classList.add("hidden");
      logoLoader.classList.remove("flex");

      if (data.success) {
        logoSuccess.classList.remove("hidden");
        logoSuccess.classList.add("flex");

        setTimeout(() => {
          logoSuccess.classList.add("hidden");
          logoSuccess.classList.remove("flex");
          closeLogoModal();
        }, 2000);

        // Update logo
        const logoImg = document.getElementById("edit-photo-booth-llc");
        logoImg.src = `/uploads/${data.filename}?${Date.now()}`;
      } else {
        alert("Upload failed: " + data.message);
      }
    })
    .catch((err) => {
      logoLoader.classList.add("hidden");
      logoLoader.classList.remove("flex");
      console.error("Upload error:", err);
      alert("Error uploading logo. Please try again.");
    });
}

// Logout functionality
document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.setItem("isAuthenticated", "false");
  updateProfileVisibility();
  profileDropdown.classList.add("hidden");
  window.location.reload();
});

document.getElementById("mobile-logout-btn")?.addEventListener("click", () => {
  localStorage.setItem("isAuthenticated", "false");
  updateProfileVisibility();
  mobileProfileDropdown.classList.add("hidden");
  window.location.reload();
});
