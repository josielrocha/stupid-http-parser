module.exports = class Token {
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
  static END = 6;

  static TYPE_NAMES = [
    'METHOD',
    'PATH',
    'VERSION',
    'HEADER',
    'BODY_DELIMITER',
    'BODY',
    'END'
  ]
}
