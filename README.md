# Quiz Application - Adding New Tests

## Overview

This is a modular quiz application that supports multiple test types through URL parameters. Each test type has its own combined JSON file containing both configuration and question data, making it easy to add new tests without modifying the core application code.

## Current Test Types

- **Love Test** (`quiz.html?test=love`) - Relationship values assessment
- **Personality Test** (`quiz.html?test=personality`) - Big Five personality traits
- **Career Test** (`quiz.html?test=career`) - Career interests and preferences

## Adding a New Test

### Step 1: Create Combined Test File

For each new test type, you need to create one JSON file:

`test-{testtype}.json` - Combined configuration and questions data

Replace `{testtype}` with your desired test identifier (e.g., `skills`, `health`, `finance`).

### Step 2: Configure the Combined Test File (`test-{testtype}.json`)

```json
{
  "testType": "your-test-type",
  "app": {
    "title": "Your Test Title",
    "subtitle": "Brief description of what this test measures"
  },
  "ui": {
    "startScreen": {
      "title": "Welcome to Your Test",
      "description": [
        "First paragraph describing the test...",
        "Second paragraph with more details...",
        "Instructions for taking the test..."
      ],
      "startButton": "开始测试"
    },
    "navigation": {
      "nextButton": "下一题",
      "prevButton": "上一题"
    },
    "results": {
      "title": "Your Test Results",
      "subtitle": "Here are your responses",
      "exportButton": "导出结果",
      "restartButton": "重新开始"
    }
  },
  "theme": {
    "categories": {
      "category1": {
        "name": "Category Name",
        "color": "#ff6b6b",
        "description": "Description of what this category measures"
      },
      "category2": {
        "name": "Another Category",
        "color": "#4ecdc4",
        "description": "Description of the second category"
      }
    }
  },
  "export": {
    "filename": "your-test-results",
    "template": {
      "header": "=== {title} ===\n\n",
      "category": "\n【{category}】\n{separator}\n",
      "question": "问题：{question}\n答案：{answer}. {answerText}\n\n",
      "separator": "="
    }
  },
  "questions": [
    {
      "category": "category1",
      "questions": [
        {
          "question": "Your question text here?",
          "options": {
            "A": "First option text",
            "B": "Second option text",
            "C": "Third option text",
            "D": "Fourth option text"
          }
        },
        {
          "question": "Another question in this category?",
          "options": {
            "A": "Option A",
            "B": "Option B"
          }
        }
      ]
    },
    {
      "category": "category2",
      "questions": [
        {
          "question": "Question from second category?",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C"
          }
        }
      ]
    }
  ]
}
```

### Step 3: Add Test to Landing Page

Edit `index.html` to add your new test to the selection cards:

```html
<div class="test-card" onclick="startTest('your-test-type')">
  <div class="test-icon">🎯</div>
  <h3>Your Test Title</h3>
  <p>Brief description of what this test measures and who it's for.</p>
  <div class="test-info">
    <span class="question-count">X questions</span>
    <span class="test-duration">~Y minutes</span>
  </div>
</div>
```

### Step 4: Test Your Implementation

1. Ensure your file is named correctly: `test-{testtype}.json`
2. Test the URL: `quiz.html?test={testtype}`
3. Verify all categories and questions load correctly

## Configuration Options

### App Configuration

- **title**: Main test title displayed in header
- **subtitle**: Brief description shown in header

### UI Configuration

- **startScreen**: Welcome screen content and start button text
- **navigation**: Button text for next/previous navigation
- **results**: Results page configuration and button text

### Theme Configuration

Categories are defined in the `theme.categories` object:

- **name**: Display name (supports Chinese characters)
- **color**: Hex color code for styling
- **description**: Brief explanation of the category

### Export Configuration

- **filename**: Base name for exported files
- **template**: Format templates for export output

### Questions Structure

Questions are organized by category in the `questions` array:

- **category**: Must match a category name from theme.categories
- **questions**: Array of question objects with text and options

Each question contains:

- **question**: Question text
- **options**: Object with A, B, C, D... keys and answer text values

## Chinese Character Support

The system supports Chinese characters in category names with automatic CSS class mapping:

- Chinese characters are automatically converted to safe CSS classes
- Colors and styling are applied based on category configuration
- Full UTF-8 support for questions and answers

## File Structure

```
match_test/
├── index.html              # Landing page with test selection
├── quiz.html               # Main quiz interface
├── test-love.json          # Love test (combined config and questions)
├── test-personality.json   # Personality test (combined config and questions)
├── test-career.json        # Career test (combined config and questions)
├── test-{newtest}.json     # Your new test (combined config and questions)
└── js/
    ├── app.js              # Main application logic
    ├── quiz-engine.js      # Quiz engine
    └── renderer.js         # UI rendering
```

## Best Practices

1. **Consistent Naming**: Use kebab-case for test type identifiers
2. **Category Balance**: Aim for 3-6 categories per test
3. **Question Distribution**: Distribute questions evenly across categories
4. **Option Variety**: Provide 2-5 answer options per question
5. **Clear Language**: Use simple, clear language in questions
6. **Color Coordination**: Choose colors that work well together
7. **Mobile Friendly**: Test on mobile devices for responsive design

## Troubleshooting

### Common Issues

1. **Test not loading**: Check file naming convention (`test-{testtype}.json`)
2. **Styling issues**: Verify category colors are valid hex codes
3. **Questions not showing**: Ensure category names match between theme and questions
4. **Navigation problems**: Check button text configuration

### Error Messages

- "Cannot read properties of undefined": Usually indicates file structure mismatch
- "404 Not Found": Check file paths and naming (`test-{testtype}.json`)
- "Invalid JSON": Validate your JSON syntax

## Examples

Check the existing test files for complete examples:

- Love test: `test-love.json`
- Personality test: `test-personality.json`
- Career test: `test-career.json`

## URL Structure

- Landing page: `index.html`
- Quiz interface: `quiz.html?test={testtype}`
- Direct access: Quiz redirects to index.html if no test parameter

## Key Changes

### From Previous Version

- **Simplified Structure**: Combined configuration and questions into single files
- **Single File Management**: Only one file per test type instead of two
- **Easier Maintenance**: All test data in one location
- **Consistent Format**: Unified structure across all test types

### Migration

If you have existing separate config and quiz files, combine them using the structure shown above. The application now expects single `test-{testtype}.json` files instead of separate `config-{testtype}.json` and `quiz-{testtype}.json` files.

## Support

For questions or issues with adding new tests, refer to the existing test files as templates and ensure all required fields are properly configured in the combined JSON structure.
