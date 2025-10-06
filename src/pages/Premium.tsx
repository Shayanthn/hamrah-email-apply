import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp, 
  MessageSquare,
  Users,
  Mail,
  BarChart3,
  Check,
  X,
  Send,
  Star
} from 'lucide-react';

type PlanTier = 'silver' | 'gold' | 'diamond';

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  tier: PlanTier;
  name: string;
  price: number;
  originalPrice?: number;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  tagline: string;
  features: PlanFeature[];
  popular?: boolean;
}

const Premium: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [activationCode, setActivationCode] = useState('');
  const [showActivation, setShowActivation] = useState(false);
  const [activationStatus, setActivationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const plans: PricingPlan[] = [
    {
      tier: 'silver',
      name: 'نقره‌ای',
      price: 198000,
      originalPrice: 290000,
      color: 'text-gray-600',
      gradient: 'from-gray-400 to-gray-600',
      icon: <Shield className="w-8 h-8" />,
      tagline: 'شروع هوشمند با AI',
      features: [
        { text: 'تحلیل هوشمند پروفایل با AI', included: true, highlight: true },
        { text: 'پیشنهاد 10 استاد مرتبط با تحقیقات شما', included: true },
        { text: 'تولید خودکار متن ایمیل معرفی', included: true },
        { text: 'بررسی املای فارسی و انگلیسی', included: true },
        { text: 'آنالیز احتمال پاسخ استاد', included: true },
        { text: 'پشتیبانی ایمیلی 48 ساعته', included: true },
        { text: 'به‌روزرسانی‌های رایگان', included: true },
        { text: 'پیشنهاد نامحدود استاد', included: false },
        { text: 'تحلیل عمیق رزومه', included: false },
        { text: 'مشاوره تلفنی اختصاصی', included: false },
      ],
    },
    {
      tier: 'gold',
      name: 'طلایی',
      price: 398000,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-orange-500',
      icon: <Crown className="w-8 h-8" />,
      tagline: 'انتخاب محبوب دانشجویان',
      popular: true,
      features: [
        { text: 'همه امکانات نقره‌ای', included: true },
        { text: 'پیشنهاد نامحدود استاد مرتبط', included: true, highlight: true },
        { text: 'تحلیل عمیق رزومه و SOP', included: true, highlight: true },
        { text: 'تولید متن شخصی‌سازی شده برای هر استاد', included: true },
        { text: 'پیش‌بینی احتمال قبولی دانشگاه', included: true },
        { text: 'مقایسه پروفایل با سایر متقاضیان', included: true },
        { text: 'راهنمای گام‌به‌گام SOP نویسی', included: true },
        { text: 'پشتیبانی ایمیلی 24 ساعته', included: true },
        { text: 'یک جلسه مشاوره آنلاین 30 دقیقه‌ای', included: true },
        { text: 'مشاوره تلفنی نامحدود', included: false },
      ],
    },
    {
      tier: 'diamond',
      name: 'الماسی',
      price: 598000,
      color: 'text-cyan-600',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      icon: <Sparkles className="w-8 h-8" />,
      tagline: 'تجربه VIP و منحصربه‌فرد',
      features: [
        { text: 'همه امکانات طلایی', included: true },
        { text: 'مشاور اختصاصی AI برای شما', included: true, highlight: true },
        { text: 'بررسی و ویرایش نامحدود متون', included: true, highlight: true },
        { text: 'مشاوره تلفنی نامحدود', included: true, highlight: true },
        { text: 'تحلیل رقبا و بازار هدف', included: true },
        { text: 'شبیه‌سازی مصاحبه با AI', included: true },
        { text: 'آموزش استراتژی‌های پیشرفته ایمیل', included: true },
        { text: 'سه جلسه مشاوره آنلاین 1 ساعته', included: true },
        { text: 'پشتیبانی VIP 24/7', included: true },
        { text: 'دسترسی زودهنگام به ویژگی‌های جدید', included: true },
      ],
    },
  ];

  const handleActivate = () => {
    if (!activationCode.trim()) {
      setActivationStatus('error');
      return;
    }

    // TODO: Implement actual activation logic
    // For now, just simulate validation
    if (activationCode.length >= 10) {
      localStorage.setItem('premium_tier', selectedPlan || 'silver');
      localStorage.setItem('premium_activated', 'true');
      localStorage.setItem('premium_code', activationCode);
      setActivationStatus('success');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setActivationStatus('error');
    }
  };

  const handleRequestPremium = () => {
    if (!email.trim() || !selectedPlan) {
      alert('لطفاً ایمیل خود را وارد کنید.');
      return;
    }

    const plan = plans.find(p => p.tier === selectedPlan);
    const subject = `درخواست نسخه پریمیوم ${plan?.name} - همراه ایمیل اپلای`;
    const body = `
سلام،

من می‌خواهم نسخه ${plan?.name} (${plan?.price.toLocaleString('fa-IR')} تومان) برنامه همراه ایمیل اپلای را خریداری کنم.

اطلاعات من:
ایمیل: ${email}
پیام: ${message || 'ندارد'}

لطفاً کد فعال‌سازی را برای من ارسال کنید.

با تشکر
    `.trim();

    // Create mailto links for all three emails
    const emails = [
      'admin@shayantaherkhani.ir',
      'info@stickerino.ir',
      'shayanthn78@gmail.com'
    ];

    // Open first email client
    window.open(`mailto:${emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    // Show success message
    alert(`درخواست شما آماده ارسال است!\n\nدر صورتی که ایمیل باز نشد، می‌توانید به یکی از آدرس‌های زیر ایمیل بزنید:\n\n${emails.join('\n')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 font-persian">
            نسخه پریمیوم با
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"> هوش مصنوعی</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-persian leading-relaxed">
            با قدرت هوش مصنوعی، فرآیند اپلای خود را ۱۰ برابر سریع‌تر و حرفه‌ای‌تر کنید! 🚀
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400 font-persian">
                تخفیف ویژه فعال!
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 font-persian">
                +۱۲۰۰ دانشجو استفاده می‌کنند
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-4 ring-yellow-400 dark:ring-yellow-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-500 py-2 text-center">
                  <span className="text-white font-bold text-sm font-persian flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    محبوب‌ترین انتخاب
                    <Star className="w-4 h-4" />
                  </span>
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl mb-4 text-white shadow-lg`}>
                    {plan.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${plan.color} dark:text-white mb-2 font-persian`}>
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-persian">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  {plan.originalPrice && (
                    <div className="text-lg text-gray-400 line-through mb-1 font-persian">
                      {plan.originalPrice.toLocaleString('fa-IR')} تومان
                    </div>
                  )}
                  <div className="text-4xl font-black text-gray-900 dark:text-white font-persian">
                    {plan.price.toLocaleString('fa-IR')}
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400 mr-2">
                      تومان
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className="inline-block mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-bold font-persian">
                      {Math.round((1 - plan.price / plan.originalPrice) * 100)}% تخفیف
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 ${
                        feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'
                      } ${feature.highlight ? 'font-semibold' : ''}`}
                    >
                      {feature.included ? (
                        <Check className={`w-5 h-5 ${feature.highlight ? 'text-green-500' : 'text-green-400'} flex-shrink-0 mt-0.5`} />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm font-persian text-right flex-1">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    setSelectedPlan(plan.tier);
                    setShowActivation(true);
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${plan.gradient} hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-persian`}
                >
                  دریافت {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Features Showcase */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-12 mb-16 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-persian">
              قدرت هوش مصنوعی در خدمت شما 🤖
            </h2>
            <p className="text-xl opacity-90 font-persian">
              با استفاده از آخرین مدل‌های AI، تجربه‌ای بی‌نظیر را تجربه کنید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <MessageSquare className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2 font-persian">تولید متن هوشمند</h3>
              <p className="opacity-90 text-sm font-persian leading-relaxed">
                AI متن ایمیل معرفی حرفه‌ای و شخصی‌سازی شده برای هر استاد می‌نویسد
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2 font-persian">تحلیل پیشرفته</h3>
              <p className="opacity-90 text-sm font-persian leading-relaxed">
                احتمال قبولی، نقاط قوت و ضعف پروفایل شما را با دقت تحلیل می‌کند
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2 font-persian">پیشنهاد هوشمند استاد</h3>
              <p className="opacity-90 text-sm font-persian leading-relaxed">
                بهترین اساتید متناسب با تحقیقات و علاقه‌مندی‌های شما را پیدا می‌کند
              </p>
            </div>
          </div>
        </div>

        {/* Activation Modal */}
        {showActivation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${
                  plans.find(p => p.tier === selectedPlan)?.gradient
                } rounded-xl mb-4 text-white`}>
                  {plans.find(p => p.tier === selectedPlan)?.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-persian">
                  دریافت نسخه {plans.find(p => p.tier === selectedPlan)?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-persian">
                  لطفاً اطلاعات خود را وارد کنید
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                    ایمیل شما
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                    پیام (اختیاری)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="درخواست یا سوال خود را بنویسید..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-persian text-right"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-persian leading-relaxed">
                    <strong>نحوه دریافت:</strong> با کلیک روی دکمه زیر، ایمیلی به آدرس‌های ما ارسال می‌شود. پس از پرداخت، کد فعال‌سازی برای شما ایمیل می‌شود.
                  </p>
                  <div className="mt-3 text-xs text-blue-600 dark:text-blue-300 font-persian space-y-1">
                    <div>📧 admin@shayantaherkhani.ir</div>
                    <div>📧 info@stickerino.ir</div>
                    <div>📧 shayanthn78@gmail.com</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowActivation(false);
                      setSelectedPlan(null);
                      setEmail('');
                      setMessage('');
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-persian"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleRequestPremium}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-persian flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    ارسال درخواست
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-persian">
                    قبلاً کد فعال‌سازی دریافت کرده‌اید؟
                  </p>
                  <button
                    onClick={() => {
                      const code = prompt('کد فعال‌سازی خود را وارد کنید:');
                      if (code) {
                        setActivationCode(code);
                        handleActivate();
                      }
                    }}
                    className="w-full mt-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-persian"
                  >
                    فعال‌سازی با کد
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center font-persian">
            سوالات متداول 🤔
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-persian">
                چطور کد فعال‌سازی دریافت کنم؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-persian leading-relaxed">
                بعد از انتخاب پلن مورد نظر و ارسال ایمیل، ما جزئیات پرداخت را برای شما ارسال می‌کنیم. پس از پرداخت، کد فعال‌سازی ظرف 24 ساعت به ایمیل شما ارسال می‌شود.
              </p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-persian">
                آیا می‌توانم پلن خود را ارتقا دهم؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-persian leading-relaxed">
                بله! در هر زمان می‌توانید با پرداخت تفاضل قیمت، به پلن بالاتر ارتقا دهید.
              </p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-persian">
                چند دستگاه می‌توانم استفاده کنم؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-persian leading-relaxed">
                هر لایسنس برای یک کاربر است و می‌توانید روی تمام دستگاه‌های خود (کامپیوتر، لپ‌تاپ) نصب کنید.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-persian">
                آیا پشتیبانی دارید؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-persian leading-relaxed">
                بله! بسته به پلن شما، پشتیبانی ایمیلی، آنلاین و تلفنی در اختیار دارید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
