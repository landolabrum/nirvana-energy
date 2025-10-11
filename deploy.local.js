/* deploy.local.js
 * Copies static export to ../data/deepturn (bind-mounted to /srv/deepturn in Caddy)
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { merchants, deploy } = require("./merchants.config");

const target = process.env.DEPLOY_TARGET || deploy;
const merchant = merchants[target];

if (!merchant) {
  console.error(`❌ Invalid DEPLOY_TARGET "${target}"`);
  process.exit(1);
}

const root = __dirname;
const outDir = path.join(root, "out");
const deployDir = path.resolve(root, "..", "data/caddy/www", merchant.mid); // <--- matches your docker-compose bind

console.log(`📦 Building static site for "${target}" → ${merchant.url}`);
execSync("npm run build", { stdio: "inherit" });

if (!fs.existsSync(outDir)) {
  console.error("❌ Export failed; 'out/' not found");
  process.exit(1);
}

// ensure target dir exists
fs.mkdirSync(deployDir, { recursive: true });

// rsync-like copy: wipe destination and copy fresh
console.log(`🚚 Publishing to ${deployDir}`);
fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });

// naive recursive copy (small sites) — replace with shell rsync if you prefer
function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.statSync(s);
    console.log(`📦 Copying ${s} → ${d}`);
    if (stat.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyRecursive(outDir, deployDir);

console.log(`✅ Deployed to ${deployDir}`);
console.log(`🌐 Visit: ${merchant.url}`);
