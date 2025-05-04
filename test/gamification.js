/**
 * Euro-Agency Gamification System
 * Core functionality for the gamification system
 */

// Main gamification namespace
const Gamification = (function() {
  'use strict';

  // Private variables
  let _config = {};
  let _userData = {};
  let _initialized = false;
  let _badges = {};
  let _levels = {};
  let _challenges = {};
  let _eventListeners = [];
  let _language = 'en';

  /**
   * Initialize the gamification system
   * @param {Object} config - Configuration options
   * @returns {Promise} - Promise that resolves when initialization is complete
   */
  const init = function(config = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Default configuration
        _config = {
          storageKey: 'euro_agency_gamification',
          autoSave: true,
          notificationsEnabled: true,
          notificationDuration: 5000,
          language: document.documentElement.lang || 'en',
          badgesUrl: '/gamification-system/_data/badges.yml',
          levelsUrl: '/gamification-system/_data/levels.yml',
          challengesUrl: '/gamification-system/_data/challenges.yml',
          ...config
        };

        // Set language
        _language = _config.language;

        // Load user data from localStorage
        _loadUserData();

        // Load gamification data
        Promise.all([
          _loadBadges(),
          _loadLevels(),
          _loadChallenges()
        ]).then(() => {
          // Setup event listeners
          _setupEventListeners();
          
          // Mark as initialized
          _initialized = true;
          
          // Check for achievements on page load
          _checkForAchievements();
          
          // Resolve the promise
          resolve();
        }).catch(error => {
          console.error('Failed to initialize gamification system:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Error initializing gamification system:', error);
        reject(error);
      }
    });
  };

  /**
   * Load user data from localStorage
   * @private
   */
  const _loadUserData = function() {
    try {
      const storedData = localStorage.getItem(_config.storageKey);
      if (storedData) {
        _userData = JSON.parse(storedData);
      } else {
        // Initialize new user data
        _userData = {
          userId: _generateUserId(),
          points: 0,
          level: 1,
          badges: [],
          challenges: {},
          lastVisit: new Date().toISOString(),
          visits: 1,
          consecutiveVisits: 1,
          pageViews: {},
          quizResults: {},
          createdAt: new Date().toISOString(),
          preferences: {}
        };
        _saveUserData();
      }

      // Update visit data
      _updateVisitData();
    } catch (error) {
      console.error('Error loading user data:', error);
      // Initialize with default data if there's an error
      _userData = {
        userId: _generateUserId(),
        points: 0,
        level: 1,
        badges: [],
        challenges: {},
        lastVisit: new Date().toISOString(),
        visits: 1,
        consecutiveVisits: 1,
        pageViews: {},
        quizResults: {},
        createdAt: new Date().toISOString(),
        preferences: {}
      };
      _saveUserData();
    }
  };

  /**
   * Update visit data
   * @private
   */
  const _updateVisitData = function() {
    const now = new Date();
    const lastVisit = new Date(_userData.lastVisit);
    
    // Increment visit count
    _userData.visits += 1;
    
    // Check if this is a consecutive day visit
    const isConsecutiveDay = 
      now.getDate() !== lastVisit.getDate() && 
      (now - lastVisit) < (36 * 60 * 60 * 1000); // Within 36 hours
    
    if (isConsecutiveDay) {
      _userData.consecutiveVisits += 1;
    } else if (now.getDate() !== lastVisit.getDate()) {
      // Reset consecutive visits if not consecutive
      _userData.consecutiveVisits = 1;
    }
    
    // Update last visit
    _userData.lastVisit = now.toISOString();
    
    // Track current page view
    const currentPage = window.location.pathname;
    if (!_userData.pageViews[currentPage]) {
      _userData.pageViews[currentPage] = 0;
    }
    _userData.pageViews[currentPage] += 1;
    
    // Save updated data
    _saveUserData();
  };

  /**
   * Generate a unique user ID
   * @private
   * @returns {string} - Unique user ID
   */
  const _generateUserId = function() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  };

  /**
   * Save user data to localStorage
   * @private
   */
  const _saveUserData = function() {
    try {
      localStorage.setItem(_config.storageKey, JSON.stringify(_userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  /**
   * Load badges data
   * @private
   * @returns {Promise} - Promise that resolves when badges are loaded
   */
  const _loadBadges = function() {
    return fetch(_config.badgesUrl)
      .then(response => response.text())
      .then(yamlText => {
        // In a real implementation, we would parse YAML here
        // For now, we'll assume the data is already available
        _badges = window.badgesData || {};
        return _badges;
      })
      .catch(error => {
        console.error('Error loading badges:', error);
        return {};
      });
  };

  /**
   * Load levels data
   * @private
   * @returns {Promise} - Promise that resolves when levels are loaded
   */
  const _loadLevels = function() {
    return fetch(_config.levelsUrl)
      .then(response => response.text())
      .then(yamlText => {
        // In a real implementation, we would parse YAML here
        // For now, we'll assume the data is already available
        _levels = window.levelsData || {};
        return _levels;
      })
      .catch(error => {
        console.error('Error loading levels:', error);
        return {};
      });
  };

  /**
   * Load challenges data
   * @private
   * @returns {Promise} - Promise that resolves when challenges are loaded
   */
  const _loadChallenges = function() {
    return fetch(_config.challengesUrl)
      .then(response => response.text())
      .then(yamlText => {
        // In a real implementation, we would parse YAML here
        // For now, we'll assume the data is already available
        _challenges = window.challengesData || {};
        return _challenges;
      })
      .catch(error => {
        console.error('Error loading challenges:', error);
        return {};
      });
  };

  /**
   * Setup event listeners for tracking user activity
   * @private
   */
  const _setupEventListeners = function() {
    // Track page navigation
    _addEventListenerWithTracking(window, 'popstate', _handlePageNavigation);
    
    // Track clicks on elements
    _addEventListenerWithTracking(document, 'click', _handleClick);
    
    // Track form submissions
    _addEventListenerWithTracking(document, 'submit', _handleFormSubmit);
    
    // Track language changes
    const languageSwitchers = document.querySelectorAll('.language-switcher');
    languageSwitchers.forEach(switcher => {
      _addEventListenerWithTracking(switcher, 'click', _handleLanguageSwitch);
    });
    
    // Track social sharing
    const socialButtons = document.querySelectorAll('.social-share');
    socialButtons.forEach(button => {
      _addEventListenerWithTracking(button, 'click', _handleSocialShare);
    });
  };

  /**
   * Add event listener with tracking
   * @private
   * @param {Element} element - DOM element
   * @param {string} eventType - Event type
   * @param {Function} handler - Event handler
   */
  const _addEventListenerWithTracking = function(element, eventType, handler) {
    element.addEventListener(eventType, handler);
    _eventListeners.push({ element, eventType, handler });
  };

  /**
   * Handle page navigation events
   * @private
   * @param {Event} event - Navigation event
   */
  const _handlePageNavigation = function(event) {
    // Track page view
    const currentPage = window.location.pathname;
    if (!_userData.pageViews[currentPage]) {
      _userData.pageViews[currentPage] = 0;
    }
    _userData.pageViews[currentPage] += 1;
    
    // Save updated data
    _saveUserData();
    
    // Check for achievements
    _checkForAchievements();
  };

  /**
   * Handle click events
   * @private
   * @param {Event} event - Click event
   */
  const _handleClick = function(event) {
    // Check if clicked element is a badge
    if (event.target.closest('.badge-item')) {
      const badgeElement = event.target.closest('.badge-item');
      const badgeId = badgeElement.dataset.badgeId;
      if (badgeId) {
        _showBadgeDetails(badgeId);
      }
    }
    
    // Check if clicked element is a challenge
    if (event.target.closest('.challenge-item')) {
      const challengeElement = event.target.closest('.challenge-item');
      const challengeId = challengeElement.dataset.challengeId;
      if (challengeId) {
        _showChallengeDetails(challengeId);
      }
    }
    
    // Check for special elements (like easter eggs)
    if (event.target.id === 'easter-egg') {
      _awardBadge('find_easter_egg');
    }
    
    // Check for achievements
    _checkForAchievements();
  };

  /**
   * Handle form submissions
   * @private
   * @param {Event} event - Form submission event
   */
  const _handleFormSubmit = function(event) {
    const form = event.target;
    
    // Check if it's a feedback form
    if (form.id === 'feedback-form') {
      _awardPoints(25);
      _checkForBadge('feedback_provider');
    }
    
    // Check if it's a quiz form
    if (form.classList.contains('quiz-form')) {
      const quizId = form.dataset.quizId;
      if (quizId) {
        // In a real implementation, we would calculate the score here
        // For now, we'll just simulate a random score
        const score = Math.floor(Math.random() * 101); // 0-100
        _recordQuizResult(quizId, score);
      }
    }
    
    // Save updated data
    _saveUserData();
    
    // Check for achievements
    _checkForAchievements();
  };

  /**
   * Handle language switch events
   * @private
   * @param {Event} event - Language switch event
   */
  const _handleLanguageSwitch = function(event) {
    const newLanguage = event.target.dataset.language || 'en';
    
    // Update language
    _language = newLanguage;
    
    // Track language switch
    if (!_userData.languages) {
      _userData.languages = [];
    }
    if (!_userData.languages.includes(newLanguage)) {
      _userData.languages.push(newLanguage);
      
      // Check for multilingual badge
      if (_userData.languages.length >= 2) {
        _checkForBadge('multilingual');
      }
    }
    
    // Save updated data
    _saveUserData();
    
    // Check for achievements
    _checkForAchievements();
  };

  /**
   * Handle social share events
   * @private
   * @param {Event} event - Social share event
   */
  const _handleSocialShare = function(event) {
    // Track social share
    if (!_userData.socialShares) {
      _userData.socialShares = 0;
    }
    _userData.socialShares += 1;
    
    // Check for social sharer badge
    _checkForBadge('social_sharer');
    
    // Save updated data
    _saveUserData();
    
    // Check for achievements
    _checkForAchievements();
  };

  /**
   * Check for achievements based on user activity
   * @private
   */
  const _checkForAchievements = function() {
    // Check for first visit badge
    _checkForBadge('first_visit');
    
    // Check for regular visitor badge
    if (_userData.consecutiveVisits >= 5) {
      _checkForBadge('regular_visitor');
    }
    
    // Check for site explorer badge
    if (Object.keys(_userData.pageViews).length >= 10) {
      _checkForBadge('site_explorer');
    }
    
    // Check for content consumer badge
    if (_userData.pageViews && Object.values(_userData.pageViews).reduce((a, b) => a + b, 0) >= 5) {
      _checkForBadge('content_consumer');
    }
    
    // Check for night owl badge
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 6) {
      _checkForBadge('night_owl');
    }
    
    // Check for challenges
    _checkForChallengeCompletions();
    
    // Check for level up
    _checkForLevelUp();
  };

  /**
   * Check if a badge should be awarded
   * @private
   * @param {string} badgeId - Badge ID to check
   */
  const _checkForBadge = function(badgeId) {
    // Check if badge already earned
    if (_userData.badges.includes(badgeId)) {
      return;
    }
    
    // Award the badge
    _awardBadge(badgeId);
  };

  /**
   * Award a badge to the user
   * @private
   * @param {string} badgeId - Badge ID to award
   */
  const _awardBadge = function(badgeId) {
    // Add badge to user data
    if (!_userData.badges.includes(badgeId)) {
      _userData.badges.push(badgeId);
      
      // Get badge details
      const badgeCategory = Object.keys(_badges).find(category => 
        _badges[category] && _badges[category][badgeId]
      );
      
      if (badgeCategory && _badges[badgeCategory][badgeId]) {
        const badge = _badges[badgeCategory][badgeId];
        
        // Award points
        if (badge.points) {
          _awardPoints(badge.points);
        }
        
        // Show notification
        _showNotification({
          type: 'badge',
          title: _getLocalizedText(badge.name),
          message: _getLocalizedText(badge.description),
          icon: badge.icon
        });
      }
      
      // Save updated data
      _saveUserData();
      
      // Trigger badge earned event
      _triggerEvent('badgeEarned', { badgeId });
    }
  };

  /**
   * Award points to the user
   * @private
   * @param {number} points - Number of points to award
   */
  const _awardPoints = function(points) {
    // Apply level multiplier if available
    const currentLevel = _getCurrentLevel();
    let multiplier = 1;
    
    if (currentLevel && currentLevel.rewards) {
      const pointsMultiplier = currentLevel.rewards.find(reward => reward.type === 'points_multiplier');
      if (pointsMultiplier && pointsMultiplier.value) {
        multiplier = pointsMultiplier.value;
      }
    }
    
    // Calculate points with multiplier
    const adjustedPoints = Math.round(points * multiplier);
    
    // Add points to user data
    _userData.points += adjustedPoints;
    
    // Save updated data
    _saveUserData();
    
    // Show notification if significant points
    if (points >= 50) {
      _showNotification({
        type: 'points',
        title: 'Points Awarded',
        message: `You earned ${adjustedPoints} points!`,
        icon: 'points-icon.svg'
      });
    }
    
    // Trigger points earned event
    _triggerEvent('pointsEarned', { points: adjustedPoints });
    
    // Check for level up
    _checkForLevelUp();
  };

  /**
   * Record a quiz result
   * @private
   * @param {string} quizId - Quiz ID
   * @param {number} score - Quiz score (0-100)
   */
  const _recordQuizResult = function(quizId, score) {
    // Initialize quiz results if needed
    if (!_userData.quizResults) {
      _userData.quizResults = {};
    }
    
    // Record quiz result
    _userData.quizResults[quizId] = {
      score,
      completedAt: new Date().toISOString()
    };
    
    // Award points based on score
    const points = Math.round(score / 2); // 0-50 points based on score
    _awardPoints(points);
    
    // Check for quiz-related badges
    _checkForBadge('quiz_taker');
    
    if (score === 100) {
      _checkForBadge('quiz_master');
    }
    
    // Check for quiz-related challenges
    _checkForChallengeCompletions();
    
    // Save updated data
    _saveUserData();
  };

  /**
   * Check for challenge completions
   * @private
   */
  const _checkForChallengeCompletions = function() {
    // Initialize challenges data if needed
    if (!_userData.challenges) {
      _userData.challenges = {};
    }
    
    // Check each challenge
    if (_challenges && _challenges.challenges) {
      Object.keys(_challenges.challenges).forEach(challengeId => {
        const challenge = _challenges.challenges[challengeId];
        
        // Skip if already completed and not repeatable
        if (_userData.challenges[challengeId] && 
            _userData.challenges[challengeId].completed && 
            !challenge.repeatable) {
          return;
        }
        
        // Skip if user level is too low
        if (challenge.required_level && _userData.level < challenge.required_level) {
          return;
        }
        
        // Check completion criteria
        if (_checkChallengeCriteria(challenge)) {
          _completeChallenge(challengeId);
        }
      });
    }
  };

  /**
   * Check if a challenge's criteria are met
   * @private
   * @param {Object} challenge - Challenge object
   * @returns {boolean} - Whether criteria are met
   */
  const _checkChallengeCriteria = function(challenge) {
    if (!challenge.completion_criteria) {
      return false;
    }
    
    const criteria = challenge.completion_criteria;
    
    switch (criteria.type) {
      case 'visit_pages':
        return criteria.pages.every(page => 
          _userData.pageViews && _userData.pageViews[page]
        );
        
      case 'consecutive_visits':
        return _userData.consecutiveVisits >= criteria.count;
        
      case 'unique_page_visits':
        return Object.keys(_userData.pageViews || {}).length >= criteria.count;
        
      case 'read_article':
        return Object.values(_userData.pageViews || {}).reduce((a, b) => a + b, 0) >= criteria.count;
        
      case 'time_visit':
        const currentHour = new Date().getHours();
        const [startHour, endHour] = criteria.time_range.split('-').map(t => parseInt(t.split(':')[0], 10));
        return (currentHour >= startHour || currentHour < endHour);
        
      case 'quiz_score':
        if (criteria.quiz_id === 'any') {
          return Object.values(_userData.quizResults || {}).some(result => result.score >= criteria.min_score);
        } else {
          return _userData.quizResults && 
                 _userData.quizResults[criteria.quiz_id] && 
                 _userData.quizResults[criteria.quiz_id].score >= criteria.min_score;
        }
        
      case 'quiz_score_time':
        if (!_userData.quizResults || !_userData.quizResults[criteria.quiz_id]) {
          return false;
        }
        const result = _userData.quizResults[criteria.quiz_id];
        return result.score >= criteria.min_score && 
               result.timeSpent && 
               result.timeSpent <= criteria.max_time;
        
      case 'language_switch':
        return _userData.languages && _userData.languages.length >= criteria.count;
        
      case 'weekend_activity':
        const today = new Date().getDay();
        const isWeekend = today === 0 || today === 6; // 0 = Sunday, 6 = Saturday
        return isWeekend && _userData.weekendActivities >= criteria.count;
        
      default:
        return false;
    }
  };

  /**
   * Complete a challenge
   * @private
   * @param {string} challengeId - Challenge ID
   */
  const _completeChallenge = function(challengeId) {
    // Initialize challenge data if needed
    if (!_userData.challenges[challengeId]) {
      _userData.challenges[challengeId] = {
        progress: 0,
        attempts: 0
      };
    }
    
    // Mark as completed
    _userData.challenges[challengeId].completed = true;
    _userData.challenges[challengeId].completedAt = new Date().toISOString();
    _userData.challenges[challengeId].attempts += 1;
    
    // Get challenge details
    const challenge = _challenges.challenges[challengeId];
    
    // Award points
    if (challenge.points) {
      _awardPoints(challenge.points);
    }
    
    // Check for challenge-related badges
    _checkForBadge('challenge_accepted');
    
    // Count completed challenges
    const completedChallenges = Object.values(_userData.challenges).filter(c => c.completed).length;
    if (completedChallenges >= 5) {
      _checkForBadge('challenge_master');
    }
    
    // Show notification
    _showNotification({
      type: 'challenge',
      title: 'Challenge Completed',
      message: _getLocalizedText(challenge.name),
      icon: 'challenge-icon.svg'
    });
    
    // Save updated data
    _saveUserData();
    
    // Trigger challenge completed event
    _triggerEvent('challengeCompleted', { challengeId });
  };

  /**
   * Check if user should level up
   * @private
   */
  const _checkForLevelUp = function() {
    if (!_levels || !_levels.levels) {
      return;
    }
    
    // Find the highest level the user qualifies for
    const qualifyingLevels = _levels.levels.filter(level => 
      level.points_required <= _userData.points
    );
    
    if (qualifyingLevels.length > 0) {
      // Sort by points required (descending)
      qualifyingLevels.sort((a, b) => b.points_required - a.points_required);
      
      const highestQualifyingLevel = qualifyingLevels[0];
      
      // Check if this is a new level
      if (highestQualifyingLevel.id > _userData.level) {
        // Level up!
        const oldLevel = _userData.level;
        _userData.level = highestQualifyingLevel.id;
        
        // Show notification
        _showNotification({
          type: 'level',
          title: 'Level Up!',
          message: `You've reached level ${_userData.level}: ${_getLocalizedText(highestQualifyingLevel.name)}`,
          icon: highestQualifyingLevel.icon
        });
        
        // Save updated data
        _saveUserData();
        
        // Trigger level up event
        _triggerEvent('levelUp', { 
          oldLevel, 
          newLevel: _userData.level,
          levelName: _getLocalizedText(highestQualifyingLevel.name)
        });
      }
    }
  };

  /**
   * Get the current level object
   * @private
   * @returns {Object|null} - Current level object or null
   */
  const _getCurrentLevel = function() {
    if (!_levels || !_levels.levels) {
      return null;
    }
    
    return _levels.levels.find(level => level.id === _userData.level) || null;
  };

  /**
   * Show a notification
   * @private
   * @param {Object} options - Notification options
   */
  const _showNotification = function(options) {
    if (!_config.notificationsEnabled) {
      return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `gamification-notification ${options.type}-notification`;
    
    // Create notification content
    notification.innerHTML = `
      <div class="notification-icon">
        <img src="/gamification-system/assets/images/${options.icon || 'default-icon.svg'}" alt="${options.title}">
      </div>
      <div class="notification-content">
        <h4>${options.title}</h4>
        <p>${options.message}</p>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('notification-visible');
    }, 10);
    
    // Auto-hide after duration
    setTimeout(() => {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, _config.notificationDuration);
  };

  /**
   * Show badge details
   * @private
   * @param {string} badgeId - Badge ID
   */
  const _showBadgeDetails = function(badgeId) {
    // Find badge details
    let badge = null;
    let category = null;
    
    for (const cat in _badges) {
      if (_badges[cat][badgeId]) {
        badge = _badges[cat][badgeId];
        category = cat;
        break;
      }
    }
    
    if (!badge) {
      return;
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'gamification-modal badge-details-modal';
    
    // Create modal content
    const earned = _userData.badges.includes(badgeId);
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="badge-details">
          <div class="badge-icon ${earned ? 'earned' : 'locked'}">
            <img src="/gamification-system/assets/images/badges/${badge.icon}" alt="${_getLocalizedText(badge.name)}">
          </div>
          <h3>${_getLocalizedText(badge.name)}</h3>
          <p class="badge-description">${_getLocalizedText(badge.description)}</p>
          <div class="badge-meta">
            <span class="badge-category">${category}</span>
            <span class="badge-points">${badge.points} points</span>
            <span class="badge-difficulty">${badge.difficulty}</span>
          </div>
          <div class="badge-status">
            ${earned ? 
              `<span class="earned-status">Earned</span>` : 
              `<span class="locked-status">Not yet earned</span>`
            }
          </div>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add close button functionality
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', () => {
      modal.classList.add('modal-hiding');
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('modal-visible');
    }, 10);
  };

  /**
   * Show challenge details
   * @private
   * @param {string} challengeId - Challenge ID
   */
  const _showChallengeDetails = function(challengeId) {
    // Find challenge details
    const challenge = _challenges.challenges[challengeId];
    if (!challenge) {
      return;
    }
    
    // Get user's progress on this challenge
    const userProgress = _userData.challenges[challengeId] || { progress: 0, attempts: 0 };
    const completed = userProgress.completed || false;
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'gamification-modal challenge-details-modal';
    
    // Create modal content
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="challenge-details">
          <h3>${_getLocalizedText(challenge.name)}</h3>
          <p class="challenge-description">${_getLocalizedText(challenge.description)}</p>
          <div class="challenge-instructions">
            <h4>Instructions</h4>
            <p>${_getLocalizedText(challenge.instructions)}</p>
          </div>
          <div class="challenge-meta">
            <span class="challenge-category">${challenge.category}</span>
            <span class="challenge-points">${challenge.points} points</span>
            <span class="challenge-difficulty">${challenge.difficulty}</span>
            ${challenge.time_limit ? 
              `<span class="challenge-time-limit">Time limit: ${challenge.time_limit}s</span>` : 
              ''
            }
          </div>
          <div class="challenge-status">
            ${completed ? 
              `<span class="completed-status">Completed</span>` : 
              `<span class="incomplete-status">Not yet completed</span>`
            }
            ${userProgress.attempts > 0 ? 
              `<span class="attempts">Attempts: ${userProgress.attempts}</span>` : 
              ''
            }
          </div>
          ${!completed && challenge.required_level > _userData.level ? 
            `<div class="challenge-locked">
              <p>This challenge requires level ${challenge.required_level} to attempt.</p>
            </div>` : 
            ''
          }
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add close button functionality
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', () => {
      modal.classList.add('modal-hiding');
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('modal-visible');
    }, 10);
  };

  /**
   * Get localized text based on current language
   * @private
   * @param {Object} textObj - Object with localized text
   * @returns {string} - Localized text
   */
  const _getLocalizedText = function(textObj) {
    if (!textObj) {
      return '';
    }
    
    if (typeof textObj === 'string') {
      return textObj;
    }
    
    return textObj[_language] || textObj.en || '';
  };

  /**
   * Trigger a custom event
   * @private
   * @param {string} eventName - Event name
   * @param {Object} data - Event data
   */
  const _triggerEvent = function(eventName, data) {
    const event = new CustomEvent(`gamification:${eventName}`, { 
      detail: data,
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  /**
   * Get user data
   * @returns {Object} - User data
   */
  const getUserData = function() {
    return { ..._userData };
  };

  /**
   * Get user level
   * @returns {number} - User level
   */
  const getUserLevel = function() {
    return _userData.level;
  };

  /**
   * Get user points
   * @returns {number} - User points
   */
  const getUserPoints = function() {
    return _userData.points;
  };

  /**
   * Get user badges
   * @returns {Array} - Array of badge IDs
   */
  const getUserBadges = function() {
    return [..._userData.badges];
  };

  /**
   * Get user challenges
   * @returns {Object} - User challenges
   */
  const getUserChallenges = function() {
    return { ..._userData.challenges };
  };

  /**
   * Get next level information
   * @returns {Object|null} - Next level information or null if at max level
   */
  const getNextLevel = function() {
    if (!_levels || !_levels.levels) {
      return null;
    }
    
    const nextLevel = _levels.levels.find(level => level.id === _userData.level + 1);
    if (!nextLevel) {
      return null;
    }
    
    const pointsNeeded = nextLevel.points_required - _userData.points;
    const percentage = Math.min(100, Math.round((_userData.points / nextLevel.points_required) * 100));
    
    return {
      level: nextLevel.id,
      name: _getLocalizedText(nextLevel.name),
      pointsNeeded,
      percentage,
      icon: nextLevel.icon
    };
  };

  /**
   * Reset user data (for testing)
   */
  const resetUserData = function() {
    _userData = {
      userId: _generateUserId(),
      points: 0,
      level: 1,
      badges: [],
      challenges: {},
      lastVisit: new Date().toISOString(),
      visits: 1,
      consecutiveVisits: 1,
      pageViews: {},
      quizResults: {},
      createdAt: new Date().toISOString(),
      preferences: {}
    };
    _saveUserData();
  };

  /**
   * Clean up event listeners
   */
  const cleanup = function() {
    _eventListeners.forEach(({ element, eventType, handler }) => {
      element.removeEventListener(eventType, handler);
    });
    _eventListeners = [];
  };

  // Public API
  return {
    init,
    getUserData,
    getUserLevel,
    getUserPoints,
    getUserBadges,
    getUserChallenges,
    getNextLevel,
    resetUserData,
    cleanup
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if gamification should be initialized
  const gamificationElements = document.querySelectorAll('[data-gamification]');
  if (gamificationElements.length > 0) {
    Gamification.init()
      .then(() => {
        console.log('Gamification system initialized');
      })
      .catch(error => {
        console.error('Failed to initialize gamification system:', error);
      });
  }
});