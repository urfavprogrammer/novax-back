
export default function etfController({ User, Stock }) {
  //List Stock Plans
  const stockPlans = [
    { id: 1, name: "NASDAQ:TSLA", rate: "0.02" },
    { id: 2, name: "NASDAQ:AAPL", rate: "0.33" },
    { id: 3, name: "NASDAQ:MSFT", rate: "0.21" },
    { id: 4, name: "NASDAQ:NVDA", rate: "0.16" },
    { id: 5, name: "NYSE:NU", rate: "0.22" },
    { id: 6, name: "NASDAQ:META", rate: "0.17" },
    { id: 7, name: "NASDAQ:AMD", rate: "0.25" },
    { id: 8, name: "NASDAQ:INTC", rate: "0.34" },
    { id: 9, name: "NASDAQ:SMCI", rate: "0.26" },
    { id: 10, name: "NASDAQ:GOOG", rate: "0.18" },
    { id: 11, name: "NASDAQ:AVGO", rate: "0.37" },
    { id: 12, name: "NASDAQ:NFLX", rate: "0.25" },
    { id: 13, name: "NYSE:CRM", rate: "0.14" },
    { id: 14, name: "NASDAQ:QCOM", rate: "0.16" },
    { id: 15, name: "NYSE:DELL", rate: "0.133" },
    { id: 16, name: "NYSE:LLY", rate: "0.212" },
    { id: 17, name: "NYSE:BAC", rate: "0.211" },
    { id: 18, name: "NASDAQ:MDB", rate: "0.24" },
    { id: 19, name: "NYSE:JPM", rate: "0.35" },
  ];
  const etfPlans = [
    { id: 1, name: "AMEX:SPY", rate: "0.24" },
    { id: 2, name: "NASDAQ:QQQ", rate: "0.013" },
    { id: 3, name: "AMEX:IWM", rate: "0.15" },
    { id: 4, name: "NASDAQ:TLT", rate: "0.022" },
    { id: 5, name: "AMEX:SOXL", rate: "0.16" },
    { id: 6, name: "NASDAQ:TQQQ", rate: "0.37" },
    { id: 7, name: "AMEX:VOO", rate: "0.24" },
    { id: 8, name: "AMEX:LQD", rate: "0.13" },
    { id: 9, name: "AMEX:HYG", rate: "0.35" },
    { id: 10, name: "NASDAQ:SMH", rate: "0.36" },
    { id: 11, name: "AMEX:IVV", rate: "0.27" },
    { id: 12, name: "AMEX:EWZ", rate: "0.14" },
    { id: 13, name: "AMEX:SOXS", rate: "0.103" },
    { id: 14, name: "AMEX:GLD", rate: "0.012" },
    { id: 15, name: "AMEX:XLF", rate: "0.036" },
    { id: 16, name: "AMEX:EFA", rate: "0.25" },
    { id: 17, name: "AMEX:XLE", rate: "0.34" },
    { id: 18, name: "AMEX:EEM", rate: "0.23" },
    { id: 19, name: "NASDAQ:SQQQ", rate: "0.25" },
    { id: 20, name: "AMEX:BIL", rate: "0.36" },
  ];

  async function etfTrade(req, res) {
    try {
      return res.render("member/pages/StockETF/Trades/fund_stock.ejs", {
        // savings: savings,
      });
    } catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function viewEtf(req, res) {
    try {
      return res.render("member/pages/StockETF/Trades/list_stock.ejs", {});
    } catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function fundStock(req, res) {
    try {
      const checkId = req.query.id;
      const checkType = req.query.type;

      console.log(checkId, checkType);

      if (checkType === "stock") {
      const stockName = stockPlans.find((m) => m.id === parseInt(checkId));
      return res.render("member/pages/StockETF/Trades/fundSETF.ejs", {
        details: stockName, title: "Stock"
      });
    } 
    } catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async function fundEtf(req, res) {
    try {
      const checkId = req.query.id;
      const checkType = req.query.type;

      console.log(checkId, checkType);

      if (checkType === "etf") {
        const etfName = etfPlans.find((m) => m.id === parseInt(checkId));
        return res.render("member/pages/StockETF/Trades/fundSETF.ejs", {
           details:etfName, title: "ETF"
        });
      }
    } catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function etfHistory(req, res) {
      try {
            const userId = req.session && req.session.userId;
            const user = await User.findByPk(userId);
            const username = user ? user.username : null;
            if (!username) return res.redirect('/auth/login');

            let events = [];
            try {
                if (Stock && typeof Stock.findAll === "function") {
                  const rows = await Stock.findAll({
                    where: { username},
                    order: [["created_at", "DESC"]],
                  });
                  events = rows.map((r) =>
                    typeof r.get === "function" ? r.get({ plain: true }) : r
                  );
                }
            } catch (e) {
                console.warn('StockHistory: failed to load Stock history:', e && e.message ? e.message : e);
            }
   
      return res.render("member/pages/StockETF/History/stock_history.ejs", {
        events,
      });
    }catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  return {
    etfTrade,
    viewEtf,
    fundStock,
    fundEtf,
    etfHistory,
  };
}
