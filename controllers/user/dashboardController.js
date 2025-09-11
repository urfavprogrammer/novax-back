export default function userDashboardController({ User, Asset, Crypto, CTrader, Savings, Mortgage, Reit, Robo, Stock, Withdraw }) {

  async function dashboard(req, res) {

    try {
      // fetch logged-in user id from session
      const userId = req.session && req.session.userId;
      // console.log("DEBUG userId from session:", userId);
      if (!userId) return res.redirect("/auth/login");
      // fetch user and include associated asset (association configured in models/index.js)
      let user = null;
      if (User) {
        // console.log("DEBUG about to call User.findByPk with userId:", userId);
        user = await User.findByPk(userId, {
          attributes: [
            "id",
            "fullname",
            "username",
            "email",
            "country",
            "phone_number",
            "referer",
            "avatarUrl",
            "isVerified"
          ],
        });
        // console.log("DEBUG user found:", user);
        if (user) {
          // console.log("DEBUG user username:", user.username);
          // Fetch asset separately
          let assetRecord = await Asset.findOne({
            where: { username: user.username },
          });
          // console.log("DEBUG asset found:", assetRecord);
          if (!assetRecord) {
            console.log("DEBUG creating asset for user");
            assetRecord = await Asset.create({
              username: user.username,
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
              investment_date: null,
            });
          }
          user.asset = assetRecord; // Manually assign
        }
      }

      if (!user) {
        // invalid session user, clear session and redirect
        if (req.session) req.session.destroy?.(() => {});
        return res.redirect("/auth/login");
      }

      // Fetch copytrading data
      let copytrading = [];
      let copytradingCount = 0;

      if (CTrader) {
        console.log("DEBUG CTrader model available");
        try {
          const copytradingRows = await CTrader.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          copytrading = copytradingRows.map((r) =>
            r.get ? r.get({ plain: true }) : r
          );

          // Count total number of copytrading for the user
          copytradingCount = await CTrader.count({
            where: { username: user.username },
          });
          console.log("DEBUG copytradingCount:", copytradingCount);
        } catch (err) {
          console.error("DEBUG Error with CTrader:", err.message);
        }
      } else {
        console.log("DEBUG CTrader model not available");
      }

      // Fetch crypto data
      let crypto = [];
      let cryptoCount = 0;

      if (Crypto) {
        console.log("DEBUG Crypto model available");
        try {
          const cryptoRows = await Crypto.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          crypto = cryptoRows.map((r) => (r.get ? r.get({ plain: true }) : r));

          // Count total number of crypto for the user
          cryptoCount = await Crypto.count({
            where: { username: user.username },
          });
          console.log("DEBUG cryptoCount:", cryptoCount);
        } catch (err) {
          console.error("DEBUG Error with Crypto:", err.message);
        }
      } else {
        console.log("DEBUG Crypto model not available");
      }

      //Fetch savings data
      let savings = [];
      let savingsCount = 0;

      if (Savings) {
        console.log("DEBUG Savings model available");
        try {
          const savingsRows = await Savings.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          savings = savingsRows.map((r) => (r.get ? r.get({ plain: true }) : r));

          // Count total number of savings for the user
          savingsCount = await Savings.count({
            where: { username: user.username },
          });
          // console.log("DEBUG savingsCount:", savingsCount);
        } catch (err) {
          console.error("DEBUG Error with Savings:", err.message);
        }
      } else {
        console.log("DEBUG Savings model not available");
      }

      // Stock data
      let stocks = [];
      let stocksCount = 0;

      if (Stock) {
        // console.log("DEBUG Stock model available");
        try {
          const stocksRows = await Stock.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          stocks = stocksRows.map((r) => (r.get ? r.get({ plain: true }) : r));

          // Count total number of stocks for the user
          stocksCount = await Stock.count({
            where: { username: user.username },
          });
          // console.log("DEBUG stocksCount:", stocksCount);
        } catch (err) {
          console.error("DEBUG Error with Stocks:", err.message);
        }
      } else {
        console.log("DEBUG Stocks model not available");
      }

      // Robo data
      let robo = [];
      let roboCount = 0;

      if (Robo) {
        console.log("DEBUG Robo model available");
        try {
          const roboRows = await Robo.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          robo = roboRows.map((r) => (r.get ? r.get({ plain: true }) : r));

          // Count total number of robo for the user
          roboCount = await Robo.count({
            where: { username: user.username },
          });
          console.log("DEBUG roboCount:", roboCount);
        } catch (err) {
          console.error("DEBUG Error with Robo:", err.message);
        }
      } else {
        console.log("DEBUG Robo model not available");
      }

      // Reits data
      let reits = [];
      let reitsCount = 0;
      if (Reit) {
        console.log("DEBUG Reit model available");
        try {
          const reitsRows = await Reit.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          reits = reitsRows.map((r) => (r.get ? r.get({ plain: true }) : r));

          // Count total number of reits for the user
          reitsCount = await Reit.count({
            where: { username: user.username },
          });
          // console.log("DEBUG reitsCount:", reitsCount);
        } catch (err) {
          console.error("DEBUG Error with Reits:", err.message);
        }
      } else {
        console.log("DEBUG Reits model not available");
      }

      // Mortgage data
      let mortgage = [];
      let mortgageCount = 0;
      if (Mortgage) {
        console.log("DEBUG Mortgage model available");
        try {
          const mortgageRows = await Mortgage.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          mortgage = mortgageRows.map((r) => (r.get ? r.get({ plain: true }) : r));

          // Count total number of mortgage for the user
          mortgageCount = await Mortgage.count({
            where: { username: user.username },
          });
          console.log("DEBUG mortgageCount:", mortgageCount);
        } catch (err) {
          console.error("DEBUG Error with Mortgage:", err.message);
        }
      } else {
        console.log("DEBUG Mortgage model not available");
      }

      //withdraw data 
      let withdraw = [];
      let withdrawCount = 0;

      if (Withdraw) {
        console.log("DEBUG Withdraw model available");
        try {
          const withdrawRows = await Withdraw.findAll({
            where: { username: user.username },
            order: [["created_at", "DESC"]],
          });
          withdraw = withdrawRows.map((r) =>
            r.get ? r.get({ plain: true }) : r
          );

          // Count total number of withdraw for the user
          withdrawCount = await Withdraw.count({
            where: { username: user.username },
          });
          console.log("DEBUG withdrawCount:", withdrawCount);
        } catch (err) {
          console.error("DEBUG Error with Withdraw:", err.message);
        }
      } else {
        console.log("DEBUG Withdraw model not available");
      }




      // Debug: log user and asset
      // console.log("DEBUG user:", user);
      if (user && user.asset) {
        // console.log("DEBUG user.asset:", user.asset);
      } else {
        console.log("DEBUG user.asset is undefined or null");
      }
      // Render dashboard view with user and crypto data
      return res.render("member/pages/Dashboard/index.ejs", {
        user,
        asset: user.asset || null,
        crypto,
        cryptoCount,
        copytrading,
        copytradingCount,
        savings,
        savingsCount,
        stocks,
        stocksCount,
        robo,
        roboCount,
        reits,
        reitsCount,
        mortgage,
        mortgageCount,
        withdraw,
        withdrawCount
        // add other data as needed
      });
    } catch (err) {
      console.error("Dashboard index error:", err && err.stack ? err.stack : err);
      res.render("member/pages/Dashboard/index.ejs", {
        errors: [{ msg: "Failed to load dashboard. Please try again." }],
        copytradingCount: 0,
        cryptoCount: 0
      });
    }
  };

  // New overviewPage controller

        async function overviewPage(req, res) {

          const {name} = req.query;
           let userId = req.session.userId; // Get user ID from session

           // Fetch user with associated data
           let user = await User.findByPk(userId, {
             include: [
               { model: Asset, as: "asset" }
             ],
           });

          //  console.log(user.Asset)


          // Check if required data is available and render appropriate overview
          const queryName = req.query.name;
          let overviewTitle = "";
          let shouldRender = false;

          switch (queryName) {
            case "copytrading":
              overviewTitle = "Copy Trade ";
              shouldRender = true;
              break;
            case "crypto":
              overviewTitle = "Crypto ";
              shouldRender = true;
              break;
            case "savings":
              overviewTitle = "Savings ";
              shouldRender = true;
              break;
            case "stocks":
              overviewTitle = "Stocks ";
              shouldRender = true;
              break;
            case "robo":
              overviewTitle = "Robo ";
              shouldRender = true;
              break;
            case "reits":
              overviewTitle = "Reits ";
              shouldRender = true;
              break;
            case "mortgage":
              overviewTitle = "Mortgage ";
              shouldRender = true;
              break;
            default:
              // Handle unknown query names or provide default behavior
              break;
          }

          if (shouldRender) {
            return res.render("member/pages/Dashboard/overview.ejs", {
              name: overviewTitle,
              user: user,
              assets: user.asset || null,
            });
          }



          // Prepare overview data
          // console.log("CHECK FOR REQ USER:", req.query);

          const overview = {
            user: req.user,
            crypto: req.crypto,
            copytrading: req.copytrading,
            savings: req.savings,
            stocks: req.stocks,
            robo: req.robo,
            reits: req.reits,
            mortgage: req.mortgage,
            withdraw: req.withdraw,
          };
          // return res.render("member/pages/Dashboard/overview.ejs", {
          //   overview,
          // });
        }

        
     

  return {
    dashboard,
    overviewPage
  };
}
