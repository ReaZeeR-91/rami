document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('nameForm');
    const startScreen = document.getElementById('startScreen');
    const waitingScreen = document.getElementById('waitingScreen');
    const gameContainer = document.getElementById('gameContainer');
    let socket;

    nameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const playerName = document.getElementById('playerName').value;

        // Stocker le nom du joueur
        localStorage.setItem('playerName', playerName);

        // Afficher l'écran d'attente
        startScreen.style.display = 'none';
        waitingScreen.style.display = 'block';

        // Se connecter au serveur WebSocket sur Render
        socket = new WebSocket('wss://rami-jeux.onrender.com'); // Remplacez 'nom-de-ton-app' par le nom de votre application Render

        socket.onopen = () => {
            console.log('Connecté au serveur WebSocket');
            socket.send(JSON.stringify({ type: 'name', name: playerName }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'start') {
                // Commence le jeu quand les deux joueurs sont connectés
                waitingScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                initializeGame(socket, message.player, message.opponent);
            } else if (message.type === 'update') {
                // Gère les mises à jour du jeu (par exemple, mouvements de cartes)
                updateGame(message.data);
            }
        };
    });

    function initializeGame(socket, playerNumber, opponentName) {
        const playerName = localStorage.getItem('playerName');
        document.getElementById('playerGreeting').textContent = `Bienvenue ${playerName}, vous êtes le joueur ${playerNumber}. Le jeu commence ! Vous êtes contre ${opponentName}.`;

        const cardArea = document.getElementById('cardArea');
        cardArea.innerHTML = ''; // Vide le conteneur des cartes

        // Création de quelques cartes pour l'exemple
        for (let i = 1; i <= 6; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = i; // Contenu de la carte
            card.addEventListener('click', () => {
                alert(`Vous avez cliqué sur la carte ${i}`);
                socket.send(JSON.stringify({ type: 'update', data: { card: i } }));
            });
            cardArea.appendChild(card);
        }
    }

    function updateGame(data) {
        console.log('Mise à jour du jeu:', data);
        // Gère la mise à jour du jeu en fonction des données reçues
    }
});
