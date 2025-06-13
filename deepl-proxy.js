const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // ←これ！

const app = express();
app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
    const { text, target_lang } = req.body;
    const apiKey = process.env.DEEPL_API_KEY;

    try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${encodeURIComponent(text)}&target_lang=${encodeURIComponent(target_lang)}`
        });

        const data = await response.json();
        if (data.translations && data.translations.length > 0) {
            res.json({ translation: data.translations[0].text });
        } else {
            res.status(500).json({ error: 'Translation failed', details: data });
        }
    } catch (err) {
        res.status(500).json({ error: 'Translation failed', details: err.toString() });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`DeepL proxy server running on port ${PORT}`);
}); 