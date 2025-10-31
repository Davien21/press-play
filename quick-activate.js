// Quick activation script
require("dotenv").config();
const jwt = require("jsonwebtoken");

const firstName = process.argv[2] || "Test";
const lastName = process.argv[3] || "User";
const email = process.argv[4];
const password = process.argv[5];

if (!email || !password) {
  console.log("Usage: node quick-activate.js <firstName> <lastName> <email> <password>");
  process.exit(1);
}

const token = jwt.sign(
  { firstName, lastName, email, password },
  process.env.ACCOUNT_ACTIVATE,
  { expiresIn: "1h" }
);

const activationLink = `http://localhost:4000/api/users/activate-account?token=${token}`;

console.log("\n✅ Activating account...\n");

// Auto-activate using fetch
const http = require("http");
const url = require("url");
const parsedUrl = url.parse(activationLink);

const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port,
  path: parsedUrl.path,
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Response:", data);
    console.log("\n✅ Account activated! You can now login.\n");
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
  console.log("\nManual activation link:");
  console.log(activationLink);
});

req.end();
