/**
 * Gamification System Core JavaScript
 * This file provides the core functionality for the gamification system
 * including points management, badge awards, level progression, and data persistence.
 */

// Initialize the gamification system when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Create the gamification namespace
  window.gamification = (function() {
    // Private variables
    let userData = {
      points: 0,
      level: 1,
      badges: [],
      pointHistory: []
    };
    
    // Configuration
    const config = {
      storageKey: 'gamification_user_data',
      animationDuration: 2000,
      notificationDuration: 5000,
      debugMode: false
    };
    
    // Cache DOM elements
    const $pointsCounters = document.querySelectorAll('.gamification-points-counter');
    const $levelProgress = document.querySelectorAll('.gamification-level-progress');
    const $badgeDisplays = document.querySelectorAll('.gamification-badge-display');
    
    /**
     * Initialize the gamification system
     */
    function init() {
      debug('Initializing gamification system');
      
      // Load user data from storage
      loadUserData();
      
      // Initialize components
      initPointsCounters();
      initLevelProgress();
      initBadgeDisplays();
      
      // Set up event listeners
      setupEventListeners();
      
      debug('Gamification system initialized');
    }
    
    /**
     * Load user data from localStorage
     */
    function loadUserData() {
      try {
        const savedData = localStorage.getItem(config.storageKey);
        if (savedData) {
          userData = JSON.parse(savedData);
          debug('User data loaded', userData);
        } else {
          debug('No saved user data found, using defaults');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    
    /**
     * Save user data to localStorage
     */
    function saveUserData() {
      try {
        localStorage.setItem(config.storageKey, JSON.stringify(userData));
        debug('User data saved');
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
    
    /**
     * Initialize points counters
     */
    function initPointsCounters() {
      if (!$pointsCounters.length) return;
      
      $pointsCounters.forEach(counter => {
        // Set initial points value
        const $pointsValues = counter.querySelectorAll('.points-value');
        $pointsValues.forEach(el => {
          el.textContent = userData.points;
        });
        
        // Store current points as data attribute
        counter.setAttribute('data-current-points', userData.points);
        counter.setAttribute('data-previous-points', userData.points);
        
        debug('Points counter initialized');
      });
    }
    
    /**
     * Initialize level progress displays
     */
    function initLevelProgress() {
      if (!$levelProgress.length) return;
      
      // Get level data from the page
      const levelsData = window.site?.data?.levels?.levels || [];
      if (!levelsData.length) {
        debug('No levels data found');
        return;
      }
      
      // Find current level and next level
      let currentLevel = levelsData[0];
      let nextLevel = levelsData[1];
      
      for (let i = 0; i < levelsData.length; i++) {
        if (userData.points >= levelsData[i].threshold) {
          currentLevel = levelsData[i];
          nextLevel = levelsData[i + 1] || currentLevel;
        } else {
          break;
        }
      }
      
      // Update user's level if needed
      if (userData.level !== currentLevel.level) {
        userData.level = currentLevel.level;
        saveUserData();
      }
      
      // Calculate progress percentage
      const currentThreshold = currentLevel.threshold;
      const nextThreshold = nextLevel.threshold;
      const levelPoints = userData.points - currentThreshold;
      const levelPointsRequired = nextThreshold - currentThreshold;
      let progressPercentage = 0;
      
      if (levelPointsRequired > 0) {
        progressPercentage = Math.min(100, Math.max(0, (levelPoints / levelPointsRequired) * 100));
      } else {
        progressPercentage = 100;
      }
      
      // Update all level progress displays
      $levelProgress.forEach(progress => {
        // Update level number and name
        const $currentLevel = progress.querySelector('.current-level');
        if ($currentLevel) {
          $currentLevel.textContent = `Level ${currentLevel.level}: ${currentLevel.name}`;
        }
        
        // Update progress bar
        const $progressFill = progress.querySelector('.progress-fill');
        if ($progressFill) {
          $progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update progress text
        const $progressPercentage = progress.querySelector('.progress-percentage');
        if ($progressPercentage) {
          $progressPercentage.textContent = `${Math.round(progressPercentage)}%`;
        }
        
        // Update points progress
        const $pointsProgress = progress.querySelector('.points-progress');
        if ($pointsProgress) {
          $pointsProgress.textContent = `${levelPoints} / ${levelPointsRequired} points to next level`;
        }
        
        // Update next level info
        const $nextLevelInfo = progress.querySelector('.next-level-info h4');
        if ($nextLevelInfo) {
          $nextLevelInfo.textContent = `Next Level: ${nextLevel.level} - ${nextLevel.name}`;
        }
        
        // Update points needed
        const $pointsNeeded = progress.querySelector('.points-needed');
        if ($pointsNeeded) {
          $pointsNeeded.textContent = `${nextThreshold - userData.points} more points needed`;
        }
      });
      
      debug('Level progress initialized');
    }
    
    /**
     * Initialize badge displays
     */
    function initBadgeDisplays() {
      if (!$badgeDisplays.length) return;
      
      // Get badges data from the page
      const badgesData = window.site?.data?.badges || {};
      if (!Object.keys(badgesData).length) {
        debug('No badges data found');
        return;
      }
      
      // Update badge displays based on display type
      $badgeDisplays.forEach(display => {
        const displayType = display.getAttribute('data-display-type');
        
        // Add earned class to badges that the user has earned
        const $badgeItems = display.querySelectorAll('.badge-item');
        $badgeItems.forEach(item => {
          const badgeId = item.getAttribute('data-badge-id');
          if (userData.badges.includes(badgeId)) {
            item.classList.add('earned');
            item.classList.remove('unearned');
            
            // Remove grayscale from badge image
            const $badgeImage = item.querySelector('.badge-icon img');
            if ($badgeImage) {
              $badgeImage.classList.remove('grayscale');
            }
          }
        });
      });
      
      debug('Badge displays initialized');
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
      // Listen for custom events
      document.addEventListener('gamification:points-update', function(e) {
        updatePoints(e.detail.points, e.detail.reason);
      });
      
      document.addEventListener('gamification:badge-award', function(e) {
        awardBadge(e.detail.badgeId);
      });
      
      document.addEventListener('gamification:check-level', function() {
        checkLevelUp();
      });
      
      debug('Event listeners set up');
    }
    
    /**
     * Update user points
     * @param {number} newPoints - The new total points value
     * @param {string} reason - The reason for the points change (optional)
     */
    function updatePoints(newPoints, reason = '') {
      // Validate input
      newPoints = parseInt(newPoints);
      if (isNaN(newPoints)) {
        console.error('Invalid points value:', newPoints);
        return;
      }
      
      // Calculate points change
      const oldPoints = userData.points;
      const pointsChange = newPoints - oldPoints;
      
      if (pointsChange === 0) return;
      
      // Update user data
      userData.points = newPoints;
      
      // Add to point history if reason is provided
      if (reason) {
        userData.pointHistory.unshift({
          description: reason,
          points: pointsChange,
          timestamp: new Date().toISOString()
        });
        
        // Limit history size
        if (userData.pointHistory.length > 20) {
          userData.pointHistory.pop();
        }
      }
      
      // Save updated user data
      saveUserData();
      
      // Update UI
      updatePointsDisplay(newPoints, pointsChange, reason);
      
      // Check for level up
      checkLevelUp();
      
      debug(`Points updated: ${oldPoints} → ${newPoints} (${pointsChange > 0 ? '+' : ''}${pointsChange}) - ${reason}`);
      
      // Return the points change
      return pointsChange;
    }
    
    /**
     * Update points display in the UI
     * @param {number} newPoints - The new total points value
     * @param {number} pointsChange - The change in points
     * @param {string} reason - The reason for the points change
     */
    function updatePointsDisplay(newPoints, pointsChange, reason) {
      // Update points counters
      $pointsCounters.forEach(counter => {
        const previousPoints = parseInt(counter.getAttribute('data-previous-points')) || 0;
        const $pointsValues = counter.querySelectorAll('.points-value');
        
        // Update all points value displays
        $pointsValues.forEach(el => {
          el.textContent = newPoints;
        });
        
        // Show animation if enabled
        if (counter.getAttribute('data-animation') === 'true' && pointsChange !== 0) {
          const $animationContainer = counter.querySelector('.points-animation-container');
          const $pointsChange = counter.querySelector('.points-change');
          
          if ($animationContainer && $pointsChange) {
            // Set the change text
            $pointsChange.textContent = (pointsChange > 0 ? '+' : '') + pointsChange;
            $pointsChange.className = 'points-change ' + (pointsChange > 0 ? 'positive' : 'negative');
            
            // Trigger animation
            $animationContainer.classList.add('animate');
            
            // Remove animation class after animation completes
            setTimeout(function() {
              $animationContainer.classList.remove('animate');
            }, config.animationDuration);
          }
        }
        
        // Update the previous points attribute
        counter.setAttribute('data-previous-points', newPoints);
        counter.setAttribute('data-current-points', newPoints);
        
        // Add to history if reason is provided
        if (reason && counter.querySelector('.points-history')) {
          const $historyList = counter.querySelector('.history-list');
          const $noHistory = $historyList.querySelector('.no-history');
          
          if ($noHistory) {
            $noHistory.remove();
          }
          
          const $newHistoryItem = document.createElement('li');
          $newHistoryItem.className = 'history-item ' + (pointsChange > 0 ? 'positive' : 'negative');
          
          const now = new Date();
          const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          $newHistoryItem.innerHTML = 
            '<span class="history-description">' + reason + '</span>' +
            '<span class="history-points">' + (pointsChange > 0 ? '+' : '') + pointsChange + '</span>' +
            '<span class="history-time">' + dateString + '</span>';
          
          // Add as first item
          if ($historyList.firstChild) {
            $historyList.insertBefore($newHistoryItem, $historyList.firstChild);
          } else {
            $historyList.appendChild($newHistoryItem);
          }
          
          // Limit history items
          const $historyItems = $historyList.querySelectorAll('.history-item');
          if ($historyItems.length > 5) {
            $historyList.removeChild($historyItems[$historyItems.length - 1]);
          }
        }
      });
      
      // Show notification
      showNotification((pointsChange > 0 ? '+' : '') + pointsChange + ' points' + (reason ? ': ' + reason : ''), 
                       pointsChange > 0 ? 'success' : 'info');
    }
    
    /**
     * Award a badge to the user
     * @param {string} badgeId - The ID of the badge to award
     * @returns {boolean} - Whether the badge was newly awarded
     */
    function awardBadge(badgeId) {
      // Check if user already has this badge
      if (userData.badges.includes(badgeId)) {
        debug(`Badge ${badgeId} already awarded`);
        return false;
      }
      
      // Get badge data
      const badgesData = window.site?.data?.badges || {};
      let badgeData = null;
      
      // Search for badge in all categories
      for (const category in badgesData) {
        const foundBadge = badgesData[category].find(badge => badge.id === badgeId);
        if (foundBadge) {
          badgeData = foundBadge;
          break;
        }
      }
      
      if (!badgeData) {
        console.error(`Badge ${badgeId} not found in badge data`);
        return false;
      }
      
      // Award the badge
      userData.badges.push(badgeId);
      
      // Award points if the badge has points
      if (badgeData.points) {
        updatePoints(userData.points + badgeData.points, `Earned "${badgeData.name}" badge`);
      }
      
      // Save user data
      saveUserData();
      
      // Update badge displays
      updateBadgeDisplays(badgeId);
      
      // Show notification
      showNotification(`New Badge Earned: ${badgeData.name}`, 'success', badgeData.image);
      
      debug(`Badge awarded: ${badgeId} - ${badgeData.name}`);
      return true;
    }
    
    /**
     * Update badge displays in the UI
     * @param {string} badgeId - The ID of the newly awarded badge
     */
    function updateBadgeDisplays(badgeId) {
      $badgeDisplays.forEach(display => {
        const $badgeItems = display.querySelectorAll(`.badge-item[data-badge-id="${badgeId}"]`);
        
        $badgeItems.forEach(item => {
          item.classList.add('earned');
          item.classList.remove('unearned');
          
          // Remove grayscale from badge image
          const $badgeImage = item.querySelector('.badge-icon img');
          if ($badgeImage) {
            $badgeImage.classList.remove('grayscale');
          }
        });
      });
    }
    
    /**
     * Check if user has leveled up and update UI accordingly
     */
    function checkLevelUp() {
      // Get level data from the page
      const levelsData = window.site?.data?.levels?.levels || [];
      if (!levelsData.length) return;
      
      // Find current level based on points
      let newLevel = 1;
      let levelData = null;
      
      for (let i = 0; i < levelsData.length; i++) {
        if (userData.points >= levelsData[i].threshold) {
          newLevel = levelsData[i].level;
          levelData = levelsData[i];
        } else {
          break;
        }
      }
      
      // Check if level has changed
      if (newLevel > userData.level) {
        // Level up!
        const oldLevel = userData.level;
        userData.level = newLevel;
        
        // Save user data
        saveUserData();
        
        // Update level progress displays
        initLevelProgress();
        
        // Show level up notification
        showNotification(`Level Up! You are now level ${newLevel}: ${levelData.name}`, 'success');
        
        debug(`Level up: ${oldLevel} → ${newLevel}`);
        
        // Trigger level up event
        const levelUpEvent = new CustomEvent('gamification:level-up', {
          detail: {
            oldLevel: oldLevel,
            newLevel: newLevel,
            levelData: levelData
          }
        });
        document.dispatchEvent(levelUpEvent);
        
        return true;
      }
      
      return false;
    }
    
    /**
     * Show a notification to the user
     * @param {string} message - The notification message
     * @param {string} type - The notification type (success, info, warning, error)
     * @param {string} image - Optional image URL
     */
    function showNotification(message, type = 'info', image = null) {
      // Check if notifications container exists, create if not
      let $notificationsContainer = document.querySelector('.gamification-notifications');
      
      if (!$notificationsContainer) {
        $notificationsContainer = document.createElement('div');
        $notificationsContainer.className = 'gamification-notifications';
        document.body.appendChild($notificationsContainer);
        
        // Add styles if not already in the document
        if (!document.querySelector('#gamification-notification-styles')) {
          const styles = document.createElement('style');
          styles.id = 'gamification-notification-styles';
          styles.textContent = `
            .gamification-notifications {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 9999;
              width: 300px;
            }
            .gamification-notification {
              margin-bottom: 10px;
              padding: 15px;
              border-radius: 5px;
              box-shadow: 0 3px 6px rgba(0,0,0,0.16);
              animation: notification-slide-in 0.3s ease-out forwards;
              display: flex;
              align-items: center;
            }
            .gamification-notification.success {
              background-color: #d4edda;
              border-left: 4px solid #28a745;
              color: #155724;
            }
            .gamification-notification.info {
              background-color: #d1ecf1;
              border-left: 4px solid #17a2b8;
              color: #0c5460;
            }
            .gamification-notification.warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              color: #856404;
            }
            .gamification-notification.error {
              background-color: #f8d7da;
              border-left: 4px solid #dc3545;
              color: #721c24;
            }
            .notification-image {
              width: 40px;
              height: 40px;
              margin-right: 15px;
              border-radius: 50%;
              object-fit: cover;
            }
            .notification-content {
              flex: 1;
            }
            .notification-close {
              cursor: pointer;
              font-size: 18px;
              margin-left: 10px;
              opacity: 0.5;
            }
            .notification-close:hover {
              opacity: 1;
            }
            @keyframes notification-slide-in {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes notification-slide-out {
              from {
                transform: translateX(0);
                opacity: 1;
              }
              to {
                transform: translateX(100%);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(styles);
        }
      }
      
      // Create notification element
      const $notification = document.createElement('div');
      $notification.className = `gamification-notification ${type}`;
      
      // Add image if provided
      let imageHtml = '';
      if (image) {
        imageHtml = `<img src="${image}" alt="" class="notification-image">`;
      }
      
      $notification.innerHTML = `
        ${imageHtml}
        <div class="notification-content">${message}</div>
        <span class="notification-close">&times;</span>
      `;
      
      // Add to container
      $notificationsContainer.appendChild($notification);
      
      // Set up close button
      const $closeButton = $notification.querySelector('.notification-close');
      $closeButton.addEventListener('click', function() {
        removeNotification($notification);
      });
      
      // Auto-remove after duration
      setTimeout(function() {
        removeNotification($notification);
      }, config.notificationDuration);
      
      function removeNotification(el) {
        el.style.animation = 'notification-slide-out 0.3s ease-in forwards';
        setTimeout(function() {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }, 300);
      }
    }
    
    /**
     * Debug logging
     */
    function debug(...args) {
      if (config.debugMode) {
        console.log('[Gamification]', ...args);
      }
    }
    
    /**
     * Reset user data (for testing)
     */
    function resetUserData() {
      userData = {
        points: 0,
        level: 1,
        badges: [],
        pointHistory: []
      };
      saveUserData();
      
      // Reload the page to reflect changes
      window.location.reload();
    }
    
    // Public API
    return {
      init: init,
      updatePoints: updatePoints,
      awardBadge: awardBadge,
      checkLevelUp: checkLevelUp,
      getUserData: function() { return {...userData}; },
      resetUserData: resetUserData
    };
  })();
  
  // Initialize the gamification system
  window.gamification.init();
});