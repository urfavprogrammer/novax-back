import Mortgages from "../../../data/mortgageData.js";
export default function mortgage({ Mortgage, User }) {
  async function mortgage(req, res) {
    try {
      return res.render("member/pages/Mortgage/Trades/property.ejs", {
        Mortgages,
      });
    } catch (err) {
      console.error("mortgage error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function viewMortgage(req, res) {
    try {
      const mortgageId = req.params.mortgageId;
      console.log("Mortgage ID:", mortgageId);
      const mortgage = Mortgages.find((m) => m.id === parseInt(mortgageId));
      if (!mortgage) {
        return res
          .status(404)
          .json({ success: false, message: "Mortgage not found" });
      }

      return res.render("member/pages/Mortgage/Trades/property_details.ejs", {
        mortgage: mortgage,
      });
    } catch (err) {
      console.error("viewMortgage error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function fundMortgage(req, res) {
    
    try {
  const rawAmount = req.body.amount;
  const amount = Number(rawAmount);
  // console.log("Funding Amount:", amount);

      const mortgageId = req.params.mortgageId;
      const mortgage = Mortgages.find((m) => m.id === parseInt(mortgageId));
      if (!mortgage) {
        return res
          .status(404)
          .json({ success: false, message: "Mortgage not found" });
      }

      // Parse down payment like "$80,000" -> 80000
      const minDownPayment = Number(String(mortgage.down_payment).replace(/[^0-9.]/g, ""));

      // Validate amount
      if (Number.isNaN(amount) || amount <= 0) {
        req.flash("error", "Please enter a valid amount.");
        return res.redirect(`/member/account/property/mortgage/${mortgage.id}`);
      }

      // Enforce minimum down payment (reject amounts below minimum)
      if (amount < minDownPayment) {
        req.flash(
          "error",
          `Amount must be greater than or equal to the down payment of ${mortgage.down_payment}`
        );
        return res.redirect(`/member/account/property/mortgage/${mortgage.id}`);
      }
      return res.render("member/pages/Mortgage/Trades/fundMortgage.ejs", {
        mortgage, amount
      });
    } catch (err) {
      console.error("fundMortgage error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function morgageHistory(req, res) {
    try {
      const userId = req.session && req.session.userId;
      const user = await User.findByPk(userId);
      const username = user ? user.username : null;
      if (!username) return res.redirect("/auth/login");

      let events = [];
      try {
        if (Mortgage && typeof Mortgage.findAll === "function") {
          const rows = await Mortgage.findAll({
            where: { username },
            order: [["created_at", "DESC"]],
          });
          events = rows.map((r) =>
            typeof r.get === "function" ? r.get({ plain: true }) : r
          );
        }
      } catch (e) {
        console.warn(
          "MortgageHistory: failed to load Mortgage history:",
          e && e.message ? e.message : e
        );
      }
      // console.log("Mortgage Events:", events);
      return res.render(
        "member/pages/Mortgage/History/mortgage_history.ejs",
        {events}
      );
    } catch (err) {
      console.error(
        "morgageHistory error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  return { mortgage, viewMortgage, fundMortgage, morgageHistory };
}
