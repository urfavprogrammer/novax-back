import reits from "../../../data/reitData.js";

export default function reitsController({ User, Reit }) {


  async function reitsListing(req, res) {
    try {
      return res.render("member/pages/Fractional_realEstate/Trades/listings.ejs", {
        reits,
      });
    } catch (err) {
      console.error("reits error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function viewReits(req, res) {
    try {
      const reitId = req.params.reitId;
      console.log("REIT ID:", reitId);
      const reit = reits.find((m) => m.id === parseInt(reitId));
      if (!reit) {
        return res
          .status(404)
          .json({ success: false, message: "REIT not found" });
      }

      return res.render(
        "member/pages/Fractional_realEstate/Trades/listing_details.ejs",
        {
          reit,
        }
      );
    } catch (err) {
      console.error("viewReits error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  // Funding Reits
    async function fundReits(req, res) {
      try {
        const rawAmount = req.body.amount;
        const amount = Number(rawAmount);
        // console.log("Funding Amount:", amount);

        const reitId = req.params.reitId;
        const reit = reits.find((m) => m.id === parseInt(reitId));
        if (!reit) {
          return res
            .status(404)
            .json({ success: false, message: "REIT not found" });
        }

        // Parse down payment like "$80,000" -> 80000
        const minDownPayment = Number(
          String(reit.price).replace(/[^0-9.]/g, "")
        );

        // Validate amount
        if (Number.isNaN(amount) || amount <= 0) {
          req.flash("error", "Please enter a valid amount.");
          return res.redirect(
            `/member/account/reits/listings_details/${reit.id}`
          );
        }

        // Enforce minimum down payment (reject amounts below minimum)
        if (amount < minDownPayment) {
          req.flash(
            "error",
            `Amount must be greater than or equal to the down payment of ${reit.price}`
          );
          return res.redirect(
            `/member/account/reits/listings_details/${reit.id}`
          );
        }
        return res.render("member/pages/Fractional_realEstate/Trades/fundReits.ejs", {
          reit,
          amount,
        });
      } catch (err) {
        console.error(
          "fundReits error:",
          err && err.stack ? err.stack : err
        );
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }



  async function reitsHistory(req, res) {
      try {
        const userId = req.session && req.session.userId;
        const user = await User.findByPk(userId);
        const username = user ? user.username : null;
        if (!username) return res.redirect("/auth/login");

        let events = [];
        try {
          if (Reit && typeof Reit.findAll === "function") {
            const rows = await Reit.findAll({
              where: { username },
              order: [["created_at", "DESC"]],
            });
            events = rows.map((r) =>
              typeof r.get === "function" ? r.get({ plain: true }) : r
            );
          }
        } catch (e) {
          console.warn(
            "reitsHistory: failed to load REITs history:",
            e && e.message ? e.message : e
          );
        }
        return res.render(
          "member/pages/Fractional_realEstate/History/listing_History.ejs",
          {events}
        );
      } catch (err) {
        console.error("Stock error:", err && err.stack ? err.stack : err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
  }


  return { reitsListing, viewReits, reitsHistory, fundReits };
}
