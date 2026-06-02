const formatCurrency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
});

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function fieldValue(id) {
    return escapeHTML(document.getElementById(id).value.trim());
}

function generateInvoice() {
    window.scrollTo(0, 0);

    const invoiceNumber = fieldValue('invoiceNumber');
    const invoiceDate = fieldValue('invoiceDate');
    const invoiceDueDate = fieldValue('dueDate');
    const clientName = fieldValue('clientName');
    const clientAddress = fieldValue('clientAddress');
    const clientVAT = fieldValue('clientVAT');
    const clientEmail = fieldValue('clientEmail');
    const note = fieldValue('invoiceNote');

    const itemDescriptions = document.querySelectorAll('.item-description');
    const itemRates = document.querySelectorAll('.item-rate');
    const itemQtys = document.querySelectorAll('.item-qty');

    let total = 0;
    let rowsHTML = '';

    for (let i = 0; i < itemDescriptions.length; i++) {
        const desc = escapeHTML(itemDescriptions[i].value.trim());
        const rate = parseFloat(itemRates[i].value) || 0;
        const qty = parseInt(itemQtys[i].value, 10) || 0;
        const amount = rate * qty;
        total += amount;

        rowsHTML += `
        <tr>
          <td>${desc}</td>
          <td class="num">${formatCurrency.format(rate)}</td>
          <td class="num">${qty}</td>
          <td class="num">${formatCurrency.format(amount)}</td>
        </tr>
      `;
    }

    const invoiceHTML = `
      <div class="invoice-sheet">
        <header class="invoice-top">
          <div class="invoice-brand">
            <img src="logo.png" alt="Lexyn Consulting logo" class="invoice-logo" />
            <p class="invoice-kicker">Growth consulting</p>
            <h1 class="invoice-title">Invoice</h1>
            <p class="invoice-subtitle">Strategy, partnerships, and commercial execution for growth-focused teams.</p>
          </div>
          <div class="invoice-meta">
            <p class="invoice-kicker">Lexyn Consulting</p>
            <dl>
              <dt>Invoice</dt>
              <dd>${invoiceNumber}</dd>
              <dt>Date</dt>
              <dd>${invoiceDate}</dd>
              <dt>Due</dt>
              <dd>${invoiceDueDate}</dd>
            </dl>
            <div class="balance-card">
              <span>Balance due</span>
              <strong>${formatCurrency.format(total)}</strong>
            </div>
          </div>
        </header>

        <section class="invoice-address">
          <div>
            <h2>Issued by</h2>
            <h3>Lexyn Consulting</h3>
            <p>Gauteng, South Africa</p>
            <p>lexyn.co.za</p>
            <p>stanton@lexyn.co.za</p>
          </div>
          <div>
            <h2>Bill to</h2>
            <h3>${clientName}</h3>
            <p style="white-space: pre-line;">${clientAddress}</p>
            <p>VAT No: ${clientVAT}</p>
            <p>${clientEmail}</p>
          </div>
        </section>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="num">Rate</th>
              <th class="num">Qty</th>
              <th class="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>

        <section class="invoice-totals">
          <div class="total-line">
            <span>Total</span>
            <strong>${formatCurrency.format(total)}</strong>
          </div>
        </section>

        <section class="invoice-note">
          <h2>Note</h2>
          <p>${note}</p>
        </section>

        <footer class="invoice-footer">
          <div>
            <strong>Lexyn Consulting</strong>
            <p>Timeless strategy. Commercial impact. Built together.</p>
          </div>
          <div>
            <strong>Contact</strong>
            <p>stanton@lexyn.co.za</p>
            <p>lexyn.co.za</p>
          </div>
        </footer>
      </div>
    `;

    document.getElementById('invoice-preview').innerHTML = invoiceHTML;
    document.getElementById('download-btn').hidden = false;
}

function downloadPDF() {
    const invoice = document.getElementById('invoice-preview');
    const opt = {
        margin: 0,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, useCORS: true, backgroundColor: '#fbf8f2' },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(invoice).save();
}

function addItem() {
    const container = document.getElementById('items-container');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <input type="text" class="item-description" placeholder="Description" required />
      <input type="number" class="item-rate" placeholder="Rate (ZAR)" min="0" step="0.01" required />
      <input type="number" class="item-qty" placeholder="Quantity" min="1" step="1" required />
    `;
    container.appendChild(row);
}
