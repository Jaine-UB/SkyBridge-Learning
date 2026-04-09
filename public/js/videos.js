async function searchVideos() {
  const query = document.getElementById("searchInput").value;
  const language = document.getElementById("language").value;
  const videoDuration = document.getElementById("videoDuration").value;
  const API_KEY = "AIzaSyCAvEI6WIKIAqM0T3JjpcCB1LH956Hwn5Y";

  function displayVideos(videos) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = "<p>No videos found.</p>";
    return;
  }

  videos.forEach(video => {
    const snippet = video.snippet;
    const videoId = video.id?.videoId;
    if (!videoId) return;

    const div = document.createElement("div");
    div.classList.add("video");

    div.innerHTML = `
      <h3>${snippet.title || "No title"}</h3>
      <p><strong>Channel:</strong> ${snippet.channelTitle}</p>
      <img src="${snippet.thumbnails.medium.url}" alt="Thumbnail"/>
      <iframe width="300" height="200"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0" allowfullscreen>
      </iframe>
    `;

    container.appendChild(div);
  });
}

  if (!query) {
    return alert("Please enter a search term.");
  }
  
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${API_KEY}`;
  console.log(url);

  if (language) url += `&relevanceLanguage=${language}`;
  if (videoDuration) url += `&videoDuration=${videoDuration}`;

  try {
    const res = await fetch(url);
    //if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)/-;
    console.log ("Status:", res.status);

    const data = await res.json();
    console.log("Data:", data);

    displayVideos(data.items || []);

  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML = `<p>Error fetching videos: ${err.message}</p>`;
  }
}