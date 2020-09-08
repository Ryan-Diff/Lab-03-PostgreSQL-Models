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

  it('finds a book by id', async() => {
    const bookQuery  = await Book.insert({
      title: 'Broken Monsters',
      author: 'Lauren Beukes',
      pages: 436 
    });

    const foundBook = await Book.findById(bookQuery.id);

    expect(foundBook).toEqual({
      id: bookQuery.id,
      title: 'Broken Monsters',
      author: 'Lauren Beukes',
      pages: 436
    });
  });

});
