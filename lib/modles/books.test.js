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

  it('returns null if it cant find a book by id', async() => {
    const book = await Book.findById(32135);

    expect(book).toEqual(null);
  });

  it('finds all books', async() => {
    await Promise.all([
      Book.insert({
        title: 'Broken Monsters',
        author: 'Lauren Beukes',
        pages: 436
      }),
      Book.insert({
        title: 'JavaScript & JQUERY',
        author: 'John Duckett',
        pages: 621
      }),
      Book.insert({
        title: 'HTML & CSS',
        author: 'John Duckett',
        pages: 490
      })
    ]);

    const books = await Book.find();

    expect(books).toEqual(expect.arrayContaining([
      { id: expect.any(String), title: 'Broken Monsters', author: 'Lauren Beukes', pages: 436 },
      { id: expect.any(String), title: 'JavaScript & JQUERY', author: 'John Duckett', pages: 621 },
      { id: expect.any(String), title: 'HTML & CSS', author: 'John Duckett', pages: 490 }
    ]));
  });

});
