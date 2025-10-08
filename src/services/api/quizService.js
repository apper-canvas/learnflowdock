const quizService = {
  getByLessonId: async (lessonId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('quiz_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "lesson_id_c"}},
          {"field": {"Name": "passing_score_c"}},
          {"field": {"Name": "questions_c"}}
        ],
        where: [
          {"FieldName": "lesson_id_c", "Operator": "EqualTo", "Values": [lessonId.toString()]}
        ]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const quiz = response.data[0];
      return {
        Id: quiz.Id,
        lessonId: quiz.lesson_id_c,
        passingScore: quiz.passing_score_c,
        questions: quiz.questions_c ? JSON.parse(quiz.questions_c) : []
      };
    } catch (error) {
      console.error(`Error fetching quiz for lesson ${lessonId}:`, error?.message || error);
      return null;
    }
  },

  submitAnswers: async (quizId, answers) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.getRecordById('quiz_c', parseInt(quizId), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "lesson_id_c"}},
          {"field": {"Name": "passing_score_c"}},
          {"field": {"Name": "questions_c"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return null;
      }

      const quiz = response.data;
      const questions = quiz.questions_c ? JSON.parse(quiz.questions_c) : [];

      let correctCount = 0;
      const results = questions.map((question, index) => {
        const isCorrect = answers[index] === question.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: question.Id,
          isCorrect,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        };
      });

      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= quiz.passing_score_c;

      return {
        score,
        passed,
        correctCount,
        totalQuestions: questions.length,
        results
      };
    } catch (error) {
      console.error("Error submitting quiz answers:", error?.message || error);
      return null;
    }
  }
};

export default quizService;
export default quizService;