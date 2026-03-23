'use client';
   
   import { useState } from 'react';
   import Link from 'next/link';
   
   type Hour = { time: string; temperature: number; humidity: number; windSpeed: number; rainProbability: number; summary: string };
   
   function risk(rain: number, wind: number) {
     if (rain >= 0.5 || wind >= 20) return { label: '🔴 High Risk', cls: 'text-red-400' };
     if (rain >= 0.25 || wind >= 12) return { label: '🟡 Medium Risk', cls: 'text-yellow-400' };
     return { label: '🟢 Safe', cls: 'text-green-400' };
   }
   
   export default function WeatherPage() {
     const [village, setVillage] = useState('');
     const [loading, setLoading] = useState(false);
     const [data, setData] = useState<{ location: { name: string; state: string }; hourly: Hour[] } | null>(null);
     const [error, setError] = useState('');
   
     async function fetchWeather() {
       if (!village.trim()) return;
       setLoading(true); setError(''); setData(null);
       try {
         const res = await fetch(`/api/weather?village=${encodeURIComponent(village)}`);
         const json = await res.json();
         if (!json.success) throw new Error(json.error || 'Failed');
         setData(json);
       } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
       finally { setLoading(false); }
     }
   
     return (
       <main className="mx-auto max-w-4xl px-4 py-8">
         <Link href="/" className="text-green-400 text-sm hover:underline">← Home</Link>
         <h1 className="mt-1 mb-2 text-3xl font-bold">Weather for Farmers</h1>
         <p className="mb-6 text-sm text-green-400">24-hour forecast with spray risk</p>
         <div className="mb-6 flex gap-3">
           <input value={village} onChange={(e) => setVillage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchWeather()} placeholder="Enter village or city (e.g. Nagpur, Maharashtra)" className="flex-1 rounded-xl border border-green-800 bg-green-950 px-4 py-3 text-sm outline-none focus:border-green-500" />
           <button onClick={fetchWeather} disabled={loading || !village.trim()} className="rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-50 transition-colors">{loading ? '…' : 'Check'}</button>
         </div>
         {error && <div className="mb-4 rounded-xl border border-red-700/30 bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</div>}
         {data && (
           <>
             <h2 className="mb-4 text-xl font-semibold text-green-300">📍 {data.location.name}{data.location.state ? `, ${data.location.state}` : ''}</h2>
             <div className="space-y-3">
               {data.hourly.map((h, i) => {
                 const r = risk(h.rainProbability, h.windSpeed);
                 return (
                   <div key={i} className="card p-4">
                     <div className="flex flex-wrap items-center justify-between gap-3">
                       <div>
                         <p className="font-semibold text-white text-sm">{h.time}</p>
                         <p className="text-xs capitalize text-green-500">{h.summary}</p>
                       </div>
                       <div className="flex flex-wrap gap-4 text-sm">
                         <span>🌡️ {Math.round(h.temperature)}°C</span>
                         <span className="text-blue-300">💧 {h.humidity}%</span>
                         <span className="text-cyan-300">💨 {Math.round(h.windSpeed)} km/h</span>
                         <span className="text-blue-400">🌧️ {Math.round(h.rainProbability * 100)}%</span>
                         <span className={`font-semibold ${r.cls}`}>{r.label}</span>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
             <div className="mt-6 text-center">
               <Link href="/chat" className="inline-block rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400 transition-colors">Ask AI about today →</Link>
             </div>
           </>
         )}
         {!loading && !data && !error && <div className="py-16 text-center text-green-700"><div className="mb-3 text-5xl">🌦️</div><p>Enter your village above to see the forecast.</p></div>}
       </main>
     );
   }
