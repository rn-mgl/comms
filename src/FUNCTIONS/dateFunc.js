const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const dateAndTime = (date) => {
  const newDate = new Date(date);
  const localeDate = newDate.toLocaleDateString();
  const localeTime = newDate.toLocaleTimeString();

  const splitDate = localeDate.split("/");
  const splitTime = localeTime.split(":");
  const splitMill = splitTime[2].split(" ");

  const month = months[splitDate[0]];
  const day = splitDate[1];
  const year = splitDate[2].slice(2, 4);

  const hour = splitTime[0];
  const minute = splitTime[1];
  const state = splitMill[1];

  const val = `${month}/${day}/${year} | ${hour} : ${minute} ${state}`;
  return val;
};

export const date = (date) => {
  const newDate = new Date(date);
  const localeDate = newDate.toLocaleDateString();

  const splitDate = localeDate.split("/");

  const month = months[splitDate[0]];
  const day = splitDate[1];
  const year = splitDate[2].slice(2, 4);

  const val = `${month}/${day}/${year}`;
  return val;
};

export const time = (date) => {
  const newDate = new Date(date);
  const localeTime = newDate.toLocaleTimeString();

  const splitTime = localeTime.split(":");
  const splitMill = splitTime[2].split(" ");

  const hour = splitTime[0];
  const minute = splitTime[1];
  const state = splitMill[1];

  const val = `${hour} : ${minute} ${state}`;
  return val;
};
