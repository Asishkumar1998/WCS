export function randomString(
  len:number,
  charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  let result = '';


  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    result += charSet.charAt(randomIndex);
  }


  return result;
}
