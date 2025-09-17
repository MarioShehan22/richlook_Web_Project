import axios from 'axios';
import { auth } from './firebaseConfig.js';
import { onIdTokenChanged } from 'firebase/auth';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/',
});

// cache the current ID token
let currentIdToken = null;

// keep token up to date
onIdTokenChanged(auth, async (user) => {
    currentIdToken = user ? await user.getIdToken() : null;
});

// attach token to every request
axiosInstance.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        // refresh if needed
        currentIdToken = await user.getIdToken();
    }
    if (currentIdToken) {
        config.headers.Authorization = `Bearer ${currentIdToken}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
});

export default axiosInstance;
