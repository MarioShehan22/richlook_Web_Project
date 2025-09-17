import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';
import "../style/login.css";
import axiosInstance from "../config/axiosConfig.js";
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', remember: false });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const togglePassword = () => setPasswordVisible(prev => !prev);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            const response = await axiosInstance.post('users/login', formData);
            console.log(formData);
            if (response.status === 200) {
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 2);
                document.cookie = encodeURIComponent('token') + '=' + encodeURIComponent(idToken) + '; expires=' + expirationDate.toUTCString() + '; path=/';
                alert('Login successful!');
                navigate('/home');
            }
        } catch (error) {
            let errorMessage = 'Login failed!';
            if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
            else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
            else if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';
            else errorMessage = error.message;

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            // Set the expiration date for the cookie
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 2);
            // Send the idToken to the backend in the request body
            const response = await axiosInstance.post('/users/social-login', { idToken });  // Pass idToken as an object
            if (response.status === 200) {
                document.cookie = encodeURIComponent('token') + '=' + encodeURIComponent(idToken) + '; expires=' + expirationDate.toUTCString() + '; path=/';
                alert('Login successful!');
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in with Google:', error);
            setError('Google login failed!');
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setLoading(true);
        const provider = new FacebookAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            // Set the expiration date for the cookie
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 2);
            // Send the idToken to the backend in the request body
            const response = await axiosInstance.post('/users/social-login', { idToken });  // Pass idToken as an object
            if (response.status === 200) {
                document.cookie = encodeURIComponent('token') + '=' + encodeURIComponent(idToken) + '; expires=' + expirationDate.toUTCString() + '; path=/';
                alert('Login successful!');
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in with Facebook:', error);
            setError('Facebook login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center text-white">
            <div className="me-md-5 text-center text-md-start">
                <h1 className="display-3 fw-bold text-glow">Welcome Back!</h1>
                <p className="lead text-light">Let's get you signed in to continue your journey.</p>
                <button className="btn btn-outline-light mt-3 px-4 py-2 rounded-pill shadow-sm animate-hover" onClick={(e) => e.preventDefault()}>
                    Skip the lag?
                </button>
            </div>

            <div className="glass-card fadeInUp">
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Login</h2>
                    <p className="text-light">We're happy to see you again!</p>
                </div>

                {error && <Alert type="error" message={error} className="mb-4" />}

                <form onSubmit={handleSubmit} className="needs-validation">
                    <FormInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mb-3"
                    />

                    <div className="position-relative mb-3">
                        <FormInput
                            label="Password"
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="rl-btn rl-btn-icon rl-btn-sm rl-btn-ghost position-absolute"
                            style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            onClick={togglePassword}
                            aria-label="Toggle password visibility"
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="form-check mb-4">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="remember"
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                        />
                        <label className="form-check-label text-black" htmlFor="remember">
                            Remember me
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        className="w-100"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="text-center my-4">
                    <hr className="border-light" />
                    <span className="text-black">Or login with</span>
                </div>

                <div className="d-flex justify-content-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<FaGoogle />}
                        className="rounded-circle p-3 shadow-lg"
                        style={{ backgroundColor: '#dd4b39', color: 'white' }}
                        title="Login with Google"
                        onClick={handleGoogleLogin}
                    />
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<FaFacebookF />}
                        className="rounded-circle p-3 shadow-lg"
                        style={{ backgroundColor: '#4267B2', color: 'white' }}
                        title="Login with Facebook"
                        onClick={handleFacebookLogin}
                    />
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<FaGithub />}
                        className="rounded-circle p-3 shadow-lg"
                        style={{ backgroundColor: '#333', color: 'white' }}
                        title="Login with GitHub"
                    />
                </div>

                <div className="text-center">
                    <span className="text-black">Don't have an account? </span>
                    <Link to="/signup" className="text-info fw-bold">Signup</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;