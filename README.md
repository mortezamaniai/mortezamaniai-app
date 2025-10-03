# MortezaManiai — (https://mortezamaniai-app.vercel.app/)

این ریپو شامل اپ Next.js است که به‌عنوان PWA نصب می‌شود و از OpenAI برای تولید تصویر و زرین‌پال برای پرداخت اشتراک استفاده می‌کند.

## نصب و اجرا
1. کلید OpenAI و کد مرچنت زرین‌پال را در `.env` قرار بدهید.
2. `npm install`
3. `npm run dev`

## متغیرهای محیطی
- OPENAI_API_KEY
- ZARINPAL_MERCHANT_ID

## پرداخت
- مسیر `/api/payment` تراکنش ایجاد می‌کند و کاربر را به درگاه می‌برد.
- مسیر `/api/verify` نتیجه را از زرین‌پال بررسی می‌کند.
