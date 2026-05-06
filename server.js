const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tripAdmin2026';
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch {
    res.json({ trip: {}, itinerary: [], attractions: [], reservations: [], packing: [] });
  }
});

app.post('/api/data', (req, res) => {
  const { password, ...data } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✈️  Trip Organizer running at http://localhost:${PORT}`);
  console.log(`   Admin page: http://localhost:${PORT}/admin.html`);
  console.log(`   Admin password: ${ADMIN_PASSWORD}`);
  console.log(`   Change password: set ADMIN_PASSWORD env variable\n`);
});
