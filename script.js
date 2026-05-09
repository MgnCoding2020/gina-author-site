// Set the footer year automatically so we never have to update it.
document.getElementById("year").textContent = new Date().getFullYear();

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