import { useState, useEffect } from "react";

export const useEmscripten = () => {
    const [emscripten, setEmscripten] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        const loadEmscripten = async () => {
            if (typeof window !== "undefined") {
                try {
                    const script = document.createElement("script");
                    script.src = "https://cdn.jsdelivr.net/npm/emscripten-wasm-loader@3.0.3/dist/cjs/index.js";
                    script.async = true;
                    script.onload = async () => {
                        const emscriptenInstance = await (window as any).loadEmscript();
                        console.log("Emscripten loaded");
                        setEmscripten(emscriptenInstance);
                        setIsLoading(false);  // Emscripten is now fully loaded
                    };
                    document.body.appendChild(script);
                } catch (error) {
                    console.error("Failed to load Pyodide:", error);
                    setIsLoading(false);  // In case of error, stop loading
                }
            }
        };

        loadEmscripten();
    }, []);

    return { emscripten, isLoading };  // Return both Emscripten and loading state
};