/**
 * Home Alone on Bay Hill: site control panel.
 * Lives inside a Google Sheet (Extensions → Apps Script).
 *   GET  → returns the Control tab (read by the website). Visitor answers are never sent back out.
 *   POST → saves answers from have-your-say.html into three tabs: Favorites, Suggestions, Feedback
 * Run setup() once to create the tabs.
 */

const CONTROL_DEFAULTS = [
  ['key', 'value', 'what it does'],
  ['alert_type', '', 'Blank = normal schedule. "closed" = red CLOSED TONIGHT card. "notice" = yellow message under the status.'],
  ['alert_message', '', 'Text people see, e.g. "Storms tonight. We\'ll see you tomorrow at 6!"'],
  ['alert_date', '', 'Optional date (2026-12-03). The alert only shows that night, then disappears on its own. Blank = shows until you clear it.'],
  ['giving_since', '2024', 'First year of giving'],
  ['giving_history', '', 'Past seasons, like: 2024: 1500, 2025: 3200'],
  ['giving_raised_2026', '', 'This season so far (number only)'],
  ['giving_goal_2026', '', 'Optional goal. Shows the progress bar.'],
  ['giving_extra_number', '', 'Optional extra stat number'],
  ['giving_extra_label', 'students supported', 'Label for the extra stat'],
  ['giving_updated', '', 'e.g. Nov 28, 2026'],
  ['team:Kevin', '', 'Dollars given "in honor of" each character (from Venmo/Cash App notes). Blank rows are hidden.'],
  ['team:Marv', '', ''],
  ['team:Harry', '', ''],
  ['team:Kate (Mom)', '', ''],
  ['team:Old Man Marley', '', ''],
  ['team:Gus Polinski', '', ''],
  ['team:The Pizza Boy', '', ''],
  ['team:Buzz', '', '']
];

function setup() {
  const ss = SpreadsheetApp.getActive();
  let c = ss.getSheetByName('Control');
  if (!c) {
    c = ss.insertSheet('Control', 0);
    c.getRange(1, 1, CONTROL_DEFAULTS.length, 3).setValues(CONTROL_DEFAULTS);
    c.getRange('B:B').setNumberFormat('@');               // keep everything as plain text
    c.getRange('1:1').setFontWeight('bold');
    c.setColumnWidth(1, 190); c.setColumnWidth(2, 260); c.setColumnWidth(3, 520);
    c.setFrozenRows(1);
  }
  Object.keys(TABS).forEach(t => tab(t));
}

function doGet() {
  const ss = SpreadsheetApp.getActive();
  const control = {};
  ss.getSheetByName('Control').getDataRange().getValues().slice(1).forEach(r => {
    let val = r[1];
    if (val instanceof Date) val = Utilities.formatDate(val, 'America/Chicago', 'yyyy-MM-dd');
    if (r[0]) control[String(r[0]).trim()] = String(val).trim();
  });
  return ContentService.createTextOutput(JSON.stringify({ control }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const clip = (s, n) => String(s || '').replace(/^[=+\-@]/, "'").slice(0, n);   // block spreadsheet formulas
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { return ok(); }
  const name = TYPE_TO_TAB[d.type];
  if (!name) return ok();
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const row = d.type === 'feedback'
      ? [new Date(), clip(d.text, 1000), clip(d.name, 40)]
      : [new Date(), clip(d.choice, 120), clip(d.text, 500), clip(d.name, 40)];
    tab(name).appendRow(row);
  } finally { lock.releaseLock(); }
  return ok();
}

/* One tab per form, created automatically the first time it's needed */
const TABS = {
  'Favorites':   ['When', 'Favorite part', 'Why', 'Name', 'Notes (yours)'],
  'Suggestions': ['When', 'Character or scene', 'Why', 'Name', 'Notes (yours)'],
  'Feedback':    ['When', 'Feedback', 'Name', 'Notes (yours)']
};
const TYPE_TO_TAB = { favorite: 'Favorites', suggest: 'Suggestions', feedback: 'Feedback' };

function tab(name) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    const h = TABS[name];
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#fff2cc');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 140);
    sh.setColumnWidth(2, 260);
    sh.setColumnWidth(3, 320);
    sh.getRange('A:A').setNumberFormat('ddd mmm d, h:mm am/pm');
    sh.getRange('B:D').setWrap(true);
  }
  return sh;
}

function ok() { return ContentService.createTextOutput('ok'); }
