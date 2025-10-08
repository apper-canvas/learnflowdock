import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LessonItem = ({ lesson, isCompleted, isActive, isLocked, onClick }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
        "flex items-center gap-3 group",
        isActive && "bg-primary/10 border-2 border-primary",
        !isActive && !isLocked && "hover:bg-gray-50",
        isLocked && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center checkmark-animate">
            <ApperIcon name="Check" size={16} className="text-white" />
          </div>
        ) : isLocked ? (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <ApperIcon name="Lock" size={14} className="text-gray-500" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-primary transition-colors" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <ApperIcon 
            name={lesson.type === "quiz" ? "FileQuestion" : "PlayCircle"} 
            size={14} 
            className={cn(
              "flex-shrink-0",
              isActive ? "text-primary" : "text-gray-400"
            )}
          />
          <h4 className={cn(
            "font-medium text-sm truncate",
            isActive ? "text-primary" : "text-gray-900"
          )}>
{lesson.title}
          </h4>
        </div>
        <div className="text-xs text-gray-500">
          {formatDuration(lesson.duration)}
        </div>
      </div>

      {isActive && (
        <ApperIcon name="ChevronRight" size={16} className="text-primary flex-shrink-0" />
      )}
    </button>
  );
};

export default LessonItem;