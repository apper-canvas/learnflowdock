import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const EnrollmentForm = ({ course, onEnroll, onClose, isEnrolling }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalLessons = course.modules?.reduce(
    (sum, module) => sum + (module.lessons?.length || 0),
    0
  ) || 0;

  const totalDuration = course.modules?.reduce(
    (sum, module) =>
      sum +
      (module.lessons?.reduce((lSum, lesson) => lSum + (lesson.duration || 0), 0) || 0),
    0
  ) || 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-primary to-secondary">
            <div className="absolute inset-0 bg-black/20" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Close"
            >
              <ApperIcon name="X" size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" size={32} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Enroll in Course
                </h2>
                <p className="text-gray-600">
                  Review course details and confirm your enrollment
                </p>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-700 mb-3">{course.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="purple">{course.category}</Badge>
                  <Badge variant="blue">{course.level}</Badge>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="User" size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Instructor</p>
                    <p className="text-sm font-medium text-gray-900">
                      {course.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="BookOpen" size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Lessons</p>
                    <p className="text-sm font-medium text-gray-900">
                      {totalLessons} lessons
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <ApperIcon name="Clock" size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDuration(totalDuration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Get */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ApperIcon name="CheckCircle2" size={20} className="text-secondary" />
                What you'll get:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <ApperIcon
                    name="Check"
                    size={16}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  <span>Full access to all course materials and lessons</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <ApperIcon
                    name="Check"
                    size={16}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  <span>Interactive quizzes and assessments</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <ApperIcon
                    name="Check"
                    size={16}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  <span>Certificate of completion upon finishing</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <ApperIcon
                    name="Check"
                    size={16}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  <span>Track your progress and take notes</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isEnrolling}
                className="w-full sm:w-auto sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={onEnroll}
                disabled={isEnrolling}
                className="w-full sm:w-auto sm:flex-1"
              >
                {isEnrolling ? (
                  <>
                    <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <ApperIcon name="BookOpen" size={20} className="mr-2" />
                    Confirm Enrollment
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnrollmentForm;