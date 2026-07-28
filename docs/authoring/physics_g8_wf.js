export const meta = {
  name: 'physics-g8-authoring',
  description: 'Author Grade-8 physics lessons + level-test + mastery from the authentic Физик VIII textbook structure, adversarially verified',
  phases: [
    { title: 'Author', detail: 'one agent per topic writes lesson + 10 level Qs + mastery' },
    { title: 'Verify', detail: 'adversarial physics/answer-key check → corrected bundle' },
  ],
}

const READER = 'https://econtent.edu.mn/pages/more.php?id=306'
const BOOK = 306
const GRADE = 8

// Topic specs anchored to the AUTHENTIC Физик VIII (2019, МECSS) table of contents:
// I. Хүч ба харилцан үйлчлэл (5) / II. Механик хөдөлгөөн ба механик энерги (45)
// III. Цахилгаан ба соронзон (79) / IV. Энерги хангамж (109)
const SPECS = [
  {
    id: 'p8-1-1', skill: 'p8-pressure-solid', chap: 'I', chapTitle: 'Хүч ба харилцан үйлчлэл',
    num: '1.1', title: 'Хатуу биеийн даралт', strand: 'Бүлэг I. Хүч ба харилцан үйлчлэл, 6–12 тал',
    objectives: ['Даралтыг хүч ба тулах талбайн харьцаагаар тодорхойлох', 'Даралтын нэгж Паскаль (Па)-г ашиглан хялбар тооцоолол хийх', 'Тулах талбайг өөрчлөх нь даралтад хэрхэн нөлөөлөхийг практик жишээгээр тайлбарлах'],
    formulas: ['Даралт: $p=\\dfrac{F}{S}$', 'Нэгж: $1\\text{ Па}=1\\text{ Н}/\\text{м}^2$'],
    misconceptions: ['Даралт ба хүчийг ижилтгэх — даралт нь хүчийг талбайд харьцуулсан хэмжигдэхүүн', 'Тулах талбай ихсэхэд даралт ИХСЭНЭ гэж бодох — үнэндээ багасна (урвуу хамаарал)', 'Хүнд бие үргэлж их даралт үзүүлнэ гэж бодох — талбай нь шийдвэрлэх нөлөөтэй (жишээ: цанаар цасан дээр явах)'],
    mastery: true,
  },
  {
    id: 'p8-1-2', skill: 'p8-pressure-fluid', chap: 'I', chapTitle: 'Хүч ба харилцан үйлчлэл',
    num: '1.2', title: 'Шингэн ба хийн даралт', strand: 'Бүлэг I. Хүч ба харилцан үйлчлэл, 13–28 тал',
    objectives: ['Шингэний даралт гүнээс хамаарахыг тодорхойлох', 'Паскалийн хуулийг тайлбарлах, шингэний даралтыг тооцоолох', 'Атмосферийн даралтын оршихуйг туршилтаар нотлох'],
    formulas: ['Шингэний даралт: $p=\\rho g h$', 'Паскалийн хууль: шингэн даралтыг бүх чиглэлд ижилхэн дамжуулна', 'Атмосферийн даралт ≈ $10^5$ Па'],
    misconceptions: ['Шингэний даралт савны ХЭЛБЭР эсвэл нийт эзлэхүүнээс хамаарна гэж бодох — зөвхөн гүн ба нягтаас хамаарна', 'Шингэний даралт зөвхөн ДООШ үйлчилнэ гэж бодох — бүх чиглэлд үйлчилнэ', 'Атмосферийн даралт мэдрэгддэггүй тул байхгүй гэж бодох'],
    mastery: true,
  },
  {
    id: 'p8-1-3', skill: 'p8-lever', chap: 'I', chapTitle: 'Хүч ба харилцан үйлчлэл',
    num: '1.3', title: 'Хөшүүргийн эргэх шалтгаан', strand: 'Бүлэг I. Хүч ба харилцан үйлчлэл, 29–44 тал',
    objectives: ['Хүчний моментийг хүч ба мөрний үржвэрээр тодорхойлох', 'Хөшүүргийн тэнцвэрийн нөхцөлийг туршилтаар шалгах', 'Энгийн механизмын ашиг тусыг момент ашиглан тайлбарлах'],
    formulas: ['Хүчний момент: $M=F\\cdot d$', 'Хөшүүргийн тэнцвэр: $F_1 d_1 = F_2 d_2$', 'Нэгж: Н·м'],
    misconceptions: ['Зөвхөн хүчний хэмжээ чухал, мөрний урт хамаарахгүй гэж бодох — момент нь хоёуланг агуулна', 'Хөшүүрэг ЭНЕРГИ нэмэгдүүлдэг гэж бодох — зөвхөн хүчийг хожиж, зайд алддаг', 'Тулах цэгээс хол байрлах нь үргэлж ИХ хүч шаардана гэж бодох — эсрэгээрээ бага хүч хангалттай'],
    mastery: true,
  },
  {
    id: 'p8-2-1', skill: 'p8-uniform-motion', chap: 'II', chapTitle: 'Механик хөдөлгөөн ба механик энерги',
    num: '2.1', title: 'Жигд хөдөлгөөн', strand: 'Бүлэг II. Механик хөдөлгөөн ба механик энерги, 46–59 тал',
    objectives: ['Жигд хөдөлгөөний хурдыг тодорхойлж тооцоолох', 'Зам–хугацааны графикийг унших, байгуулах', 'Хөдөлгөөний харьцангуй чанарыг жишээгээр тайлбарлах'],
    formulas: ['Хурд: $v=\\dfrac{s}{t}$', 'Зам: $s=v\\cdot t$', 'Нэгж: м/с, км/ц ($1\\text{ м/с}=3.6\\text{ км/ц}$)'],
    misconceptions: ['Хурд ба туулсан замыг ижилтгэх — хурд нь зам/хугацааны харьцаа', 'Зам–хугацааны графикийн НАЛУУ нь хурдыг илэрхийлдгийг ойлгохгүй, тэнхлэгийн утгыг андуурах', 'Хөдөлгөөн үнэмлэхүй гэж бодох — тооллын биеэс хамаарч харьцангуй'],
    mastery: true,
  },
  {
    id: 'p8-2-2', skill: 'p8-accelerated-motion', chap: 'II', chapTitle: 'Механик хөдөлгөөн ба механик энерги',
    num: '2.2', title: 'Жигд хувьсах хөдөлгөөн', strand: 'Бүлэг II. Механик хөдөлгөөн ба механик энерги, 60–67 тал',
    objectives: ['Хурдатгалыг хурдны өөрчлөлт ба хугацааны харьцаагаар тодорхойлох', 'Жигд хувьсах хөдөлгөөний хурдыг тооцоолох', 'Хурд–хугацааны графикийг тайлбарлах'],
    formulas: ['Хурдатгал: $a=\\dfrac{v-v_0}{t}$', 'Хурд: $v=v_0+at$', 'Нэгж: $\\text{м}/\\text{с}^2$'],
    misconceptions: ['Хурдатгал ба хурдыг ижилтгэх — хурдатгал бол хурдны ӨӨРЧЛӨЛТИЙН эрчим', 'Хурд их бол хурдатгал их гэж бодох — жигд хөдөлгөөнд хурд их ч хурдатгал тэг', 'Сөрөг хурдатгал үргэлж удаашралыг илэрхийлнэ гэж бодох — чиглэлээс хамаарна'],
    mastery: true,
  },
  {
    id: 'p8-2-3', skill: 'p8-mech-energy', chap: 'II', chapTitle: 'Механик хөдөлгөөн ба механик энерги',
    num: '2.3', title: 'Механик энерги', strand: 'Бүлэг II. Механик хөдөлгөөн ба механик энерги, 68–72 тал',
    objectives: ['Кинетик ба потенциал энергийг ялган тодорхойлох', 'Механик энергийн хувирлыг жишээгээр тайлбарлах', 'Энергийн хялбар тооцоолол хийх'],
    formulas: ['Кинетик энерги: $E_k=\\dfrac{mv^2}{2}$', 'Потенциал энерги: $E_p=mgh$', 'Нэгж: Жоуль (Ж)'],
    misconceptions: ['Кинетик энерги хурдтай ШУГАМАН хамаарна гэж бодох — үнэндээ $v^2$-тай (хурд 2 дахин ихсэхэд энерги 4 дахин)', 'Өндөрт байгаа бие хөдлөхгүй тул энергигүй гэж бодох — потенциал энерги агуулна', 'Энерги устдаг/алга болдог гэж бодох — нэг хэлбэрээс нөгөөд шилждэг'],
    mastery: true,
  },
  {
    id: 'p8-2-4', skill: 'p8-work-power', chap: 'II', chapTitle: 'Механик хөдөлгөөн ба механик энерги',
    num: '2.4', title: 'Механик ажил, чадал', strand: 'Бүлэг II. Механик хөдөлгөөн ба механик энерги, 73–78 тал',
    objectives: ['Механик ажлыг хүч ба шилжилтийн үржвэрээр тодорхойлох', 'Чадлыг ажил ба хугацааны харьцаагаар тооцоолох', 'Ажил, чадлын нэгжийг зөв хэрэглэх'],
    formulas: ['Ажил: $A=F\\cdot s$', 'Чадал: $N=\\dfrac{A}{t}$', 'Нэгж: ажил — Жоуль (Ж), чадал — Ватт (Вт)'],
    misconceptions: ['Хүч үйлчилсэн бол үргэлж ажил хийгдэнэ гэж бодох — шилжилт тэг бол ажил ТЭГ (жишээ: хүнд ачааг барьж зогсох)', 'Ажил ба чадлыг ижилтгэх — чадал бол ажлыг хугацаанд харьцуулсан', 'Хүчний чиглэл шилжилттэй перпендикуляр үед ажил хийгдэнэ гэж бодох'],
    mastery: true,
  },
  {
    id: 'p8-3-1', skill: 'p8-static-electricity', chap: 'III', chapTitle: 'Цахилгаан ба соронзон',
    num: '3.1', title: 'Цахилгааны үзэгдэл', strand: 'Бүлэг III. Цахилгаан ба соронзон, 80–85 тал',
    objectives: ['Биеийн цахилгаанжих үзэгдлийг туршилтаар харуулах', 'Эерэг ба сөрөг цэнэгийн харилцан үйлчлэлийг тодорхойлох', 'Дамжуулагч ба тусгаарлагчийг ялгах'],
    formulas: ['Хоёр төрлийн цэнэг: эерэг (+) ба сөрөг (−)', 'Ижил цэнэг түлхэлцэнэ, эсрэг цэнэг таталцана', 'Цэнэгийн нэгж: Кулон (Кл)'],
    misconceptions: ['Үрэлтээр цэнэг ШИНЭЭР ҮҮСДЭГ гэж бодох — үнэндээ электрон нэг биеэс нөгөөд ШИЛЖДЭГ', 'Ижил цэнэгүүд таталцана гэж бодох — эсрэгээрээ түлхэлцэнэ', 'Зөвхөн металл цахилгаанжина гэж бодох — шил, хуванцар ч үрэлтээр цахилгаанждаг'],
    mastery: true,
  },
  {
    id: 'p8-3-2', skill: 'p8-circuits', chap: 'III', chapTitle: 'Цахилгаан ба соронзон',
    num: '3.2', title: 'Цахилгаан хэлхээ', strand: 'Бүлэг III. Цахилгаан ба соронзон, 86–99 тал',
    objectives: ['Цахилгаан хэлхээний бүдүүвчийг унших, зурах', 'Гүйдлийн хүч, хүчдэл, эсэргүүцлийн холбоог тодорхойлох', 'Цуваа ба зэрэгцээ холболтыг харьцуулах'],
    formulas: ['Гүйдлийн хүч: $I=\\dfrac{q}{t}$, нэгж Ампер (А)', 'Омын хууль: $I=\\dfrac{U}{R}$', 'Цуваа холболтод гүйдэл ижил, зэрэгцээд хүчдэл ижил'],
    misconceptions: ['Гүйдэл эх үүсвэрээс гарч замдаа "зарцуулагдан" багасна гэж бодох — цуваа хэлхээнд гүйдэл ХАА САЙГҮЙ ИЖИЛ', 'Хүчдэл ба гүйдлийг ижилтгэх — хүчдэл бол цэнэг зөөх ажил, гүйдэл бол цэнэгийн урсгал', 'Зэрэгцээ холболтод чийдэн бүрд хүчдэл хуваагдана гэж бодох — үнэндээ ижил хүчдэл ноогдоно'],
    mastery: true,
  },
  {
    id: 'p8-3-3', skill: 'p8-current-magnetism', chap: 'III', chapTitle: 'Цахилгаан ба соронзон',
    num: '3.3', title: 'Гүйдлийн соронзон шинж', strand: 'Бүлэг III. Цахилгаан ба соронзон, 100–108 тал',
    objectives: ['Гүйдэлтэй дамжуулагчийн эргэн тойрны соронзон орныг туршилтаар илрүүлэх', 'Ороомог (соленоид)-ийн соронзон орныг тодорхойлох', 'Цахилгаан соронзны хэрэглээг жишээгээр тайлбарлах'],
    formulas: ['Гүйдэл соронзон орон үүсгэнэ (Эрстедийн туршилт)', 'Соленоидын соронзон орон нь тогтмол соронзтой төстэй', 'Цахилгаан соронзны хүч: гүйдэл ↑, ороомгийн тоо ↑, төмөр цөм → орон хүчтэй'],
    misconceptions: ['Гүйдэлгүй ч утас соронзон оронтой гэж бодох — соронзон орон зөвхөн ГҮЙДЭЛ байхад үүснэ', 'Соронзон орны чиглэл гүйдлийн чиглэлээс хамаарахгүй гэж бодох — гүйдлийн чиглэл өөрчлөгдвөл орны чиглэл ч солигдоно', 'Цахилгаан соронзыг унтрааж болохгүй гэж бодох — гүйдлийг тасалбал соронзон чанар алга болно'],
    mastery: true,
  },
  {
    id: 'p8-4-1', skill: 'p8-energy-need', chap: 'IV', chapTitle: 'Энерги хангамж',
    num: '4.1', title: 'Бидэнд энерги хэрэгтэй юу?', strand: 'Бүлэг IV. Энерги хангамж, 110–113 тал',
    objectives: ['Өдөр тутмын амьдрал дахь энергийн хэрэглээг жишээгээр тодорхойлох', 'Энергийн эх үүсвэрүүдийг сэргээгдэх ба сэргээгдэхгүйгээр ангилах', 'Монгол орны энергийн эх үүсвэрийг тайлбарлах'],
    formulas: ['Сэргээгдэх: нар, салхи, ус, био', 'Сэргээгдэхгүй: нүүрс, газрын тос, байгалийн хий', 'Энергийн нэгж: Жоуль (Ж), кВт·ц'],
    misconceptions: ['Энерги "үйлдвэрлэгддэг" гэж бодох — үнэндээ нэг хэлбэрээс нөгөөд ХУВИРДАГ', 'Сэргээгдэх эх үүсвэр хязгааргүй, ямар ч сөрөг талгүй гэж бодох', 'Цахилгаан бол энергийн ЭХ ҮҮСВЭР гэж бодох — цахилгаан бол энерги дамжуулах хэлбэр'],
    mastery: false,
  },
  {
    id: 'p8-4-2', skill: 'p8-energy-transfer', chap: 'IV', chapTitle: 'Энерги хангамж',
    num: '4.2', title: 'Энерги зөөгдөх ба нөөцлөгдөх', strand: 'Бүлэг IV. Энерги хангамж, 114–118 тал',
    objectives: ['Энерги хадгалагдах хуулийг тайлбарлах', 'Энерги зөөгдөх аргуудыг жишээгээр ялгах', 'Энерги нөөцлөх аргуудыг тодорхойлох'],
    formulas: ['Энерги хадгалагдах хууль: нийт энерги тогтмол', 'Зөөгдөх: ажил, дулаан, цацраг, цахилгаан гүйдлээр', 'Нөөцлөх: потенциал, химийн, дулааны хэлбэрээр'],
    misconceptions: ['Энерги ашиглагдмагц АЛГА БОЛДОГ гэж бодох — хадгалагдаж, өөр хэлбэрт шилждэг', 'Нөөцлөгдсөн энерги гэдэг зөвхөн потенциал энерги гэж хязгаарлах — химийн, дулааны нөөц ч бий', 'Энерги зөөгдөхөд бодис заавал шилжинэ гэж бодох — цацрагаар бодисгүй ч дамжина'],
    mastery: true,
  },
  {
    id: 'p8-4-3', skill: 'p8-energy-efficiency', chap: 'IV', chapTitle: 'Энерги хангамж',
    num: '4.3', title: 'Энерги үр ашиггүй хэлбэрт шилжих', strand: 'Бүлэг IV. Энерги хангамж, 119–130 тал',
    objectives: ['Ашигтай үйлийн коэффициент (ҮАК)-ийг тооцоолох', 'Энергийн алдагдлын шалтгааныг тайлбарлах', 'Энерги хэмнэх аргыг санал болгох'],
    formulas: ['ҮАК: $\\eta=\\dfrac{A_{\\text{ашигтай}}}{A_{\\text{зарцуулсан}}}\\cdot 100\\%$', 'Алдагдал ихэвчлэн дулаан хэлбэрээр', 'Үргэлж $\\eta<100\\%$'],
    misconceptions: ['ҮАК 100% буюу түүнээс их байж болно гэж бодох — үргэлж 100%-иас бага', 'Алдагдсан энерги УСТДАГ гэж бодох — үр ашиггүй хэлбэрт (ихэвчлэн дулаан) шилждэг', 'Үрэлт үргэлж хортой гэж бодох — тоормослох, алхахад зайлшгүй хэрэгтэй'],
    mastery: true,
  },
  {
    id: 'p8-4-4', skill: 'p8-thermal-energy', chap: 'IV', chapTitle: 'Энерги хангамж',
    num: '4.4', title: 'Дулааны энерги', strand: 'Бүлэг IV. Энерги хангамж, 131–144 тал',
    objectives: ['Дулааны хэмжээг хувийн дулаан багтаамжаар тооцоолох', 'Дулаан дамжих гурван аргыг ялган тайлбарлах', 'Дулаан тусгаарлалтын практик хэрэглээг тайлбарлах'],
    formulas: ['Дулааны хэмжээ: $Q=cm\\Delta t$', 'Дамжих 3 арга: дулаан дамжуулал, конвекц, цацраг', 'Усны хувийн дулаан багтаамж: $c=4200\\ \\text{Ж}/(\\text{кг}\\cdot^\\circ\\text{C})$'],
    misconceptions: ['Температур ба дулааныг ижилтгэх — температур бол халалтын хэмжүүр, дулаан бол дамжих ЭНЕРГИ', 'ХҮЙТЭН дамждаг гэж бодох — үнэндээ дулаан халуунаас хүйтэн рүү дамждаг', 'Металл мод хоёр ижил өрөөнд байхад металл нь илүү ХҮЙТЭН гэж бодох — температур ижил, зөвхөн дулаан дамжуулалт өөр'],
    mastery: true,
  },
]

function commonRules() {
  return [
    'ХЭЛ: Бүх текст МОНГОЛ хэлээр, 8-р ангийн (13–14 нас) сурагчид ойлгомжтой, энгийн, тодорхой.',
    'ТҮВШИН: 8-р ангийн физик. Вектор задаргаа, тригонометр, импульс, идеал хийн тэгшитгэл, термодинамикийн хуулиуд зэрэг 10–11-р ангийн агуулгыг БҮҮ ор. Зөвхөн өгсөн зорилтын хүрээнд бич.',
    'ФОРМУЛА: Томьёо/тэмдэглэгээг $...$ дотор LaTeX-ээр бич (жишээ: $p=\\dfrac{F}{S}$, $E_k=\\dfrac{mv^2}{2}$). Ердийн текстэд LaTeX бүү хэрэглэ. LaTeX дотор HTML entity (&gt;, &lt;, &amp; гэх мэт) БҮҮ бич — жинхэнэ тэмдэгт ашигла.',
    'СОНГОЛТ: Сонголт бүрд яг 4 хувилбар. answer нь ЗӨВ хувилбарын индекс (0-3). Зөв хариултын байрлалыг санамсаргүй болгож, үргэлж эхэнд бүү тавь. Буруу хувилбаруудыг дээрх буруу ойлголтуудаас УХАМСАРТАЙ бүтээ (distractor).',
    'ФИЗИК ҮНЭН ЗӨВ: Бүх хариулт физикийн хувьд ҮНЭН ЗӨВ байх ёстой. Тоон бодлого зохиовол өөрөө бодож шалгаад, хариу нь сонголтуудын дунд ЯГ байгаа эсэхийг бататга. Нэгжийг зөв бич.',
    'ЗОХИОГЧИЙН ЭРХ: Сурах бичгийн эх бичвэрийг ҮГЧЛЭН БҮҮ хуул. Зөвхөн албан ёсны бүтэц, сэдэв, нэр томьёонд тулгуурлаж ӨӨРИЙН үгээр тайлбар, жишээ, дасгал зохио. Монгол орны бодит жишээ (Улаанбаатар, Говь, малчин, гэр, цахилгаан станц г.м.) ашиглавал сайн.',
  ].join('\n')
}

function authorPrompt(s) {
  return `Чи бол Монголын 8-р ангийн физикийн сурах бичиг зохиогч, арга зүйч. Доорх сэдвээр БҮРЭН хичээл + түвшин тогтоох 10 асуулт${s.mastery ? ' + ойлголт батлах (mastery) даалгавар' : ''} зохио.

## Сэдэв
- Хичээл: "${s.title}" (Бүлэг ${s.chap} — ${s.chapTitle}, хичээл ${s.num})
- skill_id: ${s.skill}, lesson_id: ${s.id}, анги: ${GRADE}
- Сурах бичгийн байрлал: ${s.strand}
- Хөтөлбөрийн зорилт (яг эдгээрийг заа):
${s.objectives.map(o => '  • ' + o).join('\n')}
- Гол томьёо/ойлголт:
${s.formulas.map(f => '  • ' + f).join('\n')}
- ЗААВАЛ шийдэх ёстой түгээмэл БУРУУ ОЙЛГОЛТууд (эдгээрийг distractor болон mastery-д ашигла):
${s.misconceptions.map(m => '  • ' + m).join('\n')}

## Дүрэм
${commonRules()}

## Гаргах бүтэц (StructuredOutput schema-г яг дага)
- lesson: id="${s.id}", grade=${GRADE}, chapter_num="${s.chap}", chapter_title_mn="${s.chapTitle}", lesson_num="${s.num}", title_mn="${s.title}", title_en=англи гарчиг, skill_id="${s.skill}", prerequisite_skill_ids=[], textbook={book_id:${BOOK}, pages_mn:"${s.strand}", reader_url:"${READER}"}, objectives_mn=[дээрх зорилтуудыг энгийн монголоор 3-аар], pretest=1 асуулт (өмнөх мэдлэг сорих, hint_mn+solution_mn+explanation_mn-тэй), sections=5–6 хэсэг (type нь "concept"/"definition"/"example"; body_mn нь **тод** тэмдэглэгээтэй, богино догол мөр, бодит жишээ; ядаж 2 хэсэг нь бүрэн бодсон ЖИШЭЭ бодлого байх), practice=5 дасгал (хялбар→хэцүү, hint_mn + дэлгэрэнгүй solution_mn-тэй), mastery_check=3 асуулт (ойлголт шалгах, explanation_mn-тэй).
- level_questions: ЯГ 10 асуулт. id="lt-${s.skill}-1" .. "lt-${s.skill}-10", skill_id="${s.skill}", difficulty 1..3 (эхнийх амархан, сүүлийнх хэцүү), choices 4, answer индекс, explanation_mn богино тайлбар. Асуултууд зорилтын бүх талыг хамруул; ядаж 3 нь буруу ойлголтыг шалгах концепцийн асуулт, ядаж 3 нь тоон бодлого байх.
${s.mastery ? `- mastery: skill_id="${s.skill}", title_mn="${s.title}", lesson_id="${s.id}", ordering=2 даалгавар (бодох/хийх алхмуудыг ЗӨВ дарааллаар нь steps-д 3–5 алхмаар бич — систем холихыг гүйцэтгэнэ), two_tier=3 даалгавар (t1=асуулт+4 сонголт+t1_answer, t2_prompt="Яагаад?"+t2_choices 4+t2_answer; буруу t2 сонголтууд нь misconception_mn-д тайлбарласан буруу ойлголтыг илэрхийлнэ).` : '- mastery: null (энэ сэдэвт mastery шаардлагагүй).'}

Зөвхөн StructuredOutput tool-оор бүтэцлэсэн үр дүн буцаа.`
}

function verifyPrompt(s, bundle) {
  return `Чи бол физикийн эксперт хянагч. Доорх 8-р ангийн физик хичээлийн багцыг ШҮҮМЖЛЭЛТЭЙ шалга. Гол зорилго: ФИЗИКИЙН АЛДАА, БУРУУ ХАРИУЛТЫН ТҮЛХҮҮР, АНГИД ТОХИРОХГҮЙ агуулгыг илрүүлж ЗАСАХ.

Шалгах зүйлс:
1) Асуулт бүрийн "answer"/"t1_answer"/"t2_answer" индекс ФИЗИКИЙН ХУВЬД ЗӨВ эсэх — сонголтуудыг нэг бүрчлэн тулгаж шалга. Буруу бол индексийг эсвэл сонголтыг зөв болго.
2) Тоон бодлого бүрийг ӨӨРӨӨ дахин бод: ${s.formulas.join(' ; ')}. Хариу сонголтуудын дунд байгаа эсэх, нэгж зөв эсэхийг бататга.
3) 10–11-р ангийн агуулга (вектор задаргаа, тригонометр, импульс, идеал хийн тэгшитгэл, термодинамикийн хууль) ОРООГҮЙ эсэх — оруулсан бол 8-р ангийн зорилтод тааруул.
4) LaTeX зөв ($...$ дотор, HTML entity байхгүй), монгол хэл, нэр томьёо зөв, сонголт бүр ЯГ 4.
5) ordering-ийн steps ЗӨВ логик дараалалтай эсэх.
6) Зөв хариулт бүгд ижил индекс дээр давтагдаж байвал (жишээ бүгд 0) сонголтын дарааллыг холиод answer-ийг тааруул.
7) Сурах бичгийн эх бичвэрийг үгчлэн хуулсан хэсэг байвал өөрийн үгээр дахин бич.

Сэдэв: ${s.title} (skill=${s.skill}). Хөтөлбөрийн зорилт: ${s.objectives.join('; ')}.

Багц (JSON):
${JSON.stringify(bundle)}

ЗАСВАРЛАСАН БҮТЭН багцыг буцаа: бүх талбарыг хадгалж, зөвхөн алдаатайг нь засаад бүтэн lesson/level_questions/mastery-г StructuredOutput-оор гаргана. Хэрэв алдаагүй бол ижлээр нь буцаа. "notes" талбарт олдсон алдаа, хийсэн засварыг товч бич.`
}

// ---- schemas (identical shape to the shipped grade-7 pipeline) ----
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
log(`Физик 8: ${SPECS.length} сэдэв — зохиох + шалгах`)
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
log(`Authored+verified ${ok.length}/${SPECS.length} grade-8 physics topics`)
return {
  grade: GRADE,
  topics: ok.map(r => ({ skill: r.spec.skill, id: r.spec.id, notes: r.notes, bundle: {
    lesson: r.final.lesson, level_questions: r.final.level_questions, mastery: r.final.mastery,
  } })),
}
