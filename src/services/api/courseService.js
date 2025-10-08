import coursesData from "@/services/mockData/courses.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const courseService = {
  getAll: async () => {
    await delay(300);
    return [...coursesData];
  },

  getById: async (id) => {
    await delay(200);
    const course = coursesData.find((c) => c.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  getByCategory: async (category) => {
    await delay(300);
    if (!category || category === "All") {
      return [...coursesData];
    }
    return coursesData.filter((c) => c.category === category);
  },

  searchCourses: async (query) => {
    await delay(250);
    if (!query) return [...coursesData];
    const lowerQuery = query.toLowerCase();
    return coursesData.filter(
      (c) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.instructor.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
    );
  },

  getCategories: async () => {
    await delay(150);
    const categories = [...new Set(coursesData.map((c) => c.category))];
    return ["All", ...categories.sort()];
  },

  getLessonById: async (courseId, lessonId) => {
    await delay(200);
    const course = coursesData.find((c) => c.Id === parseInt(courseId));
    if (!course) return null;

    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.Id === parseInt(lessonId));
      if (lesson) {
        return { ...lesson, moduleTitle: module.title };
      }
    }
    return null;
  }
};

export default courseService;