require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const admins = [
  {
    name: "Rahul Patted",
    email: "rahulpatted02@gmail.com",
    password: "R@hul5655",
    role: "admin",
  },
  {
    name: "Darshan Hallur",
    email: "darshanhallur36198@gmail.com",
    password: "Darshan@1234",
    role: "admin",
  },
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    for (const admin of admins) {
      const existing = await User.findOne({ email: admin.email.toLowerCase() });

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      if (existing) {
        console.log(`User ${admin.email} already exists. Updating password and role...`);
        existing.password = hashedPassword;
        existing.role = "admin";
        await existing.save();
      } else {
        console.log(`Creating admin user: ${admin.email}`);
        await User.create({
          name: admin.name,
          email: admin.email.toLowerCase(),
          password: hashedPassword,
          role: "admin",
          status: "active",
        });
      }
    }

    console.log("Admin seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admins:", error);
    process.exit(1);
  }
};

seedAdmins();
