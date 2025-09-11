import userModel from './User.js';
import assetModel from './Asset.js';
import depositModel from './Deposit.js';
import contactModel from './Contact.js';
import cryptoModel from './Crypto.js';
import ctradeModel from './CTrader.js';
import mortgageModel from './Mortgage.js';
import referralModel from './Referral.js';
import reitModel from './Reit.js';
import roboModel from './Robo.js';
import savingsModel from './Savings.js';
import stakeModel from './Stake.js';
import stockModel from './Stock.js';
import withdrawModel from './Withdraw.js';
import adminModel from './Admin.js';
import paymentModel from './Payment.js';
import kycModel from './KYC.js';
import fundingIntentModel from './FundingIntent.js';
import fundingEventModel from './FundingEvent.js';


import { Sequelize } from "sequelize";


export default function initModels(sequelize) {
  const db = {};
   db.User = userModel(sequelize);
   db.Asset = assetModel(sequelize);
   db.Contact = contactModel(sequelize);
   db.Crypto = cryptoModel(sequelize);
   db.CTrader = ctradeModel(sequelize);
   db.Mortgage = mortgageModel(sequelize);
   db.Referral = referralModel(sequelize);
   db.Reit = reitModel(sequelize);
   db.Robo = roboModel(sequelize);
   db.Savings = savingsModel(sequelize);
   db.Stake = stakeModel(sequelize);
   db.Stock = stockModel(sequelize);
   db.Withdraw = withdrawModel(sequelize);
   db.Deposit = depositModel(sequelize);
   db.Admin = adminModel(sequelize);
   db.Payment = paymentModel(sequelize);
   db.KYC = kycModel(sequelize);
  db.FundingIntent = fundingIntentModel(sequelize);
  db.FundingEvent = fundingEventModel(sequelize);

  if (db.User && db.Asset) {
    // create a one-to-one relationship where User.username === Asset.username
    // Note: use sourceKey/targetKey because the PK on User is `id` but the linking field is `username`.
    db.User.hasOne(db.Asset, {
      as: "asset",
      foreignKey: "username",
      sourceKey: "username",
    });
    db.Asset.belongsTo(db.User, {
      as: "user",
      foreignKey: "username",
      targetKey: "username",
    });
  }

   db.sequelize = sequelize;
   db.Sequelize = Sequelize;
  return db;
};
