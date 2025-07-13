/**
 * Generic Quiz Engine
 * Handles quiz logic, state management, and navigation
 */
class QuizEngine {
  constructor(quizData) {
    this.quizData = quizData;
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.totalQuestions = 0;
    this.answeredQuestions = 0;
    this.started = false;

    this.initialize();
  }

  /**
   * Initialize the quiz engine
   */
  initialize() {
    // Calculate total questions
    this.totalQuestions = this.quizData.reduce(
      (total, category) => total + category.questions.length,
      0
    );

    // Initialize answers object
    this.quizData.forEach((category, catIndex) => {
      this.answers[catIndex] = {};
    });

    this.resetCounters();
  }

  /**
   * Start the quiz
   */
  start() {
    this.started = true;
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
  }

  /**
   * Restart the quiz
   */
  restart() {
    this.started = false;
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.resetCounters();

    // Clear all answers
    this.quizData.forEach((category, catIndex) => {
      this.answers[catIndex] = {};
    });
  }

  /**
   * Reset counters
   */
  resetCounters() {
    this.answeredQuestions = 0;
  }

  /**
   * Select an option for current question
   */
  selectOption(optionKey) {
    if (!this.started) return false;

    const wasAnswered =
      this.answers[this.currentCategoryIndex][this.currentQuestionIndex] !==
      undefined;

    this.answers[this.currentCategoryIndex][this.currentQuestionIndex] =
      optionKey;

    if (!wasAnswered) {
      this.answeredQuestions++;
    }

    return wasAnswered;
  }

  /**
   * Set text answer for open-ended questions
   */
  setTextAnswer(text) {
    if (!this.started) return false;

    const wasAnswered =
      this.answers[this.currentCategoryIndex][this.currentQuestionIndex] !==
      undefined;

    this.answers[this.currentCategoryIndex][this.currentQuestionIndex] = text;

    if (!wasAnswered && text && text.trim()) {
      this.answeredQuestions++;
    } else if (wasAnswered && (!text || !text.trim())) {
      this.answeredQuestions--;
    }

    return wasAnswered;
  }

  /**
   * Go to next question
   */
  nextQuestion() {
    if (!this.started) return { finished: false };

    if (
      this.currentQuestionIndex <
      this.quizData[this.currentCategoryIndex].questions.length - 1
    ) {
      this.currentQuestionIndex++;
    } else if (this.currentCategoryIndex < this.quizData.length - 1) {
      this.currentCategoryIndex++;
      this.currentQuestionIndex = 0;
    } else {
      return { finished: true };
    }

    return { finished: false };
  }

  /**
   * Go to previous question
   */
  previousQuestion() {
    if (!this.started) return false;

    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else if (this.currentCategoryIndex > 0) {
      this.currentCategoryIndex--;
      this.currentQuestionIndex =
        this.quizData[this.currentCategoryIndex].questions.length - 1;
    }

    return true;
  }

  /**
   * Get current question
   */
  getCurrentQuestion() {
    if (!this.started) return null;

    return this.quizData[this.currentCategoryIndex].questions[
      this.currentQuestionIndex
    ];
  }

  /**
   * Get current category
   */
  getCurrentCategory() {
    if (!this.started) return null;

    return this.quizData[this.currentCategoryIndex];
  }

  /**
   * Get current answer for the question
   */
  getCurrentAnswer() {
    if (!this.started) return null;

    return this.answers[this.currentCategoryIndex][this.currentQuestionIndex];
  }

  /**
   * Get quiz state
   */
  getState() {
    const isFirstQuestion =
      this.currentCategoryIndex === 0 && this.currentQuestionIndex === 0;
    const isLastQuestion =
      this.currentCategoryIndex === this.quizData.length - 1 &&
      this.currentQuestionIndex ===
        this.quizData[this.currentCategoryIndex].questions.length - 1;

    return {
      isFirstQuestion,
      isLastQuestion,
      currentCategoryIndex: this.currentCategoryIndex,
      currentQuestionIndex: this.currentQuestionIndex,
      hasCurrentAnswer: this.getCurrentAnswer() !== undefined,
      started: this.started,
    };
  }

  /**
   * Get progress information
   */
  getProgress() {
    const progress = [];

    this.quizData.forEach((category, index) => {
      const categoryAnswered = Object.keys(this.answers[index] || {}).length;
      const categoryTotal = category.questions.length;
      const categoryProgress = (categoryAnswered / categoryTotal) * 100;

      let status = "pending";
      let currentQuestionIndex = 0;
      let maxQuestionReached = 0;

      if (categoryAnswered === categoryTotal) {
        status = "completed";
        maxQuestionReached = categoryTotal - 1;
      } else if (index === this.currentCategoryIndex) {
        status = "current";
        currentQuestionIndex = this.currentQuestionIndex;
        maxQuestionReached = this.currentQuestionIndex;
      } else if (index < this.currentCategoryIndex) {
        // For passed categories, find the highest question index that was reached
        status = "passed";
        const answeredQuestions = Object.keys(this.answers[index] || {}).map(
          Number
        );
        if (answeredQuestions.length > 0) {
          maxQuestionReached = Math.max(...answeredQuestions);
        }
      }

      progress.push({
        category: category.category,
        progress: categoryProgress,
        status: status,
        answered: categoryAnswered,
        total: categoryTotal,
        currentQuestionIndex: currentQuestionIndex,
        maxQuestionReached: maxQuestionReached,
      });
    });

    return progress;
  }

  /**
   * Get question counter information
   */
  getQuestionCounter() {
    let currentQuestionNumber = 0;

    for (let i = 0; i < this.currentCategoryIndex; i++) {
      currentQuestionNumber += this.quizData[i].questions.length;
    }
    currentQuestionNumber += this.currentQuestionIndex + 1;

    return {
      current: currentQuestionNumber,
      total: this.totalQuestions,
    };
  }

  /**
   * Get all answers
   */
  getAnswers() {
    return this.answers;
  }

  /**
   * Get quiz data
   */
  getQuizData() {
    return this.quizData;
  }

  /**
   * Check if quiz is completed
   */
  isCompleted() {
    return this.answeredQuestions === this.totalQuestions;
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage() {
    return (this.answeredQuestions / this.totalQuestions) * 100;
  }
}
