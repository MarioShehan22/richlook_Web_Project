import React, { useState, useEffect } from 'react';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    getRedirectResult,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';
import axiosInstance from '../config/axiosConfig.js';
import "../style/login.css"; // ← reuse the login styles for the same look
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [authing, setAuthing] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => setPasswordVisible((p) => !p);
    const onChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

    // Optional (for popup-blocked fallback if you ever switch to redirect)
    useEffect(() => {
        getRedirectResult(auth).catch(() => {});
    }, []);

    const benignPopup = (code) =>
        code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user';

    const withSinglePopup = (fn) => async () => {
        if (authing) return;
        setAuthing(true);
        setError('');
        try {
            await fn();
        } catch (e) {
            console.error('Auth error:', e);
            if (!benignPopup(e.code)) setError(e.message || 'Sign up failed');
        } finally {
            setAuthing(false);
        }
    };

    // Email/password sign up
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (authing) return;
        setAuthing(true);
        setError('');
        try {
            const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const idToken = await cred.user.getIdToken();

            // Create the user on your backend as you already do
            const res = await axiosInstance.post('users/signup', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
            });

            if (res.status === 201) {
                const exp = new Date(); exp.setDate(exp.getDate() + 2);
                document.cookie = `${encodeURIComponent('token')}=${encodeURIComponent(idToken)}; expires=${exp.toUTCString()}; path=/`;
                alert('Signup successful!');
                navigate('/home');
            }
        } catch (e) {
            setError(e.message || 'Signup failed');
        } finally {
            setAuthing(false);
        }
    };

    const handleGoogleSignup = withSinglePopup(async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();

        const res = await axiosInstance.post('users/social-login', { idToken });
        if (res.status === 200) {
            const exp = new Date(); exp.setDate(exp.getDate() + 2);
            document.cookie = `${encodeURIComponent('token')}=${encodeURIComponent(idToken)}; expires=${exp.toUTCString()}; path=/`;
            alert('Google signup successful!');
            navigate('/');
        }
    });

    const handleFacebookSignup = withSinglePopup(async () => {
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();

        const res = await axiosInstance.post('users/social-login', { idToken });
        if (res.status === 200) {
            const exp = new Date(); exp.setDate(exp.getDate() + 2);
            document.cookie = `${encodeURIComponent('token')}=${encodeURIComponent(idToken)}; expires=${exp.toUTCString()}; path=/`;
            alert('Facebook signup successful!');
            navigate('/');
        }
    });

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center text-white">
            {/* Left blurb (matches Login layout) */}
            <div className="me-md-5 text-center text-md-start">
                <h1 className="display-3 fw-bold text-glow">Join Rich Look</h1>
                <p className="lead text-light">
                    Create your account to unlock faster checkout and personalized picks.
                </p>
                <button
                    className="btn btn-outline-light mt-3 px-4 py-2 rounded-pill shadow-sm animate-hover"
                    onClick={(e) => e.preventDefault()}
                >
                    Why create an account?
                </button>
            </div>

            {/* Right glass card (same as Login) */}
            <div className="glass-card fadeInUp">
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-light">We’re excited to have you on board!</p>
                </div>

                {error && <Alert type="error" message={error} className="mb-4" />}

                <form onSubmit={handleSubmit} className="needs-validation">
                    <FormInput
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        className="mb-3"
                    />

                    <FormInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        className="mb-3"
                    />

                    <div className="position-relative mb-3">
                        <FormInput
                            label="Password"
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={onChange}
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

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={authing}
                        className="w-100"
                        disabled={authing}
                    >
                        {authing ? 'Creating account…' : 'Sign Up'}
                    </Button>
                </form>

                <div className="text-center my-4">
                    <hr className="border-light" />
                    <span className="text-black">Or sign up with</span>
                </div>

                <div className="d-flex justify-content-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<FaGoogle />}
                        className="rounded-circle p-3 shadow-lg"
                        style={{ backgroundColor: '#dd4b39', color: 'white' }}
                        title="Sign up with Google"
                        onClick={handleGoogleSignup}
                        disabled={authing}
                    />
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<FaFacebookF />}
                        className="rounded-circle p-3 shadow-lg"
                        style={{ backgroundColor: '#4267B2', color: 'white' }}
                        title="Sign up with Facebook"
                        onClick={handleFacebookSignup}
                        disabled={authing}
                    />
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<FaGithub />}
                        className="rounded-circle p-3 shadow-lg"
                        style={{ backgroundColor: '#333', color: 'white' }}
                        title="GitHub (coming soon)"
                        disabled
                    />
                </div>

                <div className="text-center">
                    <span className="text-black">Already have an account? </span>
                    <Link to="/login" className="text-info fw-bold">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;