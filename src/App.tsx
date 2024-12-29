import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GalleryPage from "./GalleryPage";
import UploadPage from "./UploadPage";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul style={{ display: "flex", gap: "20px", listStyle: "none", padding: 0 }}>
            <li><Link to="/">Gallery</Link></li>
            <li><Link to="/upload">Upload</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
