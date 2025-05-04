---
layout: quiz
title: "HTML & CSS Fundamentals Quiz"
description: "Test your knowledge of basic HTML and CSS concepts"
difficulty: beginner
points: 50
estimated_time: "15 minutes"
quiz_type: multiple-choice
required_level: 1
badges:
  - html_basics
  - quiz_taker
---

{% comment %}
This beginner quiz demonstrates integration with the gamification system using Liquid tags.
It shows how to track progress, award points, and unlock badges upon completion.
{% endcomment %}

# {{ page.title }}

**Difficulty**: {{ page.difficulty | capitalize }}  
**Points**: {{ page.points }}  
**Estimated Time**: {{ page.estimated_time }}

{% include gamification/points-counter.html %}

## Quiz Overview

Welcome to the HTML & CSS Fundamentals Quiz! This quiz will test your knowledge of basic web development concepts. Whether you're just starting out or want to refresh your knowledge, this quiz will help reinforce important concepts.

## Instructions

- Read each question carefully
- Select the best answer from the options provided
- Submit your answers to see your results
- Score at least 70% to earn points and badges

{% include gamification/badge-display.html badge_id="html_basics" %}

<div class="quiz-container" data-quiz-id="html-css-fundamentals">
  <form id="quiz-form">
    <div class="question" id="q1">
      <h3>Question 1: What does HTML stand for?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q1" id="q1a" value="a">
          <label for="q1a">Hyper Text Markup Language</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1b" value="b">
          <label for="q1b">Hyper Transfer Markup Language</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1c" value="c">
          <label for="q1c">Hyper Text Management Language</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1d" value="d">
          <label for="q1d">High Tech Modern Language</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. Hyper Text Markup Language</strong></p>
        <p>HTML (Hyper Text Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page and consists of a series of elements that tell the browser how to display the content.</p>
      </div>
    </div>

    <div class="question" id="q2">
      <h3>Question 2: Which HTML tag is used to create a hyperlink?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q2" id="q2a" value="a">
          <label for="q2a">&lt;link&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2b" value="b">
          <label for="q2b">&lt;a&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2c" value="c">
          <label for="q2c">&lt;href&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2d" value="d">
          <label for="q2d">&lt;url&gt;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. &lt;a&gt;</strong></p>
        <p>The &lt;a&gt; (anchor) tag is used to create hyperlinks in HTML. The href attribute specifies the URL of the page the link goes to.</p>
      </div>
    </div>

    <div class="question" id="q3">
      <h3>Question 3: Which CSS property is used to change the text color of an element?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q3" id="q3a" value="a">
          <label for="q3a">text-color</label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3b" value="b">
          <label for="q3b">font-color</label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3c" value="c">
          <label for="q3c">color</label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3d" value="d">
          <label for="q3d">text-style</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. color</strong></p>
        <p>The CSS property 'color' is used to set the color of text. For example: p { color: blue; } would make all paragraph text blue.</p>
      </div>
    </div>

    <div class="question" id="q4">
      <h3>Question 4: What is the correct HTML for creating a checkbox?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q4" id="q4a" value="a">
          <label for="q4a">&lt;input type="check"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4b" value="b">
          <label for="q4b">&lt;checkbox&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4c" value="c">
          <label for="q4c">&lt;input type="checkbox"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4d" value="d">
          <label for="q4d">&lt;check&gt;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. &lt;input type="checkbox"&gt;</strong></p>
        <p>To create a checkbox in HTML, you use the &lt;input&gt; element with its type attribute set to "checkbox".</p>
      </div>
    </div>

    <div class="question" id="q5">
      <h3>Question 5: Which CSS property controls the spacing between elements?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q5" id="q5a" value="a">
          <label for="q5a">spacing</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5b" value="b">
          <label for="q5b">margin</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5c" value="c">
          <label for="q5c">padding</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5d" value="d">
          <label for="q5d">border</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. margin</strong></p>
        <p>The margin property in CSS controls the space outside an element, creating spacing between elements. Padding controls the space inside an element, between the content and its border.</p>
      </div>
    </div>

    <div class="question" id="q6">
      <h3>Question 6: What is the correct HTML for inserting an image?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q6" id="q6a" value="a">
          <label for="q6a">&lt;img href="image.jpg" alt="MyImage"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6b" value="b">
          <label for="q6b">&lt;image src="image.jpg" alt="MyImage"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6c" value="c">
          <label for="q6c">&lt;img src="image.jpg" alt="MyImage"&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6d" value="d">
          <label for="q6d">&lt;picture src="image.jpg" alt="MyImage"&gt;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. &lt;img src="image.jpg" alt="MyImage"&gt;</strong></p>
        <p>The correct HTML for inserting an image is the &lt;img&gt; tag with the src attribute specifying the path to the image and the alt attribute providing alternative text.</p>
      </div>
    </div>

    <div class="question" id="q7">
      <h3>Question 7: Which CSS property is used to make text bold?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q7" id="q7a" value="a">
          <label for="q7a">text-weight</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7b" value="b">
          <label for="q7b">font-weight</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7c" value="c">
          <label for="q7c">text-style</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7d" value="d">
          <label for="q7d">font-style</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. font-weight</strong></p>
        <p>The font-weight property in CSS is used to specify the weight or boldness of the font. Common values include normal, bold, bolder, lighter, or numeric values like 400 (normal) or 700 (bold).</p>
      </div>
    </div>

    <div class="question" id="q8">
      <h3>Question 8: What does CSS stand for?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q8" id="q8a" value="a">
          <label for="q8a">Creative Style Sheets</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8b" value="b">
          <label for="q8b">Computer Style Sheets</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8c" value="c">
          <label for="q8c">Cascading Style Sheets</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8d" value="d">
          <label for="q8d">Colorful Style Sheets</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. Cascading Style Sheets</strong></p>
        <p>CSS stands for Cascading Style Sheets. It's a style sheet language used for describing the presentation of a document written in HTML.</p>
      </div>
    </div>

    <div class="question" id="q9">
      <h3>Question 9: Which HTML element is used to define the largest heading?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q9" id="q9a" value="a">
          <label for="q9a">&lt;heading&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9b" value="b">
          <label for="q9b">&lt;h6&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9c" value="c">
          <label for="q9c">&lt;head&gt;</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9d" value="d">
          <label for="q9d">&lt;h1&gt;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: D. &lt;h1&gt;</strong></p>
        <p>The &lt;h1&gt; element is used to define the largest and most important heading in HTML. Heading elements range from &lt;h1&gt; (most important) to &lt;h6&gt; (least important).</p>
      </div>
    </div>

    <div class="question" id="q10">
      <h3>Question 10: How do you add a background color to an element in CSS?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q10" id="q10a" value="a">
          <label for="q10a">background-color: yellow;</label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10b" value="b">
          <label for="q10b">bgcolor: yellow;</label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10c" value="c">
          <label for="q10c">color-background: yellow;</label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10d" value="d">
          <label for="q10d">background: yellow;</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. background-color: yellow;</strong></p>
        <p>The background-color property is used to set the background color of an element in CSS. While 'background' would also work (as it's a shorthand property that includes background-color), the most specific and direct property is background-color.</p>
      </div>
    </div>

    <div class="quiz-controls">
      <button type="button" id="submit-quiz">Submit Answers</button>
    </div>
  </form>

  <div id="quiz-results" class="hidden">
    <h2>Quiz Results</h2>
    <p>You scored <span id="score">0</span> out of 10</p>
    <div id="pass-message" class="hidden">
      <p>Congratulations! You passed the quiz!</p>
      {% include gamification/quiz-complete.html 
        points=page.points 
        badges="html_basics,quiz_taker" 
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
- [Web Development Basics Challenge](/challenges/beginner-challenge)
- [CSS Fundamentals Quiz](/quizzes/intermediate-quiz)

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
      q1: 'a',
      q2: 'b',
      q3: 'c',
      q4: 'c',
      q5: 'b',
      q6: 'c',
      q7: 'b',
      q8: 'c',
      q9: 'd',
      q10: 'a'
    };
    
    // Initialize the quiz with these answers
    if (typeof initQuiz === 'function') {
      initQuiz('html-css-fundamentals', correctAnswers, 70); // 70% passing score
    }
  });
</script>