# Lexyn Invoice Generator

A lightweight, browser-based tool for generating branded PDF invoices for Lexyn Consulting. No backend is required; open the app, fill out the form, preview the invoice, and download a polished A4 PDF.

## Features

- Custom invoice number, dates, client details, VAT number, and client note
- Multiple line items with automatic ZAR totals
- Lexyn Consulting logo, colors, typography, and editorial invoice layout
- Preview before download
- One-click PDF export
- Runs entirely in the browser

## Getting Started

Run the folder through a local web server so the logo renders reliably in the exported PDF.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/barebones-invoices/` from the project root server, or serve this folder directly and open `http://localhost:8000/`.

## Customizing

- Company identity and contact details are generated in `script.js`.
- Visual styling is controlled in `style.css`.
- Replace `logo.png` only if the Lexyn logo changes.
- Add payment instructions in the invoice note field before generating a client PDF.
