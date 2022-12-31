export const isWhite = (s) => {
  if (s.trim() === "") {
    return true;
  }
  return false;
};

export const isBlank = (s) => {
  if (s === "") {
    return true;
  }
  return false;
};

export const isEmpty = (s) => {
  if (s === "" || s.trim() === "") {
    return true;
  }
  return false;
};
