const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// API endpoint to fetch upcoming soccer matches
app.get('/api/matches', async (req, res) => {
  try {
    // Using the SportsDB API to fetch upcoming soccer matches
    // For this example, we're using the English Premier League (ID: 4328)
    // You can change the league ID as needed
    const leagueId = req.query.leagueId || '4328';
    const season = req.query.season || '2024-2025'; // Current season
    
    const response = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${leagueId}&s=${season}`
    );

    let matches = [];
    
    if (response.data && response.data.events) {
      // Filter for upcoming matches only (matches after current date)
      const currentDate = new Date();
      matches = response.data.events
        .filter(match => new Date(match.dateEvent) >= currentDate)
        .sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent))
        .slice(0, 20); // Limit to 20 matches
    }

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches data',
      message: error.message
    });
  }
});

// API endpoint to fetch team details (for logos)
app.get('/api/team/:id', async (req, res) => {
  try {
    const teamId = req.params.id;
    const response = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${teamId}`
    );

    if (response.data && response.data.teams && response.data.teams.length > 0) {
      res.json({
        success: true,
        data: response.data.teams[0]
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }
  } catch (error) {
    console.error('Error fetching team details:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team details',
      message: error.message
    });
  }
});

// API endpoint to fetch leagues for dropdown
app.get('/api/leagues', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php?s=Soccer'
    );

    if (response.data && response.data.leagues) {
      res.json({
        success: true,
        count: response.data.leagues.length,
        data: response.data.leagues
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No leagues found'
      });
    }
  } catch (error) {
    console.error('Error fetching leagues:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leagues data',
      message: error.message
    });
  }
});

// Catch-all handler for any request that doesn't match the ones above
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
