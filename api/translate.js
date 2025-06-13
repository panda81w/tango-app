// api/translate.js

export default async function handler(req, res) {
    // --- CORSヘッダを必ず返す！ ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { text, target_lang } = req.body;
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
        res.status(500).json({ error: 'DeepL API Key is not set.' });
        return;
    }

    try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text,
                target_lang,
            }),
        });

        const data = await response.json();
        res.status(200).json({ translation: data.translations?.[0]?.text || '' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}