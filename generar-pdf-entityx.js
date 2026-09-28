const fs = require('fs');
const path = require('path');
const puppeteer = require('./entityx-back/node_modules/puppeteer');

async function main() {
  const root = __dirname;
  const htmlPath = path.join(root, 'EntityX-documento-proyecto.html');
  const pdfPath = path.join(root, 'EntityX-documento-proyecto.pdf');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: '14mm',
        right: '12mm',
        bottom: '18mm',
        left: '12mm',
      },
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#536671;padding:0 12mm;display:flex;justify-content:space-between;">
          <span>EntityX - Documento estratégico y técnico</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `,
    });
  } finally {
    await browser.close();
  }

  const stats = fs.statSync(pdfPath);
  console.log(`${pdfPath} (${stats.size} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
