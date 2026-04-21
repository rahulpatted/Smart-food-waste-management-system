require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find();
  console.log("USERS IN DB:");
  users.forEach(u => {
    console.log(`- ${u.name} | ${u.email} | Role: ${u.role} | Status: ${u.status}`);
  });
  process.exit();
}

check();
