export default function stakeController({ Savings }) {


  async function stakeCrypto(req, res) {
    try {
      return res.render("member/pages/Stakes/stakes.ejs", {
        // savings: savings,
      });
    } catch (err) {
      console.error("Crypto error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  return {
    stakeCrypto,
    };
}