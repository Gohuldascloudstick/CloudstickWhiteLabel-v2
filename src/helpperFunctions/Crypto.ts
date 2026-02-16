import CryptoJs from 'crypto-js';
const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY as string;
export const encryptData = (data: string): string => {
  const ciphertext = CryptoJs.AES.encrypt(data, secretKey).toString();
  return ciphertext;
}
export const decryptData = (ciphertext: string): string => {
  const bytes = CryptoJs.AES.decrypt(ciphertext, secretKey);
  const originalData = bytes.toString(CryptoJs.enc.Utf8);
  return originalData;
}