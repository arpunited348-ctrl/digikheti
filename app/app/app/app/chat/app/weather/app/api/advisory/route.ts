import { NextResponse } from 'next/server';
   import { geocodeVillage, getHourlyWeather, generateAdvisory, getSprayRisk, getBestActionWindow } from '@/lib/krishimitra';
   
   export async function POST(request: Request) {
     try {
       const { question, crop, language, village, soilType, growthStage, lat, lon } = await request.json();
       if (!question || !crop) return NextResponse.json({ error: 'question and crop are required' }, { status: 400 });
   
       let coords = { lat: lat ? Number(lat) : 0, lon: lon ? Number(lon) : 0, name: village || 'Unknown', state: '', country: '' };
       if (!coords.lat || !coords.lon) {
         if (!village) return NextResponse.json({ error: 'Provide village or lat/lon' }, { status: 400 });
         coords = await geocodeVillage(village);
       }
   
       const hourlyWeather = await getHourlyWeather(coords.lat, coords.lon);
       const riskLevel = getSprayRisk(hourlyWeather[0]);
       const bestWindow = getBestActionWindow(hourlyWeather);
       const advisory = await generateAdvisory({ question, crop, language, village: coords.name, soilType, growthStage, hourlyWeather, riskLevel, bestWindow });
   
       return NextResponse.json({ success: true, location: coords, advisory, hourly_weather: hourlyWeather });
     } catch (error) {
       const msg = error instanceof Error ? error.message : 'Failed to get advisory';
       return NextResponse.json({ success: false, error: msg }, { status: 500 });
     }
   }
