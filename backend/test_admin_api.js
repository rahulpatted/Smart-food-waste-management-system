const axios = require("axios");

async function test() {
  try {
    // 1. Login as admin to get token
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      email: "rahul12@gmail.com",
      password: "password123" // I hope this is the password! 
    });
    
    const token = loginRes.data.token;
    console.log("Logged in! Token obtained.");

    // 2. Fetch users
    const usersRes = await axios.get("http://localhost:5000/api/user/admin/all", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("FETCH SUCCESS!");
    console.log(`Received ${usersRes.data.length} users.`);
  } catch (err) {
    console.error("FETCH FAILED!");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
}

test();
