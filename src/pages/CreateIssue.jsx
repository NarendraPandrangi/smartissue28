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
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card">
                <h1 className="mb-4" style={{ fontSize: '1.5rem' }}>Create New Issue</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="E.g., Login button not working"
                        />
                    </div>

                    <div className="mb-4">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Describe the problem..."
                            rows="5"
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="w-full">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label>Assigned To</label>
                            <input
                                type="text"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                placeholder="Name or Email"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? 'Saving...' : 'Create Issue'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreateIssue;
