class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `<type=${this.type}, value=${this.value}>`;
  }

  static METHOD = 0;
  static PATH = 1;
  static VERSION = 2;
  static HEADER = 3;
  static BODY_DELIMITER = 4;
  static BODY = 5;
}

function debug(...args) {
  // console.debug(...args);
}

module.exports = class Lexer {
  constructor(input) {
    this.input = input.trim();
    this.charPos = -1;
  }

  nextToken() {
    let char;
    while(char = this._nextChar()) {
      let token;

      debug('METHOD');
      if (token = this._method(char)) {
        return token;
      }

      debug('PATH');
      if (token = this._path(char)) {
        return token;
      }

      debug('VERSION');
      if (token = this._version(char)) {
        return token;
      }

      debug('HEADER');
      if (token = this._header(char)) {
        return token;
      }

      debug('BODY_DELIMITER');
      if (token = this._bodyDelimiter(char)) {
        return token;
      }

      debug('BODY');
      if (token = this._body(char)) {
        return token;
      }

      debug(this.input.slice(0, this.charPos));
      // Ignora espaços em branco e quebras de linha
      if (this._isIgnoredChar(char)) {
        continue;
      }

      throw new Error(`Lexical error column: ${this.charPos}`);
    }
  }

  _method(char) {
    let token;
    if (token = this._methodGet(char)) {
      return token;
    }

    if (token = this._methodPost(char)) {
      return token;
    }
  }

  _version(char) {
    if (char !== 'H') {
      return null;
    }

    let value = char;
    const getChar = () => {
      const c = this._nextChar();
      value += c;
      return c;
    }

    if(getChar() === 'T' & getChar() === 'T' & getChar() === 'P' &
      getChar() === '/' & /\d/.test(getChar())) {

      const c = getChar();
      if (this._isIgnoredChar(c)) {
        return new Token(Token.VERSION, value.slice(0, -1));
      }

      if (c === '.' & /\d/.test(getChar()) & this._isIgnoredChar(getChar())) {
        return new Token(Token.VERSION, value.slice(0, -1));
      }

      debug('Nao conseguiu (1)', value)
      this._previousChar(value.length - 1);
      return null;
    }

    debug('Nao conseguiu (2)', value)
    this._previousChar(value.length - 1);
    return null;
  }

  _path(char) {
    if (char !== '/') {
      return null;
    }

    let path = '/';
    let c;
    while (c = this._nextChar()) {
      if (this._isIgnoredChar(c)) {
        break;
      }

      path += c;
    }

    return new Token(Token.PATH, path);
  }

  _methodGet(char) {
    if (char !== 'G') {
      return null;
    }

    if (this._nextChar() !== 'E') {
      this._previousChar();
      return null;
    }

    if (this._nextChar() !== 'T') {
      this._previousChar(2);
      return null;
    }

    const c = this._nextChar();
    if (this._isIgnoredChar(c)) {
      return new Token(Token.METHOD, 'GET');
    }

    this._previousChar(3);
    return null;
  }

  _methodPost(char) {
    if (char !== 'P') {
      return null;
    }

    if (this._nextChar() !== 'O') {
      this._previousChar();
      return null;
    }

    if (this._nextChar() !== 'S') {
      this._previousChar(2);
      return null;
    }

    if (this._nextChar() !== 'T') {
      this._previousChar(3);
      return null;
    }

    const c = this._nextChar();
    if (this._isIgnoredChar(c)) {
      return new Token(Token.METHOD, 'POST');
    }

    this._previousChar(4);
    return null;
  }

  _header(char) {
    if (!char.toLowerCase().match(/\w/)) {
      return null;
    }

    let c;
    let value = char;
    while (c=this._nextChar()) {
      if (this._isLineBreak(c) || this.charPos === this.input.length -1) {
        return new Token(Token.HEADER, value);
      }

      value += c;
    }

    this._previousChar(value.length-1);
    return null;
  }

  _bodyDelimiter(char) {
    if (!this._isLineBreak(char)) {
      return null;
    }

    if (this._nextChar()) {
      return new Token(Token.BODY_DELIMITER, 'BODY_DELIMITER');
    }

    this._previousChar();
    return null;
  }

  _body(char) {
    const c = this._previousChar(2);
    if (!this._bodyDelimiter(c)) {
      this._nextChar(2);
      return null;
    }

    const value = this.input.slice(this.charPos, this.input.length);
    this.charPos = this.input.length - 1;
    return new Token(Token.BODY, value);
  }

  _isLineBreak(c) {
    return c === '\r' || c === '\n';
  }

  /**
   * Retorna o próximo caractere
   */
  _nextChar() {
    this.charPos++;
    debug(`nextChar: ${this.input[this.charPos]}`)
    return this.input[this.charPos];
  }

  _previousChar(size = 1) {
    return this.input[this.charPos -= size];
  }

  _isIgnoredChar(char) {
    return char === ' ' || char === '\t' || char === '\r' || char === '\n';
  }
}
