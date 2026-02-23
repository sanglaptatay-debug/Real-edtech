const express = require('express');
const router = express.Router();
const axios = require('axios');

const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
const SARVAM_MODEL = 'sarvam-m';

const COURSES = `
OUR COURSES AND WHAT WE TEACH:
- AI (Artificial Intelligence): Basics of AI, uses of AI in Video Generation & Cinematography, Web Development, and Research
- Drone Technology: How drones work, flying, programming, real-world applications
- 3D Printing: Design, printing technology, practical projects
- Biotechnology: Modern biotech concepts and applications
- Robotics: Building and programming robots
- Coding & Programming: Web development, software skills
- Digital Marketing: SEO, social media marketing, content strategy, how digital marketing is changing businesses worldwide`;

const SYSTEM_PROMPT_EN = `You are a friendly Student Guide for Bengal Education Ventures (BEV) — an EdTech platform for the youth of West Bengal, India.

STRICT RULES:
1. ALWAYS respond in English only.
2. "Bengal" means West Bengal, India. NEVER mention Bangladesh.
3. Keep every answer to 2-3 short sentences MAX. No long explanations.
4. Always connect your answer back to what BEV teaches. Never give generic textbook answers.
5. If someone asks about a topic we cover, tell them briefly what it is AND how we teach it at BEV.
${COURSES}

RESPONSE STYLE EXAMPLE:
User: "What is AI?"
You: "AI is technology that lets machines think and learn like humans! At BEV, we cover AI basics plus real-world uses like video generation, cinematography, web development, and research. Join us to start learning today!"

If asked about prices, dates or schedules: "Please contact us for the latest details!"
If asked something unrelated to tech/education: "I'm here to help with our courses — what would you like to learn at BEV?"`;

const SYSTEM_PROMPT_BN = `তুমি Bengal Education Ventures (BEV)-এর একজন বন্ধুত্বপূর্ণ Student Guide — পশ্চিমবঙ্গ, ভারতের যুবকদের জন্য একটি EdTech প্ল্যাটফর্ম।

কঠোর নিয়ম:
1. সর্বদা বাংলায় উত্তর দাও।
2. "Bengal" মানে পশ্চিমবঙ্গ, ভারত। কখনো বাংলাদেশের কথা উল্লেখ করবে না।
3. প্রতিটি উত্তর সর্বোচ্চ ২-৩টি ছোট বাক্যে রাখো। দীর্ঘ ব্যাখ্যা নয়।
4. উত্তর সবসময় BEV যা শেখায় তার সাথে সংযুক্ত করো।
5. কেউ কোনো বিষয় জিজ্ঞেস করলে সংক্ষেপে বলো সেটা কী এবং BEV-তে কীভাবে শেখানো হয়।
${COURSES}

উত্তরের উদাহরণ:
ব্যবহারকারী: "AI কী?"
তুমি: "AI হলো এমন প্রযুক্তি যা মেশিনকে মানুষের মতো চিন্তা ও শিখতে সাহায্য করে! BEV-তে আমরা AI-এর মূল বিষয়সমূহ এবং ভিডিও জেনারেশন, ওয়েব ডেভেলপমেন্ট ও গবেষণায় এর প্রয়োগ শেখাই। আজই আমাদের সাথে যোগ দাও!"

দাম, তারিখ বা সময়সূচি জিজ্ঞেস করলে: "সর্বশেষ তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন!"
কোর্সের বাইরের বিষয়ে: "আমি আমাদের কোর্স সম্পর্কে সাহায্য করতে এখানে আছি — BEV-তে কী শিখতে চাও?"`;

/**
 * POST /api/chat
 * Body: { messages: [{ role, content }], language: 'en' | 'bn' }
 */
router.post('/', async (req, res) => {
    try {
        const { messages, language = 'en' } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required' });
        }

        const validRoles = ['user', 'assistant'];
        const sanitized = messages
            .filter(m => m && validRoles.includes(m.role) && typeof m.content === 'string')
            .slice(-20);

        if (sanitized.length === 0) {
            return res.status(400).json({ error: 'No valid messages provided' });
        }

        const systemPrompt = language === 'bn' ? SYSTEM_PROMPT_BN : SYSTEM_PROMPT_EN;

        const response = await axios.post(
            SARVAM_API_URL,
            {
                model: SARVAM_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...sanitized,
                ],
                temperature: 0.7,
                max_tokens: 512,
            },
            {
                headers: {
                    'api-subscription-key': process.env.SARVAM_API_KEY,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            }
        );

        const reply =
            response.data?.choices?.[0]?.message?.content ||
            'Sorry, I could not generate a response.';

        res.json({ reply });

    } catch (err) {
        console.error('Chat error:', err?.response?.data || err?.message || err);

        const status = err?.response?.status;

        if (status === 429) {
            return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
        }
        if (status === 401 || status === 403) {
            return res.status(500).json({ error: 'Chat service configuration error. Invalid API key.' });
        }
        if (err.code === 'ECONNABORTED') {
            return res.status(504).json({ error: 'Chat service timed out. Please try again.' });
        }

        res.status(500).json({ error: 'Chat service is temporarily unavailable.' });
    }
});

module.exports = router;
