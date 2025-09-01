import { customAlphabet } from "nanoid";

export const nanoID = () => {
  const nanoid = customAlphabet("1234567890", 10);
  return nanoid(5);
};
