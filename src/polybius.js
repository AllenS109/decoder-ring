const polybiusModule = (function () {
  // you can add any code you want within this function scope
  const keys = {
    alphaKey: _createKey("alpha"),
    coordKey: _createKey("coord"),
  };

 
  function polybius(input, encode = true) {
    //Made two key matrices with developer functions instead of hardcoding the keys
    try {
      if (!input.length) throw new Error(`Input cannot be empty!`);
      return input
        .split(" ")
        .map((word) => _iterateWord(word, encode, keys))
        .join(" ");
    } catch (error) {
      //console.log(`${error}`); //uncomment to print the error to our console for debugging
      return false; //if any of our words throw an error we return false
    }
  }

  //Helper function to handle iteration differences between encoding and decoding
  function _iterateWord(word, encode, { alphaKey, coordKey }) {
    if (encode)
      return word
        .toLowerCase()
        .split("")
        .map((letter) => _mapMatrixTo(letter, alphaKey, coordKey))
        .join("");

    if (word.length % 2 !== 0)
      throw new Error(
        `Polybius coordinates come in pairs.\nIgnoring spaces, you cannot decrypt with an odd numbered total!`
      ); //if we're decoding an odd-length word the output is false
    let output = "";
    for (let char = 0; char < word.length; char += 2) {
      const col = word[char];
      const row = word[char + 1];
      const code = `${col}${row}`;
      output += _mapMatrixTo(code, coordKey, alphaKey);
    }
    return output;
  }

  //Finds the coordinate on fromKey that matches the inputted character and returns the value of toKey at the same coordinate
  function _mapMatrixTo(input, fromKey, toKey) {
    const coordinate = _findCoordinate(input, fromKey); //finds the same coordinate in the fromKey
    if (!coordinate) throw new Error(`"${input}" is not a valid input!`); //if we don't find a match then return false for invalid input
    const row = coordinate[0]; 
    const col = coordinate[1]; 
    return toKey[row][col]; 
  }
  //essentially a 2D indexOf method that returns an array of the coordinates that match the input
  function _findCoordinate(input, key) {
    if (input === "i" || input === "j") input = "(i/j)"; //if input is i or j, then we treat it as (i/j)
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 5; col++) {
        if (key[row][col] === input) return [row, col]; //
      }
    return false; //if we don't find a match return false
  }


  function _createKey(type = "alpha", size = 5) {
    //Creates a matrix of the specified type and size to use as an encryption key
    const grid = [];
    for (let row = 0; row < size; row++) {
      const thisRow = [];
      for (let col = 0; col < size; col++) {
        type === "alpha"
          ? thisRow.push(_alphaIndex(row, col, size))
          : thisRow.push(_coordIndex(row, col));
      }
      grid.push(thisRow);
    }
    return grid;
  }
  //resolves row and col into a 1d numberline then add 97 to make it charcode lowercase alpha
  function _alphaIndex(row, col, size) {
    const number = row * size + col; 
    let charCode = number + 97; 
    if (charCode === 105) return "(i/j)"; // i and j are merged
    const shift = charCode > 105 ? 1 : 0; 
    return String.fromCharCode(charCode + shift);
  }
  function _coordIndex(row, col) {
    return `${col + 1}${row + 1}`;
  }

  return {
    polybius,
  };
})();

module.exports = { polybius: polybiusModule.polybius };