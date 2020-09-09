const fs = require('fs');
const Mug = require('./mugs.js');

const pool = require('../utils/pool');

describe('Mug type', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  it('insert a new mug into the database', 
    async() => {
      const createdMug = await Mug.insert({
        made_by: 'Emily',
        color: 'Blue Gray',
        favorite_level: 9
      });
  
      const { rows } = await pool.query(
        'SELECT * FROM mugs WHERE id =$1',
        [createdMug.id]
          
      );
  
      expect(rows[0]).toEqual(createdMug);
    });

  it('finds a mug by id', async() => {
    const mugQuery  = await Mug.insert({
      made_by: 'Emily',
      color: 'Blue Gray',
      favorite_level: 9
    });
            
    const foundMug = await Mug.findById(mugQuery.id);
            
    expect(foundMug).toEqual({
      id: mugQuery.id,
      made_by: 'Emily',
      color: 'Blue Gray',
      favorite_level: 9
    });
  });

  it('returns null if it cant find a whiskey by id', async() => {
    const mug = await Mug.findById(32135);

    expect(mug).toEqual(null);
  });

  it('finds all mugs', async() => {
    await Promise.all([
      Mug.insert({
        made_by: 'Emily',
        color: 'Blue Gray',
        favorite_level: 9
      }),
      Mug.insert({
        made_by: 'Unknown',
        color: 'Brown',
        favorite_level: 2
      }),
      Mug.insert({
        made_by: 'Ryan',
        color: 'Powder Blue',
        favorite_level: 7
      })
    ]);

    const mugs = await Mug.find();

    expect(mugs).toEqual(expect.arrayContaining([
      { id: expect.any(String), made_by: 'Emily', color: 'Blue Gray', favorite_level: 9 },
      { id: expect.any(String), made_by: 'Unknown', color: 'Brown', favorite_level: 2 },
      { id: expect.any(String), made_by: 'Ryan', color: 'Powder Blue', favorite_level: 7 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdMug = await Mug.insert({
      made_by: 'Emily',
      color: 'Blue Gray',
      favorite_level: 9
    });

    const updatedMug = await Mug.update(createdMug.id, {
      made_by: 'Ryan',
      color: 'Powder Blue',
      favorite_level: 7
    });

    expect(updatedMug).toEqual({
      id: createdMug.id,
      made_by: 'Ryan',
      color: 'Powder Blue',
      favorite_level: 7
    });
  });
  
  it('deletes a row by id', async() => {
    const createdMug = await Mug.insert({
      made_by: 'Ryan',
      color: 'Powder Blue',
      favorite_level: 7
    });

    const deletedMug = await Mug.delete(createdMug.id);

    expect(deletedMug).toEqual({
      id: createdMug.id,
      made_by: 'Ryan',
      color: 'Powder Blue',
      favorite_level: 7
    });
  });
});
  
