<!-- Үүсгэсэн: 2026-08-03, 13 агентын workflow (6 чиглэлээр хайж, тус бүрийг эсрэг
     талаас шалгасан). Түүхий олдвор 70 → батлагдсан 62, няцаагдсан 8.
     Энэ бол САНАЛ. Хэрэгжүүлэхийн өмнө эзэн шийднэ. Хийсэн зүйлээ CHANGELOG-д бич. -->

# Заавар — цэвэрлэгээний төлөвлөгөө

> Эх сурвалж: 62 батлагдсан олдвор (6 чиглэл), тус бүр эсрэг талаас шалгагдсан.
> Давхардсан олдворуудыг нэгтгэсэн — доор 23 үйлдэл + 18 commit.
> **Хязгаар хэвээр:** build step нэмэхгүй · DB/нэвтрэлт нэмэхгүй · `data/` доторх хичээлийн агуулга устгахгүй · `*_wf.js` баримтуудыг устгахгүй.

---

## 1. Товч дүгнэлт

Контентын давхарга эрүүл: 6 хичээл, 154 хичээлийн файл, `audit_content.py` exit 0, эвдэрсэн KaTeX 0. Асуудлууд гурван газар төвлөрсөн: **(а)** гэймификацийн давхарга хагас холбогдсон — `saveDiagnostic`, `loseHeart`, `setGoal`, `lessonComplete`, `renderRich` бүгд тодорхойлогдсон боловч хаанаас ч дуудагдахгүй, `mastery.html`-ийн `confirmed` шалгуур хэзээ ч үнэн болохгүй, `/quests` хуудас утсан дээр огт хүрэхгүй; **(б)** баримт бичиг хоцрогдсон бөгөөд шинэ хүнийг хамгийн хоцрогдсон файл руу (HANDOVER.md) заадаг, ARCHITECTURE.md-ийн API тайлбар 3 газар буруу; **(в)** ганц бодит өгөгдөл эвдэгч алдаа — `/lesson/<id>` нь хичээлийн эзэн субьектийг шалгадаггүй тул явц буруу localStorage түлхүүр рүү бичигдэнэ. Кодын үхмэл хэсэг ~250 мөр, гэхдээ ихэнх нь "устга" биш "холбо" гэсэн шийдэлтэй. Хоёр эзэмшигчийн шийдвэр шаардлагатай зүйл бий: аль Render service нь канон вэ, `data/uran` уу `data/literature` уу.

---

## 2. Шууд хийж болох (эрсдэлгүй, буцаахад хялбар)

| # | Юу | Файл | Яагаад | Эрсдэл |
|---|---|---|---|---|
| A1 | `5000` → `5001` | `HANDOFF-TERMINAL.md:31` | Бодит порт `app.py:397` = 5001; `run.sh:13`, `README.md:21/26` мөн 5001 | Байхгүй |
| A2 | Commit тоо/hash-ыг командаар солих | `HANDOFF-TERMINAL.md:54, 57-58, 215` | «2 commit ahead» vs «expect 4» өөрөө зөрчилдөнө; `876169d` хүрэхгүй болсон (бодит: 3 unpushed, `57af0cf`/`0e2c811`/`1a739bf`) | Байхгүй |
| A3 | «Never put Cyrillic inside `$...$`» мөрийг солих | `HANDOFF-TERMINAL.md:153` | AUDIT-1 (`CHANGELOG.md:30-32`) үүнийг няцаасан: нүцгэн кирилл рендэрлэгддэг, зөвхөн налуу гарна | Байхгүй |
| A4 | §2-ын 3 алдааг засах: `/api/chat`→`/api/tutor` (:42), `lesson(subject, id)`→`lesson(id)` (:60/:64), `route_question` мөрийг `S-CLAUDE` рүү (:73), :56-ийн «функц бүр subject авна» гэдгийг зөөлрүүлэх | `ARCHITECTURE.md` | Бодит гарын үсэг `store.py:107 lesson(lesson_id)`; `route_question` нь `claude_client.py:165`. §2-ыг дагасан хүн TypeError авна | Байхгүй |
| A5 | §4-ийн localStorage жагсаалтад 4 түлхүүр нэмэх, `progress`→`progress.v1` засах | `ARCHITECTURE.md:107-115` | Дутуу: `progress.v1` (`app.js:45-47`), `progress.<lessonId>` (`lesson.html:431/455`), `lastLesson` (`lesson.html:414`), `pathGrade` (`path.html:122/134`). §4 өөрөө «шинэ түлхүүр бүртгэ» гэж анхааруулдаг | Байхгүй |
| A6 | §5-д `D-DIAG` мөр нэмэх: «ХЭРЭГЛЭГДЭХГҮЙ ӨВ» | `ARCHITECTURE.md` | `data/diagnostic.json` (33 даалгавар, 9.6KB) индекст огт байхгүй, гэтэл `README.md:51` үүнийг үндсэн боломж гэж сурталчилдаг | Байхгүй |
| A7 | §7-г үнэнд нийцүүлэх: `BOOKREF_MODE` тохиргоо кодод БАЙХГҮЙ | `ARCHITECTURE.md:236-238` | `grep BOOKREF *.py` → 0. `lesson.html:352`-т хоосон `#bookref-page-slot` өлгүүр бий ч шилжүүлэгч алга. «Нэг тохиргооны утга» гэсэн амлалт өнөөдөр худал | Байхгүй |
| A8 | README-г богиносгох: 4 хичээл/12 файлын тоог хасаж §5 рүү заах; `cd math-guide`→`cd zaavar-math-guide`; template жагсаалт хасах (`diagnostic.html` байхгүй) | `README.md:4, 20, 51-53` | Хоёр үеийн хоцрогдол. Бодит: 6 хичээл, 154 файл, 12 template. Хууль зүйн мэдэгдэл (:73-78) ба API key хэсгийг ХЭВЭЭР үлдээ | Байхгүй |
| A9 | README-ийн эхний заалтыг `ARCHITECTURE.md` + `HANDOFF-TERMINAL.md` руу чиглүүлэх | `README.md:3` | HANDOVER.md нь `gamify`, `quests`, `path.html`, `mongolian`, `health`, `ARCHITECTURE`, `CHANGELOG`, `BACKEND-PLAN` гэсэн үгсийн АЛЬ НЬ Ч агуулаагүй (8/8 grep = 0) | **A10-ийн ДАРАА хий** |
| A10 | HANDOVER.md-ийн өвөрмөц агуулгыг ARCHITECTURE руу үг үсгээр нь нүүлгээд :1-д «АРХИВ» баннер тавих | `HANDOVER.md` §5, §6, §10, §12/3b → `ARCHITECTURE.md` §5/§9 | §12/3b нь `$20\,{}^\circ C$`, `$\text{кВт}\cdot\text{ц}$` засварын мөрийг агуулсан ЦОРЫН ГАНЦ газар (`grep "circ\|cdot\|кВт" ARCHITECTURE.md` → 0) | macOS/`~/math-guide` заавруудыг нүүлгэхдээ ХАСАХ |
| A11 | `:65` «mostly unused» → «unused» | `HANDOVER.md:65` | Бүрэн ашиглагдахгүй нь батлагдсан | Байхгүй |
| A12 | Хувийн и-мэйл + org нэрийг хасах | `HANDOVER.md:192, 286` | Public repo (`"private": false`), raw.githubusercontent-ээс уншигдаж байгааг баталсан | `srv-` ID-г **A20**-той хамт шийд |
| A13 | 2 spec файлд «АРХИВ / ТҮҮХЭН БАРИМТ» толгой нэмэх | `docs/superpowers/specs/2026-07-10-*.md`, `plans/2026-07-10-*.md` | Олон профайл (`zaavar.profiles`) ба `param` төрөл хэзээ ч бүтээгдээгүй (repo-даяар 0 таарц); `specs:5` «Awaiting spec review» гэж худал төлөв харуулна | §2-ын судалгааны эшлэлийг үлдээ — `store._verdict` босгын цорын ганц үндэслэл |
| A14 | `docs/authoring/README.md` шинээр нэмэх: файл бүрд «дахин ажиллуулж болох уу (тийм/болгоомжтой/ҮГҮЙ — яагаад)» + яг команд | `docs/authoring/` (15 файл) | ARCHITECTURE §5-д зөвхөн 5 ID бүртгэгдсэн. HANDOVER §11-ийг ХУУЛАХГҮЙ, түүн рүү заа | Байхгүй |
| A15 | 4 скриптийн docstring-д анхааруулга | `write_physics_grade.py` (ХУУЧИРСАН → `write_subject.py` тэнцүү команд), `write_physics.py` / `write_subjects.py` («хатуу macOS зам — зориудаар засаагүй, дарж бичдэг тул аюултай»), `append_enhancements.py` («53 хичээлд ДАХИН БҮҮ АЖИЛЛУУЛ») | `write_subject.py` нь diff-ээр батлагдсан superset (ROMAN `{"0",I..VIII}`, `book=0` fallback). `append_enhancements.py:30-31` `.extend()` дедупгүй — 106 жишээ давхарлана | Байхгүй |
| A16 | `uran` нэрийн зөрүүг тогтоох: `data/uran` (slug нь `toc-grade12.md:13` + `CHANGELOG.md:111`-тэй нийцтэй), ARCHITECTURE §5-д PENDING мөр | `HANDOFF-TERMINAL.md:131`, `ARCHITECTURE.md` | HANDOFF нь `data/literature` гэж, файл нь `uran_*` гэж зөрсөн. Файлын нэр БҮҮ соль | Байхгүй |
| A17 | HANDOFF §0-г «See CHAT-RULES.md» болгох | `HANDOFF-TERMINAL.md:13-18` | 4 мөрийн файлыг үг үсгээр давтсан | Байхгүй |
| A18 | `SESSION-NOTES.md`-г `.gitignore`-д нэмэх эсвэл `_Claude/` рүү зөөх | `SESSION-NOTES.md`, `.gitignore` | Repo-гийн цорын ганц untracked файл; §1/§3 хоцрогдсон (index.lock арилсан, `audit_content.py` tracked болсон). §2-ын scratchpad зам нь цорын ганц эх сурвалж тул **устгахгүй** | Байхгүй |
| A19 | `_to_delete/`-ийг repo-гоос ГАДНА зөөх → 1-2 долоо хоногийн дараа устгах | `_to_delete/` (3 MB, 76 файл) | Өвөрмөц ЗАМ байхгүй (архивуудыг задалж шалгасан). ~110 файл байтаараа зөрсөн ХУУЧИН хувилбарууд ч git commit-уудаас (`1ad6791`, `1a0a91e`, `ffaf20c`) хүрнэ. `data/health` ба 2 `*_wf.js` нь байт ижил | Эхлээд `git fsck` |
| A20 | `git update-index --chmod=+x run.sh` | `run.sh` | Index-д 100644 (225 файл бүгд). `README.md:21/34` нь `./run.sh` гэж заадаг → POSIX дээр Permission denied. `core.filemode=false` тул энэ л ажиллана | Байхгүй |
| A21 | Харагдах текстийн засвар: `chat.html:18` + `lesson.html:298`-ыг сурагчийн хэлээр; «Mock» → «Жишиг шалгалт» (6 газар: `mock.html:2/10/42`, `mastery.html:112`, `report.html:80/81`); `base.html:48`-аас `xs:inline` устгах | 5 template | Сурагчид `export ANTHROPIC_API_KEY=...` гэсэн терминалын заавар харуулж байна. `xs` breakpoint нь tailwind.config (`base.html:11-22`) болон `app.css`-д огт байхгүй — ямар ч CSS үүсгэдэггүй | Route (`/mock`), `A-MOCK-*`, localStorage талбар ХӨНДӨГДӨХГҮЙ |

---

## 3. Болгоомжтой хийх (код хөндөнө, шалгалт шаардана)

### 3.1 Хэрэглэгчид харагдах эвдрэл (эхэлж хий)

| # | Засвар | Файл:мөр | Шалгах арга |
|---|---|---|---|
| **B1** 🔴 | `lesson()` route-д `owner = store.lesson_subject(lesson_id)` авч, `owner != _subject()` бол `render_template(..., subject=owner, subject_name=store.SUBJECTS[owner])` гэж context-ийг дарж бичих | `app.py:137-148` | Test client-ээр дахин үүсгэсэн: cookie `subject=physics` + `GET /lesson/g11-8-1` → 200, гэвч `ZAAVAR_SUBJECT="physics"` → математикийн явц физикийн түлхүүрт бичигдэнэ. **Redirect хувилбарыг БҮҮ сонго** (хэрэглэгч түгжигдсэн мэдрэмж авна). 6 субьект тус бүрээр base.html-ийн сонгогчийг гараар шалга. Аль хэдийн буруу бичигдсэн бичлэгийг энэ засвар цэвэрлэхгүй |
| **B2** 🔴 | `Gamify.masteryComplete(g.band === 'ready', ...)` | `templates/mastery.html:211` | `store._verdict()` (`store.py:414-429`) `"confirmed"`-ийг ХЭЗЭЭ Ч буцаадаггүй → `masteryPassed` мөнхөд 0 → `mastery-5` тэмдэг түгжээтэй, **`q-mastery` даалгавар сурагчид харагдаад биелэхгүй** (seed-ээр сонгогдвол тэр өдрийн 20 эрдэнэ боломжгүй). Сервер тал өөрчлөх ШААРДЛАГАГҮЙ. Засмагц 10 → 30 XP болно |
| **B3** 🔴 | `/quests` руу мобайл зам нээх: доод барыг `grid-cols-5` → `grid-cols-6` **эсвэл** 💎 чипийг мобайлд гаргах — **аль нэгийг л** | `templates/base.html:96` эсвэл `:78` | `/quests` руу линк зөвхөн `base.html:72` (`hidden sm:flex`) ба `gamify.js:453` (нуугдсан чип) дотор. `claimQuest`/`openChest`/`buy` зөвхөн `quests.html:138-140`-өөс дуудагддаг → мобайл дээр F-QUESTS эдийн засаг бүхэлдээ үхмэл. 6 багана болбол текст 10px болохыг шалга |
| **B4** | `leveltest.html:202`-ийн `catch`-ийн дараа `try { Progress.saveDiagnostic({...}) } catch(e){}` нэмэх | `templates/leveltest.html:202` | `saveDiagnostic` (`app.js:78`) хаанаас ч дуудагдахгүй → `XP.levelTestTopic=15` хэзээ ч олгогдохгүй. **Одоогийн `zaavar.<subject>.leveltest` бичилтийг ХЭВЭЭР үлдээ** — `:151 init` ба `:212 resetAll` түүнээс уншдаг. `report.html` нь `p.diagnostic`-ыг уншдаггүй тул UI-д нөлөөгүй |
| **B5** | `refill` эд зүйлийг SHOP-оос түр хасах | `static/js/gamify.js:67-68` | `use('refill')` нь `s.hearts` аль хэдийн 5 байхад дахин 5 болгодог → сурагч 30 эрдэнэ төлж ЯМАР Ч ҮР ДҮНГҮЙ. `loseHeart` бүрэн холбох нь `F-HEARTS` (§8 1-р үе шат)-ын тусдаа ажил; ARCHITECTURE §4-т «хараахан идэвхгүй» гэж тэмдэглэ. `items.refill` худалдаж авсан хэрэглэгчид өлгөөтэй үлдэнэ (хоргүй) |
| **B6** | SSE generator: `except GeneratorExit: raise` → `except Exception` → `yield sse({"done":True})`-г `finally`-д; клиент талд `.catch(()=>{this.busy=false})` | `app.py:327-337`, `chat.html:125`, `lesson.html:501` | `except claude.ClaudeError` нь `TimeoutError`/`ConnectionResetError`/`IncompleteRead`-г барихгүй (`claude_client.py:114` түүхий давталт, 60с socket timeout). Клиент тал `.catch`-гүй → **чат хуудас дахин ачаалах хүртэл ҮҮРД түгжигдэнэ**. Нэмэлт: `claude_client.py:69`-д stream үед `timeout=300` |
| **B7** | `templates/_partials/error_box.html` үүсгэж mastery/mock-д `{% include %}`; `mock.html:121`-д `error: null` нэмж `:144`, `:161`-ийн catch дотор бөглөх | `mastery.html`, `mock.html` | `mastery.html:171/198` нь `this.error`-ыг тавьдаг ч файлд `x-show="error"` разметк БАЙХГҮЙ; `mock.html`-д `error` талбар огт алга → 5xx үед спиннер алга болоод хэрэглэгч тайлбаргүй эхний дэлгэц дээр буцна. Загвар: `leveltest.html:51-54`. `x-cloak` заавал; блокийг `stage==='pick'`-ийн ГАДНА тавь |
| **B8** | `renderRich`-ийг холбох (устгахгүй): `chat.html:126` / `lesson.html:502`-ийн `ai.html = ...replace(/</g,'&lt;')`-ийн оронд `onDone` дээр `x-ref` элемент рүү `renderRich($el, ai.raw)` | `static/js/app.js:22-39` | 18 мөр код бичигдсэн ч дуудагдахгүй → AI-ийн ```код блок```, **тод**, догол мөр түүхий тэмдэгтээрээ гарна (`app.css:27 .bubble`-д `white-space: pre-wrap` ч алга). `renderRich:24 esc()` нь `&,<,>` бүгдийг escape хийдэг тул одоогийн кодоос **илүү аюулгүй**. `x-html`-ийг нэгэн зэрэг үлдээвэл давхар render болно — нэгийг сонго. SSE token бүрт БИШ, `onDone` дээр дуудах |

### 3.2 Чангаруулалт ба ажиглалт

| # | Засвар | Файл:мөр | Тэмдэглэл |
|---|---|---|---|
| B9 | `if not nxt.startswith("/") or nxt.startswith("//"): nxt = "/"` | `app.py:45-46` | `/set-subject/physics?next=//evil.example.com` → `302 Location: //evil.example.com` батлагдсан. Нэвтрэлт/session/token байхгүй тул үр дагавар нь зөвхөн phishing нэр хүнд |
| B10 | `grade`/`v`-ийн төрлийг шалгаж 400 буцаах | `app.py:259-267` | ⚠️ `grade: null`-ыг **ХАДГАЛ** — `mock.html:125` нь leveltest сэдэвгүй субьектэд хууль ёсоор `null` илгээдэг («бүх анги»). `is not None` салбарыг алдвал mock тест эвдэрнэ |
| B11 | `import logging; logging.basicConfig(level=INFO)` + зөвхөн 4 залгисан газарт `logging.warning` | `app.py`, `claude_client.py:123, 196`, `app.py:261/266` | Flask/gunicorn нь боловсруулагдаагүй exception-ийг аль хэдийн Render-ийн лог руу бичдэг — цоорхой нь зөвхөн зориудаар залгисан замууд. `_headers()` (x-api-key) хэзээ ч логт орохгүй байх |
| B12 | `tutor_complete` устгах; `_post`-ийн `stream` параметрийг устгахын оронд **утга өгөх** (`timeout = 300 if stream else 60`) | `claude_client.py:90-101, 69` | `stream` нь функцын биед огт лавлагдаагүй, гэвч 60с timeout нь урт SSE яриаг таслах бодит эрсдэлтэй |
| B13 | store.py-ийн үхмэл код устгах ~110 мөр: `:91` DIAGNOSTIC ачаалалт, `:216-286` adaptive хөдөлгүүр, `:94-96` alias, `:142-143`, `:155-159`, `:176-186`, `:189-190` | `store.py` | ⚠️ **`lesson_subject()` (`:111`)-Г БҮҮ УСТГА — B1 түүнийг амьд болгоно.** Мөн үлдээ: `LESSON_SUBJECT` dict (`:150 siblings`), `NODES`/`GRAPH`, `available_lessons`, `prerequisites` (`app.py:145`), `node` (`app.py:360/363`). `data/diagnostic.json` ФАЙЛЫГ БАЙРАНД НЬ ҮЛДЭЭ |
| B14 | `gamify.js:400-407 lessonComplete` устгах; XP тоог нэг эх сурвалж болгох бол `Gamify.XP`-г экспортлоод `app.js:66`-д уншуулах | `static/js/gamify.js`, `static/js/app.js:64-68` | ⚠️ `lessonComplete`-ийг сэргээж `Progress.lessonDone`-оос дотроо уншуулах хувилбарыг **БҮҮ хий** — `app.js:60 this.write(p)` нь өмнө нь ажилладаг тул анхны дуусгалт бүр 20-ын оронд 5 XP авна (`app.js:62-63`-ын тайлбар үүнийг шууд анхааруулсан) |
| B15 | `_inject_subject`-д `ai_enabled` нэмээд 10 route-аас параметрийг хасах; `store.py:56-69`-ийг `{k: _load_subject(*_paths(k)) for k in SUBJECTS}` болгох | `app.py:34-37`, `store.py:56-69` | `not_found.html` (`app.py:141`) одоо `ai_enabled`-гүй render хийгддэг тул 404 дээр AI тэмдэг НУУГДДАГ — context_processor руу шилжвэл гарч ирнэ (зориудаар зөвшөөрөх эсэхээ шийд). `data/curriculum.json` (math, root) vs `data/<subject>/` ялгааг андуурвал бүх субьект нэг дор эвдэрнэ → 6 субьектээр импортын smoke test ЗААВАЛ |
| B16 | Нэрлэсэн тогтмол: `app.py:48` cookie max-age, `app.py:333` `TUTOR_MAX_TOKENS`, `store.py:530 pool[:2]`, `store.py:293-301` 85/60/35 босго | `app.py`, `store.py` | ⚠️ `store.py:311 t.get("grade", 11)` дефолтыг **БҮҮ устга** (152/152 сэдэв `grade`-тэй тул ажилладаггүй; устгавал `grade: None` эрсдэл). `store.py:127-130` featured hardcode нь 6 субьект бүрд no-op — заавал биш |
| B17 | Template доторх `'zaavar.{{ subject }}.x'`-ийг `zKey('x')` болгох (10 газар) | 8 template | `zKey` нь classic script-ийн дээд түвшний function тул АЛЬ ХЭДИЙН глобал (`window.zKey = zKey` илүүц). Бүх дуудалт Alpine-ий `init`/`submit` дотор байх ёстой — parse үед ажиллах мөрөнд бичвэл `zKey` хараахан тодорхойлогдоогүй |
| B18 | `lesson.html:414`-ийн `lastLesson` бичилтийг устгах | `templates/lesson.html:414` | `zaavar.<subject>.lastLesson`-г repo-даяар хэн ч уншдаггүй; `Progress.setLastLesson` бүрэн орлоно (`home.html:114` уншина). Per-lesson `progress.<id>` түлхүүрийг **бүү хөнд** — migration шаардана |
| B19 | `async zApi(state, url, body)`-г `app.js`-д нэгтгэх; спиннерийг `_partials/spinner.html` | `leveltest.html:160-169`, `mastery.html:156-164`, `mock.html:130-138` | Гурван хуулбарын ялгаа нь ердөө нэг мөр — тэр дутуу мөр яг B7-ийн алдааг үүсгэсэн. `state`-ийг аргумент болгож дамжуул. **B7-ийн ДАРАА хий** |
| B20 | `static/js/tutor.js` — `zaavarTutor({lessonId, aiEnabled})` нэг factory; мессежийг `{role, raw, html}` болгож нэгтгэх | `chat.html:92-131`, `lesson.html:486-506` | Аль хэдийн зөрсөн: chat `m.type`, lesson `m.role`; lesson нь текстээ `.replace(/&lt;/g,'<')`-ээр буцааж сэргээдэг. chat-ийн `route` төрлийн мессеж (`:42-73, 119`) lesson-д байхгүй — алдвал routing карт эвдэрнэ. **B8-ийн ДАРАА** (эс бөгөөс B8-ийг хоёр газарт давхар хийнэ) |
| B21 | `escHtml`-ийг `app.js`-д нэг удаа тодорхойлж `profile.js:91`, `quests.html:67`-г солих | 3 файл | Гурав давхардсан. Хамгийн хямд эхлэл |
| B22 | `Flask>=3.0,<4.0`, `gunicorn>=21.2,<24.0`, `markupsafe>=2.1,<4.0` нэмэх | `requirements.txt` | `app.py:20` `markupsafe`-ийг шууд import хийдэг ч тунхаглаагүй (Flask заавал татдаг тул deploy унахгүй — зөв дадлын алдаа). Дараагийн deploy-д pip шийдэл өөрчлөгдөнө; deploy гараар тул хяналттай |

---

## 4. Битгий хий (няцаагдсан эсвэл эрсдэл > ашиг)

**Дараагийн сешн эдгээрийг дахин санал болговол энэ хэсгийг уншуул.**

### 4.1 Няцаагдсан олдворууд

| Санал | Яагаад ҮГҮЙ |
|---|---|
| «`write_physics.py` ажиллуулбал физик 8–11 устана» | Худал. `Path("/Users/tuvshinb/...")` нь Windows дээр `C:\Users\tuvshinb\...` буюу **репогоос ГАДУУР** шийдэгдэнэ. Кодын ажиглалт (merge хийхгүй) үнэн, гэхдээ high severity үндэслэлгүй |
| `Procfile`/`render.yaml`-ийн gunicorn командыг нэгтгэх | Хоёр файл яг ижил, хоёулаа зөв, аль нь ч одоогийн deploy замд ороогүй (Render dashboard-ын startCommand ажиллаж байна). Илэрсэн гэмтэл биш |
| `.env.example`-д authoring-ийн 4 хувьсагч нэмэх | Аль хэдийн баримтжуулсан (`HANDOFF-TERMINAL.md:115`, `ARCHITECTURE.md:167/177`, `HANDOVER.md:214`). Түүнчлэн `run.sh` нь `.env`-ийг **апп руу** source хийдэг тул нэг удаагийн authoring хувьсагчид runtime процесст тархана |
| `.gitignore`-д Windows хог файл нэмэх / `ziPqBMmh` мөр хасах | Одоо ч, түүхэнд ч эдгээр дүрмийг шаардсан файл байгаагүй. Таамаглалын урьдчилан сэргийлэлт |
| `.gitattributes`-ийн binary жагсаалтыг өргөтгөх | 0 CRLF, 0 tracked binary. Одоогийн тохиргоо бүрэн ажиллаж байна |
| `store.py`-ийн импортын үеийн try/except | «Сайт бүхэлдээ 502 болно» гэдэг Render-ийн deploy загварт нийцэхгүй — амжилтгүй эхлэлт өмнөх хувилбарыг амьд үлдээнэ. Санал болгосон засвар нь чимээгүй доройтол үүсгэж `W-AUDIT` хаалгыг сулруулна |
| Санах ойн хэрэглээний олдвор | Хэмжилт зөв ч ямар ч үйлдэл шаардаагүй |
| «Анги сонгогчийн band өнгө 3 удаа зөрсөн» | `'good'` band нь mastery/report-д огт ирдэггүй тул дутуу зүйл байхгүй; `-300` vs `-200` зөвхөн гоо зүй |

### 4.2 Батлагдсан ч хийхгүй

| Санал | Яагаад ҮГҮЙ |
|---|---|
| `data/diagnostic.json`-г устгах | 9,620 байт бодит зохиогдсон үнэлгээний банк (33 даалгавар, 16 чадвар) = **хичээлийн агуулга** → төслийн хязгаар зөрчинө. `README.md:51`, `HANDOVER.md:65`-ийн бичилт ч эвдэрнэ. Зөвхөн `store.py:91` ачаалалтыг устгаад файлыг байранд нь үлдээ |
| `renderRich`-ийг 18 мөрөөр устгах | Үхмэл биш — **холбогдоогүй ажиллагаатай** код. Устгавал AI хариултын форматгүй байдал хэвээр үлдэнэ (B8-ыг үз) |
| `Gamify.setGoal`/`goals()`-г устгах | `gamify.js:13-14` нь «Өдрийн зорилтыг хэрэглэгч сонгоно» гэж зориудаар бичсэн; `F-DAILY` нь ARCHITECTURE §8-ын 1-р үе шатанд. Дутуу нь UI, код биш. `report.html:24`-ийн `0/50 XP` hardcode нь зохиогч зорилт өөрчлөгдөхгүйг тооцсоны нотолгоо — сонгогч нэмвэл түүнийг ч хамт засна |
| `goalKey` / `goalLabel` устгах | Зорилт сонгогч нэмэхэд шууд хэрэг болно (аль товч идэвхтэй + «Хэвийн» шошго) |
| `Profile.get`, `Gamify.levelFor`, `Explainer.SCENES` устгах | Нийт 4 мөр. Гүйцэтгэл, багц, зөв ажиллагаанд нөлөөгүй; консолоос дибаг хийхэд хэрэгтэй. Цэвэрлэх нь өөрөө CHANGELOG бичилт шаардах тул зардал > ашиг |
| `leveltest`-ийн localStorage-г `Progress` рүү нүүлгэх | `leveltest.html:151` ба `:212` нь `zaavar.<subject>.leveltest`-ээс уншдаг — нүүлгэвэл хоёул эвдэрнэ |
| `write_physics.py` / `write_subjects.py`-ийн замыг засах | Замыг репо руу заавал **өгөгдөл дарж бичих шууд зам нээгдэнэ** (`write_physics.py` merge хийхгүй; `write_subjects.py` нь `data/it`, `data/english`-ийн банкийг бүтнээр дарна). Зөвхөн docstring-д анхааруул (A15) |
| `append_enhancements.py`-ийн замыг засах | Idempotent биш (`.extend()` дедупгүй) → 53 хичээлд 106 давхардсан жишээ үүснэ. Зам засах шийдвэрийг `_enhanced` хамгаалалттай ХАМТ, зөвхөн дахин ажиллуулах шаардлага гарсан үед |
| `docs/authoring/*_wf.js`-үүдийг устгах / байтаар нь өөрчлөх | Ажилласан run-уудын мөшгих баримт. `enhance_wf.js`-ийн 7-р ангийн hardcode-ыг засах бол ШИНЭ файл (`enhance2_wf.js`) үүсгэ |
| `_bundle_schema.js` хуваалцсан модуль үүсгэх (6 wf.js-ийн давхардсан schema) | Relative ESM import энэ орчинд **туршигдаагүй** (`grep "^import|require(" docs/authoring/*.js` → 0). Бүтэлгүйтвэл шинэ workflow бүхэлдээ унана. Дараагийн шинэ workflow бичихдээ жижиг туршилтаар эхлээд бататга |
| `write_subject.py`-д `SUBJECT_FILTER` нэмэх | Хүлээгдэж буй 4 ном (Уран зохиол 336, Дизайн 341, Орос 344, Иргэний ёс зүй 431) бүгд НЭГ хичээлийн workflow. Холимог result гарвал python one-liner-ээр салгах нь эрсдэлгүй |
| `app.py`-д `BOOKREF_MODE` тохиргоо нэмэх | БШУЯ-ны зөвшөөрөл гараагүй байхад ашиглагдахгүй тохиргоо нэмнэ. Зөвхөн баримтыг үнэн болго (A7) |
| Router-ийн JSON алдааг 502 болгох | Хэрэглэгчид «AI ажиллахгүй байна» гэж харагдах нь одоогийн зөөлөн уналтаас ДОР. Structured output схем албадагддаг тул салбар нь бараг үхмэл. Зөвхөн `logging.warning` нэм |
| Sonnet 5 / Opus 5 рүү шилжих | Sonnet 5 нь `thinking` талбар орхигдвол adaptive thinking-ийг дефолтоор ажиллуулж, `max_tokens=1200` (`app.py:333`) нь thinking + хариултыг ХАМТАД нь хязгаарлан хариултыг дунд нь тасална. Тусдаа туршилттай ажил болгож CHANGELOG-д бүртгэ |
| Git түүхийг дахин бичих (и-мэйл цэвэрлэх) | 30/30 commit `Tuvshin <rollingg.bd@gmail.com>` нэрээр гарын үсэг зурагдсан тул PII git metadata-аар ил хэвээр. Force-push энэ ашгийн хэмжээнд үндэслэлгүй |
| KaTeX-ийн фикс синтаксыг ARCHITECTURE §5 рүү нэгтгэх | §5-д `\circ`/`\cdot`/`кВт` синтакс огт байхгүй; мөн §5 нь `\text{}` доторх `·`-г САНУУЛГА гэж ангилдаг ч `CHANGELOG.md:412` нь «Undefined control sequence: \cdotp» гэж бодит алдаа болохыг тэмдэглэсэн — §5 энэ сэдвийн аюулгүй эх сурвалж хараахан биш |
| `HANDOVER.md`-г устгах | §5 econtent/ESIS хуудасны хаяглалт, §6 бүтэн jsonc data model, §10 gzip шалгах жор, §12/3b KaTeX фиксийн синтакс — эдгээрийн цорын ганц эзэн |

---

## 5. Эзэмшигчийн шийдвэр шаардах (кодоос шийдэгдэхгүй)

| # | Асуулт | Одоогийн байдал |
|---|---|---|
| **O1** | Аль Render service нь канон вэ? | **ХОЁУЛАА амьд**: `zaavar-guide.onrender.com` → 200 (gamify.js БАЙНА, 18,993 байт) ба `zaavar-math-guide.onrender.com` → 200 (**gamify.js БАЙХГҮЙ** — F-GAMIFY-аас өмнөх хуучин deploy). `render.yaml:7 name: zaavar-math-guide` нь ХУУЧИН талд, `ARCHITECTURE.md:267` + `HANDOFF-TERMINAL.md:25/65-66` нь `zaavar-guide` талд. **Хуучин хувилбар олон нийтэд харагдсаар байна.** Шийдсэний дараа: илүүц service-ийг dashboard-аас suspend → `render.yaml:7` нэрийг тааруулах → `HANDOVER.md:5/192/198/286` засах → `ARCHITECTURE.md §9`-ийг цорын ганц эх сурвалж болгох → CHANGELOG бичилт |
| **O2** | Prod-ын Python хувилбар хэд вэ? | `render.yaml:15-16` = 3.12.6, локал = 3.14.6. Гэвч `render.yaml` нь Blueprint-ээр холбогдоогүй бол Render уншдаггүй → «prod = 3.12.6» нь таамаг. Dashboard-аас нэг удаа хараад `ARCHITECTURE §9 X-RENDER`-т бич. Локалыг албадан буулгах шаардлагагүй (код 3.10+ синтакстай) |
| **O3** | `SESSION-NOTES.md:37`-ийн scratchpad зам хэрэгтэй юү? | Хэрэггүй бол A18-ийн оронд шууд устгаж болно |

---

## 6. Санал болгож буй commit-уудын дараалал

Тус бүр бие даан `git revert` хийх боломжтой. **Repo-гийн дүрэм:** commit бүрд `CHANGELOG.md` бичилт үүсгэх, ARCHITECTURE.md хөндсөн бол хамт шинэчлэх.

| # | Commit | Хамрах хүрээ | Хөндсөн ID | Буцаах |
|---|---|---|---|---|
| 1 | `Fix lesson route ignoring lesson owner subject` | B1 | `S-APP`, `S-STORE`, `T-LESSON` | Цэвэр revert. localStorage-д аль хэдийн буруу бичигдсэнийг сэргээхгүй |
| 2 | `Fix mastery verdict check: band === 'ready'` | B2 | `T-MASTERY`, `J-GAMIFY` | Цэвэр. Буцаавал XP 30→10 болно |
| 3 | `Add /quests to mobile navigation` | B3 | `T-BASE`, `F-QUESTS` | Цэвэр CSS/разметк |
| 4 | `Wire level test XP into Gamify` | B4 | `T-LEVELTEST`, `F-XP` | Цэвэр. `zaavar.<subject>.leveltest` хөндөгдөөгүй |
| 5 | `Remove refill from shop until hearts are wired` | B5 | `J-GAMIFY`, `F-HEARTS` | Цэвэр |
| 6 | `Harden SSE stream against mid-stream failures` | B6 | `S-APP`, `S-CLAUDE`, `T-CHAT`, `T-LESSON` | Цэвэр. `finally`-д `GeneratorExit`-ийг дахин шидэхээ шалга |
| 7 | `Add error box to mastery and mock` | B7 | `T-MASTERY`, `T-MOCK` | Цэвэр, зөвхөн UI нэмэгдэнэ |
| 8 | `Render AI replies through renderRich` | B8 | `J-APP`, `T-CHAT`, `T-LESSON` | Цэвэр. `x-html` vs `innerHTML` давхардлыг шалга |
| 9 | `Correct ARCHITECTURE API, localStorage and bookref sections` | A4, A5, A6, A7 | `ARCHITECTURE.md` | Баримт |
| 10 | `Rewrite README; repoint entry docs` | A8, A9 + A10 (нүүлгэлт **энэ commit-ийн ӨМНӨ** эсвэл дотор) | `README.md`, `HANDOVER.md`, `ARCHITECTURE.md` | Баримт. §12/3b-ийн фикс мөрүүд нүүсэн эсэхийг шалга |
| 11 | `Archive HANDOVER and superpowers specs` | A10 баннер, A11, A12, A13 | Баримт | Баримт |
| 12 | `Fix HANDOFF-TERMINAL port, git state, KaTeX note` | A1, A2, A3, A16, A17 | Баримт | Баримт |
| 13 | `Document authoring scripts and their re-run safety` | A14, A15 | `W-*`, шинэ `docs/authoring/README.md` | Баримт. Гүйцэтгэх код хөндөгдөхгүй |
| 14 | `Repo hygiene: run.sh exec bit, requirements bounds, SESSION-NOTES` | A18, A20, B22 | `run.sh`, `requirements.txt`, `.gitignore` | Цэвэр. Дараагийн deploy-д pip resolve өөрчлөгдөнө |
| 15 | `Tighten set-subject redirect and mock version input` | B9, B10 | `S-APP`, `A-MOCK-VERSION` | Цэвэр. `grade: null` семантикийг шалга |
| 16 | `Add logging to silently swallowed paths` | B11, B12 | `S-APP`, `S-CLAUDE` | Цэвэр |
| 17 | `Remove dead store/gamify code` | B13, B14, B18 | `S-STORE`, `J-GAMIFY`, `T-LESSON` | ⚠️ **1-р commit-ийн ДАРАА**. `lesson_subject` УСТГАХГҮЙ. `data/diagnostic.json` файл байрандаа |
| 18 | `Localize remaining English UI text` | A21 | 5 template | Цэвэр текст |

**Дараа нь (тусдаа сешн, тус бүр бие даасан commit):** B15 (context_processor + `_SUBJ` refactor, 6 субьектийн smoke test), B19 (`zApi` + spinner partial), B21 (`escHtml`), B17 (`zKey`), B16 (нэрлэсэн тогтмол), B20 (`tutor.js` нэгтгэл — хамгийн том, хамгийн сүүлд).

**Гацаанд орсон:** O1 шийдэгдэх хүртэл `render.yaml:7`, `srv-` ID-ууд, `HANDOVER.md:198`-ийн live шалгах скриптийг БҮҮ хөнд. A19 (`_to_delete/` зөөх) нь `git fsck` амжилттай болсны дараа хэдийд ч.