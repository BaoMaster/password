const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const cloud = require("./cloudinary");

exports.pdf = async (req, res) => {
  try {
    const filename = req.body.filename;
    const pdfPath = path.join("routes", "data", "pdf", filename + ".pdf");
    const invoice = req.body.invoice;

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + filename + '" '
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/pdf");
    res.status(201);
    doc.pipe(fs.createWriteStream(pdfPath));
    await doc.pipe(res);
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);
    cloud.uploads(pdfPath).then((result) => {
      const pdfFile = {
        pdfName: filename,
        pdfUrl: result.url,
        pdfId: result.id,
      };
      console.log("pdf results--", pdfFile.pdfUrl);
    });
    doc.end();

    //   }

    function generateHeader(doc) {
      doc
        // .image(logo, 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("ShoppingApp Inc.", 110, 57)
        .fontSize(10)
        .text("ShoppingApp Inc.", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("HO CHI MINH, HCM, 10025", 200, 80, { align: "right" })
        .moveDown();
    }

    function generateCustomerInformation(doc, invoice) {
      doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

      generateHr(doc, 185);

      const customerInformationTop = 200;

      doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.ordercode, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)

        .text(
          formatCurrency(invoice.finalTotal),
          150,
          customerInformationTop + 30
        )

        .font("Helvetica-Bold")

        .text(invoice.name, 300, customerInformationTop)
        .font("Helvetica")
        .text("Address:", 300, customerInformationTop + 15)
        .text(invoice.address, 350, customerInformationTop + 15)
        .text("Phone:", 300, customerInformationTop + 30)
        .text(invoice.phone, 350, customerInformationTop + 30)
        .moveDown();

      generateHr(doc, 252);
    }

    function generateInvoiceTable(doc, invoice) {
      let i;
      const invoiceTableTop = 330;

      doc.font("Helvetica-Bold");
      generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
      );
      generateHr(doc, invoiceTableTop + 20);
      doc.font("Helvetica");

      for (i = 0; i < invoice.product.length; i++) {
        const item = invoice.product[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          position,
          item.products.productcode,
          item.products.productname,
          item.products.price,
          item.amount,
          formatCurrency(item.products.price * item.amount)
        );

        generateHr(doc, position + 20);
      }

      const subtotalPosition = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.total)
      );

      const taxPosition = subtotalPosition + 20;
      generateTableRow(doc, taxPosition, "", "", "Tax", "", formatCurrency(2));
      const paidToDatePosition = taxPosition + 20;
      generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Discount",
        "",
        "-" + formatCurrency(invoice.discount)
      );

      const duePosition = paidToDatePosition + 25;
      doc.font("Helvetica-Bold");
      generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(invoice.finalTotal)
      );
      doc.font("Helvetica");
    }

    function generateFooter(doc) {
      doc
        .fontSize(10)
        .text(
          "Payment is due within 15 days. Thank you for your business.",
          50,
          780,
          { align: "center", width: 500 }
        );
    }

    function generateTableRow(
      doc,
      y,
      item,
      description,
      unitCost,
      quantity,
      lineTotal
    ) {
      doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
    }

    function generateHr(doc, y) {
      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
    }

    function formatCurrency(cents) {
      return "$" + (cents / 1).toFixed(2);
    }

    function formatDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return year + "/" + month + "/" + day;
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "An error occured in process--" + err.message });
  }
};
