const WebSocket = require('ws');
const server = new WebSocket('wss://rami_jeux.onrender.com');

let players = [];

server.on('connection', socket => {
    console.log('Un joueur est connecté');
    players.push(socket);
    
    if (players.length === 2) {
        // Nous avons deux joueurs, commençons le jeu
        players.forEach((player, index) => {
            player.send(JSON.stringify({ type: 'start', player: index + 1 }));
        });
        players = [];
    }

    socket.on('message', message => {
        console.log('Message reçu:', message);
        players.forEach(player => {
            if (player !== socket) {
                player.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('Un joueur est déconnecté');
        players = players.filter(player => player !== socket);
    });
});

console.log('Serveur WebSocket en écoute sur ws://localhost:8080');
