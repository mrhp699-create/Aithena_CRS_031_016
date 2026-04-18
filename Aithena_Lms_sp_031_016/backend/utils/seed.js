const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aithena-lms');

    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data...');

    // Create default admin user
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@aithena.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });
    await admin.save();
    console.log('Created admin user: admin@aithena.com (password: admin123)');

    // Create sample teachers
    const teachers = [
      {
        name: 'Dr. Waseem',
        email: 'waseem@aithena.com',
        password: 'waseem123',
        subject: 'Advanced Web Development'
      },
      {
        name: 'Najeebullah',
        email: 'najeebullah@aithena.com',
        password: 'najeeb123',
        subject: 'Visual Programming'
      },
      {
        name: 'Rizwan',
        email: 'rizwan@aithena.com',
        password: 'rizwan123',
        subject: 'Programming and Data Structures (PDC)'
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@aithena.com',
        password: 'teacher123',
        subject: 'Web Technologies'
      }
    ];

    const teacherUsers = [];
    for (const teacherData of teachers) {
      const teacher = new User({
        name: teacherData.name,
        email: teacherData.email,
        password: teacherData.password,
        role: 'teacher',
        status: 'active'
      });
      await teacher.save();
      teacherUsers.push({ ...teacher.toObject(), subject: teacherData.subject });
    }
    console.log('Created 4 teacher users');

    // Create sample students
    const students = [
      { name: 'Moaz', email: 'moaz@aithena.com', password: 'moaz123' },
      { name: 'Areeba', email: 'areeba@aithena.com', password: 'areeba123' },
      { name: 'Ali', email: 'ali@aithena.com', password: 'ali123' },
      { name: 'Ruman', email: 'ruman@aithena.com', password: 'ruman123' },
      { name: 'Taha', email: 'taha@aithena.com', password: 'taha123' }
    ];

    const studentUsers = [];
    for (const studentData of students) {
      const student = new User({
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
        role: 'student',
        status: 'active'
      });
      await student.save();
      studentUsers.push(student);
    }
    console.log('Created 5 student users');

    // Create sample courses based on teacher subjects
    const courses = [
      // Dr. Waseem - Advanced Web Development
      {
        title: 'Advanced Web Development',
        description: 'Master advanced web technologies including Node.js, Express, React, and modern web architectures.',
        teacher: teacherUsers[0]._id,
        category: 'programming',
        level: 'advanced',
        duration: 60,
        price: 199,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[0]._id, enrolledAt: new Date(), progress: 75 },
          { student: studentUsers[1]._id, enrolledAt: new Date(), progress: 60 },
          { student: studentUsers[2]._id, enrolledAt: new Date(), progress: 45 }
        ]
      },
      {
        title: 'Full Stack Web Development',
        description: 'Complete guide to building full-stack web applications with MERN stack.',
        teacher: teacherUsers[0]._id,
        category: 'programming',
        level: 'intermediate',
        duration: 80,
        price: 299,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[1]._id, enrolledAt: new Date(), progress: 30 },
          { student: studentUsers[3]._id, enrolledAt: new Date(), progress: 20 }
        ]
      },

      // Najeebullah - Visual Programming
      {
        title: 'Visual Programming Fundamentals',
        description: 'Learn visual programming concepts, drag-and-drop interfaces, and block-based coding.',
        teacher: teacherUsers[1]._id,
        category: 'programming',
        level: 'beginner',
        duration: 45,
        price: 149,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[0]._id, enrolledAt: new Date(), progress: 90 },
          { student: studentUsers[2]._id, enrolledAt: new Date(), progress: 70 },
          { student: studentUsers[4]._id, enrolledAt: new Date(), progress: 50 }
        ]
      },
      {
        title: 'Advanced Visual Programming',
        description: 'Explore advanced visual programming techniques, custom blocks, and complex logic flows.',
        teacher: teacherUsers[1]._id,
        category: 'programming',
        level: 'intermediate',
        duration: 55,
        price: 179,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[1]._id, enrolledAt: new Date(), progress: 40 },
          { student: studentUsers[3]._id, enrolledAt: new Date(), progress: 25 }
        ]
      },

      // Rizwan - Programming and Data Structures (PDC)
      {
        title: 'Programming and Data Structures',
        description: 'Comprehensive course covering fundamental programming concepts and data structures.',
        teacher: teacherUsers[2]._id,
        category: 'programming',
        level: 'intermediate',
        duration: 70,
        price: 249,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[0]._id, enrolledAt: new Date(), progress: 85 },
          { student: studentUsers[1]._id, enrolledAt: new Date(), progress: 65 },
          { student: studentUsers[2]._id, enrolledAt: new Date(), progress: 55 }
        ]
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Deep dive into advanced data structures and algorithmic problem solving.',
        teacher: teacherUsers[2]._id,
        category: 'programming',
        level: 'advanced',
        duration: 90,
        price: 349,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[3]._id, enrolledAt: new Date(), progress: 35 },
          { student: studentUsers[4]._id, enrolledAt: new Date(), progress: 15 }
        ]
      },

      // Dr. Sarah Johnson - Web Technologies
      {
        title: 'Modern Web Technologies',
        description: 'Learn cutting-edge web technologies including PWAs, WebAssembly, and modern frameworks.',
        teacher: teacherUsers[3]._id,
        category: 'programming',
        level: 'advanced',
        duration: 65,
        price: 229,
        status: 'published',
        enrolledStudents: [
          { student: studentUsers[1]._id, enrolledAt: new Date(), progress: 50 },
          { student: studentUsers[3]._id, enrolledAt: new Date(), progress: 70 }
        ]
      },
      {
        title: 'Web Security Fundamentals',
        description: 'Essential web security concepts, best practices, and common vulnerabilities.',
        teacher: teacherUsers[3]._id,
        category: 'programming',
        level: 'intermediate',
        duration: 50,
        price: 189,
        status: 'draft'
      }
    ];

    const createdCourses = [];
    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();

      // Update teacher's createdCourses
      await User.findByIdAndUpdate(course.teacher, {
        $push: { createdCourses: course._id }
      });

      // Update students' enrolledCourses
      for (const enrollment of course.enrolledStudents) {
        await User.findByIdAndUpdate(enrollment.student, {
          $push: { enrolledCourses: course._id }
        });
      }

      createdCourses.push(course);
    }
    console.log('Created 4 sample courses');

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('\n🎓 AITHENA LMS - LOGIN CREDENTIALS:');
    console.log('\n👨‍💼 ADMIN:');
    console.log('   Email: admin@aithena.com');
    console.log('   Password: admin123');

    console.log('\n👨‍🏫 TEACHERS:');
    const teacherCredentials = [
      { name: 'Dr. Waseem', email: 'waseem@aithena.com', password: 'waseem123', subject: 'Advanced Web Development' },
      { name: 'Najeebullah', email: 'najeebullah@aithena.com', password: 'najeeb123', subject: 'Visual Programming' },
      { name: 'Rizwan', email: 'rizwan@aithena.com', password: 'rizwan123', subject: 'Programming and Data Structures (PDC)' },
      { name: 'Dr. Sarah Johnson', email: 'sarah.johnson@aithena.com', password: 'teacher123', subject: 'Web Technologies' }
    ];
    teacherCredentials.forEach(teacher => {
      console.log(`   ${teacher.name} (${teacher.subject}):`);
      console.log(`     Email: ${teacher.email}`);
      console.log(`     Password: ${teacher.password}`);
    });

    console.log('\n👨‍🎓 STUDENTS:');
    const studentNames = ['Moaz', 'Areeba', 'Ali', 'Ruman', 'Taha'];
    studentNames.forEach((name, index) => {
      console.log(`   ${name}:`);
      console.log(`     Email: ${name.toLowerCase()}@aithena.com`);
      console.log(`     Password: ${name.toLowerCase()}123`);
    });

    console.log('\n📚 COURSES CREATED:');
    createdCourses.forEach(course => {
      const teacherName = teacherUsers.find(t => t._id.toString() === course.teacher.toString())?.name;
      console.log(`   - ${course.title}`);
      console.log(`     Teacher: ${teacherName}`);
      console.log(`     Students: ${course.enrolledStudents.length}`);
      console.log(`     Status: ${course.status}`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
