export default function adminController(models = {}) {
  const { User, Deposit, Withdraw, Asset, Referral, Admin, Payment } =
    models || {};

  // Middleware to require admin: prefer boolean flag on User (isAdmin), else fallback to username === ADMIN_USERNAME
  async function requireAdmin(req, res, next) {
    try {
      if (!req.session || !req.session.adminId) {
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res
            .status(401)
            .json({ success: false, message: "Access denied" });
        return res.redirect("/auth/admin/login");
      }

      if (!User)
        return res
          .status(403)
          .send("Admin guard not configured (no User model)");

      const isAdmin = await Admin.findOne({
        where: { admin_role: "admin" },
      }).catch(() => null);
      // const isAdmin = (user && (user.isAdmin === true || String(user.username).toLowerCase() === String(adminUsername).toLowerCase()));

      if (!isAdmin) {
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res
            .status(403)
            .json({ success: false, message: "Admin access required" });
        return res.status(403).send("Admin access required");
      }
      // attach admin user to req for handlers
      req.adminUser = isAdmin;
      return next();
    } catch (err) {
      console.error("requireAdmin error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

//   Admin DASHBOARD
  async function index(req, res) {
    try {
      // simple admin summary (counts)
      const summary = {};
      if (User) summary.users = await User.count().catch(() => 0);
      // Use simple counts instead of using `sequelize.fn` here — the `sequelize` instance
      // isn't available in this module, and the previous code caused a ReferenceError.
      // If you want filtered counts (e.g. only 'approved'), pass a where clause.
      if (Deposit)
        summary.approved_deposits = await Deposit.count({
          where: { depositstatus: "approved" },
        }).catch(() => 0);
      if (Withdraw)
        summary.approved_withdrawals = await Withdraw.count({
          where: { status: "approved" },
        }).catch(() => 0);
      if (Deposit)
        summary.pending_deposits = await Deposit.count({
          where: { depositstatus: "pending" },
        }).catch(() => 0);
      if (Withdraw)
        summary.pending_withdrawals = await Withdraw.count({
          where: { status: "pending" },
        }).catch(() => 0);
      if (Referral) summary.referrals = await Referral.count().catch(() => 0);
      if (Asset)
        summary.total_pendingdeposit = await Asset.count().catch(() => 0);

      // Render Users
      if (!User)
        return res
          .status(500)
          .json({ success: false, message: "User model not available" });
      const rows = await Deposit.findAll({
        // limit: 5,
        where: { depositstatus: "pending" },
        order: [
          ["depositdate", "DESC"],
          ["deposittransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["depositmethod", "DESC"],
          ["depositstatus", "DESC"],
        ],
      });
      
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));

      // render a minimal admin index page if view exists, else return JSON
      if (res.render) {
        return res.render("admin/adminView/index.ejs", {
          summary,
          pendingtrx: plain,
        });
      }
      return res.json({ success: true, summary });
    } catch (err) {
      console.error("Admin index error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List all users
  async function allUsers(req, res) {
    try {
      if (!User)
        return res
          .status(500)
          .json({ success: false, message: "User model not available" });
      const rows = await User.findAll({
        attributes: [
          "id",
          "fullname",
          "username",
          "email",
          "country",
          "phone_number",
            "referer",
            "isVerified",
            "avatarUrl",
          "created_at",
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("admin/adminView/adminPages/investors.ejs", {
          users: plain,
        });
      return res.json({ success: true, users: plain });
    } catch (err) {
      console.error(
        "Admin listUsers error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }


  async function listReferrals(req, res) {
    try {
      if (!Referral)
        return res
          .status(500)
          .json({ success: false, message: "Referral model not available" });
      const rows = await Referral.findAll();
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("admin/referrals.ejs", { referrals: plain });
      return res.json({ success: true, referrals: plain });
    } catch (err) {
      console.error(
        "Admin listReferrals error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List pending deposits
  async function allPendingDeposits(req, res) {
    try {
      if (!Deposit)
        return res
          .status(500)
          .json({ success: false, message: "Deposit model not available" });
      const rows = await Deposit.findAll({
        where: { depositstatus: "pending" },
        order: [
          ["created_at", "DESC"],
          ["deposittransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["depositmethod", "DESC"],
          ["depositstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("admin/adminView/adminPages/pendingDeposits.ejs", {
          deposits: plain,
          messages: req.flash(),
        });
      return res.json({ success: true, deposits: plain });
    } catch (err) {
      console.error(
        "Admin listDeposits error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List approved deposits
  async function allApprovedDeposits(req, res) {
    try {
      if (!Deposit)
        return res
          .status(500)
          .json({ success: false, message: "Deposit model not available" });
      const rows = await Deposit.findAll({
        where: { depositstatus: "approved" },
        order: [
          ["created_at", "DESC"],
          ["deposittransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["depositmethod", "DESC"],
          ["depositstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("admin/adminView/adminPages/approvedDeposits.ejs", {
          deposits: plain,
          messages: req.flash(),
        });
      return res.json({ success: true, deposits: plain });
    } catch (err) {
      console.error(
        "Admin listDeposits error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List Pending Withdrawals
  async function allPendingWithdrawals(req, res) {
    try {
      if (!Withdraw)
        return res
          .status(500)
          .json({ success: false, message: "Withdrawal model not available" });
      const rows = await Withdraw.findAll({
        where: { status: "pending" },
        order: [
          ["created_at", "DESC"],
          ["trade_id", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["wallet", "DESC"],
          ["address", "DESC"],
          ["status", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));

      if (res.render)
        return res.render("admin/adminView/adminPages/pendingWithdrawal.ejs", {
          withdrawals: plain,
        });
      return res.json({ success: true, withdrawals: plain });
    } catch (err) {
      console.error(
        "Admin listPendingWithdrawals error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  // list approved withdrawals
  async function allApprovedWithdrawals(req, res) {
    try {
      if (!Withdraw)
        return res
          .status(500)
          .json({ success: false, message: "Withdrawal model not available" });
      const rows = await Withdraw.findAll({
        where: { status: "approved" },
        order: [
          ["created_at", "DESC"],
          ["trade_id", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["wallet", "DESC"],
          ["address", "DESC"],
          ["status", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("admin/adminView/adminPages/approvedWithdrawals.ejs", {
          withdrawals: plain,
        });
      return res.json({ success: true, withdrawals: plain });
    } catch (err) {
      console.error(
        "Admin listWithdrawals error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //Edit account
  async function editUserAccount(req, res) {
    try {
      // const { id, username, email } = req.body;
      const rows = await User.findAll({
        attributes: [
          "id",
          "fullname",
          "username",
          "email",
          "country",
          "created_at",
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      res.render("admin/adminView/adminPages/editAccount.ejs", { users: plain });

    } catch (err) {
      console.error(
        "Admin editAccount error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function viewPaymentDetails(req, res) {
    try {
      if (!Payment)
        return res
          .status(500)
          .json({ success: false, message: "Payment model not available" });
      const rows = await Payment.findAll();
      const details = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      // console.log(details[0]);
      if (res.render)
        return res.render("admin/adminView/adminPages/viewPaymentDetails.ejs", {
          payments: details[0],
        });
      return res.json({
        success: true,
        message: "Payment details retrieved successfully",
      });
    } catch (err) {
      console.error(
        "Admin viewPaymentDetails error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function updateUserAccount(req, res) {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    const username = user["username"];
    // console.log(username);

    if (!Asset || typeof Asset.findOne !== "function") {
      console.error("updateUserAssets: Asset model is not available");
      return res
        .status(500)
        .json({ success: false, message: "Asset model not available" });
    }
    const rows = await Asset.findAll({ where: { username: String(username) } });
    const userAsset = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
    // console.log(userAsset);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.render("admin/adminView/adminPages/editForm.ejs", {
      user,
      userAsset: userAsset[0],
    });
  }

  async function paymentDetails(req, res) {
    try {
      if (res.render)
        return res.render("admin/adminView/adminPages/updatePaymentDetails.ejs");
      return res.json({ success: true, payment: plain });
    } catch (err) {
      console.error(
        "Admin paymentDetails error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function createCTrader(req, res) {  

    try {
      if (res.render)
        return res.render("admin/adminView/adminPages/createCTrader.ejs");
    } catch (err) {
      console.error(
        "Admin createCTrader error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
    async function createMortgage(req, res) {  

    try {
      if (res.render)
        return res.render("admin/adminView/adminPages/createMortgage.ejs");
    } catch (err) {
      console.error(
        "Admin createMortgage error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
    async function createCTrader(req, res) {  

    try {
      if (res.render)
        return res.render("admin/adminView/adminPages/createCTrader.ejs");
    } catch (err) {
      console.error(
        "Admin createCTrader error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function changeAdminPassword(req, res) {
    try {
      res.render("admin/adminView/adminPages/changePassword.ejs");
    } catch (err) {
      console.error(
        "Admin changePassword error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  return {
    requireAdmin,
    index,
    allUsers,
    listReferrals,
    allPendingDeposits,
    allApprovedDeposits,
    allPendingWithdrawals,
    allApprovedWithdrawals,
    editUserAccount,
    updateUserAccount,
    paymentDetails,
    viewPaymentDetails,
    changeAdminPassword,
    createCTrader,
  };
}
