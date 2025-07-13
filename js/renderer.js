/**
 * Quiz Renderer
 * Handles all DOM manipulation and UI rendering
 */
class QuizRenderer {
  constructor(config) {
    this.config = config;
    this.elements = {};
    this.currentScreen = "start";

    this.cacheElements();
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      quizTitle: document.getElementById("quiz-title"),
      quizSubtitle: document.getElementById("quiz-subtitle"),
      questionCount: document.getElementById("question-count"),
      progressBar: document.getElementById("progress-bar"),
      progressLabels: document.getElementById("progress-labels"),

      startScreen: document.getElementById("start-screen"),
      quizScreen: document.getElementById("quiz-screen"),
      resultsScreen: document.getElementById("results-screen"),

      startTitle: document.getElementById("start-title"),
      startDescription: document.getElementById("start-description"),
      startButton: document.getElementById("start-button"),

      questionText: document.getElementById("question-text"),
      optionsList: document.getElementById("options-list"),

      prevBtn: document.getElementById("prev-btn"),
      nextBtn: document.getElementById("next-btn"),

      resultsTitle: document.getElementById("results-title"),
      resultsSubtitle: document.getElementById("results-subtitle"),
      resultsList: document.getElementById("results-list"),
      exportBtn: document.getElementById("export-btn"),
      restartBtn: document.getElementById("restart-btn"),
    };
  }

  /**
   * Render initial UI based on configuration
   */
  async renderInitialUI() {
    this.injectDynamicStyles();
    this.renderHeader();
    this.renderStartScreen();
    this.renderNavigationButtons();
    this.renderResultsScreen();
    this.showStartScreen();
  }

  /**
   * Render header section
   */
  renderHeader() {
    if (this.elements.quizTitle) {
      this.elements.quizTitle.textContent = this.config.app.title;
    }

    if (this.elements.quizSubtitle) {
      this.elements.quizSubtitle.textContent = this.config.app.subtitle;
    }
  }

  /**
   * Render start screen
   */
  renderStartScreen() {
    if (this.elements.startTitle) {
      this.elements.startTitle.textContent = this.config.ui.startScreen.title;
    }

    if (this.elements.startDescription) {
      this.elements.startDescription.innerHTML =
        this.config.ui.startScreen.description
          .map((text) => `<p>${text}</p>`)
          .join("");
    }

    if (this.elements.startButton) {
      this.elements.startButton.textContent =
        this.config.ui.startScreen.startButton;
      this.elements.startButton.setAttribute("data-action", "start-quiz");
    }
  }

  /**
   * Render navigation buttons
   */
  renderNavigationButtons() {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.textContent = this.config.ui.navigation.prevButton;
      this.elements.prevBtn.setAttribute("data-action", "prev-question");
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.textContent = this.config.ui.navigation.nextButton;
      this.elements.nextBtn.setAttribute("data-action", "next-question");
    }
  }

  /**
   * Render results screen
   */
  renderResultsScreen() {
    if (this.elements.resultsTitle) {
      this.elements.resultsTitle.textContent = this.config.ui.results.title;
    }

    if (this.elements.resultsSubtitle) {
      this.elements.resultsSubtitle.textContent =
        this.config.ui.results.subtitle;
    }

    if (this.elements.exportBtn) {
      this.elements.exportBtn.textContent = this.config.ui.results.exportButton;
      this.elements.exportBtn.setAttribute("data-action", "export-results");
    }

    if (this.elements.restartBtn) {
      this.elements.restartBtn.textContent =
        this.config.ui.results.restartButton;
      this.elements.restartBtn.setAttribute("data-action", "restart-quiz");
    }
  }

  /**
   * Show start screen
   */
  showStartScreen() {
    this.hideAllScreens();
    this.elements.startScreen.style.display = "block";
    this.currentScreen = "start";

    // Set body class for styling
    document.body.className = "start-screen-header";

    // Hide navigation
    this.hideNavigation();
  }

  /**
   * Show quiz screen
   */
  showQuizScreen() {
    this.hideAllScreens();
    this.elements.quizScreen.style.display = "block";
    this.currentScreen = "quiz";

    // Show navigation
    this.showNavigation();
  }

  /**
   * Show results screen
   */
  showResultsScreen(answers, quizData) {
    this.hideAllScreens();
    this.elements.resultsScreen.style.display = "block";
    this.currentScreen = "results";

    // Set body class for styling
    document.body.className = "results-screen-header";

    // Hide navigation
    this.hideNavigation();

    // Render results content
    this.renderResultsList(answers, quizData);
  }

  /**
   * Hide all screens
   */
  hideAllScreens() {
    this.elements.startScreen.style.display = "none";
    this.elements.quizScreen.style.display = "none";
    this.elements.resultsScreen.style.display = "none";
  }

  /**
   * Show navigation
   */
  showNavigation() {
    const navigation = document.querySelector(".quiz-navigation");
    if (navigation) {
      navigation.style.display = "flex";
    }
  }

  /**
   * Hide navigation
   */
  hideNavigation() {
    const navigation = document.querySelector(".quiz-navigation");
    if (navigation) {
      navigation.style.display = "none";
    }
  }

  /**
   * Render current question
   */
  renderQuestion(question, category, currentAnswer = null) {
    // Set category class for styling
    document.body.className = this.getCategoryClass(category.category);

    // Render question text
    if (this.elements.questionText) {
      this.elements.questionText.textContent = question.question;
    }

    // Render based on question type
    if (this.elements.optionsList) {
      this.elements.optionsList.innerHTML = "";

      if (question.type === "open") {
        // Render open-ended question input
        this.renderOpenQuestion(question, currentAnswer);
      } else {
        // Render multiple choice options (default, for backward compatibility)
        this.renderChoiceQuestion(question, currentAnswer);
      }
    }
  }

  /**
   * Render multiple choice question
   */
  renderChoiceQuestion(question, currentAnswer = null) {
    Object.entries(question.options).forEach(([key, value]) => {
      const li = document.createElement("li");
      li.className = "option";
      li.setAttribute("data-action", "select-option");
      li.setAttribute("data-option", key);

      // Restore previous answer if exists
      if (currentAnswer === key) {
        li.classList.add("selected");
      }

      li.innerHTML = `
        <span class="option-label">${key}</span>
        <span class="option-text">${value}</span>
      `;

      this.elements.optionsList.appendChild(li);
    });
  }

  /**
   * Render open-ended question
   */
  renderOpenQuestion(question, currentAnswer = null) {
    const div = document.createElement("div");
    div.className = "open-question-container";

    const textarea = document.createElement("textarea");
    textarea.className = "open-question-input";
    textarea.placeholder = question.placeholder || "请输入您的答案...";
    textarea.setAttribute("data-action", "input-answer");
    textarea.rows = 6;

    // Restore previous answer if exists
    if (currentAnswer) {
      textarea.value = currentAnswer;
    }

    div.appendChild(textarea);
    this.elements.optionsList.appendChild(div);
  }

  /**
   * Select option
   */
  selectOption(optionElement, category) {
    // Remove selection from all options
    document.querySelectorAll(".option").forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Select current option
    optionElement.classList.add("selected");
  }

  /**
   * Update navigation buttons
   */
  updateNavigationButtons(state) {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = state.isFirstQuestion;
      this.elements.prevBtn.style.visibility = state.isFirstQuestion
        ? "hidden"
        : "visible";
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = false; // Always allow navigation
      this.elements.nextBtn.textContent = state.isLastQuestion
        ? "查看结果"
        : this.config.ui.navigation.nextButton;
    }
  }

  /**
   * Update progress bar
   */
  updateProgress(progressData) {
    if (!this.elements.progressBar) return;

    // Initialize progress bar if needed
    if (this.elements.progressBar.children.length === 0) {
      this.initializeProgressBar(progressData);
    }

    // Update progress segments
    progressData.forEach((item, index) => {
      const segment = document.getElementById(`segment-${index}`);
      const answeredFill = document.getElementById(
        `segment-answered-fill-${index}`
      );
      const progressFill = document.getElementById(
        `segment-progress-fill-${index}`
      );

      if (segment && answeredFill && progressFill) {
        // Calculate answered percentage
        const answeredPercentage = (item.answered / item.total) * 100;

        // Calculate current question progress (only for current category)
        let currentProgressPercentage = answeredPercentage;
        if (item.status === "current") {
          currentProgressPercentage =
            ((item.currentQuestionIndex + 1) / item.total) * 100;
        }

        // Store previous values for animation detection
        const prevAnsweredWidth = answeredFill.style.width;
        const prevStatus = segment.dataset.prevStatus;

        // Gray fill shows background progress to current question position
        if (item.status === "current") {
          progressFill.style.width = currentProgressPercentage + "%";
          progressFill.style.left = "0%";
          progressFill.style.display = "block";
        } else if (item.status === "completed") {
          progressFill.style.width = "100%";
          progressFill.style.left = "0%";
          progressFill.style.display = "block";
        } else {
          progressFill.style.display = "none";
        }

        // Colored fill shows answered questions (on top of gray)
        answeredFill.style.width = answeredPercentage + "%";

        const segmentClass = this.getCategoryClass(item.category);
        segment.className = `progress-segment ${segmentClass} ${item.status}`;

        // Add completion animation trigger
        if (item.status === "completed" && prevStatus !== "completed") {
          segment.classList.add("just-completed");
          setTimeout(() => {
            segment.classList.remove("just-completed");
          }, 500);
        }

        // No animations needed

        // Store current status for next comparison
        segment.dataset.prevStatus = item.status;
      }
    });
  }

  /**
   * Initialize progress bar
   */
  initializeProgressBar(progressData) {
    if (!this.elements.progressBar || !this.elements.progressLabels) return;

    this.elements.progressBar.innerHTML = "";
    this.elements.progressLabels.innerHTML = "";

    progressData.forEach((item, index) => {
      // Create progress segment with entrance animation
      const segment = document.createElement("div");
      const segmentClass = this.getCategoryClass(item.category);
      segment.className = `progress-segment ${segmentClass}`;
      segment.id = `segment-${index}`;
      segment.style.opacity = "0";
      segment.style.transform = "translateY(10px)";

      // Create answered fill (colored)
      const answeredFill = document.createElement("div");
      answeredFill.className = "progress-segment-answered-fill";
      answeredFill.id = `segment-answered-fill-${index}`;
      answeredFill.style.width = "0%";
      segment.appendChild(answeredFill);

      // Create progress fill (gray, shows progress to current question)
      const progressFill = document.createElement("div");
      progressFill.className = "progress-segment-progress-fill";
      progressFill.id = `segment-progress-fill-${index}`;
      progressFill.style.display = "none";
      segment.appendChild(progressFill);

      this.elements.progressBar.appendChild(segment);

      // Animate segment entrance
      setTimeout(() => {
        segment.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        segment.style.opacity = "1";
        segment.style.transform = "translateY(0)";
      }, index * 100); // Staggered animation

      // Create progress label
      const label = document.createElement("div");
      label.className = "progress-label";
      label.textContent = item.category;
      this.elements.progressLabels.appendChild(label);
    });
  }

  /**
   * Update question counter
   */
  updateQuestionCounter(counter) {
    if (this.elements.questionCount) {
      const format =
        this.config.ui.progress?.counterFormat || "{current} / {total}";
      this.elements.questionCount.textContent = format
        .replace("{current}", counter.current)
        .replace("{total}", counter.total);
    }
  }

  /**
   * Render results list
   */
  renderResultsList(answers, quizData) {
    if (!this.elements.resultsList) return;

    let html = "";

    quizData.forEach((category, categoryIndex) => {
      const categoryClass = this.getCategoryClass(category.category);
      html += `<div class="result-category ${categoryClass}">`;
      html += `<h3>${category.category}</h3>`;

      category.questions.forEach((question, questionIndex) => {
        const answer = answers[categoryIndex][questionIndex];
        let answerText = "未作答";
        let answerLabel = "-";

        if (answer) {
          if (question.type === "open") {
            // For open-ended questions, display the text answer
            answerText = answer;
            answerLabel = "文本";
          } else {
            // For multiple choice questions, display the option text (default for backward compatibility)
            answerText = question.options[answer];
            answerLabel = answer;
          }
        }

        html += `
          <div class="result-question">
            <div class="result-question-text">${question.question}</div>
            <div class="result-answer">
              <span class="result-answer-label">${answerLabel}</span>
              <span class="result-answer-text">${answerText}</span>
            </div>
          </div>
        `;
      });

      html += "</div>";
    });

    this.elements.resultsList.innerHTML = html;
  }

  /**
   * Export results
   */
  exportResults(exportData, exportConfig) {
    if (!exportConfig.enabled) return;

    const blob = new Blob([exportData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportConfig.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Inject dynamic styles based on configuration
   */
  injectDynamicStyles() {
    const style = document.createElement("style");
    style.textContent = this.generateDynamicCSS();
    document.head.appendChild(style);
  }

  /**
   * Generate dynamic CSS based on configuration
   */
  generateDynamicCSS() {
    let css = "";

    // Add base progress segment styles with animations
    css += `
      .progress-segment {
        position: relative;
        overflow: hidden;
        background: #f5f5f5;
        border-radius: 8px;
        height: 8px;
        transition: all 0.3s ease;
      }
      
      .progress-segment:hover {
        transform: scaleY(1.2);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .progress-segment-answered-fill,
      .progress-segment-progress-fill {
        transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    opacity 0.3s ease;
      }
      
      .progress-segment-answered-fill {
        transform-origin: left center;
        animation: fillGrow 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .progress-segment-progress-fill {
        opacity: 0.7;
        background: #e0e0e0;
      }
      
      @keyframes fillGrow {
        0% {
          width: 0% !important;
          transform: scaleX(0);
        }
        50% {
          transform: scaleX(1.05);
        }
        100% {
          transform: scaleX(1);
        }
      }
      
      .progress-segment.current {
        box-shadow: 0 0 4px rgba(59, 130, 246, 0.4);
      }
      
      .progress-segment.completed {
        animation: completedBounce 0.5s ease-out;
      }
      
      .progress-segment.just-completed {
        animation: justCompletedCelebration 0.5s ease-out;
      }
      

      
      @keyframes completedBounce {
        0% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.3);
        }
        100% {
          transform: scaleY(1);
        }
      }
      
      @keyframes justCompletedCelebration {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(34, 197, 94, 0.4);
        }
        25% {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
        }
        75% {
          transform: scale(1.02);
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(34, 197, 94, 0);
        }
      }
      
      
    `;

    // Generate styles for each category
    Object.entries(this.config.theme.categories).forEach(([key, category]) => {
      const categoryClass = this.getCategoryClass(key);

      css += `
        /* Category ${key} styles */
        .${categoryClass} .quiz-header {
          background: linear-gradient(135deg, ${category.color}20 0%, ${category.color}30 100%);
          color: ${category.color};
        }
        
        .${categoryClass} .category-info {
          background: linear-gradient(135deg, ${category.color}20 0%, ${category.color}30 100%);
        }
        
        .${categoryClass} .category-name {
          color: ${category.color};
        }
        
        .${categoryClass} .option.selected {
          background: linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%);
          color: white;
          border-color: ${category.color};
        }
        
        .${categoryClass} .option.selected .option-label,
        .${categoryClass} .option.selected .option-text {
          color: white;
        }
        
        .${categoryClass} .btn-primary {
          background: ${category.color};
        }
        
        .${categoryClass} .btn-primary:hover {
          background: ${category.color}dd;
        }
        
        .progress-segment.${categoryClass} .progress-segment-progress-fill {
          background: #e0e0e0;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: inherit;
          z-index: 1;
        }
        
        .progress-segment.${categoryClass} .progress-segment-answered-fill {
          background: ${category.color};
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: inherit;
          z-index: 2;
        }
        
        .result-category.${categoryClass} h3 {
          color: ${category.color};
        }
        
        .result-category.${categoryClass} h3::after {
          background: linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%);
        }
      `;
    });

    return css;
  }

  /**
   * Get category CSS class using dynamic generation
   */
  getCategoryClass(categoryIdentifier) {
    // First, try to find the category in the config by key
    if (this.config.theme.categories[categoryIdentifier]) {
      return this.generateCSSClass(categoryIdentifier);
    }

    // If not found by key, search by name (for backward compatibility)
    for (const [key, category] of Object.entries(
      this.config.theme.categories
    )) {
      if (category.name === categoryIdentifier) {
        return this.generateCSSClass(key);
      }
    }

    // Fallback: generate class from the identifier itself
    return this.generateCSSClass(categoryIdentifier);
  }

  /**
   * Generate CSS class name from any string
   */
  generateCSSClass(str) {
    // Generate a simple hash from the string
    const hash = this.simpleHash(str);

    // Create a base class name from the string
    const baseName = str
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, "") // Keep only alphanumeric and Chinese characters
      .substring(0, 10); // Limit length

    // Combine with hash for uniqueness
    return `category-${baseName}-${hash}`;
  }

  /**
   * Simple hash function for string consistency
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 6);
  }
}
