"use client";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function InfoPanel() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/hardware-accelerators-site/content/technical-report.md",
          {
            headers: {
              "Content-Type": "text/plain",
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load content: ${response.status} ${response.statusText}`
          );
        }

        const text = await response.text();
        setContent(text);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred while loading the content";
        setError(errorMessage);
        console.error("Error loading markdown:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {isLoading && (
          <div className="text-center py-8">
            <p>Loading content...</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center py-8">
            <p>Error loading content: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <article className="prose prose-lg prose-gray mx-auto">
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => {
                  // Parse size from alt text if present (e.g. [small] or [large])
                  const sizeMatch = alt?.match(/\[(small|medium|large)\]/i);
                  const size = (sizeMatch?.[1]?.toLowerCase() || "medium") as
                    | "small"
                    | "medium"
                    | "large";
                  const cleanAlt = alt
                    ?.replace(/\[(small|medium|large)\]/i, "")
                    .trim();

                  const aspectRatios = {
                    small: "aspect-[4/3] md:aspect-[3/2]",
                    medium: "aspect-[16/9] md:aspect-[2/1]",
                    large: "aspect-[16/9] md:aspect-[21/9]",
                  } as const;

                  return (
                    <div className="my-8">
                      <div className={`relative w-full ${aspectRatios[size]}`}>
                        <Image
                          src={src || ""}
                          alt={cleanAlt || ""}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          className="rounded-lg object-contain"
                          priority
                        />
                      </div>
                      {cleanAlt && (
                        <p className="mt-2 text-center text-sm text-gray-600 italic">
                          {cleanAlt}
                        </p>
                      )}
                    </div>
                  );
                },
                a: ({ children, href }) => (
                  <a href={href} className="text-blue-600 hover:text-blue-800">
                    {children}
                  </a>
                ),
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mb-4 text-black">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mt-8 mb-4 text-black">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-bold mt-6 mb-3 text-black">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-2xl font-bold mt-6 mb-3 text-black">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-gray-800 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-800">{children}</li>
                ),
                sup: ({ children }) => (
                  <sup className="text-sm">
                    <a
                      href={`#citation-${children}`}
                      className="text-blue-600 hover:text-blue-800 no-underline"
                    >
                      {children}
                    </a>
                  </sup>
                ),
                div: ({ children, className }) => {
                  if (className === "footnotes") {
                    return (
                      <div className="mt-16 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">References</h2>
                        {children}
                      </div>
                    );
                  }
                  return <div>{children}</div>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </section>
  );
}
