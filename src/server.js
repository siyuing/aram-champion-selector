// src/server.js

const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const DATA_DRAGON_URL = 'https://ddragon.leagueoflegends.com/cdn';
const CHAMPIONS_DATA_PATH = path.join(__dirname, 'data', 'champions.json');

app.use(express.static('public'));

async function fetchLatestVersion() {
  const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
  return response.data[0];
}

async function fetchAndUpdateChampions() {
  try {
    const latestVersion = await fetchLatestVersion();
    const response = await axios.get(`${DATA_DRAGON_URL}/${latestVersion}/data/ja_JP/champion.json`);
    const champions = Object.values(response.data.data).map(champion => ({
      id: champion.id,
      name: champion.name,
      image: `${DATA_DRAGON_URL}/${latestVersion}/img/champion/${champion.image.full}`,
      isMelee: champion.stats.attackrange < 300
    }));

    await fs.writeFile(CHAMPIONS_DATA_PATH, JSON.stringify(champions, null, 2));
    console.log('Champions data updated successfully');
  } catch (error) {
    console.error('Error updating champions data:', error);
  }
}

async function getChampions() {
  try {
    const data = await fs.readFile(CHAMPIONS_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading champions data:', error);
    return [];
  }
}

// チャンピオンデータを1日1回更新
setInterval(fetchAndUpdateChampions, 24 * 60 * 60 * 1000);

// 起動時にもデータを更新
fetchAndUpdateChampions();

app.get('/api/champions', async (req, res) => {
  const champions = await getChampions();
  res.json(champions);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));