import Hero from "./components/Hero";
import InfoPanel from "./components/InfoPanel";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <Hero />
        <InfoPanel />
      </main>
    </div>
  );
}
