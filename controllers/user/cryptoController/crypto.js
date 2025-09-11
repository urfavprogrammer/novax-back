export default function cryptoController({ User, Crypto }) {

    const crypto = [
      { id: 1, name: "Bitcoin", symbol: "BINANCE:BTCUSD", rate: "0.8" },
      { id: 2, name: "Ethereum", symbol: "BINANCE:ETHUSD", rate: "0.12" },
      { id: 3, name: "Tether", symbol: "COINBASE:USDTUSD", rate: "0.23" },
      { id: 4, name: "BNB", symbol: "BINANCE:BNBUSD", rate: "0.25" },
      { id: 5, name: "Solana", symbol: "BINANCE:SOLUSD", rate: "0.34" },
      { id: 6, name: "Cardano", symbol: "BINANCE:XRPUSD", rate: "0.13" },
      { id: 7, name: "Dogecoin", symbol: "BINANCE:DOGEUSD", rate: "0.22" },
      { id: 8, name: "Tron", symbol: "BINANCE:TRXUSD", rate: "0.21" },
      { id: 9, name: "Cardano", symbol: "BINANCE:ADAUSD", rate: "0.5" },
      { id: 10, name: "Ton", symbol: "BINANCE:TONUSD", rate: "0.9" },
      { id: 11, name: "Avax", symbol: "BINANCE:AVAXUSD", rate: "0.15" },
      { id: 12, name: "Shib", symbol: "BINANCE:SHIBUSDT", rate: "0.18" },
      { id: 13, name: "Link", symbol: "BINANCE:LINKUSD", rate: "0.81" },
      { id: 14, name: "Dot", symbol: "BINANCE:DOTUSD", rate: "0.23" },
      { id: 15, name: "Not", symbol: "BINANCE:NOTUSD", rate: "0.52" },
      { id: 16, name: "Pepe", symbol: "BINANCE:PEPEUSD", rate: "0.277" },
      { id: 17, name: "Ltc", symbol: "BINANCE:LTCUSD", rate: "0.291" },
      { id: 18, name: "Uniswap", symbol: "BINANCE:UNIUSD", rate: "0.30" },
      { id: 19, name: "Pol", symbol: "BINANCE:POLUSD", rate: "0.40" },
      { id: 20, name: "Apt", symbol: "BINANCE:APTUSD", rate: "0.60" },
      { id: 21, name: "Sui", symbol: "BINANCE:SUIUSD", rate: "0.20" },
    ];


  async function cryptoTrade(req, res) {
    try {
      return res.render("member/pages/Crypto_Currency/Trades/buy_crypto.ejs", {
        // savings: savings,
      });
    } catch (err) {
      console.error("Crypto error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }


  async function viewCrypto(req, res) {
    try {
      return res.render("member/pages/Crypto_Currency/Trades/listings.ejs", {

      });
    } catch (err) {
      console.error("Crypto error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function fundCrypto(req, res) {
    try {
      const cryptoId = req.query.id;
      const cryptoName = crypto.find((m) => m.id === parseInt(cryptoId));
      return res.render("member/pages/Crypto_Currency/Trades/fundCrypto.ejs", {
        crypto: cryptoName,
      });
    } catch (err) {
      console.error("Crypto error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function cryptoHistory(req, res) {
    try {
        const userId = req.session && req.session.userId;
        const user = await User.findByPk(userId);
        const username = user ? user.username : null;
        if (!username) return res.redirect("/auth/login");

        let events = [];
        try {
          if (Crypto && typeof Crypto.findAll === "function") {
            const rows = await Crypto.findAll({
              where: { username },
              order: [["created_at", "DESC"]],
            });
            events = rows.map((r) =>
              typeof r.get === "function" ? r.get({ plain: true }) : r
            );
          }
        } catch (e) {
          console.warn(
            "CryptoHistory: failed to load Crypto history:",
            e && e.message ? e.message : e
          );
        }
      return res.render("member/pages/Crypto_Currency/History/crypto_history.ejs", {
        events,
      });
    } catch (err) {
      console.error("Crypto error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  

  return {
    cryptoTrade,
    viewCrypto,
    fundCrypto,
    cryptoHistory,
  };
}
