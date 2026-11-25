// Default site content. The live site loads content saved in the admin panel (/admin);
// this file is the starting point and the fallback when the API is unavailable.
import { P, gallery } from './photos.js';
import { stories } from './stories.js';
import { tours as baseTours, included, notIncluded } from './tours.js';

const U = (id) => `https://images.unsplash.com/${id}?w=1800&q=80&auto=format&fit=crop`;

// --- departures for the original 4 tours (dates of 2024 programme moved to 2027 — confirm in admin) ---
const DEPARTURES = {
  balkans: [{ start: '2027-07-08', end: '2027-07-17', status: 'open' }, { start: '2027-09-08', end: '2027-09-17', status: 'open' }],
  tmb: [{ start: '2027-07-17', end: '2027-07-26', status: 'open' }],
  dolomites: [{ start: '2027-08-22', end: '2027-08-30', status: 'open' }],
  sweden: [{ start: '2027-08-13', end: '2027-08-21', status: 'open' }],
};
const REGION = { balkans: 'balkans', tmb: 'alps', dolomites: 'dolomites', sweden: 'scandinavia' };

const original = baseTours.map((t) => ({
  slug: t.key,
  status: 'published',
  featured: true,
  region: REGION[t.key],
  name: t.name, tag: t.tag, countries: t.countries,
  photo: t.photo, gallery: t.gallery,
  days: t.days, hikingDays: t.hikingDays, km: t.km, gain: t.gain, maxAlt: t.maxAlt,
  group: t.group, price: t.price, deposit: t.deposit, level: t.level,
  meet: t.meet, difficulty: t.difficulty, intro: t.intro,
  highlights: [],
  route: t.route,
  departures: DEPARTURES[t.key],
  included, notIncluded,
}));

// --- new destinations (descriptions are general route facts; price "on request" until confirmed) ---
const L = (uk, en) => ({ uk, en });

const newTours = [
  {
    slug: 'zermatt-matterhorn', status: 'published', featured: true, isNew: true, region: 'alps',
    name: L('Церматт: трекінг біля Маттерхорну', 'Zermatt: Matterhorn Trekking'),
    tag: L('Ікона Альп', 'Alpine icon'), countries: L('Швейцарія', 'Switzerland'),
    photo: U('photo-1545161296-d9c2c241f2ad'),
    gallery: [U('photo-1760709071560-0f2b1daaf5cb'), U('photo-1769029299006-82d59e37c746'), U('photo-1571274834067-3a24675547b4')],
    days: 7, hikingDays: 5, km: 70, gain: 4500, maxAlt: 3260, group: '4–10', price: null, deposit: null, level: 3,
    meet: L('Церматт (Швейцарія)', 'Zermatt (Switzerland)'), difficulty: L('Середня', 'Moderate'),
    intro: L(
      'Тиждень пішохідних маршрутів довкола найвідомішої вершини Альп. Без технічного сходження — лише стежки з краєвидами, від яких перехоплює подих: озера, в яких віддзеркалюється Маттерхорн, льодовики, альпійські хатини й підйом до хатини Гернлі (3260 м) — базового табору класичного маршруту на вершину.',
      'A week of hiking trails around the most famous peak of the Alps. No technical climbing — just breathtaking trails: lakes reflecting the Matterhorn, glaciers, alpine huts, and a hike up to the Hörnli hut (3,260 m), base camp of the classic summit route.'
    ),
    highlights: [
      L('Стежка 5 озер з віддзеркаленням Маттерхорну', '5 Lakes Walk with Matterhorn reflections'),
      L('Matterhorn Glacier Trail', 'Matterhorn Glacier Trail'),
      L('Підйом до хатини Гернлі, 3260 м', 'Hike to the Hörnli hut, 3,260 m'),
      L('Церматт — містечко без автомобілів', 'Car-free village of Zermatt'),
    ],
    route: [
      L('Приїзд до Церматту', 'Arrival in Zermatt'),
      L('Стежка 5 озер: Штелізее, Грюнзее', '5 Lakes Walk: Stellisee, Grünsee'),
      L('Горнерграт і панорама 29 чотиритисячників', 'Gornergrat and its 4,000 m panorama'),
      L('Matterhorn Glacier Trail', 'Matterhorn Glacier Trail'),
      L('Підйом до хатини Гернлі (3260 м)', 'Hike to the Hörnli hut (3,260 m)'),
      L('Стежка Europaweg / резервний день', 'Europaweg trail / reserve day'),
      L('Від’їзд', 'Departure'),
    ],
    departures: [{ start: '2027-07-03', end: '2027-07-09', status: 'open' }, { start: '2027-09-04', end: '2027-09-10', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'toubkal-morocco', status: 'published', featured: true, isNew: true, region: 'morocco',
    name: L('Марокко: Тубкаль і Атлас', 'Morocco: Toubkal & the Atlas'),
    tag: L('4167 м · Африка', '4,167 m · Africa'), countries: L('Марокко', 'Morocco'),
    photo: U('photo-1611859836043-a9177f500a27'),
    gallery: [U('photo-1609333904079-b781b46190ef'), U('photo-1647997796214-ae7aa29fa3b6'), U('photo-1534003085889-5e1870403fdc'), U('photo-1560789590-ee4cc7125967')],
    days: 8, hikingDays: 5, km: 50, gain: 3200, maxAlt: 4167, group: '4–10', price: null, deposit: null, level: 3,
    meet: L('Марракеш (Марокко)', 'Marrakech (Morocco)'), difficulty: L('Середня, висота понад 4000 м', 'Moderate, altitude above 4,000 m'),
    intro: L(
      'Найвища вершина Північної Африки — Джебель Тубкаль (4167 м) у Високому Атласі. Стартуємо з берберського села Імліль (~1740 м), долиною Мізане піднімаємося до притулку на ~3200 м і на світанку штурмуємо вершину. У теплий сезон стандартний маршрут не потребує технічних навичок — лише гарної форми й акліматизації. А ще — марокканський чай, тажин і гамір Марракеша.',
      'The highest peak in North Africa — Jebel Toubkal (4,167 m) in the High Atlas. We start in the Berber village of Imlil (~1,740 m), walk up the Mizane valley to the refuge at ~3,200 m and summit at dawn. In the warm season the standard route needs no technical skills — just good fitness and acclimatisation. Plus Moroccan mint tea, tagine and the buzz of Marrakech.'
    ),
    highlights: [
      L('Вершина 4167 м — дах Північної Африки', '4,167 m summit — the roof of North Africa'),
      L('Берберські села й мули-помічники', 'Berber villages and helpful mules'),
      L('Акліматизаційні виходи в долинах Атласу', 'Acclimatisation hikes in Atlas valleys'),
      L('День у Марракеші', 'A day in Marrakech'),
    ],
    route: [
      L('Приліт до Марракеша, переїзд до Імліля', 'Arrive in Marrakech, transfer to Imlil'),
      L('Акліматизаційний похід довкола Імліля', 'Acclimatisation hike around Imlil'),
      L('Перехід через перевал у сусідню долину', 'Cross a pass into a neighbouring valley'),
      L('Підйом до притулку Тубкаль (~3200 м)', 'Ascent to Toubkal refuge (~3,200 m)'),
      L('Сходження на Тубкаль (4167 м), спуск', 'Summit Toubkal (4,167 m), descent'),
      L('Спуск до Імліля', 'Descent to Imlil'),
      L('Марракеш: медина, сук, хаммам', 'Marrakech: medina, souk, hammam'),
      L('Виліт додому', 'Flight home'),
    ],
    departures: [{ start: '2027-04-24', end: '2027-05-01', status: 'open' }, { start: '2027-10-09', end: '2027-10-16', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'madeira', status: 'published', featured: false, isNew: true, region: 'islands',
    name: L('Мадейра: над хмарами', 'Madeira: Above the Clouds'),
    tag: L('Легкий трекінг', 'Easy trekking'), countries: L('Португалія', 'Portugal'),
    photo: U('photo-1686026368380-abb0b5d24b9c'),
    gallery: [U('photo-1689349666953-e8d81553fda2'), U('photo-1563099199-fa1a6852b3be')],
    days: 8, hikingDays: 6, km: 75, gain: 3500, maxAlt: 1862, group: '4–12', price: null, deposit: null, level: 2,
    meet: L('Фуншал (Мадейра)', 'Funchal (Madeira)'), difficulty: L('Легка–середня', 'Easy–moderate'),
    intro: L(
      'Вічна весна, левади вздовж прірв і легендарна стежка PR1 від Піку-ду-Арейру до Піку-Руйву, яка знову відкрилася у 2026 році після пожежі. Маршрути на Мадейрі тепер за попереднім бронюванням через портал SIMplifica — ми все організуємо за вас.',
      'Eternal spring, levadas along cliffs and the legendary PR1 trail from Pico do Arieiro to Pico Ruivo, reopened in 2026 after a wildfire. Madeira’s trails now require advance booking via the SIMplifica portal — we take care of it for you.'
    ),
    highlights: [
      L('PR1: Піку-ду-Арейру — Піку-Руйву', 'PR1: Pico do Arieiro — Pico Ruivo'),
      L('Левада 25 джерел', 'Levada of the 25 Fountains'),
      L('Мис Сан-Лоуренсу', 'Ponta de São Lourenço'),
      L('Схід сонця над хмарами', 'Sunrise above the clouds'),
    ],
    route: [
      L('Приліт до Фуншала', 'Arrive in Funchal'),
      L('Мис Сан-Лоуренсу (PR8)', 'Ponta de São Lourenço (PR8)'),
      L('Левада 25 джерел (PR6)', 'Levada of the 25 Fountains (PR6)'),
      L('Схід сонця на Піку-ду-Арейру, PR1 до Піку-Руйву', 'Sunrise at Pico do Arieiro, PR1 to Pico Ruivo'),
      L('Лаврові ліси Фанал', 'Fanal laurel forest'),
      L('Левада Калдейрау-Верде', 'Levada do Caldeirão Verde'),
      L('Вільний день в океані', 'Free ocean day'),
      L('Виліт', 'Departure'),
    ],
    departures: [{ start: '2027-05-15', end: '2027-05-22', status: 'open' }, { start: '2027-09-25', end: '2027-10-02', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'mallorca-gr221', status: 'published', featured: false, isNew: true, region: 'islands',
    name: L('Майорка: Шлях сухого каменю GR221', 'Mallorca: Dry Stone Route GR221'),
    tag: L('Море + гори', 'Sea + mountains'), countries: L('Іспанія', 'Spain'),
    photo: U('photo-1602085337677-2bd838a4f880'),
    gallery: [U('photo-1585128259670-510616c727ac'), U('photo-1612369915490-c2c931754535')],
    days: 8, hikingDays: 6, km: 90, gain: 4800, maxAlt: 1100, group: '4–12', price: null, deposit: null, level: 2,
    meet: L('Пальма (Майорка)', 'Palma (Mallorca)'), difficulty: L('Легка–середня', 'Easy–moderate'),
    intro: L(
      'Гори Серра-де-Трамунтана — об’єкт ЮНЕСКО: старі мулячі стежки з сухої кладки, оливкові гаї, кам’яні села Вальдемосса й Дейя та бірюзове море під ногами. Ідеально навесні та восени, коли в Альпах ще чи вже сніг.',
      'The Serra de Tramuntana — a UNESCO site: old dry-stone mule paths, olive groves, the stone villages of Valldemossa and Deià and a turquoise sea below. Perfect in spring and autumn when the Alps are still — or already — under snow.'
    ),
    highlights: [L('Стежки ЮНЕСКО з сухої кладки', 'UNESCO dry-stone paths'), L('Вальдемосса й Дейя', 'Valldemossa & Deià'), L('Купання в бухтах', 'Swimming in coves')],
    route: [
      L('Приліт до Пальми', 'Arrive in Palma'),
      L('Естельєнкс — Банйальбуфар', 'Estellencs — Banyalbufar'),
      L('Банйальбуфар — Вальдемосса', 'Banyalbufar — Valldemossa'),
      L('Вальдемосса — Дейя', 'Valldemossa — Deià'),
      L('Дейя — Соєр', 'Deià — Sóller'),
      L('Соєр — притулок Тоссальс-Вердс', 'Sóller — Tossals Verds refuge'),
      L('Тоссальс-Вердс — Льюк', 'Tossals Verds — Lluc'),
      L('Виліт', 'Departure'),
    ],
    departures: [{ start: '2027-03-27', end: '2027-04-03', status: 'open' }, { start: '2027-10-23', end: '2027-10-30', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'julian-alps-triglav', status: 'published', featured: false, isNew: true, region: 'alps',
    name: L('Юлійські Альпи і Триглав', 'Julian Alps & Triglav'),
    tag: L('Смарагдові озера', 'Emerald lakes'), countries: L('Словенія', 'Slovenia'),
    photo: U('photo-1568206222579-3d32da70596b'),
    gallery: [U('photo-1469362102473-8622cfb973cd'), U('photo-1578569820746-ff1b6f246b8c')],
    days: 8, hikingDays: 6, km: 75, gain: 5200, maxAlt: 2864, group: '4–8', price: null, deposit: null, level: 3,
    meet: L('Любляна (Словенія)', 'Ljubljana (Slovenia)'), difficulty: L('Середня', 'Moderate'),
    intro: L(
      'Триглав (2864 м) — найвища вершина Словенії й національний символ. Долина Семи Озер, озера Бохінь і Блед, бірюзова Соча та гірські хатини з домашнім штруделем. Фінальний підйом на Триглав — з елементами віа-ферати, тож буде трохи адреналіну.',
      'Triglav (2,864 m) is Slovenia’s highest peak and national symbol. The Seven Lakes Valley, lakes Bohinj and Bled, the turquoise Soča and mountain huts with homemade strudel. The final push to Triglav has via ferrata sections — a little adrenaline included.'
    ),
    highlights: [L('Долина Семи Озер', 'Seven Lakes Valley'), L('Вершина Триглав 2864 м', 'Triglav summit 2,864 m'), L('Озера Бохінь і Блед', 'Lakes Bohinj & Bled')],
    route: [
      L('Приїзд, озеро Бохінь', 'Arrival, Lake Bohinj'),
      L('Водоспад Савиця, підйом до Долини Семи Озер', 'Savica waterfall, up to the Seven Lakes Valley'),
      L('Долина Семи Озер', 'Seven Lakes Valley'),
      L('Перехід до хатини під Триглавом', 'Traverse to a hut below Triglav'),
      L('Сходження на Триглав (2864 м)', 'Summit Triglav (2,864 m)'),
      L('Спуск у долину Крма', 'Descent to the Krma valley'),
      L('Озеро Блед', 'Lake Bled'),
      L('Від’їзд', 'Departure'),
    ],
    departures: [{ start: '2027-08-07', end: '2027-08-14', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'high-tatras', status: 'published', featured: false, isNew: true, region: 'carpathians',
    name: L('Високі Татри: від хати до хати', 'High Tatras: Hut to Hut'),
    tag: L('Найближчі «Альпи»', 'The nearest “Alps”'), countries: L('Словаччина · Польща', 'Slovakia · Poland'),
    photo: U('photo-1629267481369-28fb3ac3828b'),
    gallery: [U('photo-1562878716-48b7542721e3'), U('photo-1466940219795-c670f475e59f')],
    days: 7, hikingDays: 5, km: 65, gain: 4500, maxAlt: 2501, group: '4–10', price: null, deposit: null, level: 3,
    meet: L('Попрад (Словаччина)', 'Poprad (Slovakia)'), difficulty: L('Середня', 'Moderate'),
    intro: L(
      'Найвищі гори Карпат — справжній альпійський рельєф за кілька годин від дому. Ночуємо в гірських «хатах», піднімаємося на Рисы (2501 м) — найвищу точку Польщі, — гуляємо гірськими озерами-плесами й куштуємо словацькі галушки.',
      'The highest mountains of the Carpathians — true alpine terrain just a few hours from home. We sleep in mountain “chaty”, climb Rysy (2,501 m) — Poland’s highest point — wander past tarns and taste Slovak halušky.'
    ),
    highlights: [L('Рисы, 2501 м', 'Rysy, 2,501 m'), L('Ночівлі в гірських хатах', 'Nights in mountain huts'), L('Озера Штрбське й Попрадське плесо', 'Štrbské & Popradské pleso')],
    route: [
      L('Приїзд до Попрада / Штрбського плеса', 'Arrive in Poprad / Štrbské pleso'),
      L('Попрадське плесо, хата під Рисами', 'Popradské pleso, Chata pod Rysmi'),
      L('Сходження на Рисы (2501 м)', 'Summit Rysy (2,501 m)'),
      L('Долина Млинична, водоспад Скок', 'Mlynická valley, Skok waterfall'),
      L('Теріго хата, Долина П’яти плес', 'Téryho chata, Five Tarns Valley'),
      L('Ломницьке сідло', 'Lomnické sedlo'),
      L('Від’їзд', 'Departure'),
    ],
    departures: [{ start: '2027-07-31', end: '2027-08-06', status: 'open' }, { start: '2027-09-11', end: '2027-09-17', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'durmitor', status: 'published', featured: false, isNew: true, region: 'balkans',
    name: L('Дурмітор і каньйон Тари', 'Durmitor & the Tara Canyon'),
    tag: L('Легкий старт', 'Easy start'), countries: L('Чорногорія', 'Montenegro'),
    photo: U('photo-1503147943191-8935764b7a68'),
    gallery: [U('photo-1578479872562-b79f2f9606e4'), U('photo-1643976284660-ba8c8e08fbea')],
    days: 7, hikingDays: 5, km: 60, gain: 3500, maxAlt: 2523, group: '4–12', price: null, deposit: null, level: 2,
    meet: L('Подгориця / Тіват (Чорногорія)', 'Podgorica / Tivat (Montenegro)'), difficulty: L('Легка–середня', 'Easy–moderate'),
    intro: L(
      'Ідеальний перший гірський тур: національний парк Дурмітор (ЮНЕСКО), Чорне озеро, вершина Боботов Кук (2523 м) і один із найглибших каньйонів Європи — Тара. Ввечері — сир, каймак і домашнє вино в горах.',
      'A perfect first mountain trip: Durmitor National Park (UNESCO), the Black Lake, Bobotov Kuk (2,523 m) and one of Europe’s deepest canyons — the Tara. In the evenings — cheese, kajmak and homemade wine.'
    ),
    highlights: [L('Чорне озеро', 'Black Lake'), L('Боботов Кук, 2523 м', 'Bobotov Kuk, 2,523 m'), L('Каньйон Тари', 'Tara Canyon')],
    route: [
      L('Приліт, переїзд до Жабляка', 'Arrive, transfer to Žabljak'),
      L('Чорне озеро і Змієве озеро', 'Black Lake and Zmijinje lake'),
      L('Сходження на Боботов Кук (2523 м)', 'Summit Bobotov Kuk (2,523 m)'),
      L('Оглядова Ćurevac над каньйоном Тари', 'Ćurevac viewpoint over the Tara canyon'),
      L('Озеро Шкрка', 'Škrka lakes'),
      L('Міст Джурджевича Тара, рафтинг (за бажанням)', 'Đurđevića Tara bridge, rafting (optional)'),
      L('Від’їзд', 'Departure'),
    ],
    departures: [{ start: '2027-06-19', end: '2027-06-25', status: 'open' }],
    included, notIncluded,
  },
  {
    slug: 'picos-de-europa', status: 'published', featured: false, isNew: true, region: 'iberia',
    name: L('Пікос-де-Еуропа', 'Picos de Europa'),
    tag: L('Зелена Іспанія', 'Green Spain'), countries: L('Іспанія', 'Spain'),
    photo: U('photo-1665649913052-d84aaa32b8b8'),
    gallery: [U('photo-1626023468964-6850a232c6df'), U('photo-1597241673028-8ee11ba6fe8c')],
    days: 7, hikingDays: 5, km: 70, gain: 4000, maxAlt: 2300, group: '4–12', price: null, deposit: null, level: 2,
    meet: L('Ов’єдо / Сантандер (Іспанія)', 'Oviedo / Santander (Spain)'), difficulty: L('Легка–середня', 'Easy–moderate'),
    intro: L(
      'Вапнякові гори за 20 км від Атлантики: ущелина Карес — «божественна ущелина», озера Ковадонги, вершина-символ Наранхо-де-Бульнес і астурійський сидр. Менше людей, ніж в Альпах, — і зовсім інший характер.',
      'Limestone mountains 20 km from the Atlantic: the Cares Gorge — the “divine gorge”, the Lakes of Covadonga, the iconic Naranjo de Bulnes and Asturian cider. Fewer crowds than the Alps — and a totally different character.'
    ),
    highlights: [L('Ущелина Карес', 'Cares Gorge'), L('Озера Ковадонги', 'Lakes of Covadonga'), L('Наранхо-де-Бульнес', 'Naranjo de Bulnes')],
    route: [
      L('Приліт, переїзд до Кангас-де-Оніс', 'Arrive, transfer to Cangas de Onís'),
      L('Озера Ковадонги', 'Lakes of Covadonga'),
      L('Ущелина Карес: Пончебос — Каїн', 'Cares Gorge: Poncebos — Caín'),
      L('Село Бульнес і погляд на Наранхо', 'Bulnes village and Naranjo views'),
      L('Фуенте-Де і канатна дорога, плато', 'Fuente Dé cable car and plateau'),
      L('Прибережна стежка Атлантики', 'Atlantic coastal path'),
      L('Від’їзд', 'Departure'),
    ],
    departures: [{ start: '2027-06-05', end: '2027-06-11', status: 'open' }, { start: '2027-09-18', end: '2027-09-24', status: 'open' }],
    included, notIncluded,
  },
];

// --- news (written in our own words; each links to its source) ---
const news = [
  {
    slug: 'mont-blanc-4807-47', date: '2026-10-14', photo: U('photo-1605128005752-d1714260611e'), tags: ['Mont Blanc'],
    title: L('Монблан «підріс» майже на 2 метри: 4807,47 м', 'Mont Blanc “grew” almost 2 metres: 4,807.47 m'),
    excerpt: L('Нові вимірювання французьких геодезистів показали висоту 4807,47 м — на 1,88 м більше, ніж у 2023 році.', 'New French survey puts the summit at 4,807.47 m — 1.88 m higher than in 2023.'),
    body: L(
      'У жовтні 2026 року геодезисти департаменту Верхня Савойя оприлюднили результати вересневих вимірювань: висота Монблану — 4807,47 м. Це на 1,88 м більше, ніж у 2023 році, коли вершина опустилася до рекордно низьких 4805,59 м.\n\nЧому висота «гуляє»? Скельна вершина Монблану розташована приблизно на 4792 м, а все, що вище, — це сніжно-льодова шапка. Її товщина щороку змінюється залежно від вітру, опадів і спеки. Геодезисти наголошують: окреме вимірювання нічого не доводить, важливий лише довгостроковий тренд.\n\nДля нас, гідів, це гарне нагадування: гори — живі. Коли йдемо Туром навколо Монблану, ми бачимо не застиглу листівку, а масив, що постійно змінюється.',
      'In October 2026 surveyors from Haute-Savoie published their September measurements: Mont Blanc stands at 4,807.47 m — 1.88 m higher than in 2023, when the summit dropped to a record low of 4,805.59 m.\n\nWhy does the height “wander”? Mont Blanc’s rocky summit sits at around 4,792 m; everything above is a snow-and-ice cap whose thickness changes each year with wind, snowfall and heat. Surveyors stress that a single measurement proves nothing — only the long-term trend matters.\n\nFor us guides it’s a nice reminder that mountains are alive. On the Tour du Mont Blanc we see not a frozen postcard but a massif in constant change.'
    ),
    source: { name: 'Euronews', url: 'https://www.euronews.com/2026/10/14/mont-blanc-new-french-measurements-summit-grows-to-4807m' },
  },
  {
    slug: 'matterhorn-guides-heat-2026', date: '2026-07-12', photo: U('photo-1769029299006-82d59e37c746'), tags: ['Matterhorn', 'Safety'],
    title: L('Гіди Церматта радять не йти на Маттерхорн у спеку', 'Zermatt guides advise against the Matterhorn in the heat'),
    excerpt: L('Після малосніжної зими й хвиль спеки Маттерхорн у липні майже без льоду — зросла загроза каменепадів.', 'After a low-snow winter and heatwaves, the Matterhorn is nearly ice-free in July — rockfall risk is up.'),
    body: L(
      'У липні 2026 року гіди Церматта перестали брати нових клієнтів на Маттерхорн і радили відкласти сходження. Після зими з малою кількістю снігу та кількох хвиль спеки гора вже в середині липня стала майже безльодовою.\n\nГоловна загроза — каменепади. Повідомлялося про кілька небезпечних ситуацій, коли камені зачіпали зв’язки альпіністів; одного гіда евакуювали гелікоптером. Наглядачка хатини Гернлі звертає увагу й на людський фактор: недосвідчені групи на довгих мотузках самі зрушують каміння на тих, хто нижче.\n\nЩо це означає для мандрівників: найкращі місяці для класичних альпійських маршрутів поступово зсуваються на червень і вересень. Саме тому наш тур «Церматт: трекінг біля Маттерхорну» стоїть у календарі на початок липня та вересень — і він повністю пішохідний, без технічного сходження.',
      'In July 2026 Zermatt guides stopped taking new clients up the Matterhorn and advised postponing the climb. After a low-snow winter and repeated heatwaves, the mountain was almost ice-free by mid-July.\n\nThe main danger is rockfall. Several near-misses were reported when falling stones hit rope teams; one guide had to be airlifted. The Hörnli hut warden also points to the human factor: inexperienced groups on long ropes dislodge rocks onto people below.\n\nWhat it means for travellers: the best months for classic alpine routes are shifting towards June and September. That’s why our “Zermatt: Matterhorn Trekking” trip runs in early July and September — and it’s a pure hiking trip with no technical climbing.'
    ),
    source: { name: 'blue News', url: 'https://www.bluewin.ch/en/news/switzerland/now-zermatt-mountain-guides-are-avoiding-the-matterhorn-li.3526157' },
  },
  {
    slug: 'mont-blanc-rockfall-summer-2026', date: '2026-09-09', photo: U('photo-1514401375831-85d3789fd515'), tags: ['Mont Blanc', 'Climate'],
    title: L('Літо каменепадів: що відбувається з масивом Монблан', 'Summer of rockfalls: what’s happening to the Mont Blanc massif'),
    excerpt: L('Танення вічної мерзлоти зробило літо 2026 одним із найнебезпечніших після 2022 року. Печеру в льодовику Мер-де-Глас укрили брезентом.', 'Thawing permafrost made summer 2026 one of the riskiest since 2022. The Mer de Glace ice cave was covered with tarpaulins.'),
    body: L(
      'За даними науковців, літо 2026 року за кількістю обвалів наблизилося до «катастрофічного» 2022-го, коли у масиві Монблан зафіксували майже 300 обвалів. Причина — танення вічної мерзлоти, яка буквально «склеює» скелі.\n\nГіди Шамоні розповідають, що через танення та каменепади частину запланованих сходжень на вершину довелося скасувати. А в Монтенвері печеру в льодовику Мер-де-Глас укривають брезентом, щоб сповільнити танення.\n\nНаш підхід до безпеки: ми обираємо пішохідні маршрути й час виходу з урахуванням погоди, а програма Туру навколо Монблану має запасні варіанти на випадок спеки чи закриття стежок.',
      'According to scientists, summer 2026 came close to the “catastrophic” 2022 season, when nearly 300 collapses were recorded in the Mont Blanc massif. The cause is thawing permafrost, which literally glues the rock together.\n\nChamonix guides say melting and rockfall forced them to cancel some planned summit climbs. At Montenvers, the Mer de Glace ice cave is covered with tarpaulins to slow the melt.\n\nOur safety approach: we pick hiking routes and start times with the weather in mind, and the Tour du Mont Blanc programme has back-up options for heatwaves or trail closures.'
    ),
    source: { name: 'Fortune / AP', url: 'https://www.fortune.com/2026/09/09/mont-blanc-mountain-defrosting-climate-change/' },
  },
  {
    slug: 'italian-guides-suspend-mont-blanc', date: '2026-07-15', photo: U('photo-1530738270955-2ed78de5c2a9'), tags: ['Mont Blanc', 'Safety'],
    title: L('Італійські гіди тимчасово призупиняли сходження на Монблан', 'Italian guides temporarily halted Mont Blanc ascents'),
    excerpt: L('Через спеку в липні 2026 на італійському боці зупиняли сходження заради безпеки.', 'Due to the July 2026 heatwave, ascents on the Italian side were paused for safety.'),
    body: L(
      'Хвиля спеки, що накрила Європу в липні 2026 року, дісталася й вершин. Італійські гірські гіди вирішили тимчасово призупинити сходження на Монблан зі свого боку через підвищений ризик каменепадів. Попередження стосувалися також Маттерхорну.\n\nПорада гіда: влітку плануйте високогірні виходи на ранок, стежте за прогнозом нульової ізотерми і не соромтеся повертати назад — гори нікуди не подінуться.',
      'The heatwave that swept Europe in July 2026 reached the summits too. Italian mountain guides decided to temporarily suspend Mont Blanc ascents from their side due to increased rockfall risk. Warnings also covered the Matterhorn.\n\nGuide’s tip: in summer plan high-altitude outings for early mornings, watch the freezing-level forecast and don’t be shy to turn back — the mountain will still be there.'
    ),
    source: { name: 'Ground News / The Local', url: 'https://ground.news/article/the-heat-wave-strikes-to-the-peaks-guides-suspend-the-ascent-of-mont-blanc-on-the-italian-side' },
  },
  {
    slug: 'mont-blanc-speed-record-2026', date: '2026-04-26', photo: U('photo-1759049219585-4feb729fb018'), tags: ['Mont Blanc', 'Records'],
    title: L('Новий рекорд швидкості на Монблан', 'New Mont Blanc speed record'),
    excerpt: L('Двоє французьких гірських гідів побили рекорд сходження 4 год 43 хв 24 с.', 'Two French mountain guides beat the 4h 43m 24s ascent record.'),
    body: L(
      'Наприкінці квітня 2026 року двоє французьких гірських гідів встановили новий рекорд швидкісного сходження на Монблан, побивши попередній результат 4 години 43 хвилини 24 секунди.\n\nНагадаємо: звичайні альпіністи витрачають на класичний маршрут 2–3 дні з ночівлею в хатинах. А ми радимо почати знайомство з Монбланом з Туру навколо масиву — щоб побачити велетня з усіх боків.',
      'In late April 2026 two French mountain guides set a new speed record for climbing Mont Blanc, beating the previous mark of 4 hours 43 minutes 24 seconds.\n\nFor comparison, ordinary climbers take 2–3 days on the classic route with hut nights. We recommend starting your Mont Blanc story with the Tour du Mont Blanc — to see the giant from every side.'
    ),
    source: { name: 'blue News', url: 'https://www.bluewin.ch/en/news/two-frenchmen-break-the-record-for-the-ascent-of-mont-blanc-li.3205563' },
  },
  {
    slug: 'old-gouter-refuge', date: '2026-04-15', photo: U('photo-1599661520791-8aabee470d55'), tags: ['Mont Blanc'],
    title: L('Старий притулок Гуте на Монблані демонтують', 'The old Goûter refuge on Mont Blanc will be dismantled'),
    excerpt: L('Після майже двох десятиліть очікувань стара хатина зникне з класичного маршруту.', 'After almost two decades of waiting, the old hut will disappear from the normal route.'),
    body: L(
      'Стара хатина Гуте на класичному маршруті сходження на Монблан готується остаточно зникнути — після майже двадцяти років анонсів і перенесень. На маршруті залишається сучасний притулок Гуте, що працює за попереднім бронюванням.\n\nДля альпіністів це символічна подія: старий притулок десятиліттями був частиною історії вершини.',
      'The old Goûter hut on Mont Blanc’s normal route is set to disappear for good — after nearly twenty years of announcements and delays. The modern Goûter refuge, which runs on advance booking, remains on the route.\n\nFor climbers it’s a symbolic moment: the old hut was part of the mountain’s history for decades.'
    ),
    source: { name: 'Ground News', url: 'https://ground.news/article/the-old-gouter-refuge-on-mont-blanc-will-be-dismantled' },
  },
  {
    slug: 'matterhorn-alpine-crossing-2026', date: '2026-06-10', photo: U('photo-1760709071560-0f2b1daaf5cb'), tags: ['Matterhorn'],
    title: L('Matterhorn Alpine Crossing: багаж тепер їде окремо', 'Matterhorn Alpine Crossing: luggage now travels separately'),
    excerpt: L('Канатний перехід Церматт — Червінія святкує 3 роки й запустив перевезення багажу двічі на день.', 'The Zermatt — Cervinia cable crossing turns 3 and launched twice-daily luggage transport.'),
    body: L(
      'Канатний перехід Matterhorn Alpine Crossing, що з’єднує швейцарський Церматт та італійську Червінію через льодовики під Маттерхорном, працює вже три роки. Влітку 2026 року з’явилася нова зручність: двічі на день багаж можна здати в Церматті чи Червінії — як в аеропорту — і подорожувати налегке.\n\nА на вершині Matterhorn Glacier Paradise у льодовому палаці додали нову фотозону з контуром Маттерхорну, вмороженим у крижану стіну.',
      'The Matterhorn Alpine Crossing, linking Swiss Zermatt and Italian Cervinia across the glaciers below the Matterhorn, has been running for three years. In summer 2026 a new perk arrived: twice a day you can check in luggage in Zermatt or Cervinia — like at an airport — and travel light.\n\nAt Matterhorn Glacier Paradise, the glacier palace got a new photo spot with the Matterhorn’s outline set into the ice wall.'
    ),
    source: { name: 'Matterhorn Paradise', url: 'https://www.matterhornparadise.ch/en/about/news/the-start-of-summer-at-matterhorn-paradise_news_5100028' },
  },
  {
    slug: 'madeira-pr1-reopened', date: '2026-04-12', photo: U('photo-1686026368380-abb0b5d24b9c'), tags: ['Madeira', 'Rules'],
    title: L('Мадейра: PR1 знову відкрита, а стежки — за бронюванням', 'Madeira: PR1 reopens, trails now by reservation'),
    excerpt: L('Легендарна стежка Піку-ду-Арейру — Піку-Руйву відкрилася після пожежі 2024 року. Вхід — €10,50, інші стежки — €4,50.', 'The legendary Pico do Arieiro — Pico Ruivo trail reopened after the 2024 wildfire. Entry €10.50, other trails €4.50.'),
    body: L(
      'Стежка PR1 Vereda do Areeiro довжиною 7 км, що з’єднує три найвищі вершини Мадейри, у квітні 2026 року відкрилася після відновлення через пожежу 2024 року.\n\nЗ 1 січня 2026 року на всі класифіковані стежки острова діє обов’язкове бронювання через портал SIMplifica. Стандартна плата — €4,50 з особи, для повної PR1 — €10,50.\n\nУ нашому турі «Мадейра: над хмарами» бронювання слотів і квитків беремо на себе.',
      'The 7 km PR1 Vereda do Areeiro, linking Madeira’s three highest peaks, reopened in April 2026 after restoration following the 2024 wildfire.\n\nSince 1 January 2026 all classified trails on the island require booking via the SIMplifica portal. The standard fee is €4.50 per person; the full PR1 costs €10.50.\n\nOn our “Madeira: Above the Clouds” trip we take care of slot bookings and tickets.'
    ),
    source: { name: 'Euronews', url: 'https://www.euronews.com/2026/04/12/back-on-track-madeiras-iconic-hiking-trail-to-reopen-after-two-year-closure' },
  },
  {
    slug: 'toubkal-what-to-know', date: '2026-10-17', photo: U('photo-1609333904079-b781b46190ef'), tags: ['Morocco', 'Guide'],
    title: L('Тубкаль: що треба знати перед сходженням', 'Toubkal: what to know before you go'),
    excerpt: L('Імліль, притулок на 3200 м і вершина 4167 м — без технічних навичок у теплий сезон.', 'Imlil, a 3,200 m refuge and a 4,167 m summit — no technical skills in the warm season.'),
    body: L(
      'Класичний маршрут на Тубкаль стартує в селі Імліль (~1740 м), куди дістаються автомобілем з Марракеша. Стежка йде долиною Мізане повз святилище Сіді-Шамгаруш до притулків на висоті близько 3200 м, де ночують перед сходженням.\n\nУ теплий сезон технічні навички не потрібні — головне витривалість і акліматизація. Взимку вершина перетворюється на справжнє зимове сходження з кішками й льодорубом.\n\nМісцеві гіди розповідають, що після землетрусу 2023 року туристичні маршрути відновили роботу, і підтримка місцевих громад зараз особливо важлива.',
      'The classic Toubkal route starts in the village of Imlil (~1,740 m), reached by road from Marrakech. The path follows the Mizane valley past the Sidi Chamharouch shrine to the refuges at about 3,200 m, where climbers sleep before the summit.\n\nIn the warm season no technical skills are needed — endurance and acclimatisation matter most. In winter it becomes a proper winter climb with crampons and an ice axe.\n\nLocal guides say trekking has resumed since the 2023 earthquake, and supporting local communities matters more than ever.'
    ),
    source: { name: '10Adventures', url: 'https://www.10adventures.com/mount-toubkal-trek-guide/' },
  },
];

export const seed = {
  version: 3,
  settings: {
    heroSlides: [P.hero, P.heroDolomites, U('photo-1545161296-d9c2c241f2ad'), P.heroRidge, U('photo-1611859836043-a9177f500a27'), P.heroBalkans],
    photos: {
      aboutMain: P.liza, aboutB: P.lizaIce, aboutC: P.lizaClimb, cta: P.jump,
      aboutHero: P.hero, aboutPortrait: '/photos/liza-portrait.jpg', contactsHero: P.heroDolomites, galleryHero: P.dolomitesSunset,
      reviewSveta: P.sveta, reviewMikhail: P.mikhail, reviewLeonid: P.leonid,
    },
    contacts: {
      phone: '+380937876969',
      telegram: '', // username without @ (empty = open chat by phone number)
      whatsapp: 'https://wa.me/380937876969',
      email: 'eliz.happytravel@gmail.com',
      instagram: 'https://www.instagram.com/eliz_happytravel/',
      facebook: 'https://www.facebook.com/profile.php?id=100090850322070',
    },
  },
  texts: { uk: {}, en: {} }, // overrides of UI texts, edited in admin
  tours: [...original, ...newTours],
  news,
  gallery,
  stories,
};
