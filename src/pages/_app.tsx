import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../app/components/apolloClient';
import '../app/globals.css';
import Loading from '../app/components/Loading';  // Loading screen component
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext'; // Import your ThemeProvider

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const [loading, setLoading] = useState(true);

    // Run effect on page refresh to show the loading screen
    useEffect(() => {
        const handlePageLoad = () => {
            setLoading(false); // Set loading to false once the page is fully loaded
        };

        // Add an event listener for when the page fully loads
        if (document.readyState === 'complete') {
            // If the page is already loaded, skip the event listener
            setLoading(false);
        } else {
            window.addEventListener('load', handlePageLoad);
        }

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('load', handlePageLoad);
        };
    }, []);

    return (
        <ThemeProvider> {/* Wrap with ThemeProvider */}
            <ApolloProvider client={client}>
                {loading ? <Loading /> : <Component {...pageProps} />}  {/* Show loading screen while the page is loading */}
            </ApolloProvider>
        </ThemeProvider>
    );
};

export default MyApp;