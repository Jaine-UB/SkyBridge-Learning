let currentBooks = []; // Cache last results

// Search books
async function searchBooks() {
  const query = document.getElementById("searchInput").value;
  const language = document.getElementById("language").value;
  const printType = document.getElementById("printType").value;
  const maturityFilter = document.getElementById("maturityFilter").value;
  const API_KEY = "YOUR_API_KEY_HERE"; 

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`;
  if (language) url += `&langRestrict=${language}`;
  if (printType) url += `&printType=${printType}`;
  if (maturityFilter) url += `&maturityRating=${maturityFilter}`;

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

    const image = info.imageLinks?.thumbnail
      ? info.imageLinks.thumbnail
      : "https://via.placeholder.com/128x180?text=No+Image";

    const link = info.infoLink || "#";

    const card = document.createElement("a");
      card.href = link;
      card.target = "_blank";
      card.classList.add("book");

    card.innerHTML = `
      <img src="${image}" alt="Book cover"/>
      <h3>${info.title || "No title"}</h3>
      <p><strong>Author:</strong> ${info.authors?.join(", ") || "Unknown"}</p>
      <p><strong>Language:</strong> ${info.language || "N/A"}</p>
      <p><strong>Published:</strong> ${info.publishedDate || "N/A"}</p>
      <p><strong>Maturity:</strong> ${info.maturityRating === "MATURE" ? "Adults" : "Kids"}</p>
    `;

    container.appendChild(card);
  });
}