const pool = require('../utils/pool');

class Car {
    id;
    brand;
    model;
    year;

    constructor(row) {
      this.id = row.id;
      this.brand = row.brand;
      this.model = row.model;
      this.year = row.year;
    }

    static async insert(car) {
      const { rows } = await pool.query(
        'INSERT INTO cars (brand, model, year) VALUES ($1, $2, $3) RETURNING *',
        [car.brand, car.model, car.year]
      );

      return new Car(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM cars WHERE id = $1',
        [id]
      );
        
      if(!rows[0]) return null;
      else return new Car(rows[0]);
    }

    static async find() {
      const  { rows } = await pool.query(
        'SELECT * FROM cars'
      );
  
      return rows.map(row => new Car(row));
    }

    static async update(id, updateCar) {
      const { rows } = await pool.query(
        `UPDATE cars
          SET brand=$1,
              model=$2,
              year=$3
          WHERE id = $4
          RETURNING *
          `,
        [updateCar.brand, updateCar.model, updateCar.year, id]
      );
  
      return new Car(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM cars WHERE id = $1 RETURNING *',
        [id]
      );
      return new Car(rows[0]);
    }
}

module.exports = Car;
