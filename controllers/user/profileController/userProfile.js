export default function userProfile({ User, Withdraw, KYC }) {
  //        Edit Profile       //
  async function userEditProfile(req, res) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        req.flash("info", "Please log in to access this page.");
        return res.redirect("/auth/login");
      }
      const user = await User.findByPk(userId);
      if (!user) {
        req.flash("error", "User not found.");

        return res.redirect("/auth/login");
      }
      res.render("member/pages/profile/edit_profile.ejs", { user });
    } catch (err) {
      console.error(
        "userEditProfile error:",
        err && err.stack ? err.stack : err
      );
      req.flash("error", "An error occurred while fetching user profile.");
      return res.redirect("/auth/login");
    }
  }

  //        Check KYC Status       //
// *******************************************************//

  async function checkKyc(req, res) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        req.flash("info", "Please log in to access this page.");
        return res.redirect("/auth/login");
      }
      const user = await User.findByPk(userId);
      const kyc = await KYC.findOne({ where: { username: user.username } });
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/auth/login");
      }
      res.render("member/pages/profile/check_kyc.ejs", { user, kyc });
    } catch (err) {
      console.error("checkKyc error:", err && err.stack ? err.stack : err);
      req.flash("error", "An error occurred while checking KYC status.");
      return res.redirect("/auth/login");
    }
  }


  //       Change Password       //
  // *******************************************************//

  async function changePassword(req, res) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        req.flash("info", "Please log in to access this page.");
        return res.redirect("/auth/login");
      }
      const user = await User.findByPk(userId);
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/auth/login");
      }
      res.render("member/pages/profile/change_password.ejs", { user });
    } catch (err) {
      console.error(
        "changePassword error:",
        err && err.stack ? err.stack : err
      );
      req.flash("error", "An error occurred while fetching user profile.");
      return res.redirect("/auth/login");
    }
  }

  //  Change Avatar Function //
  // *******************************************************//
    async function uploadAvatarHandler(req, res) {
      try {
          const userId = req.session.userId;
          if (!userId) {
            req.flash("info", "Please log in to access this page.");
            return res.redirect("/auth/login");
          }
          const user = await User.findByPk(userId);

        //create the uploads directory if it doesn't exist
        const fs = await import("fs");
        if (!fs.existsSync("./uploads/avatars")) {
          fs.mkdirSync("./uploads/avatars", { recursive: true });
        }

        if (!req.file) {
          req.flash("error", "No file uploaded");
          return res.redirect("/profile");
        }
        const filename =
          req.file.filename || (req.file.path && req.file.path.split(/[\\/]/).pop());
        const newAvatarUrl = "/uploads/avatars/" + filename; // Ensure username is available
        const username = user.username;
        await User.update({ avatarUrl: newAvatarUrl }, { where: { username } });
        req.flash("success", "Avatar updated successfully");
        req.session.avatarUrl = newAvatarUrl;
        res.json({ success: true, message: "Avatar updated successfully", avatarUrl: newAvatarUrl });
      } catch (err) {
        console.error(
          "Avatar upload error:",
          err && err.stack ? err.stack : err
        );
        req.flash("error", "Internal server error");
        res.redirect("/account/user/changeavatar");
      }
    };

    // Edit User Account Info Function //
  // *******************************************************//
  async function updateProfile(req, res) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        req.flash("info", "Please log in to access this page.");
        return res.redirect("/auth/login");
      }
      const user = await User.findByPk(userId);
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/auth/login");
      }

      const { name, phone, country, address, wallet } = req.body;

      // console.log(req.body);

      await User.update(
        { fullname: name, phone_number: phone, country },
        { where: { username: user.username } }
      );
      // await Withdraw.update(
      //   { wallet, address },
      //   { where: { username: user.username } }
      // );
      req.flash("success", "Profile updated successfully");
      res.redirect("/member/account/edit_profile");
    } catch (err) {
      console.error("updateProfile error:", err && err.stack ? err.stack : err);
      req.flash("error", "An error occurred while updating profile.");
      res.redirect("/auth/login");
    }
  }

  // Upload KYC DATA Function //
  // *******************************************************//
  async function uploadKycData(req, res) {
    const date = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      const userId = req.session.userId;
      if (!userId) {
        req.flash("info", "Please log in to access this page.");
        return res.redirect("/auth/login");
      }

      const user = await User.findByPk(userId);
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/auth/login");
      }

      // Normalize incoming files (supports multer.single/array/fields)
      let files = [];
      if (Array.isArray(req.files)) {
        files = req.files;
      } else if (req.files && typeof req.files === "object") {
        files = Object.values(req.files).flat();
      } else if (req.file) {
        files = [req.file];
      }

      if (!files.length) {
        req.flash("error", "No files uploaded.");
        return res.redirect("/profile");
      }

      // Build public paths array and sanitize filenames
      const path = await import("path");
      const savedPaths = [];
      for (const file of files) {
        const original = (file.originalname || "file")
          .toString()
          .replace(/[^\w.\-]/g, "_");
        const filename = file.filename || `${Date.now()}-${original}`;
        // If multer used memoryStorage, write file.buffer to disk here (optional).
        // Assume multer diskStorage saved the file and file.path or file.filename is present.
        savedPaths.push(`/uploads/kyc/${filename}`);
      }

      // Prepare payload for KYC model - ensure column names match your model/table
      const payload = {
        username: user.username,
        first: savedPaths[0] || null,
        second: savedPaths[1] || null,
        third: savedPaths[2] || null,
        fourth: savedPaths[3] || null,
        date: date.toLocaleDateString(undefined, options),
      };

      // If a KYC exists for this username, update it; otherwise create new
      let created;
      const existing = await KYC.findOne({ where: { username: user.username } });
      try {
        if (existing) {
          await KYC.update(payload, { where: { username: user.username } });
          created = await KYC.findOne({ where: { username: user.username } });
        } else {
          created = await KYC.create(payload);
        }
      } catch (dbErr) {
        console.error("KYC create/update failed:", {
          message: dbErr.message,
          errors: dbErr.errors || null,
          parent: dbErr.parent || dbErr,
        });
        req.flash("error", "Database error while saving KYC. Contact admin.");
        return res.status(500).json({ success: false, message: "Database error while saving KYC." });
      }

      // update user flag
      await User.update(
        { kyc_upload: "Pending" },
        { where: { username: user.username } }
      );

      // fetch plain object for view
      const row = await KYC.findOne({ where: { username: user.username } });
      const kyc = row ? row.get({ plain: true }) : null;

      
      req.flash("success", "KYC documents uploaded successfully.");
      return res.json({
        success: true,
        message: "KYC documents uploaded successfully.",
        kyc
      });
    } catch (err) {
      console.error("KYC upload error:", err && err.stack ? err.stack : err);
      req.flash("error", "An error occurred while uploading KYC documents.");
      return res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while uploading KYC documents.",
        });
    }
  }








  return { userEditProfile, changePassword, checkKyc, uploadAvatarHandler, updateProfile, uploadKycData  };
}

