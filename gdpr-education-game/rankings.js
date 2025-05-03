/**
 * GDPR Knowledge Challenge - Rankings System
 * 
 * This file contains the implementation of the ranking system and visualization
 * components for the GDPR educational game, including:
 * - Ranking calculation and management
 * - Leaderboard visualization with charts
 * - Animation effects for ranking changes
 * - Integration with the main game
 */

// ===== Rankings Namespace =====
const GDPRRankings = {
    // Configuration
    config: {
        chartColors: {
            eu: {
                primary: '#2c6bac', // EU Blue
                secondary: '#5a8fd6', // Lighter blue
                highlight: '#f5b400', // Yellow/Gold for highlighting
                text: '#202124' // Dark text
            },
            global: {
                primary: '#34a853', // Green
                secondary: '#4cc66a', // Lighter green
                highlight: '#f5b400', // Yellow/Gold for highlighting
                text: '#202124' // Dark text
            }
        },
        animationDuration: 500, // ms
        maxRankingsToShow: 10,
        countryFlags: true, // Whether to show country flags in rankings
        rankingTiers: [
            { threshold: 90, name: 'Expert', color: '#188038' }, // Dark green
            { threshold: 70, name: 'Advanced', color: '#34a853' }, // Green
            { threshold: 50, name: 'Intermediate', color: '#fbbc04' }, // Yellow
            { threshold: 0, name: 'Beginner', color: '#ea4335' } // Red
        ],
        storageKey: 'gdpr_leaderboard'
    },

    // State
    state: {
        euRankings: [],
        globalRankings: [],
        previousEuRankings: [],
        previousGlobalRankings: [],
        playerEntry: null,
        euChartInstance: null,
        globalChartInstance: null,
        isInitialized: false
    },

    // ===== Initialization =====
    init: function() {
        // Load existing rankings data
        this.loadRankings();
        
        // Initialize chart containers
        this.initializeChartContainers();
        
        // Set initialized flag
        this.state.isInitialized = true;
        
        console.log('GDPR Rankings system initialized');
        
        // Return this for chaining
        return this;
    },

    // ===== Data Management =====
    loadRankings: function() {
        // Try to get rankings from storage
        try {
            const storedData = localStorage.getItem(this.config.storageKey);
            
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                
                // Store previous rankings for animation
                this.state.previousEuRankings = [...(this.state.euRankings || [])];
                this.state.previousGlobalRankings = [...(this.state.globalRankings || [])];
                
                // Update current rankings
                this.state.euRankings = Array.isArray(parsedData.eu) ? parsedData.eu : [];
                this.state.globalRankings = Array.isArray(parsedData.global) ? parsedData.global : [];
            } else {
                // Initialize empty rankings
                this.state.euRankings = [];
                this.state.globalRankings = [];
                this.state.previousEuRankings = [];
                this.state.previousGlobalRankings = [];
            }
        } catch (error) {
            console.error('Error loading rankings data:', error);
            // Initialize empty rankings on error
            this.state.euRankings = [];
            this.state.globalRankings = [];
            this.state.previousEuRankings = [];
            this.state.previousGlobalRankings = [];
        }
        
        return this;
    },

    saveRankings: function() {
        // Save rankings to storage
        try {
            const dataToSave = {
                eu: this.state.euRankings,
                global: this.state.globalRankings
            };
            
            localStorage.setItem(this.config.storageKey, JSON.stringify(dataToSave));
            return true;
        } catch (error) {
            console.error('Error saving rankings data:', error);
            return false;
        }
    },

    // ===== Ranking Calculations =====
    calculateScore: function(correct, total, timeTaken, difficulty) {
        // Base score is percentage correct
        let score = (correct / total) * 100;
        
        // Apply time bonus - faster completion gets more points
        // Maximum time bonus is 20 points (for completing in 10 seconds or less)
        const averageTimePerQuestion = timeTaken / total;
        let timeBonus = 0;
        
        if (averageTimePerQuestion <= 10) {
            timeBonus = 20;
        } else if (averageTimePerQuestion <= 20) {
            timeBonus = 10;
        } else if (averageTimePerQuestion <= 30) {
            timeBonus = 5;
        }
        
        // Apply difficulty multiplier
        let difficultyMultiplier = 1;
        switch (difficulty) {
            case 'easy':
                difficultyMultiplier = 1;
                break;
            case 'medium':
                difficultyMultiplier = 1.25;
                break;
            case 'hard':
                difficultyMultiplier = 1.5;
                break;
            case 'mixed':
                difficultyMultiplier = 1.2;
                break;
        }
        
        // Calculate final score
        const finalScore = (score + timeBonus) * difficultyMultiplier;
        
        // Return rounded score
        return Math.round(finalScore);
    },

    getTierForScore: function(score) {
        // Find the appropriate tier based on score
        for (const tier of this.config.rankingTiers) {
            if (score >= tier.threshold) {
                return tier;
            }
        }
        
        // Default to the lowest tier
        return this.config.rankingTiers[this.config.rankingTiers.length - 1];
    },

    // ===== Ranking Updates =====
    addPlayerScore: function(playerData) {
        // Store the current player entry for highlighting
        this.state.playerEntry = {
            name: playerData.name,
            country: playerData.country,
            score: playerData.score,
            maxScore: playerData.maxScore,
            percentage: (playerData.score / playerData.maxScore) * 100,
            calculatedScore: this.calculateScore(
                playerData.score, 
                playerData.maxScore, 
                playerData.timeTaken, 
                playerData.difficulty
            ),
            difficulty: playerData.difficulty,
            timestamp: new Date().toISOString()
        };
        
        // Store previous rankings for animation
        this.state.previousEuRankings = [...this.state.euRankings];
        this.state.previousGlobalRankings = [...this.state.globalRankings];
        
        // Add to appropriate leaderboard
        if (playerData.isEU) {
            this.state.euRankings.push(this.state.playerEntry);
            this.sortRankings(this.state.euRankings);
            this.state.euRankings = this.state.euRankings.slice(0, this.config.maxRankingsToShow);
        }
        
        // Add to global leaderboard
        this.state.globalRankings.push(this.state.playerEntry);
        this.sortRankings(this.state.globalRankings);
        this.state.globalRankings = this.state.globalRankings.slice(0, this.config.maxRankingsToShow);
        
        // Save updated rankings
        this.saveRankings();
        
        // Return this for chaining
        return this;
    },

    sortRankings: function(rankings) {
        // Sort by calculated score (descending)
        rankings.sort((a, b) => {
            // First by calculated score
            if (b.calculatedScore !== a.calculatedScore) {
                return b.calculatedScore - a.calculatedScore;
            }
            
            // Then by raw percentage
            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }
            
            // Then by difficulty (hard > medium > easy > mixed)
            const difficultyOrder = { 'hard': 3, 'medium': 2, 'easy': 1, 'mixed': 0 };
            if (difficultyOrder[b.difficulty] !== difficultyOrder[a.difficulty]) {
                return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
            }
            
            // Finally by timestamp (newer first)
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        return rankings;
    },

    getRankingPosition: function(playerName, rankings) {
        // Find position of player in rankings
        for (let i = 0; i < rankings.length; i++) {
            if (rankings[i].name === playerName) {
                return i;
            }
        }
        
        return -1; // Not found
    },

    getRankChange: function(playerName, currentRankings, previousRankings) {
        const currentPos = this.getRankingPosition(playerName, currentRankings);
        const previousPos = this.getRankingPosition(playerName, previousRankings);
        
        if (currentPos === -1) {
            return 'new'; // New entry
        }
        
        if (previousPos === -1) {
            return 'new'; // New entry
        }
        
        if (currentPos < previousPos) {
            return 'up'; // Moved up
        }
        
        if (currentPos > previousPos) {
            return 'down'; // Moved down
        }
        
        return 'same'; // No change
    },

    // ===== Visualization =====
    initializeChartContainers: function() {
        // Make sure the chart containers are ready
        const euChart = document.getElementById('eu-chart');
        const globalChart = document.getElementById('global-chart');
        
        if (euChart) {
            euChart.innerHTML = '';
            euChart.style.position = 'relative';
        }
        
        if (globalChart) {
            globalChart.innerHTML = '';
            globalChart.style.position = 'relative';
        }
    },

    renderLeaderboards: function() {
        // Render both leaderboards
        this.renderEULeaderboard();
        this.renderGlobalLeaderboard();
        
        // Return this for chaining
        return this;
    },

    renderEULeaderboard: function() {
        // Render EU leaderboard list
        const euRankingsList = document.getElementById('eu-rankings');
        if (!euRankingsList) return;
        
        euRankingsList.innerHTML = '';
        
        if (this.state.euRankings.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No rankings yet';
            euRankingsList.appendChild(listItem);
        } else {
            this.state.euRankings.forEach((entry, index) => {
                const listItem = document.createElement('li');
                
                // Get rank change
                const rankChange = this.getRankChange(
                    entry.name, 
                    this.state.euRankings, 
                    this.state.previousEuRankings
                );
                
                // Create rank change indicator
                let rankChangeHTML = '';
                if (rankChange === 'up') {
                    rankChangeHTML = '<span class="rank-change rank-up" aria-label="Moved up">↑</span>';
                } else if (rankChange === 'down') {
                    rankChangeHTML = '<span class="rank-change rank-down" aria-label="Moved down">↓</span>';
                } else if (rankChange === 'new') {
                    rankChangeHTML = '<span class="rank-change rank-new" aria-label="New entry">★</span>';
                } else {
                    rankChangeHTML = '<span class="rank-change rank-same" aria-label="No change">-</span>';
                }
                
                // Get tier for color coding
                const tier = this.getTierForScore(entry.calculatedScore);
                
                // Create country flag or code display
                let countryDisplay = entry.country;
                if (this.config.countryFlags) {
                    countryDisplay = `<span class="country-code">${entry.country}</span>`;
                }
                
                // Build list item HTML
                listItem.innerHTML = `
                    <span class="rank-position">${index + 1}.</span>
                    <span class="player-name">${entry.name} (${countryDisplay})</span>
                    <span class="player-score" style="color: ${tier.color}">
                        ${entry.score}/${entry.maxScore} (${Math.round(entry.percentage)}%)
                        ${rankChangeHTML}
                    </span>
                `;
                
                // Highlight current player
                if (this.state.playerEntry && entry.name === this.state.playerEntry.name && 
                    entry.timestamp === this.state.playerEntry.timestamp) {
                    listItem.classList.add('highlight-animation');
                    listItem.setAttribute('aria-label', 'Your ranking');
                }
                
                euRankingsList.appendChild(listItem);
            });
        }
        
        // Render EU chart
        this.renderEUChart();
    },

    renderGlobalLeaderboard: function() {
        // Render global leaderboard list
        const globalRankingsList = document.getElementById('global-rankings');
        if (!globalRankingsList) return;
        
        globalRankingsList.innerHTML = '';
        
        if (this.state.globalRankings.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No rankings yet';
            globalRankingsList.appendChild(listItem);
        } else {
            this.state.globalRankings.forEach((entry, index) => {
                const listItem = document.createElement('li');
                
                // Get rank change
                const rankChange = this.getRankChange(
                    entry.name, 
                    this.state.globalRankings, 
                    this.state.previousGlobalRankings
                );
                
                // Create rank change indicator
                let rankChangeHTML = '';
                if (rankChange === 'up') {
                    rankChangeHTML = '<span class="rank-change rank-up" aria-label="Moved up">↑</span>';
                } else if (rankChange === 'down') {
                    rankChangeHTML = '<span class="rank-change rank-down" aria-label="Moved down">↓</span>';
                } else if (rankChange === 'new') {
                    rankChangeHTML = '<span class="rank-change rank-new" aria-label="New entry">★</span>';
                } else {
                    rankChangeHTML = '<span class="rank-change rank-same" aria-label="No change">-</span>';
                }
                
                // Get tier for color coding
                const tier = this.getTierForScore(entry.calculatedScore);
                
                // Create country flag or code display
                let countryDisplay = entry.country;
                if (this.config.countryFlags) {
                    countryDisplay = `<span class="country-code">${entry.country}</span>`;
                }
                
                // Build list item HTML
                listItem.innerHTML = `
                    <span class="rank-position">${index + 1}.</span>
                    <span class="player-name">${entry.name} (${countryDisplay})</span>
                    <span class="player-score" style="color: ${tier.color}">
                        ${entry.score}/${entry.maxScore} (${Math.round(entry.percentage)}%)
                        ${rankChangeHTML}
                    </span>
                `;
                
                // Highlight current player
                if (this.state.playerEntry && entry.name === this.state.playerEntry.name && 
                    entry.timestamp === this.state.playerEntry.timestamp) {
                    listItem.classList.add('highlight-animation');
                    listItem.setAttribute('aria-label', 'Your ranking');
                }
                
                globalRankingsList.appendChild(listItem);
            });
        }
        
        // Render global chart
        this.renderGlobalChart();
    },

    renderEUChart: function() {
        const chartContainer = document.getElementById('eu-chart');
        if (!chartContainer) return;
        
        // Clear previous chart
        chartContainer.innerHTML = '';
        
        if (this.state.euRankings.length === 0) {
            chartContainer.innerHTML = '<div class="chart-placeholder">No EU rankings data available</div>';
            return;
        }
        
        // Create SVG element for chart
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'EU Rankings Chart');
        
        // Calculate max score for scaling
        const maxScore = Math.max(...this.state.euRankings.map(entry => entry.calculatedScore), 100);
        
        // Create bars for each ranking
        const barWidth = 100 / Math.max(this.state.euRankings.length, 1);
        const barPadding = barWidth * 0.1;
        
        this.state.euRankings.forEach((entry, index) => {
            // Calculate bar height as percentage of max score
            const barHeight = (entry.calculatedScore / maxScore) * 100;
            const x = index * barWidth;
            const y = 100 - barHeight;
            
            // Create bar group
            const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            barGroup.setAttribute('class', 'chart-bar');
            barGroup.setAttribute('data-player', entry.name);
            barGroup.setAttribute('data-score', entry.calculatedScore);
            
            // Create bar rectangle
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x + barPadding);
            bar.setAttribute('y', y);
            bar.setAttribute('width', barWidth - (2 * barPadding));
            bar.setAttribute('height', barHeight);
            
            // Set bar color based on tier
            const tier = this.getTierForScore(entry.calculatedScore);
            bar.setAttribute('fill', tier.color);
            
            // Highlight current player's bar
            if (this.state.playerEntry && entry.name === this.state.playerEntry.name && 
                entry.timestamp === this.state.playerEntry.timestamp) {
                bar.setAttribute('stroke', this.config.chartColors.eu.highlight);
                bar.setAttribute('stroke-width', '2');
                
                // Add animation
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'opacity');
                animate.setAttribute('values', '0.7;1;0.7');
                animate.setAttribute('dur', '2s');
                animate.setAttribute('repeatCount', '3');
                bar.appendChild(animate);
            }
            
            // Add bar to group
            barGroup.appendChild(bar);
            
            // Add label for country
            const countryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            countryLabel.setAttribute('x', x + (barWidth / 2));
            countryLabel.setAttribute('y', 98);
            countryLabel.setAttribute('text-anchor', 'middle');
            countryLabel.setAttribute('font-size', '8');
            countryLabel.setAttribute('fill', this.config.chartColors.eu.text);
            countryLabel.textContent = entry.country;
            barGroup.appendChild(countryLabel);
            
            // Add to SVG
            svg.appendChild(barGroup);
            
            // Add animation for new entries
            if (this.getRankChange(entry.name, this.state.euRankings, this.state.previousEuRankings) === 'new') {
                const animateY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateY.setAttribute('attributeName', 'y');
                animateY.setAttribute('from', '100');
                animateY.setAttribute('to', y);
                animateY.setAttribute('dur', '0.5s');
                animateY.setAttribute('fill', 'freeze');
                bar.appendChild(animateY);
                
                const animateHeight = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateHeight.setAttribute('attributeName', 'height');
                animateHeight.setAttribute('from', '0');
                animateHeight.setAttribute('to', barHeight);
                animateHeight.setAttribute('dur', '0.5s');
                animateHeight.setAttribute('fill', 'freeze');
                bar.appendChild(animateHeight);
            }
        });
        
        // Add chart to container
        chartContainer.appendChild(svg);
    },

    renderGlobalChart: function() {
        const chartContainer = document.getElementById('global-chart');
        if (!chartContainer) return;
        
        // Clear previous chart
        chartContainer.innerHTML = '';
        
        if (this.state.globalRankings.length === 0) {
            chartContainer.innerHTML = '<div class="chart-placeholder">No global rankings data available</div>';
            return;
        }
        
        // Create SVG element for chart
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Global Rankings Chart');
        
        // Calculate max score for scaling
        const maxScore = Math.max(...this.state.globalRankings.map(entry => entry.calculatedScore), 100);
        
        // Create bars for each ranking
        const barWidth = 100 / Math.max(this.state.globalRankings.length, 1);
        const barPadding = barWidth * 0.1;
        
        this.state.globalRankings.forEach((entry, index) => {
            // Calculate bar height as percentage of max score
            const barHeight = (entry.calculatedScore / maxScore) * 100;
            const x = index * barWidth;
            const y = 100 - barHeight;
            
            // Create bar group
            const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            barGroup.setAttribute('class', 'chart-bar');
            barGroup.setAttribute('data-player', entry.name);
            barGroup.setAttribute('data-score', entry.calculatedScore);
            
            // Create bar rectangle
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x + barPadding);
            bar.setAttribute('y', y);
            bar.setAttribute('width', barWidth - (2 * barPadding));
            bar.setAttribute('height', barHeight);
            
            // Set bar color based on tier
            const tier = this.getTierForScore(entry.calculatedScore);
            bar.setAttribute('fill', tier.color);
            
            // Highlight current player's bar
            if (this.state.playerEntry && entry.name === this.state.playerEntry.name && 
                entry.timestamp === this.state.playerEntry.timestamp) {
                bar.setAttribute('stroke', this.config.chartColors.global.highlight);
                bar.setAttribute('stroke-width', '2');
                
                // Add animation
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'opacity');
                animate.setAttribute('values', '0.7;1;0.7');
                animate.setAttribute('dur', '2s');
                animate.setAttribute('repeatCount', '3');
                bar.appendChild(animate);
            }
            
            // Add bar to group
            barGroup.appendChild(bar);
            
            // Add label for country
            const countryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            countryLabel.setAttribute('x', x + (barWidth / 2));
            countryLabel.setAttribute('y', 98);
            countryLabel.setAttribute('text-anchor', 'middle');
            countryLabel.setAttribute('font-size', '8');
            countryLabel.setAttribute('fill', this.config.chartColors.global.text);
            countryLabel.textContent = entry.country;
            barGroup.appendChild(countryLabel);
            
            // Add to SVG
            svg.appendChild(barGroup);
            
            // Add animation for new entries
            if (this.getRankChange(entry.name, this.state.globalRankings, this.state.previousGlobalRankings) === 'new') {
                const animateY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateY.setAttribute('attributeName', 'y');
                animateY.setAttribute('from', '100');
                animateY.setAttribute('to', y);
                animateY.setAttribute('dur', '0.5s');
                animateY.setAttribute('fill', 'freeze');
                bar.appendChild(animateY);
                
                const animateHeight = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateHeight.setAttribute('attributeName', 'height');
                animateHeight.setAttribute('from', '0');
                animateHeight.setAttribute('to', barHeight);
                animateHeight.setAttribute('dur', '0.5s');
                animateHeight.setAttribute('fill', 'freeze');
                bar.appendChild(animateHeight);
            }
        });
        
        // Add chart to container
        chartContainer.appendChild(svg);
    },

    // ===== Animation Effects =====
    animateRankingChanges: function() {
        // Animate EU rankings changes
        this.animateListChanges('eu-rankings', this.state.euRankings, this.state.previousEuRankings);
        
        // Animate global rankings changes
        this.animateListChanges('global-rankings', this.state.globalRankings, this.state.previousGlobalRankings);
        
        return this;
    },

    animateListChanges: function(listId, currentRankings, previousRankings) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        const listItems = list.querySelectorAll('li');
        
        listItems.forEach((item, index) => {
            if (index >= currentRankings.length) return;
            
            const entry = currentRankings[index];
            const rankChange = this.getRankChange(entry.name, currentRankings, previousRankings);
            
            // Apply animations based on rank change
            if (rankChange === 'up') {
                item.style.animation = 'slideIn 0.5s ease-out, rankingHighlight 2s ease';
            } else if (rankChange === 'down') {
                item.style.animation = 'slideIn 0.5s ease-out, rankingHighlight 2s ease';
            } else if (rankChange === 'new') {
                item.style.animation = 'fadeIn 0.8s ease-out';
            }
            
            // Highlight current player
            if (this.state.playerEntry && entry.name === this.state.playerEntry.name && 
                entry.timestamp === this.state.playerEntry.timestamp) {
                item.classList.add('highlight-animation');
            }
        });
    },

    // ===== Integration with Main Game =====
    updateRankingsAfterQuiz: function(playerData) {
        // Add player score to rankings
        this.addPlayerScore(playerData);
        
        // Render updated leaderboards
        this.renderLeaderboards();
        
        // Animate ranking changes
        this.animateRankingChanges();
        
        return this;
    },

    // ===== Test Data Generation =====
    generateTestData: function(euCount = 5, globalCount = 5) {
        // Only use in development/testing
        console.warn('Generating test ranking data - for development only');
        
        // Sample EU countries
        const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
        
        // Sample non-EU countries
        const nonEuCountries = ['US', 'CA', 'UK', 'JP', 'AU', 'BR', 'IN', 'ZA', 'MX', 'AR'];
        
        // Sample names
        const names = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Morgan', 'Reese'];
        
        // Generate EU rankings
        this.state.euRankings = [];
        for (let i = 0; i < euCount; i++) {
            const score = Math.floor(Math.random() * 5) + 1;
            const country = euCountries[Math.floor(Math.random() * euCountries.length)];
            const name = names[Math.floor(Math.random() * names.length)] + '_' + i;
            
            this.state.euRankings.push({
                name: name,
                country: country,
                score: score,
                maxScore: 5,
                percentage: (score / 5) * 100,
                calculatedScore: this.calculateScore(score, 5, 30 + Math.floor(Math.random() * 60), 'mixed'),
                difficulty: 'mixed',
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
            });
        }
        
        // Sort EU rankings
        this.sortRankings(this.state.euRankings);
        
        // Generate global rankings (include some EU entries)
        this.state.globalRankings = [];
        
        // Add some EU entries to global rankings
        for (let i = 0; i < Math.min(2, this.state.euRankings.length); i++) {
            this.state.globalRankings.push(this.state.euRankings[i]);
        }
        
        // Add non-EU entries
        for (let i = 0; i < globalCount - Math.min(2, this.state.euRankings.length); i++) {
            const score = Math.floor(Math.random() * 5) + 1;
            const country = nonEuCountries[Math.floor(Math.random() * nonEuCountries.length)];
            const name = names[Math.floor(Math.random() * names.length)] + '_G' + i;
            
            this.state.globalRankings.push({
                name: name,
                country: country,
                score: score,
                maxScore: 5,
                percentage: (score / 5) * 100,
                calculatedScore: this.calculateScore(score, 5, 30 + Math.floor(Math.random() * 60), 'mixed'),
                difficulty: 'mixed',
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
            });
        }
        
        // Sort global rankings
        this.sortRankings(this.state.globalRankings);
        
        // Save to storage
        this.saveRankings();
        
        // Store previous rankings (empty for now)
        this.state.previousEuRankings = [];
        this.state.previousGlobalRankings = [];
        
        return this;
    },

    resetRankings: function() {
        // Clear all rankings
        this.state.euRankings = [];
        this.state.globalRankings = [];
        this.state.previousEuRankings = [];
        this.state.previousGlobalRankings = [];
        this.state.playerEntry = null;
        
        // Save empty rankings
        this.saveRankings();
        
        // Render empty leaderboards
        this.renderLeaderboards();
        
        return this;
    },

    // ===== Filtering and Display Options =====
    filterRankingsByDifficulty: function(difficulty) {
        // Filter EU rankings
        const filteredEuRankings = this.state.euRankings.filter(entry => 
            entry.difficulty === difficulty || difficulty === 'all'
        );
        
        // Filter global rankings
        const filteredGlobalRankings = this.state.globalRankings.filter(entry => 
            entry.difficulty === difficulty || difficulty === 'all'
        );
        
        // Return filtered rankings
        return {
            eu: filteredEuRankings,
            global: filteredGlobalRankings
        };
    },

    displayFilteredRankings: function(difficulty) {
        // Get filtered rankings
        const filtered = this.filterRankingsByDifficulty(difficulty);
        
        // Store current rankings
        const originalEu = this.state.euRankings;
        const originalGlobal = this.state.globalRankings;
        
        // Temporarily set filtered rankings
        this.state.euRankings = filtered.eu;
        this.state.globalRankings = filtered.global;
        
        // Render with filtered data
        this.renderLeaderboards();
        
        // Restore original rankings
        this.state.euRankings = originalEu;
        this.state.globalRankings = originalGlobal;
        
        return this;
    }
};

// ===== Integration with Main Game =====
// This section connects the rankings system with the main game

// Extend GDPRGame with rankings functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize rankings system after main game is loaded
    if (typeof GDPRGame !== 'undefined') {
        // Wait for main game to initialize
        const originalEndGame = GDPRGame.endGame;
        
        // Override endGame to update rankings
        GDPRGame.endGame = function() {
            // Call original endGame function
            originalEndGame.call(this);
            
            // Initialize rankings if needed
            if (!GDPRRankings.state.isInitialized) {
                GDPRRankings.init();
            }
            
            // Create player data for rankings
            const playerData = {
                name: this.state.player.name,
                country: this.state.player.country,
                isEU: this.state.player.isEU,
                score: this.state.currentGame.score,
                maxScore: this.state.currentGame.questions.length,
                timeTaken: Math.floor((this.state.currentGame.endTime - this.state.currentGame.startTime) / 1000),
                difficulty: this.state.currentGame.difficulty
            };
            
            // Update rankings with player data
            GDPRRankings.updateRankingsAfterQuiz(playerData);
        };
        
        // Override displayLeaderboards to use our implementation
        GDPRGame.displayLeaderboards = function() {
            // Initialize rankings if needed
            if (!GDPRRankings.state.isInitialized) {
                GDPRRankings.init();
            }
            
            // Render leaderboards
            GDPRRankings.renderLeaderboards();
        };
        
        // Override renderLeaderboardCharts to use our implementation
        GDPRGame.renderLeaderboardCharts = function() {
            // Initialize rankings if needed
            if (!GDPRRankings.state.isInitialized) {
                GDPRRankings.init();
            }
            
            // Render charts
            GDPRRankings.renderEUChart();
            GDPRRankings.renderGlobalChart();
        };
        
        console.log('Rankings system integrated with main game');
    } else {
        console.error('Main game not found - rankings system cannot be integrated');
    }
});