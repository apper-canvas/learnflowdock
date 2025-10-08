import { useState, useEffect } from "react";
import courseService from "@/services/api/courseService";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    thumbnail: "",
    category: "",
    difficulty: "Beginner",
    duration: "",
    enrolledCount: "0",
    modules: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, categoriesData] = await Promise.all([
        courseService.getAll(),
        courseService.getCategories()
      ]);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }
    try {
      const results = await courseService.searchCourses(query);
      setFilteredCourses(results);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    try {
      const results = await courseService.getByCategory(category);
      setFilteredCourses(results);
    } catch (err) {
      console.error("Filter failed:", err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.instructor) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
try {
      toast.info('Generating course content with AI...');
      const newCourse = await courseService.create(formData);
      if (newCourse) {
        toast.success("Course created successfully!");
        setShowAddModal(false);
        setFormData({
          title: "",
          description: "",
          instructor: "",
          thumbnail: "",
          category: "",
          difficulty: "Beginner",
          duration: "",
          enrolledCount: "0",
          modules: ""
        });
        
        const allCourses = await courseService.getAll();
        setCourses(allCourses);
        setFilteredCourses(allCourses);
        
        const cats = await courseService.getCategories();
        setCategories(cats);
      } else {
        toast.error("Failed to create course. Please try again.");
      }
    } catch (err) {
      console.error("Error creating course:", err);
      toast.error("An error occurred while creating the course");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading courses..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-700 bg-clip-text text-transparent">
            Explore Our Courses
          </h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add Course
          </Button>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Master new skills with structured learning paths designed by industry experts
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for courses, instructors, or topics..."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <ApperIcon name="Filter" size={20} className="text-gray-600 flex-shrink-0" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <Empty
            icon="Search"
            title="No courses found"
            message="Try adjusting your search or filter to find what you're looking for"
            actionLabel="Clear Filters"
            onAction={() => {
              setSelectedCategory("All");
              setFilteredCourses(courses);
            }}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Enter instructor name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <Input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="Enter thumbnail image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Programming"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Enter duration"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrolled Count
                  </label>
                  <Input
                    type="number"
                    value={formData.enrolledCount}
                    onChange={(e) => setFormData({ ...formData, enrolledCount: e.target.value })}
                    placeholder="Enter enrolled count"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modules (JSON)
                </label>
                <textarea
                  value={formData.modules}
                  onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                  placeholder='[{"title":"Module 1","lessons":[{"Id":1,"title":"Lesson 1","type":"video","url":"..."}]}]'
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 placeholder:text-gray-400 font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin">
                        <ApperIcon name="Loader2" size={20} />
                      </div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={20} />
                      Create Course
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;