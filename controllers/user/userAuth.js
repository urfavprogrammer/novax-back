// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt';
import {Op} from 'sequelize';
//  const User = require('../../models'); // Sequelize instance for DB access

export default function userAuth({User, Asset}) {
  function Login(req, res) {
    res.render("user/login.ejs", { message: req.flash("info") });
  }

  function userRegister(req, res) {
    res.render("user/register.ejs", { message: req.flash("info") });
  }

    //Register User
  async function register(req, res) {
    try {
      const {
        fullname,
        username,
        email,
        country,
        phone,
        referral,
        password,
        cpassword,
      } = req.body;
      // Basic validation
      const errors = [];
      if (
        !fullname ||
        !username ||
        !email ||
        !country ||
        !phone ||
        !password ||
        !cpassword
      ) {
        errors.push({ msg: "All fields are required." });
      }
      if (password !== cpassword) {
        errors.push({ msg: "Passwords do not match." });
      }
      if (errors.length) {
        console.log(errors);
        return res.render("user/register.ejs", { errors });
      }
      // Check if user exists
      try {
        console.log(
          "DEBUG: Checking for existing user with username:",
          username
        );
        const existingUser = await User.findOne({ where: { username } });
        console.log(
          "DEBUG: Result of User.findOne for username:",
          existingUser
        );
        if (existingUser) {
          errors.push({ msg: "Username already exists." });
          return res.render("user/register.ejs", { errors });
        }
      } catch (err) {
        console.error(
          "Auth register error:",
          err && err.stack ? err.stack : err
        );
        return res.render("user/register.ejs", {
          errors: [{ msg: "Registration failed. Please try again." }],
        });
      }

      //check if email exists
      try {
        console.log("DEBUG: Checking for existing user with email:", email);
        const existingEmail = await User.findOne({ where: { email } });
        console.log("DEBUG: Result of User.findOne for email:", existingEmail);
        if (existingEmail) {
          errors.push({ msg: "Email already registered." });
          return res.render("user/register.ejs", { errors });
        }
      } catch (err) {
        console.error(
          "Auth register error:",
          err && err.stack ? err.stack : err
        );
        return res.render("user/register.ejs", {
          errors: [{ msg: "Registration failed. Please try again." }],
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create user
      await User.create({
        fullname,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        country,
        phone_number: phone,
        referer: referral,
        password: hashedPassword,
        avatarUrl: "/uploads/avatars/default.png",
        userloginOnce: false,
        isVerified: false,
      });
      await Asset.create({
        username: username.toLowerCase(),
        total_balance: 0,
        profit: 0,
        trade_bonus: 0,
        referal_bonus: 0,
        total_won: 0,
        total_loss: 0,
        total_deposit: 0,
        total_withdrawal: 0,
        total_pendingdeposit: 0,
        total_pendingwithdrawal: 0,
        investment_amount: 0,
        investment_plan: null,
        countingDays: 0,
        investment_status: null,
        investment_date: null
      });
      req.flash(
        "success",
        "Account created successfully! Login with your credentials."
      );
      res.redirect("/auth/login");
    } catch (err) {
      console.log(req.body);
      console.error("Auth register error:", err && err.stack ? err.stack : err);
      res.render("user/register.ejs", {
        errors: [{ msg: "Registration failed. Please try again." }],
      });
    }
  }

  //login User
  async function userLogin(req, res) {
    try {
      const { username,email, password } = req.body;
      // Basic validation
      const errors = [];
      if (!username || !password) {
        errors.push({ msg: "All fields are required." });
      }
      if (errors.length) {
        console.log(errors);
        return res.render("user/login.ejs", { errors });
      }
      // Check if username or email exists
      const user = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });

      if (!user && !email) {
        errors.push({ msg: "Incorrect Username or Email!." });
        return res.render("user/login.ejs", { errors });
      }
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errors.push({ msg: "Incorrect Password!." });
        return res.render("user/login.ejs", { errors });
      }
      if(user && isMatch) {
        // Set user session
        req.session.userId = user.id;
        req.flash("success", "Login successful!");
        res.redirect("/member/account/dashboard");
      }

    } catch (err) {
      console.error("Auth login error:", err && err.stack ? err.stack : err);
      res.render("user/login.ejs", {
        errors: [{ msg: "Login failed. Please try again." }],
      });
    }
  }

  // Middleware to require authentication
  function requireAuth(req, res, next) {
    try {
      // Allow access if ?newuser=1 is present in the URL
      if (req.query.newuser === "1") {
        return next();
      }
      if (!req.session || !req.session.userId) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(401)
            .json({ success: false, message: "Access denied. Please log in." });
        }
        return res.redirect("/auth/login");
      }
      return next();
    } catch (err) {
      console.error(
        "Auth requireAuth error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  async function changePassword(req, res) {
    try {
      const userId = req.session.userId;
      const username = (await User.findByPk(userId)).username;
      const { oldpass, pass, cpass } = req.body;

      // if (!oldpass || !pass || !cpass) {
      //   req.flash("error", "All fields are required");
      //   return res.redirect("/member/account/change_password");
      // };
      if (pass != cpass) {  
        req.flash("error", "New password and confirm password do not match");

        return res.json({ success: false, message: 'New password and confirm password do not match' });
      }
      const currentPassword = oldpass;
      const newPassword = pass;

      if (!userId) {
        req.flash("error", "User not authenticated");
        return res.redirect("/member/account/change_password");
      }

      // Validate and change password logic here
      const user = await User.findOne({ where: { username: username } });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        req.flash("error", "Use a Different Password");
        return res.status(401).json({ success: false, message: "Use a Different Password" });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      req.flash("success", "Password changed successfully");
      return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
      console.error(
        "Auth changePassword error:",
        err && err.stack ? err.stack : err
      );
      req.flash("error", "Internal server error");
      return res.status(500)
          .json({ success: false, message: "Internal server error" });
    }
  }

  function logout(req, res) {
    try {
      if (!req.session) {
        return res.redirect("/auth/login");
      }
      req.session.destroy((err) => {
        if (err) {
          console.error(
            "Error destroying session during logout:",
            err && err.stack ? err.stack : err
          );
          return res
            .status(500)
            .json({ success: false, message: "Could not log out" });
        }
        res.clearCookie("connect.sid", { path: "/" });
        return res.redirect("/auth/login");
      });
    } catch (err) {
      console.error("Auth logout error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }




  return {
    Login,
    userRegister,
    register,
    requireAuth,
    userLogin,
    changePassword,
    logout
  };
}
