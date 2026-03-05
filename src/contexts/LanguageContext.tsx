
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'yo';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const TRANSLATIONS: Record<Language, any> = {
  en: {
    common: {
      login: "Login",
      signup: "Sign Up",
      joinNow: "Join Now",
      getStarted: "Get Started",
      merchantLogin: "Merchant Login",
      back: "Back",
      about: "About",
      support: "Support",
      privacy: "Privacy",
      admin: "Admin",
      logout: "Sign Out",
      home: "Home",
      dashboard: "Dashboard"
    },
    landing: {
      badge: "Logistics for Growth",
      heroTitle1: "Fast. Professional.",
      heroTitle2: "Business Ready.",
      heroDesc: "The specialized delivery partner for fashion brands and small businesses. We handle your products with the care they deserve.",
      servicesTitle: "Our Services",
      swiftDispatch: "Swift Dispatch",
      swiftDispatchDesc: "Same-day localized delivery for high-priority drops. We move as fast as the industry.",
      productIntegrity: "Product Integrity",
      productIntegrityDesc: "Specialized handling for delicate items and bespoke orders. Zero damage, 100% safety.",
      realTimeGrid: "Real-time Grid",
      realTimeGridDesc: "Full transparency with GPS tracking for both the merchant and the end customer.",
      faqTitle: "Common Questions",
      faqDesc: "Everything you need to know about ELN Express.",
      ctaTitle: "Ready to Scale your Business?",
      ctaDesc: "Join the network of merchants and riders redefining the order-to-doorstep experience.",
      joinMerchant: "Join as Merchant",
      becomeRider: "Become a Rider",
      faqs: [
        {
          question: "How fast is delivery?",
          answer: "We offer same-day localized delivery for high-priority drops within Lagos. Most orders are delivered within 4-6 hours of pickup."
        },
        {
          question: "What areas do you cover?",
          answer: "Currently, we operate extensively within Lagos, covering major hubs like Victoria Island, Ikoyi, Lekki, and Ikeja. We are expanding to other major cities soon."
        },
        {
          question: "How do I track my order?",
          answer: "Merchants can track all active deliveries in real-time via the Dispatch Hub on their dashboard. Customers also receive a tracking link via SMS once the rider is in transit."
        },
        {
          question: "Is my merchandise insured?",
          answer: "Yes, we prioritize product integrity. All high-value fashion items handled by our verified rider network are covered by our basic transit insurance."
        },
        {
          question: "How do I become a rider?",
          answer: "Simply sign up as a rider, upload your government ID and bike registration, and wait for our compliance team to verify your profile. Once verified, you can start accepting jobs."
        }
      ]
    },
    about: {
      title: "Moving Fashion.",
      vision: "ELN Express was born out of a simple observation: the modern business world moves at the speed of light, but logistics was stuck in the past.",
      tailoredTitle: "Tailored Logistics",
      tailoredDesc: "We don't just deliver packages; we deliver trust. Our riders are trained in the specific handling requirements of delicate products.",
      pulseTitle: "The Business Pulse",
      pulseDesc: "By connecting growing merchants with a dedicated fleet of professional riders, we've created an ecosystem that thrives on reliability.",
      valuesTitle: "Our Core Values",
      precision: "Precision",
      precisionDesc: "Every detail matters, from the fold of a garment to the timing of a drop.",
      care: "Care",
      careDesc: "We treat every package as if it were our own creation.",
      integrity: "Integrity",
      integrityDesc: "Honesty and transparency are the bedrock of our network.",
      rated: "#1 Rated",
      ratedDesc: "In Professional Care",
      partners: "500+",
      partnersDesc: "Brand Partners",
      grid: "24/7",
      gridDesc: "Real-time Grid",
      ctaTitle: "Join the Revolution",
      ctaDesc: "Whether you are a rising entrepreneur or a veteran rider, there's a place for you in the ELN network."
    },
    support: {
      title: "How can we help?",
      desc: "Find answers to common questions or reach out to our concierge team.",
      liveChat: "Live Chat",
      liveChatDesc: "Average response: 2 mins",
      email: "Email Support",
      emailDesc: "support@elnexpress.com",
      phone: "Phone Line",
      phoneDesc: "+234 800-ELN-SUPPORT",
      startChat: "Start Chat",
      sendEmail: "Send Email",
      callNow: "Call Now",
      securityTitle: "Enterprise Grade Security",
      securityDesc: "Your data and shipments are protected by industry-leading protocols.",
      uptime: "99.9%",
      uptimeDesc: "Uptime",
      monitoring: "24/7",
      monitoringDesc: "Monitoring"
    },
    privacy: {
      title: "Privacy Protocols.",
      effectiveDate: "Effective Date: February 2026",
      commitmentTitle: "Our Commitment",
      commitmentDesc: "At ELN Express, we believe privacy is the foundation of professional trust. This Privacy Hub outlines how we protect the sensitive data of our merchant partners, riders, and end customers within the fashion ecosystem.",
      rightsTitle: "Your Data Rights",
      footerNote: "By using ELN Express, you agree to our terms of service and our commitment to protecting the integrity of the fashion ecosystem. We update these protocols periodically to reflect new security standards.",
      downloadPdf: "Download PDF Version"
    },
    auth: {
      loginTitle: "Welcome Back.",
      loginSubtitle: "Access your logistics dashboard and manage your fashion fleet.",
      signupTitle: "Join the Network.",
      signupSubtitle: "Professional logistics for fashion brands and growing businesses.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      fullNameLabel: "Full Name",
      businessNameLabel: "Business Name",
      phoneLabel: "Phone Number",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      loginInstead: "Log in instead",
      signupInstead: "Sign up instead",
      completeRegistration: "Complete Registration",
      merchant: "Merchant",
      rider: "Rider",
      admin: "Admin",
      demoCredentials: "Demo Credentials",
      passwordHint: "Password: password"
    },
    onboarding: {
      welcome: "Welcome to the Network",
      welcomeDesc: "You're now part of the most professional logistics network for growing brands and small businesses.",
      identity: "Your Business Identity",
      identityDesc: "Let's make sure your brand shines through every delivery.",
      ready: "Ready for Dispatch",
      readyDesc: "Your account is active. You can now start creating delivery requests.",
      elite: "Welcome to the Elite",
      eliteDesc: "You've joined the most professional courier fleet for growing businesses.",
      safety: "Safety & Equipment",
      safetyDesc: "Before you hit the road, let's review our safety standards.",
      verification: "Verification Process",
      verificationDesc: "To start receiving orders, you'll need to complete your security verification.",
      uploadLogo: "Upload Logo",
      brandColor: "Primary Brand Color",
      proTip: "Pro Tip: Use the \"Express\" option for same-day deliveries within the central business district.",
      continue: "Continue",
      goDashboard: "Go to Dashboard"
    },
    merchant: {
      dispatchCenter: "Dispatch Center",
      activeShipments: "Active Shipments",
      deliveryLog: "Delivery Log",
      profile: "Profile",
      newRequest: "New Request",
      stats: {
        active: "Active",
        delivered: "Delivered",
        pending: "Pending",
        failed: "Failed",
        inTransit: "In Transit",
        successful: "Successful",
        pendingPay: "Pending Pay"
      },
      form: {
        customerName: "Customer Name",
        deliveryAddress: "Delivery Address",
        packageName: "Package Name",
        priority: "Priority",
        standard: "Standard",
        express: "Express",
        createRequest: "Create Request"
      }
    },
    rider: {
      dispatch: "Dispatch",
      map: "Live Map",
      history: "History",
      profile: "Profile",
      verification: "Verification",
      online: "Online",
      offline: "Offline",
      goOnline: "Go Online",
      activeMission: "Active Mission",
      waiting: "Waiting for new jobs...",
      earnings: "Total Earnings",
      accept: "Accept",
      decline: "Decline",
      markDelivered: "Mark as Delivered",
      startNavigation: "Start Voice Navigation"
    },
    admin: {
      overview: "Overview",
      orders: "Orders",
      verifications: "Verifications",
      users: "Users",
      reports: "Reports",
      stats: {
        totalOrders: "Total Orders",
        activeRiders: "Active Riders",
        merchants: "Merchants",
        revenue: "Revenue",
        totalJobs: "Total Jobs",
        fleetSize: "Fleet Size",
        boutiques: "Boutiques",
        successRate: "Success %"
      }
    }
  },
  yo: {
    common: {
      login: "Wọlé",
      signup: "Forúkọsílẹ̀",
      joinNow: "Darapọ̀ Nísinsìnyí",
      getStarted: "Bẹ̀rẹ̀",
      merchantLogin: "Wọlé Oníṣòwò",
      back: "Padà",
      about: "Nípa Wa",
      support: "Ìrànlọ́wọ́",
      privacy: "Àṣírí",
      admin: "Olùṣàkóso",
      logout: "Jáde",
      home: "Ilé",
      dashboard: "Dashboard"
    },
    landing: {
      badge: "Lọjistiki fun Idagbasoke",
      heroTitle1: "Yára. Ọ̀jọ̀gbọ́n.",
      heroTitle2: "Ṣetán fun Iṣẹ́.",
      heroDesc: "Alabaṣepọ ifijiṣẹ pataki fun awọn ami iyasọtọ aṣa ati awọn iṣowo kekere. A n tọju awọn ọja rẹ pẹlu abojuto to tọ.",
      servicesTitle: "Àwọn Iṣẹ́ Wa",
      swiftDispatch: "Ìfiránṣẹ́ Kíákíá",
      swiftDispatchDesc: "Ifijiṣẹ agbegbe ni ọjọ kanna fun awọn iṣẹ pataki. A n gbe ni iyara bi ile-iṣẹ ṣe n gbe.",
      productIntegrity: "Ìdúróṣinṣin Ọjà",
      productIntegrityDesc: "Mimu pataki fun awọn nkan ẹlẹgẹ ati awọn aṣẹ ti a ṣe ni pataki. Ko si ibajẹ, 100% aabo.",
      realTimeGrid: "Grid Àkókò-Gidi",
      realTimeGridDesc: "Itumọ ni kikun pẹlu titele GPS for oniṣowo ati alabara ipari.",
      faqTitle: "Àwọn Ìbéèrè Tí Ó Wọ́pọ̀",
      faqDesc: "Gbogbo ohun ti o nilo lati mọ nipa ELN Express.",
      ctaTitle: "Ṣe o ti ṣetan lati mu iṣowo rẹ pọ si?",
      ctaDesc: "Darapọ mọ nẹtiwọọki ti awọn oniṣowo ati awọn ẹlẹṣin ti n ṣe atunṣe iriri lati aṣẹ-si-ẹnu-ọna.",
      joinMerchant: "Darapọ̀ mọ́ gẹ́gẹ́ bí Oníṣòwò",
      becomeRider: "Di Ẹlẹ́ṣin",
      faqs: [
        {
          question: "Bawo ni ifijiṣẹ ṣe yara to?",
          answer: "A n funni ni ifijiṣẹ agbegbe ni ọjọ kanna fun awọn iṣẹ pataki laarin Lagos. Pupọ awọn aṣẹ ni a n fi ranṣẹ laarin wakati 4-6 lẹhin gbigbe."
        },
        {
          question: "Awọn agbegbe wo ni ẹ n bo?",
          answer: "Lọwọlọwọ, a n ṣiṣẹ lọpọlọpọ laarin Lagos, ni bo awọn ibudo pataki bi Victoria Island, Ikoyi, Lekki, ati Ikeja. A n pọ si awọn ilu pataki miiran laipẹ."
        },
        {
          question: "Bawo ni MO ṣe tọpa aṣẹ mi?",
          answer: "Awọn oniṣowo le tọpa gbogbo awọn ifijiṣẹ ti n ṣiṣẹ ni akoko gidi nipasẹ Hub Dispatch lori dashibodu wọn. Awọn alabara tun gba ọna asopọ titele nipasẹ SMS ni kete ti ẹlẹṣin ba wa ni ọna."
        },
        {
          question: "Ṣe ọjà mi ni iṣeduro bi?",
          answer: "Bẹẹni, a n ṣaju iduroṣinṣin ọja. Gbogbo awọn nkan aṣa ti o niye giga ti nẹtiwọọki ẹlẹṣin ti a fọwọsi n mu ni iṣeduro gbigbe ipilẹ wa bo."
        },
        {
          question: "Bawo ni MO ṣe di ẹlẹṣin?",
          answer: "Nìkan forukọsilẹ bi ẹlẹṣin, gbe ID ijọba rẹ ati iforukọsilẹ alupupu rẹ soke, ki o duro de ẹgbẹ ibamu wa lati jẹrisi profaili rẹ. Ni kete ti o ba ti jẹrisi, o le bẹrẹ gbigba awọn iṣẹ."
        }
      ]
    },
    about: {
      title: "Gbigbe Aṣa.",
      vision: "ELN Express ni a bi lati inu akiyesi ti o rọrun: agbaye iṣowo ode oni n gbe ni iyara ina, ṣugbọn lọjistiki ti di ninu ohun ti o kọja.",
      tailoredTitle: "Lọjistiki Tí A Ṣe Ní Pàtàkì",
      tailoredDesc: "A kii ṣe ifijiṣẹ awọn idii nikan; a n fi igbẹkẹle ranṣẹ. Awọn ẹlẹṣin wa ni ikẹkọ ni awọn ibeere mimu pataki ti awọn ọja ẹlẹgẹ.",
      pulseTitle: "Ìmí Iṣòwò",
      pulseDesc: "Nipa sisopọ awọn oniṣowo ti n dagba pẹlu ọkọ oju-omi iyasọtọ ti awọn ẹlẹṣin ọjọgbọn, a ti ṣẹda ilolupo eda abemi ti o ṣe rere lori igbẹkẹle.",
      valuesTitle: "Àwọn Ìlànà Wa",
      precision: "Ìpéye",
      precisionDesc: "Gbogbo alaye ṣe pataki, lati kika aṣọ kan si akoko ti sisọ silẹ.",
      care: "Ìtọ́jú",
      careDesc: "A n tọju gbogbo idii bi ẹni pe o jẹ ẹda tiwa.",
      integrity: "Ìdúróṣinṣin",
      integrityDesc: "Otitọ ati itumọ ni ipilẹ ti nẹtiwọọki wa.",
      rated: "#1 Tí A Kà Sí Jùlọ",
      ratedDesc: "Ní Ìtọ́jú Ọ̀jọ̀gbọ́n",
      partners: "500+",
      partnersDesc: "Àwọn Alábàṣepọ̀ Brand",
      grid: "24/7",
      gridDesc: "Grid Àkókò-Gidi",
      ctaTitle: "Darapọ̀ mọ́ Ìyípadà",
      ctaDesc: "Boya o jẹ otaja ti n dide tabi ẹlẹṣin oniwosan, aaye kan wa fun ọ ni nẹtiwọọki ELN."
    },
    support: {
      title: "Bawo ni a ṣe le ṣe iranlọwọ?",
      desc: "Wa awọn idahun si awọn ibeere ti o wọpọ tabi kan si ẹgbẹ concierge wa.",
      liveChat: "Live Chat",
      liveChatDesc: "Idahun apapọ: 2 iṣẹju",
      email: "Atilẹyin Imeeli",
      emailDesc: "support@elnexpress.com",
      phone: "Laini foonu",
      phoneDesc: "+234 800-ELN-SUPPORT",
      startChat: "Bẹrẹ Chat",
      sendEmail: "Fi Imeeli ranṣẹ",
      callNow: "Pe Bayi",
      securityTitle: "Aabo Ipele Idawọle",
      securityDesc: "Awọn data rẹ ati awọn gbigbe ni aabo nipasẹ awọn ilana asiwaju ile-iṣẹ.",
      uptime: "99.9%",
      uptimeDesc: "Uptime",
      monitoring: "24/7",
      monitoringDesc: "Abojuto"
    },
    privacy: {
      title: "Awọn Ilana Àṣírí.",
      effectiveDate: "Ọjọ Imuse: Kínní 2026",
      commitmentTitle: "Ifaramo Wa",
      commitmentDesc: "Ni ELN Express, a gbagbọ pe aṣiri jẹ ipilẹ ti igbẹkẹle ọjọgbọn. Hub Àṣírí yii ṣe ilana bi a ṣe ṣe aabo data ifura ti awọn alabaṣepọ oniṣowo wa, awọn ẹlẹṣin, ati awọn alabara ipari laarin ilolupo eda abemi.",
      rightsTitle: "Awọn ẹtọ Data Rẹ",
      footerNote: "Nipa lilo ELN Express, o gba si awọn ofin iṣẹ wa ati ifaramo wa lati daabobo iduroṣinṣin ti ilolupo eda abemi. A ṣe imudojuiwọn awọn ilana wọnyi lorekore lati ṣe afihan awọn iṣedede aabo tuntun.",
      downloadPdf: "Gba PDF silẹ"
    },
    auth: {
      loginTitle: "Kúàbọ̀ Padà.",
      loginSubtitle: "Wọlé sí dashibodu rẹ kí o sì ṣàkóso ọkọ̀ rẹ.",
      signupTitle: "Darapọ̀ mọ́ Nẹtiwọọki.",
      signupSubtitle: "Lọjistiki ọjọgbọn fun awọn ami iyasọtọ aṣa.",
      emailLabel: "Àdírẹ́sì Imeeli",
      passwordLabel: "Ọ̀rọ̀ Ìpamọ́",
      confirmPasswordLabel: "Fìdí Ọ̀rọ̀ Ìpamọ́ mú",
      fullNameLabel: "Orúkọ Kíkún",
      businessNameLabel: "Orúkọ Ìṣòwò",
      phoneLabel: "Nọ́mbà Fóònù",
      forgotPassword: "Ṣé o gbàgbé ọ̀rọ̀ ìpamọ́?",
      noAccount: "Ṣé o kò ní àkàùntì?",
      hasAccount: "Ṣé o ti ní àkàùntì tẹ́lẹ̀?",
      loginInstead: "Wọlé dípò rẹ̀",
      signupInstead: "Forúkọsílẹ̀ dípò rẹ̀",
      completeRegistration: "Parí Ìforúkọsílẹ̀",
      merchant: "Oníṣòwò",
      rider: "Ẹlẹ́ṣin",
      admin: "Olùṣàkóso",
      demoCredentials: "Àwọn Ìdánwò Wọlé",
      passwordHint: "Ọ̀rọ̀ Ìpamọ́: password"
    },
    onboarding: {
      welcome: "Kúàbọ̀ sí Nẹtiwọọki",
      welcomeDesc: "O ti di apakan ti nẹtiwọọki lọjistiki ọjọgbọn julọ.",
      identity: "Ìdánimọ̀ Ìṣòwò Rẹ",
      identityDesc: "Jẹ ki ami iyasọtọ rẹ tàn nipasẹ gbogbo ifijiṣẹ.",
      ready: "Ṣetán fún Ìfiránṣẹ́",
      readyDesc: "Àkàùntì rẹ ti ṣiṣẹ́. O le bẹ̀rẹ̀ sí í ṣẹ̀dá àwọn ìbéèrè ìfìjìṣẹ́.",
      elite: "Kúàbọ̀ sí Elite",
      eliteDesc: "O ti darapọ mọ ọkọ oju-omi iyasọtọ julọ.",
      safety: "Ààbò & Ohun Èlò",
      safetyDesc: "Ṣaaju ki o to bẹrẹ, jẹ ki a ṣe ayẹwo awọn iṣedede aabo wa.",
      verification: "Ìlànà Ìfìdí mú",
      verificationDesc: "Lati bẹrẹ gbigba awọn aṣẹ, o nilo lati pari ijẹrisi aabo rẹ.",
      uploadLogo: "Gbé Logo Sókè",
      brandColor: "Àwọ̀ Brand Àkọ́kọ́",
      proTip: "Ìmọ̀ràn: Lo aṣayan \"Express\" fun awọn ifijiṣẹ ọjọ kanna.",
      continue: "Tẹ̀síwájú",
      goDashboard: "Lọ sí Dashibodu"
    },
    merchant: {
      dispatchCenter: "Ibùdó Ìfiránṣẹ́",
      activeShipments: "Àwọn Ìfìjìṣẹ́ Tí Ó Ń Ṣiṣẹ́",
      deliveryLog: "Àkọsílẹ̀ Ìfìjìṣẹ́",
      profile: "Profaili",
      newRequest: "Ìbéèrè Tuntun",
      stats: {
        active: "Ìṣiṣẹ́",
        delivered: "Ìfìjìṣẹ́",
        pending: "Ìdúró",
        failed: "Ìkùnà",
        inTransit: "Lọ́nà",
        successful: "Àṣeyọrí",
        pendingPay: "Ìdúró Owó"
      },
      form: {
        customerName: "Orúkọ Alábàárà",
        deliveryAddress: "Àdírẹ́sì Ìfìjìṣẹ́",
        packageName: "Orúkọ Ọjà",
        priority: "Ìfihàn",
        standard: "Ìlànà",
        express: "Kíákíá",
        createRequest: "Ṣẹ̀dá Ìbéèrè"
      }
    },
    rider: {
      dispatch: "Ìfiránṣẹ́",
      map: "Màpù Àkókò-Gidi",
      history: "Ìtàn",
      profile: "Profaili",
      verification: "Ìfìdí mú",
      online: "Lórí Íńtánẹ́ẹ̀tì",
      offline: "Kò sí lórí Íńtánẹ́ẹ̀tì",
      goOnline: "Wọlé",
      activeMission: "Iṣẹ́ Tí Ó Ń Ṣiṣẹ́",
      waiting: "À n dúró de iṣẹ́ tuntun...",
      earnings: "Àpapọ̀ Owó",
      accept: "Gbà",
      decline: "Kọ̀",
      markDelivered: "Sàmì sí i gẹ́gẹ́ bí ìfìjìṣẹ́",
      startNavigation: "Bẹ̀rẹ̀ Ìtọ́sọ́nà Ohùn"
    },
    admin: {
      overview: "Àpapọ̀",
      orders: "Àwọn Àṣẹ",
      verifications: "Àwọn Ìfìdí mú",
      users: "Àwọn Olùlò",
      reports: "Àwọn Ìròyìn",
      stats: {
        totalOrders: "Àpapọ̀ Àṣẹ",
        activeRiders: "Àwọn Ẹlẹ́ṣin",
        merchants: "Àwọn Oníṣòwò",
        revenue: "Owó Tí Ó Wọlé",
        totalJobs: "Àpapọ̀ Iṣẹ́",
        fleetSize: "Ìwọ̀n Ọkọ̀",
        boutiques: "Àwọn Ilé-Ìtajà",
        successRate: "Ìpín Àṣeyọrí"
      }
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = TRANSLATIONS[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
