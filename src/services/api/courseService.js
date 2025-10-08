const courseService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('course_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "enrolled_count_c"}},
          {"field": {"Name": "modules_c"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return [];
      }

      return response.data.map(course => ({
        Id: course.Id,
        title: course.title_c,
        description: course.description_c,
        instructor: course.instructor_c,
        thumbnail: course.thumbnail_c,
        category: course.category_c,
        difficulty: course.difficulty_c,
        duration: course.duration_c,
        enrolledCount: course.enrolled_count_c,
        modules: course.modules_c ? JSON.parse(course.modules_c) : []
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.getRecordById('course_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "enrolled_count_c"}},
          {"field": {"Name": "modules_c"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        title: course.title_c,
        description: course.description_c,
        instructor: course.instructor_c,
        thumbnail: course.thumbnail_c,
        category: course.category_c,
        difficulty: course.difficulty_c,
        duration: course.duration_c,
        enrolledCount: course.enrolled_count_c,
        modules: course.modules_c ? JSON.parse(course.modules_c) : []
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.message || error);
      return null;
    }
  },

  getByCategory: async (category) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "enrolled_count_c"}},
          {"field": {"Name": "modules_c"}}
        ]
      };

      if (category && category !== "All") {
        params.where = [
          {"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}
        ];
      }

      const response = await apperClient.fetchRecords('course_c', params);

      if (!response.success || !response.data) {
        console.error(response.message);
        return [];
      }

      return response.data.map(course => ({
        Id: course.Id,
        title: course.title_c,
        description: course.description_c,
        instructor: course.instructor_c,
        thumbnail: course.thumbnail_c,
        category: course.category_c,
        difficulty: course.difficulty_c,
        duration: course.duration_c,
        enrolledCount: course.enrolled_count_c,
        modules: course.modules_c ? JSON.parse(course.modules_c) : []
      }));
    } catch (error) {
      console.error("Error fetching courses by category:", error?.message || error);
      return [];
    }
  },

  searchCourses: async (query) => {
    try {
      if (!query) return await courseService.getAll();

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('course_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "enrolled_count_c"}},
          {"field": {"Name": "modules_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "instructor_c", "operator": "Contains", "values": [query]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "category_c", "operator": "Contains", "values": [query]}
              ],
              operator: ""
            }
          ]
        }]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return [];
      }

      return response.data.map(course => ({
        Id: course.Id,
        title: course.title_c,
        description: course.description_c,
        instructor: course.instructor_c,
        thumbnail: course.thumbnail_c,
        category: course.category_c,
        difficulty: course.difficulty_c,
        duration: course.duration_c,
        enrolledCount: course.enrolled_count_c,
        modules: course.modules_c ? JSON.parse(course.modules_c) : []
      }));
    } catch (error) {
      console.error("Error searching courses:", error?.message || error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('course_c', {
        fields: [{"field": {"Name": "category_c"}}]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return ["All"];
      }

      const categories = [...new Set(response.data.map(c => c.category_c).filter(Boolean))];
      return ["All", ...categories.sort()];
    } catch (error) {
      console.error("Error fetching categories:", error?.message || error);
      return ["All"];
    }
  },

  getLessonById: async (courseId, lessonId) => {
    try {
      const course = await courseService.getById(courseId);
      if (!course) return null;

      for (const module of course.modules) {
        const lesson = module.lessons.find((l) => l.Id === parseInt(lessonId));
        if (lesson) {
          return { ...lesson, moduleTitle: module.title };
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching lesson:", error?.message || error);
return null;
    }
  },

create: async (courseData) => {
    // Generate course content using OpenAI via Edge function
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const aiResult = await apperClient.functions.invoke(
        import.meta.env.VITE_GENERATE_COURSE_CONTENT,
        {
          body: JSON.stringify({
            title: courseData.title,
            description: courseData.description
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if AI generation was successful
      if (aiResult.success && aiResult.thumbnail && aiResult.modules) {
        courseData.thumbnail = aiResult.thumbnail;
        courseData.modules = aiResult.modules;
      } else {
        console.info(`apper_info: AI content generation returned an error. The response is: ${JSON.stringify(aiResult)}`);
      }
    } catch (error) {
      console.info(`apper_info: Got this error in AI content generation: ${error.message}`);
      // Continue with course creation even if AI generation fails
    }
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
title_c: courseData.title,
            description_c: courseData.description,
            instructor_c: courseData.instructor,
            thumbnail_c: courseData.thumbnail || '',
            category_c: courseData.category,
            difficulty_c: courseData.difficulty,
            duration_c: parseInt(courseData.duration),
            enrolled_count_c: parseInt(courseData.enrolledCount || 0),
            modules_c: Array.isArray(courseData.modules) 
              ? JSON.stringify(courseData.modules) 
              : courseData.modules || '[]'
          }
        ]
      };

      const response = await apperClient.createRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Failed to create course:", result);
          return null;
        }

        const course = result.data;
        return {
          Id: course.Id,
          title: course.title_c,
          description: course.description_c,
          instructor: course.instructor_c,
          thumbnail: course.thumbnail_c,
          category: course.category_c,
          difficulty: course.difficulty_c,
          duration: course.duration_c,
          enrolledCount: course.enrolled_count_c,
          modules: course.modules_c ? JSON.parse(course.modules_c) : []
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating course:", error?.message || error);
      return null;
    }
  }
};

export default courseService;