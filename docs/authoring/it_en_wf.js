export const meta = {
  name: 'it-english-g12-authoring',
  description: 'Author Grade-12 IT (Small Basic) + English lessons + level-test + mastery, adversarially verified',
  phases: [
    { title: 'Author', detail: 'one agent per topic writes lesson + 10 level Qs + mastery' },
    { title: 'Verify', detail: 'adversarial correctness check → corrected bundle' },
  ],
}

const IT_READER = 'https://econtent.edu.mn/pages/more.php?id=340'
const EN_READER = 'https://econtent.edu.mn/pages/more.php?id=357'

const IT_SPECS = [
  { id:'it-1-1', skill:'it-ict-trends', chap:'I', chapTitle:'Мэдээлэл, харилцаа холбооны технологи', num:'1.1', title:'МХХТ-ийн хөгжил, чиг хандлага',
    focus:'МХХТ-ийн хөгжлийн чиг хандлага, дэлхийн МХХТ хөгжлийн индекс, Монголын МХХТ-ийн өнөөгийн байдал, МХХТ ба тогтвортой хөгжил, Аж үйлдвэрийн IV хувьсгал, интернэт дэх мэдээллийн эрх чөлөө ба сөрөг үр нөлөө (кибер аюулгүй байдал).',
    misc:['Интернэт дэх бүх мэдээлэл үнэн зөв гэж бодох','МХХТ = зөвхөн интернэт гэж боддог (өргөн ойлголт)','Аж үйлдвэрийн IV хувьсгал ба өмнөх хувьсгалуудыг андуурах'], code:false },
  { id:'it-1-2', skill:'it-advanced-tech', chap:'I', chapTitle:'Мэдээлэл, харилцаа холбооны технологи', num:'1.2', title:'Дэвшилтэт технологийн хөгжил, хэрэглээ',
    focus:'Үүрэн холбоо (4G/5G), робот технологи, үүлэн технологи (cloud), биотехнологи, нанотехнологи, электроникийн хөгжил ба хэрэглээ.',
    misc:['Үүлэн технологи (cloud) = тэнгэрт хадгалах гэж ойлгох (үнэндээ алсын сервер)','Робот = хүн шиг ухаантай гэж бодох','5G нь зөвхөн хурдан интернэт гэж хязгаарлах'], code:false },
  { id:'it-2-1', skill:'it-architecture', chap:'II', chapTitle:'Компьютерын системийн үндэс', num:'2.1', title:'Компьютерын архитектур ба хөгжил',
    focus:'Фон Нейманы архитектур, процессор (CPU), санах ой (RAM), хадгалах төхөөрөмж, оролт-гаралт; компьютерын түүх, ангилал; тооцоолох чадварын үзүүлэлт (давтамж/цөм).',
    misc:['RAM (санах ой) ба хадгалах диск (SSD/HDD)-ийг андуурах','Их GHz үргэлж хурдан гэж бодох (цөм, архитектур хамаарна)','Программ ба өгөгдлийг ялгахгүй'], code:false },
  { id:'it-2-2', skill:'it-networks', chap:'II', chapTitle:'Компьютерын системийн үндэс', num:'2.2', title:'Компьютерын сүлжээ, интернэт',
    focus:'Компьютерын сүлжээ (LAN/WAN), сүлжээний бүтэц (topology), интернэт, IP хаяг, протокол (HTTP/TCP-IP), сервер-клиент.',
    misc:['Интернэт = веб (www) гэж боддог (веб бол интернэтийн нэг үйлчилгээ)','Wi-Fi = интернэт гэж ойлгох (Wi-Fi бол холболтын арга)','IP хаяг тогтмол гэж бодох'], code:false },
  { id:'it-3-1', skill:'it-information-systems', chap:'III', chapTitle:'Мэдээллийн систем', num:'3.1', title:'Мэдээллийн систем ба өгөгдлийн сан',
    focus:'Систем, "Оролт-Боловсруулалт-Гаралт" (ОБГ) загвар; мэдээллийн систем ба түүний бүрэлдэхүүн; өгөгдлийн сан (хүснэгт, бичлэг, талбар); мэдээллийн систем хөгжүүлэх үе шат.',
    misc:['Өгөгдөл (data) ба мэдээлэл (information)-ийг ялгахгүй','Өгөгдлийн сан = Excel хүснэгт гэж бодох','Систем нь зөвхөн техник хангамж гэж үзэх'], code:false },
  { id:'it-4-1', skill:'it-algorithm', chap:'IV', chapTitle:'Программчлалын үндэс', num:'4.1', title:'Алгоритм ба Small Basic хэл',
    focus:'Алгоритмын тодорхойлолт, шинж чанар (тодорхой, дараалалтай, төгсгөлтэй), блок-схем; Small Basic хэлний танилцуулга — TextWindow.Write, TextWindow.Read, WriteLine. Энгийн дараалсан программ.',
    misc:['Алгоритм заавал код байх ёстой гэж бодох (алгоритм = алхмуудын дараалал)','Алхмуудын дараалал хамаагүй гэж үзэх','Small Basic мөрийг андуурч бичих'], code:true },
  { id:'it-4-2', skill:'it-variables-conditions', chap:'IV', chapTitle:'Программчлалын үндэс', num:'4.2', title:'Хувьсагч ба нөхцөл',
    focus:'Хувьсагч, оноох үйлдэл (=), Small Basic-д If/Then/Else/EndIf нөхцөл, харьцуулах оператор (>, >=, <, <=, =), логик And/Or.',
    misc:['Хувьсагчийг алгебрийн үл мэдэгдэгч гэж бодох — $x=x+1$ нь "оноох" (өмнөх утга +1), тэгшитгэл биш','Харьцуулах операторын чиглэлийг андуурах (>= ба <= )','Or-ыг үгүйсгэсэн (XOR) утгаар ойлгох — Or нь "аль нэг нь ч үнэн"','= (оноох) ба = (тэнцэх)-ийг андуурах'], code:true },
  { id:'it-4-3', skill:'it-loops', chap:'IV', chapTitle:'Программчлалын үндэс', num:'4.3', title:'Давталт',
    focus:'Small Basic давталт: For i=1 To n ... EndFor, While ... EndWhile; тоолуур, алхам (Step), давталтын хил хязгаар. Кодыг уншиж гаралтыг тодорхойлох.',
    misc:['Тоолуурын алхмыг андуурах (i=i+1 vs i=i+2 → давталтын тоо өөр)','Давталтын хил (For i=1 To n нь n удаа, To n-1 биш)','Давталт бүр ижил гаралт өгнө гэж бодох (тоолуур өөрчлөгддөг)','Хязгааргүй давталт (нөхцөл хэзээ ч зогсдоггүй)'], code:true },
  { id:'it-4-4', skill:'it-subroutines', chap:'IV', chapTitle:'Программчлалын үндэс', num:'4.4', title:'Дэд программ',
    focus:'Small Basic дэд программ: Sub name ... EndSub, дуудлага (name()), давтагдах кодыг дэд программд задлах ач холбогдол, глобал хувьсагч.',
    misc:['Дэд программ өөрөө автоматаар ажиллана гэж бодох (дуудах ёстой)','Дэд программын доторх кодыг тодорхойлсон дарааллаар ажиллана гэж бодох','Sub тодорхойлохыг дуудахтай андуурах'], code:true },
  { id:'it-4-5', skill:'it-arrays-sorting', chap:'IV', chapTitle:'Программчлалын үндэс', num:'4.5', title:'Массив ба эрэмбэлэлт',
    focus:'Массив (нэг төрлийн элементүүд), индексжүүлэлт a[i], элемент унших/бичих; хөөсрүүлэх эрэмбэлэлт (bubble sort)-ийн алхмууд, зэргэлдээ элементүүдийг харьцуулж солих.',
    misc:['Массивын индексийг андуурах (a[i] vs a[j])','Индексийн хил (1-ээс n, эсвэл 0-ээс эхлэх)','Эрэмбэлэлтэд солих (swap) алхмыг орхих','Эрэмбийн чиглэл (өсөх/буурах)-ийг андуурах'], code:true },
  { id:'it-4-6', skill:'it-search-strings', chap:'IV', chapTitle:'Программчлалын үндэс', num:'4.6', title:'Хайлт ба тэмдэгт мөр',
    focus:'Массиваас элемент хайх (шугаман хайлт) — бүх элементийг дараалан шалгах; тэмдэгт мөр (string): урт, нэгтгэх (concatenation), тэмдэгт унших.',
    misc:['Хайлт олдмогц зогсох ёстойг мартах','Тэмдэгт мөрийн индексийг андуурах','Тэмдэгт мөр нэгтгэх (+) ба тоо нэмэхийг андуурах'], code:true },
]

const EN_SPECS = [
  { id:'en-1-1', skill:'en-present-tenses', chap:'I', chapTitle:'Study and Work', num:'1.1', title:'Present simple & continuous (Unit 1: Teens Today)', unit:'Teens Today (leisure, school clubs, feelings)',
    focus:'Present simple (active & passive) ба present continuous (active & passive). Хэрэглээ: present simple = байнгын үйлдэл/үнэн, present continuous = яг одоо болж буй үйлдэл. Passive: am/is/are + V3.',
    misc:['Present simple (байнгын) ба present continuous (яг одоо)-г андуурах','3-р бие ганц тоонд -s залгахаа мартах (he works)','Passive-ийг буруу байгуулах (is made, not is make)'] },
  { id:'en-1-2', skill:'en-perfect-modals', chap:'I', chapTitle:'Study and Work', num:'1.2', title:'Present perfect & modals for advice (Unit 2: Learning for the Future)', unit:'Learning for the Future (study skills, lifelong learning)',
    focus:'Present perfect simple (active & passive): have/has + V3; for/since; туршлага. Modals for advice: should, ought to, had better.',
    misc:['Present perfect ба past simple-ийг андуурах (I have seen vs I saw)','for (хугацааны урт) ба since (эхлэл цэг)-ийг андуурах','should дараа to залгах (should go, not should to go)'] },
  { id:'en-1-3', skill:'en-future-questions', chap:'I', chapTitle:'Study and Work', num:'1.3', title:'Future forms & questions (Unit 3: Jobs and Society)', unit:'Jobs and Society (careers, community service)',
    focus:'Future simple (will) ба future perfect (will have + V3), active & passive; subject questions (Who called?) ба object questions (Who did you call?).',
    misc:['will ба be going to-г андуурах','Subject question-д do/does хэрэглэх алдаа (Who called? биш Who did call?)','Future perfect байгуулах алдаа'] },
  { id:'en-2-1', skill:'en-relative-clauses', chap:'II', chapTitle:'Cultures and Traditions', num:'2.1', title:'Relative clauses (Unit 4: Roots of Mongolian Identity)', unit:'Roots of Mongolian Identity (traditions, symbolism)',
    focus:'Relative clauses: who (хүн), which/that (юм), where (газар), when (цаг). Defining ба non-defining (таслал).',
    misc:['who/which/that-ийн сонголтыг андуурах (хүн→who, юм→which)','where ба when-ийг андуурах','Non-defining clause-д таслал тавихаа мартах'] },
  { id:'en-2-2', skill:'en-reason-time-clauses', chap:'II', chapTitle:'Cultures and Traditions', num:'2.2', title:'Clauses of reason & time (Unit 5: Cultures Around the World)', unit:'Cultures Around the World (customs, lifestyles)',
    focus:'Clauses of reason: because (+ өгүүлбэр), because of / due to (+ нэр үг). Time clauses: when, while, as, before, after.',
    misc:['because (+ өгүүлбэр) ба because of / due to (+ нэр үг)-ийг андуурах','while (үргэлжилсэн) ба when (цэг)-ийг андуурах','Time clause-д ирээдүйн цагт will хэрэглэх алдаа (When I will → When I)'] },
  { id:'en-2-3', skill:'en-past-infinitives', chap:'II', chapTitle:'Cultures and Traditions', num:'2.3', title:'Past simple vs present perfect; infinitives (Unit 6: Language in Mind)', unit:'Language in Mind (stories, heritage)',
    focus:'Past simple (тодорхой өнгөрсөн цаг) vs present perfect (тодорхойгүй/одоотой холбоотой); infinitive (to + V) ба gerund (V-ing) хэрэглээ.',
    misc:['Past simple (yesterday) ба present perfect (already/yet)-ийг андуурах','Тогтмол үйл үгийн 2-р хэлбэр (went, not goed)','infinitive ба gerund-ийг андуурах (enjoy doing, want to do)'] },
  { id:'en-3-1', skill:'en-passive-quantifiers', chap:'III', chapTitle:'Mother Nature and Wellness', num:'3.1', title:'Passive modals & quantifiers (Unit 7: Nature Conservation)', unit:'Nature Conservation (pollution, environment)',
    focus:'Passive with modals: must/should/can + be + V3 (Trees must be planted). Quantifiers: much/many, (a) few/(a) little, some/any — countable vs uncountable.',
    misc:['Passive modal байгуулах (must be done, not must done)','much (uncountable) ба many (countable)-ийг андуурах','few/little-ийн countable/uncountable ялгаа'] },
  { id:'en-3-2', skill:'en-comparatives-transitions', chap:'III', chapTitle:'Mother Nature and Wellness', num:'3.2', title:'Comparatives & transition words (Unit 8: Healthy Lifestyle)', unit:'Healthy Lifestyle (sport, brain, habits)',
    focus:'Comparative (-er/more ... than) ба superlative (the -est/most); transition words (however, therefore, in addition, for example).',
    misc:['-er/more-ийг давхар хэрэглэх (more bigger)','than-ийг орхих эсвэл then-тэй андуурах','Superlative-д the-г мартах'] },
  { id:'en-4-1', skill:'en-reported-speech', chap:'IV', chapTitle:'Gateway to Success', num:'4.1', title:'Reported (indirect) speech (Unit 9: Technology Today)', unit:'Technology Today (drones, online learning, cyber safety)',
    focus:'Direct → reported speech: цагийн ухралт (present→past), төлөөний ба цаг хугацааны үгийн өөрчлөлт; reported questions (үгийн эрэмбэ өгүүлбэрийн дараалалд).',
    misc:['Цагийн ухралтыг (backshift) мартах (said he was, not said he is)','Reported question-ийн үгийн эрэмбэ (asked where I was, not asked where was I)','now→then, today→that day өөрчлөлтийг мартах'] },
  { id:'en-4-2', skill:'en-participles-phrases', chap:'IV', chapTitle:'Gateway to Success', num:'4.2', title:'Participles & noun/adverb phrases (Unit 10: Sport & Entertainment)', unit:'Sport & Entertainment (movies, celebrities, sports)',
    focus:'Present participle (-ing: boring) ба past participle (-ed: bored) — ялгаа; noun phrases; adverb structures ба байрлал.',
    misc:['-ing (шинж чанар: boring) ба -ed (мэдрэмж: bored)-ийг андуурах (I am boring vs I am bored)','Adverb-ийн байрлал (usually, always)','Оролт adverb-ийг буруу байрлуулах'] },
]

function commonRules(subject) {
  const base = [
    'ЗӨВХӨН StructuredOutput-оор бүтэцлэсэн үр дүн буцаа.',
    'СОНГОЛТ: сонголт бүрд яг 4 хувилбар. answer/t1_answer/t2_answer нь ЗӨВ индекс (0-3). Буруу хувилбаруудыг дээрх буруу ойлголтоос УХАМСАРТАЙ бүтээ (distractor).',
    'ҮНЭН ЗӨВ: бүх хариулт үнэн зөв байх ёстой.',
  ]
  if (subject === 'it') {
    base.push('ХЭЛ: Бүх текст МОНГОЛ хэлээр, 12-р ангийн сурагчид ойлгомжтой. Программчлалын код зөвхөн **Microsoft Small Basic** синтакстай (TextWindow.Write/WriteLine/Read, For..EndFor, While..EndWhile, If..Then..Else..EndIf, Sub..EndSub, массив a[i]).')
    base.push('КОД: Код блокийг гурван налуу тэмдэгтээр (```) эхлүүлж төгсгө — жишээ:\n```\nFor i = 1 To 5\n  TextWindow.WriteLine(i)\nEndFor\n```\nМөрийн доторх нэр/түлхүүр үгийг нэг налуугаар (`code`) бич. LaTeX (математик) БҮҮ хэрэглэ — latex талбарыг хоосон "" үлдээ.')
  } else {
    base.push('ХЭЛ: Хос хэлээр — грамматик дүрэм, тайлбарыг МОНГОЛ хэлээр энгийн ойлгомжтой тайлбарла; жишээ өгүүлбэр, дасгалын асуулт нь АНГЛИ хэл дээр. Сэдэв (theme)-тэй холбоотой үгсийн сан ашигла.')
    base.push('LaTeX/КОД БҮҮ хэрэглэ — latex талбарыг хоосон "" үлдээ. Грамматик нэр томьёог нэг налуугаар (`code`) тодруулж болно (жишээ: `present perfect`).')
  }
  return base.join('\n')
}

function authorPrompt(s) {
  const subjMn = s.subject === 'it' ? 'Мэдээллийн технологи' : 'Англи хэл'
  const reader = s.subject === 'it' ? IT_READER : EN_READER
  const bookId = s.subject === 'it' ? 340 : 357
  const pages = s.subject === 'it' ? `Бүлэг ${s.chap}. ${s.chapTitle} — ${s.num}` : `${s.chapTitle} — Unit: ${s.unit}`
  return `Чи бол Монголын 12-р ангийн ${subjMn} хичээлийн сурах бичиг зохиогч, арга зүйч. Албан ёсны БШУЯ-ны сурах бичгийн бүтэц, агуулгад НИЙЦҮҮЛЭН доорх сэдвээр БҮРЭН хичээл + түвшин тогтоох 10 асуулт + ойлголт батлах даалгавар зохио.

## Сэдэв
- Хичээл: "${s.title}" (Бүлэг ${s.chap} — ${s.chapTitle}, ${s.num})
- skill_id: ${s.skill}, lesson_id: ${s.id}, анги: 12, хичээл: ${subjMn}
- Заавал заах агуулга: ${s.focus}
- ЗААВАЛ шийдэх ёстой түгээмэл БУРУУ ОЙЛГОЛТууд (эдгээрийг distractor болон two-tier-д ашигла):
${s.misc.map(m => '  • ' + m).join('\n')}

## Дүрэм
${commonRules(s.subject)}

## Гаргах бүтэц (StructuredOutput schema-г яг дага)
- lesson: id=${s.id}, grade=12, chapter_num="${s.chap}", chapter_title_mn="${s.chapTitle}", lesson_num="${s.num}", title_mn="${s.title}", title_en=англи гарчиг, skill_id="${s.skill}", prerequisite_skill_ids=[], textbook={book_id:${bookId}, pages_mn:"${pages}", reader_url:"${reader}"}, objectives_mn=[2-3 зорилт], pretest=1 асуулт, sections=4-6 хэсэг (type: "concept"/"definition"/"example"; body_mn нь **тод** тэмдэглэгээ, богино догол мөр${s.subject==='it'?', код блок (```)':', англи жишээ өгүүлбэр'}), practice=4 дасгал (hint_mn + solution_mn-тэй, хялбар→хэцүү), mastery_check=3 асуулт.
- level_questions: ЯГ 10 асуулт. id="lt-${s.skill}-1"..."lt-${s.skill}-10", skill_id="${s.skill}", difficulty 1..3, choices 4, answer индекс, explanation_mn. ${s.subject==='it'?'Зарим асуулт код уншиж гаралт/алдаа олох (concept + code-reading).':'Grammar/vocabulary/reading асуултууд, зарим нь буруу хэлбэрийг ялгах.'}
- mastery: skill_id="${s.skill}", title_mn="${s.title}", lesson_id="${s.id}", ordering=2 даалгавар (${s.subject==='it'?'алгоритм/кодын алхмуудыг ЗӨВ дараалалд':'англи үгсийг ЗӨВ өгүүлбэрийн дарааллд эсвэл алхмуудыг'} steps-д бич — систем холихыг гүйцэтгэнэ), two_tier=3 даалгавар (t1=асуулт+4 сонголт+t1_answer, t2_prompt="Яагаад?"+t2_choices 4+t2_answer; буруу t2 нь misconception_mn-д тайлбарласан буруу ойлголтыг илэрхийлнэ).

latex талбар бүрийг хоосон "" үлдээ (энэ хичээлд математик томьёо байхгүй).`
}

function verifyPrompt(s, bundle) {
  const subjMn = s.subject === 'it' ? 'Мэдээллийн технологи (Small Basic программчлал)' : 'Англи хэл (грамматик)'
  return `Чи бол ${subjMn} хичээлийн эксперт хянагч. Доорх 12-р ангийн хичээлийн багцыг ШҮҮМЖЛЭЛТЭЙ шалга. Гол зорилго: АГУУЛГЫН АЛДАА, БУРУУ ХАРИУЛТЫН ТҮЛХҮҮР илрүүлж ЗАСАХ.

Шалгах зүйлс:
1) Асуулт бүрийн answer/t1_answer/t2_answer индекс ҮНЭН ЗӨВ эсэх (сонголтуудтай тулгаж).
${s.subject==='it'
  ? '2) Small Basic код синтакс зөв эсэх (For..EndFor, If..Then..EndIf, TextWindow.*); код уншсан гаралт ЗӨВ эсэх; давталтын тоо/индекс зөв.\n3) Зөвхөн Small Basic (Python/C биш) ашигласан эсэх.'
  : '2) Англи грамматик ЗӨВ эсэх (цаг, passive, relative clause, reported speech г.м.); жишээ өгүүлбэр алдаагүй эсэх.\n3) Тайлбар монголоор, жишээ англиар байгаа эсэх.'}
4) latex талбар хоосон эсэх; сонголт бүр 4; ordering steps ЗӨВ дараалалтай эсэх; монгол хэл зөв.

Сэдэв: ${s.title} (skill=${s.skill}). Агуулга: ${s.focus}

Багц (JSON):
${JSON.stringify(bundle)}

ЗАСВАРЛАСАН БҮТЭН багцыг буцаа: бүх талбарыг хадгалж, зөвхөн алдаатайг засаад бүтэн lesson/level_questions/mastery-г StructuredOutput-оор гаргана. Алдаагүй бол ижлээр буцаа. "notes"-д олдсон алдаа, засварыг товч бич.`
}

// ---- schemas (same shape as physics build) ----
const MC = { type:'object', additionalProperties:false, required:['stem_mn','latex','choices','answer'],
  properties:{ stem_mn:{type:'string'}, latex:{type:'string'}, choices:{type:'array',items:{type:'string'},minItems:4,maxItems:4}, answer:{type:'integer',minimum:0,maximum:3}, hint_mn:{type:'string'}, solution_mn:{type:'string'}, explanation_mn:{type:'string'} } }
const LESSON = { type:'object', additionalProperties:false,
  required:['id','grade','chapter_num','chapter_title_mn','lesson_num','title_mn','title_en','skill_id','prerequisite_skill_ids','textbook','objectives_mn','pretest','sections','practice','mastery_check'],
  properties:{ id:{type:'string'}, grade:{type:'integer'}, chapter_num:{type:'string'}, chapter_title_mn:{type:'string'}, lesson_num:{type:'string'}, title_mn:{type:'string'}, title_en:{type:'string'}, skill_id:{type:'string'}, prerequisite_skill_ids:{type:'array',items:{type:'string'}},
    textbook:{type:'object',additionalProperties:false,required:['book_id','pages_mn','reader_url'],properties:{book_id:{type:'integer'},pages_mn:{type:'string'},reader_url:{type:'string'}}},
    objectives_mn:{type:'array',items:{type:'string'},minItems:2},
    pretest:MC,
    sections:{type:'array',minItems:4,items:{type:'object',additionalProperties:false,required:['type','title_mn','body_mn'],properties:{type:{type:'string'},title_mn:{type:'string'},body_mn:{type:'string'}}}},
    practice:{type:'array',minItems:4,items:MC},
    mastery_check:{type:'array',minItems:3,items:MC} } }
const LEVELQ = { type:'object', additionalProperties:false, required:['id','skill_id','difficulty','stem_mn','latex','choices','answer','explanation_mn'],
  properties:{ id:{type:'string'}, skill_id:{type:'string'}, difficulty:{type:'integer',minimum:1,maximum:3}, stem_mn:{type:'string'}, latex:{type:'string'}, choices:{type:'array',items:{type:'string'},minItems:4,maxItems:4}, answer:{type:'integer',minimum:0,maximum:3}, explanation_mn:{type:'string'} } }
const MASTERY = { type:['object','null'], additionalProperties:false, required:['skill_id','title_mn','lesson_id','ordering','two_tier'],
  properties:{ skill_id:{type:'string'}, title_mn:{type:'string'}, lesson_id:{type:'string'},
    ordering:{type:'array',items:{type:'object',additionalProperties:false,required:['id','stem_mn','latex','steps'],properties:{id:{type:'string'},stem_mn:{type:'string'},latex:{type:'string'},steps:{type:'array',items:{type:'string'},minItems:2}}}},
    two_tier:{type:'array',items:{type:'object',additionalProperties:false,required:['id','stem_mn','latex','t1_choices','t1_answer','t2_prompt_mn','t2_choices','t2_answer','misconception_mn'],properties:{id:{type:'string'},stem_mn:{type:'string'},latex:{type:'string'},t1_choices:{type:'array',items:{type:'string'},minItems:4,maxItems:4},t1_answer:{type:'integer',minimum:0,maximum:3},t2_prompt_mn:{type:'string'},t2_choices:{type:'array',items:{type:'string'},minItems:4,maxItems:4},t2_answer:{type:'integer',minimum:0,maximum:3},misconception_mn:{type:'string'}}}} } }
const BUNDLE = { type:'object', additionalProperties:false, required:['lesson','level_questions','mastery'],
  properties:{ lesson:LESSON, level_questions:{type:'array',minItems:10,maxItems:10,items:LEVELQ}, mastery:MASTERY } }
const VBUNDLE = { type:'object', additionalProperties:false, required:['lesson','level_questions','mastery','notes'],
  properties:{ ...BUNDLE.properties, notes:{type:'string'} } }

const SPECS = [...IT_SPECS.map(s => ({...s, subject:'it'})), ...EN_SPECS.map(s => ({...s, subject:'english'}))]

phase('Author')
const results = await pipeline(
  SPECS,
  (s) => agent(authorPrompt(s), { label:`author:${s.skill}`, phase:'Author', schema:BUNDLE }).then(b => ({ spec:s, bundle:b })),
  ({ spec, bundle }) => {
    if (!bundle) return null
    return agent(verifyPrompt(spec, bundle), { label:`verify:${spec.skill}`, phase:'Verify', schema:VBUNDLE })
      .then(v => ({ spec, final: v || bundle, notes: v?.notes || '(verify failed → author kept)' }))
  }
)

const ok = results.filter(Boolean)
log(`Authored+verified ${ok.length}/${SPECS.length} topics (IT+English)`)
return { topics: ok.map(r => ({ subject:r.spec.subject, skill:r.spec.skill, id:r.spec.id, notes:r.notes,
  bundle:{ lesson:r.final.lesson, level_questions:r.final.level_questions, mastery:r.final.mastery } })) }
