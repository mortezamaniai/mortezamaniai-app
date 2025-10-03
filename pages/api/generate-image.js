import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body || {};
  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'OpenAI API key not configured' });
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt, n: 1, size: '1024x1024' })
    });

    const data = await response.json();
    if (data.error) {
      res.status(502).json({ error: 'OpenAI error', details: data.error });
      return;
    }

    const imageUrl = data.data && data.data[0] && data.data[0].url;
    if (!imageUrl) {
      res.status(502).json({ error: 'No image returned by OpenAI' });
      return;
    }

    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}