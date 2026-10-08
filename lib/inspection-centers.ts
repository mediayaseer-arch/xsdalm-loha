// المصدر: الهيئة السعودية للمواصفات والمقاييس والجودة — مواقع الفحص الفني (تم استخراجها في 2026-08-11)
// Keep this list as plain data so the booking form can filter branches by region and city.
export interface InspectionCenterRecord {
  id: string;
  region: string;
  regionLabel: string;
  name: string;
  city: string;
  address: string;
  map: string;
  services: string;
}

export const inspectionCenters: InspectionCenterRecord[] = [
  {
    "id": "riyadh-1",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "الرياض - شمال شرق",
    "city": "الرياض",
    "address": "حي المونسية",
    "map": "https://maps.app.goo.gl/aDrVYcGGCkphsRLGA",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "riyadh-2",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "الخرج - جنوب",
    "city": "الخرج",
    "address": "حي الراشدية",
    "map": "https://maps.app.goo.gl/p3p48AsQFqgcVS8t6",
    "services": "المركبات"
  },
  {
    "id": "riyadh-3",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "المجمعة",
    "city": "المجمعة",
    "address": "المنطقة الصناعية",
    "map": "https://maps.app.goo.gl/43Bxd86npBm2mS1P9",
    "services": "المركبات"
  },
  {
    "id": "riyadh-4",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "وادي الدواسر",
    "city": "وادي الدواسر",
    "address": "طريق خميس - السليل السريع",
    "map": "https://maps.app.goo.gl/Qm2ZxVQfzdemuohYA",
    "services": "المركبات"
  },
  {
    "id": "riyadh-5",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "جنوب شرق الرياض",
    "city": "الرياض",
    "address": "حي الفيصلية، الرياض",
    "map": "https://maps.app.goo.gl/f9mgYwYyAjwAxnz88",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-6",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "شمال الرياض",
    "city": "الرياض",
    "address": "القيروان، الرياض",
    "map": "https://maps.app.goo.gl/whuWHQTjRb2MUMsf8",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-7",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "القويعية",
    "city": "القويعية",
    "address": "حي الزهور، القويعية",
    "map": "https://maps.app.goo.gl/Zq6FVafgeFYxfcwq5",
    "services": "المركبات"
  },
  {
    "id": "riyadh-8",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "الرياض جنوب",
    "city": "الرياض",
    "address": "طريق ديراب، عكاظ، الرياض",
    "map": "https://maps.app.goo.gl/G1SEL1mkd9PaqNXa9",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "riyadh-9",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "الرياض - مسار سريع",
    "city": "الرياض",
    "address": "محطة ساسكو - طريق المطار",
    "map": "https://maps.app.goo.gl/tuFcFn7uE8m5gE5AA",
    "services": "المركبات"
  },
  {
    "id": "riyadh-10",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "043 - الدوادمي",
    "city": "الدوادمي",
    "address": "تم التشغيل",
    "map": "https://maps.app.goo.gl/iSeTrQcDKJ8pHG4x9",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-11",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "045 - المزاحمية",
    "city": "المزاحمية",
    "address": "تم التشغيل",
    "map": "https://maps.app.goo.gl/HUjpBseN7u1uisq18",
    "services": "المركبات"
  },
  {
    "id": "riyadh-12",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "049 - سدير",
    "city": "سدير",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/fcRUr6KpKCTkTqZc8",
    "services": "المركبات"
  },
  {
    "id": "riyadh-13",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "052 - الرياض",
    "city": "الرياض",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "riyadh-14",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "084.1 - غرب الرياض",
    "city": "غرب الرياض",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/kCE2NZSL6NrNfrb57",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-15",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "084.2 - غرب الرياض",
    "city": "غرب الرياض",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-16",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "089 - المدينة الصناعية",
    "city": "المدينة الصناعية",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/aAAZVuGB9ZbfRVaL9",
    "services": "المركبات"
  },
  {
    "id": "riyadh-17",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "090 - شقراء",
    "city": "شقراء",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/irVdqritrpp3Vgp79",
    "services": "المركبات"
  },
  {
    "id": "riyadh-18",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "092 - السليل",
    "city": "السليل",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/Prv6cTuRZL1U6qkYA",
    "services": "المركبات"
  },
  {
    "id": "riyadh-19",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "095 - الرياض – مسار سريع",
    "city": "الرياض – مسار سريع",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "riyadh-20",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "099 - وسط الرياض",
    "city": "وسط الرياض",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-21",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "103 - عفيف",
    "city": "عفيف",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/gS4B3PCcmBq9AVXJA",
    "services": "المركبات"
  },
  {
    "id": "riyadh-22",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "110 - الرياض – مسار سريع",
    "city": "الرياض – مسار سريع",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/eh9b2SZmU4Rj4Tvn9",
    "services": "المركبات"
  },
  {
    "id": "riyadh-23",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "069.1 - شرق الرياض",
    "city": "شرق الرياض",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/crwM3oKRTxJFwJBRA",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-24",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "069.2 - شرق الرياض",
    "city": "شرق الرياض",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/q1wVCUeQv7WKPQCn7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-25",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "074 - حوطة بني تميم",
    "city": "حوطة بني تميم",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/zDrRvbugzK9q3nEe8",
    "services": "المركبات"
  },
  {
    "id": "riyadh-26",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "080 - الرياض – مسار سريع",
    "city": "الرياض – مسار سريع",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/GuV5pY7DwKAZxZpn8",
    "services": "المركبات"
  },
  {
    "id": "riyadh-27",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "082 - الرياض",
    "city": "الرياض",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "riyadh-28",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "054 - جنوب الرياض",
    "city": "جنوب الرياض",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/wwJmZYsMGVsDP46K7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-29",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "057 - شمال الخرج",
    "city": "شمال الخرح",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "riyadh-30",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "058 - الأفلاج",
    "city": "الأفلاج",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/3AbbXMi2Ljg3ocFC8",
    "services": "المركبات"
  },
  {
    "id": "riyadh-31",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "065 - الرياض - مسار سريع",
    "city": "الرياض - مسار سريع",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "riyadh-32",
    "region": "riyadh",
    "regionLabel": "الرياض",
    "name": "067 - الرياض",
    "city": "الرياض",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "eastern-1",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "الدمام - غرب",
    "city": "الدمام",
    "address": "حي المنار",
    "map": "https://maps.app.goo.gl/cx82FqBojvRN76X78",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "eastern-2",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "الخفجي",
    "city": "الخفجي",
    "address": "الخرفه،، المنطقة الصناعية الثانية",
    "map": "https://maps.app.goo.gl/pmLPFrxJ5jbJA5f16",
    "services": "المركبات"
  },
  {
    "id": "eastern-3",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "حفر الباطن - جنوب",
    "city": "حفر  الباطن",
    "address": "طريق الملك عبدالعزيز، الاسكان، حفر الباطن",
    "map": "https://maps.app.goo.gl/buVtv5HaQZArPbKq9",
    "services": "المركبات"
  },
  {
    "id": "eastern-4",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "الجبيل",
    "city": "الجبيل",
    "address": "الجبيل 35762",
    "map": "https://maps.app.goo.gl/44V4184LFRmqn2XK7",
    "services": "المركبات"
  },
  {
    "id": "eastern-5",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "الهفوف غرب",
    "city": "الهفوف",
    "address": "الشارع الرابع،، حي الصناعية، المبرز",
    "map": "https://maps.app.goo.gl/9k4Ye32DgRAjToCt7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "eastern-6",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "044 - شرق حفر الباطن",
    "city": "شرق حفر الباطن",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/2zCd2CBL6TAJn3K76",
    "services": "المركبات"
  },
  {
    "id": "eastern-7",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "087 - شرق الأحساء",
    "city": "شرق الأحساء",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "eastern-8",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "097 - الدمام",
    "city": "الدمام",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/p5a1bjHHLFYcwtTu6",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "eastern-9",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "101 - الجبيل",
    "city": "الجبيل",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/vHCucNbX6BoEBBF19",
    "services": "المركبات"
  },
  {
    "id": "eastern-10",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "109 - الخبر",
    "city": "الخبر",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "eastern-11",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "111 - الدمام – مسار سريع",
    "city": "الدمام – مسار سريع",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/2wtMpsi2Hr6NJy8AA",
    "services": "المركبات"
  },
  {
    "id": "eastern-12",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "112 - الجبيل",
    "city": "الجبيل",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/WWUtj3D4FJC5FwL36",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "eastern-13",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "071 - الدمام",
    "city": "الدمام",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/LJqnWCD2rfxRA3328",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "eastern-14",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "081 - الخبر – مسار سريع",
    "city": "الخبر – مسار سريع",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/RNp84do3dRcpahyQ9",
    "services": "المركبات"
  },
  {
    "id": "eastern-15",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "056 - بقيق",
    "city": "بقيق",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "eastern-16",
    "region": "eastern",
    "regionLabel": "الشرقية",
    "name": "060 - قرية العليا",
    "city": "قرية العليا",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "madinah-1",
    "region": "madinah",
    "regionLabel": "المدينة المنورة",
    "name": "المدينة المنورة - شمال",
    "city": "المدينة  المنورة",
    "address": "طريق المدينة - تبوك السريع",
    "map": "https://maps.app.goo.gl/snpjEurco6KytTN59",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "madinah-2",
    "region": "madinah",
    "regionLabel": "المدينة المنورة",
    "name": "ينبع",
    "city": "ينبع",
    "address": "لمبارك، ينبع",
    "map": "https://maps.app.goo.gl/uKe5riAvyRDGD7S97",
    "services": "المركبات"
  },
  {
    "id": "madinah-3",
    "region": "madinah",
    "regionLabel": "المدينة المنورة",
    "name": "048 - العلا",
    "city": "العلا",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "madinah-4",
    "region": "madinah",
    "regionLabel": "المدينة المنورة",
    "name": "113 - ينبع",
    "city": "ينبع",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/sf5aYMWGeYm2mQ5r9",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "madinah-5",
    "region": "madinah",
    "regionLabel": "المدينة المنورة",
    "name": "070 - شرق المدينة",
    "city": "شرق المدينة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/XrE3XvCwLYo3B4Yr5",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "madinah-6",
    "region": "madinah",
    "regionLabel": "المدينة المنورة",
    "name": "079 - بدر",
    "city": "بدر",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/BvTsbVG6yXR9xHSk6",
    "services": "المركبات"
  },
  {
    "id": "tabuk-1",
    "region": "tabuk",
    "regionLabel": "تبوك",
    "name": "تبوك - شرق",
    "city": "تبوك",
    "address": "المنطقة الزراعية",
    "map": "https://maps.app.goo.gl/gfW9EnatPbuAzueQ6",
    "services": "المركبات"
  },
  {
    "id": "tabuk-2",
    "region": "tabuk",
    "regionLabel": "تبوك",
    "name": "038 - ضباء",
    "city": "ضباء",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "tabuk-3",
    "region": "tabuk",
    "regionLabel": "تبوك",
    "name": "086 - تبوك",
    "city": "تبوك",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/CQfLW1vTpZfTDgni9",
    "services": "المركبات"
  },
  {
    "id": "tabuk-4",
    "region": "tabuk",
    "regionLabel": "تبوك",
    "name": "062 - أملج",
    "city": "أملج",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "hail-1",
    "region": "hail",
    "regionLabel": "حائل",
    "name": "حائل",
    "city": "حائل",
    "address": "طريق المدينة - منطقة الودي",
    "map": "https://maps.app.goo.gl/Hjhm573YZq5kyDie9",
    "services": "المركبات"
  },
  {
    "id": "hail-2",
    "region": "hail",
    "regionLabel": "حائل",
    "name": "102 - حائل",
    "city": "حائل",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/y8tzWK519mRGLpnr6",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "hail-3",
    "region": "hail",
    "regionLabel": "حائل",
    "name": "105 - بقعاء",
    "city": "بقعاء",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/EwoPhhChXYSzW6w57",
    "services": "المركبات"
  },
  {
    "id": "makkah-1",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "الطائف - شمال",
    "city": "الطائف",
    "address": "حي القديرة",
    "map": "https://maps.app.goo.gl/QQQPJMGsrAqstQym7",
    "services": "المركبات"
  },
  {
    "id": "makkah-2",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "الخرمة",
    "city": "الخرمة",
    "address": "حي المحمدية",
    "map": "https://maps.app.goo.gl/wUZheyD2vuyaRaA79",
    "services": "المركبات"
  },
  {
    "id": "makkah-3",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "جدة - جنوب",
    "city": "جدة",
    "address": "الأمير عبدالمجيد، جدة",
    "map": "https://maps.app.goo.gl/wHeidMYDFmJKmf6V9",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "makkah-4",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "جدة - شمال",
    "city": "جدة",
    "address": "شارع عبدالجليل ياسين، حي المروة،، جدة",
    "map": "https://maps.app.goo.gl/GPv3zrSyXaMe2n1LA",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "makkah-5",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "عسفان",
    "city": "جدة",
    "address": "طريق عسفان، جدة",
    "map": "https://maps.app.goo.gl/sc4kAh9ie31x8Ydz7",
    "services": "المركبات"
  },
  {
    "id": "makkah-6",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "مكة المكرمة شمال",
    "city": "مكة المكرمة",
    "address": "العمرة الجديدة، مكة",
    "map": "https://maps.app.goo.gl/ThNFgVXJ3mTxio6Z6",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "makkah-7",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "129 - رابغ",
    "city": "رابغ",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "makkah-8",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "041 - جنوب مكة المكرمة",
    "city": "جنوب مكة المكرمة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/ZXNw1v9qfCtquWAZ8",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "makkah-9",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "042 - شرق الطائف",
    "city": "شرق الطائف",
    "address": "تم التشغيل",
    "map": "https://maps.app.goo.gl/WUkFd9W5WWWFmQZJ9",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "makkah-10",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "051 - الطائف – مسار سريع",
    "city": "الطائف – مسار سريع",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/CHAtKJ5o49vJHVv57",
    "services": "المركبات"
  },
  {
    "id": "makkah-11",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "085 - وسط جدة",
    "city": "وسط جدة",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "makkah-12",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "085 - وسط جدة",
    "city": "وسط جدة",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "makkah-13",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "088 - القنفذة",
    "city": "القنفذة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/L2bfTf5PXRwwrNKMA",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "makkah-14",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "096 - جدة – مسار سريع",
    "city": "جدة – مسار سريع",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "makkah-15",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "100 - شمال جدة",
    "city": "شمال جدة",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "makkah-16",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "104 - ثول",
    "city": "ثول",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "makkah-17",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "107 - تربة",
    "city": "تربة",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "makkah-18",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "072 - الليث",
    "city": "الليث",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/wL2wwPTUVA8SgTtW6",
    "services": "المركبات"
  },
  {
    "id": "makkah-19",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "078 - رنية",
    "city": "رنية",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/VXxz6HdUmgdd2rV7A",
    "services": "المركبات"
  },
  {
    "id": "makkah-20",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "066 - مكة - مسار سريع",
    "city": "مكة - مسار سريع",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "makkah-21",
    "region": "makkah",
    "regionLabel": "مكة المكرمة",
    "name": "068 - جدة",
    "city": "جدة",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "qassim-1",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "الرس",
    "city": "الرس",
    "address": "طريق الملك فهد",
    "map": "https://maps.app.goo.gl/z8stHvugHDWEG3yG6",
    "services": "المركبات"
  },
  {
    "id": "qassim-2",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "عنيزة",
    "city": "القصيم",
    "address": "حي، ابن العريبي، الجلده",
    "map": "https://maps.app.goo.gl/aMu9zAqwAibCi7xeA",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "qassim-3",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "053 - القصيم",
    "city": "القصيم",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/HaTensfY4vvPVKgu9",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "qassim-4",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "093 - النبهانية",
    "city": "النبهانية",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/vw57XXCrZsPVsFrHA",
    "services": "المركبات"
  },
  {
    "id": "qassim-5",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "094 - المذنب",
    "city": "المذنب",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/JkoZW8hRcRpT4Hc48",
    "services": "المركبات"
  },
  {
    "id": "qassim-6",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "073 - شمال بريدة",
    "city": "شمال بريدة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/kV4aYmvJAXEAhMG7A",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "qassim-7",
    "region": "qassim",
    "regionLabel": "القصيم",
    "name": "076 - البكيرية",
    "city": "البكيرية",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/Nvt8mh8MnTvQbkFw9",
    "services": "المركبات"
  },
  {
    "id": "asir-1",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "محايل عسير",
    "city": "محايل عسير",
    "address": "الخالدية، محايل عسير",
    "map": "https://maps.app.goo.gl/TcAQpTpSHZCJzkrg9",
    "services": "المركبات"
  },
  {
    "id": "asir-2",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "بيشة",
    "city": "بيشة",
    "address": "1423، 7372، بيشة 67912",
    "map": "https://maps.app.goo.gl/AaS81cRs4qoMxsku6",
    "services": "المركبات"
  },
  {
    "id": "asir-3",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "أبها",
    "city": "أبها",
    "address": "المحالة، أبها",
    "map": "https://maps.app.goo.gl/s2FkhAj955cPRjEi9",
    "services": "المركبات - القاطرة والمقطورة ونصفها"
  },
  {
    "id": "asir-4",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "026 - سراة عبيدة",
    "city": "سراة عبيدة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/HiZAAbxbY2i95Ktd7",
    "services": "المركبات"
  },
  {
    "id": "asir-5",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "047 - بلقرن",
    "city": "بلقرن",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "asir-6",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "106 - ظهران الجنوب",
    "city": "ظهران الجنوب",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/PCtJU8ZTwhZME7pz7",
    "services": "المركبات"
  },
  {
    "id": "asir-7",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "108 - تثليث",
    "city": "تثليث",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/k5yx5mTt9zQ6wS317",
    "services": "المركبات"
  },
  {
    "id": "asir-8",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "077 - الدرب",
    "city": "الدرب",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "asir-9",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "083 - خميس مشيط",
    "city": "خميس مشيط",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/h7gmk4kLy4uga34X6",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "asir-10",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "055 - شمال خميس مشيط",
    "city": "شمال خميس مشيط",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/4c4sVhkpwU1HYLP99",
    "services": "المركبات"
  },
  {
    "id": "asir-11",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "061 - المجاردة",
    "city": "المجاردة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/ZDaAri6cvm1YRids7",
    "services": "المركبات"
  },
  {
    "id": "asir-12",
    "region": "asir",
    "regionLabel": "عسير",
    "name": "063 - النماص",
    "city": "النماص",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "najran-1",
    "region": "najran",
    "regionLabel": "نجران",
    "name": "نجران",
    "city": "نجران",
    "address": "طريق الملك عبدالعزيز، نجران",
    "map": "https://maps.app.goo.gl/uc8pTTamQJKGzHb56",
    "services": "المركبات"
  },
  {
    "id": "najran-2",
    "region": "najran",
    "regionLabel": "نجران",
    "name": "091 - الحصينية",
    "city": "الحصينية",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "najran-3",
    "region": "najran",
    "regionLabel": "نجران",
    "name": "075 - شرورة",
    "city": "شرورة",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/Ssr5by5zH3uHhfjd6",
    "services": "المركبات"
  },
  {
    "id": "bahah-1",
    "region": "bahah",
    "regionLabel": "الباحة",
    "name": "الباحة",
    "city": "الباحة",
    "address": "طريق الملك عبدالعزيز",
    "map": "https://maps.app.goo.gl/qim6x4Q5Lrf7bPV89",
    "services": "المركبات"
  },
  {
    "id": "jazan-1",
    "region": "jazan",
    "regionLabel": "جازان",
    "name": "جازان",
    "city": "جازان",
    "address": "الكرامة، العسيلة",
    "map": "https://maps.app.goo.gl/hTv5fUnWHYCxqY8T7",
    "services": "المركبات"
  },
  {
    "id": "jazan-2",
    "region": "jazan",
    "regionLabel": "جازان",
    "name": "027 - بيش",
    "city": "بيش",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/7tkkBsMb7g1iQos88",
    "services": "المركبات"
  },
  {
    "id": "jazan-3",
    "region": "jazan",
    "regionLabel": "جازان",
    "name": "098 - جازان",
    "city": "جازان",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/pQ6T53CfpQicbnTq5",
    "services": "المركبات - القاطرة والمقطورة ونصفها - مركبات تحمل مواد خطرة"
  },
  {
    "id": "jazan-4",
    "region": "jazan",
    "regionLabel": "جازان",
    "name": "064 - صامطة",
    "city": "صامطة",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "jouf-1",
    "region": "jouf",
    "regionLabel": "الجوف",
    "name": "القريات",
    "city": "القريات",
    "address": "WCJA6222، 6222 تركي بن أحمد السديري،، حي الفرسان، القريات",
    "map": "https://maps.app.goo.gl/9sS55GYzGLj2MBuJ8",
    "services": "المركبات"
  },
  {
    "id": "jouf-2",
    "region": "jouf",
    "regionLabel": "الجوف",
    "name": "سكاكا",
    "city": "سكاكا",
    "address": "سلمان الفارسي، محطة الفحص الدوري للمركبات، سكاكا",
    "map": "https://maps.app.goo.gl/LqGdAogpsEZvkMQ36",
    "services": "المركبات"
  },
  {
    "id": "jouf-3",
    "region": "jouf",
    "regionLabel": "الجوف",
    "name": "059 - طبرجل",
    "city": "طبرجل",
    "address": "جاري البحث عن موقع",
    "map": "https://maps.app.goo.gl/zDBP9LoeLwR6ZXSZ7",
    "services": "المركبات"
  },
  {
    "id": "northern-1",
    "region": "northern",
    "regionLabel": "الحدود الشمالية",
    "name": "عرعر",
    "city": "عرعر",
    "address": "معارض السيارات",
    "map": "https://maps.app.goo.gl/AvbWrwKinW7yLKP26",
    "services": "المركبات"
  },
  {
    "id": "northern-2",
    "region": "northern",
    "regionLabel": "الحدود الشمالية",
    "name": "039 - رفحاء",
    "city": "رفحاء",
    "address": "قيد الانشاء",
    "map": "https://maps.app.goo.gl/aLCsT3wt9ETgiXb5A",
    "services": "المركبات"
  }
];
