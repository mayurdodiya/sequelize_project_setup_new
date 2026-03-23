#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const BOILERPLATE_REPO = "mayurdodiya/sequelize-project-setup-n";

const projectName = process.argv[2];

if (!projectName) {
  console.log("❌ Please provide a project name!");
  console.log("   Usage: npx @mayur-dodiya/create-sequelize-app my-project");
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
  console.log(`❌ Folder "${projectName}" already exists!`);
  process.exit(1);
}

console.log(`
🚀 Creating Sequelize app: ${projectName}...
`);

try {
  execSync(`npx degit ${BOILERPLATE_REPO} ${projectName}`, { stdio: "inherit" });

  console.log(`
✅ Done! Your Sequelize app is ready!

   cd ${projectName}
   cp .env.example .env
   # Fill in your MySQL credentials in .env
   npm install
   npx sequelize-cli db:migrate
   npm run dev
`);
} catch (err) {
  console.error("❌ Failed:", err.message);
  process.exit(1);
}
