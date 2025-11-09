import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Auth.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotPasswordEmail) {
            setForgotPasswordMessage('Please enter your email address');
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordMessage('');

        try {
            // Simulate forgot password API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setForgotPasswordMessage('Password reset instructions have been sent to your email.');
            setForgotPasswordEmail('');
            
            // Hide forgot password form after 3 seconds
            setTimeout(() => {
                setShowForgotPassword(false);
                setForgotPasswordMessage('');
            }, 3000);
        } catch (err) {
            setForgotPasswordMessage('Failed to send reset instructions. Please try again.');
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login to GigConnect</h2>
                
                {!showForgotPassword ? (
                    <>
                        {error && <div className="error-message">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-button"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="auth-links">
                            <p className="auth-link">
                                Don't have an account? <Link to="/register">Sign up</Link>
                            </p>
                            <button 
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="forgot-password-link"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="forgot-password-section">
                        <h3>Reset Your Password</h3>
                        <p>Enter your email address and we'll send you instructions to reset your password.</p>
                        
                        {forgotPasswordMessage && (
                            <div className={`message ${forgotPasswordMessage.includes('Failed') ? 'error-message' : 'success-message'}`}>
                                {forgotPasswordMessage}
                            </div>
                        )}
                        
                        <form onSubmit={handleForgotPassword} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="forgotEmail">Email Address</label>
                                <input
                                    type="email"
                                    id="forgotEmail"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="forgot-password-actions">
                                <button
                                    type="submit"
                                    disabled={forgotPasswordLoading}
                                    className="auth-button"
                                >
                                    {forgotPasswordLoading ? 'Sending...' : 'Send Reset Instructions'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="btn-secondary"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;