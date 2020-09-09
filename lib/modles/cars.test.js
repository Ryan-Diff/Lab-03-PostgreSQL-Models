const fs = require('fs');
const Car = require('./cars.js');

const pool = require('../utils/pool');

describe('Car model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new car into the database', 
    async() => {
      const createdCar = await Car.insert({
        brand: 'Toyota',
        model: '4-runner',
        year: 2006
      });

      const { rows } = await pool.query(
        'SELECT * FROM cars WHERE id =$1',
        [createdCar.id]
        
      );

      expect(rows[0]).toEqual(createdCar);
    });

  it('finds a car by id', async() => {
    const carQuery  = await Car.insert({
      brand: 'Toyota',
      model: '4-runner',
      year: 2006 
    });
    
    const foundCar = await Car.findById(carQuery.id);
    
    expect(foundCar).toEqual({
      id: carQuery.id,
      brand: 'Toyota',
      model: '4-runner',
      year: 2006
    });
  });

  
});
