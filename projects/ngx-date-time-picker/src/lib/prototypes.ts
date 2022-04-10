export {};

declare global {
  interface Number {
    pad(): string;
  }

  interface String {
    pad(): string;
  }

  interface Array<T> {
    includes(searchElement: string): boolean;
  }
}

if (!Number.prototype.pad) {
  Number.prototype.pad = function (): string {
    const s = String(this);
    return s.length < 2 ? '0' + s : s;
  };
}

if (!String.prototype.pad) {
  String.prototype.pad = function (): string {
    const s = String(this);
    return s.length < 2 ? '0' + s : s;
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement: string): boolean {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (
        searchElement === currentElement ||
        (searchElement !== searchElement && currentElement !== currentElement)
      ) {
        // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}
