import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const rooms = {};

wss.on('connection', (ws) => {
    console.log('New connection established.');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Handle room creation
        if (data.type === 'createRoom') {
            const roomCode = Math.random().toString(36).substring(2, 8);
            rooms[roomCode] = { players: [ws] };
            ws.roomCode = roomCode;
            ws.send(JSON.stringify({ type: 'roomCreated', roomCode }));
            console.log(`Room created with code: ${roomCode}`);

        } else if (data.type === 'joinRoom') {
            const room = rooms[data.roomCode];
            if (room && room.players.length < 2) {
                room.players.push(ws);
                ws.roomCode = data.roomCode;

                // Notify both players in the room
                room.players.forEach((player, index) => {
                    player.send(JSON.stringify({ type: 'playerJoined', playerIndex: index }));
                });
                console.log(`Player joined room: ${data.roomCode}`);
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Room full or does not exist' }));
                console.log(`Failed to join room: ${data.roomCode}`);
            }
        }
    });

    ws.on('close', () => {
        const roomCode = ws.roomCode;
        if (roomCode && rooms[roomCode]) {
            rooms[roomCode].players = rooms[roomCode].players.filter(p => p !== ws);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode];
                console.log(`Room ${roomCode} deleted.`);
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server running on ws://localhost:8080');