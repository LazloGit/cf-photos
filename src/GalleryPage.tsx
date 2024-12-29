import { useState, useEffect } from "react";

const authToken = "key7SBVpw5HtvATSm"; // Replace with your actual authorization token

function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const showPreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < photos.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <div>
      <h1>Photo Gallery</h1>
      <p>Total Images: {photos.length}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
        {photos.map((photo, index) => (
          <img
            key={photo}
            src={imageUrls[photo]}
            alt={photo}
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {selectedImageIndex !== null && (
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPreviousImage();
            }}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
            }}
          >
            &#8249; {/* Left arrow */}
          </button>
          <img
            src={imageUrls[photos[selectedImageIndex]]}
            alt="Expanded View"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNextImage();
            }}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
            }}
          >
            &#8250; {/* Right arrow */}
          </button>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
