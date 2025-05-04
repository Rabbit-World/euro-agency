/**
 * Gamification System Interactive Elements
 * This file provides functionality for interactive gamification elements
 * such as quizzes, challenges, and other interactive components.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive components
  initQuizzes();
  initChallenges();
  initInteractiveElements();
  
  /**
   * Initialize quiz functionality
   */
  function initQuizzes() {
    const quizForms = document.querySelectorAll('.quiz-form');
    
    quizForms.forEach(form => {
      // Skip if already initialized
      if (form.classList.contains('initialized')) return;
      
      // Mark as initialized
      form.classList.add('initialized');
      
      // Get quiz elements
      const quizContainer = form.closest('.quiz-page');
      if (!quizContainer) return;
      
      const questionItems = form.querySelectorAll('.question-item');
      const totalQuestions = questionItems.length;
      let currentQuestionIndex = 0;
      
      // Navigation buttons
      const prevButton = form.querySelector('.prev-question');
      const nextButton = form.querySelector('.next-question');
      const submitButton = form.querySelector('.submit-quiz');
      
      // Progress elements
      const progressBar = quizContainer.querySelector('.quiz-progress .progress-bar');
      const currentQuestionDisplay = quizContainer.querySelector('.quiz-progress .current-question');
      
      // Timer elements
      const timerElement = quizContainer.querySelector('.quiz-timer');
      const timeLimit = timerElement ? parseInt(timerElement.getAttribute('data-time-limit')) || 0 : 0;
      const timerDisplay = timerElement ? timerElement.querySelector('.timer-value') : null;
      const timerProgressBar = timerElement ? timerElement.querySelector('.timer-progress-bar') : null;
      let timeRemaining = timeLimit;
      let timerInterval;
      
      // Quiz data
      const quizTitle = quizContainer.querySelector('.quiz-title').textContent;
      const quizPoints = parseInt(quizContainer.querySelector('.quiz-points').textContent) || 0;
      const passingScore = parseInt(quizContainer.querySelector('.quiz-passing-score').textContent) || 70;
      
      // User answers storage
      const userAnswers = [];
      
      // Initialize timer if present
      if (timerElement && timeLimit > 0) {
        startTimer();
      }
      
      // Show a specific question
      function showQuestion(index) {
        // Hide all questions
        questionItems.forEach(item => {
          item.classList.add('d-none');
        });
        
        // Show the current question
        questionItems[index].classList.remove('d-none');
        
        // Update progress
        currentQuestionIndex = index;
        if (currentQuestionDisplay) {
          currentQuestionDisplay.textContent = index + 1;
        }
        
        if (progressBar) {
          const progressPercentage = ((index + 1) / totalQuestions) * 100;
          progressBar.style.width = progressPercentage + '%';
          progressBar.setAttribute('aria-valuenow', progressPercentage);
        }
        
        // Update button states
        if (prevButton) {
          prevButton.disabled = index === 0;
        }
        
        if (nextButton && submitButton) {
          if (index === totalQuestions - 1) {
            nextButton.classList.add('d-none');
            submitButton.classList.remove('d-none');
          } else {
            nextButton.classList.remove('d-none');
            submitButton.classList.add('d-none');
          }
        }
      }
      
      // Start the timer
      function startTimer() {
        updateTimerDisplay();
        
        timerInterval = setInterval(function() {
          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
            // Auto-submit when time runs out
            submitQuiz();
          }
          
          timeRemaining--;
          updateTimerDisplay();
        }, 1000);
      }
      
      // Update timer display
      function updateTimerDisplay() {
        if (!timerDisplay) return;
        
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = 
          (hours < 10 ? '0' + hours : hours) + ':' +
          (minutes < 10 ? '0' + minutes : minutes) + ':' +
          (seconds < 10 ? '0' + seconds : seconds);
        
        if (timerProgressBar && timeLimit > 0) {
          const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;
          timerProgressBar.style.width = progressPercentage + '%';
        }
      }
      
      // Handle navigation button clicks
      if (prevButton) {
        prevButton.addEventListener('click', function() {
          if (currentQuestionIndex > 0) {
            // Save current answer
            saveAnswer(currentQuestionIndex);
            
            // Show previous question
            showQuestion(currentQuestionIndex - 1);
          }
        });
      }
      
      if (nextButton) {
        nextButton.addEventListener('click', function() {
          if (currentQuestionIndex < totalQuestions - 1) {
            // Save current answer
            if (saveAnswer(currentQuestionIndex)) {
              // Show next question
              showQuestion(currentQuestionIndex + 1);
            } else {
              // Alert user to answer the question
              alert('Please answer the current question before proceeding.');
            }
          }
        });
      }
      
      // Save the current answer
      function saveAnswer(questionIndex) {
        const questionItem = questionItems[questionIndex];
        const questionType = getQuestionType(questionItem);
        
        // Check if question is answered
        if (!isQuestionAnswered(questionItem, questionType)) {
          return false;
        }
        
        // Save answer based on question type
        switch (questionType) {
          case 'multiple_choice':
            const selectedRadio = questionItem.querySelector('input[type="radio"]:checked');
            userAnswers[questionIndex] = {
              type: questionType,
              value: selectedRadio ? selectedRadio.value : null
            };
            break;
            
          case 'checkbox':
            const selectedCheckboxes = questionItem.querySelectorAll('input[type="checkbox"]:checked');
            const values = Array.from(selectedCheckboxes).map(cb => cb.value);
            userAnswers[questionIndex] = {
              type: questionType,
              value: values
            };
            break;
            
          case 'text':
            const textInput = questionItem.querySelector('input[type="text"]');
            userAnswers[questionIndex] = {
              type: questionType,
              value: textInput ? textInput.value.trim() : null
            };
            break;
            
          case 'textarea':
            const textarea = questionItem.querySelector('textarea');
            userAnswers[questionIndex] = {
              type: questionType,
              value: textarea ? textarea.value.trim() : null
            };
            break;
        }
        
        return true;
      }
      
      // Check if a question has been answered
      function isQuestionAnswered(questionItem, type) {
        switch (type) {
          case 'multiple_choice':
            return questionItem.querySelector('input[type="radio"]:checked') !== null;
          case 'checkbox':
            return questionItem.querySelector('input[type="checkbox"]:checked') !== null;
          case 'text':
            const textInput = questionItem.querySelector('input[type="text"]');
            return textInput && textInput.value.trim() !== '';
          case 'textarea':
            const textarea = questionItem.querySelector('textarea');
            return textarea && textarea.value.trim() !== '';
          default:
            return true;
        }
      }
      
      // Get question type
      function getQuestionType(questionItem) {
        if (questionItem.querySelector('input[type="radio"]')) {
          return 'multiple_choice';
        } else if (questionItem.querySelector('input[type="checkbox"]')) {
          return 'checkbox';
        } else if (questionItem.querySelector('input[type="text"]')) {
          return 'text';
        } else if (questionItem.querySelector('textarea')) {
          return 'textarea';
        }
        return null;
      }
      
      // Handle quiz submission
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Save the last answer
          saveAnswer(currentQuestionIndex);
          
          // Submit the quiz
          submitQuiz();
        });
      }
      
      // Submit the quiz and show results
      function submitQuiz() {
        // Stop the timer if running
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        
        // In a real implementation, this would validate answers against correct answers
        // For demonstration, we'll simulate a score calculation
        
        // Calculate score (in a real implementation, this would compare with correct answers)
        // For demo purposes, we'll use a random score or simulate based on filled answers
        let correctAnswers = 0;
        let answeredQuestions = 0;
        
        userAnswers.forEach(answer => {
          if (answer && answer.value) {
            answeredQuestions++;
            
            // Simulate correct answers (in a real implementation, this would check against actual correct answers)
            // For demo, we'll say there's a 70% chance an answer is correct
            if (Math.random() < 0.7) {
              correctAnswers++;
            }
          }
        });
        
        // Calculate score percentage
        const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = scorePercentage >= passingScore;
        
        // Calculate time taken
        let timeTaken = '';
        if (timeLimit > 0) {
          const timeElapsed = timeLimit - timeRemaining;
          const hours = Math.floor(timeElapsed / 3600);
          const minutes = Math.floor((timeElapsed % 3600) / 60);
          const seconds = timeElapsed % 60;
          
          timeTaken = 
            (hours < 10 ? '0' + hours : hours) + ':' +
            (minutes < 10 ? '0' + minutes : minutes) + ':' +
            (seconds < 10 ? '0' + seconds : seconds);
        }
        
        // Update results modal
        const resultsModal = document.getElementById('quizResultsModal');
        if (resultsModal) {
          const resultsIcon = resultsModal.querySelector('.results-icon');
          const resultsTitle = resultsModal.querySelector('.results-title');
          const resultsDescription = resultsModal.querySelector('.results-description');
          const scoreDisplay = resultsModal.querySelector('.score-percentage');
          const correctAnswersDisplay = resultsModal.querySelector('.correct-answers');
          const timeTakenDisplay = resultsModal.querySelector('.time-taken');
          const pointsEarned = resultsModal.querySelector('.points-value');
          
          // Set results based on pass/fail
          if (passed) {
            resultsIcon.innerHTML = '<i class="fa fa-check-circle text-success"></i>';
            resultsTitle.textContent = 'Congratulations!';
            resultsDescription.textContent = 'You passed the quiz successfully.';
            pointsEarned.textContent = quizPoints;
          } else {
            resultsIcon.innerHTML = '<i class="fa fa-times-circle text-danger"></i>';
            resultsTitle.textContent = 'Not Quite There';
            resultsDescription.textContent = 'You didn\'t reach the passing score. Try again!';
            pointsEarned.textContent = '0';
          }
          
          scoreDisplay.textContent = scorePercentage + '%';
          correctAnswersDisplay.textContent = correctAnswers + ' / ' + totalQuestions;
          
          if (timeTakenDisplay) {
            timeTakenDisplay.textContent = timeTaken || '--:--:--';
          }
          
          // Show results modal
          if (typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
            $('#quizResultsModal').modal('show');
          } else {
            resultsModal.style.display = 'block';
          }
        }
        
        // Award points if passed
        if (passed && window.gamification && typeof window.gamification.updatePoints === 'function') {
          // Get current points
          const userData = window.gamification.getUserData();
          const currentPoints = userData.points || 0;
          
          // Award points
          window.gamification.updatePoints(currentPoints + quizPoints, `Completed quiz: ${quizTitle}`);
          
          // Check for perfect score badge
          if (scorePercentage === 100 && typeof window.gamification.awardBadge === 'function') {
            window.gamification.awardBadge('perfect_score');
          }
        }
      }
      
      // Initialize the quiz
      showQuestion(0);
    });
  }
  
  /**
   * Initialize challenge functionality
   */
  function initChallenges() {
    const challengePages = document.querySelectorAll('.challenge-page');
    
    challengePages.forEach(challengePage => {
      // Skip if already initialized
      if (challengePage.classList.contains('initialized')) return;
      
      // Mark as initialized
      challengePage.classList.add('initialized');
      
      // Get challenge elements
      const timerElement = challengePage.querySelector('.challenge-timer');
      const submitButton = challengePage.querySelector('.submit-challenge');
      const saveButton = challengePage.querySelector('.save-progress');
      const taskCheckboxes = challengePage.querySelectorAll('.task-checkbox-input');
      
      // Challenge data
      const challengeTitle = challengePage.querySelector('.challenge-title').textContent;
      const challengePoints = parseInt(challengePage.querySelector('.challenge-points').textContent) || 0;
      
      // Timer variables
      let timeLimit = 0;
      let timeRemaining = 0;
      let timerInterval;
      
      // Initialize timer if present
      if (timerElement) {
        timeLimit = parseInt(timerElement.getAttribute('data-time-limit')) || 0;
        timeRemaining = timeLimit;
        
        if (timeLimit > 0) {
          startTimer();
        }
      }
      
      // Start the timer
      function startTimer() {
        updateTimerDisplay();
        
        timerInterval = setInterval(function() {
          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
            // Auto-submit when time runs out
            if (submitButton) {
              submitButton.click();
            }
          }
          
          timeRemaining--;
          updateTimerDisplay();
        }, 1000);
      }
      
      // Update timer display
      function updateTimerDisplay() {
        const timerDisplay = timerElement.querySelector('.timer-value');
        const timerProgressBar = timerElement.querySelector('.timer-progress-bar');
        
        if (!timerDisplay) return;
        
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = 
          (hours < 10 ? '0' + hours : hours) + ':' +
          (minutes < 10 ? '0' + minutes : minutes) + ':' +
          (seconds < 10 ? '0' + seconds : seconds);
        
        if (timerProgressBar && timeLimit > 0) {
          const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;
          timerProgressBar.style.width = progressPercentage + '%';
        }
      }
      
      // Handle task checkboxes
      taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          // Save progress when a task is checked/unchecked
          saveProgress();
        });
      });
      
      // Handle challenge submission
      if (submitButton) {
        submitButton.addEventListener('click', function() {
          // Stop the timer if running
          if (timerInterval) {
            clearInterval(timerInterval);
          }
          
          // Calculate completion status
          const completedTasks = Array.from(taskCheckboxes).filter(cb => cb.checked).length;
          const totalTasks = taskCheckboxes.length;
          const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
          
          // Calculate time taken
          let timeTaken = '';
          if (timeLimit > 0) {
            const timeElapsed = timeLimit - timeRemaining;
            const hours = Math.floor(timeElapsed / 3600);
            const minutes = Math.floor((timeElapsed % 3600) / 60);
            const seconds = timeElapsed % 60;
            
            timeTaken = 
              (hours < 10 ? '0' + hours : hours) + ':' +
              (minutes < 10 ? '0' + minutes : minutes) + ':' +
              (seconds < 10 ? '0' + seconds : seconds);
          }
          
          // Update completion modal
          const completionModal = document.getElementById('challengeCompletionModal');
          if (completionModal) {
            const challengeName = completionModal.querySelector('.challenge-name');
            const timeTakenDisplay = completionModal.querySelector('.time-taken');
            const scoreValue = completionModal.querySelector('.score-value');
            
            if (challengeName) {
              challengeName.textContent = challengeTitle;
            }
            
            if (timeTakenDisplay) {
              timeTakenDisplay.textContent = timeTaken || '--:--:--';
            }
            
            if (scoreValue) {
              scoreValue.textContent = completionPercentage + '%';
            }
            
            // Show completion modal
            if (typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
              $('#challengeCompletionModal').modal('show');
            } else {
              completionModal.style.display = 'block';
            }
          }
          
          // Award points for completion
          if (window.gamification && typeof window.gamification.updatePoints === 'function') {
            // Get current points
            const userData = window.gamification.getUserData();
            const currentPoints = userData.points || 0;
            
            // Award points based on completion percentage
            const earnedPoints = Math.round((completionPercentage / 100) * challengePoints);
            
            if (earnedPoints > 0) {
              window.gamification.updatePoints(
                currentPoints + earnedPoints, 
                `Completed challenge: ${challengeTitle} (${completionPercentage}%)`
              );
            }
            
            // Award challenge badges if applicable
            if (typeof window.gamification.awardBadge === 'function') {
              // Award first challenge badge
              window.gamification.awardBadge('challenge_beginner');
              
              // Check if user has completed multiple challenges
              const userData = window.gamification.getUserData();
              const challengeBadges = userData.badges.filter(badge => 
                badge.startsWith('challenge_') || badge === 'persistence'
              );
              
              if (challengeBadges.length >= 5) {
                window.gamification.awardBadge('challenge_master');
              }
            }
          }
          
          // Clear saved progress
          localStorage.removeItem('challenge_progress_' + window.location.pathname);
        });
      }
      
      // Handle saving progress
      if (saveButton) {
        saveButton.addEventListener('click', function() {
          saveProgress();
          
          // Show a temporary message
          const message = document.createElement('div');
          message.className = 'alert alert-success save-message';
          message.textContent = 'Progress saved successfully!';
          
          saveButton.parentNode.insertBefore(message, saveButton.nextSibling);
          
          setTimeout(function() {
            message.remove();
          }, 3000);
        });
      }
      
      // Save challenge progress
      function saveProgress() {
        const progress = {
          tasks: {}
        };
        
        // Save task states
        taskCheckboxes.forEach((checkbox, index) => {
          progress.tasks[index] = checkbox.checked;
        });
        
        // Save to localStorage
        try {
          localStorage.setItem(
            'challenge_progress_' + window.location.pathname, 
            JSON.stringify(progress)
          );
        } catch (e) {
          console.error('Error saving challenge progress:', e);
        }
      }
      
      // Load saved progress
      function loadProgress() {
        try {
          const savedProgress = localStorage.getItem('challenge_progress_' + window.location.pathname);
          
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            
            // Restore task states
            if (progress.tasks) {
              Object.keys(progress.tasks).forEach(index => {
                if (taskCheckboxes[index]) {
                  taskCheckboxes[index].checked = progress.tasks[index];
                }
              });
            }
          }
        } catch (e) {
          console.error('Error loading challenge progress:', e);
        }
      }
      
      // Load saved progress on initialization
      loadProgress();
    });
  }
  
  /**
   * Initialize other interactive elements
   */
  function initInteractiveElements() {
    // Initialize tooltips
    if (typeof $ !== 'undefined' && typeof $.fn.tooltip !== 'undefined') {
      $('[data-toggle="tooltip"]').tooltip();
    }
    
    // Initialize popovers
    if (typeof $ !== 'undefined' && typeof $.fn.popover !== 'undefined') {
      $('[data-toggle="popover"]').popover();
    }
    
    // Initialize modals
    const modalCloseButtons = document.querySelectorAll('[data-dismiss="modal"]');
    modalCloseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = button.closest('.modal');
        if (modal) {
          if (typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
            $(modal).modal('hide');
          } else {
            modal.style.display = 'none';
          }
        }
      });
    });
    
    // Initialize review answers button
    const reviewButtons = document.querySelectorAll('.review-answers');
    reviewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = button.closest('.modal');
        if (modal) {
          if (typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
            $(modal).modal('hide');
          } else {
            modal.style.display = 'none';
          }
          
          // Scroll to the top of the quiz
          const quizContent = document.querySelector('.quiz-content');
          if (quizContent) {
            quizContent.scrollIntoView({ behavior: 'smooth' });
          }
          
          // Show all questions for review
          const questionItems = document.querySelectorAll('.question-item');
          questionItems.forEach(item => {
            item.classList.remove('d-none');
          });
          
          // Hide navigation buttons
          const navButtons = document.querySelector('.quiz-navigation');
          if (navButtons) {
            navButtons.style.display = 'none';
          }
        }
      });
    });
  }
});