


import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';


const API_URL = "http://localhost:5000/api/v1/auth";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [tokenCheckLoading, setTokenCheckLoading] = useState(true);
    console.log(token);
    // Effect to verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                // You could add a GET endpoint to verify, or let the POST handle it
                // For simplicity, we'll assume the POST will tell us if it's invalid.
                // In a real app, you might make a GET request here for better UX.
                setIsValidToken(true); // Optimistically assume valid for now, POST will confirm
            } catch (err) {
                setError('Invalid or expired password reset link. Please request a new one.');
                setIsValidToken(false);
            } finally {
                setTokenCheckLoading(false);
            }
        };
        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/resetpassword/${token}`, { password });
            setMessage(res.data.message);
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                navigate('/'); // Redirect to home/login after successful reset
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (tokenCheckLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <div className="card p-4 shadow-sm w-100 text-center" style={{ maxWidth: '500px' }}>
                    <h2 className="mb-4 text-danger"><i className="fas fa-exclamation-triangle me-2"></i>Invalid Link</h2>
                    <p className="lead">{error || 'This password reset link is invalid or has expired.'}</p>
                    <p>Please <a href="/forgot-password">request a new password reset link</a>.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '400px' }}>
                <h2 className="mb-4 text-center">Reset Password</h2>
                <p className="text-center text-muted">Enter your new password below.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-text">Must be at least 6 characters long.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>
                    {message && <div className="alert alert-success mt-3">{message}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Resetting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sync-alt me-2"></i>Reset Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;