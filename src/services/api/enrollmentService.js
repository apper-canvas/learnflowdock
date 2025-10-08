import enrollmentsData from "@/services/mockData/enrollments.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let enrollments = [...enrollmentsData];

const enrollmentService = {
  getAll: async () => {
    await delay(250);
    return [...enrollments];
  },

  getById: async (id) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.Id === parseInt(id));
    return enrollment ? { ...enrollment } : null;
  },

  getByCourseId: async (courseId) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.courseId === courseId.toString());
    return enrollment ? { ...enrollment } : null;
  },

  create: async (enrollment) => {
    await delay(300);
    const maxId = enrollments.length > 0 ? Math.max(...enrollments.map((e) => e.Id)) : 0;
    const newEnrollment = {
      Id: maxId + 1,
      courseId: enrollment.courseId.toString(),
      enrolledDate: new Date().toISOString().split("T")[0],
      progress: 0,
      completedLessons: [],
      quizScores: {},
      lastAccessedLesson: enrollment.firstLessonId || ""
    };
    enrollments.push(newEnrollment);
    return { ...newEnrollment };
  },

  update: async (id, data) => {
    await delay(250);
    const index = enrollments.findIndex((e) => e.Id === parseInt(id));
    if (index === -1) return null;

    enrollments[index] = { ...enrollments[index], ...data };
    return { ...enrollments[index] };
  },

  updateProgress: async (courseId, lessonId, totalLessons) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.courseId === courseId.toString());
    if (!enrollment) return null;

    if (!enrollment.completedLessons.includes(lessonId.toString())) {
      enrollment.completedLessons.push(lessonId.toString());
    }
    enrollment.lastAccessedLesson = lessonId.toString();
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

    return { ...enrollment };
  },

  updateQuizScore: async (courseId, lessonId, score) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.courseId === courseId.toString());
    if (!enrollment) return null;

    enrollment.quizScores[lessonId] = score;
    return { ...enrollment };
  },

  delete: async (id) => {
    await delay(250);
    const index = enrollments.findIndex((e) => e.Id === parseInt(id));
    if (index === -1) return false;

    enrollments.splice(index, 1);
    return true;
  }
};

export default enrollmentService;