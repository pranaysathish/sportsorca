/**
 * SportsOrca - Upcoming Soccer Matches
 * 
 * This application displays upcoming and recent soccer matches using TheSportsDB API.
 * Created by Pranay J Sathish for SportsOrca Full Stack Development Internship task.
 */

// Base URL for TheSportsDB API (free tier, no API key required)
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Main leagues with their IDs, names, and logo URLs
const MAIN_LEAGUES = [
    {
        id: '4328',
        name: 'Premier League',
        logo: 'https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png',
        country: 'England'
    },
    {
        id: '4332',
        name: 'Serie A',
        logo: 'https://www.thesportsdb.com/images/media/league/badge/ocy2fe1566216901.png',
        country: 'Italy'
    },
    {
        id: '4335',
        name: 'La Liga',
        logo: 'https://www.thesportsdb.com/images/media/league/badge/7onmyv1534768460.png',
        country: 'Spain'
    },
    {
        id: '4331',
        name: 'Bundesliga',
        logo: 'https://www.thesportsdb.com/images/media/league/badge/0j55yv1534764799.png',
        country: 'Germany'
    },
    {
        id: '4334',
        name: 'Ligue 1',
        logo: 'https://www.thesportsdb.com/images/media/league/badge/8f5jmf1516458074.png',
        country: 'France'
    },
    {
        id: '4337',
        name: 'Champions League',
        logo: 'https://www.thesportsdb.com/images/media/league/badge/dqo6r91549878326.png',
        country: 'Europe'
    }
];

// Fallback sample data in case API is not available
const fallbackMatches = [
    {
        idEvent: '1001',
        dateEvent: '2025-05-30',
        strTime: '15:00:00',
        strHomeTeam: 'Arsenal',
        strAwayTeam: 'Chelsea',
        strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/a1af2i1557005128.png',
        strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/z7zrdh1574875364.png',
        strVenue: 'Emirates Stadium'
    },
    {
        idEvent: '1002',
        dateEvent: '2025-05-31',
        strTime: '17:30:00',
        strHomeTeam: 'Liverpool',
        strAwayTeam: 'Manchester United',
        strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/quq0fm1423128270.png',
        strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/vuspuq1424442903.png',
        strVenue: 'Anfield'
    }
];

// Fallback recent matches data
const fallbackRecentMatches = [
    {
        idEvent: '1003',
        dateEvent: '2025-05-25',
        strTime: '15:00:00',
        strHomeTeam: 'Manchester City',
        strAwayTeam: 'Tottenham',
        strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/vqwq0k1448812376.png',
        strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/e4f8u91549130462.png',
        strVenue: 'Etihad Stadium',
        intHomeScore: '2',
        intAwayScore: '1',
        strStatus: 'Match Finished'
    },
    {
        idEvent: '1004',
        dateEvent: '2025-05-24',
        strTime: '17:30:00',
        strHomeTeam: 'Newcastle',
        strAwayTeam: 'Everton',
        strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/xqwvqy1420726016.png',
        strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/yps0ee1420726154.png',
        strVenue: 'St James Park',
        intHomeScore: '3',
        intAwayScore: '0',
        strStatus: 'Match Finished'
    }
];

// Function to format date and time
function formatDateTime(dateStr, timeStr) {
    if (!dateStr) return 'TBD';
    
    try {
        const date = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
        const options = { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (err) {
        return `${dateStr} ${timeStr || ''}`;
    }
}

// Function to populate the upcoming matches table
function populateMatchesTable(matches) {
    const tableBody = document.getElementById('matches-table-body');
    tableBody.innerHTML = '';
    
    matches.forEach(match => {
        const row = document.createElement('tr');
        row.className = 'match-row'; // Add animation class
        
        // Date & Time column
        const dateTimeCell = document.createElement('td');
        dateTimeCell.className = 'date-time';
        dateTimeCell.textContent = formatDateTime(match.dateEvent, match.strTime);
        row.appendChild(dateTimeCell);
        
        // Home Team column
        const homeTeamCell = document.createElement('td');
        homeTeamCell.className = 'team-cell';
        
        const homeTeamInfo = document.createElement('div');
        homeTeamInfo.className = 'team-info';
        
        if (match.strHomeTeamBadge) {
            const homeTeamLogo = document.createElement('img');
            homeTeamLogo.src = match.strHomeTeamBadge;
            homeTeamLogo.alt = `${match.strHomeTeam} logo`;
            homeTeamLogo.className = 'team-logo';
            homeTeamInfo.appendChild(homeTeamLogo);
        }
        
        const homeTeamName = document.createElement('span');
        homeTeamName.textContent = match.strHomeTeam;
        homeTeamInfo.appendChild(homeTeamName);
        
        homeTeamCell.appendChild(homeTeamInfo);
        row.appendChild(homeTeamCell);
        
        // VS column
        const vsCell = document.createElement('td');
        vsCell.className = 'vs-cell';
        vsCell.textContent = 'vs';
        row.appendChild(vsCell);
        
        // Away Team column
        const awayTeamCell = document.createElement('td');
        awayTeamCell.className = 'team-cell';
        
        const awayTeamInfo = document.createElement('div');
        awayTeamInfo.className = 'team-info';
        
        if (match.strAwayTeamBadge) {
            const awayTeamLogo = document.createElement('img');
            awayTeamLogo.src = match.strAwayTeamBadge;
            awayTeamLogo.alt = `${match.strAwayTeam} logo`;
            awayTeamLogo.className = 'team-logo';
            awayTeamInfo.appendChild(awayTeamLogo);
        }
        
        const awayTeamName = document.createElement('span');
        awayTeamName.textContent = match.strAwayTeam;
        awayTeamInfo.appendChild(awayTeamName);
        
        awayTeamCell.appendChild(awayTeamInfo);
        row.appendChild(awayTeamCell);
        
        // Venue column
        const venueCell = document.createElement('td');
        venueCell.textContent = match.strVenue || 'TBD';
        row.appendChild(venueCell);
        
        tableBody.appendChild(row);
    });
}

// Function to populate the recent matches table
function populateRecentMatchesTable(matches) {
    const tableBody = document.getElementById('recent-matches-table-body');
    tableBody.innerHTML = '';
    
    matches.forEach(match => {
        const row = document.createElement('tr');
        row.className = 'match-row'; // Add animation class
        
        // Date & Time column
        const dateTimeCell = document.createElement('td');
        dateTimeCell.className = 'date-time';
        dateTimeCell.textContent = formatDateTime(match.dateEvent, match.strTime);
        row.appendChild(dateTimeCell);
        
        // Home Team column
        const homeTeamCell = document.createElement('td');
        homeTeamCell.className = 'team-cell';
        
        const homeTeamInfo = document.createElement('div');
        homeTeamInfo.className = 'team-info';
        
        if (match.strHomeTeamBadge) {
            const homeTeamLogo = document.createElement('img');
            homeTeamLogo.src = match.strHomeTeamBadge;
            homeTeamLogo.alt = `${match.strHomeTeam} logo`;
            homeTeamLogo.className = 'team-logo';
            homeTeamInfo.appendChild(homeTeamLogo);
        }
        
        const homeTeamName = document.createElement('span');
        homeTeamName.textContent = match.strHomeTeam;
        // Add winner class if home team won
        if (match.intHomeScore > match.intAwayScore) {
            homeTeamName.classList.add('winner');
        }
        homeTeamInfo.appendChild(homeTeamName);
        
        homeTeamCell.appendChild(homeTeamInfo);
        row.appendChild(homeTeamCell);
        
        // Score column
        const scoreCell = document.createElement('td');
        scoreCell.className = 'text-center';
        
        if (match.intHomeScore !== null && match.intAwayScore !== null) {
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'score';
            scoreSpan.textContent = `${match.intHomeScore} - ${match.intAwayScore}`;
            scoreCell.appendChild(scoreSpan);
        } else {
            scoreCell.textContent = 'vs';
        }
        
        row.appendChild(scoreCell);
        
        // Away Team column
        const awayTeamCell = document.createElement('td');
        awayTeamCell.className = 'team-cell';
        
        const awayTeamInfo = document.createElement('div');
        awayTeamInfo.className = 'team-info';
        
        if (match.strAwayTeamBadge) {
            const awayTeamLogo = document.createElement('img');
            awayTeamLogo.src = match.strAwayTeamBadge;
            awayTeamLogo.alt = `${match.strAwayTeam} logo`;
            awayTeamLogo.className = 'team-logo';
            awayTeamInfo.appendChild(awayTeamLogo);
        }
        
        const awayTeamName = document.createElement('span');
        awayTeamName.textContent = match.strAwayTeam;
        // Add winner class if away team won
        if (match.intAwayScore > match.intHomeScore) {
            awayTeamName.classList.add('winner');
        }
        awayTeamInfo.appendChild(awayTeamName);
        
        awayTeamCell.appendChild(awayTeamInfo);
        row.appendChild(awayTeamCell);
        
        // Venue column
        const venueCell = document.createElement('td');
        venueCell.textContent = match.strVenue || 'TBD';
        row.appendChild(venueCell);
        
        tableBody.appendChild(row);
    });
}

// Function to fetch matches from the SportsDB API
async function fetchMatches(leagueId, season) {
    // Show loading state
    document.getElementById('loading').style.display = 'block';
    document.getElementById('matches-container').style.display = 'none';
    document.getElementById('recent-matches-container').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('no-matches').style.display = 'none';
    
    try {
        // Fetch data from the SportsDB API
        const response = await fetch(`${API_BASE_URL}/eventsseason.php?id=${leagueId}&s=${season}`);
        const data = await response.json();
        
        // Hide loading state
        document.getElementById('loading').style.display = 'none';
        
        let upcomingMatches = [];
        let recentMatches = [];
        
        if (data && data.events) {
            const currentDate = new Date();
            
            // Filter for upcoming matches (matches after current date)
            upcomingMatches = data.events
                .filter(match => new Date(match.dateEvent) >= currentDate)
                .sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent))
                .slice(0, 20); // Limit to 20 matches
            
            // Filter for recent matches (matches before current date)
            recentMatches = data.events
                .filter(match => new Date(match.dateEvent) < currentDate && match.strStatus === 'Match Finished')
                .sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent)) // Most recent first
                .slice(0, 10); // Limit to 10 matches
                
            // Add team badges if not included in the API response
            const processMatches = async (matchList) => {
                return Promise.all(matchList.map(async (match) => {
                    if (!match.strHomeTeamBadge || !match.strAwayTeamBadge) {
                        try {
                            // Try to fetch home team badge
                            if (!match.strHomeTeamBadge && match.idHomeTeam) {
                                const homeTeamResponse = await fetch(`${API_BASE_URL}/lookupteam.php?id=${match.idHomeTeam}`);
                                const homeTeamData = await homeTeamResponse.json();
                                if (homeTeamData && homeTeamData.teams && homeTeamData.teams[0]) {
                                    match.strHomeTeamBadge = homeTeamData.teams[0].strTeamBadge;
                                }
                            }
                            
                            // Try to fetch away team badge
                            if (!match.strAwayTeamBadge && match.idAwayTeam) {
                                const awayTeamResponse = await fetch(`${API_BASE_URL}/lookupteam.php?id=${match.idAwayTeam}`);
                                const awayTeamData = await awayTeamResponse.json();
                                if (awayTeamData && awayTeamData.teams && awayTeamData.teams[0]) {
                                    match.strAwayTeamBadge = awayTeamData.teams[0].strTeamBadge;
                                }
                            }
                        } catch (error) {
                            console.error('Error fetching team badges:', error);
                        }
                    }
                    return match;
                }));
            };
            
            // Process both upcoming and recent matches
            upcomingMatches = await processMatches(upcomingMatches);
            recentMatches = await processMatches(recentMatches);
        }
        
        // Update last updated timestamp
        updateLastUpdatedTimestamp();
        
        if (upcomingMatches.length > 0) {
            // Show upcoming matches container and populate table
            document.getElementById('matches-container').style.display = 'block';
            populateMatchesTable(upcomingMatches);
            
            // Show recent matches if available
            if (recentMatches.length > 0) {
                document.getElementById('recent-matches-container').style.display = 'block';
                populateRecentMatchesTable(recentMatches);
            }
        } else {
            // Show no upcoming matches message
            document.getElementById('no-matches').style.display = 'block';
            document.getElementById('no-matches').textContent = 'No upcoming matches found for the selected league and season. The season may have ended.';
            
            // Show recent matches if available
            if (recentMatches.length > 0) {
                document.getElementById('recent-matches-container').style.display = 'block';
                populateRecentMatchesTable(recentMatches);
            } else {
                // If no recent matches either, update the message
                document.getElementById('no-matches').textContent = 'No matches found for the selected league and season. Try selecting a different league or season.';
            }
        }
    } catch (error) {
        console.error('Error fetching matches:', error);
        
        // Hide loading state
        document.getElementById('loading').style.display = 'none';
        
        // Show user-friendly error message
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        
        // Determine the type of error for a more helpful message
        if (!navigator.onLine) {
            errorMessage.textContent = 'You appear to be offline. Please check your internet connection and try again.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage.textContent = 'Unable to connect to the sports data service. This could be due to network issues or the service may be temporarily unavailable.';
        } else {
            errorMessage.textContent = `There was a problem loading the match data: ${error.message}. Using fallback data.`;
        }
        
        // Use fallback data
        document.getElementById('matches-container').style.display = 'block';
        populateMatchesTable(fallbackMatches);
        
        // Show fallback recent matches
        document.getElementById('recent-matches-container').style.display = 'block';
        populateRecentMatchesTable(fallbackRecentMatches);
        
        // Update timestamp even for fallback data
        updateLastUpdatedTimestamp();
    }
}

// Function to update the last updated timestamp
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    document.getElementById('last-updated').textContent = `Last updated: ${formattedDate}`;
}

// Function to create and display the main leagues with logos
function displayMainLeagues() {
    const leagueButtonsContainer = document.getElementById('league-buttons');
    leagueButtonsContainer.innerHTML = ''; // Clear loading indicator
    
    // Create a button for each main league
    MAIN_LEAGUES.forEach(league => {
        const leagueButton = document.createElement('div');
        leagueButton.className = 'league-button';
        leagueButton.dataset.leagueId = league.id;
        
        // Set the first league as active by default
        if (league.id === MAIN_LEAGUES[0].id) {
            leagueButton.classList.add('active');
        }
        
        // Create a container for the logo to ensure consistent sizing
        const logoContainer = document.createElement('div');
        logoContainer.className = 'league-logo';
        
        const logoImg = document.createElement('img');
        logoImg.src = league.logo;
        logoImg.alt = `${league.name} logo`;
        
        // Add error handling for logo loading
        logoImg.onerror = function() {
            // If logo fails to load, use a fallback or show initials
            this.onerror = null; // Prevent infinite error loop
            this.src = ''; // Clear the source to prevent broken image icon
            logoContainer.textContent = league.name.charAt(0); // Show first letter as fallback
            logoContainer.style.backgroundColor = '#f0f0f0';
            logoContainer.style.borderRadius = '50%';
            logoContainer.style.fontSize = '24px';
            logoContainer.style.fontWeight = 'bold';
            logoContainer.style.color = '#0d6efd';
            logoContainer.style.display = 'flex';
            logoContainer.style.alignItems = 'center';
            logoContainer.style.justifyContent = 'center';
        };
        
        logoContainer.appendChild(logoImg);
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'league-name';
        nameDiv.textContent = league.name;
        
        leagueButton.appendChild(logoContainer);
        leagueButton.appendChild(nameDiv);
        
        // Add click event listener
        leagueButton.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.league-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Fetch matches for the selected league
            const leagueId = this.dataset.leagueId;
            const season = document.getElementById('seasonSelect').value;
            fetchMatches(leagueId, season);
        });
        
        leagueButtonsContainer.appendChild(leagueButton);
    });
}

// Event listener for season select
document.getElementById('seasonSelect').addEventListener('change', function() {
    const season = this.value;
    // Get the active league ID
    const activeLeagueButton = document.querySelector('.league-button.active');
    const leagueId = activeLeagueButton ? activeLeagueButton.dataset.leagueId : MAIN_LEAGUES[0].id;
    fetchMatches(leagueId, season);
});

// Function to handle refresh button click
function handleRefreshClick() {
    // Add spinning animation to the refresh button
    const refreshIcon = document.querySelector('#refresh-btn svg');
    refreshIcon.classList.add('refreshing');
    
    // Get current league and season
    const activeLeagueButton = document.querySelector('.league-button.active');
    const leagueId = activeLeagueButton ? activeLeagueButton.dataset.leagueId : MAIN_LEAGUES[0].id;
    const season = document.getElementById('seasonSelect').value;
    
    // Fetch fresh data
    fetchMatches(leagueId, season).finally(() => {
        // Remove spinning animation when done
        setTimeout(() => {
            refreshIcon.classList.remove('refreshing');
        }, 500);
    });
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function() {
    // Display main leagues with logos
    displayMainLeagues();
    
    // Initial fetch of matches for the first league
    const leagueId = MAIN_LEAGUES[0].id;
    const season = document.getElementById('seasonSelect').value;
    fetchMatches(leagueId, season);
    
    // Add event listener for refresh button
    document.getElementById('refresh-btn').addEventListener('click', handleRefreshClick);
});
