import { useState, useEffect } from 'react';

export default function Home(){
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [usedFreeToday, setUsedFreeToday] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const key = 'mm_free_image_date';
    const stored = localStorage.getItem(key);
    const today = new Date().toISOString().slice(0,10);
    if(stored === today){ setUsedFreeToday(true); }
  },[]);

  const generate = async ()=>{
    if(usedFreeToday){ alert('نسخه رایگان امروز استفاده شده — برای بیشتر از اشتراک استفاده کن'); return; }
    if(!prompt.trim()){ alert('لطفاً یک بیت شعر یا جمله بنویس'); return; }
    setLoading(true);
    try{
      const resp = await fetch('/api/generate-image', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt }) });
      const data = await resp.json();
      if(resp.ok){ setImageUrl(data.imageUrl); const today = new Date().toISOString().slice(0,10); localStorage.setItem('mm_free_image_date', today); setUsedFreeToday(true); }
      else{ alert(data.error || 'خطا در تولید'); }
    }catch(err){ alert('خطا در اتصال'); }
    setLoading(false);
  };

  const pay = async ()=>{
    try{
      const resp = await fetch('/api/payment', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ amount: 10000, description: 'خرید اشتراک پریمیوم', email: 'test@test.com', phone: '09120000000' })
      });
      const data = await resp.json();
      if(resp.ok && data.url){ window.location.href = data.url; }
      else{ alert('خطا در ایجاد تراکنش'); }
    }catch(err){ alert('خطا در اتصال به درگاه'); }
  };

  return (
    <div>
      <header>
        <h1>MortezaManiai</h1>
        <p>ابزار شعر → تصویر هنری</p>
      </header>
      <main>
        <textarea placeholder="یک بیت شعر یا جمله کوتاه بنویسید..." value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
        <div style={{display:'flex',gap:12,marginTop:12}}>
          <button onClick={generate} disabled={loading}>{loading ? 'در حال تولید...' : 'تولید تصویر رایگان (یکبار در روز)'}</button>
          <button onClick={pay}>خرید اشتراک</button>
        </div>
        {imageUrl && <img className="generated" src={imageUrl} alt="generated" />}
      </main>
      <footer>
        <p>&copy; 2025 MortezaManiai</p>
      </footer>
    </div>
  );
}