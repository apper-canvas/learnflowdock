import quizzesData from "@/services/mockData/quizzes.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const quizService = {
  getByLessonId: async (lessonId) => {
    await delay(200);
    const quiz = quizzesData.find((q) => q.lessonId === lessonId.toString());
    return quiz ? { ...quiz } : null;
  },

  submitAnswers: async (quizId, answers) => {
    await delay(300);
    const quiz = quizzesData.find((q) => q.Id === parseInt(quizId));
    if (!quiz) return null;

    let correctCount = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: question.Id,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return {
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      results
    };
  }
};

export default quizService;