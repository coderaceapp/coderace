import { IResolvers } from '@graphql-tools/utils';
import { db } from "../services/firebase/firebaseClient";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const leaderboardsResolver: IResolvers = {
    Query: {
        async mainLeaderboard() {
            try {
                const usersRef = collection(db, 'users');
                const eloQuery = query(usersRef, orderBy('elo', 'desc'), limit(10));
                const usersSnapshot = await getDocs(eloQuery);

                const leaderboard = usersSnapshot.docs.map((doc) => ({
                    userId: doc.id,
                    username: doc.data().username || "Unknown User",
                    elo: doc.data().elo || 1400,
                }));

                return leaderboard;
            } catch (error) {
                console.error('Error fetching main leaderboard:', error);
                throw new Error('Failed to fetch main leaderboard');
            }
        },
    },
};
