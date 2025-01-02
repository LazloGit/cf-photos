import { useState, useEffect } from "react";

const authToken = "key7SBVpw5HtvATSm"; // Replace with your actual authorization token

interface Album {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [userId, setUserId] = useState(""); // Capture user ID for album creation
  const [error, setError] = useState("");

  // Fetch albums
  useEffect(() => {
    fetch("https://cf-photos-worker.paragio.workers.dev/albums", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data: Album[]) => setAlbums(data))
      .catch((error) => console.error("Error fetching albums:", error));
  }, []);

  // Add a new album
  const addAlbum = () => {
    if (!newAlbumName.trim() || !userId.trim()) {
      setError("Album name and User ID are required.");
      return;
    }
  
    fetch("https://cf-photos-worker.paragio.workers.dev/albums", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newAlbumName, user_id: userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create album.");
        }
        return response.json();
      })
      .then((newAlbum: Album) => {
        console.log("New Album Response:", newAlbum); // Debug the API response
        setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
        setNewAlbumName("");
        setUserId("");
        setError("");
      })
      .catch((error) => {
        console.error("Error adding album:", error);
        setError(error.message);
      });
  };
  

  // Delete an album
  const deleteAlbum = (albumId: string) => {
    fetch(`https://cf-photos-worker.paragio.workers.dev/albums/${albumId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete album.");
        }
        setAlbums(albums.filter((album) => album.id !== albumId));
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className="page-content">
      <h1>Manage Albums</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="text"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          placeholder="New Album Name"
        />
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <button className="add-btn" onClick={addAlbum}>Add Album</button>
      </div>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            <span>
            {album.name} (Created on: {new Date(album.created_at).toLocaleString()}){" "}
            </span>
            <button className="delete-btn" onClick={() => deleteAlbum(album.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumsPage;
