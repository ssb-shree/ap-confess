export const isSpam = (text: string): boolean => {
  if ((text.match(/https?:\/\//g) || []).length > 3) {
    return true; // too many links
  }

  if (/(\b\w+\b)(\s+\1){4,}/gi.test(text)) {
    return true; // Block if a word repeats 5+ times in a row
  }

  return false;
};
