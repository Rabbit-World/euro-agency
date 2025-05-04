---
layout: challenge
title: "Web Development Basics"
description: "Learn the fundamentals of HTML and CSS by building a simple webpage"
difficulty: beginner
points: 50
estimated_time: "30 minutes"
challenge_type: coding
required_level: 1
badges:
  - html_novice
  - first_challenge
---

{% comment %}
This challenge demonstrates integration with the gamification system using Liquid tags.
It shows how to track progress, award points, and unlock badges upon completion.
{% endcomment %}

# {{ page.title }}

**Difficulty**: {{ page.difficulty | capitalize }}  
**Points**: {{ page.points }}  
**Estimated Time**: {{ page.estimated_time }}

{% include gamification/points-counter.html %}

## Challenge Overview

Welcome to your first coding challenge! In this beginner-friendly exercise, you'll learn the basics of web development by creating a simple webpage using HTML and CSS. This challenge is perfect for those new to coding or looking to refresh their fundamental web skills.

## Learning Objectives

By completing this challenge, you will:
- Understand basic HTML structure and elements
- Learn fundamental CSS styling techniques
- Create a responsive webpage layout
- Earn the "HTML Novice" and "First Challenge" badges

{% include gamification/badge-display.html badge_id="html_novice" %}

## Challenge Instructions

### Step 1: Set Up Your Environment

Create a new folder on your computer called "my-first-webpage". Inside this folder, create two files:
- `index.html`
- `styles.css`

### Step 2: Create the HTML Structure

Open `index.html` in your favorite text editor and add the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="about">
            <h2>About Me</h2>
            <p>This is a paragraph about me. I'm learning HTML and CSS!</p>
        </section>
        
        <section id="services">
            <h2>My Services</h2>
            <ul>
                <li>Web Design</li>
                <li>Content Creation</li>
                <li>SEO Optimization</li>
            </ul>
        </section>
        
        <section id="contact">
            <h2>Contact Me</h2>
            <form>
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name">
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email">
                </div>
                <div>
                    <label for="message">Message:</label>
                    <textarea id="message" name="message"></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 My First Webpage</p>
    </footer>
</body>
</html>
```

### Step 3: Add CSS Styling

Open `styles.css` and add the following code:

```css
/* Basic reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    background-color: #f4f4f4;
    padding: 20px;
    margin-bottom: 20px;
}

nav ul {
    display: flex;
    list-style: none;
}

nav ul li {
    margin-right: 20px;
}

nav a {
    text-decoration: none;
    color: #333;
}

nav a:hover {
    color: #0088cc;
}

section {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
}

h1, h2 {
    margin-bottom: 15px;
}

form div {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background-color: #0088cc;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #006699;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 20px;
    background-color: #f4f4f4;
}
```

### Step 4: View Your Webpage

Open the `index.html` file in your web browser to see your webpage in action!

## Challenge Completion

To complete this challenge:
1. Create the HTML and CSS files as instructed
2. Make sure your webpage displays correctly in a browser
3. Take a screenshot of your completed webpage
4. Submit your files and screenshot

{% if user.completed_challenge %}
  {% include gamification/challenge-complete.html 
    points=page.points 
    badges="html_novice,first_challenge" 
  %}
{% else %}
  <div class="challenge-incomplete">
    <p>Complete this challenge to earn {{ page.points }} points and unlock new badges!</p>
    <button id="complete-challenge" onclick="completeChallenge('beginner-challenge')">Mark as Complete</button>
  </div>
{% endif %}

{% include gamification/level-progress.html %}

## Next Steps

Ready for more? Check out these related challenges:
- [CSS Styling Challenge](/challenges/intermediate-challenge)
- [JavaScript Basics](/challenges/advanced-challenge)

{% comment %}
The JavaScript function completeChallenge() is defined in assets/js/gamification.js
It handles updating the user's points, badges, and progress
{% endcomment %}