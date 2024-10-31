const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Listen for form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value); // Send message to server
        input.value = ''; // Clear input
    }
});

// Listen for chat messages from server
socket.on('chat message', function(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item); // Add message to list
    window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom
});