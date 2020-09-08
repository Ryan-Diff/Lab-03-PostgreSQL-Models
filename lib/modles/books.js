const pool = require('../utils/pool');

class Book {
    id;
    title;
    author;
    pages;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.author = row.author;
      this.pages = row.pages;
    }

    static async insert(book) {
      const { rows } = await pool.query(
        'INSERT INTO books (title, author, pages) VALUES ($1, $2, $3) RETURNING *',
        [book.title, book.author, book.pages]
      );

      return new Book(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM books WHERE id = $1',
        [id]
      );
      
      if(!rows[0]) return null;
      else return new Book(rows[0]);
    }

    static async find() {
      const  { rows } = await pool.query(
        'SELECT * FROM books'
      );

      return rows.map(row => new Book(row));
    }

    static async update(id, updateBook) {
      const { rows } = await pool.query(
        `UPDATE books
        SET title=$1,
            author=$2,
            pages=$3
        WHERE id = $4
        RETURNING *
        `,
        [updateBook.title, updateBook.author, updateBook.pages, id]
      );

      return new Book(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM books WHERE id = $1 RETURNING *',
        [id]
      );
      return new Book(rows[0]);
    }
}

module.exports = Book;
