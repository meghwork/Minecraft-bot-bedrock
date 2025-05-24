const { createClient } = require('bedrock-protocol');
const express = require('express');
const app = express();

// Basic keep-alive web server for Render
app.get('/', (req, res) => res.send('Bot is alive'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running'));

// Minecraft Bot config
const client = createClient({
  host: 'BeastSMP-VgeD.aternos.me', // Your server address
  port: 53675,                      // Your server port
  username: 'Bot123',               // Bot name (change if you want)
  offline: true                     // Bedrock uses offline login
});

client.on('join', () => {
  console.log('Bot has joined the server');

  // Make slight movements to prevent idle ban
  setInterval(() => {
    const yaw = Math.random() * 360;
    const pitch = Math.random() * 90 - 45;
    client.write('player_move', {
      position: client.entity.position,
      rotation: { x: pitch, y: yaw, z: 0 },
      mode: 0,
      on_ground: true,
      tick: 0n
    });
    console.log('Bot made a small move');
  }, 30000); // move every 30 seconds
});

client.on('disconnect', (packet) => {
  console.log('Bot disconnected:', packet.reason);
});
