const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert educational assistant for Bengal Education Ventures — a live, technical skill-based EdTech platform for the youth of Bengal.

Your role is to guide students and visitors by answering questions about:
- Our course offerings: AI & Machine Learning, Drone Technology, 3D Printing, Biotechnology, Robotics, Coding & Programming, and other emerging technology areas
- Course enrollment, schedules, and live sessions
- The learning experience and what students can expect
- Career opportunities after learning these skills
- General questions about technology topics we teach

Keep your answers:
- Friendly, encouraging, and enthusiastic about technology education  
- Concise (2–4 sentences max unless detail is truly needed)
- Focused on Bengal Education Ventures whenever relevant
- In the same language the user writes in (Bengali or English)

If asked something completely unrelated to education or technology, politely redirect: "I'm here to help with questions about our platform and courses — how can I help you learn today?"

Do NOT make up specific course prices, dates, or schedules — instead say "Please contact us for the latest schedule/pricing."`;

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
