const { createClient } = require('bedrock-protocol');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is alive'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running'));

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
    // Always create valid position and move_vector objects
    let pos = { x: 0, y: 70, z: 0 };
    try {
      if (
        client.entity &&
        client.entity.position &&
        typeof client.entity.position.x === 'number' &&
        typeof client.entity.position.y === 'number' &&
        typeof client.entity.position.z === 'number'
      ) {
        pos = {
          x: client.entity.position.x,
          y: client.entity.position.y,
          z: client.entity.position.z
        };
      }
    } catch (e) {
      console.log('Error reading entity position, using fallback.');
    }

    const yaw = Math.random() * 360;
    const pitch = Math.random() * 90 - 45;
    const move_vector = { x: 0, y: 0, z: 0 };

    try {
      client.write('player_auth_input', {
        position: pos,
        pitch: pitch,
        yaw: yaw,
        move_vector: move_vector,
        head_yaw: yaw,
        input_data: 0,
        input_mode: 0,
        play_mode: 0,
        on_ground: true,
        tick: BigInt(Date.now())
      });
      console.log('Bot sent player_auth_input:', pos);
    } catch (err) {
      console.log('Failed to send player_auth_input:', err);
    }
  }, 10000); // every 10 seconds
});

client.on('disconnect', (packet) => {
  console.log('Bot disconnected:', packet.reason);
});
