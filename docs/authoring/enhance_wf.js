export const meta = {
  name: 'lesson-examples-enhancement',
  description: 'Add worked examples + step-by-step practice to every existing lesson (student feedback)',
  phases: [
    { title: 'Author', detail: 'read each lesson, write 2 worked examples + 2 detailed practice' },
    { title: 'Verify', detail: 'check new examples/practice are correct → corrected' },
  ],
}

// args = [{subject, id, path, title, grade, skill}, ...]  (may arrive as a JSON string)
let LESSONS = args
if (typeof LESSONS === 'string') { try { LESSONS = JSON.parse(LESSONS) } catch (e) { LESSONS = [] } }
if (!Array.isArray(LESSONS)) LESSONS = []

function subjRules(subject, grade) {
  if (subject === 'math') return 'Математик — томьёо/тэмдэглэгээг $...$ дотор LaTeX-ээр бич. HTML entity (&gt; гэх мэт) БҮҮ бич.'
  if (subject === 'physics') return `Физик (${grade}-р анги) — томьёог $...$ LaTeX-ээр. 7-р ангийн түвшинд тохир (даралт P=F/S, ажил, энерги зэрэг 8-р ангийн агуулга БҮҮ ор). HTML entity БҮҮ бич.`
  return 'latex талбарыг хоосон "" үлдээ.'
}

function authorPrompt(L) {
  return `Чи бол Монголын сурах бичгийн туршлагатай зохиогч. Доорх хичээлд НЭМЭЛТ бодит жишээ, дасгал зохионо. (Сурагчид "жишээ дутуу, шийдлээ илүү задлаач" гэсэн санал өгсөн.)

## Хичээл
- Файл: ${L.path}  (эхлээд Read tool-оор УНШ)
- Гарчиг: "${L.title}" (${L.subject}, ${L.grade}-р анги, skill=${L.skill})

## Даалгавар
1) Файлыг уншиж, ямар агуулга, ямар түвшин, ямар хэв маягтайг ойлго.
2) НЭМЭЛТ 2 "жишээ" section зохио (type="example"). Жишээ бүр АЛХАМ АЛХМААР бүрэн задарсан бодолттой — сурагч дагаж ойлгохоор. body_mn-д **тод** тэмдэглэгээ, дэс дараатай алхмууд, бодит тоо/утга ашигла. Хичээлд аль хэдийн байгаа жишээг ДАВТАЖ БОЛОХГҮЙ — шинэ өнцөг, шинэ тохиолдол.
3) НЭМЭЛТ 2 дасгал (practice MCQ) зохио — hint_mn + ДЭЛГЭРЭНГҮЙ solution_mn-тэй (яагаад гэдгийг алхам алхмаар тайлбарла, зөвхөн хариулт биш). Хялбар ба дунд түвшний нэг нэг.

## Дүрэм
- ${subjRules(L.subject, L.grade)}
- Монгол хэл, тухайн хичээлийн нэр томьёог ашигла. Бүх тоо/хариулт ҮНЭН ЗӨВ.
- practice-д choices=4, answer=зөв индекс(0-3), distractor нь түгээмэл алдааг илэрхийл.

Зөвхөн StructuredOutput-оор {extra_examples, extra_practice} буцаа.`
}

function verifyPrompt(L, add) {
  return `Чи бол ${L.subject} хичээлийн эксперт хянагч. Доорх хичээлд нэмэх ГЭЖ БУЙ жишээ, дасгалыг шалга (${L.title}, ${L.grade}-р анги).

Шалгах: (1) practice бүрийн answer индекс ҮНЭН ЗӨВ эсэх (сонголттой тулгаж, тооцоог дахин хийж); (2) жишээний бодолт зөв эсэх; (3) ${L.subject==='physics'?'7-р ангийн түвшинд тохирох, 8-р ангийн агуулга ороогүй эсэх; ':''}(4) LaTeX зөв ($...$), HTML entity байхгүй, монгол хэл зөв, choices=4.

Нэмэлт (JSON): ${JSON.stringify(add)}

ЗАСВАРЛАСАН {extra_examples, extra_practice, notes}-г буцаа. Алдаагүй бол ижлээр. notes-д товч.`
}

const SECTION = { type:'object', additionalProperties:false, required:['type','title_mn','body_mn'],
  properties:{ type:{type:'string'}, title_mn:{type:'string'}, body_mn:{type:'string'} } }
const MC = { type:'object', additionalProperties:false, required:['stem_mn','latex','choices','answer','hint_mn','solution_mn'],
  properties:{ stem_mn:{type:'string'}, latex:{type:'string'}, choices:{type:'array',items:{type:'string'},minItems:4,maxItems:4}, answer:{type:'integer',minimum:0,maximum:3}, hint_mn:{type:'string'}, solution_mn:{type:'string'} } }
const ADD = { type:'object', additionalProperties:false, required:['extra_examples','extra_practice'],
  properties:{ extra_examples:{type:'array',minItems:2,maxItems:2,items:SECTION}, extra_practice:{type:'array',minItems:2,maxItems:2,items:MC} } }
const VADD = { type:'object', additionalProperties:false, required:['extra_examples','extra_practice','notes'],
  properties:{ ...ADD.properties, notes:{type:'string'} } }

phase('Author')
const results = await pipeline(
  LESSONS,
  (L) => agent(authorPrompt(L), { label:`author:${L.id}`, phase:'Author', schema:ADD, agentType:'general-purpose' }).then(a => ({ L, add:a })),
  ({ L, add }) => {
    if (!add) return null
    return agent(verifyPrompt(L, add), { label:`verify:${L.id}`, phase:'Verify', schema:VADD })
      .then(v => ({ id:L.id, subject:L.subject, path:L.path, add: v || add, notes: v?.notes || '(verify failed → author kept)' }))
  }
)
const ok = results.filter(Boolean)
log(`Enhanced ${ok.length}/${LESSONS.length} lessons`)
return { enhanced: ok.map(r => ({ id:r.id, subject:r.subject, path:r.path,
  extra_examples:r.add.extra_examples, extra_practice:r.add.extra_practice, notes:r.notes })) }
