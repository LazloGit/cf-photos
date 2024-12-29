import { useState } from "react";

const authToken = "key7SBVpw5HtvATSm"; // Replace with your actual authorization token

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://cf-photos-worker.paragio.workers.dev/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setUploadStatus(`Upload failed: ${response.status} - ${errorText}`);
        return;
      }

      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Error during upload.");
    }
  };

  return (
    <div>
      <h1>Upload a Photo</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export default UploadPage;
