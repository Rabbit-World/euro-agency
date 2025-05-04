# Gamification System for Jekyll

This package provides a comprehensive gamification system for Jekyll templates, specifically designed to integrate with the Euro-Agency template. The system includes badges, levels, points, challenges, and interactive elements to enhance user engagement.

## Table of Contents

- [Features](#features)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Integration with Euro-Agency Template](#integration-with-euro-agency-template)
- [Usage](#usage)
  - [Including Gamification Components](#including-gamification-components)
  - [Creating Challenges](#creating-challenges)
  - [Creating Quizzes](#creating-quizzes)
- [Customization](#customization)
  - [Badge Images](#badge-images)
  - [Styling](#styling)
  - [Data Configuration](#data-configuration)
- [Integration with User Data](#integration-with-user-data)
- [JavaScript API](#javascript-api)
- [Troubleshooting](#troubleshooting)
- [Browser Compatibility](#browser-compatibility)
- [Credits and License](#credits-and-license)

## Features

- **Badge System**: 25+ badges across multiple categories (achievement, expertise, engagement, challenge, community)
- **Level System**: Progressive level system with thresholds and rewards
- **Points System**: Track and display user points with animations
- **Challenge System**: Interactive challenges with time limits and completion tracking
- **Quiz System**: Interactive quizzes with scoring and results
- **Liquid Templates**: Reusable components for displaying gamification elements

## Directory Structure

```
gamification-system/
├── _data/                      # Data files for gamification elements
│   ├── badges.yml              # Badge definitions and requirements (25+ badges)
│   ├── levels.yml              # Level thresholds and rewards
│   └── challenges.yml          # Challenge/quiz definitions
├── _includes/                  # Reusable components
│   └── gamification/           # Gamification-specific includes
│       ├── badge-display.html  # Badge display component
│       ├── level-progress.html # Level progress component
│       └── points-counter.html # Points counter component
├── _layouts/                   # Layout templates
│   ├── challenge.html          # Layout for challenge pages
│   └── quiz.html               # Layout for quiz pages
├── assets/                     # Static assets
│   ├── css/                    # CSS styles
│   │   └── gamification.css    # Gamification-specific styles
│   ├── js/                     # JavaScript files
│   │   ├── gamification.js     # Core gamification functionality
│   │   └── interactive.js      # Interactive elements (quizzes, challenges, timers)
│   └── images/                 # Image assets
│       └── badges/             # Badge images
├── challenges/                 # Challenge content pages as Markdown files
├── quizzes/                    # Quiz content pages as Markdown files
├── _config.yml                 # Configuration with gamification settings
└── README.md                   # Documentation and integration guide
```

## Installation

1. Copy the entire `gamification-system` directory into your Jekyll project root.

2. Add the following to your `_config.yml` file:

```yaml
# Gamification settings
gamification:
  enabled: true
  points_display: true
  level_display: true
  badges_display: true
  challenges_enabled: true
  quizzes_enabled: true
  
  # Default settings for new users
  default_points: 0
  default_level: 1
  default_badges: []
  
  # Storage settings
  storage_method: "local_storage"  # Options: local_storage, server_side
  
  # Badge settings
  badge_image_path: "/assets/images/badges/"
  
  # Challenge settings
  challenge_path: "/challenges/"
  
  # Quiz settings
  quiz_path: "/quizzes/"

# Collections
collections:
  challenges:
    output: true
    permalink: /challenges/:path/
  quizzes:
    output: true
    permalink: /quizzes/:path/

# Default front matter for collections
defaults:
  - scope:
      path: ""
      type: "challenges"
    values:
      layout: "challenge"
  - scope:
      path: ""
      type: "quizzes"
    values:
      layout: "quiz"

# Include gamification data files
include:
  - _data/badges.yml
  - _data/levels.yml
  - _data/challenges.yml
```

3. Add the CSS and JavaScript files to your main layout:

```html
<!-- In your <head> section -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/gamification.css">

<!-- Before closing </body> tag -->
<script src="{{ site.baseurl }}/assets/js/gamification.js"></script>
<script src="{{ site.baseurl }}/assets/js/interactive.js"></script>
```

4. Create the necessary directories if they don't exist:

```bash
mkdir -p _data _includes/gamification _layouts assets/css assets/js assets/images/badges challenges quizzes
```

## Integration with Euro-Agency Template

To integrate the gamification system with the Euro-Agency template:

1. **Add Required Files**: Copy all files from the gamification-system directory to your Euro-Agency project, maintaining the same directory structure.

2. **Update Layout Files**: Modify your Euro-Agency template's main layout file (typically `_layouts/default.html`) to include the gamification CSS and JavaScript files:

```html
<!-- In the <head> section, after other CSS files -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/gamification.css">

<!-- Before closing </body> tag, after other script files -->
<script src="{{ site.baseurl }}/assets/js/gamification.js"></script>
<script src="{{ site.baseurl }}/assets/js/interactive.js"></script>
```

3. **Add Gamification Components**: Include the gamification components in your template where appropriate:

```html
<!-- Example: Add points counter to header -->
<div class="header-right">
  {% include gamification/points-counter.html compact=true %}
</div>

<!-- Example: Add level progress to user profile page -->
<div class="profile-stats">
  {% include gamification/level-progress.html show_rewards=true %}
</div>

<!-- Example: Add badges to user profile page -->
<div class="profile-badges">
  <h3>Your Badges</h3>
  {% include gamification/badge-display.html display_type="earned" %}
</div>
```

4. **Update Navigation**: Add links to challenges and quizzes in your navigation menu:

```html
<nav class="main-nav">
  <ul>
    <!-- Existing navigation items -->
    <li><a href="{{ site.baseurl }}/challenges/">Challenges</a></li>
    <li><a href="{{ site.baseurl }}/quizzes/">Quizzes</a></li>
  </ul>
</nav>
```

5. **Create Index Pages**: Create index pages for challenges and quizzes to list available content:

For challenges (`challenges/index.html`):
```html
---
layout: default
title: Challenges
---

<div class="challenges-page">
  <div class="container">
    <h1>Challenges</h1>
    <p>Complete challenges to earn points and badges!</p>
    
    <div class="challenges-list">
      {% for challenge in site.challenges %}
        <div class="challenge-card">
          <h3><a href="{{ challenge.url }}">{{ challenge.title }}</a></h3>
          <p>{{ challenge.description }}</p>
          <div class="challenge-meta">
            <span class="difficulty">{{ challenge.difficulty }}</span>
            <span class="points">{{ challenge.points }} points</span>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>
```

For quizzes (`quizzes/index.html`):
```html
---
layout: default
title: Quizzes
---

<div class="quizzes-page">
  <div class="container">
    <h1>Quizzes</h1>
    <p>Test your knowledge and earn points!</p>
    
    <div class="quizzes-list">
      {% for quiz in site.quizzes %}
        <div class="quiz-card">
          <h3><a href="{{ quiz.url }}">{{ quiz.title }}</a></h3>
          <p>{{ quiz.description }}</p>
          <div class="quiz-meta">
            <span class="difficulty">{{ quiz.difficulty }}</span>
            <span class="points">{{ quiz.points }} points</span>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>
```

## Usage

### Including Gamification Components

#### Badge Display

```liquid
{% include gamification/badge-display.html display_type="earned" %}
{% include gamification/badge-display.html display_type="all" %}
{% include gamification/badge-display.html display_type="category" category="achievement" %}
```

Parameters:
- `display_type`: "earned" (default), "all", "unearned", or "category"
- `category`: Required when display_type is "category". Options: "achievement", "expertise", "engagement", "challenge", "community"
- `limit`: Optional. Number of badges to display. Default is all.
- `show_description`: Optional. Whether to show badge descriptions. Default is true.

#### Level Progress

```liquid
{% include gamification/level-progress.html %}
{% include gamification/level-progress.html compact=true %}
{% include gamification/level-progress.html show_rewards=true %}
```

Parameters:
- `compact`: Optional. If true, displays a more compact version of the progress bar. Default is false.
- `show_rewards`: Optional. If true, displays rewards for the next level. Default is false.
- `show_points`: Optional. If true, displays current points. Default is true.

#### Points Counter

```liquid
{% include gamification/points-counter.html %}
{% include gamification/points-counter.html show_history=true %}
{% include gamification/points-counter.html animation=true %}
```

Parameters:
- `show_history`: Optional. If true, displays recent point history. Default is false.
- `animation`: Optional. If true, animates point changes. Default is true.
- `compact`: Optional. If true, displays a more compact version. Default is false.

### Creating Challenges

Create a new Markdown file in the `challenges` directory:

```markdown
---
layout: challenge
title: "Your Challenge Title"
description: "Description of the challenge"
points: 100
time_limit: 1800  # in seconds (30 minutes)
difficulty: "intermediate"
category: "skill"
tasks:
  - title: "Task 1"
    description: "Description of task 1"
  - title: "Task 2"
    description: "Description of task 2"
---

## Challenge Instructions

Detailed instructions for the challenge go here.
```

### Creating Quizzes

Create a new Markdown file in the `quizzes` directory:

```markdown
---
layout: quiz
title: "Your Quiz Title"
description: "Description of the quiz"
points: 50
time_limit: 600  # in seconds (10 minutes)
difficulty: "beginner"
category: "knowledge"
passing_score: 70
questions:
  - text: "What is the answer to this question?"
    type: "multiple_choice"
    options:
      - "Option 1"
      - "Option 2"
      - "Option 3"
      - "Option 4"
    correct: 2  # Index of correct answer (0-based)
  - text: "Select all that apply"
    type: "checkbox"
    options:
      - "Option 1"
      - "Option 2"
      - "Option 3"
    correct: [0, 2]  # Indices of correct answers
---

## Quiz Instructions

Instructions for taking the quiz go here.
```

## Customization

### Badge Images

Place badge images in the `assets/images/badges/` directory. Reference them in the `badges.yml` file.

The system comes with 5 sample badge images:
- `first_login_badge.svg` - First Steps badge
- `profile_complete_badge.svg` - Identity Established badge
- `beginner_quiz_badge.svg` - Knowledge Initiate badge
- `challenge_beginner_badge.svg` - Challenge Taker badge
- `helpful_member_badge.svg` - Helpful Hand badge

To create additional badge images, you can:
1. Use SVG format for scalable, lightweight badges
2. Keep the design consistent with the existing badges
3. Use the same naming convention as referenced in `badges.yml`

### Styling

Customize the appearance by modifying the `assets/css/gamification.css` file. The CSS is organized into sections:

- General Styles
- Badge Display
- Level Progress
- Points Counter
- Challenge Page
- Quiz Page
- Responsive Styles

Each section is clearly commented to help you find and modify specific elements.

### Data Configuration

Modify the YAML files in the `_data` directory to customize:

#### badges.yml

Contains badge definitions organized by category:
- achievement
- expertise
- engagement
- challenge
- community

Each badge has:
- id: Unique identifier
- name: Display name
- description: Detailed description
- requirements: What users need to do to earn it
- points: Points awarded when earned
- image: Filename of the badge image

#### levels.yml

Contains level definitions:
- level: Numeric level
- name: Display name
- threshold: Points required to reach this level
- rewards: List of rewards unlocked at this level
- description: Description of the level

#### challenges.yml

Contains challenge definitions organized by category and difficulty:
- knowledge (beginner, intermediate, advanced)
- skill (beginner, intermediate, advanced)
- community
- time_limited

Each challenge has:
- id: Unique identifier
- title: Display title
- description: Detailed description
- points: Points awarded for completion
- time_limit: Time limit in seconds (if applicable)
- questions/tasks: Number of questions or tasks
- passing_score/passing_criteria: Requirements to pass

## Integration with User Data

To integrate with user data, you'll need to implement a system to track user progress. This typically involves:

1. **User Authentication**: Implement a user authentication system or integrate with an existing one.

2. **Data Storage**: Choose a storage method:
   - Client-side: localStorage (default, works without a backend)
   - Server-side: Requires a backend system to store user data

3. **User Data Structure**: Store user data in a format like:

```json
{
  "id": "user123",
  "name": "John Doe",
  "points": 350,
  "level": 3,
  "badges": [
    "first_login",
    "profile_complete",
    "first_comment"
  ],
  "pointHistory": [
    {
      "description": "Completed Beginner Quiz",
      "points": 50,
      "timestamp": "2025-04-28T14:30:00Z"
    },
    {
      "description": "Earned Profile Complete Badge",
      "points": 25,
      "timestamp": "2025-04-27T10:15:00Z"
    }
  ]
}
```

4. **Server-Side Integration**: If using server-side storage, create API endpoints for:
   - Getting user data
   - Updating points
   - Awarding badges
   - Tracking progress

5. **Configuration**: Update the `_config.yml` file to use server-side storage:

```yaml
gamification:
  storage_method: "server_side"
  api_endpoint: "/api/gamification/"
```

## JavaScript API

The gamification system provides a JavaScript API for updating user data:

```javascript
// Initialize the gamification system
window.gamification.init();

// Get user data
const userData = window.gamification.getUserData();

// Update user points
window.gamification.updatePoints(newPoints, reason);

// Award a badge
window.gamification.awardBadge(badgeId);

// Check if user has completed a level
window.gamification.checkLevelUp();

// Reset user data (for testing)
window.gamification.resetUserData();
```

### Event Listeners

You can listen for gamification events:

```javascript
// Listen for point updates
document.addEventListener('gamification:points-update', function(e) {
  console.log('Points updated:', e.detail.points, e.detail.reason);
});

// Listen for badge awards
document.addEventListener('gamification:badge-award', function(e) {
  console.log('Badge awarded:', e.detail.badgeId);
});

// Listen for level ups
document.addEventListener('gamification:level-up', function(e) {
  console.log('Level up:', e.detail.oldLevel, e.detail.newLevel);
});
```

## Troubleshooting

### Common Issues

#### Badge Images Not Displaying

- Check that badge image filenames in `badges.yml` match the actual files in `assets/images/badges/`
- Verify that the `badge_image_path` in `_config.yml` is correct
- Ensure image files are properly formatted (SVG, PNG, etc.)

#### Points Not Updating

- Check browser console for JavaScript errors
- Verify that `gamification.js` is properly loaded
- Check if localStorage is available and not full

#### Challenges or Quizzes Not Working

- Ensure front matter in Markdown files is correctly formatted
- Check that the layout files (`challenge.html` and `quiz.html`) are properly included
- Verify that all required JavaScript files are loaded

#### Layout Issues

- Check for CSS conflicts with your main template
- Use browser developer tools to inspect elements and identify styling issues
- Adjust the CSS in `gamification.css` to match your template's styling

### Debugging

Enable debug mode in the gamification system by adding this script before loading `gamification.js`:

```html
<script>
  window.gamificationConfig = {
    debugMode: true
  };
</script>
```

This will output detailed logs to the browser console.

## Browser Compatibility

The gamification system is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

For older browsers, you may need to include polyfills for:
- localStorage
- ES6 features
- CSS flexbox

## Credits and License

This gamification system is released under the MIT License.

### Credits

- SVG badge designs created specifically for this project
- Gamification framework designed to integrate with Jekyll templates
- Interactive elements built with vanilla JavaScript for maximum compatibility

### License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.