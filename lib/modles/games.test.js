const fs = require('fs');
const Game = require('./games.js');

const pool = require('../utils/pool');

describe('Game type', () => {
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

  it('finds all games', async() => {
    await Promise.all([
      Game.insert({
        name: 'UNO',
        type: 'card game',
        num_of_players: 10
      }),
      Game.insert({
        name: 'Hogswarts Battle',
        type: 'card game',
        num_of_players: 4
      }),
      Game.insert({
        name: 'Checkers',
        type: 'board game',
        num_of_players: 2
      })
    ]);

    const games = await Game.find();

    expect(games).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'UNO', type: 'card game', num_of_players: 10 },
      { id: expect.any(String), name: 'HOGSWARTS BATTLE', type: 'card game', num_of_players: 4 },
      { id: expect.any(String), name: 'Checkers', type: 'board game', num_of_players: 2 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdGame = await Game.insert({
      name: 'UNO',
      type: 'Gamed game',
      num_of_players: 10
    });

    const updatedGame = await Game.update(createdGame.id, {
      name: 'Checkers',
      type: 'board game',
      num_of_players: 2
    });

    expect(updatedGame).toEqual({
      id: createdGame.id,
      name: 'Checkers',
      type: 'board game',
      num_of_players: 2
    });
  });
  
  it('deletes a row by id', async() => {
    const createdGame = await Game.insert({
      name: 'UNO',
      type: 'card game',
      num_of_players: 2
    });

    const deletedGame = await Game.delete(createdGame.id);

    expect(deletedGame).toEqual({
      id: createdGame.id,
      name: 'UNO',
      type: 'card game',
      num_of_players: 2
    });
  });
});
  
