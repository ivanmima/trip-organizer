// One-time script to import data.json into Supabase.
// Run once after setting up .env: node migrate.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const filePath = path.join(__dirname, 'data.json');
  if (!fs.existsSync(filePath)) {
    console.error('data.json not found.');
    process.exit(1);
  }

  const tripData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const { error } = await supabase
    .from('trip_data')
    .upsert({ id: 1, data: tripData }, { onConflict: 'id' });

  if (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }

  console.log('✅ data.json successfully imported into Supabase.');
})();
