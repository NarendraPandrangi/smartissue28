// src/pages/CreateIssue.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { checkForSimilarIssues } from '../utils/similarityCheck';

// CreateIssue component allows users to post a new problem ticket.
function CreateIssue() {
    const navigate = useNavigate();

    // State for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low'); // Default to Low
    const [assignee, setAssignee] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // --- NEW STEP: Check for similar issues ---
            const similarIssues = await checkForSimilarIssues(title);

            if (similarIssues.length > 0) {
                const confirmSave = window.confirm(
                    `We found similar issues:\n- ${similarIssues.join('\n- ')}\n\nDo you still want to create this issue?`
                );
                if (!confirmSave) {
                    setIsSubmitting(false);
                    return; // Stop here if user cancels
                }
            }
            // ------------------------------------------

            // 1. Get the current logged-in user
            // We need to know WHO created this issue.
            const user = auth.currentUser;

            // 2. Prepare the data object to save
            // "issues" is the name of our Collection in the database.
            // A "Collection" is like a Folder.
            // Each issue will be a "Document" (File) inside that folder.
            await addDoc(collection(db, "issues"), {
                title: title,
                description: description,
                priority: priority,
                assignedTo: assignee,
                status: 'Open', // Default status is always Open
                createdBy: user.email, // Save the email of the creator
                createdAt: serverTimestamp() // Save the server's time
            });

            // 3. Success! Go back to Dashboard.
            alert("Issue created successfully!");
            navigate('/dashboard');

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error saving issue. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h1>Create New Issue</h1>
            <form onSubmit={handleSubmit}>

                {/* Title Input */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Title:</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="E.g., Login button not working"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Description Input */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Description:</label><br />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Describe the problem..."
                        rows="4"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Priority Dropdown */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Priority:</label><br />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {/* Assigned To Input */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Assigned To:</label><br />
                    <input
                        type="text"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Name or Email"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Buttons */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ padding: '10px 20px', marginRight: '10px' }}
                >
                    {isSubmitting ? 'Saving...' : 'Create Issue'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px 20px', background: '#ccc', border: 'none' }}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default CreateIssue;
