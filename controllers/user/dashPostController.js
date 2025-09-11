import listCrypto from "./handlers/listCrypto.js";
import listKyc from "./handlers/listKyc.js";

export default function userDashPostController({ User, Asset,Crypto, CTrader, Mortgage, Referral, Reit, Robo, Savings, Stake, Stock, Withdraw, Deposit, KYC }) {
  // Shared utilities used by handlers
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const useDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);
  function generateTransactionId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 20;
    for (let i = 0; i < length; i++)
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    return result;
  }


  //Bind models to handlers and return
  const cryptoHistory = listCrypto({ Crypto });
  const kycHistory = listKyc({ User, KYC });

  return {
    cryptoHistory,
    kycHistory
  };
}
