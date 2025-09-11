import { name } from "ejs";

export default function supportController({ User, Contact }) {

 const currentDate = new Date();
 const options = { weekday: "long", month: "long", day: "numeric" };
 const useDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);

  async function support(req, res) {
    try {

      const userId = req.session.userId;
      if (!userId) {
        req.flash("error", "User not authenticated");
        return res.redirect("/member/activity/support");
      }
      const user = await User.findByPk(userId);
      console.log(user.username);
      let username = user.username;
      // username = user.username;
      const rows = await Contact.findAll({ where: { username } });
      const tickets = rows.map((r) => (r.get ? r.get({ plain: true }) : r));

      return res.render("member/pages/Member_Activity/support.ejs", {
        tickets,
        useDate
      });
    } catch (err) {
      console.error("Support error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function createSupportTicket(req, res) {
    try {
      const referer = req.get("Referer") || "/member/account/support";
      const { subject, message } = req.body;
      console.log(req.body.name)
      const userId = req.session.userId;
      if (!userId) {
        req.flash("error", "User not authenticated");
        return res.redirect(referer);
      }
      if (!subject || !message) {
        req.flash("error", "All fields are required");
        return res.redirect(referer);
      }
      const user = await User.findByPk(userId);
      let username = user.username;
       Contact.create({
        username,
        name: user.email,
        subject,
        message
      });
      req.flash("success", "Support ticket created successfully");
      return res.redirect(referer);
    } catch (err) {
      console.error("Create Support Ticket error:", err && err.stack ? err.stack : err);
      req.flash("error", "Internal server error");
      return res.redirect(referer);
    }
  }

  // async function viewSupportHistory(req, res) {
  //   try {
  //     const userId = req.session.userId;
  //     if (!userId) {
  //       req.flash("error", "User not authenticated");
  //       return res.redirect("/member/activity/support");
  //     } 
  //     const user = await User.findByPk(userId);
  //     username = user.username;
  //     const tickets = await Contact.findAll({ where: { username } });

  //     return res.render("member/pages/Member_Activity/support.ejs", {
  //       tickets,
  //     });
  //   } catch (err) {
  //     console.error("View Support History error:", err && err.stack ? err.stack : err);
  //     req.flash("error", "Internal server error");
  //     return res.redirect("/member/activity/support");
  //   }
  // }

  return {
    support,
    createSupportTicket,
    
  };
}
