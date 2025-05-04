---
layout: challenge
title: "Responsive Design Challenge"
description: "Create a responsive website layout using CSS Grid and Flexbox"
difficulty: intermediate
points: 100
estimated_time: "60 minutes"
challenge_type: coding
required_level: 3
badges:
  - css_master
  - responsive_design
prerequisites:
  - beginner-challenge
---

{% comment %}
This intermediate challenge builds on the beginner challenge and demonstrates
more advanced gamification integration with prerequisites and higher point values.
{% endcomment %}

# {{ page.title }}

**Difficulty**: {{ page.difficulty | capitalize }}  
**Points**: {{ page.points }}  
**Estimated Time**: {{ page.estimated_time }}

{% include gamification/points-counter.html %}

## Challenge Overview

Take your web development skills to the next level! In this intermediate challenge, you'll learn how to create responsive layouts using modern CSS techniques like Grid and Flexbox. These powerful tools will help you build websites that look great on any device.

{% if user.completed_challenges contains "beginner-challenge" %}
  <div class="prerequisite-met">
    <p>✅ Prerequisite complete: Web Development Basics</p>
  </div>
{% else %}
  <div class="prerequisite-warning">
    <p>⚠️ We recommend completing the <a href="/challenges/beginner-challenge">Web Development Basics</a> challenge first.</p>
  </div>
{% endif %}

## Learning Objectives

By completing this challenge, you will:
- Master CSS Grid and Flexbox layouts
- Implement responsive design principles
- Create a website that works on mobile, tablet, and desktop
- Earn the "CSS Master" and "Responsive Design" badges

{% include gamification/badge-display.html badge_id="responsive_design" %}

## Challenge Instructions

### Step 1: Set Up Your Project

Create a new folder called "responsive-website" with the following files:
- `index.html`
- `styles.css`
- `images/` (folder for any images you want to include)

### Step 2: Create the HTML Structure

Open `index.html` and create a structure for a portfolio website with:
- A header with navigation
- A hero section
- A projects grid section
- A skills section using flexbox
- A contact form
- A footer

Here's a starter template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="logo">My Portfolio</div>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
        <div class="mobile-menu-toggle">☰</div>
    </header>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Welcome to My Portfolio</h1>
            <p>I'm a web developer specializing in responsive design</p>
            <a href="#contact" class="cta-button">Get in Touch</a>
        </div>
    </section>

    <section id="projects" class="projects">
        <h2>My Projects</h2>
        <div class="projects-grid">
            <div class="project-card">
                <img src="https://via.placeholder.com/300x200" alt="Project 1">
                <h3>Project 1</h3>
                <p>Description of project 1</p>
            </div>
            <div class="project-card">
                <img src="https://via.placeholder.com/300x200" alt="Project 2">
                <h3>Project 2</h3>
                <p>Description of project 2</p>
            </div>
            <div class="project-card">
                <img src="https://via.placeholder.com/300x200" alt="Project 3">
                <h3>Project 3</h3>
                <p>Description of project 3</p>
            </div>
            <div class="project-card">
                <img src="https://via.placeholder.com/300x200" alt="Project 4">
                <h3>Project 4</h3>
                <p>Description of project 4</p>
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <h2>My Skills</h2>
        <div class="skills-container">
            <div class="skill">HTML</div>
            <div class="skill">CSS</div>
            <div class="skill">JavaScript</div>
            <div class="skill">Responsive Design</div>
            <div class="skill">UI/UX</div>
            <div class="skill">Git</div>
        </div>
    </section>

    <section id="contact" class="contact">
        <h2>Contact Me</h2>
        <form>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
    </section>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>About</h3>
                <p>A passionate web developer focused on creating responsive, user-friendly websites.</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Connect</h3>
                <div class="social-links">
                    <a href="#">Twitter</a>
                    <a href="#">LinkedIn</a>
                    <a href="#">GitHub</a>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2025 My Portfolio. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
```

### Step 3: Create Responsive CSS

Now, open `styles.css` and implement responsive styling using CSS Grid and Flexbox:

```css
/* Base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

a {
    text-decoration: none;
    color: #333;
}

ul {
    list-style: none;
}

img {
    max-width: 100%;
}

/* Header styles */
header {
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5%;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

nav ul {
    display: flex;
}

nav ul li {
    margin-left: 2rem;
}

nav ul li a:hover {
    color: #0088cc;
}

.mobile-menu-toggle {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
}

/* Hero section */
.hero {
    height: 80vh;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://via.placeholder.com/1920x1080');
    background-size: cover;
    background-position: center;
    color: white;
    display: flex;
    align-items: center;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}

.cta-button {
    display: inline-block;
    background-color: #0088cc;
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 5px;
    font-size: 1.1rem;
    transition: background-color 0.3s;
}

.cta-button:hover {
    background-color: #006699;
}

/* Projects section */
.projects {
    padding: 5rem 5%;
}

.projects h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2rem;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-10px);
}

.project-card h3 {
    padding: 1rem;
}

.project-card p {
    padding: 0 1rem 1rem;
}

/* Skills section */
.skills {
    background-color: #f9f9f9;
    padding: 5rem 5%;
}

.skills h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2rem;
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.skill {
    background-color: #0088cc;
    color: white;
    padding: 1rem 2rem;
    border-radius: 5px;
    font-weight: bold;
}

/* Contact section */
.contact {
    padding: 5rem 5%;
}

.contact h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2rem;
}

form {
    max-width: 600px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input, textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: inherit;
}

textarea {
    min-height: 150px;
}

button[type="submit"] {
    background-color: #0088cc;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

button[type="submit"]:hover {
    background-color: #006699;
}

/* Footer */
footer {
    background-color: #333;
    color: white;
    padding: 3rem 5% 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.footer-section ul li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: #ddd;
}

.footer-section a:hover {
    color: #0088cc;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.copyright {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #444;
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
    nav ul {
        display: none;
    }
    
    .mobile-menu-toggle {
        display: block;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .hero p {
        font-size: 1.2rem;
    }
}

@media (max-width: 480px) {
    .hero {
        height: 60vh;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
    }
}
```

### Step 4: Test Responsiveness

Test your website at different screen sizes to ensure it's responsive:
- Desktop (1200px and above)
- Tablet (768px to 1199px)
- Mobile (below 768px)

You can use your browser's developer tools to simulate different screen sizes.

## Challenge Completion Criteria

To complete this challenge, your website should:
1. Use CSS Grid for the projects section
2. Use Flexbox for the navigation and skills section
3. Be fully responsive across all device sizes
4. Include proper media queries for breakpoints
5. Have a mobile menu toggle (functionality optional for this challenge)

{% if user.completed_challenge %}
  {% include gamification/challenge-complete.html 
    points=page.points 
    badges="css_master,responsive_design" 
  %}
{% else %}
  <div class="challenge-incomplete">
    <p>Complete this challenge to earn {{ page.points }} points and unlock new badges!</p>
    <button id="complete-challenge" onclick="completeChallenge('intermediate-challenge')">Mark as Complete</button>
  </div>
{% endif %}

{% include gamification/level-progress.html %}

## Next Steps

Ready to take your skills even further? Check out these related challenges:
- [JavaScript Interactivity](/challenges/advanced-challenge)
- [API Integration Challenge](/challenges/api-challenge)

{% comment %}
The JavaScript function completeChallenge() is defined in assets/js/gamification.js
It handles updating the user's points, badges, and progress
{% endcomment %}