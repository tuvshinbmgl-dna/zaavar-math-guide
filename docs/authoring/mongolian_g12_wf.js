export const meta = {
  name: 'mongolian-g12-authoring',
  description: 'Author Grade-12 Mongolian-language lessons + level test + mastery from the authentic Монгол хэл 12 ГАРЧИГ, adversarially verified',
  phases: [
    { title: 'Author', detail: 'one agent per topic writes lesson + 10 level Qs + mastery' },
    { title: 'Verify', detail: 'adversarial language/answer-key check → corrected bundle' },
  ],
}

const BOOK = 339
const GRADE = 12
const READER = `https://econtent.edu.mn/pages/more.php?id=${BOOK}`

// Бүтэц ба "Эзэмших чадвар" нь Монгол хэл 12 (2019, БШУЯ) сурах бичгийн 3-4 тал
// дээрх ГАРЧИГ ба "БИД 12 ДУГААР АНГИДАА ЮУ СУДЛАХ ВЭ?" хүснэгтээс авсан.
const SPECS = [
  {
    id: 'mn12-0-1', skill: 'mn12-review', chap: '0', chapTitle: 'Мэдлэг, чадвараа бататгах',
    num: '0.1', title: 'Мэдлэг, чадвараа бататгах', strand: 'Мэдлэг, чадвараа бататгах, 5–14 тал',
    objectives: [
      'Мэдрэмж, сэтгэгдэл, үзэл бодлоо баримтад тулгуурлан илэрхийлэх',
      'Өмнөх ангиудад эзэмшсэн эх, өгүүлбэр, найруулгын мэдлэгээ сэргээх',
    ],
    focus: ['эргэцүүлсэн эссэ', 'баримт ба үзэл бодлыг ялгах', 'найруулгын үндсэн шаардлага'],
    misconceptions: [
      'Баримт (нотлогдох) ба үзэл бодол (хувийн дүгнэлт)-ыг ижилтгэх',
      'Эргэцүүлсэн эссэ гэдгийг зөвхөн "сэтгэгдэл бичих" гэж хязгаарлаж, баримтгүй бичих',
      'Найруулгын алдаа зөвхөн бичиглэлийн алдаа гэж бодох — үг сонголт, өгүүлбэрийн бүтэц ч найруулга',
    ],
    mastery: true,
  },
  {
    id: 'mn12-1-1', skill: 'mn12-ge-clause', chap: 'I', chapTitle: 'Өгүүлбэр',
    num: '1.1', title: 'Өгүүлбэрийг "гэ-", "хэмээ-" холбох үгээр холбон найруулах',
    strand: 'Бүлэг I. Өгүүлбэр, 16–27 тал',
    objectives: [
      '"Гэ" холбох үг бүхий өгүүлбэрийг тайлбарлах',
      'Гишүүн өгүүлбэр, "гэ" холбох үгтэй өгүүлбэр, хэлц зэргээр дэлгэрүүлэн найруулах',
      '"Гэ-", "хэмээ-" холбох үгийн үүрэг, хэрэглээний ялгааг тодорхойлох',
    ],
    focus: [
      '"гэж", "гэсэн", "гэдэг", "гэв", "хэмээн", "хэмээх" зэрэг хувилбарууд',
      'шууд ба шууд бус хэлбэр (Тэр "би явна" гэв ↔ Тэр явна гэж хэлэв)',
      'гишүүн өгүүлбэрийг холбох үгээр гол өгүүлбэрт залгах',
    ],
    misconceptions: [
      '"Гэж" ба "гэсэн"-ийг сольж хэрэглэж болно гэж бодох — үүрэг өөр (нэг нь үйл, нөгөө нь тодотгол)',
      'Шууд хэллэгийг холбох үгээр залгахад хүн, цагийн хэлбэр өөрчлөгдөхийг үл ойлгох',
      '"Хэмээх" нь зөвхөн номын хэл гэж бодох — албан бичиг, шүлэгт бас хэрэглэгддэг',
    ],
    mastery: true,
  },
  {
    id: 'mn12-1-2', skill: 'mn12-idiom-sentence', chap: 'I', chapTitle: 'Өгүүлбэр',
    num: '1.2', title: 'Хэлц өгүүлбэрийн гол ба үүдэл санаа',
    strand: 'Бүлэг I. Өгүүлбэр, 28–40 тал',
    objectives: [
      'Хэлц ба хэлц бус өгүүлбэрийг ялган таних',
      'Хэлцийн үүдэл ба гол санааг тайлбарлах',
      'Хэлц бус өгүүлбэрийг хэлц үгээр солин найруулах; ойролцоо ба эсрэг санаат хэлцийг эх, өгүүлбэрт сонгон найруулах',
    ],
    focus: [
      'хэлц = үгсийн шууд утгаас ГАДНА нийлмэл дүрслэх утга гарах',
      'гол санаа (шууд утга) ↔ үүдэл санаа (дүрслэх, далд утга)',
      'ойролцоо санаат ба эсрэг санаат хэлц',
    ],
    misconceptions: [
      'Хэлцийн утгыг үг тус бүрийн шууд утгаас гаргаж болно гэж бодох',
      'Хэлц бүр албан бус хэл гэж бодох — олон хэлц номын хэлэнд бүрэн зохистой',
      'Ойролцоо санаат хэлцийг ямар ч эх бичвэрт чөлөөтэй сольж болно гэж бодох (найруулгын өнгө өөр)',
    ],
    mastery: true,
  },
  {
    id: 'mn12-2-1', skill: 'mn12-article-read', chap: 'II', chapTitle: 'Нийтлэл',
    num: '2.1', title: 'Нийтлэл унших', strand: 'Бүлэг II. Нийтлэл, 42–71 тал',
    objectives: [
      'Нийтлэл дэх зохиогчийн мэдрэмж, сэтгэгдэл, үзэл бодлыг уншсанаас задлан шинжлэх',
      'Нийтлэлийн уншигч, бүтэц, агуулга, утга холбооны уялдаа холбоог хам сэдвийн хүрээнд тайлбарлах',
      'Уран нийтлэлийн садвар, онцлогийг ангилж тодорхойлох; нийтлэл ба эссэгийн ялгааг тайлбарлах',
    ],
    focus: [
      'нийтлэлийн бүтэц: гарчиг → удиртгал → үндсэн хэсэг → дүгнэлт',
      'зохиогчийн байр суурь ба хандлагыг үг сонголтоос унших',
      'уран нийтлэл ↔ мэдээллийн нийтлэл ↔ эссэ',
    ],
    misconceptions: [
      'Нийтлэл ба мэдээ хоёрыг ижилтгэх — нийтлэлд зохиогчийн үнэлэмж илэрхий байдаг',
      'Нийтлэл ба эссэг ижил гэж бодох — эссэ илүү хувийн, нийтлэл нийгмийн асуудалд чиглэнэ',
      'Зохиогчийн байр суурь зөвхөн тодорхой хэлсэн үгэнд байдаг гэж бодох — үг сонголт, эрэмбэ ч илэрхийлнэ',
    ],
    mastery: true,
  },
  {
    id: 'mn12-2-2', skill: 'mn12-article-write', chap: 'II', chapTitle: 'Нийтлэл',
    num: '2.2', title: 'Нийтлэл бичих', strand: 'Бүлэг II. Нийтлэл, 72–86 тал',
    objectives: [
      'Уншигч, зорилго, нөхцөл байдалд тохируулан нийтлэлийн бүтэц, хэв маягийг сонгон бичих',
      'Гарчиг, удиртгал, үндсэн хэсэг, дүгнэлтийг уялдаатай зохион байгуулах',
      'Баримт, тоо, эх сурвалжийг зохистой ашиглах',
    ],
    focus: [
      'уншигчийн хүрээ → хэл найруулгын өнгө',
      'гарчгийн үүрэг: анхаарал татах + агуулгыг илэрхийлэх',
      'нэг догол мөр = нэг санаа',
    ],
    misconceptions: [
      'Гарчиг зөвхөн "сэдвийн нэр" гэж бодох — уншигчийг татах үүрэгтэй',
      'Догол мөрийг урт болгох нь сэтгэгдэл төрүүлнэ гэж бодох — нэг санаа нэг догол мөр нь тодорхой болгодог',
      'Баримт бичихэд эх сурвалж заах шаардлагагүй гэж бодох',
    ],
    mastery: true,
  },
  {
    id: 'mn12-3-1', skill: 'mn12-persuasive-read', chap: 'III', chapTitle: 'Ятгасан эссэ',
    num: '3.1', title: 'Ятгасан эссэ унших', strand: 'Бүлэг III. Ятгасан эссэ, 88–106 тал',
    objectives: [
      'Эхийг унших, ярилцах; итгүүлэн үнэмшүүлэх аргад суралцах',
      'Эхийн бүтэц, агуулгыг задлан шинжлэх',
      'Үзэл бодлоо илэрхийлэх',
    ],
    focus: [
      'ятгах гурван арга: логик нотолгоо, мэдрэмжид үйлчлэх, зохиогчийн эрх мэдэл/итгэл',
      'нэхэмжлэл (тезис) → нотолгоо → эсрэг санааг үгүйсгэх → дүгнэлт',
      'ятгах хэрэглүүр: асуултаар татах, давталт, харьцуулалт',
    ],
    misconceptions: [
      'Ятгасан эссэ гэдэг зөвхөн "өөрийн санааг хэлэх" гэж бодох — нотолгоо зайлшгүй',
      'Эсрэг санааг дурдвал өөрийн байр суурь сулрана гэж бодох — эсрэгээрээ хүчирхэгжүүлдэг',
      'Мэдрэмжид үйлчлэх нь үргэлж зохисгүй гэж бодох — баримттай хамт байвал зүйтэй',
    ],
    mastery: true,
  },
  {
    id: 'mn12-3-2', skill: 'mn12-persuasive-write', chap: 'III', chapTitle: 'Ятгасан эссэ',
    num: '3.2', title: 'Ятгасан эссэ бичих', strand: 'Бүлэг III. Ятгасан эссэ, 107–127 тал',
    objectives: [
      'Асуудал дэвшүүлж, итгүүлэн үнэмшүүлж бичих',
      'Дүрслэл ашиглан, итгүүлэн үнэмшүүлж бичих',
      'Баримт, нотолгоо, эшлэл зөв ашиглан, итгүүлэн үнэмшүүлж бичих',
    ],
    focus: [
      'тезисийг тодорхой, эсэргүүцэж болохуйц болгож бичих',
      'нотолгооны эрэмбэ: хүчтэйг сүүлд эсвэл эхэнд',
      'эшлэл ба баримтыг өөрийн санаанд захируулах',
    ],
    misconceptions: [
      'Тезис нь бүх хүн зөвшөөрөх зүйл байх ёстой гэж бодох — эсэргүүцэж болохуйц байх нь зөв',
      'Эшлэл олон байвал эссэ хүчтэй гэж бодох — өөрийн дүгнэлтгүй эшлэл үнэ цэнэгүй',
      'Дүгнэлт нь удиртгалыг үгчлэн давтах гэж бодох',
    ],
    mastery: true,
  },
  {
    id: 'mn12-4-1', skill: 'mn12-speak-listen', chap: 'IV', chapTitle: 'Илтгэл',
    num: '4.1', title: 'Ярих, сонсох', strand: 'Бүлэг IV. Илтгэл, 128–148 тал',
    objectives: [
      'Илтгэлийн бүтэцтэй танилцах',
      'Илтгэлийн зарлан тайлбарлах',
      'Илтгэл бичих, тавих',
    ],
    focus: [
      'илтгэлийн бүтэц: мэндчилгээ → сэдвийн зорилго → үндсэн санаа → дүгнэлт',
      'аман хэл ↔ бичгийн хэлний ялгаа (давталт, дуудлага, түр зогсолт)',
      'сонсогчийг хамруулах: асуулт, дуу хоолойн өнгө, харц',
    ],
    misconceptions: [
      'Бичсэн эссэгээ уншвал илтгэл болно гэж бодох — аман хэлний бүтэц өөр',
      'Илтгэлд давталт бол алдаа гэж бодох — амаар илтгэхэд гол санааг давтах нь зөв',
      'Сонсох бол зүгээр дуугүй байх гэж бодох — тэмдэглэл хийх, тодруулах асуулт бэлдэх нь сонсох чадвар',
    ],
    mastery: true,
  },
]

function commonRules() {
  return [
    'ХЭЛ: Бүх текст МОНГОЛ хэлээр. 12-р ангийн (17–18 нас) сурагчид зориулсан, ойлгомжтой боловч төлөвшсөн хэллэг.',
    'ХИЧЭЭЛИЙН ТӨРӨЛ: Энэ нь МОНГОЛ ХЭЛ, найруулга зүйн хичээл. Тоон бодлого БҮҮ зохио. Оронд нь: эх бичвэр задлан шинжлэх, өгүүлбэр засах, зөв хувилбар сонгох, найруулгын алдаа олох, бүтэц эрэмбэлэх даалгавар зохио.',
    'ЖИШЭЭ БИЧВЭР: Дасгал, жишээнд хэрэглэх өгүүлбэр, догол мөрийг ӨӨРӨӨ зохио. Сурах бичгийн эх бичвэр, уран зохиолын хэсгийг үгчлэн БҮҮ хуул (зохиогчийн эрх). Монгол орны бодит нөхцөл (Улаанбаатар, сургууль, малчин, нутаг) дээр тулгуурла.',
    'LATEX: Энэ хичээлд томьёо бараг байхгүй. $...$ хэрэглэх шаардлагагүй бол БҮҮ хэрэглэ. LaTeX дотор кирилл үсэг БҮҮ бич.',
    'СОНГОЛТ: Сонголт бүрд яг 4 хувилбар. answer нь ЗӨВ хувилбарын индекс (0-3). Зөв хариултын байрлалыг санамсаргүй болго. Буруу хувилбарыг дээрх буруу ойлголтоос УХАМСАРТАЙ бүтээ.',
    'ХЭЛНИЙ ҮНЭН ЗӨВ: Дүрмийн тайлбар, нэр томьёо (гишүүн өгүүлбэр, тодотгол, хэлц, үүдэл санаа, тезис) албан ёсны монгол хэл шинжлэлийн нэршилтэй нийцсэн байх ёстой.',
  ].join('\n')
}

function authorPrompt(s) {
  return `Чи бол Монголын 12-р ангийн МОНГОЛ ХЭЛ, найруулга зүйн сурах бичиг зохиогч, арга зүйч. Доорх сэдвээр БҮРЭН хичээл + түвшин тогтоох 10 асуулт${s.mastery ? ' + ойлголт батлах (mastery) даалгавар' : ''} зохио.

## Сэдэв
- Хичээл: "${s.title}" (Бүлэг ${s.chap} — ${s.chapTitle}, нэгж хичээл ${s.num})
- skill_id: ${s.skill}, lesson_id: ${s.id}, анги: ${GRADE}
- Сурах бичгийн байрлал: ${s.strand}
- Эзэмших чадвар (сурах бичгийн хүснэгтээс — яг эдгээрийг заа):
${s.objectives.map(o => '  • ' + o).join('\n')}
- Гол ойлголт, анхаарах зүйлс:
${s.focus.map(f => '  • ' + f).join('\n')}
- ЗААВАЛ шийдэх ёстой түгээмэл БУРУУ ОЙЛГОЛТууд (distractor болон mastery-д ашигла):
${s.misconceptions.map(m => '  • ' + m).join('\n')}

## Дүрэм
${commonRules()}

## Гаргах бүтэц (StructuredOutput schema-г яг дага)
- lesson: id="${s.id}", grade=${GRADE}, chapter_num="${s.chap}", chapter_title_mn="${s.chapTitle}", lesson_num="${s.num}", title_mn="${s.title}", title_en=англи гарчиг, skill_id="${s.skill}", prerequisite_skill_ids=[], textbook={book_id:${BOOK}, pages_mn:"${s.strand}", reader_url:"${READER}"}, objectives_mn=[дээрх чадваруудыг энгийн монголоор 3-аар], pretest=1 асуулт (өмнөх мэдлэг сорих, hint_mn+solution_mn+explanation_mn-тэй), sections=5–6 хэсэг (type: "concept"/"definition"/"example"; body_mn нь **тод** тэмдэглэгээтэй, богино догол мөр; ядаж 2 хэсэг нь БҮРЭН задлан шинжилсэн ЖИШЭЭ — өөрийн зохиосон өгүүлбэр/догол мөр дээр), practice=5 даалгавар (өгүүлбэр засах / зөв хувилбар сонгох / найруулгын алдаа олох / бүтэц эрэмбэлэх төрлөөр, hint_mn + дэлгэрэнгүй solution_mn), mastery_check=3 асуулт (explanation_mn-тэй).
- level_questions: ЯГ 10 асуулт. id="lt-${s.skill}-1" .. "lt-${s.skill}-10", skill_id="${s.skill}", difficulty 1..3, choices 4, answer индекс, explanation_mn. Ядаж 4 нь буруу ойлголтыг шалгах, ядаж 3 нь өгсөн жишээ бичвэрийг задлан шинжлэх асуулт байх.
${s.mastery ? `- mastery: skill_id="${s.skill}", title_mn="${s.title}", lesson_id="${s.id}", ordering=2 даалгавар (бичих/задлан шинжлэх алхмуудыг ЗӨВ дарааллаар steps-д 3–5 алхмаар), two_tier=3 даалгавар (t1 асуулт+4 сонголт+t1_answer, t2_prompt="Яагаад?"+t2_choices 4+t2_answer; буруу t2 нь misconception_mn-д тайлбарласан буруу ойлголтыг илэрхийлнэ).` : '- mastery: null.'}

Зөвхөн StructuredOutput tool-оор бүтэцлэсэн үр дүн буцаа.`
}

function verifyPrompt(s, bundle) {
  return `Чи бол монгол хэл, найруулга зүйн эксперт хянагч. Доорх 12-р ангийн монгол хэлний хичээлийн багцыг ШҮҮМЖЛЭЛТЭЙ шалга.

Шалгах зүйлс:
1) Асуулт бүрийн "answer"/"t1_answer"/"t2_answer" индекс ХЭЛ ЗҮЙН ХУВЬД ЗӨВ эсэх — сонголт бүрийг нэг бүрчлэн тулгаж шалга. Буруу бол зөв болго.
2) Дүрмийн тайлбар, нэр томьёо албан ёсны монгол хэл шинжлэлийн нэршилтэй нийцэж байгаа эсэх (гишүүн өгүүлбэр, тодотгол, хэлц, гол/үүдэл санаа, тезис, нотолгоо г.м.).
3) Жишээ өгүүлбэрүүд өөрөө дүрмийн хувьд ЗӨВ бичигдсэн эсэх — цэг, тэмдэг, залгавар, нөхцөл. Хэлц хэрэглэсэн бол утга нь бодитой эсэх.
4) Сурах бичиг эсвэл танил уран зохиолын эх бичвэрийг үгчлэн хуулсан хэсэг байвал өөрийн үгээр дахин бич.
5) Сонголт бүр ЯГ 4. LaTeX дотор кирилл үсэг БАЙХГҮЙ (KaTeX зурж чадахгүй). HTML entity байхгүй.
6) Зөв хариулт бүгд нэг ижил индекс дээр давтагдвал сонголтыг холиод answer-ийг тааруул.
7) ordering-ийн steps ЗӨВ логик дараалалтай эсэх.
8) 12-р ангид тохирох түвшин эсэх — хэт бага ангийн, эсвэл их дээд боловсролын хэл шинжлэлийн онол оруулаагүй байх.

Сэдэв: ${s.title} (skill=${s.skill}). Эзэмших чадвар: ${s.objectives.join('; ')}.

Багц (JSON):
${JSON.stringify(bundle)}

ЗАСВАРЛАСАН БҮТЭН багцыг буцаа. "notes" талбарт олдсон алдаа, засварыг товч бич.`
}

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
    sections: { type: 'array', minItems: 5, items: { type: 'object', additionalProperties: false,
      required: ['type', 'title_mn', 'body_mn'],
      properties: { type: { type: 'string' }, title_mn: { type: 'string' }, body_mn: { type: 'string' } } } },
    practice: { type: 'array', minItems: 5, items: MC },
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
log(`Монгол хэл ${GRADE}: ${SPECS.length} сэдэв — зохиох + шалгах`)
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
log(`Authored+verified ${ok.length}/${SPECS.length} Mongolian-language topics`)
return {
  subject: 'mongolian',
  grade: GRADE,
  topics: ok.map(r => ({ skill: r.spec.skill, id: r.spec.id, notes: r.notes, bundle: {
    lesson: r.final.lesson, level_questions: r.final.level_questions, mastery: r.final.mastery,
  } })),
}
