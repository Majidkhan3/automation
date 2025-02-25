import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [browsers, setBrowsers] = useState<
    {
      id: string;
      url: string;
      isScrolling: boolean;
      ref: React.RefObject<HTMLIFrameElement>;
    }[]
  >([]);
  useEffect(() => {
    const scrollIntervals: { [key: string]: NodeJS.Timeout } = {};

    browsers.forEach((browser) => {
      if (browser.isScrolling && browser.ref.current) {
        const iframe = browser.ref.current;

        // Wait for the iframe to load
        iframe.onload = () => {
          let currentScroll = 0;
          scrollIntervals[browser.id] = setInterval(() => {
            try {
              if (iframe.contentDocument) {
                const iframeBody = iframe.contentDocument.body;
                const iframeHtml = iframe.contentDocument.documentElement;

                currentScroll += scrollSpeed;
                iframeBody.scrollTo({
                  top: currentScroll,
                  behavior: "smooth",
                });

                // Reset scroll if at bottom
                if (
                  currentScroll >=
                  iframeBody.scrollHeight - iframeBody.clientHeight
                ) {
                  currentScroll = 0;
                }
              }
            } catch (error) {
              console.error(`Scrolling error for ${browser.url}:`, error);
              // Optionally stop scrolling on error
              setBrowsers((prev) =>
                prev.map((b) =>
                  b.id === browser.id ? { ...b, isScrolling: false } : b
                )
              );
            }
          }, 50);
        };
      }
    });

    return () => {
      Object.values(scrollIntervals).forEach((interval) =>
        clearInterval(interval)
      );
    };
  }, [browsers, scrollSpeed]);
  const handleScroll = (id: string) => {
    setBrowsers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isScrolling: !b.isScrolling } : b))
    );
  };

  const handleOpenWebsite = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      const newBrowser = {
        id: Date.now().toString(),
        url,
        isScrolling: true,
        ref: React.createRef<HTMLIFrameElement>(),
      };
      setBrowsers((prev) => [...prev, newBrowser]);
      setUrl(""); // Clear input after successful open
    } catch (error) {
      console.error("Error opening website:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBrowser = async (id: string) => {
    try {
      await fetch("/api/driver/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setBrowsers((prev) => prev.filter((browser) => browser.id !== id));
    } catch (error) {
      console.error("Error closing browser:", error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left panel - Controls */}
      <div className="w-1/4 p-4 border-r">
        <h1 className="text-2xl mb-4">Website Automation</h1>
        <div className="flex flex-col gap-4">
          {/* Existing URL input and open button */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleOpenWebsite}
            disabled={loading || !url}
            className={`px-4 py-2 text-white rounded ${
              loading || !url ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Opening..." : "Open New Browser"}
          </button>

          {/* Scroll speed control */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scroll Speed (px/frame)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">Speed: {scrollSpeed}</span>
          </div>
        </div>
      </div>

      {/* Right panel - Browser previews */}
      <Card className="w-3/4 p-4 bg-gray-50 overflow-auto">
        <h2 className="text-xl mb-4">Active Browsers</h2>
        <div className="grid grid-cols-2 gap-4">
          {browsers.map((browser) => (
            <div
              key={browser.id}
              className="flex flex-col bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-2 bg-gray-100 flex justify-between items-center">
                <p className="truncate text-sm flex-1">{browser.url}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScroll(browser.id)}
                    className={`px-2 py-1 text-sm rounded ${
                      browser.isScrolling
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {browser.isScrolling ? "Stop Scroll" : "Start Scroll"}
                  </button>
                  <button
                    onClick={() => handleCloseBrowser(browser.id)}
                    className="px-2 py-1 text-sm text-red-500 hover:bg-red-50 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="relative w-full" style={{ height: "300px" }}>
                <iframe
                  ref={browser.ref}
                  src={browser.url}
                  className="absolute inset-0 w-full h-full border-none"
                  style={{ overflow: "scroll" }}
                  sandbox="allow-same-origin allow-scripts allow-popups"
                  title={`Preview of ${browser.url}`}
                  onLoad={() => {
                    console.log(
                      "Iframe loaded:",
                      browser.ref.current?.contentDocument
                    );
                  }}
                />
              </div>
            </div>
          ))}
          {browsers.length === 0 && (
            <p className="text-gray-500 text-center col-span-2">
              No active browsers
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Index;
