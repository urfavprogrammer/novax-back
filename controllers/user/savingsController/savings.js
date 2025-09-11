export default function savingsController({ Savings, User }) {
   
    //List Savings Plans
    const savingsPlans =[
        { id: 1, name: "Individual Retirement Account",  rate: "15%" },
        { id: 2, name: "Self Invested Personal Pension", rate: "4.25%" },
        { id: 3, name: "High Yield Savings Account", rate: "104%" },
        { id: 4, name: "Registered Retirement Savings Plan", rate: "13%" },
    ]

    async function savings(req, res) {
        try {
            return res.render("member/pages/Savings/Trades/savings_plan.ejs", {
                savings: savings,
            });
        } catch (err) {
            console.error("savings error:", err && err.stack ? err.stack : err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    async function fundSavings(req, res) {
        try {
            const savingsId = req.query.id;
            const savingsPlan = savingsPlans.find((m) => m.id === parseInt(savingsId));
            if (!savingsPlan) {
                return res.status(404).json({ success: false, message: "Savings Plan not found" });
            }
            return res.render("member/pages/Savings/Trades/fundSavings.ejs", { savings: savingsPlan });

        } catch (err) {
            console.error("fundSavings error:", err && err.stack ? err.stack : err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    // Savings History

    async function savingsHistory(req, res) {
        try {

            const userId = req.session && req.session.userId;
            const user = await User.findByPk(userId);
            const username = user ? user.username : null;
            if (!username) return res.redirect("/auth/login");

            let events = [];
            try {
              if (Savings && typeof Savings.findAll === "function") {
                const rows = await Savings.findAll({
                  where: { username },
                  order: [["created_at", "DESC"]],
                });
                events = rows.map((r) =>
                  typeof r.get === "function" ? r.get({ plain: true }) : r
                );
              }
            } catch (e) {
              console.warn(
                "SavingsHistory: failed to load Savings history:",
                e && e.message ? e.message : e
              );
            }


            return res.render("member/pages/Savings/History/savings_history.ejs", {
                savings: events,
            });
        } catch (err) {
            console.error("savings error:", err && err.stack ? err.stack : err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    return {
      savings,
      fundSavings,
      savingsHistory,
    };
}   