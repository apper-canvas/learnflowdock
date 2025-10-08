import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/atoms/ProgressBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const EnrolledCourseCard = ({ course, enrollment }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (enrollment.lastAccessedLesson) {
      navigate(`/courses/${course.Id}/lessons/${enrollment.lastAccessedLesson}`);
    } else {
      const firstLesson = course.modules[0]?.lessons[0];
      if (firstLesson) {
        navigate(`/courses/${course.Id}/lessons/${firstLesson.Id}`);
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-md"
    >
      <div className="flex gap-4">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {enrollment.progress === 100 && (
            <div className="absolute inset-0 bg-secondary/90 flex items-center justify-center">
              <ApperIcon name="CheckCircle2" size={40} className="text-white checkmark-animate" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <Badge variant={course.difficulty.toLowerCase()} className="text-xs">
              {course.difficulty}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            {course.instructor}
          </p>

          <ProgressBar value={enrollment.progress} className="mb-4" />

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {enrollment.completedLessons.length} of{" "}
              {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons completed
            </div>
            <Button size="sm" onClick={handleContinue}>
              <ApperIcon name="PlayCircle" size={16} className="mr-2" />
              {enrollment.progress === 0 ? "Start" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCard;