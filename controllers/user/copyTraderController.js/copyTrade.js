import cTraders from "../../../data/copyTraderData.js";

export default function copyTraders({ CTrader, User, FundingEvent }) {

        const Traders = cTraders;

    async function copyTrade(req, res) {
        try {
           return res.render("member/pages/copyTrading/Trades/copyTrader.ejs", { traders: Traders });

        } catch (err) {
            console.error("copyTrade error:", err && err.stack ? err.stack : err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }

    };

    async function viewTrader(req, res) {
        try {
            const traderId = req.params.traderId;
            console.log("Trader ID:", traderId);
            const trader = Traders.find(t => t.id === parseInt(traderId));
            if (!trader) {
                return res.status(404).json({ success: false, message: "Trader not found" });
            }

            return res.render("member/pages/copyTrading/Trades/copyTrade.ejs", { trader });

        } catch (err) {
            console.error("copyTraderDetails error:", err && err.stack ? err.stack : err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    };
    async function fundTrader(req, res) {
        try {
            const traderId = req.params.traderId; 
            const trader = Traders.find(t => t.id === parseInt(traderId));
            if (!trader) {
                return res.status(404).json({ success: false, message: "Trader not found" });
            }
            return res.render("member/pages/copyTrading/Trades/fundTrader.ejs", { trader });

        } catch (err) {
            console.error("fundTrader error:", err && err.stack ? err.stack : err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    async function copyTraderHistory(req, res) {
        try {
            const userId = req.session && req.session.userId;
            const user = await User.findByPk(userId);
            const username = user ? user.username : null;
            if (!username) return res.redirect('/auth/login');

            let events = [];
            try {
                if (CTrader && typeof CTrader.findAll === "function") {
                  const rows = await CTrader.findAll({
                    where: { username},
                    order: [["created_at", "DESC"]],
                  });
                  events = rows.map((r) =>
                    typeof r.get === "function" ? r.get({ plain: true }) : r
                  );
                }
            } catch (e) {
                console.warn('copyTraderHistory: failed to load CTrading history:', e && e.message ? e.message : e);
            }
            // console.log("Copy Trader Events:", events);

            return res.render("member/pages/copyTrading/History/cptrader_history.ejs", { events });

        } catch (err) {
            console.error("copyTraderHistory error:", err && err.stack ? err.stack : err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };


return { copyTrade, viewTrader, copyTraderHistory, fundTrader };
}