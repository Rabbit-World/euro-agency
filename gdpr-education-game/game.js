/**
 * GDPR Knowledge Challenge - Game Logic
 * 
 * This file contains the core game mechanics, data structures, and UI interactions
 * for the GDPR educational game.
 */

// ===== Game Namespace =====
const GDPRGame = {
    // Game configuration
    config: {
        questionsPerSession: 5,
        timerDuration: 30, // seconds per question
        timerEnabled: true,
        storageKeys: {
            playerData: 'gdpr_player_data',
            leaderboard: 'gdpr_leaderboard',
            preferences: 'gdpr_preferences',
            consent: 'gdpr_consent'
        }
    },

    // Game state
    state: {
        player: {
            name: '',
            country: '',
            isEU: false
        },
        currentGame: {
            difficulty: 'mixed',
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            startTime: null,
            endTime: null,
            selectedAnswers: [],
            timer: null,
            timeRemaining: 0
        },
        consent: {
            necessary: false,
            analytics: false,
            preferences: false
        },
        quizData: null,
        leaderboard: {
            eu: [],
            global: []
        }
    },

    // ===== Initialization =====
    init: function() {
        // Load quiz data
        this.loadQuizData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check for consent
        this.checkConsent();
        
        // Load saved preferences if consent given
        this.loadPreferences();
        
        // Load leaderboard data
        this.loadLeaderboard();
        
        console.log('GDPR Knowledge Challenge initialized');
    },

    // ===== Data Loading =====
    loadQuizData: function() {
        // In a real application, this would be an API call
        // For now, we'll assume the data is already loaded in the page
        fetch('gdpr_quiz_questions.json')
            .then(response => response.json())
            .then(data => {
                this.state.quizData = data;
                console.log('Quiz data loaded successfully');
            })
            .catch(error => {
                console.error('Error loading quiz data:', error);
                // Fallback for testing - would be removed in production
                this.useFallbackQuizData();
            });
    },

    useFallbackQuizData: function() {
        // This is only used if the JSON file fails to load
        console.warn('Using fallback quiz data');
        // The fallback data would be minimal for testing purposes
        this.state.quizData = {
            quiz_title: "GDPR Knowledge Challenge",
            quiz_description: "Test your knowledge of GDPR",
            questions: [
                {
                    id: 1,
                    difficulty: "easy",
                    question: "What does GDPR stand for?",
                    options: [
                        "General Data Protection Regulation",
                        "Global Data Privacy Rules",
                        "Government Data Processing Requirements",
                        "General Digital Privacy Rights"
                    ],
                    correct_answer: "General Data Protection Regulation",
                    explanation: "GDPR stands for General Data Protection Regulation."
                }
            ]
        };
    },

    // ===== Event Listeners =====
    setupEventListeners: function() {
        // GDPR Consent Banner
        document.getElementById('accept-all').addEventListener('click', () => this.handleConsent('all'));
        document.getElementById('accept-necessary').addEventListener('click', () => this.handleConsent('necessary'));
        document.getElementById('customize-settings').addEventListener('click', () => this.showConsentCustomization());
        
        // Player Form
        document.getElementById('player-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGameStart();
        });
        
        // Country selection to determine if player is from EU
        document.getElementById('country-select').addEventListener('change', (e) => {
            const country = e.target.value;
            this.state.player.isEU = country !== 'non-eu';
        });
        
        // Quiz navigation
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        
        // Results screen
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
        document.getElementById('share-results').addEventListener('click', () => this.shareResults());
        
        // Privacy policy
        document.getElementById('privacy-policy').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrivacyPolicy();
        });
    },

    // ===== Consent Management =====
    checkConsent: function() {
        const consentData = this.getFromStorage(this.config.storageKeys.consent);
        
        if (consentData) {
            this.state.consent = JSON.parse(consentData);
            document.getElementById('gdpr-consent').style.display = 'none';
        } else {
            document.getElementById('gdpr-consent').style.display = 'block';
        }
    },

    handleConsent: function(level) {
        switch(level) {
            case 'all':
                this.state.consent = {
                    necessary: true,
                    analytics: true,
                    preferences: true
                };
                break;
            case 'necessary':
                this.state.consent = {
                    necessary: true,
                    analytics: false,
                    preferences: false
                };
                break;
            case 'custom':
                // This would be set by the customization form
                break;
        }
        
        // Save consent to storage
        this.saveToStorage(this.config.storageKeys.consent, JSON.stringify(this.state.consent));
        
        // Hide consent banner
        document.getElementById('gdpr-consent').style.display = 'none';
    },

    showConsentCustomization: function() {
        // In a real implementation, this would show a modal with checkboxes
        // For this demo, we'll just simulate it
        alert('In a full implementation, this would show a modal with consent options.');
        this.handleConsent('necessary'); // Default to necessary only
    },

    // ===== Game Start =====
    handleGameStart: function() {
        // Get player info
        this.state.player.name = document.getElementById('player-name').value;
        this.state.player.country = document.getElementById('country-select').value;
        this.state.currentGame.difficulty = document.getElementById('difficulty-select').value;
        
        // Select questions based on difficulty
        this.selectQuestions();
        
        // Initialize game state
        this.state.currentGame.currentQuestionIndex = 0;
        this.state.currentGame.score = 0;
        this.state.currentGame.startTime = new Date();
        this.state.currentGame.selectedAnswers = [];
        
        // Switch to quiz screen
        this.showScreen('quiz-screen');
        
        // Display first question
        this.displayCurrentQuestion();
    },

    selectQuestions: function() {
        if (!this.state.quizData) {
            console.error('Quiz data not loaded');
            return;
        }
        
        const allQuestions = this.state.quizData.questions;
        let filteredQuestions = [];
        
        // Filter questions based on difficulty
        if (this.state.currentGame.difficulty === 'mixed') {
            filteredQuestions = [...allQuestions];
        } else {
            filteredQuestions = allQuestions.filter(q => q.difficulty === this.state.currentGame.difficulty);
        }
        
        // Shuffle and select questions
        this.state.currentGame.questions = this.shuffleArray(filteredQuestions)
            .slice(0, this.config.questionsPerSession);
        
        // Update total questions display
        document.getElementById('total-questions').textContent = this.state.currentGame.questions.length;
    },

    // ===== Question Display and Handling =====
    displayCurrentQuestion: function() {
        const currentIndex = this.state.currentGame.currentQuestionIndex;
        const question = this.state.currentGame.questions[currentIndex];
        
        if (!question) {
            console.error('No question found at index', currentIndex);
            return;
        }
        
        // Update question number
        document.getElementById('current-question').textContent = currentIndex + 1;
        
        // Display question
        document.getElementById('question-title').textContent = question.question;
        
        // Clear previous options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        // Add options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.setAttribute('data-index', index);
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Clear feedback
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = '';
        feedbackContainer.classList.remove('visible');
        
        // Disable next button until answer is selected
        document.getElementById('next-question').disabled = true;
        
        // Start timer if enabled
        if (this.config.timerEnabled) {
            this.startTimer();
        }
    },

    selectAnswer: function(optionIndex) {
        // Stop timer
        this.stopTimer();
        
        const currentQuestion = this.state.currentGame.questions[this.state.currentGame.currentQuestionIndex];
        const selectedOption = currentQuestion.options[optionIndex];
        const isCorrect = selectedOption === currentQuestion.correct_answer;
        
        // Store answer
        this.state.currentGame.selectedAnswers.push({
            questionId: currentQuestion.id,
            selectedOption: selectedOption,
            isCorrect: isCorrect
        });
        
        // Update score if correct
        if (isCorrect) {
            this.state.currentGame.score++;
            document.getElementById('current-score').textContent = this.state.currentGame.score;
        }
        
        // Highlight selected answer
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            const index = parseInt(option.getAttribute('data-index'));
            
            if (index === optionIndex) {
                option.classList.add('selected');
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            
            // Disable all options
            option.style.pointerEvents = 'none';
            
            // Show correct answer
            if (currentQuestion.options[index] === currentQuestion.correct_answer) {
                option.classList.add('correct');
            }
        });
        
        // Show feedback
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = `
            <p><strong>${isCorrect ? 'Correct!' : 'Incorrect!'}</strong></p>
            <p>${currentQuestion.explanation}</p>
        `;
        feedbackContainer.classList.add('visible');
        
        // Enable next button
        document.getElementById('next-question').disabled = false;
    },

    nextQuestion: function() {
        this.state.currentGame.currentQuestionIndex++;
        
        if (this.state.currentGame.currentQuestionIndex >= this.state.currentGame.questions.length) {
            this.endGame();
        } else {
            this.displayCurrentQuestion();
        }
    },

    // ===== Timer Functions =====
    startTimer: function() {
        // Clear any existing timer
        this.stopTimer();
        
        // Set initial time
        this.state.currentGame.timeRemaining = this.config.timerDuration;
        document.getElementById('timer-value').textContent = this.state.currentGame.timeRemaining;
        
        // Start timer
        this.state.currentGame.timer = setInterval(() => {
            this.state.currentGame.timeRemaining--;
            document.getElementById('timer-value').textContent = this.state.currentGame.timeRemaining;
            
            // Time's up
            if (this.state.currentGame.timeRemaining <= 0) {
                this.stopTimer();
                this.timeUp();
            }
        }, 1000);
    },

    stopTimer: function() {
        if (this.state.currentGame.timer) {
            clearInterval(this.state.currentGame.timer);
            this.state.currentGame.timer = null;
        }
    },

    timeUp: function() {
        // Auto-select wrong answer or skip
        const currentQuestion = this.state.currentGame.questions[this.state.currentGame.currentQuestionIndex];
        
        // Store answer as timed out
        this.state.currentGame.selectedAnswers.push({
            questionId: currentQuestion.id,
            selectedOption: null,
            isCorrect: false,
            timedOut: true
        });
        
        // Show feedback
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = `
            <p><strong>Time's up!</strong></p>
            <p>The correct answer was: ${currentQuestion.correct_answer}</p>
            <p>${currentQuestion.explanation}</p>
        `;
        feedbackContainer.classList.add('visible');
        
        // Highlight correct answer
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            const index = parseInt(option.getAttribute('data-index'));
            
            // Disable all options
            option.style.pointerEvents = 'none';
            
            // Show correct answer
            if (currentQuestion.options[index] === currentQuestion.correct_answer) {
                option.classList.add('correct');
            }
        });
        
        // Enable next button
        document.getElementById('next-question').disabled = false;
    },

    // ===== Game End =====
    endGame: function() {
        // Record end time
        this.state.currentGame.endTime = new Date();
        
        // Calculate time taken
        const timeTaken = Math.floor((this.state.currentGame.endTime - this.state.currentGame.startTime) / 1000);
        
        // Update results screen
        document.getElementById('final-score').textContent = this.state.currentGame.score;
        document.getElementById('max-score').textContent = this.state.currentGame.questions.length;
        document.getElementById('time-taken').textContent = timeTaken;
        
        // Set performance message
        const performancePercentage = (this.state.currentGame.score / this.state.currentGame.questions.length) * 100;
        let performanceMessage = '';
        
        if (performancePercentage === 100) {
            performanceMessage = 'Perfect! You\'re a GDPR expert!';
        } else if (performancePercentage >= 80) {
            performanceMessage = 'Great job! You have a strong understanding of GDPR.';
        } else if (performancePercentage >= 60) {
            performanceMessage = 'Good effort! You know the basics of GDPR.';
        } else if (performancePercentage >= 40) {
            performanceMessage = 'You\'re on your way to understanding GDPR. Keep learning!';
        } else {
            performanceMessage = 'You might want to review GDPR basics. Keep trying!';
        }
        
        document.getElementById('performance-message').textContent = performanceMessage;
        
        // Save player data if consent given
        if (this.state.consent.preferences) {
            this.savePlayerData();
        }
        
        // Update leaderboards
        this.updateLeaderboards();
        
        // Show results screen
        this.showScreen('results-screen');
    },

    // ===== Player Data Management =====
    savePlayerData: function() {
        const playerData = {
            name: this.state.player.name,
            country: this.state.player.country,
            isEU: this.state.player.isEU,
            difficulty: this.state.currentGame.difficulty,
            score: this.state.currentGame.score,
            maxScore: this.state.currentGame.questions.length,
            timeTaken: Math.floor((this.state.currentGame.endTime - this.state.currentGame.startTime) / 1000),
            timestamp: new Date().toISOString()
        };
        
        // Get existing data
        let existingData = this.getFromStorage(this.config.storageKeys.playerData);
        let playerHistory = [];
        
        if (existingData) {
            try {
                playerHistory = JSON.parse(existingData);
                if (!Array.isArray(playerHistory)) {
                    playerHistory = [];
                }
            } catch (e) {
                console.error('Error parsing player data:', e);
                playerHistory = [];
            }
        }
        
        // Add new data
        playerHistory.push(playerData);
        
        // Save back to storage
        this.saveToStorage(this.config.storageKeys.playerData, JSON.stringify(playerHistory));
    },

    // ===== Leaderboard Management =====
    loadLeaderboard: function() {
        // In a real application, this would be an API call
        // For now, we'll use localStorage as a fake backend
        const leaderboardData = this.getFromStorage(this.config.storageKeys.leaderboard);
        
        if (leaderboardData) {
            try {
                this.state.leaderboard = JSON.parse(leaderboardData);
            } catch (e) {
                console.error('Error parsing leaderboard data:', e);
                this.initializeLeaderboard();
            }
        } else {
            this.initializeLeaderboard();
        }
    },

    initializeLeaderboard: function() {
        // Create empty leaderboards
        this.state.leaderboard = {
            eu: [],
            global: []
        };
        
        // Save to storage
        this.saveToStorage(this.config.storageKeys.leaderboard, JSON.stringify(this.state.leaderboard));
    },

    updateLeaderboards: function() {
        // Create player entry
        const playerEntry = {
            name: this.state.player.name,
            country: this.state.player.country,
            score: this.state.currentGame.score,
            maxScore: this.state.currentGame.questions.length,
            percentage: (this.state.currentGame.score / this.state.currentGame.questions.length) * 100,
            difficulty: this.state.currentGame.difficulty,
            timestamp: new Date().toISOString()
        };
        
        // Add to appropriate leaderboard
        if (this.state.player.isEU) {
            this.state.leaderboard.eu.push(playerEntry);
            this.state.leaderboard.eu.sort((a, b) => b.percentage - a.percentage);
            this.state.leaderboard.eu = this.state.leaderboard.eu.slice(0, 10); // Keep top 10
        }
        
        // Add to global leaderboard
        this.state.leaderboard.global.push(playerEntry);
        this.state.leaderboard.global.sort((a, b) => b.percentage - a.percentage);
        this.state.leaderboard.global = this.state.leaderboard.global.slice(0, 10); // Keep top 10
        
        // Save updated leaderboards
        if (this.state.consent.preferences) {
            this.saveToStorage(this.config.storageKeys.leaderboard, JSON.stringify(this.state.leaderboard));
        }
        
        // Display leaderboards
        this.displayLeaderboards();
    },

    displayLeaderboards: function() {
        // Display EU leaderboard
        const euRankingsList = document.getElementById('eu-rankings');
        euRankingsList.innerHTML = '';
        
        if (this.state.leaderboard.eu.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No rankings yet';
            euRankingsList.appendChild(listItem);
        } else {
            this.state.leaderboard.eu.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${index + 1}. ${entry.name} (${entry.country})</span>
                    <span>${entry.score}/${entry.maxScore} (${Math.round(entry.percentage)}%)</span>
                `;
                
                // Highlight current player
                if (entry.name === this.state.player.name && 
                    entry.timestamp === this.state.currentGame.endTime.toISOString()) {
                    listItem.classList.add('highlight-animation');
                }
                
                euRankingsList.appendChild(listItem);
            });
        }
        
        // Display global leaderboard
        const globalRankingsList = document.getElementById('global-rankings');
        globalRankingsList.innerHTML = '';
        
        if (this.state.leaderboard.global.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No rankings yet';
            globalRankingsList.appendChild(listItem);
        } else {
            this.state.leaderboard.global.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${index + 1}. ${entry.name} (${entry.country})</span>
                    <span>${entry.score}/${entry.maxScore} (${Math.round(entry.percentage)}%)</span>
                `;
                
                // Highlight current player
                if (entry.name === this.state.player.name && 
                    entry.timestamp === this.state.currentGame.endTime.toISOString()) {
                    listItem.classList.add('highlight-animation');
                }
                
                globalRankingsList.appendChild(listItem);
            });
        }
        
        // In a full implementation, we would also render charts here
        this.renderLeaderboardCharts();
    },

    renderLeaderboardCharts: function() {
        // This would use a charting library in a real implementation
        // For now, we'll just add placeholder elements
        document.getElementById('eu-chart').innerHTML = '<div class="chart-placeholder">EU Leaderboard Chart</div>';
        document.getElementById('global-chart').innerHTML = '<div class="chart-placeholder">Global Leaderboard Chart</div>';
    },

    // ===== Preferences Management =====
    loadPreferences: function() {
        if (!this.state.consent.preferences) {
            return;
        }
        
        const preferencesData = this.getFromStorage(this.config.storageKeys.preferences);
        
        if (preferencesData) {
            try {
                const preferences = JSON.parse(preferencesData);
                
                // Apply preferences
                if (preferences.playerName) {
                    document.getElementById('player-name').value = preferences.playerName;
                }
                
                if (preferences.country) {
                    document.getElementById('country-select').value = preferences.country;
                }
                
                if (preferences.difficulty) {
                    document.getElementById('difficulty-select').value = preferences.difficulty;
                }
                
                // Update game state
                this.state.currentGame.difficulty = preferences.difficulty || 'mixed';
                
            } catch (e) {
                console.error('Error parsing preferences:', e);
            }
        }
    },

    savePreferences: function() {
        if (!this.state.consent.preferences) {
            return;
        }
        
        const preferences = {
            playerName: this.state.player.name,
            country: this.state.player.country,
            difficulty: this.state.currentGame.difficulty
        };
        
        this.saveToStorage(this.config.storageKeys.preferences, JSON.stringify(preferences));
    },

    // ===== UI Helpers =====
    showScreen: function(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.game-screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        document.getElementById(screenId).classList.add('active');
    },

    resetGame: function() {
        // Save preferences if consent given
        if (this.state.consent.preferences) {
            this.savePreferences();
        }
        
        // Reset game state
        this.state.currentGame.questions = [];
        this.state.currentGame.currentQuestionIndex = 0;
        this.state.currentGame.score = 0;
        this.state.currentGame.startTime = null;
        this.state.currentGame.endTime = null;
        this.state.currentGame.selectedAnswers = [];
        
        // Show welcome screen
        this.showScreen('welcome-screen');
    },

    shareResults: function() {
        // In a real implementation, this would open social sharing options
        // For now, we'll just simulate it
        alert(`Share your score: ${this.state.currentGame.score}/${this.state.currentGame.questions.length} on the GDPR Knowledge Challenge!`);
    },

    showPrivacyPolicy: function() {
        // In a real implementation, this would show the privacy policy
        // For now, we'll just simulate it
        alert('This would display the full privacy policy in a real implementation.');
    },

    // ===== Storage Helpers =====
    saveToStorage: function(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    getFromStorage: function(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    // ===== Utility Functions =====
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
};

// ===== Fake API Endpoints for Testing =====
const GDPRGameAPI = {
    // These functions simulate API endpoints for future server integration
    
    getLeaderboard: function(type = 'global') {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const leaderboardData = localStorage.getItem(GDPRGame.config.storageKeys.leaderboard);
                if (leaderboardData) {
                    const leaderboards = JSON.parse(leaderboardData);
                    resolve(leaderboards[type] || []);
                } else {
                    resolve([]);
                }
            }, 300);
        });
    },
    
    submitScore: function(playerData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Score submitted to API:', playerData);
                resolve({ success: true, message: 'Score submitted successfully' });
            }, 500);
        });
    },
    
    getQuestions: function(difficulty = 'mixed', count = 5) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                fetch('gdpr_quiz_questions.json')
                    .then(response => response.json())
                    .then(data => {
                        let questions = data.questions;
                        
                        // Filter by difficulty if not mixed
                        if (difficulty !== 'mixed') {
                            questions = questions.filter(q => q.difficulty === difficulty);
                        }
                        
                        // Shuffle and limit
                        questions = GDPRGame.shuffleArray(questions).slice(0, count);
                        
                        resolve(questions);
                    })
                    .catch(error => {
                        console.error('Error fetching questions:', error);
                        resolve([]);
                    });
            }, 300);
        });
    }
};

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    GDPRGame.init();
});