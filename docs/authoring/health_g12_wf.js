export const meta = {
  name: 'health-g12-authoring',
  description: 'Author Grade-12 Health lessons + level test + mastery from the authentic Эрүүл мэнд 12 ГАРЧИГ, adversarially verified',
  phases: [
    { title: 'Author', detail: 'one agent per topic writes lesson + 10 level Qs + mastery' },
    { title: 'Verify', detail: 'adversarial accuracy / safeguarding check → corrected bundle' },
  ],
}

const BOOK = 413
const GRADE = 12
const READER = `https://econtent.edu.mn/pages/more.php?id=${BOOK}`

// Бүтэц нь Эрүүл мэнд 12 (БШУЯ) сурах бичгийн 3-р тал дээрх ГАРЧИГ-аас.
const SPECS = [
  { id: 'hl12-1-1', skill: 'hl12-home-hygiene', chap: 'I', chapTitle: 'Хувийн эрүүл ахуй ба орчны эрүүл мэнд',
    num: '1.1', title: 'Гэрийн дотоод засал, эрүүл ахуйн шаардлага', pages: '6–9',
    objectives: ['Орон сууц, гэрийн дотоод орчны эрүүл ахуйн шаардлагыг тодорхойлох', 'Агаар сэлгэлт, гэрэлтүүлэг, чийгшил, дулааны зохистой хэмжээг тайлбарлах', 'Гэрийн орчны эрүүл ахуйг сайжруулах арга хэмжээг санал болгох'],
    focus: ['агаар сэлгэлт ба доторх агаарын бохирдол', 'байгалийн ба зохиомол гэрэлтүүлэг', 'чийгшил, хөгц, тоос', 'ариун цэврийн зохион байгуулалт'] },
  { id: 'hl12-1-2', skill: 'hl12-ger-tradition', chap: 'I', chapTitle: 'Хувийн эрүүл ахуй ба орчны эрүүл мэнд',
    num: '1.2', title: 'Монгол гэр, уламжлалт ахуй', pages: '10–15',
    objectives: ['Монгол гэрийн бүтэц, зохион байгуулалтын эрүүл ахуйн ач холбогдлыг тайлбарлах', 'Уламжлалт ахуйн эрүүл мэндэд ээлтэй талыг тодорхойлох', 'Гэрийн галлагаа, утаа, агаарын чанарын асуудлыг шинжлэх'],
    focus: ['тооно, ханын салхивч — байгалийн агаар сэлгэлт', 'зуухны галлагаа ба доторх агаарын бохирдол', 'уламжлалт зохион байгуулалтын эрүүл ахуйн учир'] },
  { id: 'hl12-1-3', skill: 'hl12-health-policy', chap: 'I', chapTitle: 'Хувийн эрүүл ахуй ба орчны эрүүл мэнд',
    num: '1.3', title: 'Нийгмийн эрүүл мэндийн бодлого, хууль, дүрэм журам', pages: '16–21',
    objectives: ['Нийгмийн эрүүл мэндийн үндсэн ойлголтыг тодорхойлох', 'Эрүүл мэндийн салбарын хууль, журмын үүргийг тайлбарлах', 'Иргэний эрүүл мэндийн эрх, үүргийг жишээгээр харуулах'],
    focus: ['нийгмийн эрүүл мэнд ↔ хувь хүний эрүүл мэнд', 'урьдчилан сэргийлэх бодлогын үүрэг', 'эрүүл мэндийн даатгал, үйлчилгээ авах эрх'] },

  { id: 'hl12-2-1', skill: 'hl12-food-choice', chap: 'II', chapTitle: 'Хооллолт ба хөдөлгөөн',
    num: '2.1', title: 'Хоол, хүнсний сонголт ба орон нутгийн онцлог', pages: '22–24',
    objectives: ['Тэнцвэртэй хооллолтын зарчмыг тайлбарлах', 'Орон нутгийн хүнсний нөөц, улирлын онцлогийг харгалзан хоолны сонголт хийх', 'Хоолны сонголтод нөлөөлөх хүчин зүйлийг шинжлэх'],
    focus: ['уураг, өөх тос, нүүрс ус, витамин, эрдэс', 'Монголын улирлын хүнсний онцлог', 'шошгыг унших чадвар'] },
  { id: 'hl12-2-2', skill: 'hl12-fortified-food', chap: 'II', chapTitle: 'Хооллолт ба хөдөлгөөн',
    num: '2.2', title: 'Зохицуулах үйлчилгээтэй болон баяжуулсан хүнсний хэрэглээ', pages: '25–28',
    objectives: ['Баяжуулсан хүнсний зорилго, ач холбогдлыг тайлбарлах', 'Зохицуулах үйлчилгээтэй хүнсний хэрэглээний зөв зохистой байдлыг үнэлэх', 'Хүнсний шошго дахь мэдээллийг задлан шинжлэх'],
    focus: ['баяжуулалт (иод, төмөр, D аминдэм) — яагаад', 'зохицуулах үйлчилгээтэй хүнс ≠ эм', 'зар сурталчилгааны мэдэгдлийг шүүмжлэлтэй харах'] },
  { id: 'hl12-2-3', skill: 'hl12-gmo-supplements', chap: 'II', chapTitle: 'Хооллолт ба хөдөлгөөн',
    num: '2.3', title: 'Генийн өөрчлөлттэй ба биологийн идэвхт хүнсний нэмэлт бүтээгдэхүүн', pages: '29–34',
    objectives: ['Генийн өөрчлөлттэй хүнсний талаарх шинжлэх ухааны байр суурийг тодорхойлох', 'Биологийн идэвхт бүтээгдэхүүний зохистой хэрэглээг үнэлэх', 'Эх сурвалжийн найдвартай байдлыг шалгах'],
    focus: ['ГӨО хүнсний аюулгүй байдлын зохицуулалт', 'БИДБ нь эмчилгээ орлохгүй', 'нотолгоонд суурилсан эх сурвалж хайх'] },

  { id: 'hl12-3-1', skill: 'hl12-mh-support', chap: 'III', chapTitle: 'Сэтгэцийн эрүүл мэнд',
    num: '3.1', title: 'Сэтгэцийн тулгамдсан асуудалтай хүмүүсийг ойлгох, туслах дэмжих', pages: '35–36',
    objectives: ['Сэтгэцийн тулгамдсан асуудлын шинж тэмдгийг таних', 'Дэмжлэг үзүүлэх зөв арга, хандлагыг тодорхойлох', 'Мэргэжлийн тусламж авах зам, эх сурвалжийг мэдэх'],
    focus: ['сонсох, шүүмжлэхгүй байх, зөвлөгөө тулгахгүй байх', 'мэргэжлийн тусламжид хандахыг дэмжих', 'нууцлалыг хүндэтгэх, гэхдээ аюул байвал насанд хүрэгчид хэлэх'], sensitive: 'mental' },
  { id: 'hl12-3-2', skill: 'hl12-mh-disorders', chap: 'III', chapTitle: 'Сэтгэцийн эрүүл мэнд',
    num: '3.2', title: 'Сэтгэцийн эмгэг ба эмгэгтэй хүмүүсийг ойлгох, туслах дэмжих', pages: '37–42',
    objectives: ['Сэтгэцийн эмгэгийн үндсэн ойлголтыг эрүүл мэндийн асуудал болгон тайлбарлах', 'Хэвшмэл ойлголт, ялгаварлалыг таньж эсэргүүцэх', 'Эмгэгтэй хүнийг дэмжих зохистой хандлагыг харуулах'],
    focus: ['сэтгэцийн эмгэг = эмчлэгддэг эрүүл мэндийн асуудал', 'ялгаварлан гадуурхал ба түүний хор уршиг', 'эмчилгээ, дэмжлэгийн үр дүн'], sensitive: 'mental' },
  { id: 'hl12-3-3', skill: 'hl12-mh-wellbeing', chap: 'III', chapTitle: 'Сэтгэцийн эрүүл мэнд',
    num: '3.3', title: 'Сэтгэцийн хувьд эрүүл байхын ач холбогдол', pages: '43–48',
    objectives: ['Сэтгэцийн эрүүл байдлын бүрэлдэхүүнийг тодорхойлох', 'Стресстэй эрүүл аргаар харьцах ур чадварыг хэрэглэх', 'Сэтгэцийн эрүүл мэнд ба бие махбодын эрүүл мэндийн харилцан хамаарлыг тайлбарлах'],
    focus: ['нойр, хөдөлгөөн, нийгмийн холбоо', 'стресстэй харьцах эрүүл арга (амралт, хөдөлгөөн, ярилцах)', 'бие ↔ сэтгэцийн хоёр талын нөлөө'], sensitive: 'mental' },

  { id: 'hl12-4-1', skill: 'hl12-substance-law', chap: 'IV', chapTitle: 'Хорт зуршил',
    num: '4.1', title: 'Хорт зуршилтай холбоотой хууль эрх зүйн баримт бичиг', pages: '49–54',
    objectives: ['Тамхи, архи, мансууруулах бодистой холбоотой хууль тогтоомжийн үндсэн заалтыг тодорхойлох', 'Хууль зөрчсөний хариуцлагыг тайлбарлах', 'Хууль эрх зүйн зохицуулалтын эрүүл мэндийн зорилгыг шинжлэх'],
    focus: ['насны хязгаарлалт ба түүний учир', 'олон нийтийн газар тамхи татахыг хориглох', 'хууль нь шийтгэхээс илүү сэргийлэх зорилготой'], sensitive: 'substance' },
  { id: 'hl12-4-2', skill: 'hl12-refusal-skills', chap: 'IV', chapTitle: 'Хорт зуршил',
    num: '4.2', title: 'Хорт зуршил, мансууруулах төрлийн бодисоос татгалзах', pages: '55–62',
    objectives: ['Үе тэнгийн дарамтыг таних', 'Татгалзах ур чадварыг хэрэглэх', 'Хорт зуршлаас урьдчилан сэргийлэх хувийн төлөвлөгөө боловсруулах'],
    focus: ['татгалзах хэлбэрүүд: шууд, шалтгаан хэлэх, өөр саналыг санал болгох, орхин явах', 'үе тэнгийн дарамтын нөхцөл байдлыг урьдчилан таних', 'дэмжлэг хаанаас авах'], sensitive: 'substance' },

  { id: 'hl12-5-1', skill: 'hl12-marriage-plan', chap: 'V', chapTitle: 'Бэлгийн болон нөхөн үржихүйн эрүүл мэнд',
    num: '5.1', title: 'Гэрлэлт ба ирээдүйн амьдралын төлөвлөгөө', pages: '63–67',
    objectives: ['Гэрлэлтийн хууль эрх зүйн болон нийгмийн үндсийг тодорхойлох', 'Ирээдүйн амьдралын төлөвлөгөөнд боловсрол, ажил мэргэжил, гэр бүлийн хэсгийг уялдуулах', 'Эрт гэрлэлтийн эрүүл мэнд, нийгмийн үр дагаврыг шинжлэх'],
    focus: ['гэрлэх насны хууль ёсны доод хязгаар', 'боловсрол → бие даасан байдал → төлөвлөлт', 'эрт гэрлэлт, эрт жирэмслэлтийн эрсдэл'], sensitive: 'srh' },
  { id: 'hl12-5-2', skill: 'hl12-parenting', chap: 'V', chapTitle: 'Бэлгийн болон нөхөн үржихүйн эрүүл мэнд',
    num: '5.2', title: 'Эцэг эх байхын үүрэг хариуцлага', pages: '68–73',
    objectives: ['Эцэг эх байхын үүрэг, хариуцлагыг тодорхойлох', 'Хүүхэд өсгөхөд шаардагдах нөөц, бэлтгэлийг үнэлэх', 'Эцэг, эхийн үүргийн тэгш хуваарилалтыг тайлбарлах'],
    focus: ['сэтгэл зүйн, эдийн засгийн, цаг хугацааны бэлтгэл', 'эцэг эхийн үүрэг хоёуланд', 'хүүхдийн эрх'], sensitive: 'srh' },
  { id: 'hl12-5-3', skill: 'hl12-sexual-health', chap: 'V', chapTitle: 'Бэлгийн болон нөхөн үржихүйн эрүүл мэнд',
    num: '5.3', title: 'Эрэгтэй, эмэгтэй хүмүүсийн бэлгийн хариу үйлдэл', pages: '74–78',
    objectives: ['Нөхөн үржихүйн тогтолцооны үндсэн үйл ажиллагааг эрүүл мэндийн үүднээс тайлбарлах', 'Өсвөр насны биологийн өөрчлөлтийг хэвийн үзэгдэл болгон ойлгох', 'Найдвартай эрүүл мэндийн эх сурвалжид хандах'],
    focus: ['биологийн үндсэн ойлголт, эмнэлгийн нэр томьёо', 'хувь хүн бүрийн ялгаа хэвийн', 'буруу мэдээллийн эх сурвалжийг таних'], sensitive: 'srh' },
  { id: 'hl12-5-4', skill: 'hl12-relationship-resp', chap: 'V', chapTitle: 'Бэлгийн болон нөхөн үржихүйн эрүүл мэнд',
    num: '5.4', title: 'Бэлгийн харилцаан дахь хосын үүрэг, хариуцлага', pages: '79–84',
    objectives: ['Харилцан зөвшөөрөл (consent)-ийн ойлголтыг тодорхойлох', 'Хосын харилцан хүндэтгэл, хамтын хариуцлагыг тайлбарлах', 'Эрүүл ба эрүүл бус харилцааны шинжийг ялган таних'],
    focus: ['зөвшөөрөл: чөлөөтэй, тодорхой, буцаан татаж болох', 'дарамт, албадлага бол зөвшөөрөл БИШ', 'эрүүл харилцаа: хүндэтгэл, нээлттэй яриа, хил хязгаар'], sensitive: 'srh' },

  { id: 'hl12-6-1', skill: 'hl12-injury-prevent', chap: 'VI', chapTitle: 'Аюулгүй байдал, анхны тусламж',
    num: '6.1', title: 'Осол гэмтлээс сэргийлэх', pages: '85–88',
    objectives: ['Түгээмэл осол гэмтлийн шалтгааныг тодорхойлох', 'Урьдчилан сэргийлэх арга хэмжээг санал болгох', 'Анхны тусламжийн үндсэн алхмыг зөв дараалалд оруулах'],
    focus: ['гэр, зам, байгаль дахь эрсдэл', 'анхны тусламж: аюулгүй байдлыг хангах → үнэлэх → тусламж дуудах → тусламж үзүүлэх', 'яаралтай тусламжийн дугаар'] },
  { id: 'hl12-6-2', skill: 'hl12-social-insurance', chap: 'VI', chapTitle: 'Аюулгүй байдал, анхны тусламж',
    num: '6.2', title: 'Нийгмийн халамж даатгалын үйлчилгээ', pages: '89–94',
    objectives: ['Нийгмийн даатгал ба нийгмийн халамжийн ялгааг тодорхойлох', 'Эрүүл мэндийн даатгалын ач холбогдлыг тайлбарлах', 'Үйлчилгээ авах журмыг мэдэх'],
    focus: ['даатгал (шимтгэл төлж эрх үүсгэх) ↔ халамж (төрөөс үзүүлэх дэмжлэг)', 'эрүүл мэндийн даатгалын хамрах хүрээ', 'үйлчилгээ авах алхам'] },
]

function safeguarding(s) {
  const base = [
    'ЭРҮҮЛ МЭНДИЙН ҮНЭН ЗӨВ: Эмнэлгийн мэдээлэл ҮНЭН ЗӨВ, нотолгоонд суурилсан байх ёстой. Эргэлзээтэй бол ерөнхий, аюулгүй мэдэгдэл ашигла. Онош тавих, эмчилгээ зөвлөх БҮҮ хий.',
  ]
  if (s.sensitive === 'mental') base.push(
    'СЭТГЭЦИЙН ЭРҮҮЛ МЭНД: Дэмжих, ойлгох өнгө ая барь. Сурагчийг өөрийгөө онош тавихад хүргэх асуулт БҮҮ зохио. Өөрт хор учруулах, амиа хорлох аргачлалын талаар ямар ч дэлгэрэнгүй мэдээлэл БҮҮ бич. Мэргэжлийн тусламжид хандах (эмч, сэтгэл зүйч, итгэдэг насанд хүрэгч) гэсэн зам хичээл дотор ТОДОРХОЙ байх ёстой.',
  )
  if (s.sensitive === 'substance') base.push(
    'ХОРТ ЗУРШИЛ: Бодисын нэр, тун, хэрэглэх арга, олж авах зам зэрэг ямар ч практик мэдээлэл БҮҮ бич. Зөвхөн эрүүл мэнд, хууль эрх зүйн үр дагавар, татгалзах ур чадварт төвлөр.',
  )
  if (s.sensitive === 'srh') base.push(
    'БЭЛГИЙН БОЛОН НӨХӨН ҮРЖИХҮЙН ЭРҮҮЛ МЭНД: Энэ нь үндэсний хөтөлбөрийн албан ёсны агуулга. 17–18 насны сурагчид тохирсон, ЭМНЭЛГИЙН нэр томьёотой, хүндэтгэлтэй, БОДИТ өнгө ая барь. Ил тод дүрслэл, эротик агуулга БҮҮ бич. Зөвшөөрөл, хүндэтгэл, хариуцлага, эрүүл мэндийн эрсдэлээс сэргийлэх талд төвлөр. Аливаа хүйс, чиг баримжааг гутаах агуулга БҮҮ бич.',
  )
  return base.join('\n')
}

function commonRules(s) {
  return [
    'ХЭЛ: Бүх текст МОНГОЛ хэлээр, 12-р ангийн (17–18 нас) сурагчид тохирсон, төлөвшсөн боловч ойлгомжтой.',
    'ХИЧЭЭЛИЙН ТӨРӨЛ: Эрүүл мэндийн боловсрол. Математик томьёо, тоон бодлого бараг байхгүй. Даалгавар нь: нөхцөл байдлыг үнэлэх, зөв арга барилыг сонгох, буруу ойлголтыг таних, алхмыг эрэмбэлэх, эх сурвалжийн найдвартай байдлыг шүүх.',
    safeguarding(s),
    'LATEX: Шаардлагагүй бол $...$ БҮҮ хэрэглэ. LaTeX дотор кирилл үсэг БҮҮ бич.',
    'СОНГОЛТ: Сонголт бүрд яг 4 хувилбар. answer нь ЗӨВ хувилбарын индекс (0-3). Зөв хариултын байрлалыг санамсаргүй болго.',
    'ЗОХИОГЧИЙН ЭРХ: Сурах бичгийн эх бичвэрийг үгчлэн БҮҮ хуул. Албан ёсны бүтэц, сэдэвт тулгуурлаж ӨӨРИЙН үгээр бич. Монгол орны бодит нөхцөл ашигла.',
  ].join('\n')
}

function authorPrompt(s) {
  return `Чи бол Монголын 12-р ангийн ЭРҮҮЛ МЭНДИЙН боловсролын сурах бичиг зохиогч, арга зүйч. Доорх сэдвээр БҮРЭН хичээл + түвшин тогтоох 10 асуулт + ойлголт батлах (mastery) даалгавар зохио.

## Сэдэв
- Хичээл: "${s.title}" (Бүлэг ${s.chap} — ${s.chapTitle}, хичээл ${s.num})
- skill_id: ${s.skill}, lesson_id: ${s.id}, анги: ${GRADE}
- Сурах бичгийн байрлал: Бүлэг ${s.chap}. ${s.chapTitle}, ${s.pages} тал
- Хөтөлбөрийн зорилт (яг эдгээрийг заа):
${s.objectives.map(o => '  • ' + o).join('\n')}
- Гол ойлголт, анхаарах зүйлс:
${s.focus.map(f => '  • ' + f).join('\n')}

## Дүрэм
${commonRules(s)}

## Гаргах бүтэц (StructuredOutput schema-г яг дага)
- lesson: id="${s.id}", grade=${GRADE}, chapter_num="${s.chap}", chapter_title_mn="${s.chapTitle}", lesson_num="${s.num}", title_mn="${s.title}", title_en=англи гарчиг, skill_id="${s.skill}", prerequisite_skill_ids=[], textbook={book_id:${BOOK}, pages_mn:"Бүлэг ${s.chap}. ${s.chapTitle}, ${s.pages} тал", reader_url:"${READER}"}, objectives_mn=[дээрх зорилтуудыг энгийн монголоор 3-аар], pretest=1 асуулт (hint_mn+solution_mn+explanation_mn-тэй), sections=5–6 хэсэг (type: "concept"/"definition"/"example"; **тод** тэмдэглэгээтэй, богино догол мөр; ядаж 2 хэсэг нь бодит нөхцөл байдлын ЖИШЭЭ), practice=5 даалгавар (hint_mn + дэлгэрэнгүй solution_mn), mastery_check=3 асуулт (explanation_mn-тэй).
- level_questions: ЯГ 10 асуулт. id="lt-${s.skill}-1" .. "lt-${s.skill}-10", difficulty 1..3, choices 4, answer индекс, explanation_mn. Ядаж 4 нь буруу ойлголт/буруу мэдээллийг таних, ядаж 3 нь бодит нөхцөлд зөв шийдвэр гаргах асуулт байх.
- mastery: skill_id="${s.skill}", title_mn="${s.title}", lesson_id="${s.id}", ordering=2 даалгавар (үйлдлийн алхмуудыг ЗӨВ дарааллаар steps-д 3–5 алхмаар), two_tier=3 даалгавар (t1 асуулт+4 сонголт+t1_answer, t2_prompt="Яагаад?"+t2_choices 4+t2_answer, misconception_mn).

Зөвхөн StructuredOutput tool-оор бүтэцлэсэн үр дүн буцаа.`
}

function verifyPrompt(s, bundle) {
  return `Чи бол эрүүл мэндийн боловсролын эксперт хянагч. Доорх 12-р ангийн эрүүл мэндийн хичээлийн багцыг ШҮҮМЖЛЭЛТЭЙ шалга.

Шалгах зүйлс:
1) ЭМНЭЛГИЙН/ШИНЖЛЭХ УХААНЫ ҮНЭН ЗӨВ. Буруу, хуучирсан, эсвэл нотлогдоогүй мэдэгдэл байвал зас. Онош тавих, эмчилгээ зөвлөсөн агуулга байвал хас.
2) АЮУЛГҮЙ БАЙДАЛ. ${s.sensitive === 'mental' ? 'Өөрт хор учруулах аргачлал, өөрийгөө онош тавихад хүргэх агуулга БАЙХГҮЙ эсэх; мэргэжлийн тусламжид хандах зам ТОДОРХОЙ эсэх.' : s.sensitive === 'substance' ? 'Бодисын нэр, тун, хэрэглэх арга, олж авах зам зэрэг практик мэдээлэл БАЙХГҮЙ эсэх.' : s.sensitive === 'srh' ? 'Ил тод дүрслэл, эротик агуулга БАЙХГҮЙ эсэх; эмнэлгийн нэр томьёотой, хүндэтгэлтэй эсэх; аль нэг хүйс, чиг баримжааг гутаасан агуулга БАЙХГҮЙ эсэх.' : 'Аюултай зөвлөгөө байхгүй эсэх.'}
3) Асуулт бүрийн "answer"/"t1_answer"/"t2_answer" индекс ЗӨВ эсэх — сонголт бүрийг тулгаж шалга.
4) Хэвшмэл ойлголт, ялгаварлан гадуурхсан жишээ байвал сурган зүйн зорилгыг нь хадгалаад солих.
5) Сонголт бүр ЯГ 4; LaTeX дотор кирилл байхгүй; HTML entity байхгүй; монгол нэр томьёо зөв.
6) Зөв хариулт бүгд нэг индекс дээр давтагдвал сонголтыг холиод answer-ийг тааруул.
7) ordering-ийн steps ЗӨВ логик дараалалтай эсэх. Анхны тусламжийн алхам бол эмнэлгийн зөв дараалал эсэх.

Сэдэв: ${s.title} (skill=${s.skill}). Зорилт: ${s.objectives.join('; ')}.

Багц (JSON):
${JSON.stringify(bundle)}

ЗАСВАРЛАСАН БҮТЭН багцыг буцаа. "notes"-д олдсон алдаа, засварыг товч бич.`
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
  properties: { lesson: LESSON, level_questions: { type: 'array', minItems: 10, maxItems: 10, items: LEVELQ }, mastery: MASTERY },
}
const VBUNDLE = {
  type: 'object', additionalProperties: false,
  required: ['lesson', 'level_questions', 'mastery', 'notes'],
  properties: { ...BUNDLE.properties, notes: { type: 'string' } },
}

phase('Author')
log(`Эрүүл мэнд ${GRADE}: ${SPECS.length} сэдэв — зохиох + шалгах`)
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
log(`Authored+verified ${ok.length}/${SPECS.length} health topics`)
return {
  subject: 'health',
  grade: GRADE,
  topics: ok.map(r => ({ skill: r.spec.skill, id: r.spec.id, notes: r.notes, bundle: {
    lesson: r.final.lesson, level_questions: r.final.level_questions, mastery: r.final.mastery,
  } })),
}
