// src/components/IssueCard.jsx
import React from 'react';

// This component displays a single issue in a "Card" style.
// It receives the "issue" data as a prop (input).
function IssueCard({ issue, onStatusChange }) {

    // Helper to choose color based on Priority
    const getPriorityColor = (p) => {
        if (p === 'High') return 'red';
        if (p === 'Medium') return 'orange';
        return 'green'; // Low
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{issue.title}</h3>
                <span style={{
                    backgroundColor: '#eee',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                }}>
                    {issue.status}
                </span>
            </div>

            <p style={{ color: '#555', fontSize: '0.95rem' }}>{issue.description}</p>

            <div style={{ marginTop: '10px' }}>
                <small style={{ marginRight: '5px' }}>Change Status:</small>
                <button onClick={() => onStatusChange(issue, 'Open')} disabled={issue.status === 'Open'} style={{ fontSize: '0.8rem', marginRight: '5px' }}>Open</button>
                <button onClick={() => onStatusChange(issue, 'In Progress')} disabled={issue.status === 'In Progress'} style={{ fontSize: '0.8rem', marginRight: '5px' }}>In Progress</button>
                <button onClick={() => onStatusChange(issue, 'Done')} disabled={issue.status === 'Done'} style={{ fontSize: '0.8rem' }}>Done</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#777', marginTop: '15px' }}>
                <span>
                    Priority: <strong style={{ color: getPriorityColor(issue.priority) }}>{issue.priority}</strong>
                </span>
                <span>
                    Assigned to: {issue.assignedTo || 'Unassigned'}
                </span>
            </div>
        </div>
    );
}

export default IssueCard;
