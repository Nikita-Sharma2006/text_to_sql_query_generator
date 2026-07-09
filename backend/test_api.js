import fs from 'fs';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING API VERIFICATION ---');
  
  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    console.log('✔ Health Check:', data);
  } catch (err) {
    console.error('❌ Health Check Failed:', err.message);
    return;
  }

  // Generate unique email to avoid conflicts
  const randomSuffix = Math.floor(Math.random() * 100000);
  const email = `samurai_${randomSuffix}@shogun.com`;
  const password = 'ninja_pass_word_123';
  const fullName = 'Miyamoto Musashi';

  let token = '';

  // 2. Register
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await res.json();
    console.log('✔ Registration Response Status:', res.status);
    console.log('✔ Registration Data:', data);
    if (data.success) {
      token = data.data.token;
      console.log('✔ Received Token successfully.');
    } else {
      console.error('❌ Registration Failed:', data.message);
      return;
    }
  } catch (err) {
    console.error('❌ Registration request failed:', err.message);
    return;
  }

  // 3. Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log('✔ Login Response Status:', res.status);
    console.log('✔ Login Data:', data);
  } catch (err) {
    console.error('❌ Login Request Failed:', err.message);
  }

  // 4. Get Profile (Protected)
  try {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('✔ Profile Response:', data);
  } catch (err) {
    console.error('❌ Profile Fetch Failed:', err.message);
  }

  // 5. Schema Upload
  // Create a mock .sql file in memory and upload it
  const sqlContent = `
    CREATE TABLE ronin (
      ronin_id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      clan VARCHAR(50),
      age INT
    );
  `;
  
  // Since creating multipart request in pure Node.js can be verbose, we can construct the payload manually using a boundary.
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const payload = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="schemaFile"; filename="ronin_db.sql"',
    'Content-Type: application/octet-stream',
    '',
    sqlContent,
    `--${boundary}--`,
    ''
  ].join('\r\n');

  try {
    const res = await fetch(`${BASE_URL}/schemas/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: payload
    });
    const data = await res.json();
    console.log('✔ Schema Upload Response:', data);
  } catch (err) {
    console.error('❌ Schema Upload Failed:', err.message);
  }

  // 6. Get Schemas list
  try {
    const res = await fetch(`${BASE_URL}/schemas`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('✔ Get Schemas:', data);
  } catch (err) {
    console.error('❌ Get Schemas Failed:', err.message);
  }

  // 7. AI Generation (Expect failure if key is default/invalid, but verify handling)
  try {
    const res = await fetch(`${BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: 'Select all ronin whose age is greater than 30' })
    });
    const data = await res.json();
    console.log('✔ AI Generation Response:', data);
  } catch (err) {
    console.error('❌ AI Generation Request Failed:', err.message);
  }

  // 8. SQL Execution (Should return simulated rows with warning)
  try {
    const res = await fetch(`${BASE_URL}/ai/execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: 'SELECT * FROM ronin ORDER BY age ASC;' })
    });
    const data = await res.json();
    console.log('✔ SQL Execution Response:', data);
  } catch (err) {
    console.error('❌ SQL Execution Request Failed:', err.message);
  }

  console.log('--- API VERIFICATION COMPLETED ---');
}

runTests();
