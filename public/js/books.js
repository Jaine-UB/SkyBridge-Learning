document.addEventListener("DOMContentLoaded", () => {
  // Dark mode toggle
  const button = document.getElementById("theme-toggle");
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    button.textContent = document.body.classList.contains("dark-mode")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });
});

let currentBooks = []; // Cache last results

// Search books
async function searchBooks() {
  const query = document.getElementById("searchInput").value;
  const language = document.getElementById("language").value;
  const printType = document.getElementById("printType").value;
  const API_KEY = "AIzaSyCvR3G4fz1GKVzIbA336371HUWOqQTzzoo"; 

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`;
  if (language) url += `&langRestrict=${language}`;
  if (printType) url += `&printType=${printType}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    currentBooks = data.items || []; // Save globally
    displayBooks(currentBooks);
  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML = `<p>${err.message}</p>`;
  }
}

// Display books
function displayBooks(books) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (!books || books.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  const maturityFilter = document.getElementById("maturityFilter").value;

  const filteredBooks = books.filter(book => {
    const rating = book.volumeInfo.maturityRating || "NOT_MATURE";
    return maturityFilter ? rating === maturityFilter : true;
  });

  if (filteredBooks.length === 0) {
    container.innerHTML = "<p>No books match your filters.</p>";
    return;
  }

  filteredBooks.forEach(book => {
    const info = book.volumeInfo;
    const link = info.infoLink || "#";

    const card = document.createElement("a");
    card.href = link;
    card.target = "_blank";
    card.classList.add("book");
    card.innerHTML = `
      <img src="${info.imageLinks?.thumbnail || ''}" alt="Book cover"/>
      <h3>${info.title || "No title"}</h3>
      <p><strong>Author:</strong> ${info.authors?.join(", ") || "Unknown"}</p>
      <p><strong>Language:</strong> ${info.language || "N/A"}</p>
      <p><strong>Published:</strong> ${info.publishedDate || "N/A"}</p>
      <p><strong>Maturity:</strong> ${info.maturityRating === "MATURE" ? "Adults" : "Kids"}</p>
    `;
    container.appendChild(card);
  });
}