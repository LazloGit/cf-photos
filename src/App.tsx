import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GalleryPage from "./GalleryPage";
import UploadPage from "./UploadPage";
import { Link } from "react-router-dom";
import "./App.css"; // Assuming you have some CSS for styling

function App() {
  return (
    <Router>
      <div className="App">
        {/* Top navigation menu */}
        <nav className="top-menu">
          <Link to="/">Gallery</Link>
          <Link to="/upload">Upload</Link>
        </nav>

        {/* Main content area */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 CF Photo Gallery App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
