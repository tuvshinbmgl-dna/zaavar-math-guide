export const meta = {
  name: 'uran-g12-mastery-patch',
  description: 'Author the missing mastery blocks for the 11 Уран зохиол 12 topics whose author returned mastery:null',
  phases: [
    { title: 'Author', detail: 'нэг агент нэг сэдвийн ordering + two_tier бичнэ' },
    { title: 'Verify', detail: 'хариултын индекс, алхмын дараалал, зохиогчийн эрхийг эсрэг талаас шалгана' },
  ],
}

// `uran_g12_wf.js`-ийн MASTERY схем нь `type: ['object','null']` байсан тул 18
// сэдвийн 11-д зохиогч агент `mastery: null` буцаасан — схем зөвшөөрсөн учраас
// алдаа гараагүй, зүгээр л хоосон ирсэн. Энэ patch нь ЗӨВХӨН тэр 11-ийг гүйцээнэ.
// Энд `mastery` нь `type: 'object'` — null БОЛОХГҮЙ.
// `args` нь заримдаа JSON мөр болж ирдэг — хоёуланг нь дэмжинэ.
const SPECS = typeof args === 'string' ? JSON.parse(args) : args
const REPO = 'C:/Users/tuvsh/Claude/Projects/EDM - Secondary education/zaavar-math-guide'

const RULES = `ХЭЛ: Бүх текст МОНГОЛ хэлээр, 12-р ангийн (17–18 нас) сурагчид тохирсон.

ЗОХИОГЧИЙН ЭРХ (ХАМГИЙН ЧУХАЛ): Эх зохиолын бичвэрийг үгчлэн БҮҮ хуул. Шүлгийн
мөр, өгүүллэгийн хэсгийг эшлэх ШААРДЛАГАГҮЙ — эшлэхгүйгээр бич. Хэрэв зайлшгүй
бол нэг хичээлд НЭГ УДАА, 15 үгээс хэтрэхгүй. Дасгалын бичвэр хэрэгтэй бол
"хичээлд зориулж ЗОХИОСОН загвар бичвэр" гэж ТОДОРХОЙ тэмдэглэ.

АМТЫН АСУУЛТ ХОРИГЛОНО: "Аль нь илүү сайхан бэ", "Танд юу таалагдав" гэх мэт
субьектив асуулт БҮҮ зохио. Даалгавар бүр эхийн нотолгоо, утга зохиолын нэр
томьёо, эсвэл шинжилгээний АРГА ЗҮЙ дээр тулгуурласан ганц зөв хариултай байх.

СОНГОЛТ: Сонголт бүрд ЯГ 4 хувилбар. Зөв хариултын индексийг 0,1,2,3-т
ТЭНЦҮҮ ойрхон тарааж бич — бүгдийг нэг индекс дээр БҮҮ тавь.

LATEX: \`latex\` талбарыг ХООСОН мөр ("") болго. Уран зохиолын хичээлд
математик томьёо хэрэггүй. LaTeX дотор кирилл БҮҮ бич.`

function authorPrompt(s) {
  return `Чи бол Монголын 12-р ангийн УРАН ЗОХИОЛЫН сурах бичиг зохиогч, арга зүйч.

Хичээл аль хэдийн бичигдсэн бөгөөд ДИСК ДЭЭР байна. Түүнд ДУТУУ байгаа
**ойлголт батлах (mastery)** хэсгийг зохио.

## ЭХНИЙ АЛХАМ — хичээлээ УНШ (заавал)

Read tool-оор энэ файлыг бүтнээр унш:

    ${REPO}/data/uran/lessons/${s.id}.json

Тэндээс \`objectives_mn\`, \`sections\`, \`practice\`, \`mastery_check\` -ийг
анхааралтай унш. Чиний бичих mastery нь ТЭР агуулгатай НИЙЦЭХ ёстой —
хичээлд байхгүй шинэ сэдэв, шинэ бүтээл гаргаж болохгүй. Хичээлд ямар нэр
томьёо (уянгын баатар, зохиомж, бэлгэдэл г.м.) ашигласан бол ЯГ ТҮҮНИЙГ
хэрэглэ.

## Хичээл
- Гарчиг: "${s.title}"
- skill_id: ${s.skill}, lesson_id: ${s.id}, анги: 12

## Дүрэм
${RULES}

## Гаргах бүтэц
- skill_id="${s.skill}", title_mn="${s.title}", lesson_id="${s.id}"
- **ordering: ЯГ 2 даалгавар.** Утга зохиолын шинжилгээний алхмуудыг ЗӨВ
  дарааллаар. steps нь 3–5 алхам. Жишээ нь: эх унших → уянгын баатар/дүрийг
  тодорхойлох → дүрслэх хэрэглүүрийг олох → утгын эргэлтийг тэмдэглэх →
  дүгнэлт бичих. Алхмууд нь ҮНЭХЭЭР дараалалтай байх ёстой (хоорондоо
  сольж болохоор бол муу даалгавар).
- **two_tier: ЯГ 3 даалгавар.** Тус бүр: t1 асуулт + 4 сонголт + t1_answer;
  t2_prompt_mn="Яагаад?" + 4 сонголт + t2_answer; misconception_mn нь энэ
  даалгавар ямар ТҮГЭЭМЭЛ БУРУУ ОЙЛГОЛТЫГ илрүүлэхийг тайлбарлана.
  t2 нь t1-ийн ҮНДЭСЛЭЛийг шалгах ёстой — зөвхөн давтаж асуух биш.

Зөвхөн StructuredOutput tool-оор бүтэцлэсэн үр дүн буцаа.`
}

function verifyPrompt(s, mastery) {
  return `Чи бол уран зохиолын боловсролын эксперт хянагч. Доорх 12-р ангийн
"ойлголт батлах" багцыг ШҮҮМЖЛЭЛТЭЙ шалга. Сэдэв: ${s.title} (skill=${s.skill}).

Шалгах зүйлс:
1) ЗОХИОГЧИЙН ЭРХ — эх зохиолоос үгчлэн хуулсан мөр, бадаг БАЙНА УУ? Байвал
   ХАС эсвэл өөрийн үгээр солиод "загвар бичвэр" гэж тэмдэглэ. Энэ бол
   хамгийн эхний бөгөөд хамгийн чухал ажил.
2) ХАРИУЛТЫН ИНДЕКС — \`t1_answer\`, \`t2_answer\` бүрийг сонголт бүртэй нь
   ТУЛГАЖ шалга. Буруу бол зас. Зөв хариулт бүгд нэг индекс дээр давтагдвал
   сонголтыг холиод индексийг тааруул (тайлбар дотор "N дэх сонголт" гэж
   бичсэн бол түүнийг ч хамт зас).
3) АМТЫН АСУУЛТ — субьектив, ганц зөв хариултгүй асуулт байвал эхийн
   нотолгоонд суурилсан асуулт болгож солино.
4) ХУДАЛ БАРИМТ — зохиолч, он цаг, бүтээлийн талаарх батлагдаагүй мэдэгдэл
   байвал хас эсвэл ерөнхий болго. Хуудасны дугаар БҮҮ дурд.
5) ORDERING — steps ҮНЭХЭЭР логик дараалалтай юу? Сольж болохоор бол зас.
6) ФОРМАТ — сонголт бүр ЯГ 4; \`latex\` хоосон; HTML entity байхгүй;
   ordering 2, two_tier 3.

Багц (JSON):
${JSON.stringify(mastery)}

ЗАСВАРЛАСАН БҮТЭН багцыг буцаа. "notes"-д олдсон алдаа, засварыг товч бич.`
}

const MASTERY = {
  type: 'object', additionalProperties: false,
  required: ['skill_id', 'title_mn', 'lesson_id', 'ordering', 'two_tier'],
  properties: {
    skill_id: { type: 'string' }, title_mn: { type: 'string' }, lesson_id: { type: 'string' },
    ordering: {
      type: 'array', minItems: 2, maxItems: 2,
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'stem_mn', 'latex', 'steps'],
        properties: {
          id: { type: 'string' }, stem_mn: { type: 'string' }, latex: { type: 'string' },
          steps: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 5 },
        },
      },
    },
    two_tier: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'stem_mn', 'latex', 't1_choices', 't1_answer', 't2_prompt_mn', 't2_choices', 't2_answer', 'misconception_mn'],
        properties: {
          id: { type: 'string' }, stem_mn: { type: 'string' }, latex: { type: 'string' },
          t1_choices: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
          t1_answer: { type: 'integer', minimum: 0, maximum: 3 },
          t2_prompt_mn: { type: 'string' },
          t2_choices: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
          t2_answer: { type: 'integer', minimum: 0, maximum: 3 },
          misconception_mn: { type: 'string' },
        },
      },
    },
  },
}

const VMASTERY = {
  type: 'object', additionalProperties: false,
  required: [...MASTERY.required, 'notes'],
  properties: { ...MASTERY.properties, notes: { type: 'string' } },
}

phase('Author')
log(`Уран зохиол 12 — mastery дутуу ${SPECS.length} сэдвийг гүйцээнэ`)

const results = await pipeline(
  SPECS,
  (s) => agent(authorPrompt(s), { label: `mastery:${s.skill}`, phase: 'Author', schema: MASTERY })
    .then(m => ({ spec: s, mastery: m })),
  ({ spec, mastery }) => {
    if (!mastery) return null
    return agent(verifyPrompt(spec, mastery), { label: `verify:${spec.skill}`, phase: 'Verify', schema: VMASTERY })
      .then(v => ({ spec, final: v || mastery, notes: v?.notes || '(verify failed → author kept)' }))
  },
)

const ok = results.filter(Boolean)
log(`Mastery гүйцээв ${ok.length}/${SPECS.length}`)
return {
  subject: 'literature',
  grade: 12,
  masteries: ok.map(r => {
    const { notes, ...m } = r.final
    return { skill: r.spec.skill, notes: r.notes, mastery: m }
  }),
}
