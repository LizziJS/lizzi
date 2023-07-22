// test emails in array
const db = ["liz2k@mail.ru", "osw00740@zcrcd.com"];

export const checkEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(!db.includes(email));
    }, 1000);
  });
};
