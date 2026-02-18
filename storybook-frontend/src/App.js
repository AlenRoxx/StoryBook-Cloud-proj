import React, { useState } from 'react';
import './App.css';

function App() {
  // State variables for the user prompt, loading status, and the storybook data
  const [userPrompt, setUserPrompt] = useState('');
  const [storybook, setStorybook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the form from reloading the page
    setIsLoading(true);
    setError(null);
    setStorybook([]); // Clear previous storybook data

    try {
      // Make a POST request to your backend API
      const response = await fetch('http://localhost:3001/generate-storybook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt }),
      });

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setStorybook(data.storybook);

    } catch (err) {
      console.error("Failed to generate storybook:", err);
      setError("Failed to generate storybook. Please check your backend and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Storybook Generator</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <textarea
            className="prompt-input"
            rows="4"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Enter a theme for your story (e.g., 'A lost robot in a magical forest')"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Create Storybook'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Creating your story and images... this may take a moment!</p>
          </div>
        )}

        {storybook.length > 0 && (
          <div className="storybook-container">
            {storybook.map((page, index) => (
              <div key={index} className="story-page">
                <p className="story-text">{page.text}</p>
                {page.imageUrl && (
                  <img src={page.imageUrl} alt={`Page ${index + 1}`} className="story-image" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
