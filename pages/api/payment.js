import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, description, email, phone } = req.body;
  try {
    const response = await fetch('https://sandbox.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount,
        callback_url: 'https://your-site.com/api/verify',
        description,
        metadata: { email, mobile: phone }
      })
    });

    const data = await response.json();
    if (data.data && data.data.code === 100) {
      res.status(200).json({ url: `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}` });
    } else {
      res.status(400).json({ error: data.errors });
    }
  } catch (err) {
    res.status(500).json({ error: 'خطا در اتصال به زرین‌پال' });
  }
}