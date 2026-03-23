import Link from 'next/link';

const features = [
  { icon: '🌾', title: 'Crop Advisory', desc: 'AI-powered advice for your specific crop, soil, and growth stage.' },
  { icon: '🌦️', title: 'Weather Alerts', desc: 'Real-time 24-hour forecast for your exact village location.' },
  { icon: '🧪', title: 'Spray Guidance', desc: 'Know the best time to spray based on wind and rain risk.' },
  { icon: '🌍', title: 'Any Language', desc: 'Get answers in Hindi, Marathi, Punjabi, Telugu and more.' },
];

export default function HomePage() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <span className="text-2xl font-bold text-green-400">KrishiMitra AI</span>
          <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-green-300">by APR United</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-green-200">
          <Link href="/weather" className="hover:text-white transition-colors">Weather</Link>
          <Link href="/chat" className="rounded-xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-400 transition-colors">
            Ask AI Free
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <div className="mb-4 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm text-green-300">
          🌱 AI Farming Assistant for Indian Farmers
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
          Smart farming advice,<br />in your language.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-green-200">
          Ask any farming question — crop disease, pesticide timing, irrigation, soil health.
          Get practical answers based on real-time weather.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/chat" className="rounded-2xl bg-green-500 px-8 py-4 text-lg font-semibold text-white hover:bg-green-400 transition-colors">
            Ask a Question →
          </Link>
          <Link href="/weather" className="rounded-2xl border border-green-700 px-8 py-4 text-lg font-semibold text-green-200 hover:border-green-500 transition-colors">
            Check Weather
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="mb-3 text-4xl">{f.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-green-300">{f.title}</h3>
              <p className="text-sm leading-relaxed text-green-200/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="card p-6">
          <p className="mb-4 text-xs uppercase tracking-widest text-green-400">Example</p>
          <div className="space-y-3">
            <div className="ml-auto max-w-[80%] rounded-2xl bg-green-600 px-4 py-3 text-sm text-white">
              Can I spray pesticide on my cotton today?
            </div>
            <div className="max-w-[80%] rounded-2xl bg-green-900/80 px-4 py-3 text-sm text-green-100">
              🌧️ <strong>Not recommended today.</strong> Rain chance is 60% and wind is 15 km/h.
              Best window: <strong>tomorrow morning 6–9 AM</strong>.
            </div>
          </div>
          <Link href="/chat" className="mt-5 inline-block rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400 transition-colors">
            Try it yourself →
          </Link>
        </div>
      </section>

      <footer className="border-t border-green-900 py-8 text-center text-sm text-green-600">
        KrishiMitra AI · a product by{' '}
        <a href="https://aprunited.io" className="text-green-400 hover:underline">APR United</a> 🌱
      </footer>
    </main>
  );
}
