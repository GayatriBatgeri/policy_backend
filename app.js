const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jwtMiddleware = require("./CustomMiddlewares/jwtMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.locals.messages = req.flash;
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", jwtMiddleware.Authenticate, userRoutes);
app.use("/api/admin", jwtMiddleware.Authenticate, adminRoutes);

app.use(express.static(path.join(__dirname, "react-frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "react-frontend", "build", "index.html"));
});
app.post("*", (req, res) => {
  res.sendFile(path.join(__dirname, "react-frontend", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
