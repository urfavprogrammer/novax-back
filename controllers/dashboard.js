// Sample controller for dashboard page
module.exports = {

  dashboard: async (req, res, next, db) => {
    try {
      // Get user from session
      const sessionUser = req.session.user;
      if (!sessionUser || !sessionUser.id) {
        req.flash('info', 'Please log in to access your dashboard.');
        return res.redirect('/login');
      }

      // Fetch user details from database (assuming db.User exists)
      const user = await db.User.findByPk(sessionUser.id);
      if (!user) {
        req.flash('info', 'User not found.');
        return res.redirect('/login');
      }

      // Example: fetch user's assets or activities
      // const assets = await db.Asset.findAll({ where: { userId: user.id } });

      res.render('dashboard/dashb', {
        user,
        // assets, // Uncomment if you have Asset model
        message: req.flash('info')
      });
    } catch (err) {
      next(err);
    }
  }

};
