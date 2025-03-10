"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Github } from "lucide-react";

const TECHNICAL_REPORT_URL =
  "https://github.com/nakschou/artifact-directory-template/blob/main/report.pdf";
const GITHUB_REPO_URL = "https://github.com/ninjakaib/hardware-accelerators";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-violet-900 dark:text-violet-600"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.15 + path.id * 0.04}
            initial={{ pathLength: 0.3, opacity: 0.7 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.3, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl mb-4 text-gray-600 dark:text-gray-400"
        >
          the l-mul algorithm
        </motion.p>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-center leading-tight mb-8"
        >
          floating point multiplication,
          <br />
          <span className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-glow">
            faster
          </span>
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2 hover:bg-neutral-700"
            onClick={() => window.open(TECHNICAL_REPORT_URL, "_blank")}
          >
            <FileText className="w-5 h-5" />
            Read Technical Report
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 text-black dark:text-white bg-white dark:bg-transparent hover:bg-white/80 dark:hover:bg-white/10"
            onClick={() => window.open(GITHUB_REPO_URL, "_blank")}
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
