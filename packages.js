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
