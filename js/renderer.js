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
      this.elements.prevBtn.textContent = this.config.ui.navigation.previous;
      this.elements.prevBtn.setAttribute("data-action", "prev-question");
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.textContent = this.config.ui.navigation.next;
      this.elements.nextBtn.setAttribute("data-action", "next-question");
    }
  }

  /**
   * Render results screen
   */
  renderResultsScreen() {
    if (this.elements.resultsTitle) {
      this.elements.resultsTitle.textContent =
        this.config.ui.resultsScreen.title;
    }

    if (this.elements.resultsSubtitle) {
      this.elements.resultsSubtitle.textContent =
        this.config.ui.resultsScreen.subtitle;
    }

    if (this.elements.exportBtn) {
      this.elements.exportBtn.textContent =
        this.config.ui.resultsScreen.actions.export;
      this.elements.exportBtn.setAttribute("data-action", "export-results");
    }

    if (this.elements.restartBtn) {
      this.elements.restartBtn.textContent =
        this.config.ui.resultsScreen.actions.restart;
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
        ? this.config.ui.navigation.finish
        : this.config.ui.navigation.next;
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
      const format = this.config.ui.progress.counterFormat;
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
   * Get category CSS class
   */
  getCategoryClass(categoryName) {
    const theme = this.config.theme.categories[categoryName];
    return theme ? `category-${theme.id}` : "category-default";
  }

  /**
   * Get segment CSS class
   */
  getSegmentClass(categoryName) {
    const theme = this.config.theme.categories[categoryName];
    return theme ? `segment-${theme.id}` : "segment-default";
  }
}
