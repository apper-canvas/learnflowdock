import { useState } from "react";
import LessonItem from "@/components/molecules/LessonItem";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CourseCurriculum = ({ modules, completedLessons, currentLessonId, onLessonClick }) => {
  const [expandedModules, setExpandedModules] = useState([modules[0]?.Id]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonLocked = (moduleIndex, lessonIndex) => {
    if (moduleIndex === 0 && lessonIndex === 0) return false;
    
    for (let i = 0; i < moduleIndex; i++) {
      const moduleCompletedCount = modules[i].lessons.filter(
        lesson => completedLessons.includes(lesson.Id.toString())
      ).length;
      if (moduleCompletedCount < modules[i].lessons.length) return true;
    }

    if (lessonIndex > 0) {
      const prevLesson = modules[moduleIndex].lessons[lessonIndex - 1];
      return !completedLessons.includes(prevLesson.Id.toString());
    }

    return false;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
      
      <div className="space-y-3">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.includes(module.Id);
          const completedCount = module.lessons.filter(
            lesson => completedLessons.includes(lesson.Id.toString())
          ).length;

          return (
            <div key={module.Id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleModule(module.Id)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ApperIcon 
                    name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                    size={20}
                    className="text-gray-600"
                  />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <div className="text-sm text-gray-600 mt-0.5">
                      {completedCount} / {module.lessons.length} lessons completed
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-primary">
                  {Math.round((completedCount / module.lessons.length) * 100)}%
                </div>
              </button>

              {isExpanded && (
                <div className="p-2 space-y-1">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <LessonItem
                      key={lesson.Id}
                      lesson={lesson}
                      isCompleted={completedLessons.includes(lesson.Id.toString())}
                      isActive={currentLessonId === lesson.Id.toString()}
                      isLocked={isLessonLocked(moduleIndex, lessonIndex)}
                      onClick={() => {
                        if (!isLessonLocked(moduleIndex, lessonIndex)) {
                          onLessonClick(lesson.Id);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseCurriculum;