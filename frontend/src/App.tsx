import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BioSampleDetail from './components/BioSampleDetail';
import BioSampleForm from './components/BioSampleForm';
import BioSampleList from './components/BioSampleList';

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main-content" role="main">
          <Routes>
            <Route path="/" element={<BioSampleList />} />
            <Route path="/create" element={<BioSampleForm />} />
            <Route path="/edit/:id" element={<BioSampleForm />} />
            <Route path="/biosample/:id" element={<BioSampleDetail />} />
            <Route path="*" element={
              <div className="container">
                <div className="empty-state">
                  <h3>Page Not Found</h3>
                  <p>The page you're looking for doesn't exist.</p>
                  <Link to="/">
                    <button>← Back to Samples</button>
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
