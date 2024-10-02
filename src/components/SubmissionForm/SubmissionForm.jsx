import { useState } from 'react';
import './submissionform.css'

function SubmissionForm({ onSubmit }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const submission = { text: input };
            onSubmit(submission);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="write something..."
            />
            <br />
            <button type="submit">drop it</button>
        </form>
    );
}

export default SubmissionForm;
