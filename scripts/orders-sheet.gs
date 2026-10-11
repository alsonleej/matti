// Mätti shared order sheet.
// Paste into Extensions → Apps Script on a Google Sheet, then
// Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
// Use the /exec URL as NEXT_PUBLIC_ORDERS_URL.

const SHEET_NAME = "Orders";
const COLUMNS = [
  "id", "kind", "personId", "itemId", "itemName", "itemImage", "priceKr",
  "quantity", "name", "desk", "readyBy", "readyByLabel", "status", "createdAt",
];

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
  }
  return sheet;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function readOrders_() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  return rows
    .filter((row) => row[0])
    .map((row) => {
      const order = {};
      COLUMNS.forEach((key, index) => {
        const value = row[index];
        order[key] = value instanceof Date ? value.toISOString() : value;
      });
      order.priceKr = Number(order.priceKr);
      order.quantity = Number(order.quantity);
      return order;
    });
}

function doGet() {
  return json_({ orders: readOrders_() });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(event.postData.contents);
    const sheet = getSheet_();

    if (body.action === "create") {
      const order = body.order || {};
      if (!order.id) return json_({ ok: false, error: "Missing order id." });
      // Prefix with ' so Sheets keeps ISO timestamps as text.
      sheet.appendRow(
        COLUMNS.map((key) =>
          key === "readyBy" || key === "createdAt"
            ? "'" + (order[key] || "")
            : order[key] ?? "",
        ),
      );
      return json_({ ok: true });
    }

    if (body.action === "status") {
      const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
      const index = ids.findIndex((row) => row[0] === body.id);
      if (index === -1) return json_({ ok: false, error: "Order not found." });
      sheet.getRange(index + 2, COLUMNS.indexOf("status") + 1).setValue(body.status);
      return json_({ ok: true });
    }

    return json_({ ok: false, error: "Unknown action." });
  } finally {
    lock.releaseLock();
  }
}
