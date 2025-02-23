"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activePage, setActivePage] = useState("home");
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const getPageFromPath = useCallback((path: string) => {
    if (path === "/") return "home";
    if (path === "/demo") return "demo";
    if (path === "/team") return "team";
    return path.slice(1);
  }, []);

  const updateBubblePosition = useCallback(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const activeButton = navElement.querySelector(
      `button[data-page="${activePage}"]`
    );
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const navRect = navElement.getBoundingClientRect();
      setBubbleStyle({
        left: rect.left - navRect.left,
        width: rect.width,
      });
    }
  }, [activePage]);

  useEffect(() => {
    const page = getPageFromPath(pathname);
    setActivePage(page);
  }, [pathname, getPageFromPath]);

  useEffect(() => {
    updateBubblePosition();
    const timeoutId = setTimeout(updateBubblePosition, 50);
    window.addEventListener("resize", updateBubblePosition);

    return () => {
      window.removeEventListener("resize", updateBubblePosition);
      clearTimeout(timeoutId);
    };
  }, [activePage, updateBubblePosition]);

  const handleNavigation = (page: string) => {
    setActivePage(page);
    const path = page === "home" ? "/" : `/${page}`;
    router.push(path);
  };

  const pages = ["home", "demo", "team"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-zinc-900/90 border-b border-zinc-800">
      <nav ref={navRef} className="relative flex items-center">
        <div
          className="absolute h-[2px] bg-violet-500 transition-all duration-200 ease-in-out"
          style={{
            left: `${bubbleStyle.left}px`,
            width: `${bubbleStyle.width}px`,
            bottom: "-4px",
          }}
        />
        {pages.map((page) => (
          <button
            key={page}
            data-page={page}
            onClick={() => handleNavigation(page)}
            className={`relative px-3 py-0.5 sm:py-1 text-sm sm:text-base font-medium transition-colors min-w-[4.5rem] text-center ${
              activePage === page
                ? "text-violet-400"
                : "text-zinc-400 hover:text-violet-300"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </header>
  );
}
