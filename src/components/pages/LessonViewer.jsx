import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "@/services/api/courseService";
import enrollmentService from "@/services/api/enrollmentService";
import quizService from "@/services/api/quizService";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CourseCurriculum from "@/components/organisms/CourseCurriculum";
import QuizQuestion from "@/components/molecules/QuizQuestion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [lessonNotes, setLessonNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [courseData, lessonData, enrollmentData] = await Promise.all([
        courseService.getById(courseId),
        courseService.getLessonById(courseId, lessonId),
        enrollmentService.getByCourseId(courseId)
      ]);

      setCourse(courseData);
      setLesson(lessonData);
      setEnrollment(enrollmentData);

      if (lessonData?.type === "quiz") {
        const quizData = await quizService.getByLessonId(lessonId);
        setQuiz(quizData);
        setSelectedAnswers(new Array(quizData?.questions.length || 0).fill(null));
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setQuizResults(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId, lessonId]);

useEffect(() => {
    if (videoRef.current && lesson?.type === "video") {
      const video = videoRef.current;
      
      const handleEnded = async () => {
        if (enrollment) {
          try {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            await enrollmentService.updateProgress(courseId, lessonId, totalLessons);
            toast.success("Lesson completed!");
          } catch (err) {
            console.error("Failed to update progress:", err);
          }
        }
      };

      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [lesson, enrollment, courseId, lessonId, course]);

  useEffect(() => {
    async function loadNotes() {
      if (enrollment && lessonId) {
        try {
          const notes = await enrollmentService.getNotes(courseId, lessonId);
          setLessonNotes(notes);
        } catch (err) {
          console.error("Failed to load notes:", err);
        }
      }
    }
    loadNotes();
  }, [enrollment, courseId, lessonId]);

  const formatTimestamp = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !videoRef.current) return;

    try {
      const currentTime = videoRef.current.currentTime;
      await enrollmentService.addNote(courseId, lessonId, newNoteText.trim(), currentTime);
      const updatedNotes = await enrollmentService.getNotes(courseId, lessonId);
      setLessonNotes(updatedNotes);
      setNewNoteText("");
      toast.success("Note added successfully!");
    } catch (err) {
      console.error("Failed to add note:", err);
      toast.error("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await enrollmentService.deleteNote(courseId, lessonId, noteId);
      const updatedNotes = await enrollmentService.getNotes(courseId, lessonId);
      setLessonNotes(updatedNotes);
      toast.success("Note deleted!");
    } catch (err) {
      console.error("Failed to delete note:", err);
      toast.error("Failed to delete note");
    }
  };

  const handleSeekToTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };
  const handleLessonClick = (newLessonId) => {
    navigate(`/courses/${courseId}/lessons/${newLessonId}`);
  };

  const getNextLesson = () => {
    if (!course) return null;
    
    let foundCurrent = false;
    for (const module of course.modules) {
      for (const lessonItem of module.lessons) {
        if (foundCurrent) return lessonItem;
        if (lessonItem.Id.toString() === lessonId) foundCurrent = true;
      }
    }
    return null;
  };

  const handleNext = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      navigate(`/courses/${courseId}/lessons/${nextLesson.Id}`);
    }
  };

  const handleSelectAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (selectedAnswers.some(answer => answer === null)) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    try {
      const results = await quizService.submitAnswers(quiz.Id, selectedAnswers);
      setQuizResults(results);
      setShowResults(true);
      
      if (enrollment) {
        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        await enrollmentService.updateProgress(courseId, lessonId, totalLessons);
        await enrollmentService.updateQuizScore(courseId, lessonId, results.score);
      }

      if (results.passed) {
        toast.success(`Great job! You scored ${results.score}%`);
      } else {
        toast.error(`You scored ${results.score}%. Try again to pass!`);
      }
    } catch (err) {
      toast.error("Failed to submit quiz");
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setQuizResults(null);
  };

  if (loading) return <Loading text="Loading lesson..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!course || !lesson) return <Error message="Lesson not found" />;

  const nextLesson = getNextLesson();
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const currentResult = quizResults?.results[currentQuestionIndex];
return (
    <div className="flex gap-6 -mx-4 sm:-mx-6 lg:-mx-8">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="hidden lg:block w-80 flex-shrink-0 px-4"
          >
            <CourseCurriculum
              modules={course.modules}
              completedLessons={enrollment?.completedLessons || []}
              currentLessonId={lessonId}
              onLessonClick={handleLessonClick}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
            Back to Course
          </Button>

          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-600 mb-1">{lesson.moduleTitle}</div>
              <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              <ApperIcon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={20} />
            </Button>
          </div>
          <p className="text-gray-600">{lesson.description}</p>
        </div>

        {lesson.type === "video" ? (
<div className="space-y-6">
            <div className="relative">
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full"
                  src={lesson.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <AnimatePresence>
                {notesOpen && (
                  <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute top-0 right-0 w-80 h-full bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-lg text-gray-900">Lesson Notes</h3>
                      <button
                        onClick={() => setNotesOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="X" size={20} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {lessonNotes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ApperIcon name="FileText" size={48} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notes yet</p>
                          <p className="text-xs mt-1">Add notes while watching</p>
                        </div>
                      ) : (
                        lessonNotes.map((note) => (
                          <div key={note.Id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <button
                                onClick={() => handleSeekToTimestamp(note.timestamp)}
                                className="text-primary font-semibold text-sm hover:underline"
                              >
                                {formatTimestamp(note.timestamp)}
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.Id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                              >
                                <ApperIcon name="Trash2" size={14} className="text-gray-500" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-4 border-t border-gray-200 space-y-2">
                      <Input
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Add a note at current time..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddNote();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddNote}
                        disabled={!newNoteText.trim()}
                        className="w-full"
                      >
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost">
                  <ApperIcon name="ThumbsUp" size={18} className="mr-2" />
                  Helpful
                </Button>
                <Button variant="ghost">
                  <ApperIcon name="Bookmark" size={18} className="mr-2" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setNotesOpen(!notesOpen)}
                >
                  <ApperIcon name="FileText" size={18} className="mr-2" />
                  Notes {lessonNotes.length > 0 && `(${lessonNotes.length})`}
                </Button>
              </div>
              {nextLesson && (
                <Button onClick={handleNext}>
                  Next Lesson
                  <ApperIcon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        ) : lesson.type === "quiz" && quiz ? (
          <div className="space-y-6">
            {!showResults ? (
              <>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm font-medium text-gray-600">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Pass with {quiz.passingScore}% or higher
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <QuizQuestion
                  question={currentQuestion}
                  selectedAnswer={selectedAnswers[currentQuestionIndex]}
                  onSelectAnswer={handleSelectAnswer}
                  questionNumber={currentQuestionIndex + 1}
                  showResult={false}
                />

                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ApperIcon name="ChevronLeft" size={18} className="mr-2" />
                    Previous
                  </Button>

                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={selectedAnswers[currentQuestionIndex] === null}
                    >
                      <ApperIcon name="CheckCircle2" size={18} className="mr-2" />
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[currentQuestionIndex] === null}
                    >
                      Next Question
                      <ApperIcon name="ChevronRight" size={18} className="ml-2" />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className={`rounded-xl p-8 text-center ${
                  quizResults.passed 
                    ? "bg-gradient-to-br from-green-50 to-secondary/10 border-2 border-green-200" 
                    : "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
                }`}>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center">
                    {quizResults.passed ? (
                      <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center animate-bounce">
                        <ApperIcon name="Trophy" size={40} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="X" size={40} className="text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {quizResults.passed ? "Congratulations!" : "Keep Trying!"}
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    You scored {quizResults.score}% ({quizResults.correctCount} out of {quizResults.totalQuestions} correct)
                  </p>
                  <p className="text-gray-600">
                    {quizResults.passed 
                      ? "Great job! You've passed the quiz and can move on to the next lesson."
                      : `You need ${quiz.passingScore}% to pass. Review the material and try again!`
                    }
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Review Your Answers</h3>
                  <div className="space-y-4">
                    {quiz.questions.map((question, index) => {
                      const result = quizResults.results[index];
                      return (
                        <div key={question.Id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start gap-3 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              result.isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}>
                              <ApperIcon 
                                name={result.isCorrect ? "Check" : "X"} 
                                size={14} 
                                className="text-white" 
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">
                                Question {index + 1}: {question.text}
                              </div>
                              <div className="text-sm text-gray-600">
                                Your answer: {question.options[selectedAnswers[index]]}
                              </div>
                              {!result.isCorrect && (
                                <div className="text-sm text-green-700 mt-1">
                                  Correct answer: {question.options[result.correctAnswer]}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={handleRetakeQuiz}>
                    <ApperIcon name="RefreshCw" size={18} className="mr-2" />
                    Retake Quiz
                  </Button>
                  {quizResults.passed && nextLesson && (
                    <Button onClick={handleNext}>
                      Next Lesson
                      <ApperIcon name="ArrowRight" size={18} className="ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LessonViewer;