// src/components/IssueCard.jsx
import React from 'react';

// This component displays a single issue in a "Card" style.
// It receives the "issue" data as a prop (input).
function IssueCard({ issue, onStatusChange }) {

    // Helper to choose badge class based on Status
    const getStatusBadge = (s) => {
        if (s === 'Done') return 'badge badge-done';
        if (s === 'In Progress') return 'badge badge-progress';
        return 'badge badge-open';
    };

    // Helper for Priority Color
    const getPriorityColor = (p) => {
        if (p === 'High') return 'var(--accent-danger)';
        if (p === 'Medium') return 'var(--accent-warning)';
        return 'var(--accent-success)';
    };

    return (
        <div className="card mb-4" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{issue.title}</h3>
                <span className={getStatusBadge(issue.status)}>
                    {issue.status}
                </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {issue.description}
            </p>

            <div className="flex justify-between items-center" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>
                    Priority: <strong style={{ color: getPriorityColor(issue.priority) }}>{issue.priority}</strong>
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                    Assigned to: {issue.assignedTo || 'Unassigned'}
                </span>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Update Status
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => onStatusChange(issue, 'Open')}
                        disabled={issue.status === 'Open'}
                        className="btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: issue.status === 'Open' ? 'rgba(255,255,255,0.1)' : 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--bg-card)' }}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => onStatusChange(issue, 'In Progress')}
                        disabled={issue.status === 'In Progress'}
                        className="btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: issue.status === 'In Progress' ? 'rgba(255,255,255,0.1)' : 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--bg-card)' }}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => onStatusChange(issue, 'Done')}
                        disabled={issue.status === 'Done'}
                        className="btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: issue.status === 'Done' ? 'rgba(255,255,255,0.1)' : 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--bg-card)' }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IssueCard;
