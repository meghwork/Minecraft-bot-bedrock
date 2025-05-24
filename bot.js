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
  username: 'Binod_OP',
  offline: true
});

client.on('join', () => {
  console.log('Bot has joined the server');
});

client.on('spawn', () => {
  console.log('Bot spawn event received, will start sending player_auth_input.');

  setInterval(() => {
    // Use the bot's actual position if available, otherwise a default
    let pos = { x: 0, y: 70, z: 0 };
    if (client.entity && client.entity.position) {
      pos = client.entity.position;
    } else {
      console.log('Using default position...');
    }
    const yaw = Math.random() * 360;
    const pitch = Math.random() * 90 - 45;

    client.write('player_auth_input', {
      position: pos,
      pitch: pitch,
      yaw: yaw,
      move_vector: { x: 0, y: 0, z: 0 },
      head_yaw: yaw,
      input_data: 0,
      input_mode: 0,
      play_mode: 0,
      on_ground: true,
      tick: BigInt(Date.now())
    });
    console.log('Bot sent player_auth_input');
  }, 10000); // every 10 seconds
});

client.on('disconnect', (packet) => {
  console.log('Bot disconnected:', packet.reason);
});
