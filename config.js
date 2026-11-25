/* =====================================================================
   HOME ALONE ON BAY HILL — SITE SETTINGS
   This one file feeds the homepage, the Spotlights page and Have Your Say.
   ===================================================================== */
window.BAYHILL = {

    /* Paste your Google Apps Script web-app URL here (see SETUP.md).
       Leave it "" and the site still works: normal schedule, no alerts,
       giving numbers come from the GIVING block in index.html. */
    controlURL: "",

    /* Display schedule (Central time) */
    openingNight: "2026-11-26",   // Thanksgiving
    lightsOn:  "18:00",           // 6:00 PM
    lightsOff: "22:30",           // 10:30 PM
    lastNight: "2027-01-01",      // last night the lights run

    /* Weather spot for the forecast (Conway, AR) */
    lat: 35.0887, lon: -92.4421,

    /* Character Spotlights. A video only appears on the site on its date,
       so future ones (and surprises) stay hidden until that day.
       Put the .mp4 files in a folder named "spotlights" in the repo. */
    spotlights: [
        { date: "2026-11-17", name: "The Pizza Boy",    tag: "Little Nero's delivers", file: "spotlights/01_pizza_boy.mp4" },
        { date: "2026-11-18", name: "Gus Polinski",     tag: "The Polka King of the Midwest", file: "spotlights/02_gus.mp4" },
        { date: "2026-11-19", name: "Kate McCallister", tag: "KEVIN!!!",               file: "spotlights/03_kate.mp4" },
        { date: "2026-11-20", name: "Old Man Marley",   tag: "Shovel Slayer… or Shovel Hero?", file: "spotlights/04_marley.mp4" },
        { date: "2026-11-21", name: "Buzz",             tag: "Buzz, your girlfriend… WOOF!",                      file: "spotlights/05_buzz.mp4" },
        { date: "2026-11-22", name: "Meet the Artist",  tag: "Angie Howard, the hands behind it all",          file: "spotlights/06_angie.mp4" },
        { date: "2026-11-23", name: "Marv",             tag: "Slipping on our front steps",                      file: "spotlights/07_marv.mp4" },
        { date: "2026-11-24", name: "Harry",            tag: "Case file: the Wet Bandits",                      file: "spotlights/08_harry.mp4" },
        { date: "2026-11-25", name: "Kevin",            tag: "The star of the show", file: "spotlights/09_kevin.mp4" }
    ],

    /* Characters people can vote for, and "teams" for giving */
    characters: ["Kevin", "Marv", "Harry", "Kate (Mom)", "Old Man Marley",
                 "Gus Polinski", "The Pizza Boy", "Buzz"]
};

/* ---------- shared helpers (no need to edit below) ---------- */
window.BAYHILL.now = function () {
    const o = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit",
        day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(p => o[p.type] = p.value);
    return { ymd: `${o.year}-${o.month}-${o.day}`, mins: (+o.hour) * 60 + (+o.minute) };
};
/* Central time, Nov–Mar is always CST (UTC-6) */
window.BAYHILL.at = (ymd, hm) => new Date(`${ymd}T${hm}:00-06:00`);
window.BAYHILL.addDays = (ymd, n) => { const d = new Date(ymd + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
window.BAYHILL.dayDiff = (a, b) => Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 864e5);
window.BAYHILL.released = function () {
    const today = this.now().ymd;
    return this.spotlights.filter(s => s.date <= today);
};
window.BAYHILL.getControl = function () {
    if (!this._ctl) {
        this._ctl = this.controlURL
            ? fetch(this.controlURL).then(r => r.json()).catch(() => null)
            : Promise.resolve(null);
    }
    return this._ctl;
};
window.BAYHILL.send = function (payload) {
    if (!this.controlURL) return Promise.reject(new Error("controlURL not set"));
    return fetch(this.controlURL, { method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
};
