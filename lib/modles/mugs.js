const pool = require('../utils/pool');

class Mug {
    id;
    made_by;
    color;
    favorite_level;

    constructor(row) {
      this.id = row.id;
      this.made_by = row.made_by;
      this.color = row.color;
      this.favorite_level = row.favorite_level;
    }

    static async insert(mug) {
      const { rows } = await pool.query(
        'INSERT INTO mugs (made_by, color, favorite_level) VALUES ($1, $2, $3) RETURNING *',
        [mug.made_by, mug.color, mug.favorite_level]
      );

      return new Mug(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM mugs WHERE id = $1',
        [id]
      );
          
      if(!rows[0]) return null;
      else return new Mug(rows[0]);
    }

    static async find() {
      const  { rows } = await pool.query(
        'SELECT * FROM mugs'
      );
    
      return rows.map(row => new Mug(row));
    }

    static async update(id, updateMug) {
      const { rows } = await pool.query(
        `UPDATE mugs
            SET made_by=$1,
                color=$2,
                favorite_level=$3
            WHERE id = $4
            RETURNING *
            `,
        [updateMug.made_by, updateMug.color, updateMug.favorite_level, id]
      );
    
      return new Mug(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM mugs WHERE id = $1 RETURNING *',
        [id]
      );
      return new Mug(rows[0]);
    }

}

module.exports = Mug;
