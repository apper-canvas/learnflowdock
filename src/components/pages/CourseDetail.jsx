import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "@/services/api/courseService";
import enrollmentService from "@/services/api/enrollmentService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [courseData, enrollmentData] = await Promise.all([
        courseService.getById(courseId),
        enrollmentService.getByCourseId(courseId)
      ]);
      setCourse(courseData);
      setEnrollment(enrollmentData);
    } catch (err) {
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const firstLesson = course.modules[0]?.lessons[0];
      const newEnrollment = await enrollmentService.create({
        courseId: course.Id,
        firstLessonId: firstLesson?.Id.toString()
      });
      setEnrollment(newEnrollment);
      toast.success("Successfully enrolled in course!");
      if (firstLesson) {
        navigate(`/courses/${course.Id}/lessons/${firstLesson.Id}`);
      }
    } catch (err) {
      toast.error("Failed to enroll in course");
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      navigate(`/courses/${course.Id}/lessons/${firstLesson.Id}`);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;

  if (loading) return <Loading text="Loading course details..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!course) return <Error message="Course not found" />;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] rounded-2xl overflow-hidden"
      >
        <img 
src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={course.difficulty.toLowerCase()}>
                {course.difficulty}
              </Badge>
              <Badge variant="default">{course.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-3xl">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <ApperIcon name="User" size={20} />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={20} />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Users" size={20} />
                <span>{course.enrolledCount.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="BookOpen" size={20} />
                <span>{totalLessons} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Master the fundamentals and advanced concepts",
                "Build real-world projects from scratch",
                "Learn industry best practices",
                "Get hands-on practical experience",
                "Understand core principles deeply",
                "Prepare for career opportunities"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ApperIcon name="Check" size={16} className="text-secondary" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <div key={module.Id} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-primary">
                          Module {index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      {module.lessons.length} lessons
                    </div>
                  </div>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.Id} className="flex items-center gap-3 text-sm text-gray-600">
                        <ApperIcon 
                          name={lesson.type === "quiz" ? "FileQuestion" : "PlayCircle"} 
                          size={16}
                          className="flex-shrink-0"
                        />
                        <span className="flex-1">{lesson.title}</span>
                        <span>{Math.floor(lesson.duration / 60)} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="User" size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.instructor}</h3>
                <p className="text-gray-600">
                  Expert instructor with years of experience in the field. Passionate about teaching
                  and helping students achieve their learning goals through practical, hands-on education.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-700 bg-clip-text text-transparent mb-2">
                  Free
                </div>
                <p className="text-sm text-gray-600">Full lifetime access</p>
              </div>

              {enrollment ? (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <div className="flex items-center gap-2 text-secondary font-semibold mb-2">
                      <ApperIcon name="CheckCircle2" size={20} />
                      <span>You're enrolled!</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Continue your learning journey
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleStartCourse}
                  >
                    <ApperIcon name="PlayCircle" size={20} className="mr-2" />
                    {enrollment.progress > 0 ? "Continue Learning" : "Start Course"}
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  <ApperIcon name="BookOpen" size={20} className="mr-2" />
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}

              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-900">This course includes:</h3>
                <div className="space-y-3">
                  {[
                    { icon: "Video", text: "Video lectures" },
                    { icon: "FileText", text: "Course materials" },
                    { icon: "Award", text: "Certificate of completion" },
                    { icon: "Clock", text: "Learn at your own pace" },
                    { icon: "Smartphone", text: "Mobile access" },
                    { icon: "Infinity", text: "Lifetime access" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <ApperIcon name={item.icon} size={18} className="text-primary" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetail;