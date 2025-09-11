export default function updatePaymentDetails() {
  return async function updatePaymentDetails(req, res) {
    try {
      const { BTC, ETH, usdt_erc20, usdt_trc20, ADA} = req.body;
      const {account_name, account_number, bank_name, account_type, routing_number, swift_code, bank_address, beneficiary_address} = req.body;
      const Payment = req.app.get("models").Payment;

      // console.log(ETH);
      // Validate and sanitize input
      const paymentData = {
        btc: BTC || null,
        eth: ETH || null,
        usdt_erc20: usdt_erc20 || null,
        usdt_trc20: usdt_trc20 || null,
        ada: ADA || null,
        account_name: account_name || null,
        account_number: account_number || null,
        bank_name: bank_name || null,
        account_type: account_type || null,
        routing_number: routing_number || null,
        swift_code: swift_code || null,
        bank_address: bank_address || null,
        beneficiary_address: beneficiary_address || null,
      };

      // let paymentChanged = false;

      console.log(paymentData);
      const paymentFields = ["btc", "eth", "usdt_erc20", "usdt_trc20", "ada", "account_name", "account_number", "bank_name", "account_type", "routing_number", "swift_code", "bank_address", "beneficiary_address"];

      // Get the first (and only) payment row, or create if none exists
      let payment = await Payment.findOne();
      if (!payment) {
        // No row exists, create new
        payment = await Payment.create({ ...paymentData });
      } else {
        let updatedFields = {};
        for (const field of paymentFields) {
          const key = field.toLowerCase();
          if (
            payment[key] !== paymentData[field] &&
            paymentData[field] !== null &&
            paymentData[field] !== undefined &&
            paymentData[field] !== ""
          ) {
            updatedFields[key] = paymentData[field];
          }
        }
        if (Object.keys(updatedFields).length > 0) {
          await payment.update(updatedFields);
        }
      }
      res.redirect("/novax-assets/admin/payment");
    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).send("Internal Server Error");
    }
  };
}
