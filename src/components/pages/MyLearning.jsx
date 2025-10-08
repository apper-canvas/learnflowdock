import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import EnrolledCourseCard from "@/components/molecules/EnrolledCourseCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import enrollmentService from "@/services/api/enrollmentService";
import courseService from "@/services/api/courseService";

const MyLearning = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const enrollments = await enrollmentService.getAll();
      
      const coursesWithEnrollment = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await courseService.getById(enrollment.courseId);
          return { course, enrollment };
        })
      );

      setEnrolledCourses(coursesWithEnrollment);
    } catch (err) {
      setError(err.message || "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading text="Loading your courses..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const inProgressCourses = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress > 0 && enrollment.progress < 100
  );
  const completedCourses = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress === 100
  );
  const notStartedCourses = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress === 0
  );

  if (enrolledCourses.length === 0) {
    return (
      <Empty
        icon="BookOpen"
        title="No courses yet"
        message="Start your learning journey by exploring our course catalog"
        actionLabel="Browse Courses"
        onAction={() => navigate("/courses")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-700 bg-clip-text text-transparent mb-2">
              My Learning
            </h1>
            <p className="text-gray-600">
              Track your progress and continue your learning journey
            </p>
          </div>
          <Button onClick={() => navigate("/courses")}>
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Find Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-primary to-purple-700 rounded-xl p-6 text-white"
          >
            <ApperIcon name="BookOpen" size={32} className="mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{enrolledCourses.length}</div>
            <div className="text-sm opacity-90">Total Courses</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-secondary to-teal-600 rounded-xl p-6 text-white"
          >
            <ApperIcon name="TrendingUp" size={32} className="mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{inProgressCourses.length}</div>
            <div className="text-sm opacity-90">In Progress</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-accent to-orange-600 rounded-xl p-6 text-white"
          >
            <ApperIcon name="Trophy" size={32} className="mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{completedCourses.length}</div>
            <div className="text-sm opacity-90">Completed</div>
          </motion.div>
        </div>
      </motion.div>

      {inProgressCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="PlayCircle" size={24} className="text-primary" />
            Continue Learning
          </h2>
          <div className="space-y-4">
            {inProgressCourses.map(({ course, enrollment }) => (
              <EnrolledCourseCard
                key={enrollment.Id}
                course={course}
                enrollment={enrollment}
              />
            ))}
          </div>
        </motion.section>
      )}

      {notStartedCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Sparkles" size={24} className="text-accent" />
            Ready to Start
          </h2>
          <div className="space-y-4">
            {notStartedCourses.map(({ course, enrollment }) => (
              <EnrolledCourseCard
                key={enrollment.Id}
                course={course}
                enrollment={enrollment}
              />
            ))}
          </div>
        </motion.section>
      )}

      {completedCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="CheckCircle2" size={24} className="text-secondary" />
            Completed Courses
          </h2>
          <div className="space-y-4">
{completedCourses.map(({ course, enrollment }) => (
              <div key={enrollment.Id} className="space-y-3">
                <EnrolledCourseCard
                  course={course}
                  enrollment={enrollment}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => navigate(`/certificates/${course.Id}`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
                  >
                    <ApperIcon name="Award" size={18} />
                    <span>View Certificate</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default MyLearning;