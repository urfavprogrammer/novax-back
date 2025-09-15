export default function adminKycPostHandlers({ User, KYC }) {

  // View KYC for a specific user (by user id -> username -> KYC row)
  async function viewKycRequests(req, res) {
    const { userId } = req.params; // route: /api/view_kyc/:id
    try {
      if (!userId) {
        return res.status(400).json({ success: false, message: 'Missing user id.' });
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      const kycRecord = await KYC.findOne({ where: { username: user.username } });
      if (!kycRecord) {
        return res.json({ success: true, data: null, message: 'No KYC uploaded for this user.' });
      }
      return res.json({ success: true, data: kycRecord });
    } catch (error) {
      console.error('Error fetching KYC record:', error);
      return res.status(500).json({ success: false, message: 'Server error fetching KYC.' });
    }
  }

  // Approve KYC
  async function approveKyc(req, res) {
    const { username } = req.params;
    console.log('Approving KYC for user:', username);
    try {
      const kycRecord = await KYC.findOne({ where: { username } });
      const userVerified = await User.findOne({ where: { username } });
      if (!kycRecord) {
        req.flash('info', 'KYC record not found.');
        return res.redirect('/novax-assets/admin/users');
      }
      await kycRecord.update({ status: 'approved' });
      console.log(kycRecord.status);
      if(kycRecord.status === 'approved') {
        await userVerified.update({ isVerified: true });
      }
      req.flash('success', 'KYC record approved successfully.');
      return res.redirect("/novax-assets/admin/users");
    } catch (error) {
      console.error('Error approving KYC:', error);
      req.flash('error', 'An error occurred while approving KYC.');
      return res.redirect('/novax-assets/admin/users');
    }
  }

  async function declineKyc(req, res) {
    const { username } = req.params;
    try {
      const kycRecord = await KYC.findOne({ where: { username } });
      if (!kycRecord) {
        req.flash("info", "KYC record not found.");
        return res.redirect("/novax-assets/admin/users");
      }
      await kycRecord.update({ status: "declined" });
      req.flash("success", "KYC record declined successfully.");
      return res.redirect("/novax-assets/admin/users");
    } catch (error) {
      console.error("Error declining KYC:", error);
      req.flash("error", "An error occurred while declining KYC.");
      return res.redirect("/novax-assets/admin/users");
    }
  }

  return {
    viewKycRequests,
    approveKyc,
    declineKyc,
  };
}