const NON_WORD_CHARS_REGEX = /\W+|[_]+/
const WHITE_SPACE_REGEX = /\s+/

const formatCamelCase = (text) => {
  const formatCase = (word, index) => {
    const formattedNonFirstWord = word.charAt(0).toUpperCase() + word.slice(1);
    return index === 0 ? word.toLowerCase() : formattedNonFirstWord
  };

  return text
    .replace(NON_WORD_CHARS_REGEX, ' ')
    .split(WHITE_SPACE_REGEX)
    .map((word, index) => formatCase(word, index))
    .join('')
};

export default formatCamelCase;
