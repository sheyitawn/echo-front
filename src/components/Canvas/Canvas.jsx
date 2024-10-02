import { useState, useEffect } from 'react';
import './canvas.css';

function Canvas({ submissions }) {
  console.log("🚀 ~ Canvas ~ submissions:", submissions)
  const [fadedSubmissions, setFadedSubmissions] = useState([]);
  const [positions, setPositions] = useState([]); // Store positions for each submission

  // Function to generate random positions around the center without overlap
  const generateRandomPosition = (existingPositions, size = 150, padding = 50) => {
    const radius = 500; // Maximum distance from the center (adjustable)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    let position;
    let isOverlapping = true;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (isOverlapping && attempts < maxAttempts) {
      // Generate random angle and distance
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = centerX + Math.cos(angle) * distance - size / 2;
      const y = centerY + Math.sin(angle) * distance - size / 2;

      position = { x, y, size };

      // Check if this position overlaps with any existing positions
      isOverlapping = existingPositions.some((existing) => {
        const dx = existing.x - position.x;
        const dy = existing.y - position.y;
        const distanceBetween = Math.sqrt(dx * dx + dy * dy);
        return distanceBetween < existing.size + padding; // Add padding to prevent overlap
      });

      attempts++;
    }

    return position;
  };

  // Update the submissions and their positions
  useEffect(() => {
    const currentTime = new Date().getTime();

    const updatedSubmissions = submissions.map(submission => {
      const timeElapsed = currentTime - submission.timestamp;
      const timeInHours = timeElapsed / (1000 * 60 * 60); // Convert to hours
      const fadePercentage = Math.min(timeInHours / 72, 1); // Fade after 72 hours
      const opacity = 1 - fadePercentage;

      return { ...submission, opacity }; // Add opacity to each submission
    });

    // Generate random positions for new submissions
    const newPositions = updatedSubmissions.map((submission, index) => {
      // Skip if position already exists for this submission
      if (positions[index]) return positions[index];

      const newPosition = generateRandomPosition(positions);
      return newPosition;
    });

    setPositions(newPositions); // Update positions
    setFadedSubmissions(updatedSubmissions);
  }, [submissions]);

  // Trigger fade-in animation for each submission
  useEffect(() => {
    const submissionElements = document.querySelectorAll('.submission');
    submissionElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active'); // Add active class to trigger animation
      }, index * 200); // Add delay between items
    });
  }, [fadedSubmissions]);

  return (
    <div className="canvas">
      <div className="submission_container">
        {fadedSubmissions.map((submission, index) => (
          <div
            key={index}
            className="submission"
            style={{
              opacity: submission.opacity,
              transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`
            }}
          >
            {submission.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Canvas;
