export default function referralController({ User, Referral }) {
  async function referral(req, res) {
    try {
      const userId = req.session && req.session.userId;
      const user = await User.findByPk(userId);
      const username = user ? user.username : null;
      if (!username) return res.redirect("/auth/login");

      let events = [];
      try {
        if (Referral && typeof Referral.findAll === "function") {
          const rows = await Referral.findAll({
            where: { username },
            order: [["created_at", "DESC"]],
          });
          events = rows.map((r) =>
            typeof r.get === "function" ? r.get({ plain: true }) : r
          );
        }
      } catch (e) {
        console.warn(
          "ReferralHistory: failed to load Referral history:",
          e && e.message ? e.message : e
        );
      }
      return res.render("member/pages/Member_Activity/referrals.ejs", {
        // savings: savings,
      });
    } catch (err) {
      console.error("Referral error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  return {
    referral,
  };
}
