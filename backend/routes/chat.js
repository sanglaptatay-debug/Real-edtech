const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a friendly course guide for Bengal Education Ventures (BEV) — an EdTech platform for the youth of West Bengal, India.

STRICT RULES:
1. ALWAYS respond in English only. Never use Bengali or any other language.
2. "Bengal" means West Bengal, India. NEVER mention Bangladesh.
3. Keep every answer to 2–3 short sentences MAX. No long explanations.
4. Always connect your answer back to what BEV teaches. Never give generic textbook answers.
5. If someone asks about a topic we cover, tell them briefly what it is AND how we teach it at BEV.

OUR COURSES AND WHAT WE TEACH:
- AI (Artificial Intelligence): Basics of AI, uses of AI in Video Generation & Cinematography, Web Development, and Research
- Drone Technology: How drones work, flying, programming, real-world applications
- 3D Printing: Design, printing technology, practical projects
- Biotechnology: Modern biotech concepts and applications
- Robotics: Building and programming robots
- Coding & Programming: Web development, software skills
- Digital Marketing: SEO, social media marketing, content strategy, how digital marketing is changing businesses worldwide

RESPONSE STYLE EXAMPLE:
User: "What is AI?"
You: "AI is technology that lets machines think and learn like humans! At BEV, we cover AI basics plus real-world uses like video generation, cinematography, web development, and research. Join us to start learning today!"

If asked about prices, dates or schedules: "Please contact us for the latest details!"
If asked something unrelated to tech/education: "I'm here to help with our courses — what would you like to learn at BEV?"`;


/**
 * POST /api/chat
 * Body: { messages: [{ role, content }] }
 *
 * Maintains conversation context by accepting the full message history.
 * Rate-limited by Groq (30 req/min on free tier).
 */
router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required' });
        }

        // Validate each message
        const validRoles = ['user', 'assistant'];
        const sanitized = messages
            .filter(m => m && validRoles.includes(m.role) && typeof m.content === 'string')
            .slice(-20); // Keep last 20 messages to stay within token limits

        if (sanitized.length === 0) {
            return res.status(400).json({ error: 'No valid messages provided' });
        }

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',   // Fast, free, smart
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...sanitized,
            ],
            temperature: 0.7,
            max_tokens: 512,
        });

        const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        res.json({ reply });

    } catch (err) {
        console.error('❌ Chat error:', err?.message || err);

        if (err?.status === 429) {
            return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
        }
        if (err?.status === 401) {
            return res.status(500).json({ error: 'Chat service configuration error.' });
        }

        res.status(500).json({ error: 'Chat service is temporarily unavailable.' });
    }
});

module.exports = router;
