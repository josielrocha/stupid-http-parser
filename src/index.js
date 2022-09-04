const Lexer = require('./lexer');
const {HTTP_GET, HTTP_POST} = require('./inputs');

[HTTP_GET, HTTP_POST]
  .map(input => input.trim())
  .forEach(input => {
    const lexer = new Lexer(input);

    console.log();
    console.log('Iniciando análise léxica');
    console.log();
    console.log();
    console.log('Entrada:');
    console.log();
    console.log(input);
    console.log();
    console.log('Saída:');
    console.log();
    let token;
    while (token = lexer.nextToken()) {
      console.log(`${token}`);
    }
    console.log('---');
  });
