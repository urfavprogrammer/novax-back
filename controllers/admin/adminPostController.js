import approveDepositRequest from "./adminPostHandlers/approvedeposit.js";
import declineDepositRequest from "./adminPostHandlers/declineDeposit.js";
import deleteDepositRequest from "./adminPostHandlers/deleteDeposit.js";
import approveWithdrawRequest from "./adminPostHandlers/approvewithdrawal.js";
import declineWithdrawRequest from "./adminPostHandlers/declineWithdrawal.js";
import deleteWithdrawalRequest from "./adminPostHandlers/deleteWithdrawal.js";
import updateUser from "./adminPostHandlers/userUpdate.js";
import updatePayment from "./adminPostHandlers/updatePayment.js";
import adminKycPostHandlers from "./adminPostHandlers/kyc.js";

export default function AdminPostController(models = {}) {
  const { User, Deposits, Withdraw, Asset, Referral, Admin, Payment, KYC } =
    models || {};

  //Bind approve handlers
  const approvedepositrequest = approveDepositRequest({ Deposits, Asset });
  const declinedepositrequest = declineDepositRequest({ Deposits });
  const deletedepositrequest = deleteDepositRequest({ Deposits });

  //Bind withdraw handlers
  const approvewithdrawrequest = approveWithdrawRequest({ Withdraw, Asset });
  const declinewithdrawrequest = declineWithdrawRequest({ Withdraw, Asset });
  const deletewithdrawrequest = deleteWithdrawalRequest({ Withdraw });

  //Bind updateUser
  const updateUserDetails = updateUser({ User, Asset });

  //Bind updatePayment
  const updatePaymentDetails = updatePayment({ Payment, Asset });

  //Bind KYC handlers
  const {viewKycRequests, approveKyc, declineKyc} = adminKycPostHandlers({ User, KYC });


  return {
    approvedepositrequest,
    approvewithdrawrequest,
    declinewithdrawrequest,
    declinedepositrequest,
    deletedepositrequest,
    deletewithdrawrequest,
    updateUserDetails,
    updatePaymentDetails,
    viewKycRequests,  
    approveKyc,
    declineKyc
  };
}
