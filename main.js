window.addEventListener('DOMContentLoaded', async () => {
  const artworkImage = document.getElementById('artwork-image');
  const artworkInfo = document.getElementById('artistInfo'); // Changed to 'artistInfo'
  const loader = document.getElementById('loader');

  let randomArtworkID;
  let artworkData;

  const fetchRandomArtworkID = async () => {
    try {
      const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?q=luke');
      const data = await response.json();
      return data.objectIDs[Math.floor(Math.random() * data.objectIDs.length)];
    } catch (error) {
      console.error('Error fetching artwork ID:', error);
      throw error;
    }
  };

  const fetchArtwork = async () => {
    loader.style.display = 'block'; // Show loader while loading artwork

    try {
      randomArtworkID = await fetchRandomArtworkID();

      const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomArtworkID}`);
      artworkData = await artworkResponse.json();

      const tempImage = new Image();
      tempImage.src = artworkData.primaryImageSmall;

      tempImage.onload = () => {
        artworkImage.src = tempImage.src;
        artworkImage.alt = artworkData.title;

        artworkInfo.textContent = artworkData.title;

        artworkImage.style.opacity = '0';
        setTimeout(() => {
          artworkImage.style.transition = 'opacity 2s ease-in-out';
          artworkImage.style.opacity = '1';
        }, 100);

        setTimeout(fetchArtwork, 3000);
        loader.style.display = 'none';
      };

      tempImage.onerror = () => {
        console.error('Image failed to load');
        setTimeout(fetchArtwork, 500);
        loader.style.display = 'none';
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      artworkInfo.textContent = 'Failed to fetch artwork';
      setTimeout(fetchArtwork, 500);
      loader.style.display = 'none';
    }
  };

  fetchArtwork(); // Fetch initial artwork
});


