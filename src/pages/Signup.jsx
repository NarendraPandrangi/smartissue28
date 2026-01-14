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
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignup}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Sign Up</button>
            </form>
            <p>
                Already have an account?
                <Link to="/" style={{ marginLeft: '5px' }}>Log In</Link>
            </p>
        </div>
    );
}

export default Signup;
