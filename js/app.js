/* ============ תבניות בסיס ============ */
const MORNING = [
  ["05:25","מודה אני, מקלחת ומי פה","personal"],
  ["05:40","צחצוח שיניים","personal"],
  ["05:45","הכנת חביתה בפיתה והתארגנות","meal"],
  ["06:10","נסיעה לעבודה","work"],
  ["06:30","נס קפה והפסקה","personal"],
  ["06:45","קבלת משמרת ותדריך בוקר","work"],
  ["07:00","תפילת שחרית","prayer"],
  ["07:45","שליחת דוח פתיחות בוקר","work"],
  ["08:00","סיור בוקר ובדיקת יומן המשמרת","work"],
  ["08:15","הפסקה וקפיצה ללובי לצוות","personal"]
].map(([t,what,tone])=>({t,what,tone}));

const CORE = [
  ["08:30","block","חומר חדש — קריאה והבנה"],
  ["09:15","ארוחת בוקר","meal"],
  ["09:30","block","המשך החומר המרכזי"],
  ["10:15","הפסקה וביקור בלובי","personal"],
  ["10:30","block","המשך החומר המרכזי"],
  ["11:15","זמן לעצמך","personal"],
  ["11:30","block","המשך החומר המרכזי"],
  ["12:15","ארוחת צהריים ולובי","meal"],
  ["13:00","block","תרגול ושאלות"],
  ["13:45","הפסקה","personal"],
  ["14:00","block","תרגול ושאלות"],
  ["14:45","קבלת משמרת צהריים","work"],
  ["15:15","block","חזרה ובדיקת הבנה"]
].map(r => r[1]==="block"
  ? {t:r[0], block:true, focus:r[2], tone:"study"}
  : {t:r[0], what:r[1], tone:r[2]});

const EXTENSION = [
  ["16:00","ארוחת ביניים","meal"],
  ["16:15","block","חזרה והטמעה"],
  ["17:00","הפסקה וביקור בלובי","personal"],
  ["17:15","block","שאלות ותיקון טעויות"],
  ["18:00","זמן לעצמך","personal"],
  ["18:15","block","סגירת קצוות — בלי נושא כבד חדש"]
].map(r => r[1]==="block"
  ? {t:r[0], block:true, focus:r[2], tone:"study"}
  : {t:r[0], what:r[1], tone:r[2]});

const BUILTIN_DAYS = {
  work19:{ name:"עבודה עד 19:00", ends:"19:00", target:6,
    rows:[...MORNING, ...CORE, ...EXTENSION] },
  work16:{ name:"עבודה עד 16:00", ends:"16:00", target:6,
    rows:[...MORNING, ...CORE] },
  friday_work:{ name:"שישי — עבודה עד 15:00", ends:"15:00", target:4,
    rows:[...MORNING, ...CORE.slice(0,11), {t:"14:45",what:"סגירת משמרת ומסירה",tone:"work"}] },
  work16_nostudy:{ name:"עבודה עד 16:00 — בלי לימודים", ends:"16:00", target:0,
    rows:[...MORNING,
      {t:"08:30",what:"עבודה שוטפת ומשימות המשמרת",tone:"work"},
      {t:"12:15",what:"ארוחת צהריים ולובי",tone:"meal"},
      {t:"13:00",what:"המשך עבודה שוטפת",tone:"work"},
      {t:"14:45",what:"קבלת משמרת צהריים",tone:"work"}] },
  friday_home:{ name:"שישי — ניקיון יסודי", ends:"12:30", target:0, rows:[
    {t:"08:00",what:"השכמה",tone:"personal"},
    {t:"08:15",what:"מקלחת והתארגנות",tone:"personal"},
    {t:"08:45",what:"ארוחת בוקר וקפה",tone:"meal"},
    {t:"09:15",what:"מטבח — כלים, משטחים ומקרר",tone:"personal"},
    {t:"10:15",what:"מקלחת ושירותים לעומק",tone:"personal"},
    {t:"11:00",what:"חדרים, אבק ושטיפת רצפות",tone:"personal"},
    {t:"11:45",what:"חצר וטאטוא",tone:"personal"},
    {t:"12:15",what:"אשפה וסיבוב אחרון",tone:"personal"}
  ]},
  special:{ name:"יום חריג — בלי לימודים", ends:"17:00", target:0, rows:[
    {t:"05:25",what:"השכמה, מקלחת והתארגנות",tone:"personal"},
    {t:"06:15",what:"ארוחת בוקר ונסיעה",tone:"meal"},
    {t:"08:00",what:"פעילות מלאה — אימון או הכשרה",tone:"work"},
    {t:"12:00",what:"הפסקת צהריים",tone:"meal"},
    {t:"12:45",what:"המשך הפעילות עד 17:00",tone:"work"}
  ]},
  shabbat:{ name:"שבת אצל ההורים", ends:"20:00", target:0, rows:[
    {t:null, timeText:"עד צאת השבת", what:"שבת בבית ההורים", tone:"prayer"}
  ]},
  off:{ name:"יום חופש", ends:"16:00", target:0, rows:[
    {t:"07:30",what:"השכמה חופשית",tone:"personal"},
    {t:"08:30",what:"ארוחת בוקר",tone:"meal"},
    {t:"09:30",what:"יום פנוי — נקבע לפי הצורך",tone:"none"}
  ]},
  none:{ name:"ללא תבנית", ends:"16:00", target:0, rows:[] }
};

const BUILTIN_EVES = {
  fitness:{ name:"כושר ומנוחה", items:[
    ["נסיעה לדירה",30,"work"],["כושר",30,"personal"],
    ["מקלחת והתארגנות",30,"personal"],["ארוחת ערב",15,"meal"],
    ["צחצוח שיניים והתארגנות",15,"personal"],
    ["מיטה בלי פלאפון וצליל מרגיע",60,"sleep"]
  ]},
  home:{ name:"בית וניקיון קל", items:[
    ["נסיעה לדירה",30,"work"],["מנוחה",30,"personal"],
    ["כושר",30,"personal"],["מקלחת",30,"personal"],["ארוחת ביניים",15,"meal"],
    ["ניקיון קל — חצר, פינת ישיבה, סמרטוט, מקלחת ומטבח",60,"personal"],
    ["הכנות מראש לסוף השבוע",30,"personal"],["זמן פנוי לעצמך",75,"personal"],
    ["צחצוח שיניים והתארגנות",15,"personal"],["מיטה בלי פלאפון",45,"sleep"]
  ]},
  cook:{ name:"קניות ובישול", items:[
    ["נסיעה לדירה",30,"work"],["קניות",60,"meal"],
    ["בישול לימים הקרובים",75,"meal"],["ניקיון מטבח",20,"personal"],
    ["כושר",30,"personal"],["מקלחת",30,"personal"],["ארוחת ערב",20,"meal"],
    ["זמן פנוי לעצמך",35,"personal"],["צחצוח שיניים והתארגנות",15,"personal"],
    ["מיטה בלי פלאפון",45,"sleep"]
  ]},
  errands:{ name:"יום סידורים", items:[
    ["סידורים ומשימות בחוץ",180,"work"],["נסיעה לדירה",20,"work"],
    ["מקלחת",30,"personal"],["ארוחת ערב",20,"meal"],["זמן פנוי לעצמך",50,"personal"],
    ["צחצוח שיניים והתארגנות",15,"personal"],["מיטה בלי פלאפון",45,"sleep"]
  ]},
  social:{ name:"ערב חברתי", items:[
    ["נסיעה לדירה",30,"work"],["מקלחת קצרה והחלפת בגדים",15,"personal"],
    ["סידור אחרון לפני האורחים",15,"personal"],
    ["מפגש חברתי — שעת סיום גמישה",330,"personal"]
  ]},
  recovery:{ name:"התאוששות", items:[
    ["נסיעה לדירה",30,"work"],["ארוחת ערב",30,"meal"],["מקלחת",30,"personal"],
    ["מנוחה",60,"personal"],["זמן פנוי לעצמך",90,"personal"],
    ["צחצוח שיניים והתארגנות",15,"personal"],["מיטה בלי פלאפון",45,"sleep"]
  ]},
  shabbat_eve:{ name:"כניסת שבת אצל ההורים", items:[
    ["זמן חופשי בדירה",null,"personal","מסיום היום"],
    ["נסיעה לבית ההורים והכנות",null,"work","לפני כניסת שבת"],
    ["שבת אצל ההורים",null,"prayer","מכניסת שבת"]
  ]},
  motzash:{ name:'מוצ"ש — בישול לשבוע', items:[
    ["נסיעה מבית ההורים לדירה",30,"work"],["בישול לראשון, שני ושלישי",90,"meal"],
    ["ניקיון מטבח",30,"personal"],["גילוח ראש ומקלחת",30,"personal"],
    ["התארגנות לשינה",15,"personal"],["מיטה בלי פלאפון",30,"sleep"]
  ]},
  none:{ name:"ערב פתוח", items:[] }
};

const DAYS = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const TONES = [["study","לימודים"],["work","עבודה"],["prayer","תפילה"],
  ["meal","ארוחה"],["personal","אישי"],["sleep","שינה"],["none","אחר"]];
const TONE_HEX = {study:"#2FA394", work:"#C6892F", prayer:"#7A69CE",
  meal:"#4F9E63", personal:"#CD6E92", sleep:"#5A83BE", none:"#A8B2C4"};

const CRITERIA = [
  ["study","לימודים","התקדמת בחומר, לא רק ישבת מולו"],
  ["work","עבודה","מילאת את התפקיד ולא נתת ללימודים להפריע"],
  ["sleep","שינה","שמרת פחות או יותר על 22:00–05:25"],
  ["body","גוף ובית","עשית כושר ושמרת על הסדר בדירה"],
  ["life","חיים אישיים","היה זמן לנוח, לחברים ולעצמך"],
  ["food","בישולים ותזונה","בישלת מראש ואכלת לפחות 4 ארוחות ביום — בוקר, צהריים, ביניים וערב"]
];

const QUOTES = [
  ["לימודים","לא עליך המלאכה לגמור, ולא אתה בן חורין להיבטל ממנה","פרקי אבות"],
  ["לימודים","איזהו חכם? הלומד מכל אדם","פרקי אבות"],
  ["לימודים","יגעת ומצאת — תאמין","מסכת מגילה"],
  ["לימודים","לפום צערא אגרא","פרקי אבות"],
  ["לימודים","עדיף מעט בריכוז מלא, מהרבה בחצי ראש",""],
  ["לימודים","שעה אחת של הבנה שווה יותר מיום של דפדוף",""],
  ["לימודים","החומר לא בורח. רק הרצף חשוב",""],
  ["אמונה","גם כי אלך בגיא צלמות לא אירא רע","תהילים כג"],
  ["אמונה","ה' עוז לעמו ייתן, ה' יברך את עמו בשלום","תהילים כט"],
  ["אמונה","קווה אל ה', חזק ויאמץ לבך","תהילים כז"],
  ["אמונה","כל העולם כולו גשר צר מאוד, והעיקר לא לפחד כלל","רבי נחמן מברסלב"],
  ["אמונה","עשה לך רב וקנה לך חבר","פרקי אבות"],
  ["הצלחה","שבע ייפול צדיק וקם","משלי כד"],
  ["הצלחה","ההצלחה נמדדת בכמה פעמים חזרת, לא בכמה פעמים נפלת",""],
  ["הצלחה","עקביות מנצחת התפרצות. תמיד",""],
  ["הצלחה","מי שמחזיק שנה בקצב בינוני, עובר את מי שבער שבוע",""],
  ["הצלחה","יום שבו עמדת ביעד הוא יום מנצח. גם אם היה אפשר יותר",""],
  ["חיים","איזהו עשיר? השמח בחלקו","פרקי אבות"],
  ["חיים","שינה טובה היא חלק מהעבודה, לא הפסקה ממנה",""],
  ["חיים","לא למלא את היום — לשלוט בו",""],
  ["חיים","גם ליום מנוחה יש תפקיד בתוכנית",""],
  ["חיים","הלוז נועד לשרת אותך, לא לשפוט אותך",""],
  ["חיים","מה שאתה עושה כל יום חזק ממה שאתה עושה פעם אחת",""]
];

/* ============ מאגרי האוכל ============ */
const MEAL_SLOTS = [["b","ארוחת בוקר","08:00"],["l","ארוחת צהריים","12:00"],
                    ["s","ארוחת ביניים","16:00"],["d","ארוחת ערב","20:00"]];

const DISHES = [
  {id:"d1", name:"שניצל + פסטה ברוטב עגבניות", servings:6, min:45,
   lunch:"שניצל + פסטה", dinner:"פסטה + תוספת קלה", freeze:"חזה עוף / שניצלים",
   items:["חזה עוף כ־900 גרם","פסטה 500 גרם","עגבניות מרוסקות 700–800 גרם","בצל","שום","ביצים","פירורי לחם"]},
  {id:"d2", name:"קציצות בקר ברוטב + אורז", servings:6, min:55,
   lunch:"קציצות + אורז", dinner:"קציצות + סלט", freeze:"בשר טחון 800–900 גרם",
   items:["בשר טחון 800–900 גרם","אורז 2 כוסות","עגבניות מרוסקות","ביצה","בצל","שום","פירורי לחם","פטרוזיליה"]},
  {id:"d3", name:"פרגיות + אורז", servings:6, min:40,
   lunch:"פרגיות + אורז", dinner:"פרגיות בפיתה + סלט", freeze:"פרגיות כ־1 ק\"ג",
   items:["פרגיות 1 ק\"ג","אורז 2 כוסות","בצל","שום","פפריקה"]},
  {id:"d4", name:"חזה עוף + תפוחי אדמה", servings:6, min:50,
   lunch:"עוף + תפוחי אדמה", dinner:"עוף + סלט", freeze:"חזה עוף כ־1 ק\"ג",
   items:["חזה עוף 1 ק\"ג","תפוחי אדמה 1.2–1.5 ק\"ג","בצל","שמן","תבלינים"]},
  {id:"d5", name:"עוף בתנור + תפו״א וירקות", servings:6, min:70,
   lunch:"עוף + תפוחי אדמה", dinner:"עוף + סלט", freeze:"כרעיים 1.5–1.8 ק\"ג",
   items:["כרעיים/שוקיים 1.5–1.8 ק\"ג","תפוחי אדמה 1.5 ק\"ג","בצל","גזר","תבלינים"]},
  {id:"d6", name:"פסטה בולונז", servings:6, min:45,
   lunch:"בולונז + פסטה", dinner:"בולונז בקערה קטנה", freeze:"בשר טחון 750–800 גרם",
   items:["בשר טחון 750–800 גרם","פסטה 500 גרם","עגבניות מרוסקות כ־800 גרם","בצל","שום"]},
  {id:"d7", name:"מוקפץ עוף וירקות + אורז", servings:6, min:45,
   lunch:"מוקפץ + אורז", dinner:"מוקפץ בפיתה", freeze:"עוף/פרגיות כ־900 גרם",
   items:["עוף או פרגיות 900 גרם","אורז 2 כוסות","פלפלים","גזר","בצל","סויה","שום"]},
  {id:"d8", name:"קבב בתנור + אורז או פתיתים", servings:6, min:50,
   lunch:"קבב + תוספת", dinner:"קבב בפיתה + סלט", freeze:"בשר טחון כ־900 גרם",
   items:["בשר טחון 900 גרם","בצל","פטרוזיליה","אורז או פתיתים","תבלינים"]},
  {id:"d9", name:"רצועות חזה עוף ברוטב + אורז", servings:6, min:45,
   lunch:"עוף ברוטב + אורז", dinner:"עוף ברוטב בפיתה", freeze:"חזה עוף 1 ק\"ג",
   items:["חזה עוף 1 ק\"ג","אורז 2 כוסות","עגבניות מרוסקות 700–800 גרם","בצל","שום"]},
  {id:"d10", name:"קציצות עוף/הודו + קוסקוס", servings:6, min:50,
   lunch:"קציצות + קוסקוס", dinner:"קציצות + סלט", freeze:"עוף/הודו טחון 900 גרם",
   items:["עוף או הודו טחון 900 גרם","קוסקוס 400–500 גרם","ביצה","בצל","פירורי לחם","רוטב עגבניות"]},
  {id:"d11", name:"שווארמה ביתית מפרגיות", servings:6, min:40,
   lunch:"שווארמה + אורז", dinner:"שווארמה בפיתה + סלט", freeze:"פרגיות 1 ק\"ג",
   items:["פרגיות 1 ק\"ג","2 בצלים","תבלין שווארמה","פפריקה","כמון","אורז 2 כוסות"]},
  {id:"d12", name:"עוף עם אפונה וגזר ברוטב + אורז", servings:6, min:50,
   lunch:"עוף ברוטב + אורז", dinner:"עוף ברוטב + פיתה", freeze:"עוף 1 ק\"ג",
   items:["עוף 1 ק\"ג","אפונה וגזר 500–600 גרם","אורז 2 כוסות","בצל","עגבניות מרוסקות","שום"]}
];

const BREAKFASTS = [
  {id:"b1", name:"חביתה בפיתה", min:"10–15"},
  {id:"b2", name:"סלמון בפיתה", min:"12–18"},
  {id:"b3", name:"טונה בפיתה", min:"5–7"},
  {id:"b4", name:"ביצים קשות + פיתה וירקות", min:"3–15"},
  {id:"b5", name:"קוטג׳ בפיתה + ירקות", min:"5"},
  {id:"b6", name:"חביתה + גבינה בפיתה", min:"10–12"},
  {id:"b7", name:"טוסט פיתה עם טונה וגבינה", min:"8–10"},
  {id:"b8", name:"שקשוקה מהירה + פיתה", min:"15–20"},
  {id:"b9", name:"חביתה + טונה בפיתה", min:"10–12"}
];

const SNACKS = [
  {id:"s1", name:"סלט + 2 ביצים קשות", min:"5–8"},
  {id:"s2", name:"סלט + טונה", min:"5"},
  {id:"s3", name:"סלט + קוטג׳", min:"5"},
  {id:"s4", name:"סלט + גבינה בולגרית", min:"5"},
  {id:"s5", name:"סלט + ביצה + פרי", min:"6"},
  {id:"s6", name:"טונה בפיתה קטנה + ירקות", min:"5"},
  {id:"s7", name:"2 ביצים + ירקות + חצי פיתה", min:"3–5"},
  {id:"s8", name:"קוטג׳ + ירקות + פרי", min:"3"},
  {id:"s9", name:"סלט + שאריות חלבון מהבישול", min:"5"}
];

const QUICK = [
  {id:"q1", name:"חביתה + סלט + פיתה", min:"10–12"},
  {id:"q2", name:"טונה בפיתה + ירקות", min:"5"},
  {id:"q3", name:"טוסט גבינה + סלט", min:"7–10"},
  {id:"q4", name:"קוטג׳ + ביצים + ירקות", min:"5"},
  {id:"q5", name:"שקשוקה מהירה", min:"15"},
  {id:"q6", name:"סלמון במחבת + סלט", min:"12–15"},
  {id:"q7", name:"ביצים + גבינה + ירקות", min:"3–5"},
  {id:"q8", name:"פיתה עם שאריות מהבישול", min:"5–7"},
  {id:"q9", name:"סלט גדול + חלבון", min:"8"},
  {id:"q10", name:"ארוחת מזווה — טונה, פיתה, ירקות", min:"5"}
];

const DEFAULT_WEEK = [
  {day:"work19", eve:"fitness"},
  {day:"work19", eve:"fitness"},
  {day:"work16", eve:"cook"},
  {day:"work16", eve:"errands"},
  {day:"work16", eve:"social"},
  {day:"friday_work", eve:"shabbat_eve"},
  {day:"shabbat", eve:"motzash"}
];

/* ============ מצב ============ */
let week    = DEFAULT_WEEK.map(d=>({...d}));
let done    = {};
let notes   = {};
let review  = {};
let goals   = [];
let longGoals = [];
let history = [];
let customDays = {};
let overrides = {};   /* התאמות ליום בודד, לפי תאריך */
let course = { name:"יועץ כלכלי", total:16, first:3, deadline:"2026-10-15",
               minPerPage:4, verbalPct:50, qMinutes:75, qCount:15, reviewBlock:false, pagesPerBlock:20 };
let lessons = {};          /* "3": {title, pages, read, verbal, qDone, qWrong} */
let focus = { lesson:3, stage:"study" };
let weekPlan = {};         /* תאריך תחילת שבוע -> [3,4] */
let blockLink = {};        /* "תאריך:מספר בלוק" -> {lesson, stage} */
let errorsBank = [];       /* {lesson, text, done} */
let assign = {};           /* "תאריך:בלוק" -> {lesson, stage, a, b, idx, of} */
let cookPlan = {};         /* תאריך תחילת שבוע -> {sat:dishId, tue:dishId} */
let menu = {};             /* "תאריך:slot" -> מזהה ארוחה */
let eaten = {};            /* "תאריך:slot" -> true, אכלתי בפועל */
let workouts = {};         /* "תאריך" -> true, עשיתי כושר */
let cooked = {};           /* תאריך תחילת שבוע -> {sat:bool, tue:bool}, בישלתי בפועל */
let fitnessTarget = 2;     /* יעד אימוני כושר לשבוע */
let monthAnchorDay = null; /* יום־בחודש שממנו מתחילה כל "תקופה" במעקב החודשי (נקבע פעם אחת, לפי היום הראשון שנפתח המעקב) */
let monthView = null;      /* תאריך תחילת התקופה המוצגת כרגע במעקב החודשי */
let selectedCalDay = null; /* היום שנבחר בלוח השנה של המעקב החודשי */
let unassigned = [];       /* פריטים שלא נכנסו לשבוע */
let noStudy = ["2026-09-11","2026-09-12","2026-09-13","2026-09-20","2026-09-21",
               "2026-09-25","2026-09-26","2026-10-03"];   /* חגי תשרי */
const STAGES = [["study","קריאה והשמעה"],["quest","15 שאלות"],
                ["recall","עמוד סיכום מהזיכרון"]];
let customEves = {};
let weekStart = defaultWeekStart();
let selected  = new Date().getDay();
let ovDay     = new Date().getDay();
let dayOpen   = false;
let tab       = "today";
let subTab    = "goals";
let planMode  = "day";
let lastQuote = -1;
let editDay   = null;   /* טיוטת עריכת תבנית יום */
let editEve   = null;
let editOv    = null;   /* עריכת יום בודד */

/* ============ עזרים ============ */
const toMin = t => (+t.slice(0,2))*60 + (+t.slice(3));
const toStr = m => String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const dkey = i => addDays(weekStart, i);
const doneOf = i => done[dkey(i)] || [];
const setDone = (i, arr) => { done[dkey(i)] = arr; };
const nkey = (i, num) => dkey(i)+":"+num;
const noteOf = (i, num) => notes[nkey(i,num)] || "";
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const numT = t => (/^\d/.test(t||"") ? "num" : "");

function iso(d){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function sundayOf(d){
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - x.getDay());
  return iso(x);
}
function addDays(isoStr, n){
  const p = isoStr.split("-").map(Number);
  const d = new Date(p[0], p[1]-1, p[2]);
  d.setDate(d.getDate()+n);
  return iso(d);
}
function defaultWeekStart(){
  /* תמיד השבוע שמכיל את היום — כדי שהתאריכים באפליקציה יהיו התאריכים האמיתיים */
  return sundayOf(new Date());
}
function todayInWeek(){
  const t = iso(new Date());
  for(let i=0;i<7;i++) if(addDays(weekStart,i) === t) return true;
  return false;
}
function short(isoStr){ const p = isoStr.split("-"); return (+p[2])+"/"+(+p[1]); }
const rangeText = s => short(s)+"–"+short(addDays(s,6));
const todayISO = () => iso(new Date());
const nowMin = () => { const d=new Date(); return d.getHours()*60+d.getMinutes(); };

function dayTpl(k){ return customDays[k] || BUILTIN_DAYS[k] || BUILTIN_DAYS.none; }
function dayTplAt(i){ return overrides[dkey(i)] || dayTpl((week[i]||{}).day); }
const hasOverride = i => !!overrides[dkey(i)];
function eveTpl(k){ return customEves[k] || BUILTIN_EVES[k] || BUILTIN_EVES.none; }
function allDays(){ return Object.assign({}, BUILTIN_DAYS, customDays); }
function allEves(){ return Object.assign({}, BUILTIN_EVES, customEves); }
const blocksOf = tpl => tpl.rows.filter(r=>r.block).length;

/* ============ מעקב חודשי — עזרים ============
   כל "תקופה" היא חודש מתגלגל שמתחיל ביום־בחודש הקבוע (monthAnchorDay) —
   למשל אם המעקב נפתח לראשונה ב־16 בחודש, כל תקופה תהיה 16 עד 15 בחודש הבא,
   ולא חודש קלנדרי. אם היום הקבוע גדול ממספר הימים בחודש היעד (למשל 31 בפברואר),
   משתמשים ביום האחרון של אותו חודש. */
function daysInCalMonth(y, m){ return new Date(y, m, 0).getDate(); }   /* m = 1..12 */
/* תחילת התקופה n חודשים אחרי/לפני זו שמתחילה ב-startISO */
function addPeriod(startISO, n){
  const p = startISO.split("-").map(Number);
  const y0 = p[0], m0 = p[1]-1+n;
  const d = new Date(y0, m0, 1);
  const dim = daysInCalMonth(d.getFullYear(), d.getMonth()+1);
  const day = Math.min(monthAnchorDay, dim);
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
}
/* תחילת התקופה שמכילה תאריך נתון */
function periodStartFor(dateISO){
  const p = dateISO.split("-").map(Number);
  let y = p[0], m = p[1];
  if(p[2] < monthAnchorDay){ m -= 1; if(m===0){ m=12; y-=1; } }
  const day = Math.min(monthAnchorDay, daysInCalMonth(y,m));
  return y+"-"+String(m).padStart(2,"0")+"-"+String(day).padStart(2,"0");
}
function periodLabel(startISO){ return short(startISO)+"–"+short(addDays(addPeriod(startISO,1),-1)); }
function periodDates(startISO){
  const endExclusive = addPeriod(startISO,1);
  const out = [];
  let d = startISO;
  while(d < endExclusive){ out.push(d); d = addDays(d,1); }
  return out;
}
function weeksInPeriod(startISO){
  const start = sundayOf(new Date(startISO+"T12:00:00"));
  const last = addDays(addPeriod(startISO,1), -1);
  const out = [];
  let ws = start;
  while(ws <= last){ out.push(ws); ws = addDays(ws,7); }
  return out;
}
/* קובע פעם אחת בלבד (ונשמר) מאיזה יום־בחודש סופרים תקופה, ומאתחל את התקופה המוצגת */
function ensureMonthAnchor(){
  if(monthAnchorDay == null) monthAnchorDay = new Date().getDate();
  if(monthView == null) monthView = periodStartFor(todayISO());
}
/* מטרת בלוקים ליום נתון: לפי התאמה אישית, ואם אין — לפי התבנית הקבועה של יום השבוע הזה */
function dayTargetFor(dateISO){
  if(overrides[dateISO]) return overrides[dateISO].target;
  const wd = new Date(dateISO+"T12:00:00").getDay();
  const cfg = week[wd] || {day:"none"};
  return dayTpl(cfg.day).target;
}
/* רשומת יום מהיסטוריה של שבוע שנסגר, אם קיימת */
function historyDayFor(dateISO){
  for(const h of history){
    if(!h.days) continue;
    const found = h.days.find(d=>d.date===dateISO);
    if(found) return found;
  }
  return null;
}
/* בלוקי לימוד ליום נתון: לפי done[] אם קיים, אחרת לפי היסטוריה, אחרת (יום עבר) 0, אחרת אין נתון עדיין */
function dayStudyInfo(dateISO){
  const target = dayTargetFor(dateISO);
  let marked;
  if(done.hasOwnProperty(dateISO)) marked = (done[dateISO]||[]).length;
  else{
    const hd = historyDayFor(dateISO);
    if(hd) marked = hd.marked;
    else if(dateISO < todayISO()) marked = 0;
    else marked = null;
  }
  return {target, marked};
}
function dayMealsInfo(dateISO){
  const done1 = MEAL_SLOTS.filter(([slot])=>eaten[dateISO+":"+slot]).length;
  return {target:4, done:done1};
}
function weekCookedInfo(ws){
  const c = cooked[ws] || {sat:false, tue:false};
  return {done:(c.sat?1:0)+(c.tue?1:0), target:2, sat:!!c.sat, tue:!!c.tue};
}
function weekFitnessInfo(ws){
  let cnt = 0;
  for(let i=0;i<7;i++) if(workouts[addDays(ws,i)]) cnt++;
  return {done:cnt, target:fitnessTarget};
}

function dayWord(n, target){
  if(n === 0) return ["עוד לא התחלת","הבלוק הראשון הוא ההתחלה"];
  if(n < 4)   return ["התחלת","כל בלוק נספר, גם ביום עמוס"];
  if(n < target) return ["יום עמוס — ושמרת על הלימודים","זה עדיין יום מוצלח"];
  if(n === target) return ["עמדת ביעד","זה כל מה שהיום הזה צריך"];
  if(n <= target+2) return ["יום חזק מאוד","מעבר ליעד"];
  return ["יום יוצא דופן","בונוס, לא סטנדרט חדש"];
}
function weekVerdict(k){
  const n = CRITERIA.length;
  if(k === 0) return ["עדיין לא סיכמת","סמן את מה שהתקיים השבוע"];
  if(k <= Math.floor(n/3)) return ["שבוע קשה","שווה לבדוק מה גזל את הזמן — לא להוסיף עוד עומס"];
  if(k < n-1) return ["שבוע סביר","משהו אחד או שניים נדחקו הצידה, וזה קורה"];
  return ["שבוע מוצלח",`${n-1} או ${n} מתוך ה${n===6?"שישה":"חמישה"} — זה הרף`];
}

/* ============ קורס ============ */
function lsn(n){
  const k = String(n);
  if(!lessons[k]) lessons[k] = {title:"", pages:90, read:0, verbal:false,
                                qDone:0, qWrong:0, recall:false};
  const l = lessons[k];
  if(!l.pages) l.pages = 90;
  return l;
}
const stageDone = (n, st) => {
  const l = lsn(n);
  if(st === "study") return l.read >= l.pages;
  if(st === "recall") return !!l.recall;
  return l.qDone >= course.qCount;
};
const lessonDone = n => STAGES.every(([st]) => stageDone(n, st));
function lessonPct(n){
  const l = lsn(n);
  const r = Math.min(1, l.pages ? l.read/l.pages : 0);
  const q = Math.min(1, course.qCount ? l.qDone/course.qCount : 0);
  return (r + q + (l.recall?1:0)) / 3;
}
function lessonBlocks(n){
  const l = lsn(n);
  const ppb = Math.max(1, course.pagesPerBlock || 20);
  const studyB = Math.ceil(l.pages / ppb);             /* קריאה + השמעה באותו בלוק */
  const questB = Math.max(1, Math.ceil(course.qMinutes/45));
  return studyB + questB + 1;                          /* + עמוד סיכום מהזיכרון */
}
function lessonList(){
  const out = [];
  for(let n = course.first; n <= course.total; n++) out.push(n);
  return out;
}
const completedLessons = () => lessonList().filter(lessonDone).length;
const remainingLessons = () => lessonList().length - completedLessons();

function isStudyDay(dateISO, i){
  if(noStudy.indexOf(dateISO) > -1) return false;
  const d = new Date(dateISO+"T12:00:00");
  if(d.getDay() === 6) return false;              /* שבת */
  return true;
}
/* בלוקים זמינים בשבוע נתון, בלי שבתות וחגים */
function availableBlocks(startISO){
  let sum = 0;
  for(let i=0;i<7;i++){
    const d = addDays(startISO,i);
    if(!isStudyDay(d,i)) continue;
    const tpl = (startISO === weekStart) ? dayTplAt(i) : dayTpl((week[i]||{}).day);
    sum += tpl.target;
  }
  return sum;
}
function weeksLeft(){
  if(!course.deadline) return 0;
  const end = new Date(course.deadline+"T12:00:00");
  const start = new Date(weekStart+"T12:00:00");
  return Math.max(1, Math.ceil((end - start)/(7*24*3600*1000)));
}
function paceInfo(){
  const rem = remainingLessons(), wl = weeksLeft();
  const need = rem / wl;
  const planned = 2;                                     /* הקצב שנקבע */
  /* היתכנות אמיתית: בלוקים דרושים מול בלוקים זמינים עד היעד */
  const needBlocks = lessonList().filter(n=>!lessonDone(n))
                                 .reduce((a,n)=>a+lessonBlocks(n), 0);
  let haveBlocks = 0;
  for(let k=0;k<wl;k++) haveBlocks += availableBlocks(addDays(weekStart, k*7));
  return {rem, wl, need, planned, needBlocks, haveBlocks,
          late: need > planned + 0.15 || needBlocks > haveBlocks};
}
const planOf = () => weekPlan[weekStart] || [];

/* תור הפריטים של השבוע — לפי הסדר: קריאה, השמעה, שאלות, ואז השיעור הבא */
function weekQueue(){
  const q = [];
  planOf().forEach(n=>{
    const l = lsn(n);
    const ppb = Math.max(1, course.pagesPerBlock || 20);
    const sb = Math.max(1, Math.ceil(l.pages/ppb));
    for(let k=0;k<sb;k++){
      const a = k*ppb+1, b = Math.min(l.pages, (k+1)*ppb);
      if(a <= l.pages) q.push({lesson:n, stage:"study", a, b});
    }
    const qb = Math.max(1, Math.ceil(course.qMinutes/45));
    const qper = Math.ceil(course.qCount/qb);
    for(let k=0;k<qb;k++){
      const a = k*qper+1, b = Math.min(course.qCount, (k+1)*qper);
      if(a <= course.qCount) q.push({lesson:n, stage:"quest", a, b});
    }
    q.push({lesson:n, stage:"recall"});
  });
  return q;
}
const reviewDays = () => {
  let c = 0;
  for(let i=0;i<7;i++){
    const dt = dayTplAt(i);
    if(isStudyDay(dkey(i), i) && dt.target) c++;
  }
  return c;
};
function weekNeed(){
  const lessonsBlocks = planOf().reduce((a,n)=>a+lessonBlocks(n), 0);
  return {lessonsBlocks, rev:0, total: lessonsBlocks};
}

/* פריסה בפועל על הבלוקים של השבוע */
function buildSchedule(){
  const q = weekQueue();
  const next = {};
  for(let i=0;i<7;i++){
    const d = dkey(i), dt = dayTplAt(i);
    if(!isStudyDay(d,i) || !dt.target) continue;
    const rows = buildDay(i).filter(r=>r.block).slice(0, dt.target);
    rows.forEach(r=>{
      if(!q.length) return;
      let pick = 0;
      /* אחרי 17:00 ביום ארוך — לא מתחילים חומר כבד חדש */
      if(r.startM >= 1020){
        const alt = q.findIndex(it => it.stage !== "study");
        if(alt > -1) pick = alt;
      }
      next[d+":"+r.num] = q.splice(pick,1)[0];
    });
  }
  /* שיבוצים של שבועות אחרים נשמרים */
  Object.keys(assign).forEach(k=>{
    const d = k.split(":")[0];
    let inWeek = false;
    for(let i=0;i<7;i++) if(dkey(i) === d) inWeek = true;
    if(!inWeek) next[k] = assign[k];
  });
  assign = next;
  unassigned = q;
  save();
}

function assignLabel(dateISO, num){
  const a = assign[dateISO+":"+num];
  if(!a) return "";
  if(a.stage === "review") return "חזרה — טעויות ושאלות מהיום הקודם";
  if(a.stage === "study")  return `שיעור ${a.lesson} · קריאה והשמעה עמ׳ ${a.a} עד ${a.b}`;
  if(a.stage === "quest")  return `שיעור ${a.lesson} · שאלות ${a.a} עד ${a.b}`;
  return `שיעור ${a.lesson} · עמוד סיכום מהזיכרון`;
}
const itemLabel = it => it.stage === "study"
  ? `שיעור ${it.lesson} · קריאה והשמעה עמ׳ ${it.a} עד ${it.b}`
  : (it.stage === "quest" ? `שיעור ${it.lesson} · שאלות ${it.a} עד ${it.b}`
                          : `שיעור ${it.lesson} · עמוד סיכום מהזיכרון`);

/* ============ בניית יום ============ */
function buildDay(i){
  const cfg = week[i] || {day:"none", eve:"none"};
  const dt = dayTplAt(i);
  const rows = dt.rows.map(r=>({...r}));
  let n = 0;
  rows.forEach(r=>{ if(r.block){ n++; r.num = n; } });

  let cur = toMin(dt.ends);
  let openEnded = false;
  eveTpl(cfg.eve).items.forEach(([what,mins,tone,timeText])=>{
    if(mins === null){
      rows.push({t:null, timeText:timeText||"", what, tone, dim:true});
      openEnded = true; return;
    }
    if(openEnded) return;
    rows.push({t:toStr(cur), what, tone, dim:true, mins});
    cur += mins;
  });
  if(rows.length && !openEnded){
    rows.push({t:toStr(cur), what:"שינה עד 05:25", tone:"sleep", dim:true, last:true});
  }
  rows.forEach((r,idx)=>{
    const nx = rows[idx+1];
    if(!r.t){ r.range = r.timeText; return; }
    const nextT = nx ? (nx.t || dt.ends) : null;
    r.range = r.t + (nextT ? "–"+nextT : "");
    r.startM = toMin(r.t);
    r.endM = nextT ? toMin(nextT) : toMin("05:25")+1440;
    if(r.endM <= r.startM) r.endM += 1440;
  });
  return rows;
}

function totals(){
  let target=0, max=0, marked=0;
  week.forEach((c,i)=>{
    const d = dayTplAt(i);
    target += d.target; max += blocksOf(d); marked += doneOf(i).length;
  });
  return {target, max, marked};
}

/* ============ דף היום ============ */
function todayIndex(){
  const t = todayISO();
  for(let i=0;i<7;i++) if(addDays(weekStart,i) === t) return {i, inWeek:true};
  return {i:new Date().getDay(), inWeek:false};
}

function renderToday(){
  const {i, inWeek} = todayIndex();
  const cfg = week[i], dt = dayTplAt(i);
  const rows = buildDay(i);
  const now = nowMin();
  const marks = doneOf(i);

  const timed = rows.filter(r=>r.t);
  const cur = timed.find(r=> now >= r.startM && now < r.endM);
  const idx = cur ? rows.indexOf(cur) : -1;
  const nxt = idx >= 0 ? rows.slice(idx+1).find(r=>r.what || r.block) : timed[0];

  const label = cur
    ? (cur.block ? "בלוק "+cur.num : cur.what)
    : (timed.length ? "היום עוד לא התחיל" : "אין לוז ליום הזה");
  const sub = cur
    ? (cur.block ? (noteOf(i,cur.num) || assignLabel(dkey(i), cur.num) || cur.focus) : cur.range)
    : (timed.length ? "מתחיל ב־"+timed[0].t : "");
  const left = cur ? Math.max(0, cur.endM - now) : 0;
  const pct = cur ? Math.min(100, Math.round(((now - cur.startM)/(cur.endM - cur.startM))*100)) : 0;
  const clock = toStr(now);

  document.getElementById("nowCard").innerHTML = `
    <div class="now-top">
      <div class="now-day">${DAYS[i]}<i>${short(todayISO())}</i></div>
      <div class="now-clock">${clock}</div>
    </div>
    ${inWeek ? "" : `<div class="warn">הלוז שמוצג כאן הוא של השבוע ${rangeText(weekStart)},
      לפי יום ${DAYS[i]} שבו. <button class="ghost" id="jumpWeek">עבור לשבוע הנוכחי</button></div>`}
    <div class="now-lbl">${cur ? "עכשיו" : "לפני תחילת היום"}</div>
    <p class="now-what">${esc(label)}</p>
    ${sub ? `<div class="now-sub">${esc(sub)}</div>` : ""}
    ${cur ? `<div class="bar"><i style="width:${pct}%"></i></div>
      <div class="now-sub">נשארו ${left} דקות · עד ${toStr(cur.endM%1440)}</div>` : ""}
    ${cur && cur.block ? `
      <button class="bigbtn ${marks.includes(cur.num)?"undo":""}" id="doneNow">
        ${marks.includes(cur.num) ? "בוצע ✓ — לביטול" : "סיימתי את הבלוק"}</button>` : ""}
    ${nxt ? `<div class="next"><span class="t">${nxt.t || nxt.timeText || ""}</span>
      <b>הבא:</b> ${esc(nxt.block ? (assignLabel(dkey(i), nxt.num) || "בלוק "+nxt.num) : nxt.what)}</div>` : ""}`;

  const dn = document.getElementById("doneNow");
  if(dn) dn.addEventListener("click", ()=>{
    const m = doneOf(i), on = m.includes(cur.num);
    setDone(i, on ? m.filter(x=>x!==cur.num) : m.concat(cur.num).sort((a,b)=>a-b));
    linkBlock(i, cur.num, !on);
    renderAll(); save();
  });

  /* בלוקים ליום */
  const blocks = rows.filter(r=>r.block);
  const [word, wsub] = dayWord(marks.length, dt.target);
  document.getElementById("todayBlocks").innerHTML = blocks.length ? `
    <div class="dv-head">
      <h3>בלוקים היום</h3>
      <div class="scale">יעד <em>${dt.target}</em></div>
    </div>
    <div class="meter">
      <div class="meter-top">
        <div class="meter-count">${marks.length}</div>
        <div><div class="meter-word">${word}</div><div class="meter-sub">${wsub}</div></div>
      </div>
      <div class="pips">${blocks.map((b,k)=>
        `<div class="pip ${k<marks.length?"on":""} ${k+1===dt.target?"goal":""}"></div>`).join("")}</div>
    </div>
    <div class="chips">${blocks.map(b=>
      `<button class="chip ${marks.includes(b.num)?"on":""} ${b.endM<=now?"past":""}"
               data-tblock="${b.num}" title="${esc(assignLabel(dkey(i), b.num))}">
         <b>${b.num}</b><small>${b.t}</small>${(()=>{
           const a = assign[dkey(i)+":"+b.num];
           if(!a) return "";
           const m = {study:"לימוד", quest:"שאלות", recall:"סיכום"}[a.stage] || "";
           return `<small>${m}</small>`;
         })()}</button>`).join("")}</div>
    <details class="focuswrap" id="focusWrap">
      <summary>שיעור ${focus.lesson} · ${(STAGES.find(x=>x[0]===focus.stage)||["",""])[1]} — שינוי ידני</summary>
      ${focusHTML()}
    </details>
    ${errorsBank.filter(e=>!e.done).length
      ? `<p class="hint" style="margin:10px 0 0">${errorsBank.filter(e=>!e.done).length} שאלות פתוחות בבנק הטעויות.</p>`
      : `<p class="hint" style="margin:10px 0 0">העבודה קודמת לבלוק. מה שלא יצא — לא נגרר למחר.</p>`}`
    : `<div class="dv-head"><h3>בלוקים היום</h3></div>
       <p class="empty">היום הזה בלי בלוקי לימוד. זה חלק מהתוכנית, לא חריגה ממנה.</p>`;

  const jw = document.getElementById("jumpWeek");
  if(jw) jw.addEventListener("click", ()=>{
    weekStart = sundayOf(new Date());
    selected = new Date().getDay();
    renderAll(); save();
  });

  const fw = document.getElementById("focusWrap");
  if(fw) bindFocus(fw);

  document.querySelectorAll("[data-tblock]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const num = +b.dataset.tblock;
      const m = doneOf(i);
      const on = m.includes(num);
      setDone(i, on ? m.filter(x=>x!==num) : m.concat(num).sort((a,b)=>a-b));
      linkBlock(i, num, !on);
      renderAll(); save();
    });
  });

  /* ארוחות היום */
  const today0 = todayISO();
  const eatenToday = MEAL_SLOTS.filter(([slot])=>eaten[today0+":"+slot]).length;
  const anyMeal = MEAL_SLOTS.some(([slot])=>mealOf(i, slot));
  document.getElementById("todayMeals").innerHTML = `
    <div class="dv-head"><h3>ארוחות היום</h3>
      <div class="scale">${eatenToday} מתוך 4 סומנו כנאכלו</div></div>
    <div class="meals">${MEAL_SLOTS.map(([slot,label,time])=>{
        const nm = mealLabel(i, slot);
        const tm = toMin(time);
        const isNow = now >= tm - 45 && now < tm + 90;
        const ate = !!eaten[today0+":"+slot];
        return `<div class="meal ${nm?"":"empty"} ${isNow?"now":""} ${ate?"eaten":""}">
          <b>${time}</b><span>${nm ? esc(nm) : label + " — לא נקבע"}</span>
          <span class="tick" role="checkbox" tabindex="0" aria-checked="${ate}"
                aria-label="אכלתי ${esc(label)}" data-eatslot="${slot}"></span></div>`;
      }).join("")}</div>
    ${anyMeal ? "" : `<p class="hint" style="margin:10px 0 0">אפשר לקבוע גם את התפריט בעוד ← אוכל.</p>`}`;

  document.querySelectorAll("[data-eatslot]").forEach(el=>{
    const hit = ()=>{
      const k = today0+":"+el.dataset.eatslot;
      if(eaten[k]) delete eaten[k]; else eaten[k] = true;
      renderAll(); save();
    };
    el.addEventListener("click", hit);
    el.addEventListener("keydown", e=>{ if(e.key===" "||e.key==="Enter"){ e.preventDefault(); hit(); } });
  });

  /* כושר */
  const won = !!workouts[today0];
  const wInfo = weekFitnessInfo(sundayOf(new Date()));
  document.getElementById("todayHabits").innerHTML = `
    <div class="dv-head"><h3>כושר</h3>
      <div class="scale">${wInfo.done} מתוך ${wInfo.target} השבוע</div></div>
    <button class="bigbtn ${won?"undo":""}" id="workoutToggle">
      ${won ? "בוצע כושר היום ✓ — לביטול" : "עשיתי כושר היום"}</button>`;
  document.getElementById("workoutToggle").addEventListener("click", ()=>{
    if(workouts[today0]) delete workouts[today0]; else workouts[today0] = true;
    renderAll(); save();
  });

  /* מטרות פתוחות */
  const open = goals.filter(g=>!g.done);
  document.getElementById("todayGoals").innerHTML = `
    <div class="dv-head"><h3>מטרות פתוחות השבוע</h3>
      <div class="scale">${goals.length ? goals.filter(g=>g.done).length+" מתוך "+goals.length : "אין מטרות"}</div>
    </div>
    ${open.length
      ? `<div class="goals">${open.map(g=>
          `<div class="goal"><span class="tick"></span><span class="txt">${esc(g.text)}</span></div>`).join("")}</div>`
      : `<p class="empty">${goals.length ? "כל המטרות סומנו. שבוע טוב." : "אפשר להגדיר מטרות בדף המטרות."}</p>`}`;
}

/* ============ דף לוז ============ */
function renderDate(){
  document.getElementById("wstart").value = weekStart;
  document.getElementById("rangeTxt").textContent = rangeText(weekStart);
}

function renderWeek(){
  const today = todayISO();
  const banner = todayInWeek() ? "" :
    `<div class="warn">השבוע שמוגדר כאן הוא ${rangeText(weekStart)} — היום (${short(today)}) לא נמצא בו.
      <button class="ghost" id="jumpWeek2">עבור לשבוע הנוכחי</button></div>`;
  document.getElementById("planBanner").innerHTML = banner;
  const jb = document.getElementById("jumpWeek2");
  if(jb) jb.addEventListener("click", ()=>{
    weekStart = sundayOf(new Date());
    selected = new Date().getDay();
    renderAll(); save();
  });

  document.getElementById("planDays").innerHTML = DAYS.map((name,i)=>{
    const d = addDays(weekStart,i);
    return `<button class="ovpick ${i===selected?"on":""} ${d===today?"today":""}" data-pick="${i}">
      <b>${name}</b><small>${short(d)}</small></button>`;
  }).join("");

  const i = selected, cfg = week[i], dt = dayTplAt(i), nb = blocksOf(dt);
  document.getElementById("dayEditor").innerHTML = `
    <div class="daycard active ${nb?"":"rest"}">
      <div class="daycard-top">
        <div class="dayname">${DAYS[i]}<i>${short(addDays(weekStart,i))}</i></div>
        <div class="daymeta">${nb ? `יעד <em>${dt.target}</em> · סומנו ${doneOf(i).length}` : "ללא לימודים"}</div>
      </div>
      <div class="selects">
        <label class="field"><span>תבנית יום</span>
          <select data-i="${i}" data-k="day">
            ${Object.entries(allDays()).map(([k,v])=>
              `<option value="${k}" ${k===cfg.day?"selected":""}>${esc(v.name)}</option>`).join("")}
          </select></label>
        <label class="field"><span>תבנית ערב</span>
          <select data-i="${i}" data-k="eve">
            ${Object.entries(allEves()).map(([k,v])=>
              `<option value="${k}" ${k===cfg.eve?"selected":""}>${esc(v.name)}</option>`).join("")}
          </select></label>
      </div>
    </div>`;

  document.getElementById("weekRows").innerHTML = week.map((c,k)=>{
    const d = dayTplAt(k);
    return `<button class="wrow ${k===selected?"on":""}" data-pick="${k}">
      <b>${DAYS[k]}</b><i>${short(addDays(weekStart,k))}</i>
      <span>${esc(d.name)} · ${esc(eveTpl(c.eve).name)}</span>
      ${blocksOf(d) ? `<em>${doneOf(k).length}/${d.target}</em>` : ""}
    </button>`;
  }).join("");

  document.querySelectorAll("[data-pick]").forEach(b=>{
    b.addEventListener("click", ()=>{ selected = +b.dataset.pick; dayOpen = false; renderAll(); });
  });
  document.querySelectorAll("#dayEditor select").forEach(sel=>{
    sel.addEventListener("change", e=>{
      const idx = +e.target.dataset.i, k = e.target.dataset.k;
      week[idx][k] = e.target.value;
      if(k === "day"){
        const mx = blocksOf(dayTplAt(idx));
        setDone(idx, doneOf(idx).filter(n => n <= mx));
      }
      renderAll(); save();
    });
  });
}

function renderDay(){
  const dv = document.getElementById("dayview");
  const dt = dayTplAt(selected);
  const rows = buildDay(selected);
  const marks = doneOf(selected);
  const n = marks.length;
  const nb = blocksOf(dt);
  const isToday = addDays(weekStart,selected) === todayISO();
  const now = nowMin();

  const scale = nb
    ? `<div class="scale">יעד <em>${dt.target}</em> בלוקים · עד ${nb} אפשרי</div>`
    : `<div class="scale">יום בלי בלוקי לימוד</div>`;

  let meter = "";
  if(nb){
    const [word, sub] = dayWord(n, dt.target);
    meter = `<div class="meter">
      <div class="meter-top"><div class="meter-count">${n}</div>
        <div><div class="meter-word">${word}</div><div class="meter-sub">${sub}</div></div></div>
      <div class="pips">${Array.from({length:nb},(_,k)=>
        `<div class="pip ${k<n?"on":""} ${k+1===dt.target?"goal":""}"></div>`).join("")}</div>
    </div>`;
  }

  const body = rows.length ? `<div class="ribbon">${rows.map(r=>{
    const isNow = isToday && r.t && now >= r.startM && now < r.endM;
    return r.block
      ? `<div class="row block ${marks.includes(r.num)?"done":""} ${isNow?"now":""}" style="--tone:var(--study)">
           <div class="time ${numT(r.range)}">${r.range}</div>
           <div class="what">
             <span class="tick" role="checkbox" tabindex="0" aria-checked="${marks.includes(r.num)}"
                   aria-label="סימון בלוק ${r.num}" data-block="${r.num}"></span>
             <div class="blk"><span data-block="${r.num}">בלוק ${r.num}</span>
               <input class="blk-note" data-note="${r.num}" placeholder="${esc(blockLabel(selected, r.num, r.focus))}"
                      value="${esc(noteOf(selected,r.num))}"></div>
           </div></div>`
      : `<div class="row ${r.dim?"dim":""} ${isNow?"now":""}" style="--tone:var(--${r.tone})">
           <div class="time ${numT(r.range)}">${r.range}</div>
           <div class="what">${esc(r.what)}${(()=>{
             const ml = rowMealLabel(selected, r);
             return ml ? ` — <b style="font-weight:700">${esc(ml)}</b>` : "";
           })()}</div>
         </div>`;
  }).join("")}</div>` : `<p class="empty">לא נבחרה תבנית ליום הזה.</p>`;

  dv.innerHTML = `
    <div class="dv-head">
      <h3>יום ${DAYS[selected]} · ${short(addDays(weekStart,selected))}</h3>
      ${scale}
      ${n ? `<button class="ghost" id="clearDay">נקה סימונים</button>` : ""}
      <button class="ghost" id="ovBtn">${hasOverride(selected) ? "ערוך התאמה" : "התאם יום זה"}</button>
      ${hasOverride(selected) ? `<button class="ghost" id="ovDel">בטל התאמה</button>` : ""}
    </div>
    ${hasOverride(selected) ? `<div class="warn">ליום הזה יש התאמה אישית שגוברת על התבנית.</div>` : ""}
    ${meter}
    <button class="openday" id="toggleDay">${dayOpen ? "הסתר את הלוז" : "הצג את היום המלא"}</button>
    ${dayOpen ? body : ""}
    ${dayOpen ? `<div class="legend">
      <div><i class="dot" style="background:var(--study)"></i>לימודים</div>
      <div><i class="dot" style="background:var(--work)"></i>עבודה</div>
      <div><i class="dot" style="background:var(--prayer)"></i>תפילה</div>
      <div><i class="dot" style="background:var(--meal)"></i>ארוחות</div>
      <div><i class="dot" style="background:var(--personal)"></i>אישי ומנוחה</div>
      <div><i class="dot" style="background:var(--sleep)"></i>הורדת הילוך ושינה</div>
    </div>` : ""}`;

  dv.querySelectorAll("[data-block]").forEach(el=>{
    const hit = () => toggleBlock(+el.dataset.block);
    el.addEventListener("click", hit);
    el.addEventListener("keydown", e=>{
      if(e.key===" "||e.key==="Enter"){ e.preventDefault(); hit(); }
    });
  });
  dv.querySelectorAll("[data-note]").forEach(inp=>{
    inp.addEventListener("input", ()=>{
      const key = nkey(selected, inp.dataset.note);
      if(inp.value.trim()) notes[key] = inp.value; else delete notes[key];
      save();
    });
  });
  const clr = document.getElementById("clearDay");
  if(clr) clr.addEventListener("click", ()=>{ setDone(selected, []); renderAll(); save(); });
  document.getElementById("toggleDay").addEventListener("click", ()=>{ dayOpen = !dayOpen; renderDay(); });
  document.getElementById("ovBtn").addEventListener("click", ()=>{
    const src = dayTplAt(selected);
    editOv = {date:dkey(selected), name:src.name, ends:src.ends, target:src.target,
              rows:src.rows.map(r=>({...r}))};
    renderOvEditor();
    document.getElementById("ovEditor").scrollIntoView({behavior:"smooth",block:"start"});
  });
  const ovd = document.getElementById("ovDel");
  if(ovd) ovd.addEventListener("click", ()=>{
    delete overrides[dkey(selected)];
    editOv = null; renderAll(); save();
  });
}

function toggleBlock(num){
  const m = doneOf(selected);
  const on = m.includes(num);
  setDone(selected, on ? m.filter(x=>x!==num) : m.concat(num).sort((a,b)=>a-b));
  linkBlock(selected, num, !on);
  renderAll(); save();
}
/* כל בלוק שמסומן נרשם על השיעור והשלב הפעילים */
function linkBlock(i, num, on){
  const k = dkey(i)+":"+num;
  if(!on){ delete blockLink[k]; return; }
  const a = assign[k];
  if(a && a.stage === "review"){ blockLink[k] = {stage:"review"}; return; }
  const src = a || {lesson:focus.lesson, stage:focus.stage};
  blockLink[k] = {lesson:src.lesson, stage:src.stage};
  /* סימון בלוק מקדם את ההתקדמות בשיעור */
  const l = lsn(src.lesson);
  if(a && a.stage === "study") l.read = Math.max(l.read, a.b);
  if(a && a.stage === "quest") l.qDone = Math.max(l.qDone, a.b);
  if(a && a.stage === "recall") l.recall = true;
}
function blockLabel(i, num, fallback){
  const a = assignLabel(dkey(i), num);
  if(a) return a;
  const lk = blockLink[dkey(i)+":"+num];
  if(!lk || !lk.lesson) return fallback || "";
  const st = (STAGES.find(x=>x[0]===lk.stage)||["",""])[1];
  return "שיעור "+lk.lesson+" · "+st;
}

function renderStats(){
  const {target,max,marked} = totals();
  const mins = target*45, hh = Math.floor(mins/60), mm = mins%60;
  document.getElementById("wTarget").textContent = target;
  document.getElementById("wMax").textContent = max;
  document.getElementById("wHours").textContent = mm ? `${hh} ש׳ ${mm} ד׳` : `${hh} ש׳`;
  document.getElementById("hoursCalc").textContent = `${target} בלוקים × 45 דקות`;
  document.getElementById("wDone").textContent = marked;
}

/* ============ מבט שבועי ============ */
function ovRows(rows, i){
  const marks = doneOf(i);
  return rows.map(r=>{
    const c = "var(--"+(r.block?"study":r.tone)+")";
    if(r.block){
      return `<div class="ovrow study ${marks.includes(r.num)?"done":""}">
        <div class="t ${numT(r.range)}">${r.range}</div>
        <div class="x" style="--c:${c}">בלוק ${r.num}<small>${
          esc(noteOf(i,r.num) || assignLabel(dkey(i), r.num) || r.focus || "")}</small></div>
      </div>`;
    }
    const ml = rowMealLabel(i, r);
    return `<div class="ovrow"><div class="t ${numT(r.range)}">${r.range}</div>
      <div class="x" style="--c:${c}">${esc(r.what)}${ml?" — "+esc(ml):""}</div></div>`;
  }).join("");
}

function renderOverview(){
  const {target, marked} = totals();
  const el = document.getElementById("ovSummary");
  if(el) el.textContent = `${rangeText(weekStart)} · יעד ${target} · סומנו ${marked}`;

  const today = todayISO();
  document.getElementById("ovGrid").innerHTML = week.map((cfg,i)=>{
    const dt = dayTplAt(i), nb = blocksOf(dt);
    const rows = buildDay(i);
    const p1 = rows.filter(r=>!r.dim), p2 = rows.filter(r=>r.dim);
    const isToday = addDays(weekStart,i) === today;
    return `<div class="ovcard ${nb?"":"rest"} ${isToday?"today":""}">
      <div class="ovtop">
        <div class="ovday">${DAYS[i]}<i>${short(addDays(weekStart,i))}${isToday?" · היום":""}</i></div>
        ${nb ? `<div class="ovchip">${doneOf(i).length}/${dt.target}</div>` : ""}
      </div>
      <div class="ovtpl">${esc(dt.name)} · ${esc(eveTpl(cfg.eve).name)}</div>
      ${p1.length ? `<div class="ovpart">עד סיום המשמרת</div>${ovRows(p1,i)}` : ""}
      ${p2.length ? `<div class="ovpart">מסיום המשמרת עד השינה</div>${ovRows(p2,i)}` : ""}
    </div>`;
  }).join("");
}

/* ============ מערכת האוכל ============ */
const dishById = id => DISHES.find(d=>d.id===id);
const cookOf = () => cookPlan[weekStart] || {sat:"", tue:""};
/* איזו מנה מבושלת רלוונטית ליום i: ראשון–שלישי מהמוצ״ש, רביעי–שישי משלישי */
function cycleDish(i){
  const c = cookOf();
  if(i >= 0 && i <= 2) return dishById(c.sat);
  if(i >= 3 && i <= 5) return dishById(c.tue);
  return dishById(c.tue) || dishById(c.sat);
}
function mealOptions(slot, i, val){
  const d = cycleDish(i);
  if(slot === "b") return BREAKFASTS.map(x=>[x.id, x.name]);
  if(slot === "s") return SNACKS.map(x=>[x.id, x.name]);
  const list = [];
  if(d) list.push(["cycle", d.name + " — " + (slot === "l" ? d.lunch : d.dinner)]);
  else if(val === "cycle") list.push(["cycle", "המנה השבועית — עדיין לא נבחרה (קבעו ב\"מה מבשלים השבוע\")"]);
  DISHES.forEach(x=>{ if(!d || x.id !== d.id) list.push([x.id, x.name]); });
  QUICK.forEach(x=>list.push([x.id, x.name]));
  return list;
}
function mealName(slot, i, val){
  if(!val) return "";
  if(val === "cycle"){
    const d = cycleDish(i);
    return d ? d.name + " — " + (slot === "l" ? d.lunch : d.dinner)
             : "המנה השבועית — עדיין לא נבחרה";
  }
  const all = [].concat(DISHES, BREAKFASTS, SNACKS, QUICK).find(x=>x.id===val);
  return all ? all.name : "";
}
const mealOf = (i, slot) => menu[dkey(i)+":"+slot] || "";
function mealLabel(i, slot){ return mealName(slot, i, mealOf(i, slot)); }

/* התאמת שורת ארוחה בלוז לארוחה בתפריט לפי השעה */
function slotForRow(r){
  if(!r || r.tone !== "meal" || !r.t) return null;
  const m = toMin(r.t);
  if(m < 630) return "b";
  if(m >= 690 && m < 870) return "l";
  if(m >= 870 && m < 1110) return "s";
  if(m >= 1110) return "d";
  return null;
}
function rowMealLabel(i, r){
  const slot = slotForRow(r);
  if(!slot) return "";
  return mealLabel(i, slot);
}

function fillMenuDefaults(){
  const bRot = ["b1","b2","b3","b1","b2","b3","b1"];   /* חביתה, סלמון, טונה */
  const sRot = ["s1","s2","s3","s1","s2","s4","s2"];
  for(let i=0;i<7;i++){
    const d = dkey(i);
    if(!menu[d+":b"]) menu[d+":b"] = bRot[i];
    if(!menu[d+":s"]) menu[d+":s"] = sRot[i];
    if(!menu[d+":l"] && cycleDish(i)) menu[d+":l"] = "cycle";
    if(!menu[d+":d"] && cycleDish(i)) menu[d+":d"] = "cycle";
  }
  save();
}

function renderFood(){
  const c = cookOf();
  document.getElementById("cookRange").textContent = rangeText(weekStart);
  const opts = sel => `<option value="">— בחר מנה —</option>` +
    DISHES.map(d=>`<option value="${d.id}" ${d.id===sel?"selected":""}>${esc(d.name)}</option>`).join("");
  document.getElementById("cookSat").innerHTML = opts(c.sat);
  document.getElementById("cookTue").innerHTML = opts(c.tue);

  const info = [["מוצ״ש", c.sat],["שלישי", c.tue]].map(([lbl,id])=>{
    const d = dishById(id);
    if(!d) return "";
    return `<div class="libitem"><b>${lbl}: ${esc(d.name)}</b>
      <small>${d.servings} מנות · כ־${d.min} דק׳ · מהמקפיא: ${esc(d.freeze)}</small></div>`;
  }).join("");
  document.getElementById("cookInfo").innerHTML = info
    ? `<div style="margin-top:12px">${info}</div>`
    : `<p class="empty">בוחרים שתי מנות והשבוע מסודר.</p>`;

  const cd = cooked[weekStart] || {sat:false, tue:false};
  document.getElementById("cookDone").innerHTML = `
    <button class="chip ${cd.sat?"on":""}" data-cooked="sat">בישלתי במוצ״ש</button>
    <button class="chip ${cd.tue?"on":""}" data-cooked="tue">בישלתי בשלישי</button>`;
  document.querySelectorAll("[data-cooked]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const k = b.dataset.cooked;
      const cur = Object.assign({sat:false,tue:false}, cooked[weekStart]);
      cur[k] = !cur[k];
      cooked[weekStart] = cur;
      renderAll(); save();
    });
  });

  /* תפריט */
  let filled = 0;
  const grid = week.map((cfg,i)=>{
    const d = dkey(i);
    return `<div class="mday">
      <div class="mday-top"><b>${DAYS[i]}</b><i>${short(d)}</i></div>
      ${MEAL_SLOTS.map(([slot,label,time])=>{
        const val = mealOf(i, slot);
        if(val) filled++;
        return `<div class="mrow"><span class="mt">${time}</span>
          <select data-meal="${i}:${slot}">
            <option value="">— ${label} —</option>
            ${mealOptions(slot,i,val).map(([v,n])=>
              `<option value="${v}" ${v===val?"selected":""}>${esc(n)}</option>`).join("")}
          </select></div>`;
      }).join("")}
    </div>`;
  }).join("");
  document.getElementById("menuGrid").innerHTML = grid;
  document.getElementById("menuNote").textContent = `${filled} מתוך 28 ארוחות`;

  document.querySelectorAll("[data-meal]").forEach(sel=>{
    sel.addEventListener("change", ()=>{
      const [i, slot] = sel.dataset.meal.split(":");
      const k = dkey(+i)+":"+slot;
      if(sel.value) menu[k] = sel.value; else delete menu[k];
      renderAll(); save();
    });
  });

  /* מאגרים */
  document.getElementById("libDishes").innerHTML = DISHES.map(d=>
    `<div class="libitem"><b>${esc(d.name)}</b>
      <small>${d.servings} מנות · ${d.min} דק׳</small></div>`).join("");
  const lib = arr => arr.map(x=>
    `<div class="libitem"><b>${esc(x.name)}</b><small>${x.min} דק׳</small></div>`).join("");
  document.getElementById("libB").innerHTML = lib(BREAKFASTS);
  document.getElementById("libS").innerHTML = lib(SNACKS);
  document.getElementById("libQ").innerHTML = lib(QUICK);
}

/* ============ מסך הקורס ============ */
function focusHTML(){
  const n = focus.lesson, l = lsn(n);
  return `<div class="focus">
    <div class="frow">
      <span class="flbl">שיעור</span>
      <select id="fLesson" style="width:auto;min-width:120px">
        ${lessonList().map(k=>`<option value="${k}" ${k===n?"selected":""}>שיעור ${k}${
          lessonDone(k)?" ✓":""}</option>`).join("")}
      </select>
      <span class="flbl">${Math.round(lessonPct(n)*100)}% הושלם</span>
    </div>
    <div class="stages">
      ${STAGES.map(([st,label])=>`<button class="stg ${focus.stage===st?"on":""} ${
        stageDone(n,st)?"fin":""}" data-stg="${st}">${label}${stageDone(n,st)?" ✓":""}</button>`).join("")}
    </div>
    ${focus.stage === "study" ? `
      <div class="frow"><span class="flbl">עמודים</span>
        <div class="counter">
          <button data-pg="-${course.pagesPerBlock}">−</button>
          <b>${l.read} / ${l.pages}</b>
          <button data-pg="${course.pagesPerBlock}">+</button>
        </div>
        <button class="ghost" data-pg="5">+5</button>
        <button class="ghost" data-pgset="1">סיימתי הכל</button>
      </div>
      <div class="frow"><span class="flbl">30 דקות קריאה, ואז 15 דקות הסבר לעצמך — בלי להסתכל בדף.</span></div>` : ""}
    ${focus.stage === "recall" ? `
      <div class="frow">
        <button class="btn ${l.recall?"sec":""}" id="rTog">${
          l.recall ? "בוצע ✓ — לביטול" : "סמן שכתבתי עמוד סיכום מהזיכרון"}</button>
      </div>
      <div class="frow"><span class="flbl">בלי להסתכל בחומר. אחר כך משווים לסיכום.</span></div>` : ""}
    ${focus.stage === "quest" ? `
      <div class="frow"><span class="flbl">נענו</span>
        <div class="counter">
          <button data-q="-1">−</button><b>${l.qDone} / ${course.qCount}</b><button data-q="1">+</button>
        </div>
        <span class="flbl">טעויות</span>
        <div class="counter">
          <button data-qw="-1">−</button><b>${l.qWrong}</b><button data-qw="1">+</button>
        </div>
      </div>` : ""}
  </div>`;
}

function bindFocus(root){
  const sel = root.querySelector("#fLesson");
  if(sel) sel.addEventListener("change", ()=>{ focus.lesson = +sel.value; renderAll(); save(); });
  root.querySelectorAll("[data-stg]").forEach(b=>b.addEventListener("click", ()=>{
    focus.stage = b.dataset.stg; renderAll(); save(); }));
  root.querySelectorAll("[data-pg]").forEach(b=>b.addEventListener("click", ()=>{
    const l = lsn(focus.lesson);
    l.read = Math.max(0, Math.min(l.pages, l.read + (+b.dataset.pg)));
    renderAll(); save(); }));
  root.querySelectorAll("[data-pgset]").forEach(b=>b.addEventListener("click", ()=>{
    const l = lsn(focus.lesson); l.read = l.pages; renderAll(); save(); }));
  const rt = root.querySelector("#rTog");
  if(rt) rt.addEventListener("click", ()=>{
    const l = lsn(focus.lesson); l.recall = !l.recall; renderAll(); save(); });
  root.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click", ()=>{
    const l = lsn(focus.lesson);
    l.qDone = Math.max(0, Math.min(course.qCount, l.qDone + (+b.dataset.q)));
    renderAll(); save(); }));
  root.querySelectorAll("[data-qw]").forEach(b=>b.addEventListener("click", ()=>{
    const l = lsn(focus.lesson);
    l.qWrong = Math.max(0, l.qWrong + (+b.dataset.qw));
    renderAll(); save(); }));
}

function renderCourse(){
  const p = paceInfo();
  const cur = lessonList().find(n=>!lessonDone(n)) || course.total;
  const pct = Math.round((completedLessons()/lessonList().length)*100);
  document.getElementById("courseGoal").innerHTML = `
    <div class="gtop">
      <div>
        <div class="gbig">${esc(course.name)} — שיעור ${cur} מתוך ${course.total}</div>
        <div class="gsub">יעד סיום ${short(course.deadline)} · נותרו ${p.rem} שיעורים ב־${p.wl} שבועות</div>
      </div>
      <div class="pace ${p.late?"late":"ok"}">${p.need.toFixed(1)} שיעורים לשבוע</div>
    </div>
    <div class="gbar"><i style="width:${pct}%"></i></div>
    <div class="ckpt">
      נדרשים <b>${p.needBlocks}</b> בלוקים · זמינים <b>${p.haveBlocks}</b> עד ${short(course.deadline)}
      <br>${p.needBlocks > p.haveBlocks
        ? `חסרים ${p.needBlocks - p.haveBlocks} בלוקים. להזיז את היעד, או לקצר את ההשמעה בעל פה.`
        : (p.need > p.planned + 0.15
            ? `נדרשים ${p.need.toFixed(1)} שיעורים בשבוע — מעל הקצב שנקבע.`
            : `בקצב. הקצב שנקבע הוא 2 שיעורים בשבוע.`)}
    </div>`;

  const fb = document.getElementById("focusBox");
  fb.innerHTML = focusHTML();
  bindFocus(fb);
  document.getElementById("focusNote").textContent =
    `${lessonBlocks(focus.lesson)} בלוקים משוערים לשיעור`;

  /* שיעורי השבוע + מחשבון עומס */
  document.getElementById("wkRange").textContent = rangeText(weekStart);
  const plan = planOf();
  document.getElementById("wkChips").innerHTML = lessonList().map(n=>`
    <button class="wkchip ${plan.indexOf(n)>-1?"on":""}" data-wk="${n}">
      שיעור ${n}${lessonDone(n)?" ✓":""}</button>`).join("");
  document.querySelectorAll("[data-wk]").forEach(b=>b.addEventListener("click", ()=>{
    const n = +b.dataset.wk;
    const cur = planOf().slice();
    const i = cur.indexOf(n);
    if(i > -1) cur.splice(i,1); else cur.push(n);
    weekPlan[weekStart] = cur.sort((a,b)=>a-b);
    renderCourse(); save();
  }));

  const nd = weekNeed();
  const have = availableBlocks(weekStart);
  const box = document.getElementById("loadBox");
  box.className = "loadbox" + (nd.total > have ? " over" : "");
  box.innerHTML = plan.length
    ? `<b>${plan.length} שיעורים = ${nd.lessonsBlocks} בלוקים</b>${
        nd.rev ? ` + ${nd.rev} בלוקי חזרה = <b>${nd.total}</b>` : ""}
       · יש לך ${have} בלוקים ביעד השבועי
       ${nd.total > have
         ? `<br>חסרים ${nd.total-have} בלוקים. הם ישובצו כ"לא נכנס השבוע" — אפשר לכסות אותם בבלוקים עודפים ביום שקט.`
         : `<br>מתאים. נשארו ${have-nd.total} בלוקים כמרווח.`}`
    : "בחר שיעורים לשבוע כדי לראות אם הם נכנסים בזמן.";

  /* תצוגת השיבוץ */
  const prev = document.getElementById("allocPreview");
  let rowsHtml = "";
  for(let i=0;i<7;i++){
    const d = dkey(i), dt = dayTplAt(i);
    const items = [];
    buildDay(i).filter(r=>r.block).forEach(r=>{
      const lab = assignLabel(d, r.num);
      if(lab) items.push(`<div class="ovrow"><div class="t num">${r.t}</div>
        <div class="x" style="--c:var(--study)">${lab}</div></div>`);
    });
    if(items.length) rowsHtml += `<div class="ovpart">${DAYS[i]} ${short(d)}</div>${items.join("")}`;
  }
  prev.innerHTML = rowsHtml
    ? `<div style="margin-top:12px">${rowsHtml}
        ${unassigned.length ? `<div class="loadbox over" style="margin-top:12px">
          <b>לא נכנס השבוע (${unassigned.length} בלוקים):</b><br>
          ${unassigned.slice(0,8).map(itemLabel).join("<br>")}
          ${unassigned.length>8?"<br>ועוד "+(unassigned.length-8):""}</div>` : ""}</div>`
    : "";

  /* רשימת שיעורים */
  document.getElementById("lsnNote").textContent =
    `${completedLessons()} הושלמו · ${remainingLessons()} נותרו`;
  document.getElementById("lsnList").innerHTML = lessonList().map(n=>{
    const l = lsn(n);
    const r = Math.min(100, l.pages ? Math.round(l.read/l.pages*100) : 0);
    const q = Math.min(100, Math.round(l.qDone/course.qCount*100));
    return `<div class="lsn ${lessonDone(n)?"done":""} ${n===focus.lesson?"active":""}">
      <b>שיעור ${n}</b>
      <div class="bars">
        <div class="sb"><i style="width:${r}%"></i></div>
        <div class="sb"><i style="width:${q}%"></i></div>
        <div class="sb"><i style="width:${l.recall?100:0}%"></i></div>
      </div>
      <small>${l.read}/${l.pages} עמ׳ · ${l.qDone}/${course.qCount} ש׳${
        l.qWrong?` · ${l.qWrong} טעויות`:""}</small>
      <button class="go" data-goto="${n}">פוקוס</button>
    </div>`;
  }).join("");
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click", ()=>{
    focus.lesson = +b.dataset.goto;
    const nxt = STAGES.find(([st])=>!stageDone(focus.lesson, st));
    focus.stage = nxt ? nxt[0] : "study";
    renderAll(); save();
  }));

  /* בנק טעויות */
  const open = errorsBank.filter(e=>!e.done).length;
  document.getElementById("errNote").textContent =
    errorsBank.length ? `${open} פתוחות מתוך ${errorsBank.length}` : "ריק";
  document.getElementById("errList").innerHTML = errorsBank.length
    ? errorsBank.map((e,i)=>`<div class="errrow ${e.done?"on":""}">
        <span class="tick" data-err="${i}" role="checkbox" aria-checked="${!!e.done}"></span>
        <span class="txt">${esc(e.text)}<small>שיעור ${e.lesson}</small></span>
        <button class="del" data-delerr="${i}" aria-label="מחק">×</button></div>`).join("")
    : `<p class="empty">כשתטעה בשאלה — תרשום אותה כאן. זו רשימת החזרה שלך.</p>`;
  document.querySelectorAll("[data-err]").forEach(b=>b.addEventListener("click", ()=>{
    const i = +b.dataset.err; errorsBank[i].done = !errorsBank[i].done; renderCourse(); save(); }));
  document.querySelectorAll("[data-delerr]").forEach(b=>b.addEventListener("click", ()=>{
    errorsBank.splice(+b.dataset.delerr,1); renderCourse(); save(); }));

  /* הגדרות */
  const set = (id,v)=>{ const el = document.getElementById(id); if(el) el.value = v; };
  set("cName", course.name); set("cTotal", course.total);
  set("cDeadline", course.deadline);
  set("cPpb", course.pagesPerBlock); set("cQmin", course.qMinutes);
}

/* ============ מטרות, סיכום, מגמה ============ */
function renderGoals(){
  const list = document.getElementById("goalsList");
  const d = goals.filter(g=>g.done).length;
  document.getElementById("goalsCount").textContent =
    goals.length ? `${d} מתוך ${goals.length} הושלמו` : "עדיין לא הגדרת מטרות";
  list.innerHTML = goals.length
    ? goals.map((g,i)=>`<div class="goal ${g.done?"on":""}">
        <span class="tick" role="checkbox" tabindex="0" aria-checked="${g.done}" data-goal="${i}"></span>
        <span class="txt" data-goal="${i}">${esc(g.text)}</span>
        <button class="del" data-delgoal="${i}" aria-label="מחק">×</button></div>`).join("")
    : `<p class="empty">מטרה טובה היא משהו שאפשר לסמן בסוף השבוע — לא "ללמוד יותר".</p>`;

  const lg = document.getElementById("lgList");
  const ld = longGoals.filter(g=>g.done).length;
  document.getElementById("lgCount").textContent =
    longGoals.length ? `${ld} מתוך ${longGoals.length} הושלמו` : "אין יעדים ארוכים";
  lg.innerHTML = longGoals.length
    ? longGoals.map((g,i)=>`<div class="lg ${g.done?"on":""}">
        <span class="tick" role="checkbox" tabindex="0" aria-checked="${g.done}" data-lg="${i}"></span>
        <span class="txt" data-lg="${i}">${esc(g.text)}</span>
        <button class="del" data-dellg="${i}" aria-label="מחק">×</button></div>`).join("")
    : `<p class="empty">יעד ארוך נותן לשבועות כיוון. בלעדיו כל שבוע עומד לבד.</p>`;

  const bind = (sel, arr, refresh) => document.querySelectorAll(sel).forEach(el=>{
    const hit = ()=>{ const i=+el.dataset[refresh]; arr[i].done=!arr[i].done; renderPage2(); renderToday(); save(); };
    el.addEventListener("click", hit);
    el.addEventListener("keydown", e=>{ if(e.key===" "||e.key==="Enter"){ e.preventDefault(); hit(); } });
  });
  bind("[data-goal]", goals, "goal");
  bind("[data-lg]", longGoals, "lg");
  document.querySelectorAll("[data-delgoal]").forEach(b=>b.addEventListener("click",()=>{
    goals.splice(+b.dataset.delgoal,1); renderPage2(); renderToday(); save(); }));
  document.querySelectorAll("[data-dellg]").forEach(b=>b.addEventListener("click",()=>{
    longGoals.splice(+b.dataset.dellg,1); renderPage2(); save(); }));
}

function renderReview(){
  const k = CRITERIA.filter(c => review[c[0]]).length;
  const [word, sub] = weekVerdict(k);
  document.getElementById("critsList").innerHTML = CRITERIA.map(([key,title,desc])=>`
    <button class="crit ${review[key]?"on":""}" role="checkbox" aria-checked="${!!review[key]}" data-crit="${key}">
      <span class="tick"></span><span><b>${title}</b><small>${desc}</small></span></button>`).join("");
  document.getElementById("verdict").innerHTML = `<b>${word}</b><span>${sub}</span>`;
  document.querySelectorAll("[data-crit]").forEach(b=>b.addEventListener("click",()=>{
    review[b.dataset.crit] = !review[b.dataset.crit]; renderPage2(); save(); }));
}

function renderTrend(){
  const svg = document.getElementById("trendChart");
  const data = history.slice(-12);
  document.getElementById("trendNote").textContent =
    data.length ? `${data.length} שבועות אחרונים` : "צריך שבוע סגור אחד לפחות";
  if(!data.length){
    svg.innerHTML = `<text x="300" y="90" text-anchor="middle" class="lbl">
      אחרי סגירת השבוע הראשון יופיע כאן גרף מגמה</text>`;
    return;
  }
  const W=600, H=170, pad=26, base=H-30;
  const maxV = Math.max(10, ...data.map(d=>d.marked));
  const bw = Math.min(46, (W-pad*2)/data.length - 8);
  const step = (W-pad*2)/data.length;
  let out = `<line x1="${pad}" y1="${base}" x2="${W-pad}" y2="${base}" stroke="#E7ECF4" stroke-width="1"/>`;
  data.forEach((d,i)=>{
    const x = W - pad - step*i - step/2;          /* מימין לשמאל */
    const h = Math.round((d.marked/maxV)*(base-34));
    out += `<rect x="${x-bw/2}" y="${base-h}" width="${bw}" height="${h}" rx="5" fill="#2FA394" opacity=".85"/>`;
    out += `<text x="${x}" y="${base-h-6}" text-anchor="middle" class="val">${d.marked}</text>`;
    out += `<text x="${x}" y="${base+14}" text-anchor="middle" class="lbl">${d.range.split("–")[0]}</text>`;
    const nc = d.critsTotal || 5;
    for(let c=0;c<nc;c++){
      out += `<circle cx="${x-(nc-1)*4+c*8}" cy="${base+26}" r="3"
        fill="${c < d.crits ? "#7A69CE" : "#E1E8F1"}"/>`;
    }
  });
  svg.innerHTML = out;
}

function renderHistory(){
  const list = document.getElementById("histList");
  document.getElementById("histCount").textContent =
    history.length ? `${history.length} שבועות שמורים` : "עדיין ריק";
  list.innerHTML = history.length
    ? history.slice().reverse().map(h=>`
      <div class="hitem">
        <div class="hrow">
          <b>${h.range}</b>
          <small>${h.marked} בלוקים · ${h.crits} מתוך ${h.critsTotal||5} · ${h.goalsDone}/${h.goalsTotal} מטרות</small>
          ${(h.days&&h.days.length)||(h.goalTexts&&h.goalTexts.length)
            ? `<button class="ghost" data-hdet="${h.start}">פרטים</button>` : ""}
          <button class="del" data-delhist="${h.start}" aria-label="מחק">×</button>
        </div>
        <div class="hdet" id="hd-${h.start}" hidden>
          ${(h.days||[]).map(d=>`<div class="hday"><b>${d.day} ${short(d.date)}</b>
            <span>${esc(d.tpl)} · ${d.marked}/${d.target} בלוקים${
      d.lessons && Object.keys(d.lessons).length
        ? " · " + Object.entries(d.lessons).map(([n,c])=>`שיעור ${n} (${c})`).join(", ") : ""}</span>
            ${Object.keys(d.notes||{}).length
              ? `<ul>${Object.entries(d.notes).map(([n,t])=>
                  `<li>בלוק ${n} — ${esc(t)}</li>`).join("")}</ul>` : ""}
          </div>`).join("")}
          ${(h.goalTexts||[]).length ? `<div class="hday"><b>מטרות</b>
            <ul>${h.goalTexts.map(g=>`<li>${g.done?"✓":"○"} ${esc(g.text)}</li>`).join("")}</ul></div>` : ""}
        </div>
      </div>`).join("")
    : `<p class="empty">שבוע שנסגר יופיע כאן, וכך תראה אם השגרה מחזיקה לאורך זמן.</p>`;
  list.querySelectorAll("[data-hdet]").forEach(b=>b.addEventListener("click",()=>{
    const el = document.getElementById("hd-"+b.dataset.hdet);
    el.hidden = !el.hidden;
    b.textContent = el.hidden ? "פרטים" : "סגור";
  }));
  list.querySelectorAll("[data-delhist]").forEach(b=>b.addEventListener("click",()=>{
    history = history.filter(h=>h.start !== b.dataset.delhist); renderPage2(); save(); }));
}

function renderQuote(){
  let i = Math.floor(Math.random()*QUOTES.length);
  if(QUOTES.length > 1 && i === lastQuote) i = (i+1) % QUOTES.length;
  lastQuote = i;
  const [cat, text, src] = QUOTES[i];
  document.getElementById("quoteBox").innerHTML = `
    <p class="qtext">${text}</p>
    <div class="qmeta">${cat}${src ? " · "+src : ""}</div>
    <button class="qnext" id="nextQuote" aria-label="משפט נוסף">↻</button>`;
  document.getElementById("nextQuote").addEventListener("click", renderQuote);
}

function closeWeek(){
  const {marked} = totals();
  /* ארכיון מפורט — מה נלמד בפועל, לא רק כמה */
  const days = week.map((cfg,i)=>{
    const dt = dayTplAt(i), d = dkey(i), m = doneOf(i);
    const ns = {};
    m.forEach(num=>{ const t = notes[d+":"+num]; if(t) ns[num] = t; });
    const lsns = {};
    m.forEach(num=>{
      const lk = blockLink[d+":"+num];
      if(lk) lsns[lk.lesson] = (lsns[lk.lesson]||0) + 1;
    });
    return {date:d, day:DAYS[i], tpl:dt.name, eve:eveTpl(cfg.eve).name,
            target:dt.target, marked:m.length, notes:ns, lessons:lsns};
  }).filter(x=>x.marked || x.target);

  history.push({
    start: weekStart, range: rangeText(weekStart), marked,
    crits: CRITERIA.filter(c=>review[c[0]]).length, critsTotal: CRITERIA.length,
    goalsDone: goals.filter(g=>g.done).length, goalsTotal: goals.length,
    goalTexts: goals.map(g=>({text:g.text, done:!!g.done})),
    days
  });

  /* ניקוי המפתחות של השבוע שנסגר בלבד — שבועות אחרים נשארים */
  for(let i=0;i<7;i++){
    const d = dkey(i);
    delete done[d];
    Object.keys(notes).forEach(k=>{ if(k.indexOf(d+":") === 0) delete notes[k]; });
    Object.keys(blockLink).forEach(k=>{ if(k.indexOf(d+":") === 0) delete blockLink[k]; });
    Object.keys(assign).forEach(k=>{ if(k.indexOf(d+":") === 0) delete assign[k]; });
    delete overrides[d];
  }
  weekStart = addDays(weekStart,7);
  review = {};
  goals = goals.map(g=>({text:g.text, done:false}));
  renderAll(); save();
}

function renderPage2(){ renderGoals(); renderReview(); renderTrend(); renderHistory(); }

/* ============ מעקב חודשי ============ */
const DOW_LETTERS = ["א","ב","ג","ד","ה","ו","ש"];
function renderMonth(){
  ensureMonthAnchor();
  document.getElementById("monthRange").textContent = periodLabel(monthView);
  const dates = periodDates(monthView);
  const today = todayISO();

  /* בלוקי לימודים */
  let sTarget=0, sMarked=0; const sMissed=[];
  dates.forEach(d=>{
    const {target, marked} = dayStudyInfo(d);
    if(!target || marked===null) return;
    sTarget += target; sMarked += Math.min(marked, target);
    if(marked < target) sMissed.push({date:d, have:marked, need:target});
  });
  const sPct = sTarget ? Math.round(sMarked/sTarget*100) : 0;
  document.getElementById("mStudyScale").textContent =
    sTarget ? `${sMarked} מתוך ${sTarget} בלוקים · ${sPct}%` : "עדיין אין ימים שעברו החודש";
  document.getElementById("mStudyBar").style.width = sPct+"%";
  document.getElementById("mStudyMissed").innerHTML = sMissed.length
    ? `<div class="hist">${sMissed.slice().reverse().map(m=>
        `<div class="hrow miss"><b>${short(m.date)}</b><span>פספסת ${m.need-m.have} בלוקים (${m.have} מתוך ${m.need})</span></div>`).join("")}</div>`
    : `<p class="empty">${sTarget ? "לא פספסת אף יום עד כה החודש." : "עדיין אין ימים שעברו החודש."}</p>`;

  /* ארוחות */
  let mTarget=0, mDone=0; const mMissed=[];
  dates.filter(d=>d<today).forEach(d=>{
    const {target, done} = dayMealsInfo(d);
    mTarget += target; mDone += done;
    if(done < target) mMissed.push({date:d, have:done, need:target});
  });
  const mPct = mTarget ? Math.round(mDone/mTarget*100) : 0;
  document.getElementById("mMealScale").textContent =
    mTarget ? `${mDone} מתוך ${mTarget} ארוחות · ${mPct}%` : "עדיין אין ימים שעברו החודש";
  document.getElementById("mMealBar").style.width = mPct+"%";
  document.getElementById("mMealMissed").innerHTML = mMissed.length
    ? `<div class="hist">${mMissed.slice().reverse().map(m=>
        `<div class="hrow miss"><b>${short(m.date)}</b><span>${m.have} מתוך ${m.need} ארוחות</span></div>`).join("")}</div>`
    : `<p class="empty">${mTarget ? "כל יום שעבר — 4 ארוחות מלאות." : "עדיין אין ימים שעברו החודש."}</p>`;

  /* בישול וכושר — לפי שבועות שהסתיימו במהלך התקופה */
  const weeks = weeksInPeriod(monthView);
  const pastWeeks = weeks.filter(ws=>addDays(ws,6) <= today);

  let cookHit=0;
  const cookRows = pastWeeks.map(ws=>{
    const info = weekCookedInfo(ws);
    if(info.done>=info.target) cookHit++;
    return {ws, info};
  });
  document.getElementById("mCookScale").textContent = pastWeeks.length
    ? `${cookHit} מתוך ${pastWeeks.length} שבועות בקצב` : "עדיין אין שבוע שהסתיים החודש";
  document.getElementById("mCookList").innerHTML = cookRows.length
    ? `<div class="hist">${cookRows.slice().reverse().map(({ws,info})=>
        `<div class="hrow ${info.done>=info.target?"hit":"miss"}"><b>${rangeText(ws)}</b>
          <span>${info.done} מתוך ${info.target} — ${info.sat?"מוצ״ש ✓":"מוצ״ש ✗"} · ${info.tue?"שלישי ✓":"שלישי ✗"}</span></div>`).join("")}</div>`
    : `<p class="empty">סמנו "בישלתי בפועל" בדף האוכל כדי לעקוב.</p>`;

  let fitHit=0;
  const fitRows = pastWeeks.map(ws=>{
    const info = weekFitnessInfo(ws);
    if(info.done>=info.target) fitHit++;
    return {ws, info};
  });
  document.getElementById("mFitTarget").textContent = fitnessTarget;
  document.getElementById("mFitScale").textContent = pastWeeks.length
    ? `${fitHit} מתוך ${pastWeeks.length} שבועות בקצב` : "עדיין אין שבוע שהסתיים החודש";
  document.getElementById("mFitList").innerHTML = fitRows.length
    ? `<div class="hist">${fitRows.slice().reverse().map(({ws,info})=>
        `<div class="hrow ${info.done>=info.target?"hit":"miss"}"><b>${rangeText(ws)}</b>
          <span>${info.done} מתוך ${info.target} אימונים</span></div>`).join("")}</div>`
    : `<p class="empty">סמנו "עשיתי כושר היום" בדף היום כדי לעקוב.</p>`;

  renderCalendar(dates);
}

/* לוח החודש — כל יום לחיץ, מציג פירוט מלא בכל התחומים */
function renderCalendar(dates){
  const today = todayISO();
  document.getElementById("calHead").innerHTML =
    DOW_LETTERS.map(l=>`<div class="calhd">${l}</div>`).join("");

  const startWd = new Date(dates[0]+"T12:00:00").getDay();
  let cells = "";
  for(let i=0;i<startWd;i++) cells += `<div class="calday empty"></div>`;
  dates.forEach(d=>{
    const si = dayStudyInfo(d), mi = dayMealsInfo(d);
    const past = d < today;
    const studyDot = !si.target ? "" : (si.marked===null ? "" : (si.marked>=si.target ? "on" : (past?"miss":"")));
    const mealDot = d>today ? "" : (mi.done>=mi.target ? "on" : (past?"miss":""));
    const fitDot = workouts[d] ? "on" : "";
    cells += `<button type="button" class="calday ${d===today?"today":""} ${d===selectedCalDay?"sel":""}" data-calday="${d}">
      <span class="n">${+d.split("-")[2]}</span>
      <span class="caldots">
        <span class="caldot ${studyDot}" title="לימודים"></span>
        <span class="caldot ${mealDot}" title="ארוחות"></span>
        <span class="caldot ${fitDot}" title="כושר"></span>
      </span>
    </button>`;
  });
  document.getElementById("calGrid").innerHTML = cells;
  document.querySelectorAll("[data-calday]").forEach(b=>{
    b.addEventListener("click", ()=>{
      selectedCalDay = b.dataset.calday;
      renderCalendar(dates);
    });
  });
  renderCalDetail();
}

function renderCalDetail(){
  const box = document.getElementById("calDetail");
  if(!selectedCalDay){ box.innerHTML = `<p class="empty">לחצו על יום בלוח כדי לראות פירוט מלא.</p>`; return; }
  const d = selectedCalDay;
  const wd = new Date(d+"T12:00:00").getDay();
  const si = dayStudyInfo(d);
  const mi = dayMealsInfo(d);
  const fit = !!workouts[d];
  const ws = addDays(d, -wd);
  const ci = weekCookedInfo(ws);
  const mealRows = MEAL_SLOTS.map(([slot,label])=>
    `<div>${eaten[d+":"+slot] ? "✓" : "○"} ${label}</div>`).join("");
  box.innerHTML = `
    <div class="caldetail">
      <div class="dv-head"><h3>${DAYS[wd]} · ${short(d)}</h3></div>
      <div class="calrow"><b>לימודים</b><span>${
        !si.target ? "אין יעד ליום הזה" : (si.marked===null ? "עוד לא קרה" : `${si.marked} מתוך ${si.target} בלוקים`)
      }</span></div>
      <div class="calrow"><b>ארוחות</b><span>${mi.done} מתוך 4</span></div>
      <div class="calmeals">${mealRows}</div>
      <div class="calrow"><b>כושר</b><span>${fit ? "בוצע ✓" : "לא סומן"}</span></div>
      <div class="calrow"><b>בישול · שבוע <span style="direction:ltr;unicode-bidi:isolate">${rangeText(ws)}</span></b>
        <span>${ci.done} מתוך ${ci.target} — ${ci.sat?"מוצ״ש ✓":"מוצ״ש ✗"} · ${ci.tue?"שלישי ✓":"שלישי ✗"}</span></div>
    </div>`;
}

/* ============ כלים: תבניות ============ */
/* נרמול שעה לפורמט 24 שעות — "930" → 09:30, "9:5" → 09:05 */
function normTime(v){
  const raw = String(v||"").trim();
  if(!raw) return "";
  let hh, mm;
  if(raw.indexOf(":") > -1){
    const p = raw.split(":");
    hh = parseInt((p[0]||"").replace(/\D/g,""), 10);
    mm = parseInt((p[1]||"0").replace(/\D/g,"") || "0", 10);
  } else {
    const d = raw.replace(/\D/g,"");
    if(!d) return "";
    if(d.length <= 2){ hh = +d; mm = 0; }
    else { mm = +d.slice(-2); hh = +d.slice(0,-2); }
  }
  if(isNaN(hh)) return "";
  if(isNaN(mm)) mm = 0;
  hh = Math.min(23, Math.max(0, hh));
  mm = Math.min(59, Math.max(0, mm));
  return String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0");
}
const timeInput = (val, attr, cls) =>
  `<input class="${cls||"t1"} tm" type="text" inputmode="numeric" maxlength="5"
          placeholder="00:00" value="${val||""}" ${attr}>`;

function toneSelect(v, attrs){
  return `<select ${attrs||""} class="tone">${TONES.map(([k,n])=>
    `<option value="${k}" ${k===v?"selected":""}>${n}</option>`).join("")}</select>`;
}

function renderTools(){
  const ft = document.getElementById("fitTarget");
  if(ft) ft.value = fitnessTarget;

  const dl = document.getElementById("dayTplList");
  const all = allDays();
  document.getElementById("dtCount").textContent =
    `${Object.keys(customDays).length} שלי · ${Object.keys(BUILTIN_DAYS).length} מובנות`;
  dl.innerHTML = Object.entries(all).map(([k,v])=>`
    <div class="tpl"><b>${esc(v.name)}</b>
      <small>${blocksOf(v)} בלוקים · עד ${v.ends}</small>
      <span class="tag ${customDays[k]?"mine":""}">${customDays[k]?"שלי":"מובנית"}</span>
      <button class="ghost" data-editday="${k}">${customDays[k]?"ערוך":"שכפל"}</button>
      ${customDays[k]?`<button class="del" data-deldaytpl="${k}">×</button>`:""}
    </div>`).join("");

  const el = document.getElementById("eveTplList");
  const alle = allEves();
  document.getElementById("etCount").textContent =
    `${Object.keys(customEves).length} שלי · ${Object.keys(BUILTIN_EVES).length} מובנות`;
  el.innerHTML = Object.entries(alle).map(([k,v])=>`
    <div class="tpl"><b>${esc(v.name)}</b>
      <small>${v.items.length} שלבים</small>
      <span class="tag ${customEves[k]?"mine":""}">${customEves[k]?"שלי":"מובנית"}</span>
      <button class="ghost" data-editeve="${k}">${customEves[k]?"ערוך":"שכפל"}</button>
      ${customEves[k]?`<button class="del" data-deleveTpl="${k}">×</button>`:""}
    </div>`).join("");

  dl.querySelectorAll("[data-editday]").forEach(b=>b.addEventListener("click",()=>{
    const k = b.dataset.editday, src = all[k];
    editDay = customDays[k]
      ? {key:k, name:src.name, ends:src.ends, target:src.target, rows:src.rows.map(r=>({...r}))}
      : {key:"d"+Date.now(), name:src.name+" — עותק", ends:src.ends, target:src.target,
         rows:src.rows.map(r=>({...r}))};
    renderDayEditor();
  }));
  dl.querySelectorAll("[data-deldaytpl]").forEach(b=>b.addEventListener("click",()=>{
    const k = b.dataset.deldaytpl;
    delete customDays[k];
    week.forEach(w=>{ if(w.day === k) w.day = "none"; });
    editDay = null; renderAll(); save();
  }));
  el.querySelectorAll("[data-editeve]").forEach(b=>b.addEventListener("click",()=>{
    const k = b.dataset.editeve, src = alle[k];
    editEve = customEves[k]
      ? {key:k, name:src.name, items:src.items.map(x=>[...x])}
      : {key:"e"+Date.now(), name:src.name+" — עותק", items:src.items.map(x=>[...x])};
    renderEveEditor();
  }));
  el.querySelectorAll("[data-deleveTpl]").forEach(b=>b.addEventListener("click",()=>{
    const k = b.dataset.deleveTpl;
    delete customEves[k];
    week.forEach(w=>{ if(w.eve === k) w.eve = "none"; });
    editEve = null; renderAll(); save();
  }));

  renderDayEditor(); renderEveEditor();
}

function renderDayEditor(){
  const box = document.getElementById("dayTplEditor");
  if(!editDay){ box.innerHTML = ""; return; }
  box.innerHTML = `
    <div class="ed">
      <div class="edhead">
        <input type="text" id="edName" value="${esc(editDay.name)}" placeholder="שם התבנית">
        ${timeInput(editDay.ends, 'id="edEnds"', "ends")}
      </div>
      <label class="field"><span>יעד בלוקים ליום</span>
        <input type="number" id="edTarget" min="0" max="20" value="${editDay.target}"></label>
      ${editDay.rows.map((r,i)=>`
        <div class="edrow">
          ${timeInput(r.t, 'data-rt="'+i+'"')}
          <input class="txt" type="text" value="${esc(r.block?(r.focus||""):(r.what||""))}"
                 placeholder="${r.block?"נושא הבלוק":"פעילות"}" data-rw="${i}">
          ${r.block ? `<span class="tag mine">בלוק</span>` : toneSelect(r.tone, 'data-rc="'+i+'"')}
          <button class="x" data-rx="${i}" aria-label="מחק שורה">×</button>
        </div>`).join("")}
      <div class="actions">
        <button class="ghost" id="addRow">הוסף שורה</button>
        <button class="ghost" id="addBlockRow">הוסף בלוק לימוד</button>
        <div class="spacer"></div>
        <button class="ghost" id="cancelDayTpl">ביטול</button>
        <button class="btn" id="saveDayTpl">שמור תבנית</button>
      </div>
    </div>`;

  box.querySelectorAll("[data-rt]").forEach(inp=>inp.addEventListener("change",()=>{
    const v = normTime(inp.value);
    inp.value = v;
    editDay.rows[+inp.dataset.rt].t = v || null; }));
  box.querySelectorAll("[data-rw]").forEach(inp=>inp.addEventListener("input",()=>{
    const r = editDay.rows[+inp.dataset.rw];
    if(r.block) r.focus = inp.value; else r.what = inp.value; }));
  box.querySelectorAll("[data-rc]").forEach(sel=>sel.addEventListener("change",()=>{
    editDay.rows[+sel.dataset.rc].tone = sel.value; }));
  box.querySelectorAll("[data-rx]").forEach(b=>b.addEventListener("click",()=>{
    editDay.rows.splice(+b.dataset.rx,1); renderDayEditor(); }));
  document.getElementById("addRow").addEventListener("click",()=>{
    editDay.rows.push({t:"08:00", what:"", tone:"personal"}); renderDayEditor(); });
  document.getElementById("addBlockRow").addEventListener("click",()=>{
    editDay.rows.push({t:"08:30", block:true, focus:"", tone:"study"}); renderDayEditor(); });
  document.getElementById("cancelDayTpl").addEventListener("click",()=>{ editDay=null; renderDayEditor(); });
  document.getElementById("saveDayTpl").addEventListener("click",()=>{
    editDay.name = document.getElementById("edName").value.trim() || "תבנית ללא שם";
    editDay.ends = normTime(document.getElementById("edEnds").value) || "16:00";
    editDay.target = Math.max(0, +document.getElementById("edTarget").value || 0);
    editDay.rows.sort((a,b)=> (a.t||"99:99").localeCompare(b.t||"99:99"));
    customDays[editDay.key] = {name:editDay.name, ends:editDay.ends,
      target:editDay.target, rows:editDay.rows.map(r=>({...r}))};
    editDay = null; renderAll(); save();
  });
}

function renderOvEditor(){
  const box = document.getElementById("ovEditor");
  if(!editOv){ box.innerHTML = ""; return; }
  box.innerHTML = `
    <div class="panel">
      <div class="dv-head"><h3>התאמה ליום ${short(editOv.date)}</h3>
        <div class="scale">חל על התאריך הזה בלבד</div></div>
      <div class="ed">
        <div class="edhead">
          <input type="text" id="ovName" value="${esc(editOv.name)}" placeholder="שם היום">
          ${timeInput(editOv.ends, 'id="ovEnds"', "ends")}
        </div>
        <label class="field"><span>יעד בלוקים ליום הזה</span>
          <input type="number" id="ovTarget" min="0" max="20" value="${editOv.target}"></label>
        ${editOv.rows.map((r,i)=>`
          <div class="edrow">
            ${timeInput(r.t, 'data-ot="'+i+'"')}
            <input class="txt" type="text" value="${esc(r.block?(r.focus||""):(r.what||""))}"
                   placeholder="${r.block?"נושא הבלוק":"פעילות"}" data-ow="${i}">
            ${r.block ? `<span class="tag mine">בלוק</span>` : toneSelect(r.tone, 'data-oc="'+i+'"')}
            <button class="x" data-ox="${i}" aria-label="מחק שורה">×</button>
          </div>`).join("")}
        <div class="actions">
          <button class="ghost" id="ovAddRow">הוסף שורה</button>
          <button class="ghost" id="ovAddBlock">הוסף בלוק</button>
          <div class="spacer"></div>
          <button class="ghost" id="ovCancel">ביטול</button>
          <button class="btn" id="ovSave">שמור ליום הזה</button>
        </div>
      </div>
    </div>`;

  box.querySelectorAll("[data-ot]").forEach(inp=>inp.addEventListener("change",()=>{
    const v = normTime(inp.value);
    inp.value = v;
    editOv.rows[+inp.dataset.ot].t = v || null; }));
  box.querySelectorAll("[data-ow]").forEach(inp=>inp.addEventListener("input",()=>{
    const r = editOv.rows[+inp.dataset.ow];
    if(r.block) r.focus = inp.value; else r.what = inp.value; }));
  box.querySelectorAll("[data-oc]").forEach(sel=>sel.addEventListener("change",()=>{
    editOv.rows[+sel.dataset.oc].tone = sel.value; }));
  box.querySelectorAll("[data-ox]").forEach(b=>b.addEventListener("click",()=>{
    editOv.rows.splice(+b.dataset.ox,1); renderOvEditor(); }));
  document.getElementById("ovAddRow").addEventListener("click",()=>{
    editOv.rows.push({t:"08:00", what:"", tone:"personal"}); renderOvEditor(); });
  document.getElementById("ovAddBlock").addEventListener("click",()=>{
    editOv.rows.push({t:"08:30", block:true, focus:"", tone:"study"}); renderOvEditor(); });
  document.getElementById("ovCancel").addEventListener("click",()=>{ editOv=null; renderOvEditor(); });
  document.getElementById("ovSave").addEventListener("click",()=>{
    const rows = editOv.rows.slice().sort((a,b)=>(a.t||"99:99").localeCompare(b.t||"99:99"));
    overrides[editOv.date] = {
      name: (document.getElementById("ovName").value.trim() || "יום מותאם"),
      ends: normTime(document.getElementById("ovEnds").value) || "16:00",
      target: Math.max(0, +document.getElementById("ovTarget").value || 0),
      rows: rows.map(r=>({...r}))
    };
    editOv = null; renderAll(); save();
  });
}

function renderEveEditor(){
  const box = document.getElementById("eveTplEditor");
  if(!editEve){ box.innerHTML = ""; return; }
  box.innerHTML = `
    <div class="ed">
      <input type="text" id="evName" value="${esc(editEve.name)}" placeholder="שם התבנית">
      <p class="hint" style="margin:0">כל שלב מוגדר במשך בדקות, ומתחיל מרגע סיום היום.</p>
      ${editEve.items.map((it,i)=>`
        <div class="edrow">
          <input class="mins" type="number" min="5" step="5" value="${it[1]===null?"":it[1]}"
                 placeholder="דק׳" data-em="${i}">
          <input class="txt" type="text" value="${esc(it[0])}" placeholder="פעילות" data-ew="${i}">
          ${toneSelect(it[2], 'data-ec="'+i+'"')}
          <button class="x" data-ex="${i}" aria-label="מחק שלב">×</button>
        </div>`).join("")}
      <div class="actions">
        <button class="ghost" id="addEveRow">הוסף שלב</button>
        <div class="spacer"></div>
        <button class="ghost" id="cancelEveTpl">ביטול</button>
        <button class="btn" id="saveEveTpl">שמור תבנית</button>
      </div>
    </div>`;

  box.querySelectorAll("[data-em]").forEach(inp=>inp.addEventListener("input",()=>{
    editEve.items[+inp.dataset.em][1] = inp.value === "" ? null : +inp.value; }));
  box.querySelectorAll("[data-ew]").forEach(inp=>inp.addEventListener("input",()=>{
    editEve.items[+inp.dataset.ew][0] = inp.value; }));
  box.querySelectorAll("[data-ec]").forEach(sel=>sel.addEventListener("change",()=>{
    editEve.items[+sel.dataset.ec][2] = sel.value; }));
  box.querySelectorAll("[data-ex]").forEach(b=>b.addEventListener("click",()=>{
    editEve.items.splice(+b.dataset.ex,1); renderEveEditor(); }));
  document.getElementById("addEveRow").addEventListener("click",()=>{
    editEve.items.push(["",30,"personal"]); renderEveEditor(); });
  document.getElementById("cancelEveTpl").addEventListener("click",()=>{ editEve=null; renderEveEditor(); });
  document.getElementById("saveEveTpl").addEventListener("click",()=>{
    editEve.name = document.getElementById("evName").value.trim() || "תבנית ללא שם";
    customEves[editEve.key] = {name:editEve.name,
      items:editEve.items.filter(x=>x[0].trim()).map(x=>[...x])};
    editEve = null; renderAll(); save();
  });
}

/* ============ יצוא PDF ============ */
function buildPrint(){
  const {target,max} = totals();
  const mins = target*45;
  const hours = Math.floor(mins/60)+":"+String(mins%60).padStart(2,"0");

  const cover = `<section class="pcover">
      <h1>לוז שבועי</h1>
      <div class="prange">${rangeText(weekStart)}</div>
      <div class="pstats">
        <div class="pstat"><b>${target}</b><span>יעד בלוקים</span></div>
        <div class="pstat"><b>${hours}</b><span>שעות לימוד נטו</span></div>
        <div class="pstat"><b>${max}</b><span>פוטנציאל</span></div>
      </div>
      ${planOf().length ? `<div class="pg"><h2>שיעורי השבוע</h2>${
        planOf().map(n=>`<div>שיעור ${n} — ${lessonBlocks(n)} בלוקים משוערים</div>`).join("")}</div>` : ""}
      ${goals.length ? `<div class="pg"><h2>מטרות השבוע</h2>${
        goals.map(g=>`<div>☐ ${esc(g.text)}</div>`).join("")}</div>` : ""}
      <div class="note">היעד הוא היעד. מה שמעבר לו הוא בונוס, לא סטנדרט חדש.</div>
    </section>`;

  const table = (rows,i) => rows.length ? `<table>${rows.map(r=>{
      const c = TONE_HEX[r.tone] || TONE_HEX.none;
      return r.block
        ? `<tr class="study"><td class="pt ${numT(r.range)}">${r.range||""}</td>
             <td class="pd" style="--c:${TONE_HEX.study}">בלוק ${r.num}<i>${
               esc(noteOf(i,r.num) || assignLabel(dkey(i), r.num) || r.focus || "")}</i></td></tr>`
        : `<tr><td class="pt ${numT(r.range)}">${r.range||""}</td>
             <td class="pd" style="--c:${c}">${esc(r.what)}${(()=>{
               const ml = rowMealLabel(i, r); return ml ? " — "+esc(ml) : "";
             })()}</td></tr>`;
    }).join("")}</table>` : "";

  const days = week.map((cfg,i)=>{
    const dt = dayTplAt(i), nb = blocksOf(dt);
    const rows = buildDay(i);
    const p1 = rows.filter(r=>!r.dim), p2 = rows.filter(r=>r.dim);
    return `<section class="pday">
      <div class="ph">
        <h2>${DAYS[i]}<span>${short(addDays(weekStart,i))}</span></h2>
        ${nb ? `<div class="chip">יעד ${dt.target} בלוקים · עד ${nb}</div>` : ""}
      </div>
      <div class="ptpl">${esc(dt.name)} · ${esc(eveTpl(cfg.eve).name)}</div>
      ${p1.length ? `<h3>מההשכמה עד סיום המשמרת</h3>${table(p1,i)}` : ""}
      ${p2.length ? `<h3>מסיום המשמרת עד השינה</h3>${table(p2,i)}` : ""}
      <div class="pfoot"><span class="pr">${rangeText(weekStart)}</span><span>${DAYS[i]}</span></div>
    </section>`;
  }).join("");

  document.getElementById("printarea").innerHTML = cover + days;
}

/* ============ גיבוי ============ */
function stateObj(){
  return {v:6, weekStart, week, done, notes, review, goals, longGoals,
          history, customDays, customEves, overrides,
          course, lessons, focus, weekPlan, blockLink, errorsBank, noStudy,
          assign, unassigned, cookPlan, menu, eaten, workouts, cooked, fitnessTarget,
          monthAnchorDay};
}
/* גרסאות ישנות שמרו לפי מספר יום (0..6) — ממירים לתאריכים */
function migrateKeys(){
  const oldD = {}, oldN = {};
  Object.keys(done).forEach(k=>{ if(/^[0-6]$/.test(k)){ oldD[k] = done[k]; delete done[k]; } });
  Object.keys(notes).forEach(k=>{ if(/^[0-6]:\d+$/.test(k)){ oldN[k] = notes[k]; delete notes[k]; } });
  Object.keys(oldD).forEach(k=>{ done[addDays(weekStart, +k)] = oldD[k]; });
  Object.keys(oldN).forEach(k=>{
    const p = k.split(":");
    notes[addDays(weekStart, +p[0])+":"+p[1]] = oldN[k];
  });
}
function applyState(s){
  if(s.weekStart) weekStart = s.weekStart;
  if(s.week) week = s.week;
  if(s.done) done = s.done;
  if(s.notes) notes = s.notes;
  if(s.review) review = s.review;
  if(s.goals) goals = s.goals;
  if(s.longGoals) longGoals = s.longGoals;
  if(s.history) history = s.history;
  if(s.customDays) customDays = s.customDays;
  if(s.customEves) customEves = s.customEves;
  if(s.overrides) overrides = s.overrides;
  if(s.course) course = Object.assign(course, s.course);
  course.reviewBlock = false;   /* בוטל */
  if(!course.pagesPerBlock) course.pagesPerBlock = 20;
  if(focus && (focus.stage === "read" || focus.stage === "verbal")) focus.stage = "study";
  if(s.lessons) lessons = s.lessons;
  if(s.focus) focus = s.focus;
  if(s.weekPlan) weekPlan = s.weekPlan;
  if(s.blockLink) blockLink = s.blockLink;
  if(s.errorsBank) errorsBank = s.errorsBank;
  if(s.noStudy) noStudy = s.noStudy;
  if(s.assign) assign = s.assign;
  if(s.unassigned) unassigned = s.unassigned;
  if(s.cookPlan) cookPlan = s.cookPlan;
  if(s.menu) menu = s.menu;
  if(s.eaten) eaten = s.eaten;
  if(s.workouts) workouts = s.workouts;
  if(s.cooked) cooked = s.cooked;
  if(s.fitnessTarget) fitnessTarget = s.fitnessTarget;
  if(s.monthAnchorDay) monthAnchorDay = s.monthAnchorDay;
  migrateKeys();
}
function exportBackup(){
  const txt = JSON.stringify(stateObj(), null, 2);
  try{
    const blob = new Blob([txt], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "loz-backup-" + todayISO() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
  }catch(e){
    showJson();
  }
}
let prevState = null;
function renderUndo(){
  const box = document.getElementById("undoWrap");
  if(!prevState){ box.innerHTML = ""; return; }
  box.innerHTML = `<div class="warn">הייבוא הושלם. גיבוי של המצב הקודם ירד למכשיר.
    <button class="ghost" id="undoImp">בטל את הייבוא</button></div>`;
  document.getElementById("undoImp").addEventListener("click", ()=>{
    applyState(prevState); prevState = null;
    renderAll(); save(); renderUndo();
  });
}
function showJson(){
  const w = document.getElementById("jsonWrap");
  w.hidden = false;
  document.getElementById("jsonBox").value = JSON.stringify(stateObj());
}

/* ============ שמירה ============ */
let saveFailed = false;
function save(){
  try{
    localStorage.setItem('loz:v6', JSON.stringify(stateObj()));
    saveFailed = false;
  }catch(e){
    if(!saveFailed){
      saveFailed = true;
      alert("השמירה נכשלה — כנראה שאין מקום פנוי בדפדפן. מומלץ לייצא גיבוי (עוד ← כלים) ולפנות מקום.");
    }
  }
  cloudSaveDebounced();   /* אם מחוברים לחשבון — מסנכרן גם לענן, בלי לחסום */
}
/* טעינה מהמטמון המקומי בלבד (בלי renderAll) — משמשת גם כבסיס מהיר לפני שהסנכרון לענן מסתיים */
function loadLocal(){
  try{
    const raw = localStorage.getItem('loz:v6') || localStorage.getItem('loz:v5') ||
                localStorage.getItem('loz:v4') || localStorage.getItem('loz:v3') ||
                localStorage.getItem('loz:v2');
    if(raw){
      applyState(JSON.parse(raw));
      save();   /* שומר בפורמט v6 */
      ['loz:v2','loz:v3','loz:v4','loz:v5'].forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
    }
  }catch(e){}
}
function load(){ loadLocal(); renderAll(); }

/* ============ ציור כללי ============ */
function renderAll(){
  renderToday(); renderDate(); renderWeek(); renderDay();
  renderStats(); renderOverview(); renderCourse(); renderFood(); renderPage2();
  renderTools(); renderOvEditor(); renderMonth();
}

/* ============ חיווט ============ */
function showPages(){
  const shown = tab === "more" ? ["more", subTab] : [tab];
  document.querySelectorAll(".page").forEach(p=>
    p.classList.toggle("on", shown.indexOf(p.id.replace("page-","")) > -1));
  document.querySelectorAll(".nav button").forEach(x=>
    x.classList.toggle("on", x.dataset.tab === tab));
}
document.querySelectorAll(".nav button").forEach(b=>{
  b.addEventListener("click", ()=>{
    tab = b.dataset.tab;
    if(tab === "today"){ renderToday(); renderQuote(); }
    showPages();
    window.scrollTo({top:0, behavior:"smooth"});
  });
});
document.querySelectorAll("#subNav button").forEach(b=>{
  b.addEventListener("click", ()=>{
    subTab = b.dataset.sub;
    document.querySelectorAll("#subNav button").forEach(x=>x.classList.toggle("on", x===b));
    showPages();
  });
});
document.querySelectorAll("#planModes button").forEach(b=>{
  b.addEventListener("click", ()=>{
    planMode = b.dataset.mode;
    document.querySelectorAll("#planModes button").forEach(x=>x.classList.toggle("on", x===b));
    document.getElementById("planDayWrap").hidden = planMode !== "day";
    document.getElementById("planWeekWrap").hidden = planMode !== "week";
  });
});
document.getElementById("wstart").addEventListener("change", e=>{
  if(!e.target.value) return;
  weekStart = sundayOf(new Date(e.target.value + "T12:00:00"));
  renderAll(); save();
});
document.getElementById("addGoal").addEventListener("click", ()=>{
  const inp = document.getElementById("goalInput");
  if(!inp.value.trim()) return;
  goals.push({text:inp.value.trim(), done:false});
  inp.value = ""; renderPage2(); renderToday(); save();
});
document.getElementById("goalInput").addEventListener("keydown", e=>{
  if(e.key === "Enter") document.getElementById("addGoal").click(); });
document.getElementById("addLg").addEventListener("click", ()=>{
  const inp = document.getElementById("lgInput");
  if(!inp.value.trim()) return;
  longGoals.push({text:inp.value.trim(), done:false});
  inp.value = ""; renderPage2(); save();
});
document.getElementById("lgInput").addEventListener("keydown", e=>{
  if(e.key === "Enter") document.getElementById("addLg").click(); });
document.getElementById("closeWeek").addEventListener("click", function(){
  if(this.dataset.armed !== "1"){
    this.dataset.armed = "1";
    this.textContent = "בטוח? לחץ שוב לסגירת השבוע";
    return;
  }
  this.dataset.armed = "0";
  this.textContent = "סגור שבוע ושמור בהיסטוריה";
  closeWeek();
});
document.getElementById("pdfBtn").addEventListener("click", ()=>{ buildPrint(); window.print(); });
document.getElementById("addErr").addEventListener("click", ()=>{
  const inp = document.getElementById("errInput");
  if(!inp.value.trim()) return;
  errorsBank.push({lesson:focus.lesson, text:inp.value.trim(), done:false});
  inp.value = ""; renderAll(); save();
});
document.getElementById("errInput").addEventListener("keydown", e=>{
  if(e.key === "Enter") document.getElementById("addErr").click(); });
document.getElementById("saveCourse").addEventListener("click", ()=>{
  course.name = document.getElementById("cName").value.trim() || course.name;
  course.total = Math.max(1, +document.getElementById("cTotal").value || course.total);
  course.deadline = document.getElementById("cDeadline").value || course.deadline;
  course.pagesPerBlock = Math.max(1, +document.getElementById("cPpb").value || course.pagesPerBlock);
  course.qMinutes = Math.max(0, +document.getElementById("cQmin").value || 0);
  renderAll(); save();
});
document.getElementById("allocBtn").addEventListener("click", ()=>{
  if(!planOf().length){ alert("קודם בחר שיעורים לשבוע."); return; }
  buildSchedule(); renderAll();
});
document.getElementById("allocClear").addEventListener("click", ()=>{
  for(let i=0;i<7;i++){
    const d = dkey(i);
    Object.keys(assign).forEach(k=>{ if(k.indexOf(d+":") === 0) delete assign[k]; });
  }
  unassigned = []; renderAll(); save();
});
["cookSat","cookTue"].forEach(id=>{
  document.getElementById(id).addEventListener("change", ()=>{
    const c = Object.assign({sat:"",tue:""}, cookOf());
    c[id === "cookSat" ? "sat" : "tue"] = document.getElementById(id).value;
    cookPlan[weekStart] = c;
    renderAll(); save();
  });
});
document.getElementById("menuFill").addEventListener("click", ()=>{ fillMenuDefaults(); renderAll(); });
document.getElementById("menuClear").addEventListener("click", ()=>{
  for(let i=0;i<7;i++){
    const d = dkey(i);
    MEAL_SLOTS.forEach(([slot])=>delete menu[d+":"+slot]);
  }
  renderAll(); save();
});
document.getElementById("expBtn").addEventListener("click", exportBackup);
document.getElementById("showJson").addEventListener("click", showJson);
document.getElementById("impBtn").addEventListener("click", ()=>{
  document.getElementById("impFile").click();
});
document.getElementById("impFile").addEventListener("change", e=>{
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const rd = new FileReader();
  rd.onload = ()=>{
    let s;
    try{ s = JSON.parse(rd.result); }
    catch(err){ alert("הקובץ לא תקין — לא בוצע שינוי."); return; }
    if(!s || !s.week){ alert("זה לא נראה כמו קובץ גיבוי של הלוז. לא בוצע שינוי."); return; }

    const info = "הקובץ מכיל: שבוע " + (s.weekStart||"?") +
      " · " + ((s.history||[]).length) + " שבועות בהיסטוריה" +
      " · " + ((s.goals||[]).length) + " מטרות";
    const now = "כרגע באפליקציה: שבוע " + weekStart +
      " · " + history.length + " שבועות בהיסטוריה";
    if(!confirm(info + "\n" + now + "\n\nהייבוא ידרוס את הנתונים הנוכחיים. להמשיך?")) return;

    prevState = JSON.parse(JSON.stringify(stateObj()));   /* גיבוי לביטול */
    exportBackup();                                       /* וגם קובץ, ליתר ביטחון */
    applyState(s);
    renderAll(); save(); renderUndo();
  };
  rd.readAsText(f);
  e.target.value = "";
});
document.getElementById("newDayTpl").addEventListener("click", ()=>{
  editDay = {key:"d"+Date.now(), name:"תבנית יום חדשה", ends:"16:00", target:0,
    rows:[{t:"05:25", what:"השכמה", tone:"personal"}]};
  renderDayEditor();
});
document.getElementById("newEveTpl").addEventListener("click", ()=>{
  editEve = {key:"e"+Date.now(), name:"תבנית ערב חדשה", items:[["נסיעה לדירה",30,"work"]]};
  renderEveEditor();
});
document.getElementById("fitTarget").addEventListener("change", ()=>{
  fitnessTarget = Math.max(1, +document.getElementById("fitTarget").value || fitnessTarget);
  renderAll(); save();
});
document.getElementById("monthPrev").addEventListener("click", ()=>{
  monthView = addPeriod(monthView, -1); selectedCalDay = null; renderMonth();
});
document.getElementById("monthNext").addEventListener("click", ()=>{
  monthView = addPeriod(monthView, 1); selectedCalDay = null; renderMonth();
});
document.getElementById("monthThis").addEventListener("click", ()=>{
  monthView = periodStartFor(todayISO()); selectedCalDay = null; renderMonth();
});

/* כפתור שמירה ידנית — שומר את כל המצב (השבוע הנוכחי, התפריט, מטרות וכו') ומראה אישור */
let saveToastTimer = null;
document.getElementById("saveNowBtn").addEventListener("click", ()=>{
  save();
  const toast = document.getElementById("saveToast");
  toast.classList.add("on");
  clearTimeout(saveToastTimer);
  saveToastTimer = setTimeout(()=>toast.classList.remove("on"), 1800);
});

/* שעון חי — מרענן את דף היום */
setInterval(()=>{ if(tab === "today") renderToday(); }, 30000);

/* ============ Supabase — התחברות וסנכרון ============
   כל עוד config.js ריק (SUPABASE_URL/SUPABASE_ANON_KEY), הבלוק הזה כבה לגמרי —
   האפליקציה עובדת בדיוק כמו קודם, מקומית בלבד, בלי מסך התחברות. */
const supa = (typeof SUPABASE_URL !== "undefined" && SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

let authMode  = "signin";   /* "signin" | "signup" */
let cloudUser = null;
let syncTimer = null;

function showAuth(show){ document.getElementById("authWrap").hidden = !show; }
function authError(msg){
  const el = document.getElementById("authErr");
  if(!msg){ el.hidden = true; el.textContent = ""; return; }
  el.hidden = false; el.textContent = msg;
}
function setAuthMode(mode){
  authMode = mode;
  document.getElementById("authTitle").textContent = mode === "signup" ? "הרשמה" : "התחברות";
  document.getElementById("authSub").textContent = mode === "signup"
    ? "יוצרים חשבון חדש כדי להתחיל לסנכרן."
    : "כדי לסנכרן את הלוז בין המכשירים שלך.";
  document.getElementById("authSubmit").textContent = mode === "signup" ? "הרשמה" : "התחברות";
  document.getElementById("authSwitch").textContent = mode === "signup"
    ? "כבר יש לך חשבון? להתחברות" : "אין לך חשבון? להרשמה";
  authError("");
}

/* טוען את המצב מהענן; אם אין עדיין רשומה לחשבון הזה — מעלה את מה שיש מקומית כדי לאתחל אותה */
async function cloudLoadOrSeed(){
  try{
    const { data, error } = await supa.from("app_state").select("data").eq("user_id", cloudUser.id).maybeSingle();
    if(error) throw error;
    if(data && data.data) applyState(data.data);
    else await cloudSaveNow();
  }catch(e){
    console.warn("cloud load failed — ממשיכים עם המטמון המקומי", e);
  }
}
async function cloudSaveNow(){
  if(!supa || !cloudUser) return;
  const dot = document.getElementById("syncDot");
  try{
    const { error } = await supa.from("app_state")
      .upsert({ user_id: cloudUser.id, data: stateObj(), updated_at: new Date().toISOString() });
    if(error) throw error;
    if(dot) dot.className = "syncdot ok";
  }catch(e){
    console.warn("cloud save failed", e);
    if(dot) dot.className = "syncdot err";
  }
}
function cloudSaveDebounced(){
  if(!supa || !cloudUser) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(cloudSaveNow, 1200);
}
function renderAcct(){
  const panel = document.getElementById("acctPanel");
  if(!panel) return;
  if(!supa || !cloudUser){ panel.hidden = true; return; }
  panel.hidden = false;
  document.getElementById("acctEmail").textContent = cloudUser.email || "—";
  document.getElementById("syncScale").textContent = "מחובר";
}
async function afterSignedIn(user){
  cloudUser = user;
  showAuth(false);
  const bh = document.getElementById("backupHint");
  if(bh) bh.textContent = "הנתונים מסונכרנים אוטומטית לחשבון שלך, ונשמרים גם בדפדפן הזה כגיבוי מקומי מיידי.";
  await cloudLoadOrSeed();
  renderAcct();
  renderAll();
  save();
}

if(supa){
  setAuthMode("signin");
  document.getElementById("authSwitch").addEventListener("click", ()=>{
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  });
  document.getElementById("authSubmit").addEventListener("click", async ()=>{
    const email = document.getElementById("authEmail").value.trim();
    const pass = document.getElementById("authPass").value;
    if(!email || pass.length < 6){ authError("צריך אימייל וסיסמה של לפחות 6 תווים."); return; }
    authError("");
    const btn = document.getElementById("authSubmit");
    btn.disabled = true;
    try{
      if(authMode === "signup"){
        const { data, error } = await supa.auth.signUp({ email, password: pass });
        if(error) throw error;
        if(!data.session){
          authError("נרשמת! אם הפרויקט דורש אישור אימייל — לחצו על הקישור שנשלח אליכם, ואז התחברו.");
          setAuthMode("signin");
        }
      } else {
        const { error } = await supa.auth.signInWithPassword({ email, password: pass });
        if(error) throw error;
      }
    }catch(e){
      authError(e.message || "משהו השתבש. נסו שוב.");
    }finally{
      btn.disabled = false;
    }
  });
  document.getElementById("authPass").addEventListener("keydown", e=>{
    if(e.key === "Enter") document.getElementById("authSubmit").click();
  });
  document.getElementById("signOutBtn").addEventListener("click", async ()=>{
    await supa.auth.signOut();
  });

  supa.auth.onAuthStateChange((event, session)=>{
    if(session && session.user){
      if(!cloudUser || cloudUser.id !== session.user.id) afterSignedIn(session.user);
    } else {
      cloudUser = null;
      renderAcct();
      showAuth(true);
    }
  });

  renderQuote();
  load();   /* מציג מיד את המטמון המקומי; ברגע שההתחברות נפתרת, afterSignedIn מרענן עם נתוני הענן */
} else {
  renderQuote();
  load();
}
