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

  it('returns null if it cant find a car by id', async() => {
    const car = await Car.findById(32135);

    expect(car).toEqual(null);
  });

  it('finds all cars', async() => {
    await Promise.all([
      Car.insert({
        brand: 'Toyota',
        model: '4-runner',
        year: 2006
      }),
      Car.insert({
        brand: 'Subaru',
        model: 'Forester',
        year: 2006
      }),
      Car.insert({
        brand: 'Honda',
        model: 'S2000',
        year: 2006
      })
    ]);

    const cars = await Car.find();

    expect(cars).toEqual(expect.arrayContaining([
      { id: expect.any(String), brand: 'Toyota', model: '4-runner', year: 2006 },
      { id: expect.any(String), brand: 'Subaru', model: 'Forester', year: 2006 },
      { id: expect.any(String), brand: 'Honda', model: 'S2000', year: 2006 }
    ]));
  });

  
});
