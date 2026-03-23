import OpenAI from 'openai';
   
   export function getSprayRisk(hour: { rainProbability: number; windSpeed: number }) {
     const rain = Number(hour?.rainProbability || 0);
     const wind = Number(hour?.windSpeed || 0);
     if (rain >= 0.5 || wind >= 20) return 'High';
     if (rain >= 0.25 || wind >= 12) return 'Medium';
     return 'Low';
   }
   
   export function getBestActionWindow(hourly: { time: string; rainProbability: number; windSpeed: number }[]) {
     return hourly
       .filter((h) => Number(h.rainProbability) < 0.25 && Number(h.windSpeed) < 12)
       .slice(0, 3)
       .map((h) => h.time);
   }
   
   export async function geocodeVillage(query: string) {
     const apiKey = process.env.OPENWEATHER_API_KEY;
     const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`;
     const res = await fetch(url);
     if (!res.ok) throw new Error('Failed to geocode location');
     const data = await res.json();
     if (!data.length) throw new Error('Location not found. Try a nearby city name.');
     return { name: data[0].name, state: data[0].state || '', country: data[0].country || '', lat: data[0].lat, lon: data[0].lon };
   }
   
   export async function getHourlyWeather(lat: number, lon: number) {
     const apiKey = process.env.OPENWEATHER_API_KEY;
     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
     const res = await fetch(url);
     if (!res.ok) throw new Error('Failed to fetch weather');
     const data = await res.json();
     return data.list.slice(0, 8).map((item: {
       dt_txt: string; main: { temp: number; humidity: number };
       wind: { speed: number }; pop: number; clouds: { all: number };
       weather: { description: string }[];
     }) => ({
       time: item.dt_txt,
       temperature: item.main.temp,
       humidity: item.main.humidity,
       windSpeed: item.wind.speed * 3.6,
       rainProbability: item.pop,
       cloudiness: item.clouds.all,
       summary: item.weather?.[0]?.description || 'N/A'
     }));
   }
   
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   
   export async function generateAdvisory(input: {
     question: string; crop: string; language?: string; village?: string;
     soilType?: string; growthStage?: string;
     hourlyWeather: object[]; riskLevel: string; bestWindow: string[];
   }) {
     const prompt = `
   You are KrishiMitra AI, an agriculture advisor for Indian farmers.
   Rules:
   - Give practical farming advice in simple ${input.language || 'English'}.
   - Consider weather before recommending spray, irrigation, or fertilizer.
   - For emergencies, tell the farmer to contact a local agri officer.
   - Keep answers short, clear, and action-oriented.
   
   Farmer context:
   - Village: ${input.village || 'Unknown'}
   - Crop: ${input.crop}
   - Soil type: ${input.soilType || 'Unknown'}
   - Growth stage: ${input.growthStage || 'Unknown'}
   
   Question: ${input.question}
   Next 24h weather: ${JSON.stringify(input.hourlyWeather)}
   Spray risk: ${input.riskLevel}
   Best action windows: ${input.bestWindow.length ? input.bestWindow.join(', ') : 'None detected'}
   
   Return JSON only:
   {
     "answer": "...",
     "what_to_do_now": ["...", "..."],
     "weather_warning": "...",
     "best_time_to_act": "...",
     "risk_level": "Low|Medium|High",
     "disclaimer": "..."
   }`;
   
     const response = await openai.chat.completions.create({
       model: 'gpt-4o-mini',
       response_format: { type: 'json_object' },
       messages: [
         { role: 'system', content: 'You are a careful agriculture assistant for Indian farmers. Output valid JSON only.' },
         { role: 'user', content: prompt }
       ],
       temperature: 0.3
     });
   
     const content = response.choices?.[0]?.message?.content;
     if (!content) throw new Error('AI returned empty response');
     return JSON.parse(content);
   }
