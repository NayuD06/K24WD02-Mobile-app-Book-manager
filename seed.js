const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Book = require('./src/models/Book');
const Review = require('./src/models/Review');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Review.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    const users = await User.create([
      {
        name: 'Admin Root',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'User One',
        email: 'user1@example.com',
        password: 'User123!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'User Two',
        email: 'user2@example.com',
        password: 'User123!',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      },
    ]);

    const books = await Book.create([
      {
        owner: users[1]._id,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'Principles of writing clean and maintainable code.',
        genre: 'Programming',
        coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
        publishedDate: new Date('2008-08-01'),
      },
      {
        owner: users[1]._id,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'A fantasy adventure in Middle-earth.',
        genre: 'Fantasy',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
        publishedDate: new Date('1937-09-21'),
      },
      {
        owner: users[1]._id,
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'Small habits make a big difference.',
        genre: 'Self-help',
        coverImage: 'https://images.unsplash.com/photo-1455885666463-4f95b86cb8d1?auto=format&fit=crop&w=900&q=80',
        publishedDate: new Date('2018-10-16'),
      },
      {
        owner: users[2]._id,
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'Epic science fiction about politics, power and survival.',
        genre: 'Sci-Fi',
        coverImage: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=900&q=80',
        publishedDate: new Date('1965-08-01'),
      },
      {
        owner: users[2]._id,
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        description: 'A fable about following your dream and personal legend.',
        genre: 'Adventure',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
        publishedDate: new Date('1988-05-01'),
      },
      {
        owner: users[2]._id,
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        description: 'Financial education and mindset for long-term wealth.',
        genre: 'Finance',
        coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
        publishedDate: new Date('1997-04-01'),
      },
    ]);

    await Review.create([
      {
        book: books[0]._id,
        user: users[1]._id,
        rating: 5,
        comment: 'Tuyệt vời, rất thực tế cho dev.',
      },
      {
        book: books[1]._id,
        user: users[2]._id,
        rating: 4,
        comment: 'Câu chuyện rất hay và cuốn hút.',
      },
      {
        book: books[0]._id,
        user: users[2]._id,
        rating: 4,
        comment: 'Nhiều bài học hữu ích về code sạch.',
      },
      {
        book: books[3]._id,
        user: users[1]._id,
        rating: 5,
        comment: 'Không gian và thế giới quan rất ấn tượng.',
      },
      {
        book: books[4]._id,
        user: users[1]._id,
        rating: 4,
        comment: 'Một cuốn sách truyền cảm hứng nhẹ nhàng.',
      },
      {
        book: books[5]._id,
        user: users[2]._id,
        rating: 5,
        comment: 'Rất hợp để đọc lại nhiều lần.',
      },
    ]);

    console.log('Seed data created successfully');
    console.log('Admin account: admin@example.com / Admin123!');
    console.log('User account: user1@example.com / User123!');
    console.log('User account: user2@example.com / User123!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
