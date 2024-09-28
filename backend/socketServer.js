const WebSocket = require('ws');
const crypto = require('crypto'); // To generate random room codes

const wss = new WebSocket.Server({ port: 3002 });

let rooms = {}; // Track rooms and player statuses

wss.on('connection', (ws) => {
    console.log('A player connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Create a new room with a generated room code
        if (data.type === 'createRoom') {
            const roomCode = crypto.randomBytes(3).toString('hex'); // Generate a random room code
            rooms[roomCode] = { players: 1, readyPlayers: 0 }; // Initialize room with 1 player
            ws.roomCode = roomCode;
            ws.isHost = true;
            console.log(`Room ${roomCode} created with 1 player.`);
            console.log(`Current number of players in room ${roomCode}: ${rooms[roomCode].players}`); // Log number of players
            ws.send(JSON.stringify({ type: 'roomCreated', roomCode, playerCount: 1 }));
        }

        // Join an existing room
        if (data.type === 'joinRoom') {
            const roomCode = data.roomCode;
            if (rooms[roomCode] && rooms[roomCode].players < 2) {
                rooms[roomCode].players++;
                ws.roomCode = roomCode;
                console.log(`Player joined room ${roomCode}. Total players: ${rooms[roomCode].players}`);
                console.log(`Current number of players in room ${roomCode}: ${rooms[roomCode].players}`); // Log number of players

                // Notify both players of updated player count
                wss.clients.forEach(client => {
                    if (client.roomCode === roomCode && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'playerCountUpdate',
                            roomCode,
                            playerCount: rooms[roomCode].players
                        }));
                    }
                });

                // Only when two players are in the room
                if (rooms[roomCode].players === 2) {
                    wss.clients.forEach(client => {
                        if (client.roomCode === roomCode && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: 'bothPlayersConnected', roomCode }));
                        }
                    });
                }
            } else {
                ws.send(JSON.stringify({ type: 'roomFullOrNotFound', roomCode }));
            }
        }

        // Handle player clicking 'start'
        if (data.type === 'playerReady') {
            const roomCode = ws.roomCode;
            if (rooms[roomCode]) {
                rooms[roomCode].readyPlayers++;
                console.log(`Player in room ${roomCode} is ready. Ready players: ${rooms[roomCode].readyPlayers}`);

                // If both players are ready, start the match
                if (rooms[roomCode].readyPlayers === 2) {
                    wss.clients.forEach(client => {
                        if (client.roomCode === roomCode && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: 'matchStarted', roomCode }));
                        }
                    });
                }
            }
        }
    });

    ws.on('close', () => {
        console.log('A player disconnected');
        if (ws.roomCode && rooms[ws.roomCode]) {
            rooms[ws.roomCode].players--;
            console.log(`Player left room ${ws.roomCode}. Total players: ${rooms[ws.roomCode].players}`);

            if (rooms[ws.roomCode].players === 0) {
                console.log(`Room ${ws.roomCode} is empty. Deleting room.`);
                delete rooms[ws.roomCode];
            } else {
                // Update remaining players in the room
                wss.clients.forEach(client => {
                    if (client.roomCode === ws.roomCode && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'playerCountUpdate',
                            roomCode: ws.roomCode,
                            playerCount: rooms[ws.roomCode].players
                        }));
                    }
                });
            }
        }
    });
});