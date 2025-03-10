import Hero from "./components/Hero";
import InfoPanel from "./components/InfoPanel";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <main>
        <Hero />
        <InfoPanel />
      </main>
    </div>
  );
}
