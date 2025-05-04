---
layout: quiz
title: "CSS Layout & Responsive Design Quiz"
description: "Test your knowledge of CSS layout techniques and responsive design principles"
difficulty: intermediate
points: 100
estimated_time: "20 minutes"
quiz_type: multiple-choice
required_level: 3
badges:
  - css_specialist
  - responsive_guru
prerequisites:
  - beginner-quiz
---

{% comment %}
This intermediate quiz demonstrates more advanced gamification integration with prerequisites,
higher point values, and more complex quiz content.
{% endcomment %}

# {{ page.title }}

**Difficulty**: {{ page.difficulty | capitalize }}  
**Points**: {{ page.points }}  
**Estimated Time**: {{ page.estimated_time }}

{% include gamification/points-counter.html %}

## Quiz Overview

Ready to test your CSS layout and responsive design knowledge? This intermediate-level quiz covers flexbox, grid, media queries, and other essential techniques for creating responsive websites. Challenge yourself and earn badges by demonstrating your CSS expertise!

{% if user.completed_quizzes contains "beginner-quiz" %}
  <div class="prerequisite-met">
    <p>✅ Prerequisite complete: HTML & CSS Fundamentals Quiz</p>
  </div>
{% else %}
  <div class="prerequisite-warning">
    <p>⚠️ We recommend completing the <a href="/quizzes/beginner-quiz">HTML & CSS Fundamentals Quiz</a> first.</p>
  </div>
{% endif %}

## Instructions

- Read each question carefully
- Select the best answer from the options provided
- Submit your answers to see your results
- Score at least 70% to earn points and badges

{% include gamification/badge-display.html badge_id="css_specialist" %}
{% include gamification/badge-display.html badge_id="responsive_guru" %}

<div class="quiz-container" data-quiz-id="css-layout-responsive">
  <form id="quiz-form">
    <div class="question" id="q1">
      <h3>Question 1: Which CSS property creates a flexible box layout?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q1" id="q1a" value="a">
          <label for="q1a">display: block;</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1b" value="b">
          <label for="q1b">display: flex;</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1c" value="c">
          <label for="q1c">display: flexbox;</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1d" value="d">
          <label for="q1d">display: flexible;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. display: flex;</strong></p>
        <p>The CSS property 'display: flex;' creates a flexible box layout, commonly known as flexbox. It allows for responsive elements within a container that can be easily aligned and distributed.</p>
      </div>
    </div>

    <div class="question" id="q2">
      <h3>Question 2: Which CSS property is used to create a grid layout?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q2" id="q2a" value="a">
          <label for="q2a">display: grid;</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2b" value="b">
          <label for="q2b">display: table;</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2c" value="c">
          <label for="q2c">display: layout-grid;</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2d" value="d">
          <label for="q2d">display: gridbox;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. display: grid;</strong></p>
        <p>The CSS property 'display: grid;' enables the CSS Grid Layout, which is a two-dimensional layout system for the web, allowing you to lay out items in rows and columns.</p>
      </div>
    </div>

    <div class="question" id="q3">
      <h3>Question 3: What is the purpose of a media query in CSS?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q3" id="q3a" value="a">
          <label for="q3a">To query the browser for supported CSS features</label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3b" value="b">
          <label for="q3b">To apply different styles based on device characteristics</label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3c" value="c">
          <label for="q3c">To load external media files like images and videos</label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3d" value="d">
          <label for="q3d">To query the server for additional CSS files</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. To apply different styles based on device characteristics</strong></p>
        <p>Media queries allow you to apply different CSS styles based on various device characteristics such as screen width, height, orientation, or resolution, enabling responsive design.</p>
      </div>
    </div>

    <div class="question" id="q4">
      <h3>Question 4: Which flexbox property aligns items along the cross axis?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q4" id="q4a" value="a">
          <label for="q4a">justify-content</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4b" value="b">
          <label for="q4b">align-items</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4c" value="c">
          <label for="q4c">flex-direction</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4d" value="d">
          <label for="q4d">flex-wrap</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. align-items</strong></p>
        <p>The 'align-items' property in flexbox is used to align flex items along the cross axis (perpendicular to the main axis). Common values include flex-start, flex-end, center, baseline, and stretch.</p>
      </div>
    </div>

    <div class="question" id="q5">
      <h3>Question 5: What is the correct syntax for a media query targeting screens with a maximum width of 768px?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q5" id="q5a" value="a">
          <label for="q5a">@media (screen-max: 768px) { }</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5b" value="b">
          <label for="q5b">@media screen and (max-width: 768px) { }</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5c" value="c">
          <label for="q5c">@media-query (max-width: 768px) { }</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5d" value="d">
          <label for="q5d">@screen (max-width: 768px) { }</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. @media screen and (max-width: 768px) { }</strong></p>
        <p>This is the correct syntax for a media query that targets screens with a maximum width of 768 pixels. It will apply the enclosed CSS rules only when the viewport width is 768px or less.</p>
      </div>
    </div>

    <div class="question" id="q6">
      <h3>Question 6: Which CSS unit is relative to the font-size of the root element?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q6" id="q6a" value="a">
          <label for="q6a">em</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6b" value="b">
          <label for="q6b">px</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6c" value="c">
          <label for="q6c">rem</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6d" value="d">
          <label for="q6d">vh</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. rem</strong></p>
        <p>'rem' stands for "root em" and is relative to the font-size of the root element (typically the html element). This makes it useful for creating scalable layouts that maintain proportions.</p>
      </div>
    </div>

    <div class="question" id="q7">
      <h3>Question 7: Which CSS Grid property defines the size of columns in a grid?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q7" id="q7a" value="a">
          <label for="q7a">grid-column-size</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7b" value="b">
          <label for="q7b">grid-template-columns</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7c" value="c">
          <label for="q7c">column-template</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7d" value="d">
          <label for="q7d">grid-columns</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. grid-template-columns</strong></p>
        <p>The 'grid-template-columns' property defines the columns of the grid with a space-separated list of values. Each value defines the width of the respective column.</p>
      </div>
    </div>

    <div class="question" id="q8">
      <h3>Question 8: What is the purpose of the 'fr' unit in CSS Grid?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q8" id="q8a" value="a">
          <label for="q8a">It represents a fixed ratio unit</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8b" value="b">
          <label for="q8b">It represents a fraction of the available space</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8c" value="c">
          <label for="q8c">It represents a frequency value for animations</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8d" value="d">
          <label for="q8d">It represents a frame rate for transitions</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. It represents a fraction of the available space</strong></p>
        <p>The 'fr' unit in CSS Grid represents a fraction of the available space. For example, in 'grid-template-columns: 1fr 2fr 1fr', the middle column takes up twice as much space as the other columns.</p>
      </div>
    </div>

    <div class="question" id="q9">
      <h3>Question 9: Which viewport meta tag setting is recommended for responsive design?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q9" id="q9a" value="a">
          <label for="q9a">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9b" value="b">
          <label for="q9b">&lt;meta name="viewport" content="width=1024, initial-scale=1.0"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9c" value="c">
          <label for="q9c">&lt;meta name="viewport" content="responsive=true"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9d" value="d">
          <label for="q9d">&lt;meta name="viewport" content="screen-size=adaptive"&gt;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</strong></p>
        <p>This viewport meta tag sets the width of the viewport to the device width and sets the initial zoom level to 1.0, which is essential for proper responsive design on mobile devices.</p>
      </div>
    </div>

    <div class="question" id="q10">
      <h3>Question 10: What is the mobile-first approach in responsive design?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q10" id="q10a" value="a">
          <label for="q10a">Designing for mobile devices only and ignoring desktop users</label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10b" value="b">
          <label for="q10b">Starting with a desktop design and scaling down for mobile</label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10c" value="c">
          <label for="q10c">Starting with a mobile design and scaling up for larger screens</label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10d" value="d">
          <label for="q10d">Creating separate websites for mobile and desktop users</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. Starting with a mobile design and scaling up for larger screens</strong></p>
        <p>The mobile-first approach means designing for mobile devices first, then progressively enhancing the design for larger screens. This typically involves using min-width media queries to add features as the screen size increases.</p>
      </div>
    </div>

    <div class="question" id="q11">
      <h3>Question 11: Which flexbox property determines the direction of flex items?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q11" id="q11a" value="a">
          <label for="q11a">flex-flow</label>
        </div>
        <div class="option">
          <input type="radio" name="q11" id="q11b" value="b">
          <label for="q11b">flex-direction</label>
        </div>
        <div class="option">
          <input type="radio" name="q11" id="q11c" value="c">
          <label for="q11c">flex-orientation</label>
        </div>
        <div class="option">
          <input type="radio" name="q11" id="q11d" value="d">
          <label for="q11d">flex-align</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. flex-direction</strong></p>
        <p>The 'flex-direction' property establishes the main axis, defining the direction flex items are placed in the flex container. Values include row, row-reverse, column, and column-reverse.</p>
      </div>
    </div>

    <div class="question" id="q12">
      <h3>Question 12: What does the CSS property 'object-fit' do?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q12" id="q12a" value="a">
          <label for="q12a">Specifies how an element should be positioned relative to its container</label>
        </div>
        <div class="option">
          <input type="radio" name="q12" id="q12b" value="b">
          <label for="q12b">Specifies how a replaced element's content should be resized to fit its container</label>
        </div>
        <div class="option">
          <input type="radio" name="q12" id="q12c" value="c">
          <label for="q12c">Defines how objects should interact with each other in a layout</label>
        </div>
        <div class="option">
          <input type="radio" name="q12" id="q12d" value="d">
          <label for="q12d">Controls how objects are fitted into a grid layout</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. Specifies how a replaced element's content should be resized to fit its container</strong></p>
        <p>The 'object-fit' property specifies how an image or video should be resized to fit its container, similar to background-size for background images. Common values include contain, cover, fill, none, and scale-down.</p>
      </div>
    </div>

    <div class="quiz-controls">
      <button type="button" id="submit-quiz">Submit Answers</button>
    </div>
  </form>

  <div id="quiz-results" class="hidden">
    <h2>Quiz Results</h2>
    <p>You scored <span id="score">0</span> out of 12</p>
    <div id="pass-message" class="hidden">
      <p>Congratulations! You passed the quiz!</p>
      {% include gamification/quiz-complete.html 
        points=page.points 
        badges="css_specialist,responsive_guru" 
      %}
    </div>
    <div id="fail-message" class="hidden">
      <p>You didn't pass this time. Review the material and try again!</p>
      <button id="retry-quiz">Retry Quiz</button>
    </div>
    <button id="show-explanations">Show Explanations</button>
  </div>
</div>

{% include gamification/level-progress.html %}

## Related Content

Ready to apply what you've learned? Check out these related challenges:
- [Responsive Design Challenge](/challenges/intermediate-challenge)
- [JavaScript Basics Quiz](/quizzes/advanced-quiz)

{% comment %}
The JavaScript for quiz functionality is defined in assets/js/interactive.js
It handles checking answers, calculating scores, and awarding points/badges
{% endcomment %}

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Quiz functionality will be handled by the interactive.js file
    // This script is just for any quiz-specific customizations
    
    // Correct answers for this quiz
    const correctAnswers = {
      q1: 'b',
      q2: 'a',
      q3: 'b',
      q4: 'b',
      q5: 'b',
      q6: 'c',
      q7: 'b',
      q8: 'b',
      q9: 'a',
      q10: 'c',
      q11: 'b',
      q12: 'b'
    };
    
    // Initialize the quiz with these answers
    if (typeof initQuiz === 'function') {
      initQuiz('css-layout-responsive', correctAnswers, 70); // 70% passing score
    }
  });
</script>