const axios = require("axios");

async function test() {
  try {
    // 1. Get all donations - pick the first Delivered one
    const res = await axios.get("http://localhost:5000/api/donation");
    const donations = res.data;
    console.log(`Found ${donations.length} donations`);
    
    const delivered = donations.find(d => d.status === "Delivered");
    if (!delivered) {
      console.log("No Delivered donations to test with. All good.");
      return;
    }

    console.log(`Testing DELETE on delivered donation ID: ${delivered._id}`);
    const delRes = await axios.delete(`http://localhost:5000/api/donation/${delivered._id}`);
    console.log("DELETE SUCCESS:", delRes.data);
  } catch (err) {
    console.error("DELETE FAILED:", err.response?.status, err.response?.data || err.message);
  }
}

test();
