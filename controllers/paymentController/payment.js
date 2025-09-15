export default function paymentController({ User, Payment, CTrader, Savings, Deposit, Mortgage, Reit, Crypto, Stock, FundingEvent, Robo }) {
  // POST /member/account/deposit/start
  async function captureFundingIntent(req, res) {
    try {
      const userId = req.session && req.session.userId;
      const user = await User.findByPk(userId);
      const username = user ? user.username : null;
      if (!username) return res.redirect('/auth/login');

      const { amount, currency = 'USD', met, cry, source, entityId, memo, name, title, details, image, reit_rate } = req.body || {};
      const parsedAmount = Number(amount);
      const txId = `DP-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
      if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        const message = 'Please enter a valid deposit amount.';
        if (req.xhr || (req.headers['content-type'] || '').includes('application/json')) {
          return res.status(400).json({ success: false, message });
        }
        const back = req.get('referer') || '/member/account/dashboard';
        return res.redirect(back);
      }

      // Deposit row
      let depositRow = null;
      try {
        if (Deposit && typeof Deposit.create === 'function') {
          
          depositRow = await Deposit.create({
            username,
            amount: parsedAmount,
            depositmethod: met || 'Bank Transfer',
            depositdate: new Date().toISOString(),
            depositstatus: 'pending',
            deposittransactionid: txId,
            depositcurrency: cry || currency || null,
            depositmemo: source || null,
          });
        }
      } catch (e) { console.warn('captureFundingIntent: failed to create Deposit row:', e && e.message ? e.message : e); }

      // FundingEvent row
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
      } catch (e) { console.warn('captureFundingIntent: failed to create FundingEvent row:', e && e.message ? e.message : e); }

      // Session context
      req.session.deposit = {
        amount: parsedAmount,
        currency: cry,
        method: met || null,
        source: source || null,
        entityId: entityId || null,
        memo: memo || null,
        createdAt: Date.now(),
        depositId: depositRow ? depositRow.id : null,
        depositTxId: txId,
        eventId: eventRow ? eventRow.id : null,
      };

      // Source-specific rows
      if (source === 'copyTrader' && CTrader && typeof CTrader.create === 'function') {
        try { await CTrader.create({
          username,
          amount: parsedAmount,
          trader_name: name || `Trader ${entityId || ""}`.trim(),
          rate: parseFloat(req.body.trader_rate) || 0,
          date: new Date(),
          transactionid: txId,
        }); } catch (e) { console.warn('captureFundingIntent: failed to create CTrader row:', e.message || e); }
      }
      if (source === 'mortgage' && Mortgage && typeof Mortgage.create === 'function') {
        try { await Mortgage.create({ username, amount: parsedAmount, property_name: title || `Property ${entityId || ''}`.trim(), property_image: image || null, property_description: details || null, date: new Date().toLocaleDateString(), mortgage_id: entityId || null, status: 'pending', createdAt: new Date(), transactionid: txId }); } catch (e) { console.warn('captureFundingIntent: failed to create Mortgage row:', e.message || e); }
      }
      if (source === 'reit' && Reit && typeof Reit.create === 'function') {
        try { await Reit.create({ username, amount: parsedAmount, property_name: name || `Property ${entityId || ''}`.trim(), property_image: image || null, property_description: details || null, date: new Date().toLocaleDateString(), reit_id: entityId || null, rate: parseFloat(reit_rate) || 0, status: 'pending', createdAt: new Date(), transactionid: txId }); } catch (e) { console.warn('captureFundingIntent: failed to create Reit row:', e.message || e); }
      }
      if (source === 'savings' && Savings && typeof Savings.create === 'function') {
        try { await Savings.create({ username, amount: parsedAmount, savings_name: name || `Plan ${entityId || ''}`.trim(), rate: parseFloat(req.body.trader_rate) || 0, date: new Date(), transactionid: txId }); } catch (e) { console.warn('captureFundingIntent: failed to create Savings row:', e.message || e); }
      }
      const srcLower = (source || '').toLowerCase();
      if (srcLower && ['stock','stocks','etf'].includes(srcLower) && Stock && typeof Stock.create === 'function') {
        try {
          const fallbackName = name || title || `Stock ${entityId || ''}`.trim() || 'Stock';
          const rawRate = req.body.stock_rate || req.body.rate || req.body.trader_rate;
          let parsedRate = 0; if (rawRate !== undefined && rawRate !== null && String(rawRate).trim() !== '') { const cleaned = String(rawRate).replace(/[^0-9.]/g,''); parsedRate = parseFloat(cleaned); if (Number.isNaN(parsedRate)) parsedRate = 0; }
          const now = new Date();
          await Stock.create({ username, amount: parsedAmount, stock_name: fallbackName || `Stock-${entityId || 'X'}-${now.getTime()}`, stock_type: source || 'stock', rate: parsedRate, profit: 0, status: 'pending', date: now, transactionid: txId });
        } catch (e) { console.warn('captureFundingIntent: failed to create Stock row:', e.message || e); }
      }
      if (source === 'crypto' && Crypto && typeof Crypto.create === 'function') {
        try { await Crypto.create({ username, amount: parsedAmount, crypto_name: name || `Plan ${entityId || ''}`.trim(), crypto_symbol: req.body.symbol || null, rate: parseFloat(req.body.crypto_rate) || 0, date: new Date(), transactionid: txId }); } catch (e) { console.warn('captureFundingIntent: failed to create Crypto row:', e.message || e); }
      }
      if (source === 'roboTrader' && Robo && typeof Robo.create === 'function') {
        try { await Robo.create({ username, amount: parsedAmount, robo_name: name || `Plan ${entityId || ''}`.trim(), rate: parseFloat(req.body.rp_rate) || 0, date: new Date(), transactionid: txId }); } catch (e) { console.error('captureFundingIntent error:', e.stack || e); }
      }

      return res.redirect('/member/account/payment');
    } catch (err) {
      console.error('captureFundingIntent error:', err.stack || err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // GET /member/account/payment
  async function paymentPage(req, res) {
    try {
      const userId = req.session && req.session.userId;
      const user = await User.findByPk(userId);
      if (!user) return res.redirect('/auth/login');
      const depositData = req.session.deposit || null;
      if (!depositData) return res.redirect('/member/account/dashboard');

      let paymentData = {};
      try {
        if (Payment && typeof Payment.findOne === 'function') {
          const payment = await Payment.findOne();
          if (payment) {
            paymentData = typeof payment.get === 'function' ? payment.get({ plain: true }) : payment.dataValues ? payment.dataValues : payment;
          }
        }
      } catch (e) { console.warn('paymentPage: payment lookup failed:', e.message || e); }

      const bank_address = paymentData || {};
      const crypto_address = paymentData || {};

      if ((depositData.method || '').toLowerCase() === 'bank transfer') {
        return res.render('member/pages/Payment/bankPayment.ejs', { depositData, payment: bank_address });
      }

      if ((depositData.method || '').toLowerCase() === 'crypto') {
        const cur = (depositData.currency || '').toLowerCase();
        if (cur === 'btc') return res.render('member/pages/Payment/cryptoPayment.ejs', { depositData, currency: depositData.currency, crypto_address: crypto_address.btc || '' });
        if (cur === 'eth') return res.render('member/pages/Payment/cryptoPayment.ejs', { depositData, currency: depositData.currency, crypto_address: crypto_address.eth || '' });
        if (cur === 'usdt_erc20') return res.render('member/pages/Payment/cryptoPaymentUSDT_ERC20.ejs', { depositData, currency: depositData.currency, crypto_address: crypto_address.usdt_erc20 || '' });
        if (cur === 'usdt_trc20') return res.render('member/pages/Payment/cryptoPaymentUSDT_TRC20.ejs', { depositData, currency: depositData.currency, crypto_address: crypto_address.usdt_trc20 || '' });
        if (cur === 'ada') return res.render('member/pages/Payment/cryptoPaymentADA.ejs', { depositData, currency: depositData.currency, crypto_address: crypto_address.ada || '' });
      }

      return res.redirect('/member/account/dashboard');
    } catch (err) {
      console.error('paymentPage error:', err.stack || err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // GET /member/account/deposit/resume/:depositId
  async function resumeDeposit(req, res) {
    try {
      const userId = req.session && req.session.userId;
      const user = await User.findByPk(userId);
      if (!user) return res.redirect('/auth/login');
      const { depositId } = req.params || {};
      if (!depositId || !Deposit || typeof Deposit.findByPk !== 'function') return res.redirect('/member/account/dashboard');
      const row = await Deposit.findByPk(depositId);
      if (!row || row.username !== user.username) return res.redirect('/member/account/dashboard');
      if (String(row.depositstatus).toLowerCase() !== 'pending') return res.redirect('/member/account/dashboard');
      req.session.deposit = { amount: Number(row.amount) || 0, currency: 'USD', method: row.depositmethod || 'Bank Transfer', source: null, entityId: null, memo: row.deposittransactionid, createdAt: Date.now(), depositId: row.id, depositTxId: row.deposittransactionid };
      return res.redirect('/member/account/payment');
    } catch (err) {
      console.error('resumeDeposit error:', err.stack || err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  return { captureFundingIntent, paymentPage, resumeDeposit };
}
