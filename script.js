// Set the footer year automatically so we never have to update it.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  function getFocusable() {
    return Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

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
    document.addEventListener("keydown", trapFocus);
    // Move focus into the modal for keyboard users
    const closeBtn = modal.querySelector(".pdf-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    iframe.src = "";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", trapFocus);
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
