/**
 * Main Application Controller
 * Orchestrates the entire quiz system and manages configuration
 */
class QuizApp {
  constructor() {
    this.config = null;
    this.quizData = null;
    this.engine = null;
    this.renderer = null;
    this.initialized = false;
    this.testType = this.getTestTypeFromURL();
  }

  /**
   * Parse URL parameters to determine test type
   */
  getTestTypeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const testType = urlParams.get("test");

    // If no test parameter provided, redirect to index
    if (!testType) {
      window.location.href = "index.html";
      return null;
    }

    return testType;
  }

  /**
   * Get test data file name based on test type
   */
  getTestDataFileName() {
    return `test-${this.testType}.json`;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // If no test type (redirect case), don't initialize
      if (!this.testType) {
        return;
      }

      // Load test data (combined config and questions)
      await this.loadTestData();

      // Initialize components
      this.engine = new QuizEngine(this.quizData);
      this.renderer = new QuizRenderer(this.config);

      // Setup event listeners
      this.setupEventListeners();

      // Render initial UI
      await this.renderer.renderInitialUI();

      this.initialized = true;
      console.log(
        `Quiz Application initialized successfully with test type: ${this.testType}`
      );
    } catch (error) {
      console.error("Failed to initialize quiz application:", error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Load test data from combined JSON file
   */
  async loadTestData() {
    try {
      const testFile = this.getTestDataFileName();
      const response = await fetch(testFile);
      if (!response.ok) {
        throw new Error(
          `Failed to load test data: ${response.status} - ${testFile}`
        );
      }
      const testData = await response.json();

      // Extract config and quiz data from combined structure
      this.config = {
        app: testData.app,
        ui: testData.ui,
        theme: testData.theme,
        export: testData.export,
      };

      this.quizData = testData.questions;

      console.log(`Loaded test data from: ${testFile}`);
    } catch (error) {
      throw new Error(`Test data loading failed: ${error.message}`);
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Start quiz button
    document.addEventListener("click", (e) => {
      if (e.target.matches('[data-action="start-quiz"]')) {
        this.startQuiz();
      }
    });

    // Navigation buttons
    document.addEventListener("click", (e) => {
      if (e.target.matches('[data-action="next-question"]')) {
        this.nextQuestion();
      }
      if (e.target.matches('[data-action="prev-question"]')) {
        this.previousQuestion();
      }
    });

    // Option selection
    document.addEventListener("click", (e) => {
      if (
        e.target.matches('[data-action="select-option"]') ||
        e.target.closest('[data-action="select-option"]')
      ) {
        const optionElement = e.target.closest('[data-action="select-option"]');
        const optionKey = optionElement.dataset.option;
        this.selectOption(optionKey, optionElement);
      }
    });

    // Results actions
    document.addEventListener("click", (e) => {
      if (e.target.matches('[data-action="export-results"]')) {
        this.exportResults();
      }
      if (e.target.matches('[data-action="restart-quiz"]')) {
        this.restartQuiz();
      }
    });
  }

  /**
   * Start the quiz
   */
  startQuiz() {
    if (!this.initialized) return;

    this.engine.start();
    this.renderer.showQuizScreen();
    this.updateUI();
  }

  /**
   * Select an option
   */
  selectOption(optionKey, optionElement) {
    if (!this.initialized) return;

    const wasAnswered = this.engine.selectOption(optionKey);
    this.renderer.selectOption(optionElement, this.engine.getCurrentCategory());

    if (!wasAnswered) {
      this.updateProgress();
    }

    this.updateNavigationButtons();
  }

  /**
   * Go to next question
   */
  nextQuestion() {
    if (!this.initialized) return;

    const result = this.engine.nextQuestion();

    if (result.finished) {
      this.showResults();
    } else {
      this.updateUI();
    }
  }

  /**
   * Go to previous question
   */
  previousQuestion() {
    if (!this.initialized) return;

    this.engine.previousQuestion();
    this.updateUI();
  }

  /**
   * Show results screen
   */
  showResults() {
    const answers = this.engine.getAnswers();

    this.renderer.showResultsScreen(answers, this.quizData);
    this.updateProgress();
  }

  /**
   * Export results
   */
  exportResults() {
    if (!this.initialized) return;

    const answers = this.engine.getAnswers();
    const exportData = this.prepareExportData(answers, this.quizData);

    this.renderer.exportResults(exportData, this.config.export);
  }

  /**
   * Prepare export data
   */
  prepareExportData(answers, quizData) {
    const exportTemplate = this.config.export.template;
    let exportText = exportTemplate.header.replace(
      "{title}",
      this.config.app.title
    );

    quizData.forEach((category, categoryIndex) => {
      exportText += exportTemplate.category
        .replace("{category}", category.category)
        .replace(
          "{separator}",
          exportTemplate.separator.repeat(category.category.length)
        );

      category.questions.forEach((question, questionIndex) => {
        const answer = answers[categoryIndex][questionIndex];
        const answerText = answer ? question.options[answer] : "未作答";

        exportText += exportTemplate.question
          .replace("{question}", question.question)
          .replace("{answer}", answer || "-")
          .replace("{answerText}", answerText);
      });

      exportText += "\n";
    });

    return exportText;
  }

  /**
   * Restart quiz
   */
  restartQuiz() {
    if (!this.initialized) return;

    this.engine.restart();
    this.renderer.showStartScreen();
    this.updateProgress();
  }

  /**
   * Update UI components
   */
  updateUI() {
    const currentQuestion = this.engine.getCurrentQuestion();
    const currentCategory = this.engine.getCurrentCategory();
    const currentAnswer = this.engine.getCurrentAnswer();

    this.renderer.renderQuestion(
      currentQuestion,
      currentCategory,
      currentAnswer
    );
    this.updateNavigationButtons();
    this.updateProgress();
    this.updateQuestionCounter();
  }

  /**
   * Update navigation buttons
   */
  updateNavigationButtons() {
    const state = this.engine.getState();
    this.renderer.updateNavigationButtons(state);
  }

  /**
   * Update progress bar
   */
  updateProgress() {
    const progress = this.engine.getProgress();
    this.renderer.updateProgress(progress);
  }

  /**
   * Update question counter
   */
  updateQuestionCounter() {
    const counter = this.engine.getQuestionCounter();
    this.renderer.updateQuestionCounter(counter);
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 20px;">
          <h2 style="color: #e74c3c;">应用程序初始化失败</h2>
          <p style="color: #666; margin-bottom: 20px;">${error.message}</p>
          <button onclick="location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
            重新加载
          </button>
        </div>
      </div>
    `;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.quizApp = new QuizApp();
  window.quizApp.init();
});
