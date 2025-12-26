import axios from "axios";
import { getAuth } from "firebase/auth";

const API_BASE = "http://localhost:5000";

export async function sendChatMessage(message) {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    const res = await axios.post(
        `${API_BASE}/api/chat`,
        { message },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );

    return res.data;
}
