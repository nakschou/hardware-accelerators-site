"use client";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

export default function InfoPanel() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContent() {
      try {
        setIsLoading(true);
        const response = await fetch("/content/technical-report.md");
        if (!response.ok) {
          throw new Error("Failed to load content");
        }
        const text = await response.text();
        setContent(text);
      } catch (err: any) {
        setError(err?.message || "An error occurred while loading the content");
        console.error("Error loading markdown:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
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
                img: ({ node, ...props }) => (
                  <img {...props} className="w-full rounded-lg" />
                ),
                a: ({ node, ...props }) => (
                  <a {...props} className="text-blue-600 hover:text-blue-800" />
                ),
                h1: ({ node, ...props }) => (
                  <h1
                    {...props}
                    className="text-4xl font-bold mb-4 text-black"
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    {...props}
                    className="text-3xl font-bold mt-8 mb-4 text-black"
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    {...props}
                    className="text-2xl font-bold mt-6 mb-3 text-black"
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h3
                    {...props}
                    className="text-2xl font-bold mt-6 mb-3 text-black"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p
                    {...props}
                    className="mb-4 text-gray-800 leading-relaxed"
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-6 mb-4 space-y-2" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="text-gray-800" />
                ),
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
