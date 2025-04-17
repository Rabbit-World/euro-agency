/**
 * GDPR Knowledge Challenge - Rankings Test Script
 * 
 * This file contains test functions to verify the ranking system functionality.
 * It simulates player scores and tests the visualization components.
 */

// Test function to simulate adding player scores
function testAddPlayerScores() {
    console.log('Testing ranking system...');
    
    // Initialize rankings if not already done
    if (!GDPRRankings.state.isInitialized) {
        GDPRRankings.init();
    }
    
    // Clear existing rankings for clean test
    GDPRRankings.resetRankings();
    console.log('Rankings reset for testing');
    
    // Add test EU players
    const euTestPlayers = [
        {
            name: 'Maria',
            country: 'DE',
            isEU: true,
            score: 5,
            maxScore: 5,
            timeTaken: 45,
            difficulty: 'medium'
        },
        {
            name: 'Jean',
            country: 'FR',
            isEU: true,
            score: 4,
            maxScore: 5,
            timeTaken: 60,
            difficulty: 'hard'
        },
        {
            name: 'Anna',
            country: 'SE',
            isEU: true,
            score: 3,
            maxScore: 5,
            timeTaken: 90,
            difficulty: 'easy'
        }
    ];
    
    // Add test global players
    const globalTestPlayers = [
        {
            name: 'John',
            country: 'US',
            isEU: false,
            score: 5,
            maxScore: 5,
            timeTaken: 50,
            difficulty: 'hard'
        },
        {
            name: 'Yuki',
            country: 'JP',
            isEU: false,
            score: 4,
            maxScore: 5,
            timeTaken: 70,
            difficulty: 'medium'
        }
    ];
    
    // Add all test players
    console.log('Adding test EU players...');
    euTestPlayers.forEach(player => {
        GDPRRankings.updateRankingsAfterQuiz(player);
        console.log(`Added ${player.name} (${player.country}) with score ${player.score}/${player.maxScore}`);
    });
    
    console.log('Adding test global players...');
    globalTestPlayers.forEach(player => {
        GDPRRankings.updateRankingsAfterQuiz(player);
        console.log(`Added ${player.name} (${player.country}) with score ${player.score}/${player.maxScore}`);
    });
    
    // Add current player (simulating end of game)
    const currentPlayer = {
        name: 'CurrentPlayer',
        country: 'IT',
        isEU: true,
        score: 4,
        maxScore: 5,
        timeTaken: 65,
        difficulty: 'mixed'
    };
    
    console.log('Adding current player...');
    GDPRRankings.updateRankingsAfterQuiz(currentPlayer);
    
    console.log('Test complete. Rankings should now be displayed.');
    
    // Test filtering
    document.getElementById('eu-filter').addEventListener('change', function() {
        GDPRRankings.displayFilteredRankings(this.value);
    });
    
    document.getElementById('global-filter').addEventListener('change', function() {
        GDPRRankings.displayFilteredRankings(this.value);
    });
}

// Function to test animations
function testRankingAnimations() {
    console.log('Testing ranking animations...');
    
    // Get all ranking items
    const rankingItems = document.querySelectorAll('.rankings-list li');
    
    // Apply animations sequentially
    let delay = 0;
    rankingItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'none'; // Reset animation
            void item.offsetWidth; // Trigger reflow
            
            // Apply different animations
            if (index % 3 === 0) {
                item.style.animation = 'slideUp 0.5s ease-out';
            } else if (index % 3 === 1) {
                item.style.animation = 'slideDown 0.5s ease-out';
            } else {
                item.style.animation = 'rankingHighlight 2s ease';
            }
        }, delay);
        
        delay += 300; // Stagger animations
    });
    
    console.log('Animation test complete.');
}

// Function to test chart rendering
function testChartRendering() {
    console.log('Testing chart rendering...');
    
    // Force re-render charts
    GDPRRankings.renderEUChart();
    GDPRRankings.renderGlobalChart();
    
    console.log('Chart rendering test complete.');
}

// Run all tests when the page is loaded and showing results screen
document.addEventListener('DOMContentLoaded', function() {
    // Add button to run tests
    const resultsControls = document.querySelector('.results-controls');
    if (resultsControls) {
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Rankings';
        testButton.className = 'btn btn-tertiary';
        testButton.style.marginLeft = '10px';
        testButton.addEventListener('click', function() {
            // Show results screen if not already visible
            document.getElementById('welcome-screen').classList.remove('active');
            document.getElementById('quiz-screen').classList.remove('active');
            document.getElementById('results-screen').classList.add('active');
            
            // Run tests
            testAddPlayerScores();
            
            // Test animations after a delay
            setTimeout(testRankingAnimations, 1000);
            
            // Test chart rendering after animations
            setTimeout(testChartRendering, 2500);
        });
        
        resultsControls.appendChild(testButton);
    }
});