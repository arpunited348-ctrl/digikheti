import { NextResponse } from 'next/server';
   import { geocodeVillage, getHourlyWeather } from '@/lib/krishimitra';
   
   export async function GET(request: Request) {
     try {
       const { searchParams } = new URL(request.url);
       const village = searchParams.get('village');
       const lat = searchParams.get('lat');
       const lon = searchParams.get('lon');
   
       let coords = { lat: lat ? Number(lat) : 0, lon: lon ? Number(lon) : 0, name: village || 'Unknown', state: '', country: '' };
       if (!coords.lat || !coords.lon) {
         if (!village) return NextResponse.json({ error: 'Provide village or lat/lon' }, { status: 400 });
         coords = await geocodeVillage(village);
       }
   
       const hourly = await getHourlyWeather(coords.lat, coords.lon);
       return NextResponse.json({ success: true, location: coords, hourly });
     } catch (error) {
       const msg = error instanceof Error ? error.message : 'Failed to fetch weather';
       return NextResponse.json({ success: false, error: msg }, { status: 500 });
     }
   }
