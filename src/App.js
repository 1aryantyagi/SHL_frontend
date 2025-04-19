import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Health Check Component
function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://shl-assignment-r7vz.onrender.com/health');
      setHealthStatus(response.data.status);
    } catch (error) {
      setHealthStatus('unhealthy');
    }
    setLoading(false);
  };

  return (
    <div className="health-check text-center mt-4">
      <button className="btn btn-outline-info px-4" onClick={checkHealth} disabled={loading}>
        {loading ? 'Checking...' : 'Check API Health'}
      </button>
      {healthStatus && (
        <div className={`alert alert-${healthStatus === 'healthy' ? 'success' : 'danger'} mt-3`}>
          API Status: {healthStatus}
        </div>
      )}
    </div>
  );
}

// Home Component
function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://shl-assignment-r7vz.onrender.com/recommend', { query });
      navigate('/results', { state: { results: response.data } });
    } catch (error) {
      alert('Error getting recommendations: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">SHL Assessment Recommendation Engine</h1>
        <p className="text-muted">Enter your query to get personalized test recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="queryInput" className="form-label fw-semibold">Assessment Query</label>
          <textarea
            id="queryInput"
            className="form-control"
            placeholder="e.g. I need to assess logical reasoning for graduate hiring..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="5"
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? 'Processing...' : 'Get Recommendations'}
          </button>
        </div>
      </form>

      <HealthCheck />
    </div>
  );
}

// Results Component
function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results || !results.recommended_assessments) {
    return (
      <div className="container mt-5 text-center">
        <h1>No Results</h1>
        <p>Please return to the home page and submit a query first.</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Recommended Assessments</h1>
      <div className="row">
        {results.recommended_assessments.map((assessment, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{assessment.description}</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Test Type:</strong> {assessment.test_type.join(', ')}
                </li>
                <li className="list-group-item">
                  <strong>Duration:</strong> {assessment.duration} minutes
                </li>
                <li className="list-group-item">
                  <strong>Adaptive Support:</strong> {assessment.adaptive_support}
                </li>
                <li className="list-group-item">
                  <strong>Remote Support:</strong> {assessment.remote_support}
                </li>
              </ul>
              <div className="card-body">
                <a
                  href={assessment.url}
                  className="btn btn-outline-primary w-100"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Assessment
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button
          className="btn btn-secondary mt-4 px-4"
          onClick={() => navigate(-1)}
        >
          Back to Search
        </button>
      </div>
    </div>
  );

}

// App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
