"use client";

import React, { useContext } from 'react';
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import HomeButton from '../components/HomeButton';
import { ThemeContext } from '../../context/ThemeContext';

const GET_MAIN_LEADERBOARD = gql`
    query {
        mainLeaderboard {
            userId
            username
            elo
        }
    }
`;

const RankingsPage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_MAIN_LEADERBOARD);
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    if (loading) return <p style={{ color: colors.text }}>Loading...</p>;
    if (error) return <p style={{ color: colors.text }}>Error: {error.message}</p>;

    const mainLeaderboard = data?.mainLeaderboard || [];

    return (
        <div
            style={{
                fontFamily: 'JetBrains Mono',
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <nav className="relative flex items-center w-full px-5">
                <div className="flex-shrink-0">
                    <HomeButton />
                </div>
                <h2
                    className="absolute left-1/2 transform -translate-x-1/2 text-center"
                    style={{ color: colors.text }}
                >
                    Multiplayer Rankings
                </h2>
            </nav>

            <table
                style={{
                    width: '80%',
                    marginInline: 'auto',
                    borderCollapse: 'collapse',
                    marginTop: '20px',
                    backgroundColor: colors.cardBackground,
                    borderRadius: '10px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: colors.buttonBackground,
                            color: colors.text,
                        }}
                    >
                        <th style={{ padding: '10px', textAlign: 'left' }}>Rank</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {mainLeaderboard.map((user: any, index: number) => (
                        <tr
                            key={index}
                            style={{
                                backgroundColor: index % 2 === 0 ? colors.background : colors.cardBackground,
                                color: colors.text,
                            }}
                        >
                            <td
                                style={{
                                    padding: '10px',
                                    textAlign: 'left',
                                    borderBottom: `1px solid ${colors.text}`,
                                }}
                            >
                                {index + 1}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    textAlign: 'left',
                                    borderBottom: `1px solid ${colors.text}`,
                                }}
                            >
                                {user.username}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    textAlign: 'right',
                                    borderBottom: `1px solid ${colors.text}`,
                                }}
                            >
                                {user.elo}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const RankingsPageWithApollo: React.FC = () => (
    <ApolloProvider client={client}>
        <RankingsPage />
    </ApolloProvider>
);

export default RankingsPageWithApollo;
