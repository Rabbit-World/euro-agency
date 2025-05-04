/**
 * Euro-Agency Gamification System
 * Interactive elements functionality (quizzes, challenges, timers)
 */

// Interactive elements namespace
const GamificationInteractive = (function() {
  'use strict';

  // Private variables
  let _config = {};
  let _initialized = false;
  let _activeQuiz = null;
  let _activeChallenge = null;
  let _timers = {};

  /**
   * Initialize the interactive elements
   * @param {Object} config - Configuration options
   * @returns {Promise} - Promise that resolves when initialization is complete
   */
  const init = function(config = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Default configuration
        _config = {
          quizSelector: '.gamification-quiz',
          challengeSelector: '.gamification-challenge',
          timerSelector: '.gamification-timer',
          language: document.documentElement.lang || 'en',
          ...config
        };

        // Initialize quizzes
        _initQuizzes();
        
        // Initialize challenges
        _initChallenges();
        
        // Initialize timers
        _initTimers();
        
        // Mark as initialized
        _initialized = true;
        
        // Resolve the promise
        resolve();
      } catch (error) {
        console.error('Error initializing interactive elements:', error);
        reject(error);
      }
    });
  };

  /**
   * Initialize quizzes
   * @private
   */
  const _initQuizzes = function() {
    const quizElements = document.querySelectorAll(_config.quizSelector);
    
    quizElements.forEach(quizElement => {
      // Get quiz ID
      const quizId = quizElement.dataset.quizId;
      if (!quizId) {
        console.error('Quiz element missing data-quiz-id attribute:', quizElement);
        return;
      }
      
      // Set up quiz form
      const form = quizElement.querySelector('form');
      if (form) {
        form.classList.add('quiz-form');
        form.dataset.quizId = quizId;
        
        // Add submit event listener
        form.addEventListener('submit', _handleQuizSubmit);
      }
      
      // Set up quiz navigation
      const nextButtons = quizElement.querySelectorAll('.quiz-next');
      nextButtons.forEach(button => {
        button.addEventListener('click', _handleQuizNavigation);
      });
      
      const prevButtons = quizElement.querySelectorAll('.quiz-prev');
      prevButtons.forEach(button => {
        button.addEventListener('click', _handleQuizNavigation);
      });
      
      // Initialize quiz timer if present
      const timerElement = quizElement.querySelector('.quiz-timer');
      if (timerElement) {
        const timeLimit = parseInt(timerElement.dataset.timeLimit, 10) || 0;
        if (timeLimit > 0) {
          _initQuizTimer(quizId, timerElement, timeLimit);
        }
      }
    });
  };

  /**
   * Initialize challenges
   * @private
   */
  const _initChallenges = function() {
    const challengeElements = document.querySelectorAll(_config.challengeSelector);
    
    challengeElements.forEach(challengeElement => {
      // Get challenge ID
      const challengeId = challengeElement.dataset.challengeId;
      if (!challengeId) {
        console.error('Challenge element missing data-challenge-id attribute:', challengeElement);
        return;
      }
      
      // Set up challenge buttons
      const startButton = challengeElement.querySelector('.challenge-start');
      if (startButton) {
        startButton.addEventListener('click', _handleChallengeStart);
      }
      
      const completeButton = challengeElement.querySelector('.challenge-complete');
      if (completeButton) {
        completeButton.addEventListener('click', _handleChallengeComplete);
      }
      
      // Initialize challenge timer if present
      const timerElement = challengeElement.querySelector('.challenge-timer');
      if (timerElement) {
        const timeLimit = parseInt(timerElement.dataset.timeLimit, 10) || 0;
        if (timeLimit > 0) {
          // Timer will be initialized when challenge starts
          timerElement.dataset.challengeId = challengeId;
        }
      }
    });
  };

  /**
   * Initialize timers
   * @private
   */
  const _initTimers = function() {
    const timerElements = document.querySelectorAll(_config.timerSelector);
    
    timerElements.forEach(timerElement => {
      // Get timer ID
      const timerId = timerElement.dataset.timerId;
      if (!timerId) {
        console.error('Timer element missing data-timer-id attribute:', timerElement);
        return;
      }
      
      // Get timer duration
      const duration = parseInt(timerElement.dataset.duration, 10) || 0;
      if (duration > 0) {
        // Initialize countdown timer
        _initCountdownTimer(timerId, timerElement, duration);
      } else {
        // Initialize stopwatch timer
        _initStopwatchTimer(timerId, timerElement);
      }
    });
  };

  /**
   * Initialize quiz timer
   * @private
   * @param {string} quizId - Quiz ID
   * @param {Element} timerElement - Timer element
   * @param {number} timeLimit - Time limit in seconds
   */
  const _initQuizTimer = function(quizId, timerElement, timeLimit) {
    // Create timer object
    _timers[quizId] = {
      type: 'quiz',
      element: timerElement,
      timeLimit,
      timeRemaining: timeLimit,
      interval: null,
      startTime: null,
      active: false
    };
    
    // Update timer display
    _updateTimerDisplay(quizId);
    
    // Start timer when quiz starts
    const quizElement = timerElement.closest(_config.quizSelector);
    const startButton = quizElement.querySelector('.quiz-start');
    if (startButton) {
      startButton.addEventListener('click', () => {
        _startTimer(quizId);
      });
    } else {
      // Auto-start if no start button
      _startTimer(quizId);
    }
  };

  /**
   * Initialize challenge timer
   * @private
   * @param {string} challengeId - Challenge ID
   * @param {Element} timerElement - Timer element
   * @param {number} timeLimit - Time limit in seconds
   */
  const _initChallengeTimer = function(challengeId, timerElement, timeLimit) {
    // Create timer object
    _timers[challengeId] = {
      type: 'challenge',
      element: timerElement,
      timeLimit,
      timeRemaining: timeLimit,
      interval: null,
      startTime: null,
      active: false
    };
    
    // Update timer display
    _updateTimerDisplay(challengeId);
    
    // Start timer
    _startTimer(challengeId);
  };

  /**
   * Initialize countdown timer
   * @private
   * @param {string} timerId - Timer ID
   * @param {Element} timerElement - Timer element
   * @param {number} duration - Duration in seconds
   */
  const _initCountdownTimer = function(timerId, timerElement, duration) {
    // Create timer object
    _timers[timerId] = {
      type: 'countdown',
      element: timerElement,
      timeLimit: duration,
      timeRemaining: duration,
      interval: null,
      startTime: null,
      active: false
    };
    
    // Update timer display
    _updateTimerDisplay(timerId);
    
    // Auto-start if specified
    if (timerElement.dataset.autostart === 'true') {
      _startTimer(timerId);
    }
  };

  /**
   * Initialize stopwatch timer
   * @private
   * @param {string} timerId - Timer ID
   * @param {Element} timerElement - Timer element
   */
  const _initStopwatchTimer = function(timerId, timerElement) {
    // Create timer object
    _timers[timerId] = {
      type: 'stopwatch',
      element: timerElement,
      elapsed: 0,
      interval: null,
      startTime: null,
      active: false
    };
    
    // Update timer display
    _updateTimerDisplay(timerId);
    
    // Auto-start if specified
    if (timerElement.dataset.autostart === 'true') {
      _startTimer(timerId);
    }
  };

  /**
   * Start a timer
   * @private
   * @param {string} timerId - Timer ID
   */
  const _startTimer = function(timerId) {
    const timer = _timers[timerId];
    if (!timer || timer.active) {
      return;
    }
    
    // Mark as active
    timer.active = true;
    
    // Set start time
    timer.startTime = Date.now();
    
    // Start interval
    if (timer.type === 'stopwatch') {
      timer.interval = setInterval(() => {
        timer.elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
        _updateTimerDisplay(timerId);
      }, 1000);
    } else {
      timer.interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
        timer.timeRemaining = Math.max(0, timer.timeLimit - elapsed);
        _updateTimerDisplay(timerId);
        
        if (timer.timeRemaining <= 0) {
          _stopTimer(timerId);
          _handleTimerExpired(timerId);
        }
      }, 1000);
    }
    
    // Add active class to element
    timer.element.classList.add('timer-active');
    
    // Trigger timer started event
    _triggerEvent('timerStarted', { timerId, type: timer.type });
  };

  /**
   * Stop a timer
   * @private
   * @param {string} timerId - Timer ID
   */
  const _stopTimer = function(timerId) {
    const timer = _timers[timerId];
    if (!timer || !timer.active) {
      return;
    }
    
    // Clear interval
    clearInterval(timer.interval);
    timer.interval = null;
    
    // Mark as inactive
    timer.active = false;
    
    // Remove active class from element
    timer.element.classList.remove('timer-active');
    
    // Trigger timer stopped event
    _triggerEvent('timerStopped', { 
      timerId, 
      type: timer.type,
      elapsed: timer.type === 'stopwatch' ? timer.elapsed : (timer.timeLimit - timer.timeRemaining)
    });
  };

  /**
   * Reset a timer
   * @private
   * @param {string} timerId - Timer ID
   */
  const _resetTimer = function(timerId) {
    const timer = _timers[timerId];
    if (!timer) {
      return;
    }
    
    // Stop timer if active
    if (timer.active) {
      _stopTimer(timerId);
    }
    
    // Reset values
    if (timer.type === 'stopwatch') {
      timer.elapsed = 0;
    } else {
      timer.timeRemaining = timer.timeLimit;
    }
    
    // Update display
    _updateTimerDisplay(timerId);
    
    // Trigger timer reset event
    _triggerEvent('timerReset', { timerId, type: timer.type });
  };

  /**
   * Update timer display
   * @private
   * @param {string} timerId - Timer ID
   */
  const _updateTimerDisplay = function(timerId) {
    const timer = _timers[timerId];
    if (!timer || !timer.element) {
      return;
    }
    
    let seconds;
    if (timer.type === 'stopwatch') {
      seconds = timer.elapsed;
    } else {
      seconds = timer.timeRemaining;
    }
    
    // Format time
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update element
    timer.element.textContent = formattedTime;
    
    // Add warning class if time is running low
    if (timer.type !== 'stopwatch' && timer.timeRemaining <= 30) {
      timer.element.classList.add('timer-warning');
    } else {
      timer.element.classList.remove('timer-warning');
    }
  };

  /**
   * Handle timer expiration
   * @private
   * @param {string} timerId - Timer ID
   */
  const _handleTimerExpired = function(timerId) {
    const timer = _timers[timerId];
    if (!timer) {
      return;
    }
    
    // Add expired class
    timer.element.classList.add('timer-expired');
    
    // Handle based on timer type
    if (timer.type === 'quiz') {
      _handleQuizTimeExpired(timerId);
    } else if (timer.type === 'challenge') {
      _handleChallengeTimeExpired(timerId);
    }
    
    // Trigger timer expired event
    _triggerEvent('timerExpired', { timerId, type: timer.type });
  };

  /**
   * Handle quiz time expiration
   * @private
   * @param {string} timerId - Timer ID
   */
  const _handleQuizTimeExpired = function(timerId) {
    // Find quiz element
    const quizElement = document.querySelector(`${_config.quizSelector}[data-quiz-id="${timerId}"]`);
    if (!quizElement) {
      return;
    }
    
    // Auto-submit quiz
    const form = quizElement.querySelector('form');
    if (form) {
      // Show time expired message
      const timeExpiredMessage = document.createElement('div');
      timeExpiredMessage.className = 'quiz-time-expired';
      timeExpiredMessage.textContent = 'Time expired! Your answers have been submitted.';
      form.appendChild(timeExpiredMessage);
      
      // Submit form
      setTimeout(() => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }, 1000);
    }
  };

  /**
   * Handle challenge time expiration
   * @private
   * @param {string} timerId - Timer ID
   */
  const _handleChallengeTimeExpired = function(timerId) {
    // Find challenge element
    const challengeElement = document.querySelector(`${_config.challengeSelector}[data-challenge-id="${timerId}"]`);
    if (!challengeElement) {
      return;
    }
    
    // Show time expired message
    const timeExpiredMessage = document.createElement('div');
    timeExpiredMessage.className = 'challenge-time-expired';
    timeExpiredMessage.textContent = 'Time expired! Challenge failed.';
    challengeElement.appendChild(timeExpiredMessage);
    
    // Disable complete button
    const completeButton = challengeElement.querySelector('.challenge-complete');
    if (completeButton) {
      completeButton.disabled = true;
    }
    
    // Add failed class to challenge
    challengeElement.classList.add('challenge-failed');
  };

  /**
   * Handle quiz submission
   * @private
   * @param {Event} event - Form submission event
   */
  const _handleQuizSubmit = function(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Get quiz ID
    const form = event.target;
    const quizId = form.dataset.quizId;
    if (!quizId) {
      return;
    }
    
    // Get quiz element
    const quizElement = form.closest(_config.quizSelector);
    if (!quizElement) {
      return;
    }
    
    // Stop timer if active
    if (_timers[quizId] && _timers[quizId].active) {
      _stopTimer(quizId);
    }
    
    // Calculate score
    const score = _calculateQuizScore(form);
    
    // Show results
    _showQuizResults(quizElement, score);
    
    // Record quiz completion
    _recordQuizCompletion(quizId, score);
  };

  /**
   * Calculate quiz score
   * @private
   * @param {Element} form - Quiz form element
   * @returns {Object} - Score information
   */
  const _calculateQuizScore = function(form) {
    // Get all questions
    const questions = form.querySelectorAll('.quiz-question');
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    
    // Check each question
    questions.forEach(question => {
      const questionType = question.dataset.questionType;
      const questionId = question.dataset.questionId;
      
      if (questionType === 'multiple-choice') {
        // Get selected answer
        const selectedInput = question.querySelector('input[type="radio"]:checked');
        if (selectedInput && selectedInput.dataset.correct === 'true') {
          correctAnswers++;
        }
      } else if (questionType === 'checkbox') {
        // Get all checkboxes
        const checkboxes = question.querySelectorAll('input[type="checkbox"]');
        let allCorrect = true;
        
        checkboxes.forEach(checkbox => {
          const isChecked = checkbox.checked;
          const shouldBeChecked = checkbox.dataset.correct === 'true';
          
          if (isChecked !== shouldBeChecked) {
            allCorrect = false;
          }
        });
        
        if (allCorrect) {
          correctAnswers++;
        }
      } else if (questionType === 'text') {
        // Get text input
        const textInput = question.querySelector('input[type="text"]');
        if (textInput) {
          const userAnswer = textInput.value.trim().toLowerCase();
          const correctAnswer = textInput.dataset.correct.toLowerCase();
          
          if (userAnswer === correctAnswer) {
            correctAnswers++;
          }
        }
      }
    });
    
    // Calculate percentage
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return {
      correctAnswers,
      totalQuestions,
      percentage,
      timeSpent: _timers[form.dataset.quizId] ? 
        (_timers[form.dataset.quizId].timeLimit - _timers[form.dataset.quizId].timeRemaining) : 
        null
    };
  };

  /**
   * Show quiz results
   * @private
   * @param {Element} quizElement - Quiz element
   * @param {Object} score - Score information
   */
  const _showQuizResults = function(quizElement, score) {
    // Create results element
    const resultsElement = document.createElement('div');
    resultsElement.className = 'quiz-results';
    
    // Add score information
    resultsElement.innerHTML = `
      <h3>Quiz Results</h3>
      <div class="score-summary">
        <div class="score-percentage">${score.percentage}%</div>
        <div class="score-details">
          <p>You answered ${score.correctAnswers} out of ${score.totalQuestions} questions correctly.</p>
          ${score.timeSpent !== null ? 
            `<p>Time taken: ${Math.floor(score.timeSpent / 60)}:${(score.timeSpent % 60).toString().padStart(2, '0')}</p>` : 
            ''
          }
        </div>
      </div>
      <div class="score-message">
        ${score.percentage >= 80 ? 
          '<p class="excellent-score">Excellent job!</p>' : 
          score.percentage >= 60 ? 
            '<p class="good-score">Good job!</p>' : 
            '<p class="try-again-score">Keep practicing!</p>'
        }
      </div>
    `;
    
    // Add retry button
    const retryButton = document.createElement('button');
    retryButton.className = 'quiz-retry';
    retryButton.textContent = 'Try Again';
    retryButton.addEventListener('click', () => {
      _resetQuiz(quizElement);
    });
    resultsElement.appendChild(retryButton);
    
    // Hide quiz form
    const form = quizElement.querySelector('form');
    if (form) {
      form.style.display = 'none';
    }
    
    // Add results to quiz element
    quizElement.appendChild(resultsElement);
  };

  /**
   * Reset quiz
   * @private
   * @param {Element} quizElement - Quiz element
   */
  const _resetQuiz = function(quizElement) {
    // Get quiz ID
    const quizId = quizElement.dataset.quizId;
    
    // Reset timer if exists
    if (_timers[quizId]) {
      _resetTimer(quizId);
    }
    
    // Remove results element
    const resultsElement = quizElement.querySelector('.quiz-results');
    if (resultsElement) {
      resultsElement.remove();
    }
    
    // Show form
    const form = quizElement.querySelector('form');
    if (form) {
      form.style.display = '';
      form.reset();
    }
    
    // Remove any time expired messages
    const timeExpiredMessage = quizElement.querySelector('.quiz-time-expired');
    if (timeExpiredMessage) {
      timeExpiredMessage.remove();
    }
  };

  /**
   * Record quiz completion
   * @private
   * @param {string} quizId - Quiz ID
   * @param {Object} score - Score information
   */
  const _recordQuizCompletion = function(quizId, score) {
    // Trigger quiz completed event
    _triggerEvent('quizCompleted', { 
      quizId, 
      score: score.percentage,
      correctAnswers: score.correctAnswers,
      totalQuestions: score.totalQuestions,
      timeSpent: score.timeSpent
    });
    
    // Check if Gamification global object exists
    if (window.Gamification) {
      // Record quiz result in gamification system
      const event = new CustomEvent('gamification:recordQuiz', { 
        detail: {
          quizId,
          score: score.percentage,
          timeSpent: score.timeSpent
        },
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  };

  /**
   * Handle quiz navigation
   * @private
   * @param {Event} event - Click event
   */
  const _handleQuizNavigation = function(event) {
    const button = event.target;
    const quizElement = button.closest(_config.quizSelector);
    if (!quizElement) {
      return;
    }
    
    // Get current question
    const currentQuestion = quizElement.querySelector('.quiz-question.active');
    if (!currentQuestion) {
      return;
    }
    
    // Get direction
    const isNext = button.classList.contains('quiz-next');
    
    // Get all questions
    const questions = Array.from(quizElement.querySelectorAll('.quiz-question'));
    const currentIndex = questions.indexOf(currentQuestion);
    
    // Calculate new index
    let newIndex;
    if (isNext) {
      newIndex = Math.min(questions.length - 1, currentIndex + 1);
    } else {
      newIndex = Math.max(0, currentIndex - 1);
    }
    
    // Skip if no change
    if (newIndex === currentIndex) {
      return;
    }
    
    // Hide current question
    currentQuestion.classList.remove('active');
    
    // Show new question
    questions[newIndex].classList.add('active');
    
    // Update navigation buttons
    const prevButton = quizElement.querySelector('.quiz-prev');
    const nextButton = quizElement.querySelector('.quiz-next');
    const submitButton = quizElement.querySelector('.quiz-submit');
    
    if (prevButton) {
      prevButton.disabled = newIndex === 0;
    }
    
    if (nextButton) {
      nextButton.style.display = newIndex === questions.length - 1 ? 'none' : '';
    }
    
    if (submitButton) {
      submitButton.style.display = newIndex === questions.length - 1 ? '' : 'none';
    }
  };

  /**
   * Handle challenge start
   * @private
   * @param {Event} event - Click event
   */
  const _handleChallengeStart = function(event) {
    const button = event.target;
    const challengeElement = button.closest(_config.challengeSelector);
    if (!challengeElement) {
      return;
    }
    
    // Get challenge ID
    const challengeId = challengeElement.dataset.challengeId;
    if (!challengeId) {
      return;
    }
    
    // Hide start button
    button.style.display = 'none';
    
    // Show challenge content
    const challengeContent = challengeElement.querySelector('.challenge-content');
    if (challengeContent) {
      challengeContent.classList.add('active');
    }
    
    // Show complete button
    const completeButton = challengeElement.querySelector('.challenge-complete');
    if (completeButton) {
      completeButton.style.display = '';
    }
    
    // Initialize timer if present
    const timerElement = challengeElement.querySelector('.challenge-timer');
    if (timerElement) {
      const timeLimit = parseInt(timerElement.dataset.timeLimit, 10) || 0;
      if (timeLimit > 0) {
        _initChallengeTimer(challengeId, timerElement, timeLimit);
      }
    }
    
    // Set active challenge
    _activeChallenge = challengeId;
    
    // Trigger challenge started event
    _triggerEvent('challengeStarted', { challengeId });
  };

  /**
   * Handle challenge completion
   * @private
   * @param {Event} event - Click event
   */
  const _handleChallengeComplete = function(event) {
    const button = event.target;
    const challengeElement = button.closest(_config.challengeSelector);
    if (!challengeElement) {
      return;
    }
    
    // Get challenge ID
    const challengeId = challengeElement.dataset.challengeId;
    if (!challengeId) {
      return;
    }
    
    // Stop timer if active
    if (_timers[challengeId] && _timers[challengeId].active) {
      _stopTimer(challengeId);
    }
    
    // Hide challenge content
    const challengeContent = challengeElement.querySelector('.challenge-content');
    if (challengeContent) {
      challengeContent.classList.remove('active');
    }
    
    // Hide complete button
    button.style.display = 'none';
    
    // Show completion message
    const completionMessage = document.createElement('div');
    completionMessage.className = 'challenge-completion';
    completionMessage.innerHTML = `
      <h3>Challenge Completed!</h3>
      <p>Congratulations on completing this challenge.</p>
    `;
    challengeElement.appendChild(completionMessage);
    
    // Add completed class
    challengeElement.classList.add('challenge-completed');
    
    // Record challenge completion
    _recordChallengeCompletion(challengeId);
    
    // Clear active challenge
    _activeChallenge = null;
  };

  /**
   * Record challenge completion
   * @private
   * @param {string} challengeId - Challenge ID
   */
  const _recordChallengeCompletion = function(challengeId) {
    // Calculate time taken
    let timeTaken = null;
    if (_timers[challengeId]) {
      timeTaken = _timers[challengeId].timeLimit - _timers[challengeId].timeRemaining;
    }
    
    // Trigger challenge completed event
    _triggerEvent('challengeCompleted', { 
      challengeId,
      timeTaken
    });
    
    // Check if Gamification global object exists
    if (window.Gamification) {
      // Record challenge completion in gamification system
      const event = new CustomEvent('gamification:recordChallenge', { 
        detail: {
          challengeId,
          timeTaken
        },
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  };

  /**
   * Trigger a custom event
   * @private
   * @param {string} eventName - Event name
   * @param {Object} data - Event data
   */
  const _triggerEvent = function(eventName, data) {
    const event = new CustomEvent(`gamification-interactive:${eventName}`, { 
      detail: data,
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  /**
   * Start a quiz
   * @param {string} quizId - Quiz ID
   */
  const startQuiz = function(quizId) {
    const quizElement = document.querySelector(`${_config.quizSelector}[data-quiz-id="${quizId}"]`);
    if (!quizElement) {
      console.error(`Quiz with ID ${quizId} not found`);
      return;
    }
    
    // Hide intro if present
    const quizIntro = quizElement.querySelector('.quiz-intro');
    if (quizIntro) {
      quizIntro.style.display = 'none';
    }
    
    // Show first question
    const questions = quizElement.querySelectorAll('.quiz-question');
    if (questions.length > 0) {
      questions[0].classList.add('active');
    }
    
    // Start timer if present
    if (_timers[quizId]) {
      _startTimer(quizId);
    }
    
    // Set active quiz
    _activeQuiz = quizId;
  };

  /**
   * Start a challenge
   * @param {string} challengeId - Challenge ID
   */
  const startChallenge = function(challengeId) {
    const challengeElement = document.querySelector(`${_config.challengeSelector}[data-challenge-id="${challengeId}"]`);
    if (!challengeElement) {
      console.error(`Challenge with ID ${challengeId} not found`);
      return;
    }
    
    // Click start button if present
    const startButton = challengeElement.querySelector('.challenge-start');
    if (startButton) {
      startButton.click();
    }
  };

  /**
   * Start a timer
   * @param {string} timerId - Timer ID
   */
  const startTimer = function(timerId) {
    _startTimer(timerId);
  };

  /**
   * Stop a timer
   * @param {string} timerId - Timer ID
   */
  const stopTimer = function(timerId) {
    _stopTimer(timerId);
  };

  /**
   * Reset a timer
   * @param {string} timerId - Timer ID
   */
  const resetTimer = function(timerId) {
    _resetTimer(timerId);
  };

  // Public API
  return {
    init,
    startQuiz,
    startChallenge,
    startTimer,
    stopTimer,
    resetTimer
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if interactive elements should be initialized
  const interactiveElements = document.querySelectorAll('.gamification-quiz, .gamification-challenge, .gamification-timer');
  if (interactiveElements.length > 0) {
    GamificationInteractive.init()
      .then(() => {
        console.log('Gamification interactive elements initialized');
      })
      .catch(error => {
        console.error('Failed to initialize gamification interactive elements:', error);
      });
  }
});