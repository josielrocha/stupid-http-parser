const Lexer = require('./lexer');
const Parser = require('./parser');
const {HTTP_GET, HTTP_POST} = require('./inputs');
const debug = require('./debug');

[HTTP_GET, HTTP_POST]
  .map(input => input.trim())
  .forEach(input => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    debug();
    debug('Iniciando análise léxica');
    debug();
    debug();
    debug('Entrada:');
    debug();
    debug(input);
    debug();
    debug('Saída:');
    debug();
    debug('---');

    parser.program();
  });
