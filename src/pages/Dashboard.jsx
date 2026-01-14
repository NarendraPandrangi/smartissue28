// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import IssueCard from '../components/IssueCard';

function Dashboard() {
    const navigate = useNavigate();
    const user = auth.currentUser;

    // State to hold issues fetched from database
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for Filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    // Fetch issues when component mounts
    useEffect(() => {
        // 1. Create a reference to the "issues" collection
        const issuesRef = collection(db, "issues");

        // 2. Create a query to sort by 'createdAt' in descending order (Newest first)
        const q = query(issuesRef, orderBy("createdAt", "desc"));

        // 3. Listen for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Convert the snapshot (Firebase format) to a simple array of objects
            const issuesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setIssues(issuesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching issues:", error);
            setLoading(false);
        });

        // Cleanup listener when leaving the page
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    // Filter Logic
    const filteredIssues = issues.filter(issue => {
        // Check Status match
        const statusMatch = statusFilter === 'All' || issue.status === statusFilter;
        // Check Priority match
        const priorityMatch = priorityFilter === 'All' || issue.priority === priorityFilter;

        return statusMatch && priorityMatch;
    });

    // --- NEW STEP: Status Update Logic ---
    const handleStatusUpdate = async (issue, newStatus) => {
        // Rule: Cannot go from Open -> Done directly
        if (issue.status === 'Open' && newStatus === 'Done') {
            alert("⚠️ Rule Violation!\nYou cannot move an issue directly from Open to Done.\nPlease move it to 'In Progress' first.");
            return;
        }

        try {
            // Import necessary Firestore functions if not already imported
            const { doc, updateDoc } = await import('firebase/firestore');

            // Update in Firestore
            const issueRef = doc(db, "issues", issue.id);
            await updateDoc(issueRef, {
                status: newStatus
            });
            // No need to "refresh" issues manually, the onSnapshot listener will do it automatically!

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };
    // -------------------------------------

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Dashboard</h1>
                <div>
                    <span style={{ marginRight: '10px' }}>{user?.email}</span>
                    <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Log Out</button>
                </div>
            </div>

            {/* Action Bar: Create button & Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/create-issue')}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    + Create New Issue
                </button>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px' }}>
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '8px' }}>
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid #ccc', marginBottom: '20px' }} />

            {/* Issue List */}
            {loading ? (
                <p>Loading issues...</p>
            ) : (
                <div>
                    {filteredIssues.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>No issues found.</p>
                    ) : (
                        filteredIssues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} onStatusChange={handleStatusUpdate} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
