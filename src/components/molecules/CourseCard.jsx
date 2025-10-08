import { useNavigate } from "react-router-dom";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/courses/${course.Id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
<Badge variant={course.difficulty.toLowerCase()}>
            {course.difficulty}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <div className="mb-2">
          <Badge variant="default" className="text-xs">
{course.category}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
{course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
{course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ApperIcon name="User" size={16} />
<span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" size={16} />
<span>{formatDuration(course.duration)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-secondary">
            <ApperIcon name="Users" size={16} />
<span className="text-sm font-medium">{course.enrolledCount.toLocaleString()} enrolled</span>
          </div>
          <ApperIcon 
            name="ArrowRight" 
            size={20} 
            className="text-primary group-hover:translate-x-1 transition-transform" 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;