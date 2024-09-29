import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../app/components/apolloClient';
import '../app/globals.css';
import Loading from '../app/components/Loading'; // Loading screen component
import { ThemeProvider } from '../context/ThemeContext'; // Import ThemeProvider
import type { AppProps } from 'next/app';


const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handlePageLoad = () => {
            setLoading(false);
        };

        if (document.readyState === 'complete') {
            setLoading(false);
        } else {
            window.addEventListener('load', handlePageLoad);
        }

        return () => {
            window.removeEventListener('load', handlePageLoad);
        };
    }, []);

    return (
        <ThemeProvider> {/* Make sure ThemeProvider wraps the entire app */}
            <ApolloProvider client={client}>
                {loading ? <Loading /> : <Component {...pageProps} />}
            </ApolloProvider>
        </ThemeProvider>
    );
};

export default MyApp;