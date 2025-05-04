---
layout: quiz
title: "JavaScript & Modern Web Development Quiz"
description: "Test your knowledge of advanced JavaScript concepts and modern web development techniques"
difficulty: advanced
points: 200
estimated_time: "30 minutes"
quiz_type: multiple-choice
required_level: 5
badges:
  - javascript_master
  - modern_web_expert
prerequisites:
  - beginner-quiz
  - intermediate-quiz
---

{% comment %}
This advanced quiz demonstrates the highest level of gamification integration,
with multiple prerequisites, higher point values, and more complex quiz content.
{% endcomment %}

# {{ page.title }}

**Difficulty**: {{ page.difficulty | capitalize }}  
**Points**: {{ page.points }}  
**Estimated Time**: {{ page.estimated_time }}

{% include gamification/points-counter.html %}

## Quiz Overview

Ready to prove your JavaScript expertise? This advanced quiz covers modern JavaScript concepts, frameworks, APIs, and best practices. Challenge yourself with questions about asynchronous programming, ES6+ features, performance optimization, and more!

{% if user.completed_quizzes contains "intermediate-quiz" %}
  <div class="prerequisite-met">
    <p>✅ Prerequisite complete: CSS Layout & Responsive Design Quiz</p>
  </div>
{% else %}
  <div class="prerequisite-warning">
    <p>⚠️ We recommend completing the <a href="/quizzes/intermediate-quiz">CSS Layout & Responsive Design Quiz</a> first.</p>
  </div>
{% endif %}

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

{% include gamification/badge-display.html badge_id="javascript_master" %}
{% include gamification/badge-display.html badge_id="modern_web_expert" %}

<div class="quiz-container" data-quiz-id="javascript-modern-web">
  <form id="quiz-form">
    <div class="question" id="q1">
      <h3>Question 1: What is the output of the following code?</h3>
      <pre><code>console.log(typeof null);</code></pre>
      <div class="options">
        <div class="option">
          <input type="radio" name="q1" id="q1a" value="a">
          <label for="q1a">null</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1b" value="b">
          <label for="q1b">undefined</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1c" value="c">
          <label for="q1c">object</label>
        </div>
        <div class="option">
          <input type="radio" name="q1" id="q1d" value="d">
          <label for="q1d">string</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. object</strong></p>
        <p>In JavaScript, typeof null returns "object", which is actually a historical bug in the language. Despite null being a primitive value, typeof null returns "object" due to how null was originally implemented.</p>
      </div>
    </div>

    <div class="question" id="q2">
      <h3>Question 2: Which of the following is NOT a JavaScript Promise method?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q2" id="q2a" value="a">
          <label for="q2a">then()</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2b" value="b">
          <label for="q2b">catch()</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2c" value="c">
          <label for="q2c">finally()</label>
        </div>
        <div class="option">
          <input type="radio" name="q2" id="q2d" value="d">
          <label for="q2d">eventually()</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: D. eventually()</strong></p>
        <p>The standard Promise methods are then(), catch(), and finally(). There is no eventually() method in the Promise API. The then() method is used for handling fulfilled promises, catch() for handling rejected promises, and finally() for executing code regardless of the promise's outcome.</p>
      </div>
    </div>

    <div class="question" id="q3">
      <h3>Question 3: What is the correct way to create a JavaScript class with a constructor?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q3" id="q3a" value="a">
          <label for="q3a"><pre><code>class Person {
  constructor(name) {
    this.name = name;
  }
}</code></pre></label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3b" value="b">
          <label for="q3b"><pre><code>class Person {
  function constructor(name) {
    this.name = name;
  }
}</code></pre></label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3c" value="c">
          <label for="q3c"><pre><code>function Person(name) {
  this.name = name;
}</code></pre></label>
        </div>
        <div class="option">
          <input type="radio" name="q3" id="q3d" value="d">
          <label for="q3d"><pre><code>class Person {
  new(name) {
    this.name = name;
  }
}</code></pre></label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. class Person { constructor(name) { this.name = name; } }</strong></p>
        <p>This is the correct ES6 class syntax with a constructor. The constructor method is a special method for creating and initializing objects created with the class. There can only be one constructor method in a class.</p>
      </div>
    </div>

    <div class="question" id="q4">
      <h3>Question 4: What is the purpose of the async/await syntax in JavaScript?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q4" id="q4a" value="a">
          <label for="q4a">To create synchronous code that blocks execution</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4b" value="b">
          <label for="q4b">To write asynchronous code that looks and behaves more like synchronous code</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4c" value="c">
          <label for="q4c">To replace the need for callbacks in JavaScript</label>
        </div>
        <div class="option">
          <input type="radio" name="q4" id="q4d" value="d">
          <label for="q4d">To create multi-threaded JavaScript applications</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. To write asynchronous code that looks and behaves more like synchronous code</strong></p>
        <p>The async/await syntax is syntactic sugar built on top of Promises. It allows you to write asynchronous code that looks and behaves more like synchronous code, making it easier to understand and maintain, while still being non-blocking.</p>
      </div>
    </div>

    <div class="question" id="q5">
      <h3>Question 5: What is the output of the following code?</h3>
      <pre><code>const arr = [1, 2, 3, 4, 5];
const [x, y, ...rest] = arr;
console.log(rest);</code></pre>
      <div class="options">
        <div class="option">
          <input type="radio" name="q5" id="q5a" value="a">
          <label for="q5a">[1, 2, 3, 4, 5]</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5b" value="b">
          <label for="q5b">[3, 4, 5]</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5c" value="c">
          <label for="q5c">[1, 2]</label>
        </div>
        <div class="option">
          <input type="radio" name="q5" id="q5d" value="d">
          <label for="q5d">3</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. [3, 4, 5]</strong></p>
        <p>This code uses array destructuring with the rest parameter syntax (...). The variables x and y are assigned the first two values of the array (1 and 2), and the rest parameter collects the remaining elements [3, 4, 5] into a new array.</p>
      </div>
    </div>

    <div class="question" id="q6">
      <h3>Question 6: Which of the following is a valid way to create an immutable object in JavaScript?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q6" id="q6a" value="a">
          <label for="q6a">const obj = immutable { key: 'value' };</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6b" value="b">
          <label for="q6b">const obj = Object.freeze({ key: 'value' });</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6c" value="c">
          <label for="q6c">const obj = Object.immutable({ key: 'value' });</label>
        </div>
        <div class="option">
          <input type="radio" name="q6" id="q6d" value="d">
          <label for="q6d">const obj = new ImmutableObject({ key: 'value' });</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. const obj = Object.freeze({ key: 'value' });</strong></p>
        <p>Object.freeze() is a built-in JavaScript method that prevents adding new properties, removing existing properties, and changing the enumerability, configurability, or writability of existing properties. It makes an object immutable at the top level (note that it's a shallow freeze).</p>
      </div>
    </div>

    <div class="question" id="q7">
      <h3>Question 7: What is the purpose of the Service Worker API?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q7" id="q7a" value="a">
          <label for="q7a">To create web workers that handle CPU-intensive tasks</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7b" value="b">
          <label for="q7b">To enable push notifications in web applications</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7c" value="c">
          <label for="q7c">To act as a proxy server between web applications, the browser, and the network</label>
        </div>
        <div class="option">
          <input type="radio" name="q7" id="q7d" value="d">
          <label for="q7d">To provide background services for web servers</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: C. To act as a proxy server between web applications, the browser, and the network</strong></p>
        <p>Service Workers act as a programmable network proxy, allowing you to control how network requests from your page are handled. They enable features like offline functionality, background sync, and push notifications by intercepting network requests and caching resources.</p>
      </div>
    </div>

    <div class="question" id="q8">
      <h3>Question 8: Which statement about WebAssembly (WASM) is correct?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q8" id="q8a" value="a">
          <label for="q8a">It's a replacement for JavaScript that will eventually make JavaScript obsolete</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8b" value="b">
          <label for="q8b">It's a binary instruction format designed as a portable target for compilation of high-level languages</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8c" value="c">
          <label for="q8c">It's a new markup language that combines HTML and JavaScript</label>
        </div>
        <div class="option">
          <input type="radio" name="q8" id="q8d" value="d">
          <label for="q8d">It's a server-side technology for processing web requests</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. It's a binary instruction format designed as a portable target for compilation of high-level languages</strong></p>
        <p>WebAssembly (WASM) is a binary instruction format designed as a portable target for the compilation of high-level languages like C, C++, and Rust. It enables running code at near-native speed in web browsers, complementing JavaScript rather than replacing it.</p>
      </div>
    </div>

    <div class="question" id="q9">
      <h3>Question 9: What is the purpose of the "use strict" directive in JavaScript?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q9" id="q9a" value="a">
          <label for="q9a">To enable strict type checking like in TypeScript</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9b" value="b">
          <label for="q9b">To enforce stricter parsing and error handling in JavaScript code</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9c" value="c">
          <label for="q9c">To restrict the use of certain JavaScript features</label>
        </div>
        <div class="option">
          <input type="radio" name="q9" id="q9d" value="d">
          <label for="q9d">To optimize JavaScript code for better performance</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. To enforce stricter parsing and error handling in JavaScript code</strong></p>
        <p>The "use strict" directive enables strict mode in JavaScript, which enforces stricter parsing and error handling. It helps catch common coding mistakes and "unsafe" actions, prevents the use of certain error-prone features, and can make code optimization easier for engines.</p>
      </div>
    </div>

    <div class="question" id="q10">
      <h3>Question 10: What is the correct way to handle errors in an async/await function?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q10" id="q10a" value="a">
          <label for="q10a"><pre><code>async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}</code></pre></label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10b" value="b">
          <label for="q10b"><pre><code>async function fetchData() {
  const response = await fetch('/api/data').catch(error => {
    console.error('Error:', error);
  });
  return await response.json();
}</code></pre></label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10c" value="c">
          <label for="q10c"><pre><code>async function fetchData() {
  const response = await fetch('/api/data');
  response.onerror = function(error) {
    console.error('Error:', error);
  };
  return await response.json();
}</code></pre></label>
        </div>
        <div class="option">
          <input type="radio" name="q10" id="q10d" value="d">
          <label for="q10d"><pre><code>async function fetchData() {
  await fetch('/api/data').then(response => {
    return response.json();
  }).error(error => {
    console.error('Error:', error);
  });
}</code></pre></label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. Using try/catch with async/await</strong></p>
        <p>When using async/await, the proper way to handle errors is with try/catch blocks. This approach allows you to catch any errors that occur during the execution of the awaited promises, similar to how you would handle errors in synchronous code.</p>
      </div>
    </div>

    <div class="question" id="q11">
      <h3>Question 11: What is the purpose of the Intersection Observer API?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q11" id="q11a" value="a">
          <label for="q11a">To detect when two DOM elements collide or overlap</label>
        </div>
        <div class="option">
          <input type="radio" name="q11" id="q11b" value="b">
          <label for="q11b">To observe changes in the intersection of a target element with an ancestor element or the viewport</label>
        </div>
        <div class="option">
          <input type="radio" name="q11" id="q11c" value="c">
          <label for="q11c">To monitor network traffic between different origins</label>
        </div>
        <div class="option">
          <input type="radio" name="q11" id="q11d" value="d">
          <label for="q11d">To detect when two JavaScript objects share the same properties</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. To observe changes in the intersection of a target element with an ancestor element or the viewport</strong></p>
        <p>The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or the viewport. It's commonly used for lazy-loading images, implementing infinite scroll, or tracking visibility of elements for analytics.</p>
      </div>
    </div>

    <div class="question" id="q12">
      <h3>Question 12: What is the purpose of the JavaScript Map object?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q12" id="q12a" value="a">
          <label for="q12a">To transform arrays using a callback function</label>
        </div>
        <div class="option">
          <input type="radio" name="q12" id="q12b" value="b">
          <label for="q12b">To store key-value pairs where keys can be of any type</label>
        </div>
        <div class="option">
          <input type="radio" name="q12" id="q12c" value="c">
          <label for="q12c">To create visual maps and charts in web applications</label>
        </div>
        <div class="option">
          <input type="radio" name="q12" id="q12d" value="d">
          <label for="q12d">To map URLs to file paths in a web server</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. To store key-value pairs where keys can be of any type</strong></p>
        <p>The JavaScript Map object is a collection of key-value pairs where keys can be of any type (unlike regular objects where keys are converted to strings). Maps maintain insertion order, have better performance for frequent additions/removals, and provide methods like set(), get(), has(), and delete().</p>
      </div>
    </div>

    <div class="question" id="q13">
      <h3>Question 13: What is the purpose of the JavaScript Symbol type?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q13" id="q13a" value="a">
          <label for="q13a">To create unique and immutable identifiers</label>
        </div>
        <div class="option">
          <input type="radio" name="q13" id="q13b" value="b">
          <label for="q13b">To represent mathematical symbols in code</label>
        </div>
        <div class="option">
          <input type="radio" name="q13" id="q13c" value="c">
          <label for="q13c">To create symbolic links between files</label>
        </div>
        <div class="option">
          <input type="radio" name="q13" id="q13d" value="d">
          <label for="q13d">To define special characters in strings</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: A. To create unique and immutable identifiers</strong></p>
        <p>The Symbol type in JavaScript represents a unique and immutable primitive value that can be used as an identifier for object properties. Symbols are often used to add unique property keys to objects that won't collide with keys that other code might add to the object.</p>
      </div>
    </div>

    <div class="question" id="q14">
      <h3>Question 14: Which statement about the JavaScript fetch API is correct?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q14" id="q14a" value="a">
          <label for="q14a">It's a synchronous API for making HTTP requests</label>
        </div>
        <div class="option">
          <input type="radio" name="q14" id="q14b" value="b">
          <label for="q14b">It returns a Promise that resolves to the Response object representing the response to the request</label>
        </div>
        <div class="option">
          <input type="radio" name="q14" id="q14c" value="c">
          <label for="q14c">It automatically parses JSON responses</label>
        </div>
        <div class="option">
          <input type="radio" name="q14" id="q14d" value="d">
          <label for="q14d">It's only available in Node.js environments</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. It returns a Promise that resolves to the Response object representing the response to the request</strong></p>
        <p>The fetch API returns a Promise that resolves to the Response object representing the response to the request. It does not automatically parse JSON (you need to call the .json() method on the response), and it's an asynchronous API available in browsers and modern Node.js versions.</p>
      </div>
    </div>

    <div class="question" id="q15">
      <h3>Question 15: What is the purpose of the JavaScript WeakMap object?</h3>
      <div class="options">
        <div class="option">
          <input type="radio" name="q15" id="q15a" value="a">
          <label for="q15a">It's a Map with weaker performance but smaller memory footprint</label>
        </div>
        <div class="option">
          <input type="radio" name="q15" id="q15b" value="b">
          <label for="q15b">It's a Map where keys must be objects and are weakly referenced</label>
        </div>
        <div class="option">
          <input type="radio" name="q15" id="q15c" value="c">
          <label for="q15c">It's a Map that automatically deletes entries after a specified time</label>
        </div>
        <div class="option">
          <input type="radio" name="q15" id="q15d" value="d">
          <label for="q15d">It's a Map with limited functionality but faster operations</label>
        </div>
      </div>
      <div class="explanation hidden">
        <p><strong>Correct Answer: B. It's a Map where keys must be objects and are weakly referenced</strong></p>
        <p>A WeakMap is a collection of key-value pairs where the keys must be objects and are "weakly" held. This means if there are no other references to a key object, it can be garbage collected even if it's in the WeakMap. WeakMaps are useful for storing private data for an object or associating metadata with objects without preventing garbage collection.</p>
      </div>
    </div>

    <div class="quiz-controls">
      <button type="button" id="submit-quiz">Submit Answers</button>
    </div>
  </form>

  <div id="quiz-results" class="hidden">
    <h2>Quiz Results</h2>
    <p>You scored <span id="score">0</span> out of 15</p>
    <div id="pass-message" class="hidden">
      <p>Congratulations! You passed the quiz!</p>
      {% include gamification/quiz-complete.html 
        points=page.points 
        badges="javascript_master,modern_web_expert" 
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
- [Interactive JavaScript Application Challenge](/challenges/advanced-challenge)
- [API Integration Challenge](/challenges/api-challenge)

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
      q1: 'c',
      q2: 'd',
      q3: 'a',
      q4: 'b',
      q5: 'b',
      q6: 'b',
      q7: 'c',
      q8: 'b',
      q9: 'b',
      q10: 'a',
      q11: 'b',
      q12: 'b',
      q13: 'a',
      q14: 'b',
      q15: 'b'
    };
    
    // Initialize the quiz with these answers
    if (typeof initQuiz === 'function') {
      initQuiz('javascript-modern-web', correctAnswers, 70); // 70% passing score
    }
  });
</script>