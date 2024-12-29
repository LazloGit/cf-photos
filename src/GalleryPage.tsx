import { useState, useEffect } from "react";

const authToken = "key7SBVpw5HtvATSm"; // Replace with your actual authorization token

function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch the list of photos
  useEffect(() => {
    fetch("https://cf-photos-worker.paragio.workers.dev/photos", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPhotos(data))
      .catch((error) => console.error("Error fetching photos:", error));
  }, []);

  // Fetch images and create Blob URLs
  useEffect(() => {
    photos.forEach((photo) => {
      fetch(`https://cf-photos-worker.paragio.workers.dev/photos/${photo}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          setImageUrls((prevUrls) => ({ ...prevUrls, [photo]: imageUrl }));
        })
        .catch((error) => console.error("Error fetching image:", error));
    });
  }, [photos]);

  const handleImageClick = (photo: string) => {
    setSelectedImage(imageUrls[photo] || null);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <h1>Photo Gallery</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
        {photos.map((photo) => (
          <img
            key={photo}
            src={imageUrls[photo]}
            alt={photo}
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => handleImageClick(photo)}
          />
        ))}
      </div>

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeModal}
        >
          <img
            src={selectedImage}
            alt="Expanded View"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
