const mongoose = require("mongoose");
require("dotenv").config();
const Menu = require("./models/Menu");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const menus = await Menu.find();
    console.log("Current Menus in DB:", JSON.stringify(menus, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
