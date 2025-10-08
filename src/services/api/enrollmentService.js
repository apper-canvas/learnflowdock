import enrollmentsData from "@/services/mockData/enrollments.json";
import React from "react";
import Error from "@/components/ui/Error";

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
      lastAccessedLesson: enrollment.firstLessonId || "",
      lessonNotes: {}
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

  addNote: async (courseId, lessonId, noteText, timestamp) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.courseId === courseId.toString());
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (!enrollment.lessonNotes) {
      enrollment.lessonNotes = {};
    }

    if (!enrollment.lessonNotes[lessonId]) {
      enrollment.lessonNotes[lessonId] = [];
    }

    const lessonNotesList = enrollment.lessonNotes[lessonId];
    const maxNoteId = lessonNotesList.length > 0 
      ? Math.max(...lessonNotesList.map((n) => n.Id)) 
      : 0;

    const newNote = {
      Id: maxNoteId + 1,
      text: noteText,
      timestamp: timestamp,
      createdAt: new Date().toISOString()
    };

    enrollment.lessonNotes[lessonId].push(newNote);
    return { ...newNote };
  },

  getNotes: async (courseId, lessonId) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.courseId === courseId.toString());
    if (!enrollment || !enrollment.lessonNotes || !enrollment.lessonNotes[lessonId]) {
      return [];
    }
    return enrollment.lessonNotes[lessonId].map((note) => ({ ...note }));
  },

  deleteNote: async (courseId, lessonId, noteId) => {
    await delay(200);
    const enrollment = enrollments.find((e) => e.courseId === courseId.toString());
    if (!enrollment || !enrollment.lessonNotes || !enrollment.lessonNotes[lessonId]) {
      throw new Error("Notes not found");
    }

    const noteIndex = enrollment.lessonNotes[lessonId].findIndex((n) => n.Id === noteId);
    if (noteIndex === -1) {
      throw new Error("Note not found");
    }

enrollment.lessonNotes[lessonId].splice(noteIndex, 1);
    return true;
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