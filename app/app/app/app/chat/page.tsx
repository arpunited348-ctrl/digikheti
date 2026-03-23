'use client';
   
   import { useState, useRef, useEffect } from 'react';
   import Link from 'next/link';
   
   type Message = { role: 'user' | 'assistant'; content: string };
   type Advisory = {
     answer: string;
     what_to_do_now: string[];
     weather_warning: string;
     best_time_to_act: string;
     risk_level: 'Low' | 'Medium' | 'High';
     disclaimer: string;
   };
   
   const RISK = {
     Low: 'bg-green-500/20 text-green-300 border-green-500/30',
     Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
     High: 'bg-red-500/20 text-red-300 border-red-500/30'
   };
   
   export default function ChatPage() {
     const [messages, setMessages] = useState<Message[]>([]);
     const [input, setInput] = useState('');
     const [crop, setCrop] = useState('');
     const [village, setVillage] = useState('');
     const [language, setLanguage] = useState('English');
     const [loading, setLoading] = useState(false);
     const [advisory, setAdvisory] = useState<Advisory | null>(null);
     const bottomRef = useRef<HTMLDivElement>(null);
   
     useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
   
     async function send() {
       if (!input.trim() || loading) return;
       if (!crop.trim() || !village.trim()) { alert('Please enter your crop and village first.'); return; }
       const question = input.trim();
       setInput('');
       setMessages((p) => [...p, { role: 'user', content: question }]);
       setLoading(true);
       setAdvisory(null);
       try {
         const res = await fetch('/api/advisory', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ question, crop, village, language })
         });
         const data = await res.json();
         if (!data.success) throw new Error(data.error || 'Failed');
         setAdvisory(data.advisory);
         setMessages((p) => [...p, { role: 'assistant', content: data.advisory.answer }]);
       } catch {
         setMessages((p) => [...p, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
       } finally { setLoading(false); }
     }
   
     return (
       <main className="mx-auto max-w-3xl px-4 py-8">
         <Link href="/" className="text-green-400 text-sm hover:underline">← Home</Link>
         <h1 className="mt-1 mb-2 text-3xl font-bold">Ask KrishiMitra AI</h1>
         <p className="mb-5 text-sm text-green-400">Farming advice based on real-time weather</p>
         <div className="mb-5 grid gap-3 sm:grid-cols-3">
           <div>
             <label className="mb-1 block text-xs text-green-400">Crop *</label>
             <input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="Cotton, Wheat..." className="w-full rounded-xl border border-green-800 bg-green-950 px-3 py-2 text-sm outline-none focus:border-green-500" />
           </div>
           <div>
             <label className="mb-1 block text-xs text-green-400">Village *</label>
             <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Nagpur, Maharashtra..." className="w-full rounded-xl border border-green-800 bg-green-950 px-3 py-2 text-sm outline-none focus:border-green-500" />
           </div>
           <div>
             <label className="mb-1 block text-xs text-green-400">Language</label>
             <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-green-800 bg-green-950 px-3 py-2 text-sm outline-none focus:border-green-500">
               {['English','Hindi','Marathi','Punjabi','Telugu','Tamil','Kannada','Gujarati'].map((l) => <option key={l}>{l}</option>)}
             </select>
           </div>
         </div>
         <div className="card mb-4 min-h-[280px] p-4">
           {messages.length === 0 && <p className="py-10 text-center text-sm text-green-700">Enter crop + village above, then ask your question. 🌾</p>}
           <div className="space-y-3">
             {messages.map((m, i) => (
               <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                 <span className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-green-900/80 text-green-100'}`}>{m.content}</span>
               </div>
             ))}
             {loading && <div className="text-left"><span className="inline-block rounded-2xl bg-green-900/80 px-4 py-3 text-sm text-green-400">🌱 Checking weather and generating advice…</span></div>}
             <div ref={bottomRef} />
           </div>
         </div>
         {advisory && (
           <div className="card mb-4 space-y-4 p-5">
             <div className="flex items-center gap-3">
               <span className="text-sm font-semibold text-green-300">Advisory Details</span>
               <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${RISK[advisory.risk_level]}`}>{advisory.risk_level} Risk</span>
             </div>
             {advisory.what_to_do_now?.length > 0 && (
               <ul className="space-y-1">{advisory.what_to_do_now.map((a, i) => <li key={i} className="flex gap-2 text-sm text-green-200"><span className="text-green-400">✓</span>{a}</li>)}</ul>
             )}
             {advisory.weather_warning && <div className="rounded-xl border border-yellow-700/30 bg-yellow-900/30 px-4 py-3"><p className="mb-1 text-xs text-yellow-400">⚠️ Weather Warning</p><p className="text-sm text-yellow-200">{advisory.weather_warning}</p></div>}
             {advisory.best_time_to_act && <div className="rounded-xl border border-green-700/30 bg-green-900/40 px-4 py-3"><p className="mb-1 text-xs text-green-400">⏰ Best Time to Act</p><p className="text-sm text-green-200">{advisory.best_time_to_act}</p></div>}
             {advisory.disclaimer && <p className="text-xs italic text-green-700">{advisory.disclaimer}</p>}
           </div>
         )}
         <div className="flex gap-3">
           <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Ask your farming question..." className="flex-1 rounded-xl border border-green-800 bg-green-950 px-4 py-3 text-sm outline-none focus:border-green-500" />
           <button onClick={send} disabled={loading || !input.trim()} className="rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400 transition-colors disabled:opacity-50">{loading ? '…' : 'Ask'}</button>
         </div>
       </main>
     );
   }
