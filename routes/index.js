import express from 'express';
import { kycUpload, avatarUpload, adminUpload } from "../middleware/upload.js";
import userAuth from '../controllers/user/userAuth.js';
import userDashboardController from '../controllers/user/dashboardController.js';
import copyTraders from '../controllers/user/copyTraderController.js/copyTrade.js';
import mortgage from '../controllers/user/mortgageController/mortgage.js';
import reitsController from "../controllers/user/reitsController/reits.js";
import savingsController from '../controllers/user/savingsController/savings.js';
import etfController from '../controllers/user/etfController/etf.js';
import cryptoController from '../controllers/user/cryptoController/crypto.js';
import roboController from '../controllers/user/roboController/robo.js';
import stakeController from '../controllers/user/stakeController/stake.js';
import referralController from '../controllers/user/activityController/referral.js';
import supportController from '../controllers/user/activityController/support.js';
import paymentController from '../controllers/paymentController/payment.js';


import adminAuthController from '../controllers/admin/adminAuth.js';
import adminController from '../controllers/admin/adminController.js';
import adminPostController from '../controllers/admin/adminPostController.js';
import userProfile from '../controllers/user/profileController/userProfile.js';
import userDashPostController from '../controllers/user/dashPostController.js';





export default function indexRouter ({User, Asset, Crypto, CTrader, Mortgage, Referral, Reit, Robo, Savings, Stake, Stock, Withdraw, Deposit, Admin, Payment, KYC, FundingIntent, FundingEvent, Contact}) {
  const router = express.Router();

  // user Binding
  const userAuthController = userAuth({ User, Asset });
  const userDashboard = userDashboardController({
    User,
    Asset,
    Crypto,
    CTrader,
    Mortgage,
    Referral,
    Reit,
    Robo,
    Savings,
    Stake,
    Stock,
    Withdraw,
    Deposit,
  });

  const profile = userProfile({ User, Withdraw, KYC });
  const copyTradersController = copyTraders({ CTrader, User, FundingEvent });
  const mortgageController = mortgage({ Mortgage, User });
  const reitsListing = reitsController({ Reit, User });
  const dashPost = userDashPostController({ User, Asset,Crypto, CTrader, Mortgage, Referral, Reit, Robo, Savings, Stake, Stock, Withdraw, Deposit, KYC });
  const savingControl = savingsController({ Savings, User });
  const etfControl = etfController({ Stock, User });
  const cryptoControl = cryptoController({ Crypto, User });
  const roboControl = roboController({ Robo, User });
  const stakeControl = stakeController({ Stake, User });
  const referralControl = referralController({ Savings, User });
  // Support controller needs the Contact model; previously passed Savings incorrectly causing Contact undefined
  const supportControl = supportController({ User, Contact });
  const payment = paymentController({ Payment, User, CTrader, Savings, Mortgage, Reit, Stock, Deposit, Crypto, Robo, FundingIntent, FundingEvent });


  // Admin Controllers
  const adminPost = adminPostController({
    User,
    Withdraw,
    Deposit,
    Asset,
    Payment,
    CTrader,
  });

  const adminAuth = adminAuthController({ Admin });
  const admin = adminController({
    User,
    Deposit,
    Withdraw,
    Asset,
    Referral,
    Admin,
    Payment,
  });
  // const dashPost = dashPost({ User, Asset,Crypto, CTrader, Mortgage, Referral, Reit, Robo, Savings, Stake, Stock, Withdraw, Deposit });

  //user Auth
  router.get("/auth/login", userAuthController.Login);
  router.get("/auth/register", userAuthController.userRegister);
  //protected auth routes
  router.get(
    "/auth/logout",
    userAuthController.requireAuth,
    userAuthController.logout
  );

  router.post("/auth/register", userAuthController.register);
  router.post("/auth/login", userAuthController.userLogin);

  //  END USER AUTH ENDS  //

  // BEGINS  ADMIN AUTH  BEGINS //
  router.get("/auth/admin/login", adminAuth.adminLogin);
  router.get("/auth/admin/register", adminAuth.adminRegister);
  router.post("/auth/admin/login", adminAuth.adminLoginPost);
  router.post("/auth/admin/register", adminAuth.adminRegisterPost);

  //  END ADMIN AUTH ENDS  //

  // admin get routes //
  // *******************************************************//
  router.get("/novax-assets/admin/dashboard", admin.requireAdmin, admin.index);
  router.get("/novax-assets/admin/users", admin.requireAdmin, admin.allUsers);
  router.get(
    "/novax-assets/admin/pending_deposits",
    admin.requireAdmin,
    admin.allPendingDeposits
  );
  router.get(
    "/novax-assets/admin/approved_deposits",
    admin.requireAdmin,
    admin.allApprovedDeposits
  );
  // router.get("/novax-assets/admin/declined_deposits", admin.requireAdmin, admin.declinedDeposits);
  router.get(
    "/novax-assets/admin/pending_withdrawals",
    admin.requireAdmin,
    admin.allPendingWithdrawals
  );
  router.get(
    "/novax-assets/admin/approved_withdrawals",
    admin.requireAdmin,
    admin.allApprovedWithdrawals
  );
  // router.get("/novax-assets/admin/declined_withdrawals", admin.requireAdmin, admin.declinedWithdrawals);
  router.get(
    "/novax-assets/admin/edit_account",
    admin.requireAdmin,
    admin.editUserAccount
  );
  router.get(
    "/novax-assets/admin/:userId/edit_account",
    admin.requireAdmin,
    admin.updateUserAccount
  );
  router.get(
    "/novax-assets/admin/payment",
    admin.requireAdmin,
    admin.paymentDetails
  );
  router.get(
    "/novax-assets/admin/view_payment_details",
    admin.requireAdmin,
    admin.viewPaymentDetails
  );
  router.get(
    "/novax-assets/admin/changepassword",
    admin.requireAdmin,
    admin.changeAdminPassword
  );
  router.get(
    "/novax-assets/admin/create/ctraders",
    admin.requireAdmin,
    admin.createCTrader
  );


  // API routes for user dashboard *******//
  // *******************************************************//
  router.get("/api/crypto_history", dashPost.cryptoHistory);
  router.get("/api/kyc_history", dashPost.kycHistory);

  
  // *******************************************************//

  // END admin get routes END //
  // *******************************************************//
  // USER GET ROUTES BEGINS //
  //  *************************************//
  router.get(
    "/member/account/dashboard",
    userAuthController.requireAuth,
    userDashboard.dashboard
  );
  router.get(
    "/member/account/overview",
    userAuthController.requireAuth,
    userDashboard.overviewPage
  );
  router.get(
    "/member/account/edit_profile",
    userAuthController.requireAuth,
    profile.userEditProfile
  );
  router.get(
    "/member/account/change_password",
    userAuthController.requireAuth,
    profile.changePassword
  );
  router.get(
    "/member/account/check_kyc",
    userAuthController.requireAuth,
    profile.checkKyc
  );

  // Copy Trade routes
  router.get(
    "/member/account/copytrade",
    userAuthController.requireAuth,
    copyTradersController.copyTrade
  );
  router.get(
    "/member/account/copytrader/fund_trader/:traderId",
    userAuthController.requireAuth,
    copyTradersController.fundTrader
  );
   router.get(
    "/member/account/cthistory",
    userAuthController.requireAuth,
    copyTradersController.copyTraderHistory
  );
  
  router.get(
    "/member/account/copytrader/trader/:traderId",
    userAuthController.requireAuth,
    copyTradersController.viewTrader
  );

  // Mortgage routes

  router.get(
    "/member/account/property",
    userAuthController.requireAuth,
    mortgageController.mortgage
  );  
  router.post(
    "/member/account/property/fund_mortgage/:mortgageId",
    userAuthController.requireAuth,
    mortgageController.fundMortgage
  );
   router.get(
     "/member/account/mhistory",
     userAuthController.requireAuth,
     mortgageController.morgageHistory
   );  
  
  router.get(
    "/member/account/property/mortgage/:mortgageId",
    userAuthController.requireAuth,
    mortgageController.viewMortgage
  );

  // Reits routes
  router.get(
    "/member/account/reits/listings",
    userAuthController.requireAuth,
    reitsListing.reitsListing
  );

    router.post(
      "/member/account/property/fund_reits/:reitId",
      userAuthController.requireAuth,
      reitsListing.fundReits
    );

 router.get(
   "/member/account/rhistory",
   userAuthController.requireAuth,
   reitsListing.reitsHistory
 );

 router.get(
   "/member/account/reits/listings_details/:reitId",
   userAuthController.requireAuth,
   reitsListing.viewReits
 );

 // Savings routes
 router.get(
    "/member/account/savings",
    userAuthController.requireAuth,
    savingControl.savings
  );
  router.get(
    "/member/account/fundsavings",
    userAuthController.requireAuth,
    savingControl.fundSavings
  );

  router.get(
    "/member/account/shistory",
    userAuthController.requireAuth,
    savingControl.savingsHistory
  );
  
  router.get(
    "/member/account/etf/fund_stock",
    userAuthController.requireAuth,
    etfControl.etfTrade
  );
  router.get(
    "/member/account/etf/fundstock",
    userAuthController.requireAuth,
    etfControl.fundStock
  );
router.get(
    "/member/account/etf/fundetf",
    userAuthController.requireAuth,
    etfControl.fundEtf
  );

   router.get(
    "/member/account/etf_history",
    userAuthController.requireAuth,
    etfControl.etfHistory
  );
  
  router.get(
    "/member/account/etf/view_stock",
    userAuthController.requireAuth,
    etfControl.viewEtf
  );

  router.get(
    "/member/account/crypto/trade_crypto",
    userAuthController.requireAuth,
    cryptoControl.cryptoTrade
  );
  router.get(
    "/member/account/crypto_history",
    userAuthController.requireAuth,
    cryptoControl.cryptoHistory
  );
  router.get(
    "/member/account/crypto/fund_crypto",
    userAuthController.requireAuth,
    cryptoControl.fundCrypto
  );
  router.get(
    "/member/account/crypto/view_Cryptos",
    userAuthController.requireAuth,
    cryptoControl.viewCrypto
  );  
  router.get(
    "/member/account/robo/trade_robo",
    userAuthController.requireAuth,
    roboControl.roboTrader
  );
 router.get(
    "/member/account/robo_history",
    userAuthController.requireAuth,
    roboControl.roboHistory
  );


  router.get(
    "/member/account/robo/fund_robo/:id",
    userAuthController.requireAuth,
    roboControl.fundRobo
  );
  router.get(
    "/member/account/staking",
    userAuthController.requireAuth,
    stakeControl.stakeCrypto
  )
  router.get(
    "/member/account/referral",
    userAuthController.requireAuth,
    referralControl.referral
  )
  router.get(
    "/member/account/support",
    userAuthController.requireAuth,
    supportControl.support
  )
  router.post(
    "/member/account/support/create_ticket",
    userAuthController.requireAuth,
    supportControl.createSupportTicket
  )

  // Payment routes
  router.post(
    "/member/account/deposit/start",
    userAuthController.requireAuth,
    payment.captureFundingIntent
  );
  router.get(
    "/member/account/payment",
    userAuthController.requireAuth,
    payment.paymentPage
  );
  router.get(
    "/member/account/deposit/resume/:depositId",
    userAuthController.requireAuth,
    payment.resumeDeposit
  );
  // router.get(
  //   "/member/account/funding/resume/:intentId",
  //   userAuthController.requireAuth,
  //   payment.resumeFundingIntent
  // );
  // router.get(
  //   "/member/account/event/resume/:eventId",
  //   userAuthController.requireAuth,
  //   payment.resumeFundingEvent
  // );
  // router.post(
  //   "/member/account/deposit/clear",
  //   userAuthController.requireAuth,
  //   payment.clearFundingIntent
  // );
  // router.post(
  //   "/member/account/deposit/confirm",
  //   userAuthController.requireAuth,
  //   payment.confirmDeposit
  // );


  // router.get("/member/account/profile", userAuthController.requireAuth, userAuthController.profile);

  //protected USER post routes//
  // *************************************//
  router.post(
    "/auth/change_password",
    userAuthController.requireAuth,
    userAuthController.changePassword
  );
  router.post(
    "/member/account/profile/upload_avatar",
    avatarUpload.single("avatar"),
    userAuthController.requireAuth,
    profile.uploadAvatarHandler
  );
   router.post(
     "/member/account/profile/upload_kyc",
     kycUpload.array("kyc"),
     userAuthController.requireAuth,
     profile.uploadKycData
   );
  
  router.post(
    "/member/account/profile/update_profile",
    userAuthController.requireAuth,
    profile.updateProfile
  );
  


  //END USER post routes//


  //admin post routes
  // *************************************//
  router.post(
    "/novax-assets/admin/users/:userId/edit_account",
    admin.requireAdmin,
    adminPost.updateUserDetails
  );
  router.post("/novax-assets/admin/update_payment_details", admin.requireAdmin, adminPost.updatePaymentDetails);
  // router.post("/novax-assets/admin/change_password", admin.requireAdmin, adminPost.changeAdminPassword);
  // router.post("/novax-assets/admin/update_bank_details", admin.requireAdmin, adminPost.updateBankDetails);
  // router.post("/novax-assets/admin/update_crypto_details", admin.requireAdmin, adminPost.updateCryptoDetails);
  // router.post("/novax-assets/admin/approve_deposit", admin.requireAdmin, adminPost.approveDeposit);
  // router.post("/novax-assets/admin/decline_deposit", admin.requireAdmin, adminPost.declineDeposit);
  // router.post("/novax-assets/admin/approve_withdrawal", admin.requireAdmin, adminPost.approveWithdrawal);
  // router.post("/novax-assets/admin/decline_withdrawal", admin.requireAdmin, adminPost.declineWithdrawal);
  // router.post("/novax-assets/admin/create_ctrader", admin.requireAdmin, admin.createCTrader);

  return router;
}

