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
    if (!newAlbumName.trim()) return;

    fetch("https://cf-photos-worker.paragio.workers.dev/albums", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newAlbumName }),
    })
      .then((response) => response.json())
      .then((newAlbum: Album) => {
        setAlbums([...albums, newAlbum]);
        setNewAlbumName("");
      })
      .catch((error) => console.error("Error adding album:", error));
  };

  return (
    <div className="page-content">
      <h1>Manage Albums</h1>
      <input
        type="text"
        value={newAlbumName}
        onChange={(e) => setNewAlbumName(e.target.value)}
        placeholder="New Album Name"
      />
      <button onClick={addAlbum}>Add Album</button>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            {album.name} (Created on: {new Date(album.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>

  );
}

export default AlbumsPage;
