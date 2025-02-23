import Link from "next/link";

export default function HuggingFaceDemo() {
  return (
    <div className="min-h-screen w-full bg-black pt-16 overflow-x-hidden">
      <iframe
        src="https://justintchou-hardware-accelerators-demo.hf.space"
        className="w-full h-[1200px] border-none"
        title="Hugging Face Stable Diffusion Demo"
      />
    </div>
  );
}
