import { Card } from "@/components/ui/card";
import {
  Menu,
  FileText,
  Search,
  Clock,
  Car,
  Eye,
  Wrench,
  Wind,
  Smartphone,
  Calendar,
} from "lucide-react";
import Image from "@/components/app-image";
import { Link } from "@/components/app-link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" dir="rtl" lang="ar">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <button
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <Image
              src="/next.svg"
              alt="مركز سلامة المركبات"
              width={180}
              height={37}
            />
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/bg.png"
            alt="المنصة الموحدة لمواعيد الفحص الفني الدوري للمركبات"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl mx-auto text-center md:text-right space-y-5">
            <p className="text-[#1a7a3a] font-bold text-sm md:text-base tracking-wide">
              أحد منتجات مركز سلامة المركبات
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
              المنصة الموحدة لمواعيد{" "}
              <span className="text-[#1a7a3a]">الفحص الفني الدوري</span>{" "}
              للمركبات
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              تتيح المنصة حجز وإدارة مواعيد الفحص الفني الدوري للمركبات لدى جميع
              الجهات المرخصة من المواصفات السعودية لتقديم الخدمة
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
              <Link
                href="/application"
                className="w-full sm:w-auto bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] text-white px-8 py-3.5 rounded-lg text-base font-bold transition-all shadow-lg shadow-[#1a7a3a]/25 text-center inline-block"
              >
                حجز موعد
              </Link>
              <Link
                href="/application?service=modify"
                className="w-full sm:w-auto border-2 border-[#1a7a3a]/30 hover:border-[#1a7a3a]/60 hover:bg-[#1a7a3a]/5 text-[#1a7a3a] px-8 py-3.5 rounded-lg text-base font-bold transition-all text-center inline-block"
              >
                تعديل موعد الحجز
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="below-fold bg-white py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              ماذا يشمل فحص المركبة
            </h2>
            <div className="w-16 h-1 bg-gradient-to-l from-[#1a7a3a] to-[#2ecc71] rounded-full mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Eye,
                label: "فحص خارجي",
                desc: "فحص الهيكل والأضواء والمرايا",
                gradient: "from-[#1a7a3a]/10 to-[#2ecc71]/10",
              },
              {
                icon: Wrench,
                label: "فحص تحتي",
                desc: "فحص الشاسيه والعفشة",
                gradient: "from-[#0d5c2a]/10 to-[#1a7a3a]/10",
              },
              {
                icon: Car,
                label: "فحص هيكلية المركبة",
                desc: "التأكد من سلامة الهيكل",
                gradient: "from-[#2ecc71]/10 to-[#27ae60]/10",
              },
              {
                icon: Wind,
                label: "فحوصات الانبعاثات",
                desc: "قياس نسبة العوادم",
                gradient: "from-[#27ae60]/10 to-[#1a7a3a]/10",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center border border-[#1a7a3a]/15 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="w-8 h-8 text-[#1a7a3a]" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="below-fold bg-gradient-to-b from-gray-50 to-white py-14">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              خدمات منصة الفحص الفني الدوري
            </h2>
            <div className="w-16 h-1 bg-gradient-to-l from-[#1a7a3a] to-[#2ecc71] rounded-full mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "حجز موعد الفحص",
                desc: "احجز موعد الفحص الفني بكل سهولة ويسر من خلال منصتنا الإلكترونية دون عناء الانتظار.",
              },
              {
                icon: FileText,
                title: "تفصيل مواعيد الفحص",
                desc: "تتبع وإدارة جميع مواعيدك وملفاتك والفحوصات السابقة من مكان واحد عبر لوحة التحكم.",
              },
              {
                icon: Search,
                title: "إلغاء موعد الفحص",
                desc: "يمكنك إلغاء أو تعديل الموعد إلى موعد آخر من خلال حسابك على منصة الفحص الفني.",
              },
            ].map((service) => (
              <Card
                key={service.title}
                className="p-6 border border-gray-100 hover:border-[#1a7a3a]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a7a3a]/5 bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1a7a3a]/10 to-[#2ecc71]/10 rounded-xl flex items-center justify-center mb-4 border border-[#1a7a3a]/15 group-hover:from-[#1a7a3a]/20 group-hover:to-[#2ecc71]/20 transition-all">
                    <service.icon className="w-6 h-6 text-[#1a7a3a]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <Link
              href="/application"
              className="block w-full bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-[#1a7a3a]/20 text-center"
            >
              احجز الآن
            </Link>
          </div>
        </div>
      </section>

      <section className="below-fold bg-white py-14">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              خطوات ما قبل الفحص الفني الدوري
            </h2>
            <div className="w-16 h-1 bg-gradient-to-l from-[#1a7a3a] to-[#2ecc71] rounded-full mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border border-gray-100 hover:shadow-lg hover:shadow-[#1a7a3a]/5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a7a3a] to-[#0d5c2a] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#1a7a3a]/30 mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  حجز موعد الفحص
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  يمكنك حجز موعد الفحص من خلال المنصة الإلكترونية الخاصة بالشركات والمنشآت للفحص الفني الدوري.
                </p>
              </div>
              <Link
                href="/application"
                className="block w-full bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] text-white py-3 rounded-lg text-sm font-bold transition-all text-center shadow-md shadow-[#1a7a3a]/20"
              >
                احجز الآن
              </Link>
            </Card>

            <Card className="p-6 bg-white border border-gray-100 hover:shadow-lg hover:shadow-[#1a7a3a]/5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a7a3a] to-[#0d5c2a] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#1a7a3a]/30 mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  الفحص السابق
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  تأكد من أن مركبتك تفي بكافة معايير السلامة وجميع الأوراق المطلوبة مكتملة قبل الحضور.
                </p>
              </div>
              <span className="block w-full border-2 border-[#1a7a3a] text-[#1a7a3a] hover:bg-[#1a7a3a]/5 py-3 rounded-lg text-sm font-bold transition-all bg-transparent text-center cursor-pointer">
                تفاصيل أكثر
              </span>
            </Card>

            <Card className="p-6 bg-white border border-gray-100 hover:shadow-lg hover:shadow-[#1a7a3a]/5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a7a3a] to-[#0d5c2a] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#1a7a3a]/30 mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  استلام الفحص الفني
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  بعد اجتياز الفحص، يمكنك استلام شهادة الفحص الفني إلكترونياً أو من المحطة مباشرة.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="below-fold bg-gradient-to-b from-[#f0faf4] to-[#e8f5ec] py-14">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-600">الجهات المرخصة</h2>
            <div className="flex justify-center items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md border border-[#1a7a3a]/10">
                <Image
                  src="/adcs.jpg"
                  alt="ADCS"
                  width={50}
                  height={50}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="below-fold bg-gradient-to-br from-[#1a7a3a] via-[#156b32] to-[#0d5c2a] py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mb-24" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2ecc71]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-right space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                احجز موعد الفحص من جوالك
              </h2>
              <p className="text-[#a8e6c0] text-sm leading-relaxed">
                حمّل تطبيقنا واحجز موعد الفحص الفني الدوري في أي وقت ومن أي مكان
                بسهولة تامة
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border border-white/20 hover:shadow-lg"
                >
                  <Smartphone className="w-5 h-5" />
                  Google Play
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border border-white/20 hover:shadow-lg"
                >
                  <Smartphone className="w-5 h-5" />
                  App Store
                </a>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="w-48 h-80 bg-white/10 rounded-[2.5rem] border-4 border-white/20 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-black/20">
                <div className="text-center space-y-3 px-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/80 text-xs font-medium">
                    احجز موعدك الآن
                  </p>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-white/20 rounded-full w-full" />
                    <div className="h-2 bg-white/15 rounded-full w-3/4 mx-auto" />
                    <div className="h-2 bg-white/10 rounded-full w-1/2 mx-auto" />
                  </div>
                  <div className="h-8 bg-white/20 rounded-lg w-full mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="below-fold bg-gray-50 border-t border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
          <p className="text-sm text-gray-600 font-medium">
            تابعنا على وسائل التواصل الاجتماعي
          </p>
          <div className="flex justify-center gap-3">
            {[
              { label: "X", href: "#" },
              { label: "YT", href: "#" },
              { label: "IG", href: "#" },
              { label: "LI", href: "#" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#1a7a3a] hover:to-[#0d5c2a] hover:text-white text-gray-500 transition-all duration-300 text-xs font-bold hover:shadow-md hover:shadow-[#1a7a3a]/20"
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 pt-2">
            <Image
              src="/next.svg"
              alt="هيئة المواصفات"
              width={90}
              height={40}
              className="opacity-70 rounded"
            />
          </div>

          <p className="text-xs text-gray-400 pt-2">
            © 2025 منصة سلامة المركبات — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
