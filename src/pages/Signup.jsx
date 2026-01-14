// src/pages/Signup.jsx
import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Fix: User requested to go back to Login page after signup.
            // Firebase auto-logs in, so we must sign out explicitly.
            await auth.signOut();

            alert("Successfully signed up! Please log in.");
            // Navigate to Login page
            navigate('/');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Create Account</h2>
                {error && <div className="text-center" style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Sign Up</button>
                </form>
                <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account?
                    <Link to="/" style={{ marginLeft: '5px' }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
