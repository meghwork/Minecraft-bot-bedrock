const { createClient } = require('bedrock-protocol');
const express = require('express');
const app = express();

// Basic keep-alive web server for Render
app.get('/', (req, res) => res.send('Bot is alive'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running'));

// Minecraft Bot config
const client = createClient({
  host: 'BeastSMP-VgeD.aternos.me',
  port: 53675,
  username: 'Binod_OP',     // Updated bot name
  offline: true
});

client.on('join', () => {
  console.log('Bot has joined the server');
});

// Wait for the bot's entity to be available before moving
client.on('spawn', () => {
  console.log('Bot spawn event received, will start moving.');

  setTimeout(() => {
    setInterval(() => {
      if (!client.entity || !client.entity.position) {
        console.log('Waiting for bot entity position...');
        return;
      }
      const yaw = Math.random() * 360;
      const pitch = Math.random() * 90 - 45;
      client.write('player_move', {
        position: client.entity.position,
        rotation: { x: pitch, y: yaw, z: 0 },
        mode: 0,
        on_ground: true,
        tick: BigInt(Date.now()) // Use unique tick value
      });
      console.log('Bot made a small move');
    }, 10000); // move every 10 seconds
  }, 3000); // wait 3 seconds after spawn before starting movement
});

client.on('disconnect', (packet) => {
  console.log('Bot disconnected:', packet.reason);
});
