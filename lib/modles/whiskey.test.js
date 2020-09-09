const fs = require('fs');
const Whiskey = require('./whiskey.js');

const pool = require('../utils/pool');

describe('Whiskey type', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  it('insert a new whiskey into the database', 
    async() => {
      const createdWhiskey = await Whiskey.insert({
        brand: 'Lagavulin',
        type: '16 Year Scotch',
        price: 85
      });
  
      const { rows } = await pool.query(
        'SELECT * FROM whiskeys WHERE id =$1',
        [createdWhiskey.id]
          
      );
  
      expect(rows[0]).toEqual(createdWhiskey);
    });

  it('finds a whiskey by id', async() => {
    const whiskeyQuery  = await Whiskey.insert({
      brand: 'Lagavulin',
      type: '16 Year Scotch',
      price: 85
    });
        
    const foundWhiskey = await Whiskey.findById(whiskeyQuery.id);
        
    expect(foundWhiskey).toEqual({
      id: whiskeyQuery.id,
      brand: 'Lagavulin',
      type: '16 Year Scotch',
      price: 85
    });
  });

  it('returns null if it cant find a whiskey by id', async() => {
    const whiskey = await Whiskey.findById(32135);

    expect(whiskey).toEqual(null);
  });

  it('finds all whiskeys', async() => {
    await Promise.all([
      Whiskey.insert({
        brand: 'Lagavulin',
        type: '16 Year Scotch',
        price: 85
      }),
      Whiskey.insert({
        brand: 'Angels Envy',
        type: 'Bourbon',
        price: 50
      }),
      Whiskey.insert({
        brand: 'Jameson',
        type: 'Irish',
        price: 24
      })
    ]);

    const whiskeys = await Whiskey.find();

    expect(whiskeys).toEqual(expect.arrayContaining([
      { id: expect.any(String), brand: 'Lagavulin', type: '16 Year Scotch', price: 85 },
      { id: expect.any(String), brand: 'Angels Envy', type: 'Bourbon', price: 50 },
      { id: expect.any(String), brand: 'Jameson', type: 'Irish', price: 24 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdWhiskey = await Whiskey.insert({
      brand: 'Lagavulin',
      type: '16 Year Scotch',
      price: 85
    });

    const updatedWhiskey = await Whiskey.update(createdWhiskey.id, {
      brand: 'Jameson',
      type: 'Irish',
      price: 24
    });

    expect(updatedWhiskey).toEqual({
      id: createdWhiskey.id,
      brand: 'Jameson',
      type: 'Irish',
      price: 24
    });
  });
  
  it('deletes a row by id', async() => {
    const createdWhiskey = await Whiskey.insert({
      brand: 'Lagavulin',
      type: '16 Year Scotch',
      price: 85
    });

    const deletedWhiskey = await Whiskey.delete(createdWhiskey.id);

    expect(deletedWhiskey).toEqual({
      id: createdWhiskey.id,
      brand: 'Lagavulin',
      type: '16 Year Scotch',
      price: 85
    });
  });
});
  
