const enrollmentService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('enrollment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "enrolled_date_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "completed_lessons_c"}},
          {"field": {"Name": "quiz_scores_c"}},
          {"field": {"Name": "last_accessed_lesson_c"}},
          {"field": {"Name": "lesson_notes_c"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return [];
      }

      return response.data.map(enrollment => ({
        Id: enrollment.Id,
        courseId: enrollment.course_id_c,
        enrolledDate: enrollment.enrolled_date_c,
        progress: enrollment.progress_c || 0,
        completedLessons: enrollment.completed_lessons_c ? JSON.parse(enrollment.completed_lessons_c) : [],
        quizScores: enrollment.quiz_scores_c ? JSON.parse(enrollment.quiz_scores_c) : {},
        lastAccessedLesson: enrollment.last_accessed_lesson_c || "",
        lessonNotes: enrollment.lesson_notes_c ? JSON.parse(enrollment.lesson_notes_c) : {}
      }));
    } catch (error) {
      console.error("Error fetching enrollments:", error?.message || error);
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

      const response = await apperClient.getRecordById('enrollment_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "enrolled_date_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "completed_lessons_c"}},
          {"field": {"Name": "quiz_scores_c"}},
          {"field": {"Name": "last_accessed_lesson_c"}},
          {"field": {"Name": "lesson_notes_c"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error(response.message);
        return null;
      }

      const enrollment = response.data;
      return {
        Id: enrollment.Id,
        courseId: enrollment.course_id_c,
        enrolledDate: enrollment.enrolled_date_c,
        progress: enrollment.progress_c || 0,
        completedLessons: enrollment.completed_lessons_c ? JSON.parse(enrollment.completed_lessons_c) : [],
        quizScores: enrollment.quiz_scores_c ? JSON.parse(enrollment.quiz_scores_c) : {},
        lastAccessedLesson: enrollment.last_accessed_lesson_c || "",
        lessonNotes: enrollment.lesson_notes_c ? JSON.parse(enrollment.lesson_notes_c) : {}
      };
    } catch (error) {
      console.error(`Error fetching enrollment ${id}:`, error?.message || error);
      return null;
    }
  },

  getByCourseId: async (courseId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('enrollment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "enrolled_date_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "completed_lessons_c"}},
          {"field": {"Name": "quiz_scores_c"}},
          {"field": {"Name": "last_accessed_lesson_c"}},
          {"field": {"Name": "lesson_notes_c"}}
        ],
        where: [
          {"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [courseId.toString()]}
        ]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const enrollment = response.data[0];
      return {
        Id: enrollment.Id,
        courseId: enrollment.course_id_c,
        enrolledDate: enrollment.enrolled_date_c,
        progress: enrollment.progress_c || 0,
        completedLessons: enrollment.completed_lessons_c ? JSON.parse(enrollment.completed_lessons_c) : [],
        quizScores: enrollment.quiz_scores_c ? JSON.parse(enrollment.quiz_scores_c) : {},
        lastAccessedLesson: enrollment.last_accessed_lesson_c || "",
        lessonNotes: enrollment.lesson_notes_c ? JSON.parse(enrollment.lesson_notes_c) : {}
      };
    } catch (error) {
      console.error(`Error fetching enrollment for course ${courseId}:`, error?.message || error);
      return null;
    }
  },

  create: async (enrollment) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.createRecord('enrollment_c', {
        records: [{
          course_id_c: enrollment.courseId.toString(),
          enrolled_date_c: new Date().toISOString().split("T")[0],
          progress_c: 0,
          completed_lessons_c: JSON.stringify([]),
          quiz_scores_c: JSON.stringify({}),
          last_accessed_lesson_c: enrollment.firstLessonId || "",
          lesson_notes_c: JSON.stringify({})
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            courseId: created.course_id_c,
            enrolledDate: created.enrolled_date_c,
            progress: created.progress_c || 0,
            completedLessons: created.completed_lessons_c ? JSON.parse(created.completed_lessons_c) : [],
            quizScores: created.quiz_scores_c ? JSON.parse(created.quiz_scores_c) : {},
            lastAccessedLesson: created.last_accessed_lesson_c || "",
            lessonNotes: created.lesson_notes_c ? JSON.parse(created.lesson_notes_c) : {}
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating enrollment:", error?.message || error);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = { Id: parseInt(id) };
      if (data.courseId !== undefined) updateData.course_id_c = data.courseId.toString();
      if (data.enrolledDate !== undefined) updateData.enrolled_date_c = data.enrolledDate;
      if (data.progress !== undefined) updateData.progress_c = data.progress;
      if (data.completedLessons !== undefined) updateData.completed_lessons_c = JSON.stringify(data.completedLessons);
      if (data.quizScores !== undefined) updateData.quiz_scores_c = JSON.stringify(data.quizScores);
      if (data.lastAccessedLesson !== undefined) updateData.last_accessed_lesson_c = data.lastAccessedLesson;
      if (data.lessonNotes !== undefined) updateData.lesson_notes_c = JSON.stringify(data.lessonNotes);

      const response = await apperClient.updateRecord('enrollment_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            courseId: updated.course_id_c,
            enrolledDate: updated.enrolled_date_c,
            progress: updated.progress_c || 0,
            completedLessons: updated.completed_lessons_c ? JSON.parse(updated.completed_lessons_c) : [],
            quizScores: updated.quiz_scores_c ? JSON.parse(updated.quiz_scores_c) : {},
            lastAccessedLesson: updated.last_accessed_lesson_c || "",
            lessonNotes: updated.lesson_notes_c ? JSON.parse(updated.lesson_notes_c) : {}
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating enrollment:", error?.message || error);
      return null;
    }
  },

  updateProgress: async (courseId, lessonId, totalLessons) => {
    try {
      const enrollment = await enrollmentService.getByCourseId(courseId);
      if (!enrollment) return null;

      const completedLessons = enrollment.completedLessons || [];
      if (!completedLessons.includes(lessonId.toString())) {
        completedLessons.push(lessonId.toString());
      }

      const progress = Math.round((completedLessons.length / totalLessons) * 100);

      return await enrollmentService.update(enrollment.Id, {
        completedLessons,
        lastAccessedLesson: lessonId.toString(),
        progress
      });
    } catch (error) {
      console.error("Error updating progress:", error?.message || error);
      return null;
    }
  },

  updateQuizScore: async (courseId, lessonId, score) => {
    try {
      const enrollment = await enrollmentService.getByCourseId(courseId);
      if (!enrollment) return null;

      const quizScores = enrollment.quizScores || {};
      quizScores[lessonId] = score;

      return await enrollmentService.update(enrollment.Id, {
        quizScores
      });
    } catch (error) {
      console.error("Error updating quiz score:", error?.message || error);
      return null;
    }
  },

  addNote: async (courseId, lessonId, noteText, timestamp) => {
    try {
      const enrollment = await enrollmentService.getByCourseId(courseId);
      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      const lessonNotes = enrollment.lessonNotes || {};
      if (!lessonNotes[lessonId]) {
        lessonNotes[lessonId] = [];
      }

      const lessonNotesList = lessonNotes[lessonId];
      const maxNoteId = lessonNotesList.length > 0 
        ? Math.max(...lessonNotesList.map((n) => n.Id)) 
        : 0;

      const newNote = {
        Id: maxNoteId + 1,
        text: noteText,
        timestamp: timestamp,
        createdAt: new Date().toISOString()
      };

      lessonNotes[lessonId].push(newNote);

      await enrollmentService.update(enrollment.Id, {
        lessonNotes
      });

      return newNote;
    } catch (error) {
      console.error("Error adding note:", error?.message || error);
      throw error;
    }
  },

  getNotes: async (courseId, lessonId) => {
    try {
      const enrollment = await enrollmentService.getByCourseId(courseId);
      if (!enrollment || !enrollment.lessonNotes || !enrollment.lessonNotes[lessonId]) {
        return [];
      }
      return enrollment.lessonNotes[lessonId];
    } catch (error) {
      console.error("Error getting notes:", error?.message || error);
      return [];
    }
  },

  deleteNote: async (courseId, lessonId, noteId) => {
    try {
      const enrollment = await enrollmentService.getByCourseId(courseId);
      if (!enrollment || !enrollment.lessonNotes || !enrollment.lessonNotes[lessonId]) {
        throw new Error("Notes not found");
      }

      const lessonNotes = enrollment.lessonNotes;
      const noteIndex = lessonNotes[lessonId].findIndex((n) => n.Id === noteId);
      if (noteIndex === -1) {
        throw new Error("Note not found");
      }

      lessonNotes[lessonId].splice(noteIndex, 1);

      await enrollmentService.update(enrollment.Id, {
        lessonNotes
      });

      return true;
    } catch (error) {
      console.error("Error deleting note:", error?.message || error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.deleteRecord('enrollment_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting enrollment:", error?.message || error);
      return false;
    }
  }
};

export default enrollmentService;