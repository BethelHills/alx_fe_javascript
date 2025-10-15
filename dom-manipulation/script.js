(() => {
  /**
   * In-memory store of quotes. Each quote has text and category fields.
   */
  const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "inspiration" },
    { text: "Simplicity is the soul of efficiency.", category: "productivity" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "First, solve the problem. Then, write the code.", category: "programming" }
  ];

  let activeCategory = "all";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function getCategories() {
    const unique = new Set(["all", ...quotes.map(q => q.category.toLowerCase())]);
    return Array.from(unique);
  }

  function pickRandom(array) {
    if (array.length === 0) return null;
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  function createCategoryPill(category) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pill";
    button.textContent = category;
    button.setAttribute("data-category", category);
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      activeCategory = category;
      updateCategoryPills();
      showRandomQuote();
    });
    return button;
  }

  function updateCategoryPills() {
    const container = $("#categoryControls");
    container.innerHTML = "";
    for (const category of getCategories()) {
      container.appendChild(createCategoryPill(category));
    }
    $$(".pill", container).forEach(btn => {
      const isActive = btn.getAttribute("data-category") === activeCategory;
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function showRandomQuote() {
    const display = $("#quoteDisplay");
    const pool = activeCategory === "all"
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === activeCategory.toLowerCase());

    const picked = pickRandom(pool);
    display.textContent = picked ? picked.text + " — " + capitalize(picked.category) : "No quotes available.";
  }

  function capitalize(value) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function createAddQuoteForm() {
    const form = $("#addQuoteForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const textInput = $("#newQuoteText");
      const categoryInput = $("#newQuoteCategory");

      const text = textInput.value.trim();
      const category = categoryInput.value.trim();

      if (text.length === 0 || category.length === 0) {
        alert("Please provide both quote text and a category.");
        return;
      }

      addQuote({ text, category });
      textInput.value = "";
      categoryInput.value = "";
      updateCategoryPills();
      showRandomQuote();
    });
  }

  function addQuote(newQuote) {
    quotes.push({ text: newQuote.text, category: newQuote.category });
  }

  function init() {
    updateCategoryPills();
    showRandomQuote();

    const newQuoteButton = $("#newQuote");
    newQuoteButton.addEventListener("click", showRandomQuote);

    createAddQuoteForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
