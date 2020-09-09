const pool = require('../utils/pool');

class Whiskey {
    id;
    brand;
    type;
    price;

    constructor(row) {
      this.id = row.id;
      this.brand = row.brand;
      this.type = row.type;
      this.price = row.price;
    }

    static async insert(whiskey) {
      const { rows } = await pool.query(
        'INSERT INTO whiskeys (brand, type, price) VALUES ($1, $2, $3) RETURNING *',
        [whiskey.brand, whiskey.type, whiskey.price]
      );

      return new Whiskey(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM whiskeys WHERE id = $1',
        [id]
      );
          
      if(!rows[0]) return null;
      else return new Whiskey(rows[0]);
    }

    static async find() {
      const  { rows } = await pool.query(
        'SELECT * FROM whiskeys'
      );
    
      return rows.map(row => new Whiskey(row));
    }

    static async update(id, updateWhiskey) {
      const { rows } = await pool.query(
        `UPDATE whiskeys
            SET brand=$1,
                type=$2,
                price=$3
            WHERE id = $4
            RETURNING *
            `,
        [updateWhiskey.brand, updateWhiskey.type, updateWhiskey.price, id]
      );
    
      return new Whiskey(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM whiskeys WHERE id = $1 RETURNING *',
        [id]
      );
      return new Whiskey(rows[0]);
    }

}

module.exports = Whiskey;
