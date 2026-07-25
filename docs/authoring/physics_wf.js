export const meta = {
  name: 'physics-g7-authoring',
  description: 'Author Grade-7 physics lessons + level-test + mastery (Ф7.1–Ф7.4), adversarially verified',
  phases: [
    { title: 'Author', detail: 'one agent per topic writes lesson + 10 level Qs + mastery' },
    { title: 'Verify', detail: 'adversarial physics/answer-key check → corrected bundle' },
  ],
}

const READER = 'https://econtent.edu.mn/pages/more.php?id=291'

// Full grade-7 physics topic specs, aligned to the official 2019 core-curriculum
// learning objectives (Ф7.1–Ф7.4). Misconceptions drawn from PER research.
const SPECS = [
  {
    id: 'p7-1-1', skill: 'p7-length-time', chap: 'I', chapTitle: 'Биеийн ерөнхий шинж чанар',
    num: '1.1', title: 'Урт ба хугацаа хэмжих', strand: 'Ф7.1 Биеийн ерөнхий шинж чанар',
    objectives: ['Ф7.1а: Биеийн уртыг шугам, утас ашиглан хэмжих', 'Ф7.1б: Штангенциркуль, микрометрээр уртыг нарийвчлалтай хэмжих', 'Ф7.1г: Үзэгдлийн үргэлжлэх хугацааны завсрыг хэмжих'],
    formulas: ['Урт: метр (м), см, мм', 'Хугацаа: секунд (с)'],
    misconceptions: ['Хэмжлийн багажийн нарийвчлал (заалтын хамгийн бага утга)-ыг үл ойлгох', 'Урт хэмжихдээ 0-ээс биш эхлэлээс уншиж алдах', 'Хугацаа хэмжихэд эхлэл/төгсгөлийг буруу тэмдэглэх'],
    mastery: false,
  },
  {
    id: 'p7-1-2', skill: 'p7-mass-weight', chap: 'I', chapTitle: 'Биеийн ерөнхий шинж чанар',
    num: '1.2', title: 'Масс ба жин', strand: 'Ф7.1 Биеийн ерөнхий шинж чанар',
    objectives: ['Ф7.1в: Масс нь жин биш гэсэн ойлголтыг жинлүүр, дэнс ашиглан тодорхойлох'],
    formulas: ['Масс: килограмм (кг) — бодисын хэмжээ', 'Жин: Ньютон (Н) — таталцлын хүч (чанарын хувьд)'],
    misconceptions: ['Масс (бодисын хэмжээ, кг) ба жин (таталцлын хүч, Н)-г ижилтгэх — хамгийн түгээмэл алдаа', 'Сар дээр биеийн жин багасна ГЭХДЭЭ масс өөрчлөгдөхгүй гэдгийг ойлгохгүй', 'Том хэмжээтэй бие үргэлж их масстай гэж бодох (нягт хамаарна)'],
    mastery: true,
  },
  {
    id: 'p7-1-3', skill: 'p7-density', chap: 'I', chapTitle: 'Биеийн ерөнхий шинж чанар',
    num: '1.3', title: 'Эзлэхүүн ба нягт', strand: 'Ф7.1 Биеийн ерөнхий шинж чанар',
    objectives: ['Ф7.1д: Түрэгдсэн шингэний эзлэхүүнийг хэмжих туршилт, тооцоолол', 'Ф7.1е: Хатуу, шингэн биеийн нягтыг тодорхойлох, хялбар тооцоолол'],
    formulas: ['Нягт: $\\rho=\\dfrac{m}{V}$', 'Нэгж: кг/м³ буюу г/см³'],
    misconceptions: ['Том буюу хүнд бие үргэлж нягт ихтэй гэж бодох — нягт нь масс/эзлэхүүн харьцаа', 'Ижил эзлэхүүнтэй хэрнээ өөр нягттай бие ижил хүндтэй гэж бодох', 'Түрэгдсэн шингэний эзлэхүүн = живсэн биеийн эзлэхүүн гэдгийг ойлгохгүй'],
    mastery: true,
  },
  {
    id: 'p7-1-4', skill: 'p7-floating', chap: 'I', chapTitle: 'Биеийн ерөнхий шинж чанар',
    num: '1.4', title: 'Хөвөх ба живэх нөхцөл', strand: 'Ф7.1 Биеийн ерөнхий шинж чанар',
    objectives: ['Ф7.1ж: Хий ба шингэнд бие хөвөх, живэх нөхцөлийг тодорхойлох'],
    formulas: ['Хөвөх нөхцөл: $\\rho_{бие} < \\rho_{шингэн}$', 'Живэх нөхцөл: $\\rho_{бие} > \\rho_{шингэн}$', 'Түрэх (Архимедийн) хүч (чанарын хувьд)'],
    misconceptions: ['Хүнд бие үргэлж живнэ гэж бодох — живэх нь биеийн нягтыг шингэний нягттай харьцуулснаас хамаарна', 'Том хэмжээтэй бие живнэ гэж бодох (жишээ: төмөр хөлөг усан онгоц яагаад хөвдөг)', 'Түрэх хүч нь зөвхөн хүнд биед үйлчилдэг гэж бодох'],
    mastery: true,
  },
  {
    id: 'p7-1-5', skill: 'p7-temperature', chap: 'I', chapTitle: 'Биеийн ерөнхий шинж чанар',
    num: '1.5', title: 'Температур', strand: 'Ф7.1 Биеийн ерөнхий шинж чанар',
    objectives: ['Ф7.1з: Температурыг биеийн халалтаар тодорхойлох, шингэний температурыг термометрээр хэмжих'],
    formulas: ['Температур: Цельсийн градус (°C)', 'Термометрийн ажиллах зарчим (шингэний тэлэлт)'],
    misconceptions: ['Температур ба дулааныг ижилтгэх — температур нь халалтын хэмжүүр, дулаан нь дамжих энерги', 'Том бие үргэлж илүү халуун гэж бодох (температур хэмжээнээс хамаардаггүй)', 'Хүйтэн нь “дулааны эсрэг тусдаа зүйл” гэж бодох (хүйтэн = бага температур)'],
    mastery: true,
  },
  {
    id: 'p7-1-6', skill: 'p7-speed', chap: 'I', chapTitle: 'Биеийн ерөнхий шинж чанар',
    num: '1.6', title: 'Биеийн хөдөлгөөний хурд', strand: 'Ф7.1 Биеийн ерөнхий шинж чанар',
    objectives: ['Ф7.1и: Биеийн хөдөлгөөний хурдыг тодорхойлох'],
    formulas: ['Хурд: $V=\\dfrac{S}{t}$', 'Нэгж: м/с буюу км/ц'],
    misconceptions: ['Хурд ба туулсан замыг ижилтгэх — хурд нь зам ба хугацааны харьцаа', 'Жигд ба жигд бус хөдөлгөөнийг ялгахгүй байх', 'Хөдөлгөөн харьцангуй (тооллын биетэй холбоотой) гэдгийг ойлгохгүй'],
    mastery: true,
  },
  {
    id: 'p7-2-1', skill: 'p7-magnetism', chap: 'II', chapTitle: 'Соронзон',
    num: '2.1', title: 'Соронз ба соронзон орон', strand: 'Ф7.2 Соронзон',
    objectives: ['Ф7.2а: Тогтмол соронзны туйлуудын зайнаас харилцан үйлчлэх үйлчлэлийг илэрхийлэх', 'Ф7.2б: Тогтмол соронзны орчим дахь төмрийн үртэсний төрхийг туршилтаар харуулах'],
    formulas: ['Хойд (N) ба урд (S) туйл', 'Соронзон орон — төмрийн үртэсээр дүрслэх'],
    misconceptions: ['Бүх металл соронзонд татагдана гэж бодох — зөвхөн төмөр, никель, кобальт татагдана', 'Ижил туйлууд татална гэж бодох — ижил туйл ТҮЛХЭЛЦЭНЭ, эсрэг туйл ТАТАЛЦАНА', 'Соронзыг хагалбал нэг туйл тусдаа үлдэнэ гэж бодох — үргэлж хоёр туйлтай хэвээр'],
    mastery: true,
  },
  {
    id: 'p7-3-1', skill: 'p7-sound-propagation', chap: 'III', chapTitle: 'Дуу',
    num: '3.1', title: 'Дуу үүсэх ба тархалт', strand: 'Ф7.3 Дуу',
    objectives: ['Ф7.3а: Биеийн чичирхийлэлээр дуу авиа үүсдэгийг харуулах', 'Ф7.3в: Дууны долгион тарахад орчин хэрэгтэйг тайлбарлах, хатуу/шингэн/хийд дуу тарах хурдыг эрэмбэлэх'],
    formulas: ['Дуу тархахад орчин (хатуу/шингэн/хий) шаардлагатай', 'Хурд: $v_{хатуу} > v_{шингэн} > v_{хий}$'],
    misconceptions: ['Дуу вакуум (агааргүй орон зай)-д тардаг гэж бодох — дуу тархахад заавал орчин хэрэгтэй', 'Дуу хийд хамгийн хурдан тардаг гэж бодох — үнэндээ хатуу биед хамгийн хурдан', 'Дуу нь бодис зөөдөг гэж бодох — зөвхөн чичирхийллийн энерги дамждаг'],
    mastery: true,
  },
  {
    id: 'p7-3-2', skill: 'p7-sound-properties', chap: 'III', chapTitle: 'Дуу',
    num: '3.2', title: 'Дууны чанга-сул, өндөр-нам, цуурай', strand: 'Ф7.3 Дуу',
    objectives: ['Ф7.3б: Осциллоскопоор дууны чанга-сул ба далайц, өндөр-нам ба давтамжийн холбоог тодорхойлох', 'Ф7.3г: Дууны ойлтоор цуурай хэрхэн үүсэхийг дүрслэх'],
    formulas: ['Далайц ↑ → дуу чанга', 'Давтамж (Гц) ↑ → дуу өндөр', 'Цуурай — дууны ойлт'],
    misconceptions: ['Дууны чанга-сул (далайц) ба өндөр-нам (давтамж)-ыг андуурах', 'Өндөр дуу = чанга дуу гэж бодох (өөр өөр шинж)', 'Цуурай нь ямар нэг тусдаа дуу гэж бодох — үнэндээ ойсон дуу'],
    mastery: true,
  },
  {
    id: 'p7-4-1', skill: 'p7-earth-sun-moon', chap: 'IV', chapTitle: 'Бидний эргэн тойрон дахь физик',
    num: '4.1', title: 'Дэлхий, Нар, Сарны хөдөлгөөн', strand: 'Ф7.4 Бидний эргэн тойрон дахь физик',
    objectives: ['Ф7.4а: Дэлхий нарыг тойрох, сарны дэлхийг тойрох хөдөлгөөнийг дүрслэн тайлбарлах'],
    formulas: ['Дэлхийн тэнхлэгийн эргэлт → өдөр/шөнө (24 цаг)', 'Дэлхий нарыг тойрох → жил', 'Сар дэлхийг тойрох → ~1 сар'],
    misconceptions: ['Нар дэлхийг тойрдог (геоцентр) гэж бодох — үнэндээ дэлхий нарыг тойрдог', 'Улирал нь дэлхий нарнаас хол/ойр болдгоос үүсдэг гэж бодох — үнэндээ тэнхлэгийн налуугаас', 'Өдөр шөнө нь нар унтардгаас болдог гэж бодох — дэлхийн эргэлтээс'],
    mastery: true,
  },
  {
    id: 'p7-4-2', skill: 'p7-constellations', chap: 'IV', chapTitle: 'Бидний эргэн тойрон дахь физик',
    num: '4.2', title: 'Одод ба одны орд', strand: 'Ф7.4 Бидний эргэн тойрон дахь физик',
    objectives: ['Ф7.4б: Тэнгэрийн хойд зүгийн одны ордны хоногийн ба сарын эргэлтийг зураг дээр тайлбарлах'],
    formulas: ['Алтан гадас од (Хойд туйлын од)', 'Долоон бурхан (Их баавгай) одны орд'],
    misconceptions: ['Бүх од дэлхийгээс ижил зайтай гэж бодох — өөр өөр зайтай', 'Алтан гадас од хөдөлдөггүй тул тэнгэрт байрлал нь тогтмол гэж бодох (бусад од түүнийг тойрон эргэх мэт харагдана)', 'Одны орд шөнийн турш огт хөдөлдөггүй гэж бодох'],
    mastery: false,
  },
]

function commonRules() {
  return [
    'ХЭЛ: Бүх текст МОНГОЛ хэлээр, 7-р ангийн (12–13 нас) сурагчид ойлгомжтой, энгийн.',
    'ТҮВШИН: 7-р ангийн физик. ХҮЧ, ДАРАЛТ (P=F/S), АЖИЛ, ЧАДАЛ, ЭНЕРГИ, ХӨШҮҮРЭГ зэрэг нь 8-р ангийн агуулга тул БҮҮ ор. Зөвхөн өгсөн зорилтын хүрээнд бич.',
    'ФОРМУЛА: Томьёо/тэмдэглэгээг $...$ дотор LaTeX-ээр бич (жишээ: $V=\\dfrac{S}{t}$, $\\rho=\\dfrac{m}{V}$). Ердийн текстэд LaTeX бүү хэрэглэ. LaTeX дотор HTML entity (&gt; гэх мэт) БҮҮ бич.',
    'СОНГОЛТ: Сонголт бүрд яг 4 хувилбар. answer нь ЗӨВ хувилбарын индекс (0-3). Буруу хувилбаруудыг дээрх буруу ойлголтуудаас УХАМСАРТАЙ бүтээ (distractor).',
    'ФИЗИК ҮНЭН ЗӨВ: Бүх хариулт физикийн хувьд ҮНЭН ЗӨВ байх ёстой. Тооцоолол хийвэл шалгаж бататга.',
  ].join('\n')
}

function authorPrompt(s) {
  return `Чи бол Монголын 7-р ангийн физикийн сурах бичиг зохиогч, арга зүйч. Доорх сэдвээр БҮРЭН хичээл + түвшин тогтоох 10 асуулт${s.mastery ? ' + ойлголт батлах (mastery) даалгавар' : ''} зохио.

## Сэдэв
- Хичээл: "${s.title}" (Бүлэг ${s.chap} — ${s.chapTitle}, хичээл ${s.num})
- skill_id: ${s.skill}, lesson_id: ${s.id}, анги: 7
- Хөтөлбөрийн зорилт (яг эдгээрийг заа):
${s.objectives.map(o => '  • ' + o).join('\n')}
- Гол томьёо/ойлголт:
${s.formulas.map(f => '  • ' + f).join('\n')}
- ЗААВАЛ шийдэх ёстой түгээмэл БУРУУ ОЙЛГОЛТууд (эдгээрийг distractor болон mastery-д ашигла):
${s.misconceptions.map(m => '  • ' + m).join('\n')}

## Дүрэм
${commonRules()}

## Гаргах бүтэц (StructuredOutput schema-г яг дага)
- lesson: id=${s.id}, grade=7, chapter_num="${s.chap}", chapter_title_mn="${s.chapTitle}", lesson_num="${s.num}", title_mn="${s.title}", title_en=англи гарчиг, skill_id="${s.skill}", prerequisite_skill_ids=[], textbook={book_id:291, pages_mn:"${s.strand}", reader_url:"${READER}"}, objectives_mn=[дээрх зорилтуудыг энгийн монголоор 3-аар], pretest=1 асуулт (өмнөх мэдлэг сорих), sections=4–6 хэсэг (type нь "concept"/"definition"/"example"; body_mn нь **тод** тэмдэглэгээ, богино догол мөр, бодит жишээ), practice=4 дасгал (хялбар→хэцүү, hint_mn + solution_mn-тэй), mastery_check=3 асуулт (ойлголт шалгах).
- level_questions: ЯГ 10 асуулт. id="lt-${s.skill}-1" .. "lt-${s.skill}-10", skill_id="${s.skill}", difficulty 1..3 (эхнийх амархан), choices 4, answer индекс, explanation_mn богино тайлбар. Асуултууд зорилтын бүх талыг хамруул, зарим нь буруу ойлголтыг шалгах концепцийн асуулт байх.
${s.mastery ? `- mastery: skill_id="${s.skill}", title_mn="${s.title}", lesson_id="${s.id}", ordering=2 даалгавар (алхмуудыг ЗӨВ дарааллаар нь steps-д бич — систем холихыг гүйцэтгэнэ), two_tier=3 даалгавар (t1=асуулт+4 сонголт+t1_answer, t2_prompt="Яагаад?"+t2_choices 4+t2_answer; буруу t2 нь misconception_mn-д тайлбарласан буруу ойлголтыг илэрхийлнэ).` : '- mastery: null (энэ сэдэвт mastery шаардлагагүй).'}

Зөвхөн StructuredOutput tool-оор бүтэцлэсэн үр дүн буцаа.`
}

function verifyPrompt(s, bundle) {
  return `Чи бол физикийн эксперт хянагч. Доорх 7-р ангийн физик хичээлийн багцыг ШҮҮМЖЛЭЛТЭЙ шалга. Гол зорилго: ФИЗИКИЙН АЛДАА, БУРУУ ХАРИУЛТЫН ТҮЛХҮҮР, ЛЕВЕЛ/АНГИД ТОХИРОХГҮЙ агуулгыг илрүүлж ЗАСАХ.

Шалгах зүйлс:
1) Асуулт бүрийн "answer"/"t1_answer"/"t2_answer" индекс ФИЗИКИЙН ХУВЬД ЗӨВ эсэх (сонголтуудтай тулгаж). Буруу бол зөв болго.
2) Тооцоолол ($V=S/t$, $\\rho=m/V$) зөв эсэх.
3) 8-р ангийн агуулга (даралт P=F/S, ажил, чадал, энерги, хөшүүрэг) ОРООГҮЙ эсэх — оруулсан бол 7-р ангийн зорилтод тааруул.
4) LaTeX зөв ($...$ дотор, HTML entity байхгүй), монгол хэл зөв, сонголт бүр 4.
5) ordering-ийн steps ЗӨВ дараалалтай эсэх.

Сэдэв: ${s.title} (skill=${s.skill}). Хөтөлбөрийн зорилт: ${s.objectives.join('; ')}.

Багц (JSON):
${JSON.stringify(bundle)}

ЗАСВАРЛАСАН БҮТЭН багцыг буцаа: бүх талбарыг хадгалж, зөвхөн алдаатайг нь засаад бүтэн lesson/level_questions/mastery-г StructuredOutput-оор гаргана. Хэрэв алдаагүй бол ижлээр нь буцаа. "notes" талбарт олдсон алдаа, хийсэн засварыг товч бич.`
}

// ---- schemas ----
const MC = {
  type: 'object', additionalProperties: false,
  required: ['stem_mn', 'latex', 'choices', 'answer'],
  properties: {
    stem_mn: { type: 'string' }, latex: { type: 'string' },
    choices: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
    answer: { type: 'integer', minimum: 0, maximum: 3 },
    hint_mn: { type: 'string' }, solution_mn: { type: 'string' }, explanation_mn: { type: 'string' },
  },
}
const LESSON = {
  type: 'object', additionalProperties: false,
  required: ['id', 'grade', 'chapter_num', 'chapter_title_mn', 'lesson_num', 'title_mn', 'title_en', 'skill_id', 'prerequisite_skill_ids', 'textbook', 'objectives_mn', 'pretest', 'sections', 'practice', 'mastery_check'],
  properties: {
    id: { type: 'string' }, grade: { type: 'integer' }, chapter_num: { type: 'string' },
    chapter_title_mn: { type: 'string' }, lesson_num: { type: 'string' }, title_mn: { type: 'string' },
    title_en: { type: 'string' }, skill_id: { type: 'string' },
    prerequisite_skill_ids: { type: 'array', items: { type: 'string' } },
    textbook: { type: 'object', additionalProperties: false, required: ['book_id', 'pages_mn', 'reader_url'],
      properties: { book_id: { type: 'integer' }, pages_mn: { type: 'string' }, reader_url: { type: 'string' } } },
    objectives_mn: { type: 'array', items: { type: 'string' }, minItems: 2 },
    pretest: MC,
    sections: { type: 'array', minItems: 4, items: { type: 'object', additionalProperties: false,
      required: ['type', 'title_mn', 'body_mn'],
      properties: { type: { type: 'string' }, title_mn: { type: 'string' }, body_mn: { type: 'string' } } } },
    practice: { type: 'array', minItems: 4, items: MC },
    mastery_check: { type: 'array', minItems: 3, items: MC },
  },
}
const LEVELQ = {
  type: 'object', additionalProperties: false,
  required: ['id', 'skill_id', 'difficulty', 'stem_mn', 'latex', 'choices', 'answer', 'explanation_mn'],
  properties: {
    id: { type: 'string' }, skill_id: { type: 'string' }, difficulty: { type: 'integer', minimum: 1, maximum: 3 },
    stem_mn: { type: 'string' }, latex: { type: 'string' },
    choices: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
    answer: { type: 'integer', minimum: 0, maximum: 3 }, explanation_mn: { type: 'string' },
  },
}
const MASTERY = {
  type: ['object', 'null'], additionalProperties: false,
  required: ['skill_id', 'title_mn', 'lesson_id', 'ordering', 'two_tier'],
  properties: {
    skill_id: { type: 'string' }, title_mn: { type: 'string' }, lesson_id: { type: 'string' },
    ordering: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['id', 'stem_mn', 'latex', 'steps'],
      properties: { id: { type: 'string' }, stem_mn: { type: 'string' }, latex: { type: 'string' },
        steps: { type: 'array', items: { type: 'string' }, minItems: 2 } } } },
    two_tier: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['id', 'stem_mn', 'latex', 't1_choices', 't1_answer', 't2_prompt_mn', 't2_choices', 't2_answer', 'misconception_mn'],
      properties: { id: { type: 'string' }, stem_mn: { type: 'string' }, latex: { type: 'string' },
        t1_choices: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 }, t1_answer: { type: 'integer', minimum: 0, maximum: 3 },
        t2_prompt_mn: { type: 'string' }, t2_choices: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
        t2_answer: { type: 'integer', minimum: 0, maximum: 3 }, misconception_mn: { type: 'string' } } } },
  },
}
const BUNDLE = {
  type: 'object', additionalProperties: false,
  required: ['lesson', 'level_questions', 'mastery'],
  properties: {
    lesson: LESSON,
    level_questions: { type: 'array', minItems: 10, maxItems: 10, items: LEVELQ },
    mastery: MASTERY,
  },
}
const VBUNDLE = {
  type: 'object', additionalProperties: false,
  required: ['lesson', 'level_questions', 'mastery', 'notes'],
  properties: { ...BUNDLE.properties, notes: { type: 'string' } },
}

phase('Author')
const results = await pipeline(
  SPECS,
  (s) => agent(authorPrompt(s), { label: `author:${s.skill}`, phase: 'Author', schema: BUNDLE })
    .then(b => ({ spec: s, bundle: b })),
  ({ spec, bundle }) => {
    if (!bundle) return null
    return agent(verifyPrompt(spec, bundle), { label: `verify:${spec.skill}`, phase: 'Verify', schema: VBUNDLE })
      .then(v => ({ spec, final: v || bundle, notes: v?.notes || '(verify failed → author kept)' }))
  }
)

const ok = results.filter(Boolean)
log(`Authored+verified ${ok.length}/${SPECS.length} physics topics`)
return {
  topics: ok.map(r => ({ skill: r.spec.skill, id: r.spec.id, notes: r.notes, bundle: {
    lesson: r.final.lesson, level_questions: r.final.level_questions, mastery: r.final.mastery,
  } })),
}
