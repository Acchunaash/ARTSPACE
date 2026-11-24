const fs = require("node:fs");
const vm = require("node:vm");
const html = fs.readFileSync("index.html", "utf8");
const fail = message => { console.error("ARTSPACE validation failed:", message); process.exitCode = 1; };
if (!/^<!doctype html>/i.test(html.trim())) fail("Missing HTML5 doctype.");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const seen = new Set();
for (const id of ids) { if (seen.has(id)) fail("Duplicate HTML id: " + id); seen.add(id); }
const refs = [...html.matchAll(/document\.getElementById\(["']([^"']+)["']\)/g)].map(match => match[1]);
for (const id of new Set(refs)) if (!seen.has(id)) fail("JavaScript references missing element id: " + id);
const scripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
if (!scripts.length) fail("No inline application script found.");
scripts.forEach((match,index)=>{try{new vm.Script(match[1],{filename:"inline-script-"+(index+1)});}catch(error){fail("Inline JavaScript syntax error: "+error.message);}});
const style=(html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)||[, ""])[1].replace(/\/\*[\s\S]*?\*\//g,"");
let depth=0;for(const char of style){if(char==="{")depth++;if(char==="}")depth--;if(depth<0){fail("CSS has an unexpected closing brace.");break;}}
if(depth!==0)fail("CSS braces are unbalanced.");
try{JSON.parse(fs.readFileSync("manifest.webmanifest","utf8"));}catch(error){fail("Invalid web app manifest: "+error.message);}
try{new vm.Script(fs.readFileSync("sw.js","utf8"));}catch(error){fail("Service worker syntax error: "+error.message);}
try{
 const schema=fs.readFileSync("supabase/migrations/0001_artspace_schema.sql","utf8");
 const seed=fs.readFileSync("supabase/seed.sql","utf8");
 if(!schema.toLowerCase().includes("enable row level security"))fail("Database schema is missing Row Level Security.");
 const count=[...seed.matchAll(/^  \('/gm)].length;
 if(count!==6)fail("Expected six catalog seed records, found "+count+".");
}catch(error){fail("Database foundation files are missing: "+error.message);}
const required=['id="collection"','id="experience"','id="bagOpen"','id="bagDrawer"','id="productDetail"','id="products"','data-filter="dresses"','function openDetail(card)','function renderBag()','id="toast"','id="studio3d"','id="corsetViewer"','id="corsetModel"'];
for(const token of required)if(!html.includes(token))fail("Missing storefront feature: "+token);
if((html.match(/class="product"/g)||[]).length<4)fail("The collection must contain at least four product entries.");
if(!html.includes("Secure online checkout and payment will be connected in a later release."))fail("Checkout boundary messaging is missing.");
if(!html.includes("The ARTSPACE 3D studio")||!html.includes("true, high-quality model"))fail("The 3D studio roadmap and truthful product-detail disclosure are missing.");
if(!html.includes("camera-controls")||!html.includes("rotation-per-second")||!html.includes("CC0 1.0")||!html.includes("model.addEventListener"))fail("Interactive 3D controls, model licence, or fallback handling are missing.");
if(!html.includes("@media(max-width:600px)")||!html.includes("prefers-reduced-motion"))fail("Mobile layout or reduced-motion support is missing.");
if(process.exitCode)process.exit(process.exitCode);
console.log("ARTSPACE validation passed: fresh storefront, responsive layout, collection filters, product detail, bag preview, accessibility, 3D model controls and fallback, and backend boundaries.");
