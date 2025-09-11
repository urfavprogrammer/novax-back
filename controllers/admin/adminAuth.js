import bcrypt from "bcrypt";

export default function adminAuthController({ Admin }) {
  //show admin Login
  function showAdminLogin(req, res) {
  // Pass flash errors or errors array to the view
  const errors = req.flash ? req.flash("error") : (res.locals.errors || []);
  return res.render("admin/adminView/adminlogin.ejs", { errors });
  }

  //show admin register route
  // Remove route before uploading
  function showAdminRegister(req, res) {
    try {
      // Get errors from flash or locals
      const errors = req.flash ? req.flash("error") : (res.locals.errors || []);
      const success = req.flash ? req.flash("success") : (res.locals.success || null);
      return res.render("admin/adminView/adminregister.ejs", { errors, success });
    } catch (err) {
      console.error(
        "Auth showRegister error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Admin registration
  async function adminRegister(req, res) {

    // Validate the input
    const { username, email, password, cpassword } = req.body;
    const errors = [];

    if (!username || !email || !password || !cpassword) {
      errors.push({ msg: "Please fill in all fields." });
    }

    if (password !== cpassword) {
      errors.push({ msg: "Passwords do not match." });
    }
 if (errors.length) {
   if (req.flash) {
     errors.forEach(e => req.flash("error", e.msg));
   }
   return res.render("admin/adminView/adminregister.ejs", { errors });
 }

    try {
      
      const existingUser = await Admin.findOne({
        where: { admin_email: email.toLowerCase() },
      });

      if (existingUser) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res.status(409).json({
            success: false,
            message: "User with this email already exists, Please Login",
          });
        }
        if (req.flash) {
          req.flash("error", "A user with this email already exists");
          req.flash("old", req.body || {});
            }
            return res.render("admin/adminView/adminregister.ejs", { errors });
      }
      const existingUserName = await Admin.findOne({
        where: { admin_username: username.toLowerCase() },
      });

      if (existingUserName) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res.status(409).json({
            success: false,
            message: "User with this username already exists",
          });
        }
        if (req.flash) {
          req.flash("error", "A user with this Username already exists");
          // persist the username so the form can be repopulated after redirect
          if (req.flash)
            req.flash("old", { username: username || "", email: email || "" });
        }
        return res.render("/auth/admin/register", { errors });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the admin user
      if (!Admin || typeof Admin.create !== "function") {
        console.error("Admin model is not configured for admin registration");
        return res.status(500).send("Admin model not configured");
      }

      const newAdmin = await Admin.create({
        admin_username: username.toLowerCase(),
        admin_email: email.toLowerCase(),
        admin_password: hashedPassword,
        admin_role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Set admin session after registration (auto-login)
      req.session.adminId = newAdmin.id;
      req.session.adminUsername = newAdmin.admin_username;
      req.session.adminRole = newAdmin.admin_role;

      if (
        req.xhr ||
        (req.headers.accept && req.headers.accept.includes("application/json"))
      ) {
        return res.status(201).json({
          success: true,
          message: "Admin registered successfully",
          user: newAdmin,
        });
      }
      // Redirect to admin dashboard after registration
      if (req.flash) {
        req.flash("success", "Account created successfully. Please log in.");
      }
      return res.redirect("/auth/admin/login");
    } catch (err) {
      try {
        // Mask sensitive fields before logging
        const safeBody = Object.assign({}, req.body || {});
        if (safeBody.password) safeBody.password = "[REDACTED]";
        if (safeBody.confirm_password) safeBody.confirm_password = "[REDACTED]";
        console.error(
          "Auth register error:",
          err && err.stack ? err.stack : err,
          "request body:",
          safeBody
        );
      } catch (logErr) {
        console.error("Error while logging register failure:", logErr);
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Admin login handler
  async function adminLogin(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Username and password are required",
          });
      }

      if (!Admin || typeof Admin.findOne !== "function") {
        console.error("Admin model not configured for admin login");
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(500)
            .json({
              success: false,
              message: "Server misconfiguration: Admin model not available",
            });
        }
        if (req.flash) req.flash("error", "Server configuration error");
        return res.redirect("/auth/admin/login");
      }

      const user = await Admin.findOne({
        where: { admin_username: username.toLowerCase() },
      });
      if (!user) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid username or password" });
        }
        // persist the username so the form can be repopulated after redirect
        if (req.flash) req.flash("old", { username: username || "" });
        req.flash("error", "Invalid username or password");
        return res.redirect("/auth/admin/login");
      }

      const isMatch = await bcrypt.compare(password, user.admin_password);
      if (!isMatch) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid email or password" });
        }
        // persist the email so the form can be repopulated after redirect
        if (req.flash) req.flash("old", { username: username || "" });
        req.flash("error", "Invalid email or password");
        return res.redirect("/auth/admin/login");
      }
  req.session.adminId = user.id;
  req.session.adminUsername = user.admin_username;
  req.session.adminRole = user.admin_role;
  return res.redirect("/novax-assets/admin/dashboard");
    } catch (err) {
      console.error("Auth login error:", err && err.stack ? err.stack : err);
      // DEV DEBUG: expose stack in response to assist debugging locally. Remove in production.
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err && err.stack ? err.stack : String(err),
        });
    }
  }

  // change admin password

  async function changeAdminPassword(req, res) {
    try {
      const { oldPassword, newPassword, confirm_password } = req.body;
      const userId = req.session.userId;
      console.log(userId);

      if (!oldPassword || !newPassword || !confirm_password) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Old password, new password, and confirm password are required",
          });
      }

      if (newPassword !== confirm_password) {
        return res
          .status(400)
          .json({
            success: false,
            message: "New password and confirm password do not match",
          });
      }

      const user = await Admin.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.admin_password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid old password" });
      }

      user.admin_password = await bcrypt.hash(newPassword, 10);
      await user.save();
      if (req.flash) {
        req.flash("success", "Password changed successfully");
      }
      return res.redirect("/admin/changepassword");
    } catch (err) {
      console.error(
        "Auth change password error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err && err.stack ? err.stack : String(err),
        });
    }
  }

  const adminLoginHandler = showAdminLogin
  const adminRegisterHandler = showAdminRegister;
  const adminRegisterPostHandler = adminRegister;
  const adminLoginPostHandler = adminLogin;

  return {
    adminLogin: adminLoginHandler,
    adminRegister: adminRegisterHandler,
    adminRegisterPost: adminRegisterPostHandler,
    adminLoginPost: adminLoginPostHandler,
    changeAdminPassword: changeAdminPassword,
  };
}
