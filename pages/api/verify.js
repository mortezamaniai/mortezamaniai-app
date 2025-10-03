import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { Authority: authority, Status: status } = req.query;
  if (status !== 'OK') return res.status(400).send('پرداخت لغو شد');

  try {
    const response = await fetch('https://sandbox.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        authority,
        amount: 10000
      })
    });

    const data = await response.json();
    if (data.data && data.data.code === 100) {
      res.status(200).send('پرداخت موفقیت‌آمیز بود');
    } else {
      res.status(400).send('تأیید پرداخت ناموفق بود');
    }
  } catch (err) {
    res.status(500).send('خطا در تأیید پرداخت');
  }
}