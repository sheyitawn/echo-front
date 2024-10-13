import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import newRequest from '../../utils/newRequest';
import './canvas.css';

function Canvas({ submissions, setSubmissions }) {
  const [fadedSubmissions, setFadedSubmissions] = useState([]);
  const [positions, setPositions] = useState([]); // Store positions for each submission
  const [voteModals, setVoteModals] = useState({}); // Store modal visibility for each submission

  // Check if the user has voted on a specific submission (stored in localStorage)
  const getVoteStatus = (id) => {
    const votedSubmissions = JSON.parse(localStorage.getItem('votedSubmissions')) || {};
    return votedSubmissions[id] || null; // 'up' or 'down' or null
  };

  // Store or update vote status in localStorage
  const setVoteStatus = (id, status) => {
    const votedSubmissions = JSON.parse(localStorage.getItem('votedSubmissions')) || {};
    if (status) {
      votedSubmissions[id] = status;
    } else {
      delete votedSubmissions[id]; // Remove vote status if unvoting
    }
    localStorage.setItem('votedSubmissions', JSON.stringify(votedSubmissions));
  };

  const upvote = async (id) => {
    const voteStatus = getVoteStatus(id);

    if (voteStatus === 'up') {
      // User already upvoted, so remove the upvote
      try {
        const response = await newRequest.put(`/submissions/${id}/remove-upvote`);
        const updatedSubmission = response.data;

        // Update the local state with the new vote count
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((submission) =>
            submission._id === id ? updatedSubmission : submission
          )
        );

        setVoteStatus(id, null); // Remove the vote from localStorage
        toast('Upvote removed');
      } catch (error) {
        console.error('Error removing upvote:', error);
        toast.error("Couldn't remove upvote");
      }
    } else {
      // User has not upvoted or has downvoted, so add an upvote
      try {
        const response = await newRequest.put(`/submissions/${id}/upvote`);
        const updatedSubmission = response.data;

        // Update the local state with the new vote count
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((submission) =>
            submission._id === id ? updatedSubmission : submission
          )
        );

        setVoteStatus(id, 'up'); // Record the upvote in localStorage
      } catch (error) {
        console.error('Error upvoting:', error);
        toast.error("Couldn't upvote");
      }
    }
  };

  const downvote = async (id) => {
    const voteStatus = getVoteStatus(id);

    if (voteStatus === 'down') {
      // User already downvoted, so remove the downvote
      try {
        const response = await newRequest.put(`/submissions/${id}/remove-downvote`);
        const updatedSubmission = response.data;

        // Update the local state with the new vote count
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((submission) =>
            submission._id === id ? updatedSubmission : submission
          )
        );

        setVoteStatus(id, null); // Remove the vote from localStorage
        toast('Downvote removed');
      } catch (error) {
        console.error('Error removing downvote:', error);
        toast.error("Couldn't remove downvote");
      }
    } else {
      // User has not downvoted or has upvoted, so add a downvote
      try {
        const response = await newRequest.put(`/submissions/${id}/downvote`);
        const updatedSubmission = response.data;

        // Update the local state with the new vote count
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((submission) =>
            submission._id === id ? updatedSubmission : submission
          )
        );

        setVoteStatus(id, 'down'); // Record the downvote in localStorage
      } catch (error) {
        console.error('Error downvoting:', error);
        toast.error("Couldn't downvote");
      }
    }
  };

  // Function to generate random positions around the center without overlap
  const generateRandomPosition = (existingPositions, size = 150, padding = 50) => {
    const radius = 500;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    let position;
    let isOverlapping = true;
    let attempts = 0;
    const maxAttempts = 100;

    while (isOverlapping && attempts < maxAttempts) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = centerX + Math.cos(angle) * distance - size / 2;
      const y = centerY + Math.sin(angle) * distance - size / 2;

      position = { x, y, size };

      isOverlapping = existingPositions.some((existing) => {
        const dx = existing.x - position.x;
        const dy = existing.y - position.y;
        const distanceBetween = Math.sqrt(dx * dx + dy * dy);
        return distanceBetween < existing.size + padding;
      });

      attempts++;
    }

    return position;
  };

  // Toggle vote modal for a specific submission
  const toggleVoteModal = (index) => {
    setVoteModals((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Update the submissions and their positions
  useEffect(() => {
    const currentTime = new Date().getTime();

    const updatedSubmissions = (submissions || []).map(submission => {
      const timeElapsed = currentTime - submission.timestamp;
      const timeInHours = timeElapsed / (1000 * 60 * 60); // Convert to hours

      // Adjust fade time based on votes (72 hours by default, adjusted by the number of votes)
      const adjustedTime = 72 + (submission.votes || 0); // 72 hours default + votes

      const fadePercentage = Math.min(timeInHours / adjustedTime, 1); // Adjust fade percentage
      const opacity = 1 - fadePercentage;

      return { ...submission, opacity };
    });

    const newPositions = updatedSubmissions.map((submission, index) => {
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
        element.classList.add('active');
      }, index * 200);
    });
  }, [fadedSubmissions]);

  return (
    <div className="canvas">

      <div className="submission_container">
        {fadedSubmissions.map((submission, index) => (
          <div
            key={submission._id} // Ensure unique key
            className="submission"
            onClick={() => toggleVoteModal(index)}
            style={{
              opacity: submission.opacity,
              transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
            }}
          >
            {submission.text}

            {voteModals[index] && (
              <div className="submission_modal">
                <div className="submission_modal-vote" onClick={() => upvote(submission._id)}>
                  <FaChevronUp />
                </div>
                <small className="vote_count">{submission.votes}</small>

                <div className="submission_modal-vote" onClick={() => downvote(submission._id)}>
                  <FaChevronDown />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Canvas;
