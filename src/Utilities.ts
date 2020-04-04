
export const Nibble_To_Char_Map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

export const tryParseByte = (char1, char2) => {
  const charMap = Char_To_Nibble_Map();
  const nibble1 = charMap[char1];
  const nibble2 = charMap[char2];
  return undefined === nibble1 || undefined === nibble2 ?
    undefined :
    (nibble1 << 4) | nibble2;
};
const Char_To_Nibble_Map = () => {
  const builder = createBuilder();
  builder.addRange('0', '9', 0);
  builder.addRange('a', 'f', 10);
  builder.addRange('A', 'F', 10);
  return builder.map;
};

const createBuilder = () => {
  const map = {};
  return {
    map,
    /**
     * Adds a range mapping to the map.
     * @param {string} start The start character.
     * @param {string} end The end character.
     * @param {number} base The value corresponding to the start character.
     * @memberof module:utils/charMapping~CharacterMapBuilder
     * @instance
     */
    addRange: (start, end, base) => {
      const startCode = start.charCodeAt(0);
      const endCode = end.charCodeAt(0);

      for (let code = startCode; code <= endCode; ++code) {
        map[String.fromCharCode(code)] = code - startCode + base;
      }
    },
  };
};
