# Gamification System for Euro-Agency Jekyll Template

This gamification system enhances the Euro-Agency Jekyll template with badges, levels, points, challenges, and interactive elements to increase user engagement.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Components](#components)
5. [Creating Content](#creating-content)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

## Overview

The gamification system adds the following features to your Euro-Agency Jekyll site:

- **Badge System**: 25+ badges that users can earn through various activities
- **Level System**: 7 levels with increasing requirements and rewards
- **Points System**: Points awarded for completing activities
- **Challenges**: Interactive tasks for users to complete
- **Quizzes**: Knowledge tests with scoring and feedback
- **Progress Tracking**: Track user progress through localStorage

## Installation

1. Copy the `gamification-system` directory to the root of your Euro-Agency Jekyll site.

2. Add the following to your `_config.yml` file:

```yaml
# Gamification settings
gamification:
  enabled: true
  storage_key: "euro_agency_gamification"
  notifications_enabled: true
  notification_duration: 5000
```

3. Include the gamification CSS and JavaScript files in your site by adding the following to your `_includes/styles.html`:

```html
{% if site.gamification.enabled %}
<link rel="stylesheet" href="{{ site.baseurl }}/gamification-system/assets/css/gamification.css">
{% endif %}
```

4. Add the following to your `_includes/scripts.html`:

```html
{% if site.gamification.enabled %}
<script src="{{ site.baseurl }}/gamification-system/assets/js/gamification.js"></script>
<script src="{{ site.baseurl }}/gamification-system/assets/js/interactive.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.Gamification) {
      Gamification.init({
        storageKey: "{{ site.gamification.storage_key }}",
        notificationsEnabled: {{ site.gamification.notifications_enabled }},
        notificationDuration: {{ site.gamification.notification_duration }},
        language: "{{ page.lang }}"
      });
    }
  });
</script>
{% endif %}
```

## Configuration

### Data Files

The gamification system uses three main data files:

1. **badges.yml**: Defines all available badges
2. **levels.yml**: Defines level thresholds and rewards
3. **challenges.yml**: Defines challenge categories and challenges

These files are located in the `gamification-system/_data/` directory.

### Translations

Add the following to your `_data/t.yml` file or create a new file `_data/gamification.yml` with translations for gamification elements:

```yaml
# Gamification translations
points:
  en: "points"
  it: "punti"
level_prefix:
  en: "Level"
  it: "Livello"
next_level:
  en: "Next Level"
  it: "Prossimo Livello"
points_needed:
  en: "points needed"
  it: "punti necessari"
max_level_reached:
  en: "Maximum level reached!"
  it: "Livello massimo raggiunto!"
current_rewards:
  en: "Current Level Rewards"
  it: "Ricompense Livello Attuale"
# Add more translations as needed
```

## Components

### Badge Display

Include the badge display component in any page:

```html
{% include gamification/badge-display.html %}
```

Options:
- `show_locked`: Whether to show locked badges (default: true)
- `max_badges`: Maximum number of badges to display (default: 100)
- `title`: Title for the badge section (optional)
- `layout`: Display layout - 'grid' or 'list' (default: 'grid')
- `show_all_link`: Whether to show a link to all badges (default: false)

Example:
```html
{% include gamification/badge-display.html title="Your Badges" max_badges=5 show_all_link=true %}
```

### Level Progress

Include the level progress component in any page:

```html
{% include gamification/level-progress.html %}
```

Options:
- `show_next_level`: Whether to show next level information (default: true)
- `show_points_needed`: Whether to show points needed for next level (default: true)
- `show_percentage`: Whether to show percentage progress (default: true)
- `compact`: Whether to show a compact version (default: false)

Example:
```html
{% include gamification/level-progress.html compact=true %}
```

### Points Counter

Include the points counter component in any page:

```html
{% include gamification/points-counter.html %}
```

Options:
- `show_icon`: Whether to show the points icon (default: true)
- `show_label`: Whether to show the points label (default: true)
- `size`: Size of the counter - 'small', 'medium', or 'large' (default: 'medium')
- `position`: Position of the counter - 'inline', 'fixed-top', or 'fixed-bottom' (default: 'inline')

Example:
```html
{% include gamification/points-counter.html size="small" position="fixed-top" %}
```

## Creating Content

### Challenges

1. Create a new file in the `challenges` directory with the following front matter:

```yaml
---
layout: challenge
title: Challenge Title
description: Challenge description
challenge_id: unique_challenge_id
show_related_challenges: true
show_badges: true
---

Challenge content goes here. This can include instructions, images, or any other content.
```

2. Make sure the `challenge_id` matches an entry in `challenges.yml`.

### Quizzes

1. Create a new file in the `quizzes` directory with the following front matter:

```yaml
---
layout: quiz
title: Quiz Title
description: Quiz description
quiz_id: unique_quiz_id
category: knowledge
difficulty: medium
points: 50
required_level: 1
time_limit: 300
intro_text: Welcome to this quiz! Test your knowledge.
show_related_quizzes: true
show_badges: true
questions:
  - type: multiple-choice
    text: What is the capital of France?
    options:
      - text: London
        correct: false
      - text: Paris
        correct: true
      - text: Berlin
        correct: false
      - text: Madrid
        correct: false
  - type: checkbox
    text: Which of these are planets?
    options:
      - text: Earth
        correct: true
      - text: Moon
        correct: false
      - text: Mars
        correct: true
      - text: Sun
        correct: false
  - type: text
    text: What is 2 + 2?
    answer: 4
---

Quiz introduction content goes here.
```

## Customization

### Styling

You can customize the appearance of gamification elements by modifying the `gamification-system/assets/css/gamification.css` file.

### Badge Images

Place badge images in the `gamification-system/assets/images/badges/` directory. The recommended size is 200x200 pixels.

### Level Icons

Place level icons in the `gamification-system/assets/images/` directory. The recommended size is 100x100 pixels.

## Troubleshooting

### Common Issues

1. **Badges not displaying**: Make sure badge images exist in the correct directory and that the paths in `badges.yml` are correct.

2. **JavaScript errors**: Check the browser console for errors. Make sure all required files are included and that the paths are correct.

3. **Data not persisting**: The system uses localStorage, which may be disabled in some browsers or private browsing modes.

### Debug Mode

Add `debug: true` to your gamification settings in `_config.yml` to enable debug mode:

```yaml
gamification:
  enabled: true
  debug: true
  # other settings...
```

This will log additional information to the browser console.

## Integration with Euro-Agency Template

The gamification system is designed to integrate seamlessly with the Euro-Agency template structure:

1. **Multi-language Support**: All components support the template's multi-language system.

2. **Component-Based Architecture**: Gamification components follow the same include pattern as the template.

3. **Bootstrap Integration**: All gamification elements are styled to work with the template's Bootstrap-based design.

4. **Configuration**: The gamification system uses the same configuration approach as the template.

For any questions or issues, please open an issue on the GitHub repository.