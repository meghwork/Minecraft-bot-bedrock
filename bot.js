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

function ensureVec3(obj, def) {
  if (
    typeof obj === 'object' &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number' &&
    typeof obj.z === 'number'
  ) {
    return obj;
  }
  return def;
}

client.on('join', () => {
  console.log('Bot has joined the server');
});

client.on('spawn', () => {
  console.log('Bot spawn event received, will start sending player_move.');
  setInterval(() => {
    const defaultPos = { x: 0, y: 70, z: 0 };
    const pos = ensureVec3(client.entity && client.entity.position, defaultPos);

    const yaw = Math.random() * 360;
    const pitch = Math.random() * 90 - 45;

    try {
      client.write('player_move', {
        position: pos,
        rotation: { x: pitch, y: yaw, z: 0 },
        mode: 0,
        on_ground: true,
        tick: BigInt(Date.now())
      });
      console.log('Bot made a small move:', pos);
    } catch (err) {
      console.log('Failed to send player_move:', err);
    }
  }, 10000); // every 10 seconds
});

client.on('disconnect', (packet) => {
  console.log('Bot disconnected:', packet.reason);
});
