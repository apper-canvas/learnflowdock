import { useState, useEffect } from "react";
import courseService from "@/services/api/courseService";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <Loading text="Loading courses..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-700 bg-clip-text text-transparent mb-4">
          Explore Our Courses
        </h1>
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
    </div>
  );
};

export default CourseCatalog;