import React, { useState, ReactNode } from "react";
import { Components } from "react-markdown";

const MarkdownTableRenderer = () => {
  const [markdownInput, setMarkdownInput] = useState(
    `| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |\n| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |\n| Row 3, Col 1 | Row 3, Col 2 | Row 3, Col 3 |`
  );

  const parseMarkdownTable = (markdown: string) => {
    try {
      // Split the markdown by lines
      const lines = markdown.trim().split("\n");

      if (lines.length < 3) {
        return {
          headers: [],
          rows: [],
          error: "Not enough lines for a valid markdown table",
        };
      }

      // Parse the header row
      const headerLine = lines[0];
      const headers = headerLine
        .split("|")
        .filter((cell: string) => cell.trim() !== "")
        .map((cell: string) => cell.trim());

      // Skip the separator line

      // Parse the data rows
      const rows = lines.slice(2).map((line: string) => {
        return line
          .split("|")
          .filter((cell: string) => cell.trim() !== "")
          .map((cell: string) => cell.trim());
      });

      return { headers, rows, error: null };
    } catch (error) {
      return { headers: [], rows: [], error: "Failed to parse markdown table" };
    }
  };

  const { headers, rows, error } = parseMarkdownTable(markdownInput);

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Markdown Table Renderer</h1>

      <div className="flex flex-col">
        <label htmlFor="markdown-input" className="mb-2 font-medium">
          Markdown Table Input:
        </label>
        <textarea
          id="markdown-input"
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="border border-gray-300 rounded p-2 min-h-32 font-mono"
          placeholder="Enter markdown table here..."
        />
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-2">Rendered Table:</h2>

        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto border border-gray-300 rounded">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((header: string, index: number) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 text-sm text-gray-500"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// New component for use with ReactMarkdown
export const TableComponents: Components = {
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-8 border border-gray-300 rounded">
      <table className="min-w-full divide-y divide-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-100" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-200 bg-white" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
  th: ({ children, ...props }) => (
    <th
      className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-6 py-4 text-sm text-gray-500" {...props}>
      {children}
    </td>
  ),
};

export default MarkdownTableRenderer;
