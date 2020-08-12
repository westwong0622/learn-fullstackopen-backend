const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    date: new Date(),
  },
  {
    content: 'Browser can execute only Javascript',
    important: true,
    date: new Date(),
  },
];

beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

test('note without content is not added', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const response = await api.get('/api/notes');

  expect(response.body).toHaveLength(initialNotes.length);
});

// test('a valid note can be added', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//     date: new Date(),
//   };

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(200)
//     .expect('Content-Type', /application\/json/);

//   const response = await api.get('/api/notes');

//   const contents = response.body.map((r) => r.content);

//   expect(response.body).toHaveLength(initialNotes.length + 1);
//   expect(contents).toContain('async/await simplifies making async calls');
// });

// test('notes are returned as json', async () => {
//   await api
//     .get('/api/notes')
//     .expect(200)
//     .expect('Content-Type', /application\/json/);
// });

// test('there are two notes', async () => {
//   const response = await api.get('/api/notes');

//   expect(response.body).toHaveLength(initialNotes.length);
// });

// test('the first note is about HTTP methods', async () => {
//   const response = await api.get('/api/notes');

//   const contents = response.body.map((r) => r.content);
//   expect(contents).toContain('Browser can execute only Javascript');
// });

afterAll(() => {
  mongoose.connection.close();
});