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
        <div className="container">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.email}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Log Out
                </button>
            </div>

            {/* Action Bar: Create button & Filters */}
            <div className="card mb-4" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                    onClick={() => navigate('/create-issue')}
                    className="btn btn-primary"
                >
                    + Create New Issue
                </button>

                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '150px' }}>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div style={{ minWidth: '150px' }}>
                        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option value="All">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Issue List */}
            {loading ? (
                <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Loading issues...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredIssues.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <p>No issues found matching your filters.</p>
                        </div>
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
