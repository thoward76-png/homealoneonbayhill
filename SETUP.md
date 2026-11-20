# Bay Hill website: setup

## 1. Upload to GitHub (5 min)
In your site repo: **Add file → Upload files**, then drag in:
- `index.html` (replaces the old one)
- `config.js`, `spotlights.html`, `have-your-say.html`
- the whole `spotlights` folder (drag the folder itself so the files land in `spotlights/`)

Commit. The site is live in 1–2 minutes. It works right away: countdown, weather, spotlights.
(The `apps-script` folder does NOT go to GitHub. It's for step 2.)

## 2. Create the control sheet (10 min, one time)
This turns on the phone-editable alerts, giving totals, team standings, and voting.
1. Go to sheets.new and name the sheet **Bay Hill Site Control**.
2. **Extensions → Apps Script**. Delete what's there, paste all of `Code.gs`, and click Save.
3. In the function dropdown pick **setup**, then click **Run**. Approve the Google permission prompt (Advanced → Go to project).
   Your sheet now has a **Control** tab plus **Favorites**, **Suggestions** and **Feedback** tabs.
4. Click **Deploy → New deployment**, then the gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy and **copy the Web app URL**.
5. In GitHub, open `config.js`, click the pencil icon, paste the URL between the quotes on `controlURL: ""`, and commit.

## 3. Day to day (from your phone, in the Google Sheets app)
| To do this | Set in the Control tab |
|---|---|
| Close for weather tonight | `alert_type` = closed · `alert_message` = "Storms tonight. See you tomorrow at 6!" · `alert_date` = tonight's date |
| Post a notice (e.g., Santa visit) | `alert_type` = notice · `alert_message` = your text |
| Back to normal | Clear `alert_type` (a dated alert clears itself the next day) |
| Update giving | `giving_raised_2026`, `giving_updated` (and `giving_history` once) |
| Team standings | Add dollars to each `team:` row from the Venmo/Cash App notes |

Answers from the Have Your Say page land in the **Favorites**, **Suggestions** and **Feedback** tabs, newest at the bottom.
Each tab has a "Notes (yours)" column for your own notes, like "Angie likes this" or "add for 2027". Only you can see these tabs.

**Already deployed the script before and changed Code.gs?** Paste the new code, Save, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
That keeps the same URL, so config.js doesn't change.

## 4. Adding each night's spotlight
Upload the vertical video into the `spotlights` folder with the name already listed in `config.js`
(`05_buzz.mp4`, `06_angie.mp4`, `07_marv.mp4`, `08_harry.mp4`, `09_kevin.mp4`).
A spotlight only appears on its date, so you can upload early and it stays hidden.
GitHub's upload limit in the browser is 25 MB per file; all our vertical spotlights fit.
