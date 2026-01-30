export const getNextVersion = (current: string) => {
  const match = current.match(/(\d+)\.(\d+)/);
  if (match) {
    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    return `iOS ${major}.${minor + 1}`;
  }
  return "iOS 18.0";
};
