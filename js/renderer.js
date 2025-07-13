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

    // Render options
    if (this.elements.optionsList) {
      this.elements.optionsList.innerHTML = "";

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
      const fill = document.getElementById(`segment-fill-${index}`);

      if (segment && fill) {
        fill.style.width = item.progress + "%";

        const segmentClass = this.getSegmentClass(item.category);
        segment.className = `progress-segment ${segmentClass} ${item.status}`;
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
      // Create progress segment
      const segment = document.createElement("div");
      const segmentClass = this.getSegmentClass(item.category);
      segment.className = `progress-segment ${segmentClass}`;
      segment.id = `segment-${index}`;

      // Create fill for the segment
      const fill = document.createElement("div");
      fill.className = "progress-segment-fill";
      fill.id = `segment-fill-${index}`;
      segment.appendChild(fill);

      this.elements.progressBar.appendChild(segment);

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
        const answerText = answer ? question.options[answer] : "未作答";

        html += `
          <div class="result-question">
            <div class="result-question-text">${question.question}</div>
            <div class="result-answer">
              <span class="result-answer-label">${answer || "-"}</span>
              <span>${answerText}</span>
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

    // Generate styles for each category
    Object.entries(this.config.theme.categories).forEach(([key, category]) => {
      const categoryClass = this.getCategoryClass(key);
      const segmentClass = this.getSegmentClass(key);

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
        
        .progress-segment.${segmentClass}.completed .progress-segment-fill {
          background: ${category.color};
        }
        
        .progress-segment.${segmentClass}.current .progress-segment-fill {
          background: ${category.color}99;
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
   * Get category CSS class
   */
  getCategoryClass(categoryName) {
    // Create a mapping for Chinese category names to simple class names
    const categoryMapping = {
      价值底色: "values",
      人生规划: "planning",
      金钱观: "money",
      家庭观: "family",
      感情观: "emotion",
      情感表达: "emotion",
      外向性: "extroversion",
      开放性: "openness",
      责任感: "conscientiousness",
      亲和力: "agreeableness",
      情绪稳定性: "neuroticism",
      兴趣偏好: "interests",
      技能优势: "skills",
      工作风格: "workstyle",
      价值观: "values",
    };

    const safeClassName =
      categoryMapping[categoryName] ||
      categoryName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `category-${safeClassName}`;
  }

  /**
   * Get segment CSS class
   */
  getSegmentClass(categoryName) {
    // Create a mapping for Chinese category names to simple class names
    const categoryMapping = {
      价值底色: "values",
      人生规划: "planning",
      金钱观: "money",
      家庭观: "family",
      感情观: "emotion",
      情感表达: "emotion",
      外向性: "extroversion",
      开放性: "openness",
      责任感: "conscientiousness",
      亲和力: "agreeableness",
      情绪稳定性: "neuroticism",
      兴趣偏好: "interests",
      技能优势: "skills",
      工作风格: "workstyle",
      价值观: "values",
    };

    const safeClassName =
      categoryMapping[categoryName] ||
      categoryName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `segment-${safeClassName}`;
  }
}
