import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const QuizQuestion = ({ question, selectedAnswer, onSelectAnswer, questionNumber, showResult, result }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="mb-6">
        <div className="text-sm font-semibold text-primary mb-2">
          Question {questionNumber}
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {question.text}
        </h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && index === question.correctAnswer;
          const isWrong = showResult && isSelected && index !== question.correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={showResult}
              className={cn(
                "w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200",
                "flex items-center gap-3",
                !showResult && !isSelected && "border-gray-200 hover:border-primary hover:bg-primary/5",
                !showResult && isSelected && "border-primary bg-primary/10",
                showResult && isCorrect && "border-green-500 bg-green-50",
                showResult && isWrong && "border-red-500 bg-red-50",
                showResult && !isSelected && !isCorrect && "border-gray-200 opacity-60"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-semibold text-sm",
                !showResult && !isSelected && "border-gray-300 text-gray-500",
                !showResult && isSelected && "border-primary bg-primary text-white",
                showResult && isCorrect && "border-green-500 bg-green-500 text-white",
                showResult && isWrong && "border-red-500 bg-red-500 text-white"
              )}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className={cn(
                "flex-1 font-medium",
                showResult && isCorrect && "text-green-700",
                showResult && isWrong && "text-red-700"
              )}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {showResult && result && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-blue-900 mb-1">Explanation</div>
              <div className="text-sm text-blue-800">{question.explanation}</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizQuestion;