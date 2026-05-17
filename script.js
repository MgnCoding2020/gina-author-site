// Set the footer year automatically so we never have to update it.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// On the privacy page, fill in today's date as a sensible default for "Last updated".
// You can hardcode a real date when the policy is finalized.
const lastUpdatedEl = document.getElementById("lastUpdated");
if (lastUpdatedEl) {
  const now = new Date();
  lastUpdatedEl.textContent = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ----------------------------------------------------------------
// PDF preview modal
// Click an image or "Preview" button with [data-pdf] to open the
// PDF in an in-page lightbox. Close with the × button, the backdrop,
// or the Escape key.
// ----------------------------------------------------------------
(function setupPdfPreview() {
  const modal = document.getElementById("pdfModal");
  if (!modal) return;

  const iframe = modal.querySelector(".pdf-modal-iframe");
  const titleEl = modal.querySelector(".pdf-modal-title");
  const downloadLink = modal.querySelector(".pdf-modal-download");
  const newtabLink = modal.querySelector(".pdf-modal-newtab");

  let lastFocused = null;

  function openModal(pdf, name) {
    if (!pdf) return;
    lastFocused = document.activeElement;
    iframe.src = pdf;
    titleEl.textContent = name || "Preview";
    downloadLink.href = pdf;
    newtabLink.href = pdf;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // Move focus into the modal for keyboard users
    const closeBtn = modal.querySelector(".pdf-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    iframe.src = "";
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Triggers
  document.querySelectorAll(".card-preview-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const pdf = trigger.dataset.pdf;
      const name = trigger.dataset.title || "Preview";
      openModal(pdf, name);
    });
  });

  // Close handlers
  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();
