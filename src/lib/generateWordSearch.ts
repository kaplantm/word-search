// https://raw.githubusercontent.com/bunkat/wordfind/master/wordfind.js

// TODO: now rewrite
/**
 * Wordfind.js 0.0.1
 * (c) 2012 Bill, BunKat LLC.
 * Wordfind is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/wordfind
 */

/**
 * Generates a new word find (word search) puzzle provided a set of words.
 * Can automatically determine the smallest puzzle size in which all words
 * fit, or the puzzle size can be manually configured.  Will automatically
 * increase puzzle size until a valid puzzle is found.
 *
 * WordFind has no dependencies.
 */

// Letters used to fill blank spots in the puzzle
const LETTERS = "abcdefghijklmnoprstuvwy";

/**
 * Definitions for all the different orientations in which words can be
 * placed within a puzzle. New orientation definitions can be added and they
 * will be automatically available.
 */

// The list of all the possible orientations
const allOrientations = [
  "horizontal",
  "horizontalBack",
  "vertical",
  "verticalUp",
  "diagonal",
  "diagonalUp",
  "diagonalBack",
  "diagonalUpBack",
];

// The definition of the orientation, calculates the next square given a
// starting square (x,y) and distance (i) from that square.
const orientations = {
  horizontal: function (x: number, y: number, i: number) {
    return { x: x + i, y: y };
  },
  horizontalBack: function (x: number, y: number, i: number) {
    return { x: x - i, y: y };
  },
  vertical: function (x: number, y: number, i: number) {
    return { x: x, y: y + i };
  },
  verticalUp: function (x: number, y: number, i: number) {
    return { x: x, y: y - i };
  },
  diagonal: function (x: number, y: number, i: number) {
    return { x: x + i, y: y + i };
  },
  diagonalBack: function (x: number, y: number, i: number) {
    return { x: x - i, y: y + i };
  },
  diagonalUp: function (x: number, y: number, i: number) {
    return { x: x + i, y: y - i };
  },
  diagonalUpBack: function (x: number, y: number, i: number) {
    return { x: x - i, y: y - i };
  },
};

// Determines if an orientation is possible given the starting square (x,y),
// the height (h) and width (w) of the puzzle, and the length of the word (l).
// Returns true if the word will fit starting at the square provided using
// the specified orientation.
var checkOrientations = {
  horizontal: function (x: number, y: number, h: number, w: number, l: number) {
    return w >= x + l;
  },
  horizontalBack: function (x: number, y: number, h: number, w: number, l: number) {
    return x + 1 >= l;
  },
  vertical: function (x: number, y: number, h: number, w: number, l: number) {
    return h >= y + l;
  },
  verticalUp: function (x: number, y: number, h: number, w: number, l: number) {
    return y + 1 >= l;
  },
  diagonal: function (x: number, y: number, h: number, w: number, l: number) {
    return w >= x + l && h >= y + l;
  },
  diagonalBack: function (x: number, y: number, h: number, w: number, l: number) {
    return x + 1 >= l && h >= y + l;
  },
  diagonalUp: function (x: number, y: number, h: number, w: number, l: number) {
    return w >= x + l && y + 1 >= l;
  },
  diagonalUpBack: function (x: number, y: number, h: number, w: number, l: number) {
    return x + 1 >= l && y + 1 >= l;
  },
};

// Determines the next possible valid square given the square (x,y) was ]
// invalid and a word lenght of (l).  This greatly reduces the number of
// squares that must be checked. Returning {x: x+1, y: y} will always work
// but will not be optimal.
var skipOrientations = {
  horizontal: function (x: number, y: number, l: number) {
    return { x: 0, y: y + 1 };
  },
  horizontalBack: function (x: number, y: number, l: number) {
    return { x: l - 1, y: y };
  },
  vertical: function (x: number, y: number, l: number) {
    return { x: 0, y: y + 100 };
  },
  verticalUp: function (x: number, y: number, l: number) {
    return { x: 0, y: l - 1 };
  },
  diagonal: function (x: number, y: number, l: number) {
    return { x: 0, y: y + 1 };
  },
  diagonalBack: function (x: number, y: number, l: number) {
    return { x: l - 1, y: x >= l - 1 ? y + 1 : y };
  },
  diagonalUp: function (x: number, y: number, l: number) {
    return { x: 0, y: y < l - 1 ? l - 1 : y + 1 };
  },
  diagonalUpBack: function (x: number, y: number, l: number) {
    return { x: l - 1, y: x >= l - 1 ? y + 1 : y };
  },
};

type Options = {
  height: number;
  width: number;
  allowExtraBlanks?: boolean;
  maxAttempts?: number;
  maxGridGrowth?: number;
  preferOverlap?: boolean;
};

/**
 * Initializes the puzzle and places words in the puzzle one at a time.
 *
 * Returns either a valid puzzle with all of the words or null if a valid
 * puzzle was not found.
 *
 */
var fillPuzzle = function (words: string[], options: Options) {
  const puzzle: string[][] = [];

  // initialize the puzzle with blanks
  for (let i = 0; i < options.height; i++) {
    puzzle.push([]);
    for (let j = 0; j < options.width; j++) {
      puzzle[i].push("");
    }
  }

  // add each word into the puzzle one at a time
  for (let i = 0; i < words.length; i++) {
    if (!placeWordInPuzzle(puzzle, options, words[i])) {
      // if a word didn't fit in the puzzle, give up
      return null;
    }
  }

  // return the puzzle
  return puzzle;
};

/**
 * Adds the specified word to the puzzle by finding all of the possible
 * locations where the word will fit and then randomly selecting one. Options
 * controls whether or not word overlap should be maximized.
 *
 * Returns true if the word was successfully placed, false otherwise.
 *
 */
var placeWordInPuzzle = function (puzzle: string[][], options: Options, word: string) {
  // find all of the best locations where this word would fit
  var locations = findBestLocations(puzzle, options, word);

  if (locations.length === 0) {
    return false;
  }

  // select a location at random and place the word there
  var sel = locations[Math.floor(Math.random() * locations.length)];
  placeWord(puzzle, word, sel.x, sel.y, orientations[sel.orientation as keyof typeof orientations]);

  return true;
};

type LocationType = {
  x: number;
  y: number;
  orientation: keyof typeof orientations;
  overlap: number;
};

/**
 * Iterates through the puzzle and determines all of the locations where
 * the word will fit. Options determines if overlap should be maximized or
 * not.
 *
 * Returns a list of location objects which contain an x,y cooridinate
 * indicating the start of the word, the orientation of the word, and the
 * number of letters that overlapped with existing letter.
 *
 */
var findBestLocations = function (
  puzzle: string[][],
  options: Options,
  word: string
): LocationType[] {
  var locations: LocationType[] = [];

  var height = options.height,
    width = options.width,
    wordLength = word.length,
    maxOverlap = 0; // we'll start looking at overlap = 0

  // loop through all of the possible orientations at this position
  for (var k = 0, len = allOrientations.length; k < len; k++) {
    var orientation = allOrientations[k] as keyof typeof orientations,
      check = checkOrientations[orientation],
      next = orientations[orientation],
      skipTo = skipOrientations[orientation],
      x = 0,
      y = 0;

    // loop through every position on the board
    while (y < height) {
      // see if this orientation is even possible at this location
      if (check(x, y, height, width, wordLength)) {
        // determine if the word fits at the current position
        var overlap = calcOverlap(word, puzzle, x, y, next);

        // if the overlap was bigger than previous overlaps that we've seen
        if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1)) {
          maxOverlap = overlap;
          locations.push({ x: x, y: y, orientation: orientation, overlap: overlap });
        }

        x++;
        if (x >= width) {
          x = 0;
          y++;
        }
      } else {
        // if current cell is invalid, then skip to the next cell where
        // this orientation is possible. this greatly reduces the number
        // of checks that we have to do overall
        var nextPossible = skipTo(x, y, wordLength);
        x = nextPossible.x;
        y = nextPossible.y;
      }
    }
  }

  // finally prune down all of the possible locations we found by
  // only using the ones with the maximum overlap that we calculated
  return options.preferOverlap ? pruneLocations(locations, maxOverlap) : locations;
};

/**
 * Determines whether or not a particular word fits in a particular
 * orientation within the puzzle.
 *
 * Returns the number of letters overlapped with existing words if the word
 * fits in the specified position, -1 if the word does not fit.
 */

// TODO: fnGetSquare type
var calcOverlap = function (
  word: string,
  puzzle: string[][],
  x: number,
  y: number,
  fnGetSquare: any
): number {
  var overlap = 0;

  // traverse the squares to determine if the word fits
  for (var i = 0, len = word.length; i < len; i++) {
    var next = fnGetSquare(x, y, i),
      square = puzzle[next.y][next.x];

    // if the puzzle square already contains the letter we
    // are looking for, then count it as an overlap square
    if (square === word[i]) {
      overlap++;
    }
    // if it contains a different letter, than our word doesn't fit
    // here, return -1
    else if (square !== "") {
      return -1;
    }
  }

  // if the entire word is overlapping, skip it to ensure words aren't
  // hidden in other words
  return overlap;
};

/**
 * If overlap maximization was indicated, this function is used to prune the
 * list of valid locations down to the ones that contain the maximum overlap
 * that was previously calculated.
 *
 * Returns the pruned set of locations.
 *
 * @param {[Location]} locations: The set of locations to prune
 * @param {int} overlap: The required level of overlap
 */
var pruneLocations = function (locations: LocationType[], overlap: number): LocationType[] {
  var pruned = [];
  for (var i = 0, len = locations.length; i < len; i++) {
    if (locations[i].overlap >= overlap) {
      pruned.push(locations[i]);
    }
  }
  return pruned;
};

/**
 * Places a word in the puzzle given a starting position and orientation.
 */
// TODO: fnGetSquare type
var placeWord = function (
  puzzle: string[][],
  word: string,
  x: number,
  y: number,
  fnGetSquare: any
) {
  for (var i = 0, len = word.length; i < len; i++) {
    var next = fnGetSquare(x, y, i);
    puzzle[next.y][next.x] = word[i];
  }
};

/**
 * Fills in any empty spaces in the puzzle with random letters.
 *
 * @param {[[String]]} puzzle: The current state of the puzzle
 * @api public
 */
function fillBlanks(puzzle: string[][]) {
  var extraLettersCount = 0;
  for (var i = 0, height = puzzle.length; i < height; i++) {
    var row = puzzle[i];
    for (var j = 0, width = row.length; j < width; j++) {
      if (!puzzle[i][j]) {
        puzzle[i][j] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        extraLettersCount++;
      }
    }
  }
  return extraLettersCount;
}

function newPuzzle(words: string[], settings: Options) {
  if (!words.length) {
    throw new Error("Zero words provided");
  }
  var wordList,
    puzzle,
    attempts = 0,
    gridGrowths = 0,
    opts = settings || {};

  // copy and sort the words by length, inserting words into the puzzle
  // from longest to shortest works out the best
  wordList = words.slice(0).sort();

  // initialize the options
  var maxWordLength = wordList[0].length;
  var options = {
    height: opts.height || maxWordLength,
    width: opts.width || maxWordLength,
    allowExtraBlanks: opts.allowExtraBlanks !== undefined ? opts.allowExtraBlanks : true,
    maxAttempts: opts.maxAttempts || 3,
    maxGridGrowth: opts.maxGridGrowth !== undefined ? opts.maxGridGrowth : 10,
    preferOverlap: opts.preferOverlap !== undefined ? opts.preferOverlap : true,
  };

  // add the words to the puzzle
  // since puzzles are random, attempt to create a valid one up to
  // maxAttempts and then increase the puzzle size and try again
  while (!puzzle) {
    while (!puzzle && attempts++ < options.maxAttempts) {
      puzzle = fillPuzzle(wordList, options);
    }

    if (!puzzle) {
      gridGrowths++;
      if (gridGrowths > options.maxGridGrowth) {
        throw new Error(
          `No valid ${options.width}x${options.height} grid found and not allowed to grow more`
        );
      }
      console.log(
        `No valid ${options.width}x${options.height} grid found after ${
          attempts - 1
        } attempts, trying with bigger grid`
      );
      options.height++;
      options.width++;
      attempts = 0;
    }
  }

  // fill in empty spaces with random letters

  var extraLettersCount = fillBlanks(puzzle);

  var gridFillPercent = 100 * (1 - extraLettersCount / (options.width * options.height));
  console.log(
    `Blanks filled with ${extraLettersCount} random letters - Final grid is filled at ${gridFillPercent.toFixed(
      0
    )}%`
  );

  return puzzle;
}

export default newPuzzle;
