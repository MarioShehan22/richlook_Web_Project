const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const { resolveOrCreateUserFromFirebase } = require("../services/firebaseUserResolver");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const groq = require("../services/groqClient");

// ---------- DB Tools ----------
async function searchProducts({ q, category, brand, gender, inStock, minPrice, maxPrice, limit = 6 } = {}) {
    const filter = { isActive: true };

    if (q && String(q).trim()) filter.$text = { $search: String(q).trim() };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (inStock === true) filter.totalQuantity = { $gt: 0 };

    const minP = Number(minPrice);
    const maxP = Number(maxPrice);
    if (Number.isFinite(minP) || Number.isFinite(maxP)) {
        filter.price = {};
        if (Number.isFinite(minP)) filter.price.$gte = minP;
        if (Number.isFinite(maxP)) filter.price.$lte = maxP;
    }

    const items = await Product.find(filter)
        .select("name price brand category gender totalQuantity thumbnailUrl slug")
        .limit(Math.min(12, Math.max(1, Number(limit) || 6)))
        .lean();

    return items;
}

async function getMyOrders(userId, limit = 5) {
    const orders = await Order.find({ userId })
        .populate({ path: "products.productId", select: "name thumbnailUrl price" })
        .sort({ createdAt: -1 })
        .limit(Math.min(20, Math.max(1, Number(limit) || 5)))
        .lean();

    return orders;
}

// ---------- Prompt helper ----------
function makeSystemPrompt() {
    return `
You are RichLook Shop Assistant.
Rules:
- Be short and helpful.
- If question is about products, you can ask for category/price/gender if missing.
- If question is about "my orders" or "order status", always use the tool results (orders data).
- Never show another user's data.
- Use LKR currency for prices.
Output: plain text only.
`.trim();
}

router.post("/", verifyToken, async (req, res) => {
    try {
        const userDoc = await resolveOrCreateUserFromFirebase(req.user);
        const userId = userDoc._id;

        const message = String(req.body.message || "").trim();
        if (!message) return res.status(400).json({ message: "Message is required" });

        // Simple intent detection (works well)
        const lower = message.toLowerCase();
        const isOrderIntent = /\b(my orders|order status|where is my order|track order|orders)\b/i.test(message);

        let toolData = null;

        if (isOrderIntent) {
            const orders = await getMyOrders(userId, 6);
            toolData = { type: "orders", orders };
        } else {
            // product search using user message as query
            const products = await searchProducts({ q: message, limit: 6 });
            toolData = { type: "products", products };
        }

        // Send message + toolData to Llama
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 450,
            messages: [
                { role: "system", content: makeSystemPrompt() },
                { role: "user", content: message },
                {
                    role: "user",
                    content: `Here is the database result you must use:\n${JSON.stringify(toolData, null, 2)}`,
                },
            ],
        });

        const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't answer.";
        return res.json({ reply });
    } catch (err) {
        console.error("Groq chat error:", err);
        return res.status(500).json({ message: "Chat failed", error: err.message });
    }
});

module.exports = router;
