const Token = require('./token');
const debug = require('./debug');

module.exports = class Parser {
  static BUFFER_LENGTH = 10;

  constructor(lexer) {
    this._lexer = lexer;
    this._buffer = [];
    this._isEnd = false;

    this._readToken();
  }

  program() {
    this._match(Token.METHOD);
    this._match(Token.PATH);
    this._match(Token.VERSION);
    this._headersList();
    this._bodyDelimiter();
    this._body();
    this._end();
  }

  _headersList() {
    while (true) {
      // Headers podem ser opcionais?
      if (this._lookAhead(1)?.type === Token.BODY_DELIMITER) {
        return;
      }

      // Não há mais nada a processar
      if (this._lookAhead(1)?.type === Token.END) {
        return;
      }

      console.log('WHILE 02');

      this._match(Token.HEADER);
    }
  }

  _bodyDelimiter() {
    // Não há mais nada a processar
    if (this._lookAhead(1)?.type === Token.END) {
      return;
    }

    this._match(Token.BODY_DELIMITER);
  }

  _body() {
    // Não há mais nada a processar
    if (this._lookAhead(1)?.type === Token.END) {
      return;
    }

    this._match(Token.BODY);
  }

  _end() {
    this._match(Token.END);
  }

  /**
   * Faz a leitura de tantos tokens quanto o buffer suporte
   *
   * @return {void}
   */
  _readToken() {
    // Sempre que o _readToken é chamado o token no início do buffer é removido
    if (this._buffer.length > 0) {
      this._buffer.shift();
    }

    while (this._buffer.length < Parser.BUFFER_LENGTH && !this._isEnd) {
      const token = this._lexer.nextToken();

      this._buffer.push(token);
      debug(`Read: ${this._lookAhead(1)}`);

      console.log(token)
      if (token?.type === Token.END) {
        this._isEnd = true;
      }
    }
  }

  _lookAhead(k) {
    // Se o buffer estiver vazio
    if (this._buffer.length === 0) {
      return null;
    }

    // Se for solicitado um k além do tamanho do buffer retorna o último
    if (k-1 >= this._buffer.length) {
      return this._buffer[this._buffer.length - 1];
    }

    // Retorna o buffer exatamente na posição solicitada
    return this._buffer[k-1];
  }

  _match(tokenType) {
    debug(this._buffer);
    if (this._lookAhead(1).type === tokenType) {
      debug(`Match: ${this._lookAhead(1)}`);
      this._readToken();
    } else {
      this._syntaxError(tokenType);
    }
  }

  _syntaxError(...expectedTokenTypes) {
    let message = 'Syntax error: expected one of the following (';

    let types = Array.from(expectedTokenTypes).map(idx => Token.TYPE_NAMES[idx])
    for (let i=0, limit = types.length; i<limit; i++) {
      message += types[i];

      if (i < limit - 1) {
        message += ', ';
      }
    }

    message += `), but found ${Token.TYPE_NAMES[this._lookAhead(1).type]}`

    throw new Error(message);
  }
}
