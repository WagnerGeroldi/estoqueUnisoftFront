const fs = require("fs");
const path = require("path");

const source = path.resolve(
  __dirname,
  "../node_modules/pdfmake/build/vfs_fonts.js"
);

const destination = path.resolve(
  __dirname,
  "../src/pages/report/PDF/vfs_fonts.ts"
);

const content = fs.readFileSync(source, "utf8");

const match = content.match(/this\.pdfMake\.vfs\s*=\s*(\{[\s\S]*\});/);

if (!match) {
  throw new Error("Não foi possível encontrar o VFS do pdfmake.");
}

const vfs = match[1];

const output = `
// Arquivo gerado automaticamente.
// NÃO EDITE MANUALMENTE.

const vfs = ${vfs};

export default vfs;
`;

fs.writeFileSync(destination, output, "utf8");

console.log("VFS do pdfmake gerado com sucesso:");
console.log(destination);