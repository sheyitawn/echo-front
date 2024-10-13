import { useState, useEffect } from 'react';
import SubmissionForm from './components/SubmissionForm/SubmissionForm';
import Canvas from './components/Canvas/Canvas';
import LoadingScreen from './components/Loading/Loading';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import newRequest from './utils/newRequest';
import './App.css';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Hide loading screen after 3 seconds
    }, 3000);
  }, []);


  // Fetch submissions from the database
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await newRequest.get('/submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error("error")
      }
    };

    fetchSubmissions();
  }, []);

  const handleSubmission = async (input) => {
    try {
      const response = await newRequest.post('/submissions', input);
      setSubmissions((prev) => [...prev, response.data]);

      // Store the current timestamp in localStorage
      const currentTime = new Date().getTime();
      localStorage.setItem('lastSubmissionTime', currentTime);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error("something's wrong")

    }
  };

  // Check localStorage to see if user has submitted within the last 72 hours
  useEffect(() => {
    const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');

    if (lastSubmissionTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(lastSubmissionTime, 10);
      const hoursPassed = timeDifference / (1000 * 60 * 60);

      // Check if 72 hours have passed since the last submission
      if (hoursPassed < 72) {
        setIsSubmitted(true); // Skip the modal if less than 72 hours have passed
      }
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <ToastContainer />
      {!isSubmitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <SubmissionForm onSubmit={handleSubmission} />
          </div>
        </div>
      )}

      <Canvas submissions={submissions} setSubmissions={setSubmissions} />
    </div>
  );
}

export default App;
