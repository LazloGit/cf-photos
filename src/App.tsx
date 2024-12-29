import { useState, useEffect } from "react";
import "./App.css"; // For custom CSS styling

const authToken = "key7SBVpw5HtvATSm"; // Replace with your actual authorization token

function App() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Fetch the list of photos
  useEffect(() => {
    fetch("https://cf-photos-worker.paragio.workers.dev/photos", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
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
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    });
  }, [photos]);

  // Clean up Blob URLs when the component is unmounted
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => {
        URL.revokeObjectURL(url); // Clean up Blob URL
      });
    };
  }, [imageUrls]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "https://cf-photos-worker.paragio.workers.dev/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setUploadStatus(`Upload failed: ${response.status} - ${errorText}`);
        return;
      }

      const { key } = await response.json(); // Get the uploaded file's key
      setUploadStatus("Upload successful!");

      // Add the new photo key to the state
      setPhotos((prevPhotos) => [...prevPhotos, key]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Error during upload.");
    }
  };

  return (
    <div className="App">
      <h1>Photo Gallery</h1>

      {/* Upload Section */}
      <div>
        <h2>Upload a Photo</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>

      {/* Gallery Section */}
      <div className="gallery-grid">
        {photos.length === 0 ? (
          <p>No photos available.</p>
        ) : (
          photos.map((photo) => (
            <div key={photo} className="photo-item">
              <img
                src={imageUrls[photo]} // Use Blob URL
                alt={photo}
                className="photo"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
