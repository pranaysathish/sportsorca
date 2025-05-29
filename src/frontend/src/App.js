import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Spinner, Alert, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('4328'); // Default to English Premier League
  const [selectedSeason, setSelectedSeason] = useState('2024-2025'); // Default season

  // Seasons for dropdown
  const seasons = [
    '2024-2025',
    '2023-2024',
    '2022-2023',
  ];

  // Fetch leagues for dropdown
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axios.get('/api/leagues');
        if (response.data.success) {
          setLeagues(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching leagues:', err);
      }
    };

    fetchLeagues();
  }, []);

  // Fetch matches when league or season changes
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/matches?leagueId=${selectedLeague}&season=${selectedSeason}`);
        
        if (response.data.success) {
          setMatches(response.data.data);
        } else {
          setError('Failed to fetch matches data');
        }
      } catch (err) {
        setError('Error connecting to the server. Please try again later.');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedLeague, selectedSeason]);

  // Format date and time
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'TBD';
    
    try {
      const date = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
      return format(date, 'MMM dd, yyyy - h:mm a');
    } catch (err) {
      return `${dateStr} ${timeStr || ''}`;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <Container>
          <h1>SportsOrca - Upcoming Soccer Matches</h1>
          <p className="lead">View upcoming matches for your favorite soccer leagues</p>
        </Container>
      </header>

      <Container className="mt-4">
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select League</Form.Label>
                  <Form.Select 
                    value={selectedLeague}
                    onChange={(e) => setSelectedLeague(e.target.value)}
                  >
                    {leagues.map(league => (
                      <option key={league.idLeague} value={league.idLeague}>
                        {league.strLeague}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Season</Form.Label>
                  <Form.Select 
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading matches...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : matches.length === 0 ? (
          <Alert variant="info">
            No upcoming matches found for the selected league and season. Try selecting a different league or season.
          </Alert>
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="match-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Home Team</th>
                      <th></th>
                      <th>Away Team</th>
                      <th>Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.idEvent}>
                        <td className="date-time">
                          {formatDateTime(match.dateEvent, match.strTime)}
                        </td>
                        <td className="team-cell">
                          <div className="team-info">
                            {match.strHomeTeamBadge && (
                              <img 
                                src={match.strHomeTeamBadge} 
                                alt={`${match.strHomeTeam} logo`} 
                                className="team-logo"
                              />
                            )}
                            <span>{match.strHomeTeam}</span>
                          </div>
                        </td>
                        <td className="vs-cell">vs</td>
                        <td className="team-cell">
                          <div className="team-info">
                            {match.strAwayTeamBadge && (
                              <img 
                                src={match.strAwayTeamBadge} 
                                alt={`${match.strAwayTeam} logo`} 
                                className="team-logo"
                              />
                            )}
                            <span>{match.strAwayTeam}</span>
                          </div>
                        </td>
                        <td>{match.strVenue || 'TBD'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>

      <footer className="app-footer mt-5">
        <Container>
          <p>© 2025 SportsOrca | Data provided by <a href="https://www.thesportsdb.com/" target="_blank" rel="noreferrer">TheSportsDB</a></p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
