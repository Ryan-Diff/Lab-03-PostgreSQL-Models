const fs = require('fs');
const Game = require('./games.js');

const pool = require('../utils/pool');

describe('Game model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  it('insert a new game into the database', 
    async() => {
      const createdGame = await Game.insert({
        name: 'UNO',
        type: 'card game',
        num_of_players: 10
      });
  
      const { rows } = await pool.query(
        'SELECT * FROM games WHERE id =$1',
        [createdGame.id]
          
      );
  
      expect(rows[0]).toEqual(createdGame);
    });

  it('finds a game by id', async() => {
    const gameQuery  = await Game.insert({
      name: 'UNO',
      type: 'card game',
      num_of_players: 10 
    });
        
    const foundGame = await Game.findById(gameQuery.id);
        
    expect(foundGame).toEqual({
      id: gameQuery.id,
      name: 'UNO',
      type: 'card game',
      num_of_players: 10
    });
  });

  it('returns null if it cant find a game by id', async() => {
    const game = await Game.findById(32135);

    expect(game).toEqual(null);
  });
    
  
  
});
  
