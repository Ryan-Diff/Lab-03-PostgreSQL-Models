const pool = require('../utils/pool');

class Game {
    id;
    name;
    type;
    num_of_players;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
      this.type = row.type;
      this.num_of_players = row.num_of_players;
    }

    static async insert(game) {
      const { rows } = await pool.query(
        'INSERT INTO games (name, type, num_of_players) VALUES ($1, $2, $3) RETURNING *',
        [game.name, game.type, game.num_of_players]
      );

      return new Game(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM games WHERE id = $1',
        [id]
      );
          
      if(!rows[0]) return null;
      else return new Game(rows[0]);
    }

}

module.exports = Game;
