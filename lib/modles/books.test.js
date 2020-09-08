const fs = require('fs');
const Book = require('./books.js');
const pool = require('../utils/pool');

describe('Book model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new book into the database', 
    async() => {
      const createdBook = await Book.insert({
        title: 'Broken Monsters',
        author: 'Lauren Beukes',
        pages: 436
      });

      const { rows } = await pool.query(
        'SELECT * FROM books WHERE id =$1',
        [createdBook.id]
      );

      expect(rows[0]).toEqual(createdBook);
    });
});
