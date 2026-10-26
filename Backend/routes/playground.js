const express = require('express');
const router = express.Router();
const axios = require('axios');

// Trying an alternative Piston mirror/endpoint to bypass the 404 block
const PISTON_API_URL = 'https://emkc.org/api/v2/execute';

router.post('/execute', async (req, res) => {
    try {
        const { language, version, files, stdin } = req.body;

        if (!language || !files) {
            return res.status(400).json({ error: 'Language and files are required' });
        }

        console.log(`Requesting execution for: ${language}`);

        const response = await axios.post(PISTON_API_URL, {
            language: language,
            version: version || '*',
            files: files,
            stdin: stdin || ''
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000 // 10 second timeout
        });

        res.json(response.data);
    } catch (error) {
        console.error('Piston API Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
        res.status(500).json({
            error: 'The code execution server is currently unavailable or blocking the request.',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;
