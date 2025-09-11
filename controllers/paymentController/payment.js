

export default function paymentController({User, Payment, CTrader, Savings, Deposit, Mortgage, Reit, Crypto, Stock, FundingEvent, Robo }) {


  // POST /member/account/deposit/start
  async function captureFundingIntent(req, res) {
    try {
    
        const userId = req.session && req.session.userId;
    // Fetch user with associated data
    let user = await User.findByPk(userId);
    const username = user ? user.username : null;
    if (!username) {
      return res.redirect('/auth/login');
    }

  const {
    amount,
    currency = "USD",
    met,
    cry,
    source,
    entityId,
    memo,
    name,
    title,
    details,
    image,
    reit_rate,
  } = req.body || {};

  // console.log(cry);

      const parsedAmount = Number(amount);
      if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        const message = "Please enter a valid deposit amount.";
        if (req.xhr || (req.headers["content-type"] || "").includes("application/json")) {
          return res.status(400).json({ success: false, message });
        }
        const back = req.get("referer") || "/member/account/dashboard";
        return res.redirect(back);
      }

  // Create a generic FundingIntent row (authoritative intent)
      // let intentRow = null;
      // try {
      //   if (FundingIntent && typeof FundingIntent.create === 'function') {
      //     const txId = `FI-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
      //     intentRow = await FundingIntent.create({
      //       username,
      //       source: source || null,
      //       entityId: entityId || null,
      //       amount: parsedAmount,
      //       currency: cry || currency || null,
      //       method: met || 'Bank Transfer',
      //       memo: memo || null,
      //       channel: channel || null,
      //       status: 'pending',
      //       txid: txId,
      //       metadata: null,
      //     });
      //   }
      // } catch (e) {
      //   console.warn('captureFundingIntent: failed to create FundingIntent row:', e && e.message ? e.message : e);
      // }

  // Also create a pending Deposit row so it appears in legacy history
      let depositRow = null;
  try {
        if (Deposit && typeof Deposit.create === 'function') {
           const txId = `DP-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
          depositRow = await Deposit.create({
            username,
            amount: parsedAmount,
            depositmethod: met || 'Bank Transfer',
            depositdate: new Date().toISOString(),
            depositstatus: 'pending',
            deposittransactionid: txId,
            depositcurrency: cry || currency || null,
            depositmemo: memo || null,
          });
        }
      } catch (e) {
        console.warn('captureFundingIntent: failed to create Deposit row:', e && e.message ? e.message : e);
      }

      // After creating the Deposit, create a FundingEvent row for unified history
      let eventRow = null;
      try {
        if (FundingEvent && typeof FundingEvent.create === 'function') {
          eventRow = await FundingEvent.create({
            username,
            source_type: source || null,
            source_id: entityId || null,
            deposit_id: depositRow ? depositRow.id : null,
            amount: parsedAmount,
            method: met || 'Bank Transfer',
            currency: cry || currency || null,
            status: 'pending',
            memo: memo || null,
            metadata: null,
          });
        }
      } catch (e) {
        console.warn('captureFundingIntent: failed to create FundingEvent row:', e && e.message ? e.message : e);
      }

      req.session.deposit = {
        amount: parsedAmount,
        currency: cry,
        method: met || null,
        source: source || null,      // e.g., "copyTrader", "etf", "savings"
        entityId: entityId || null,  // e.g., traderId, stockId, etc.
        memo: memo || null,
        createdAt: Date.now(),
        depositId: depositRow ? depositRow.id : null,
        depositTxId: depositRow ? depositRow.deposittransactionid : null,
        // intentId: intentRow ? intentRow.id : null,
        // intentTxId: intentRow ? intentRow.txid : null,
        eventId: eventRow ? eventRow.id : null,
      };

      // If coming from copyTrader flow, persist a CTrader row (pending)
  if (source === 'copyTrader' && CTrader && typeof CTrader.create === 'function') {
        try {
          await CTrader.create({

            username,
            amount: parsedAmount,
            trader_name: name || `Trader ${entityId || ''}`.trim(),
            rate: parseFloat(req.body.trader_rate) || 0,
            // rate/profit default to 0 in model; status defaults to 'pending'
    date: new Date(),
          });
        } catch (e) {
          console.warn('captureFundingIntent: failed to create CTrader row:', e && e.message ? e.message : e);
        }
      }
      // If coming from mortgage flow, persist a Mortgage row (pending)
      if (source === 'mortgage' && Mortgage && typeof Mortgage.create === 'function') {
        try {
          await Mortgage.create({
            username,
            amount: parsedAmount,
            property_name: title || `Property ${entityId || ''}`.trim(),
            property_image: image || null,
            property_description: details || null,
            // rate/profit default to 0 in model; status defaults to 'pending'
            date: new Date().toLocaleDateString(),
            mortgage_id: entityId || null,
            status: 'pending',
            createdAt: new Date(),
          });
        } catch (e) {
          console.warn('captureFundingIntent: failed to create Mortgage row:', e && e.message ? e.message : e);
        }
      }
      // If coming from reit flow, persist a Reit row (pending)
      if (source === 'reit' && Reit && typeof Reit.create === 'function') {
        try {
          await Reit.create({
            username,
            amount: parsedAmount,
            property_name: name || `Property ${entityId || ""}`.trim(),
            property_image: image || null,
            property_description: details || null,
            // rate/profit default to 0 in model; status defaults to 'pending'
            date: new Date().toLocaleDateString(),
            reit_id: entityId || null,
            rate: parseFloat(reit_rate) || 0,
            status: "pending",
            createdAt: new Date(),
          });
        } catch (e) {
          console.warn('captureFundingIntent: failed to create Reit row:', e && e.message ? e.message : e);
        }
      }

      // if coming form savings flow, persist a Savings row (pending)
       if (source === 'savings' && Savings && typeof Savings.create === 'function') {
         try {
          // console.log({username, parsedAmount, name, entityId, rate: parseFloat(req.body.trader_rate) || 0});
           await Savings.create({
             username,
             amount: parsedAmount,
             savings_name: name || `Plan ${entityId || ''}`.trim(),
             rate: parseFloat(req.body.trader_rate) || 0,
             // rate/profit default to 0 in model; status defaults to 'pending'
             date: new Date(),
           });
         } catch (e) {
           console.warn('captureFundingIntent: failed to create Savings row:', e && e.message ? e.message : e);
         }
       }
       // If coming from Stock / ETF flow, persist a Stock row (pending)
       const srcLower = (source || '').toLowerCase();
       if (srcLower && ['stock','stocks','etf'].includes(srcLower) && Stock && typeof Stock.create === 'function') {
         try {
           // Sanitize / fallback name
           const fallbackName = name || title || `Stock ${entityId || ''}`.trim() || 'Stock';
           // Sanitize rate (remove % or other symbols but keep decimal point)
           const rawRate = req.body.stock_rate || req.body.rate || req.body.trader_rate;
           let parsedRate = 0;
           if (rawRate !== undefined && rawRate !== null && String(rawRate).trim() !== '') {
             const cleaned = String(rawRate).replace(/[^0-9.]/g,'');
             parsedRate = parseFloat(cleaned);
             if (Number.isNaN(parsedRate)) parsedRate = 0;
           }
           const now = new Date();
           await Stock.create({
             username,
             amount: parsedAmount,
             stock_name: fallbackName || `Stock-${entityId || 'X'}-${now.getTime()}`,
             stock_type: source || 'stock',
             rate: parsedRate,
             profit: 0,
             status: 'pending',
             date: now,
           });
         } catch (e) {
           console.warn('captureFundingIntent: failed to create Stock row:', e && e.message ? e.message : e, { body: req.body });
         }
       }

       // If coming from crypto flow, persist a Crypto row (pending)
       if (source === 'crypto' && Crypto && typeof Crypto.create === 'function') {
         try {
          // console.log({username, parsedAmount, name, entityId, rate: parseFloat(req.body.trader_rate) || 0});
           await Crypto.create({
             username,
             amount: parsedAmount,
             crypto_name: name || `Plan ${entityId || ''}`.trim(),
             crypto_symbol: req.body.symbol || null,
             rate: parseFloat(req.body.crypto_rate) || 0,
             // rate/profit default to 0 in model; status defaults to 'pending'
             date: new Date(),
           });
         } catch (e) {
           console.warn('captureFundingIntent: failed to create Savings row:', e && e.message ? e.message : e);
         }
       }

       //If coming from roboTrader flow, persist a RoboTrader row (pending)
      if (source === 'roboTrader' && Robo && typeof Robo.create === 'function') {
         try {
           await Robo.create({
             username,
             amount: parsedAmount,
             robo_name: name || `Plan ${entityId || ''}`.trim(),
             rate: parseFloat(req.body.rp_rate) || 0,
             // rate/profit default to 0 in model; status defaults to 'pending'
             date: new Date(),
           });
         } catch (err) {
           console.error("captureFundingIntent error:", err && err.stack ? err.stack : err);
         }
      }

      return res.redirect("/member/account/payment");
    } catch (err) {
      console.error("captureFundingIntent error:", err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }


  }



  // GET /member/account/payment
  async function paymentPage(req, res) {
    try {
   
      const userId = req.session && req.session.userId;
      // Fetch user with associated data
      let user = await User.findByPk(userId);
      const username = user ? user.username : null;
      // console.log(username);

      const depositData = req.session.deposit || null;
      if (!depositData) {
        return res.redirect("/member/account/dashboard");
      }

      let paymentData = {};
      try {
        if (Payment && typeof Payment.findOne === "function") {
          const rows = await Payment.findAll();
          let payment = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
          ({paymentData} = payment);
          // console.log(payment);
          if (payment) {
            if (typeof payment.get === "function") paymentData = payment.get({ plain: true });
            else if (payment.dataValues) paymentData = payment.dataValues;
            else paymentData = payment;
          }
        }
      } catch (e) {
        console.warn("paymentPage: payment lookup failed:", e && e.message ? e.message : e);
      }

  // console.log("Rendering payment page with:", { username, depositData, paymentData });
  // console.log(paymentData[0]);
  const crypto_address = paymentData[0];
  const bank_address = paymentData[0];

      if( depositData.method == 'Bank Transfer')
      return res.render("member/pages/Payment/bankPayment.ejs", {
        // username,
        depositData,
        payment: bank_address,
        // page_name: "deposit",
      });

      if(depositData.method == 'Crypto'){

         if (
           depositData.currency === "btc" ||
           depositData.currency === "BTC" ||
           depositData.currency === "Btc"
         ) {
           return res.render("member/pages/Payment/cryptoPayment.ejs", {
             // username,
             depositData,
             currency: depositData.currency,
             crypto_address: crypto_address.btc,
             // page_name: "deposit",
           });
         }

        if(depositData.currency === "eth" || 
          depositData.currency === "ETH" || depositData.currency === "Eth" ){
       return res.render("member/pages/Payment/cryptoPayment.ejs", {
         // username,
         depositData,
         currency: depositData.currency,
         crypto_address: crypto_address.eth,
         // page_name: "deposit",
       });
      }
     
      if(depositData.currency === "usdt_erc20" || 
        depositData.currency === "USDT_ERC20" || depositData.currency === "Usdt_erc20" ){
        return res.render("member/pages/Payment/cryptoPaymentUSDT_ERC20.ejs", {
         // username,
         depositData,
         currency: depositData.currency,
         crypto_address: crypto_address.usdt_erc20,
         // page_name: "deposit",
       });
      }

      if(depositData.currency === "usdt_trc20" ||
         depositData.currency === "USDT_TRC20" || depositData.currency === "Usdt_trc20" ){
        return res.render("member/pages/Payment/cryptoPaymentUSDT_TRC20.ejs", {
          // username,
          depositData,
          currency: depositData.currency,
          crypto_address: crypto_address.usdt_trc20,
          // page_name: "deposit",
        });
      }
      if(depositData.currency === "ada" ||
         depositData.currency === "ADA" || depositData.currency === "Ada" ){
        return res.render("member/pages/Payment/cryptoPaymentADA.ejs", {
          // username,
          depositData,
          currency: depositData.currency,
          crypto_address: crypto_address.ada,
          // page_name: "deposit",
        });

    }
  } }catch (err) {
      console.error("paymentPage error:", err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  
  }
  // GET /member/account/deposit/resume/:depositId
  async function resumeDeposit(req, res) {
    try {
      const userId = req.session && req.session.userId;
      let user = await User.findByPk(userId);
      const username = user ? user.username : null;
      if (!username) return res.redirect('/auth/login');

      const { depositId } = req.params || {};
      if (!depositId || !Deposit || typeof Deposit.findByPk !== 'function') {
        return res.redirect('/member/account/dashboard');
      }
      const row = await Deposit.findByPk(depositId);
      if (!row || row.username !== username) {
        return res.redirect('/member/account/dashboard');
      }
      if (String(row.depositstatus).toLowerCase() !== 'pending') {
        return res.redirect('/member/account/dashboard');
      }

      // Restore a minimal deposit context for payment page
      req.session.deposit = {
        amount: Number(row.amount) || 0,
        currency: 'USD',
        method: row.depositmethod || 'Bank Transfer',
        source: null,
        entityId: null,
        memo: row.deposittransactionid,
        createdAt: Date.now(),
        depositId: row.id,
        depositTxId: row.deposittransactionid,
      };
      return res.redirect('/member/account/payment');
    } catch (err) {
      console.error('resumeDeposit error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  return {
    captureFundingIntent,
    paymentPage,
    resumeDeposit,
    // resumeFundingIntent,
    // resumeFundingEvent,
    // clearFundingIntent,
  };
}
