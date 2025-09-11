import express from "express";
import bodyParser from "body-parser";
import { Sequelize } from "sequelize";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import  fs   from "fs";
import models  from "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));
app.set("models", models);
app.use(express.static(path.join(path.resolve(), "public")));

app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.User = req.app.get("models").User;
  next();
});
// create uploads folders at startup (safe, idempotent)
const uploadsRoot = path.join(process.cwd(), 'uploads');
const avatarsDir = path.join(uploadsRoot, 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// serve uploads folder
app.use('/uploads', express.static(uploadsRoot));

// Initialize Sequelize (Postgres)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5433,
    logging: false, // Disable logging
  }
);

let User, Asset, dbModels;

//Initialize database connection and models
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL via Sequelize");
    try {
      const modelsModule = await import("./models/index.js");
      const initModels = modelsModule.default || modelsModule.initModels || modelsModule;
      dbModels = initModels(sequelize);
      User = dbModels.User;
      Asset = dbModels.Asset;
    } catch (err) {
      console.warn(
        "⚠️ Could not initialize models automatically:",
        err.message
      );
    }
    return true;
  } catch (err) {
    console.error("❌ Sequelize connection error:", err.message);
    return false;
  }
}

//START SERVER

const startServer = async () => {
  const dbReady = await initDatabase();

  if (!dbReady) {
    console.log("failed to connect to database");
    process.exit(1);
  }

  // --Initialize session store and flash after DB is ready ---

  const PgSession = connectPgSimple(session);
  app.use(
    session({
      store: new PgSession({
        conObject: {
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5433,
        },
      }),

      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:
          1000 *
          60 *
          (process.env.FLASH_TTL_MINUTES
            ? Number(process.env.FLASH_TTL_MINUTES)
            : 1), // 1 minute default
      },
    })
  );

  app.use(flash());

  app.use((req, res, next) => {
    let FLASH_TTL = 2 * 60 * 1000;
    if (process.env.FLASH_TTL_MS) {
      const v = Number(process.env.FLASH_TTL_MS);
      if (!Number.isNaN(v) && v >= 0) FLASH_TTL = v;
    } else if (process.env.FLASH_TTL_MINUTES) {
      const m = Number(process.env.FLASH_TTL_MINUTES);
      if (!Number.isNaN(m) && m >= 0) FLASH_TTL = Math.floor(m * 60 * 1000);
    }

    // Initialize persistent flash storage on session
    req.session.pflash = req.session.pflash || {};

    // Override req.flash to support persistent flashes with timestamps.
    // Setter: req.flash(type, msg) where msg can be string, object or array.
    // Getter: req.flash(type) returns array of messages and removes them from the session
    // (consume-on-read semantics) while still respecting TTL for expired items.
    req.flash = function (type, msg) {
      // Setter
      if (typeof msg !== "undefined") {
        req.session.pflash[type] = req.session.pflash[type] || [];
        const now = Date.now();
        if (Array.isArray(msg)) {
          msg.forEach((m) =>
            req.session.pflash[type].push({ msg: m, ts: now })
          );
        } else {
          req.session.pflash[type].push({ msg: msg, ts: now });
        }
        return;
      }

      // Getter (consume returned values)
      req.session.pflash[type] = req.session.pflash[type] || [];
      const now = Date.now();
      // Separate valid and expired
      const validItems = [];
      const remaining = [];
      (req.session.pflash[type] || []).forEach((item) => {
        if (now - (item.ts || 0) <= FLASH_TTL) validItems.push(item);
        else remaining.push(item);
      });
      // Remove the valid items (we consumed them), keep only the expired ones if any
      req.session.pflash[type] = remaining;
      // Return messages array
      return validItems.map((i) => i.msg);
    };

    // Expose template-friendly shapes on res.locals
    try {
      const fError = req.flash("error") || [];
      const fSuccess = req.flash("success") || [];
      const fErrors = req.flash("errors") || [];
      const fOld = req.flash("old") || [];
      res.locals.error = fError.length ? fError[0] : null;
      res.locals.success = fSuccess.length ? fSuccess[0] : null;
      // If controllers stored a nested array (e.g. req.flash('errors', mapped)),
      // flatten one level so templates receive an array of error objects.
      if (fErrors.length === 1 && Array.isArray(fErrors[0])) {
        res.locals.errors = fErrors[0];
      } else {
        res.locals.errors = fErrors;
      }
      // old form values: take first stored object or empty object
      res.locals.old = fOld.length
        ? typeof fOld[0] === "object"
          ? fOld[0]
          : {}
        : {};
      // expose query marker for registration redirect fallback
      res.locals.registered =
        req.query &&
        (req.query.registered === "1" || req.query.registered === "true");
    } catch (e) {
      res.locals.error = null;
      res.locals.success = null;
      res.locals.errors = [];
      res.locals.old = {};
    }

    // Clean expired items from session.pflash
    try {
      Object.keys(req.session.pflash).forEach((key) => {
        req.session.pflash[key] = (req.session.pflash[key] || []).filter(
          (item) => Date.now() - (item.ts || 0) <= FLASH_TTL
        );
        if (req.session.pflash[key].length === 0)
          delete req.session.pflash[key];
      });
    } catch (e) {
      // ignore cleanup errors
    }

    next();
  });

  // after flash middleware and before mounting routes
  app.use(async (req, res, next) => {
    res.locals.user = null;
    // Always fetch fresh user data
    try {
      if (req.session && req.session.userId && typeof User !== "undefined") {
        const user = await User.findByPk(req.session.userId);
        if (user) {
          res.locals.user = user.get ? user.get({ plain: true }) : user;
        }
      }
    } catch (err) {
      // don't block page render on DB errors; log for diagnosis
      console.error(
        "Error loading session user:",
        err && err.stack ? err.stack : err
      );
    }
    next();
  });

  // Mount routes using MVC router
  try {
    const indexRouter = (await import("./routes/index.js")).default;
    // expose models to request handlers via app.locals and app.set
    app.set("models", dbModels);
    app.locals.models = dbModels;

    const router = indexRouter({
      User: dbModels?.User,
      Asset: dbModels?.Asset,
      Contact: dbModels?.Contact,
      Crypto: dbModels?.Crypto,
      CTrader: dbModels?.CTrader,
      Mortgage: dbModels?.Mortgage,
      Referral: dbModels?.Referral,
      Reit: dbModels?.Reit,
      Robo: dbModels?.Robo,
      Savings: dbModels?.Savings,
      Stake: dbModels?.Stake,
      Stock: dbModels?.Stock,
      Withdraw: dbModels?.Withdraw,
      Deposit: dbModels?.Deposit,
      Admin: dbModels?.Admin,
      Payment: dbModels?.Payment,
      KYC: dbModels?.KYC,
    });

    app.use("/", router);
  } catch (err) {
    console.warn("Could not mount routes dynamically:", err.message);
  }
  // Global error handler: logs stack traces and returns a safe 500 response
  app.use((err, req, res, next) => {
    try {
      console.error("Unhandled error:", err && err.stack ? err.stack : err);
    } catch (logErr) {
      console.error("Error while logging error:", logErr);
    }
    if (
      req.xhr ||
      (req.headers.accept && req.headers.accept.includes("application/json"))
    ) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    return res.status(500).send("Internal server error");
  });
  // --- end session init ---
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });

  //Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("🔌 Shutting down server...");
    await sequelize.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  });
};

// Log unhandled rejections and uncaught exceptions to capture unexpected errors
process.on("unhandledRejection", (reason, p) => {
  console.error(
    "Unhandled Rejection at:",
    p,
    "reason:",
    reason && reason.stack ? reason.stack : reason
  );
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err && err.stack ? err.stack : err);
  // It's often safer to exit after an uncaught exception so the process can restart cleanly
  process.exit(1);
});

startServer().catch((err) => {
  console.error(
    "❌ Error starting server:",
    err && err.stack ? err.stack : err
  );
  process.exit(1);
});
