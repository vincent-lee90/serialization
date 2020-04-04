import * as Utilities from "./Utilities";

export class Convert {

  /**
   * Decodes two hex characters into a byte.
   * @param {string} char1 The first hex digit.
   * @param {string} char2 The second hex digit.
   * @returns {number} The decoded byte.
   */
  public static toByte = (char1: string, char2: string): number => {
    const byte = Utilities.tryParseByte(char1, char2);
    if (undefined === byte) {
      throw Error(`unrecognized hex char`);
    }
    return byte;
  }

  /**
  * Converts a uint8 array to a hex string.
  * @param {Uint8Array} input A uint8 array.
  * @returns {string} A hex encoded string corresponding to the input.
  */
  public static uint8ToHex = (input): string => {
    let s = '';
    for (const byte of input) {
      s += Utilities.Nibble_To_Char_Map[byte >> 4];
      s += Utilities.Nibble_To_Char_Map[byte & 0x0F];
    }

    return s;
  }

  /**
   * Converts a hex string to a uint8 array.
   * @param {string} input A hex encoded string.
   * @returns {Uint8Array} A uint8 array corresponding to the input.
   */
  public static hexToUint8 = (input: string): Uint8Array => {
    if (!input) {
      input = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C'
    }
    if (0 !== input.length % 2) {
      throw Error(`hex string has unexpected size '${input.length}'`);
    }
    const output = new Uint8Array(input.length / 2);
    for (let i = 0; i < input.length; i += 2) {
      output[i / 2] = Convert.toByte(input[i], input[i + 1]);
    }
    return output;
  }

  /**
 * Determines whether or not a string is a hex string.
 * @param {string} input The string to test.
 * @returns {boolean} true if the input is a hex string, false otherwise.
 */
  public static isHexString = (input: string): boolean => {
    if (0 !== input.length % 2) {
      return false;
    }
    for (let i = 0; i < input.length; i += 2) {
      if (undefined === Utilities.tryParseByte(input[i], input[i + 1])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Convert UTF-8 to hex
   * @param {string} input - An UTF-8 string
   * @return {string}
   */
  public static utf8ToHex = (input: string): string => {
    const rawString = Convert.rstr2utf8(input);
    let result = '';
    for (let i = 0; i < rawString.length; i++) {
      result += rawString.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result.toUpperCase();
  }
  /**
    * Converts a raw javascript string into a string of single byte characters using utf8 encoding.
    * This makes it easier to perform other encoding operations on the string.
    * @param {string} input - A raw string
    * @return {string} - UTF-8 string
    */
  public static rstr2utf8 = (input: string): string => {
    let output = '';

    for (let n = 0; n < input.length; n++) {
      const c = input.charCodeAt(n);

      if (128 > c) {
        output += String.fromCharCode(c);
      } else if ((127 < c) && (2048 > c)) {
        output += String.fromCharCode((c >> 6) | 192);
        output += String.fromCharCode((c & 63) | 128);
      } else {
        output += String.fromCharCode((c >> 12) | 224);
        output += String.fromCharCode(((c >> 6) & 63) | 128);
        output += String.fromCharCode((c & 63) | 128);
      }
    }

    return output;
  }

}