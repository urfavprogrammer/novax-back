export default function roboController({ User, Robo }) {

  const roboData = [
    {
      id: 1,
      robo_name: "Cash-enhanced portfolio",
      details: [
        "You want added security in an inconsistent market",
        "20% Traders commission",
        "We set aside 30% of your portfolio in cash",
        "Earn 1.2% in daily interest on the cash buffer, credited weekly",
      ],
      rate: 1.2,
    },
    {
      id: 2,
      robo_name: "Market-focused portfolio",
      details: [
        "You want most of your money in the market",
        "30% Traders commission",
        "Nearly all your money's invested. With only about 2% held as cash",
        "Earn 1.4% in daily interest on the cash holdings, credited weekly",
      ],
      rate: 1.4,
    }
  ]

  async function roboTrader(req, res) {
   try{
      return res.render("member/pages/Robo_/Trades/robo.ejs", {
       
      });
    } catch (err) {
      console.error("Robo error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // async function viewRobo(req, res) {
  //   try {
  //     return res.render("member/pages/Robo_/Trades/fund_robo.ejs", {});
  //   } catch (err) {
  //     console.error("Stock error:", err && err.stack ? err.stack : err);
  //     return res
  //       .status(500)
  //       .json({ success: false, message: "Internal server error" });
  //   }
  // }
  async function fundRobo(req, res) {
     const roboId = req.params.id;
    const robo = roboData.find(r => r.id === parseInt(roboId));
    const rp = robo || roboData[0]; // Default to first robo if not found
    try {
      return res.render("member/pages/Robo_/Trades/fund_robo.ejs", { rp });

    } catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function roboHistory(req, res) {
    try {

      // const events = await Robo.getHistory(req.session.userId);
      const userId = req.session && req.session.userId;
      const user = await User.findByPk(userId);
      const username = user ? user.username : null;
      if (!username) return res.redirect("/auth/login");

      let events = [];
      try {
        if (Robo && typeof Robo.findAll === "function") {
          const rows = await Robo.findAll({
            where: { username },
            order: [["created_at", "DESC"]],
          });
          events = rows.map((r) =>
            typeof r.get === "function" ? r.get({ plain: true }) : r
          );
        }
      } catch (e) {
        console.warn(
          "roboHistory: failed to load Robo history:",
          e && e.message ? e.message : e
        );
      }
      return res.render("member/pages/Robo_/History/robo_history.ejs", { events });
    } catch (err) {
      console.error("Stock error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  

  return {
    roboTrader,
    fundRobo,
    roboHistory,
  };
}
