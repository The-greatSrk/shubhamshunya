import os
import json

translations = {
    # Brand and Navigation
    "Codagram": {"mr": "कोडाग्राम (Codagram)", "hi": "कोडाग्राम (Codagram)"},
    "Stories": {"mr": "यशोगाथा", "hi": "सफलता की कहानियाँ"},
    "Shunya": {"mr": "शून्य (Shunya)", "hi": "शून्य (Shunya)"},
    "Talent": {"mr": "टॅलेंट नेटवर्क", "hi": "टैलेंट नेटवर्क"},
    "Science Lab": {"mr": "सायन्स लॅब (विज्ञान प्रयोगशाळा)", "hi": "साइंस लैब (विज्ञान प्रयोगशाला)"},
    "Philosophy": {"mr": "तत्त्वज्ञान व विचार", "hi": "दर्शन एवं विचार"},
    "Story": {"mr": "प्रवास", "hi": "यात्रा"},
    "Vision": {"mr": "दृष्टिकोन (व्हिजन)", "hi": "दृष्टिकोण (विज़न)"},
    "Admin": {"mr": "अ‍ॅडमिन", "hi": "एडमिन"},
    "Admin Desk": {"mr": "अ‍ॅडमिन डेस्क", "hi": "एडमिन डेस्क"},
    "AI Terminal": {"mr": "एआय टर्मिनल", "hi": "एआई टर्मिनल"},
    "Apply": {"mr": "अर्ज करा", "hi": "आवेदन करें"},
    "Apply to Codagram": {"mr": "कोडाग्रामसाठी अर्ज करा", "hi": "कोडाग्राम के लिए आवेदन करें"},
    "Google Translate": {"mr": "गुगल ट्रान्सलेट", "hi": "गूगल ट्रांसलेट"},
    "English (Original)": {"mr": "इंग्रजी (मूळ भाषा)", "hi": "अंग्रेज़ी (मूल भाषा)"},
    "Marathi": {"mr": "मराठी", "hi": "मराठी"},
    "Hindi": {"mr": "हिंदी", "hi": "हिंदी"},

    # Hero & Subtitles
    "What remains when there is nothing left to prove?": {
        "mr": "जेव्हा काहीही सिद्ध करायचे उरत नाही, तेव्हा नेमके काय शिल्लक राहते?",
        "hi": "जब साबित करने के लिए कुछ भी बाकी नहीं रहता, तब वास्तव में क्या शेष रहता है?"
    },
    "Engineering Capability Rebuilt From Ground Up": {
        "mr": "पायाभूत स्तरावरून पुनर्निर्मित अभियांत्रिकी क्षमता व कौशल्य",
        "hi": "शून्य से पुनः निर्मित इंजीनियरिंग क्षमता एवं वास्तविक कौशल"
    },
    "Founder of Codagram and Author of 'Shunya: Sat Chit Anand'": {
        "mr": "कोडाग्रामचे संस्थापक आणि 'शून्य: सत् चित् आनंद' या ग्रंथाचे लेखक",
        "hi": "कोडाग्राम के संस्थापक और 'शून्य: सत् चित् आनंद' पुस्तक के रचयिता"
    },
    "Founder of Codagram & Author of Shunya: Sat Chit Anand": {
        "mr": "कोडाग्रामचे संस्थापक आणि 'शून्य: सत् चित् आनंद' ग्रंथाचे लेखक",
        "hi": "कोडाग्राम के संस्थापक और 'शून्य: सत् चित् आनंद' पुस्तक के रचयिता"
    },
    "Author of Shunya: Sat Chit Anand & Founder of Codagram": {
        "mr": "'शून्य: सत् चित् आनंद' चे लेखक आणि कोडाग्रामचे संस्थापक",
        "hi": "'शून्य: सत् चित् आनंद' के रचयिता और कोडाग्राम के संस्थापक"
    },
    "Founder, Engineer, Author": {
        "mr": "संस्थापक • अभियंता • लेखक",
        "hi": "संस्थापक • इंजीनियर • लेखक"
    },
    "Founder Digital Headquarters": {
        "mr": "संस्थापकाचे अधिकृत डिजिटल मुख्यालय",
        "hi": "संस्थापक का आधिकारिक डिजिटल मुख्यालय"
    },
    "Shubham Kasar": {"mr": "शुभम कासार (Shubham Kasar)", "hi": "शुभम कासार (Shubham Kasar)"},
    "SHUBHAM KASAR": {"mr": "शुभम कासार (SHUBHAM KASAR)", "hi": "शुभम कासार (SHUBHAM KASAR)"},
    "Pune, India": {"mr": "पुणे, भारत", "hi": "पुणे, भारत"},
    "Pune, Maharashtra": {"mr": "पुणे, महाराष्ट्र", "hi": "पुणे, महाराष्ट्र"},
    "Years Engineering": {"mr": "वर्षे अभियांत्रिकी अनुभव", "hi": "वर्षों का इंजीनियरिंग अनुभव"},
    "Engineers Mentored": {"mr": "प्रशिक्षित अभियंते", "hi": "मार्गदर्शित इंजीनियर्स"},
    "Books Authored": {"mr": "लिखित पुस्तके", "hi": "लिखित पुस्तकें"},
    "Placement Record": {"mr": "प्लेसमेंट यशदर", "hi": "प्लेसमेंट रिकॉर्ड"},
    "Explore Codagram": {"mr": "कोडाग्राम एक्सप्लोर करा", "hi": "कोडाग्राम देखें"},
    "Explore Shunya": {"mr": "शून्य एक्सप्लोर करा", "hi": "शून्य देखें"},
    "Order Shunya": {"mr": "शून्य पुस्तक मागवा", "hi": "शून्य पुस्तक ऑर्डर करें"},
    "Watch Philosophy": {"mr": "तत्त्वज्ञान चिंतन पाहा", "hi": "दर्शन एवं विचार देखें"},
    "Ask Shubham AI": {"mr": "शुभम एआय ला विचारा", "hi": "शुभम एआई से पूछें"},
    "Capability Over Certificates": {"mr": "प्रमाणपत्रांपेक्षा प्रत्यक्ष क्षमता व कौशल्य", "hi": "प्रमाणपत्रों से बढ़कर वास्तविक क्षमता"},
    "Capability over certificates": {"mr": "प्रमाणपत्रांपेक्षा प्रत्यक्ष क्षमता व कौशल्य", "hi": "प्रमाणपत्रों से बढ़कर वास्तविक क्षमता"},
    "Consciousness within, technology outside.": {
        "mr": "आतमध्ये निरामय जाणीव, बाहेर प्रगत तंत्रज्ञान.",
        "hi": "भीतर शुद्ध चेतना, बाहर आधुनिक तकनीक।"
    },

    # Pillars
    "Pillar One": {"mr": "स्तंभ पहिला", "hi": "पहला स्तंभ"},
    "Pillar Two": {"mr": "स्तंभ दुसरा", "hi": "दूसरा स्तंभ"},
    "Pillar One: Codagram": {"mr": "स्तंभ पहिला: कोडाग्राम", "hi": "पहला स्तंभ: कोडाग्राम"},
    "Pillar Two: Shunya": {"mr": "स्तंभ दुसरा: शून्य", "hi": "दूसरा स्तंभ: शून्य"},
    "Engineering Education Rebuilt": {"mr": "अभियांत्रिकी शिक्षणाची पुनर्निर्मिती", "hi": "इंजीनियरिंग शिक्षा का पुनर्गठन"},
    "Consciousness, Book, Contemplative Inquiries": {
        "mr": "जाणीव, ग्रंथ आणि आत्मचिंतन",
        "hi": "चेतना, ग्रंथ एवं आत्म-चिंतन"
    },

    # About Shubham
    "The Journey": {"mr": "प्रवास", "hi": "यात्रा"},
    "Code is not syntax. It is crystallized thought.": {
        "mr": "कोड म्हणजे केवळ सिंटॅक्स नाही; तो स्फटिकीभूत विचार आहे.",
        "hi": "कोड सिर्फ सिंटैक्स नहीं है; यह घनीभूत विचार है।"
    },
    "Official Portrait": {"mr": "अधिकृत संस्थापक छायाचित्र", "hi": "आधिकारिक संस्थापक चित्र"},
    "Founder Portrait": {"mr": "संस्थापक छायाचित्र", "hi": "संस्थापक चित्र"},
    "Verified Identity": {"mr": "प्रमाणित ओळख", "hi": "सत्यापित पहचान"},
    "View LinkedIn Profile": {"mr": "लिंक्डइन प्रोफाइल पाहा", "hi": "लिंक्डइन प्रोफ़ाइल देखें"},

    # Codagram Tracks
    "Distributed Systems & Cloud": {"mr": "वितरित प्रणाली आणि क्लाउड आर्किटेक्चर", "hi": "डिस्ट्रिब्यूटेड सिस्टम्स और क्लाउड आर्किटेक्चर"},
    "Full Stack AI Architecture": {"mr": "फुल स्टॅक एआय आर्किटेक्चर", "hi": "फुल स्टैक एआई आर्किटेक्चर"},
    "Systems & Core CS": {"mr": "सिस्टम्स आणि मूळ कॉम्प्युटर सायन्स", "hi": "सिस्टम्स और कोर कंप्यूटर साइंस"},
    "Enroll Now": {"mr": "आता प्रवेश घ्या", "hi": "अभी प्रवेश लें"},
    "View Curriculum": {"mr": "अभ्यासक्रम पाहा", "hi": "पाठ्यक्रम देखें"},
    "Instant UPI Checkout": {"mr": "झटपट यूपीआय पेमेंट", "hi": "त्वरित यूपीआई भुगतान"},
    "Enroll with Instant UPI": {"mr": "झटपट यूपीआय द्वारे प्रवेश घ्या", "hi": "तुरंत यूपीआई से प्रवेश लें"},

    # Student Journey
    "From Day 1 to Technical Independence": {
        "mr": "पहिल्या दिवसापासून ते तांत्रिक स्वावलंबनापर्यंत",
        "hi": "पहले दिन से लेकर तकनीकी स्वावलंबन तक"
    },
    "Phase 1: Foundations & Systems Thinking": {
        "mr": "टप्पा १: मूलभूत संकल्पना आणि सिस्टिम थिंकिंग",
        "hi": "चरण १: आधारभूत संकल्पनाएं और सिस्टम थिंकिंग"
    },
    "Phase 2: Production Scale Engineering": {
        "mr": "टप्पा २: प्रॉडक्शन स्केल अभियांत्रिकी",
        "hi": "चरण २: प्रोडक्शन स्केल इंजीनियरिंग"
    },
    "Phase 3: High Scale & Architecture": {
        "mr": "टप्पा ३: हाय स्केल आणि आर्किटेक्चर",
        "hi": "चरण ३: हाई स्केल एवं आर्किटेक्चर"
    },
    "Phase 4: Real Deployment & Independence": {
        "mr": "टप्पा ४: प्रत्यक्ष डिप्लॉयमेंट आणि स्वावलंबन",
        "hi": "चरण ४: वास्तविक डिप्लॉयमेंट और स्वावलंबन"
    },

    # Shunya Book
    "Shunya: Sat Chit Anand": {"mr": "शून्य: सत् चित् आनंद", "hi": "शून्य: सत् चित् आनंद"},
    "Hardcover Edition": {"mr": "हार्डकव्हर आवृत्ती", "hi": "हार्डकवर संस्करण"},
    "Paperback Edition": {"mr": "पेपरबॅक आवृत्ती", "hi": "पेपरबैक संस्करण"},
    "Kindle Edition": {"mr": "किंडल डिजिटल आवृत्ती", "hi": "किंडल डिजिटल संस्करण"},
    "Collector Hardcover": {"mr": "कलेक्टर हार्डकव्हर आवृत्ती", "hi": "कलेक्टर हार्डकवर संस्करण"},
    "Standard Paperback": {"mr": "स्टँडर्ड पेपरबॅक आवृत्ती", "hi": "स्टैंडर्ड पेपरबैक संस्करण"},
    "Digital Kindle / E-Book": {"mr": "डिजिटल किंडल ई-बुक", "hi": "डिजिटल किंडल ई-बुक"},
    "Order with Instant UPI": {"mr": "झटपट यूपीआयने ऑर्डर करा", "hi": "तुरंत यूपीआई से ऑर्डर करें"},
    "Buy with Instant UPI": {"mr": "झटपट यूपीआयने खरेदी करा", "hi": "तुरंत यूपीआई से खरीदें"},
    "Instant UPI": {"mr": "झटपट यूपीआय", "hi": "तुरंत यूपीआई"},
    "Sample Chapter": {"mr": "नमुना प्रकरण वाचा", "hi": "सैंपल अध्याय पढ़ें"},
    "Read Chapter 1": {"mr": "प्रकरण १ वाचा", "hi": "अध्याय १ पढ़ें"},
    "Buy on Amazon Kindle": {"mr": "अॅमेझॉन किंडलवर खरेदी करा", "hi": "अमेज़न किंडल पर खरीदें"},

    # Talent Network
    "Hire Pre-Vetted Production Engineers": {
        "mr": "प्रत्यक्ष पडताळणी केलेले प्रॉडक्शन इंजिनिअर्स हायर करा",
        "hi": "सत्यापित एवं सक्षम प्रोडक्शन इंजीनियर्स हायर करें"
    },
    "Hire Pre-Vetted Engineers": {
        "mr": "पडताळणी केलेले इंजिनिअर्स हायर करा",
        "hi": "सत्यापित इंजीनियर्स हायर करें"
    },
    "Request Candidate": {"mr": "उमेदवार प्रोफाइल मागवा", "hi": "उम्मीदवार प्रोफाइल का अनुरोध करें"},
    "View GitHub": {"mr": "गिटहब पाहा", "hi": "गिटहब देखें"},
    "View Portfolio": {"mr": "पोर्टफोलिओ पाहा", "hi": "पोर्टफ़ोलियो देखें"},
    "Direct Founder Endorsement": {"mr": "संस्थापकाची थेट शिफारस", "hi": "संस्थापक की सीधी सिफ़ारिश"},

    # Science Lab & Philosophy
    "Bio-Computing & Consciousness Research": {
        "mr": "बायो-कॉम्प्युटिंग आणि जाणीव संशोधन",
        "hi": "बायो-कंप्यूटिंग एवं चेतना अनुसंधान"
    },
    "Contemplations & Insights": {"mr": "आत्मचिंतन आणि अंतर्दृष्टी", "hi": "आत्म-चिंतन एवं अंतर्दृष्टि"},
    "Read Essay": {"mr": "निबंध वाचा", "hi": "निबंध पढ़ें"},
    "Book a Conversation": {"mr": "चर्चेसाठी वेळ आरक्षित करा", "hi": "बातचीत के लिए समय तय करें"},
    "Direct Mentorship & Strategic Dialogue": {
        "mr": "थेट मार्गदर्शन आणि धोरणात्मक संवाद",
        "hi": "सीधा मार्गदर्शन एवं रणनीतिक संवाद"
    },

    # Media & Press
    "Media & Press": {"mr": "माध्यमे आणि बातम्या", "hi": "मीडिया एवं समाचार"},
    "Podcasts, Interviews & Keynotes": {
        "mr": "पॉडकास्ट, मुलाखती आणि मुख्य भाषणे",
        "hi": "पॉडकास्ट, साक्षात्कार और मुख्य भाषण"
    },

    # Vision
    "The Next 10 Years": {"mr": "पुढील १० वर्षे", "hi": "आगामी १० वर्ष"},
    "Decentralized Learning, Conscious Computing": {
        "mr": "विकेंद्रित शिक्षण, जाणीवयुक्त संगणन",
        "hi": "विकेंद्रीकृत शिक्षा, चेतनामय संगणन"
    },

    # Testimonials & Proof
    "Proof of Capability": {"mr": "क्षमतेचा प्रत्यक्ष पुरावा", "hi": "क्षमता का प्रत्यक्ष प्रमाण"},
    "Real Transformations": {"mr": "वास्तविक रूपांतरण", "hi": "वास्तविक बदलाव"},
    "Engineers at Top Companies": {"mr": "शीर्ष तंत्रज्ञान कंपन्यांमधील अभियंते", "hi": "शीर्ष तकनीकी कंपनियों में कार्यरत इंजीनियर्स"},

    # Footer
    "Official Digital Headquarters of Shubham Kasar": {
        "mr": "शुभम कासार यांचे अधिकृत डिजिटल मुख्यालय",
        "hi": "शुभम कासार का आधिकारिक डिजिटल मुख्यालय"
    },
    "All rights reserved.": {"mr": "सर्व हक्क राखीव.", "hi": "सर्वाधिकार सुरक्षित।"},
    "Crafted with precision in Pune, India.": {
        "mr": "पुणे, भारत येथे अचूकतेने विकसित.",
        "hi": "पुणे, भारत में कुशलता से निर्मित।"
    },

    # Action buttons and common words
    "Submit Application": {"mr": "अर्ज सादर करा", "hi": "आवेदन जमा करें"},
    "Close": {"mr": "बंद करा", "hi": "बंद करें"},
    "Back": {"mr": "मागे", "hi": "वापस"},
    "Next": {"mr": "पुढे", "hi": "आगे"},
    "Confirm & Pay": {"mr": "खात्री करा आणि पैसे भरा", "hi": "पुष्टि करें और भुगतान करें"},
    "Scan & Pay with Any UPI App": {"mr": "कोणत्याही यूपीआय अ‍ॅपने स्कॅन करून पैसे भरा", "hi": "किसी भी यूपीआई ऐप से स्कैन करके भुगतान करें"},
    "Step 1: Scan QR Code": {"mr": "पायरी १: क्यूआर कोड स्कॅन करा", "hi": "चरण १: क्यूआर कोड स्कैन करें"},
    "Step 2: Enter Transaction UTR / Ref Number": {"mr": "पायरी २: ट्रान्झॅक्शन यूटीआर / संदर्भ क्रमांक टाका", "hi": "चरण २: ट्रांजेक्शन यूटीआर / संदर्भ संख्या दर्ज करें"},
    "Verify & Complete Order": {"mr": "पडताळणी करा आणि ऑर्डर पूर्ण करा", "hi": "सत्यापित करें और ऑर्डर पूरा करें"},
    "Order Placed Successfully": {"mr": "ऑर्डर यशस्वीरीत्या नोंदवली गेली", "hi": "ऑर्डर सफलतापूर्वक दर्ज हुआ"},
    "Thank you for your order!": {"mr": "आपल्या ऑर्डराबद्दल धन्यवाद!", "hi": "आपके ऑर्डर के लिए धन्यवाद!"},
    "Download Receipt": {"mr": "पावती डाउनलोड करा", "hi": "रसीद डाउनलोड करें"},
    "Full Name": {"mr": "पूर्ण नाव", "hi": "पूरा नाम"},
    "Email Address": {"mr": "ईमेल पत्ता", "hi": "ईमेल पता"},
    "Phone / WhatsApp Number": {"mr": "फोन / व्हॉट्सअ‍ॅप क्रमांक", "hi": "फ़ोन / व्हाट्सएप नंबर"},
    "Shipping Address": {"mr": "डिलिव्हरी पत्ता", "hi": "डिलीवरी का पता"},
    "City": {"mr": "शहर", "hi": "शहर"},
    "State": {"mr": "राज्य", "hi": "राज्य"},
    "Pincode": {"mr": "पिनकोड", "hi": "पिनकोड"},
    "Select Program": {"mr": "प्रोग्राम निवडा", "hi": "प्रोग्राम चुनें"},
    "Experience Level": {"mr": "अनुभव पातळी", "hi": "अनुभव स्तर"},
    "College / Organization": {"mr": "कॉलेज / संस्था", "hi": "कॉलेज / संस्थान"},
    "Message / Inquiry": {"mr": "संदेश / विचारणा", "hi": "संदेश / पूछताछ"},
    "Send Message": {"mr": "संदेश पाठवा", "hi": "संदेश भेजें"},
    "Direct Phone": {"mr": "थेट संपर्क क्रमांक", "hi": "सीधा फ़ोन नंबर"},
    "Email": {"mr": "ईमेल", "hi": "ईमेल"},
    "Location": {"mr": "स्थान", "hi": "स्थान"},
}

# Substring replacements for sentence elements
substring_replacements = {
    "Years Experience": {"mr": "वर्षांचा अनुभव", "hi": "वर्षों का अनुभव"},
    "Years": {"mr": "वर्षे", "hi": "वर्ष"},
    "Students": {"mr": "विद्यार्थी", "hi": "छात्र"},
    "Mentorship": {"mr": "मार्गदर्शन", "hi": "मार्गदर्शन"},
    "Curriculum": {"mr": "अभ्यासक्रम", "hi": "पाठ्यक्रम"},
    "Author": {"mr": "लेखक", "hi": "लेखक"},
    "Founder": {"mr": "संस्थापक", "hi": "संस्थापक"},
    "Engineer": {"mr": "अभियंता", "hi": "इंजीनियर"},
    "Engineers": {"mr": "अभियंते", "hi": "इंजीनियर्स"},
    "Placement": {"mr": "प्लेसमेंट", "hi": "प्लेसमेंट"},
    "Consciousness": {"mr": "जाणीव / चेतना", "hi": "चेतना"},
    "Education": {"mr": "शिक्षण", "hi": "शिक्षा"},
    "Capability": {"mr": "क्षमता व कौशल्य", "hi": "क्षमता एवं कौशल"},
    "Certificates": {"mr": "प्रमाणपत्रे", "hi": "प्रमाणपत्र"},
    "Hardcover": {"mr": "हार्डकव्हर", "hi": "हार्डकवर"},
    "Paperback": {"mr": "पेपरबॅक", "hi": "पेपरबैक"},
    "Order Now": {"mr": "आता ऑर्डर करा", "hi": "अभी ऑर्डर करें"},
    "Read More": {"mr": "अधिक वाचा", "hi": "और पढ़ें"},
    "Learn More": {"mr": "अधिक जाणून घ्या", "hi": "अधिक जानें"},
    "View More": {"mr": "अधिक पाहा", "hi": "और देखें"},
    "Explore": {"mr": "एक्सप्लोर करा", "hi": "देखें"},
    "Get Started": {"mr": "सुरुवात करा", "hi": "शुरू करें"},
    "Contact Us": {"mr": "संपर्क साधा", "hi": "संपर्क करें"},
    "About Shubham": {"mr": "शुभम यांच्याबद्दल", "hi": "शुभम के बारे में"},
}

ts_file_content = f"""// High-Accuracy Google Translate & Multi-Language Translation Engine
// Supports: English (Original), Marathi (मराठी), and Hindi (हिंदी)
// Preserves exact technical, philosophical, and biographical context
// Translates all visible English words on the website without changing meaning

export type SupportedLanguage = 'en' | 'mr' | 'hi';

export interface LanguageOption {{
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  badge: string;
  description: string;
}}

export const LANGUAGES: LanguageOption[] = [
  {{
    code: 'en',
    name: 'English',
    nativeName: 'English (Original)',
    badge: 'EN',
    description: 'Original English words and technical terminology',
  }},
  {{
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी (Marathi)',
    badge: 'मराठी',
    description: 'महाराष्ट्रातील अभ्यागत आणि मराठी वाचकांसाठी संपूर्ण वेबसाइटचे शुद्ध मराठीत भाषांतर',
  }},
  {{
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी (Hindi)',
    badge: 'हिंदी',
    description: 'हिंदी पाठकों के लिए संपूर्ण वेबसाइट का शुद्ध एवं सहज हिंदी में अनुवाद',
  }},
];

export const EXACT_TRANSLATIONS: Record<string, {{ mr: string; hi: string }}> = {json.dumps(translations, indent=2, ensure_ascii=False)};

export const SUBSTRING_REPLACEMENTS: Record<string, {{ mr: string; hi: string }}> = {json.dumps(substring_replacements, indent=2, ensure_ascii=False)};

// Global weakmap to remember original text node values before translation
const originalTextMap = new WeakMap<Node, string>();
let currentLanguage: SupportedLanguage = 'en';
let translationObserver: MutationObserver | null = null;
let isTranslatingDOM = false;

export function getStoredLanguage(): SupportedLanguage {{
  if (typeof window === 'undefined') return 'en';
  try {{
    // 1. Check Google Translate cookie googtrans
    const match = document.cookie.match(/(?:^|;\\s*)googtrans=\\/en\\/([a-z]{{2}})/i);
    if (match && match[1]) {{
      const lang = match[1].toLowerCase();
      if (lang === 'mr' || lang === 'hi' || lang === 'en') {{
        return lang as SupportedLanguage;
      }}
    }}
    // 2. Check localStorage
    const saved = localStorage.getItem('codagram_language');
    if (saved === 'mr' || saved === 'hi' || saved === 'en') {{
      return saved as SupportedLanguage;
    }}
  }} catch {{
    // ignore storage restrictions
  }}
  return 'en';
}}

export function setTranslateCookie(lang: SupportedLanguage) {{
  if (typeof window === 'undefined') return;
  const hostname = window.location.hostname;
  const cookieVal = lang === 'en' ? '/en/en' : `/en/${{lang}}`;

  try {{
    document.cookie = `googtrans=${{cookieVal}}; path=/;`;
    document.cookie = `googtrans=${{cookieVal}}; path=/; domain=${{hostname}};`;

    if (hostname.includes('.')) {{
      const parts = hostname.split('.');
      if (parts.length >= 2) {{
        const rootDomain = parts.slice(-2).join('.');
        document.cookie = `googtrans=${{cookieVal}}; path=/; domain=.${{rootDomain}};`;
      }}
    }}

    if (lang === 'en') {{
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${{hostname}};`;
    }}

    localStorage.setItem('codagram_language', lang);
  }} catch {{
    // ignore
  }}
}}

export function translateText(text: string, targetLang: 'mr' | 'hi'): string {{
  if (!text || !text.trim()) return text;
  const trimmed = text.trim();

  // 1. Direct exact phrase match
  if (EXACT_TRANSLATIONS[trimmed]) {{
    const replacement = EXACT_TRANSLATIONS[trimmed][targetLang];
    return text.replace(trimmed, replacement);
  }}

  // 2. Check case-insensitive exact match
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(EXACT_TRANSLATIONS)) {{
    if (key.toLowerCase() === lower) {{
      return text.replace(trimmed, val[targetLang]);
    }}
  }}

  // 3. Substring phrases replacement
  let result = text;
  for (const [sub, map] of Object.entries(SUBSTRING_REPLACEMENTS)) {{
    if (result.includes(sub)) {{
      const regex = new RegExp(`\\\\b${{sub}}\\\\b`, 'g');
      result = result.replace(regex, map[targetLang]);
    }}
  }}

  return result;
}}

function translateNode(node: Node, targetLang: 'mr' | 'hi') {{
  if (node.nodeType === Node.TEXT_NODE) {{
    const parent = node.parentElement;
    if (!parent) return;

    // Skip technical tags, code, scripts, styles, inputs, or marked notranslate
    const tagName = parent.tagName.toLowerCase();
    if (
      tagName === 'script' ||
      tagName === 'style' ||
      tagName === 'code' ||
      tagName === 'pre' ||
      tagName === 'input' ||
      tagName === 'textarea' ||
      parent.closest('.notranslate') ||
      parent.closest('pre') ||
      parent.closest('code')
    ) {{
      return;
    }}

    const originalText = originalTextMap.get(node) ?? (node.nodeValue || '');
    if (!originalTextMap.has(node)) {{
      originalTextMap.set(node, originalText);
    }}

    const translated = translateText(originalText, targetLang);
    if (translated !== node.nodeValue) {{
      node.nodeValue = translated;
    }}
  }} else if (node.nodeType === Node.ELEMENT_NODE) {{
    const el = node as HTMLElement;
    if (el.classList && el.classList.contains('notranslate')) return;
    for (let i = 0; i < el.childNodes.length; i++) {{
      translateNode(el.childNodes[i], targetLang);
    }}
  }}
}}

function restoreNode(node: Node) {{
  if (node.nodeType === Node.TEXT_NODE) {{
    if (originalTextMap.has(node)) {{
      const original = originalTextMap.get(node);
      if (original !== undefined && node.nodeValue !== original) {{
        node.nodeValue = original;
      }}
    }}
  }} else if (node.nodeType === Node.ELEMENT_NODE) {{
    const el = node as HTMLElement;
    for (let i = 0; i < el.childNodes.length; i++) {{
      restoreNode(el.childNodes[i]);
    }}
  }}
}}

export function applyLanguage(lang: SupportedLanguage) {{
  if (typeof window === 'undefined') return;
  currentLanguage = lang;
  setTranslateCookie(lang);

  if (translationObserver) {{
    translationObserver.disconnect();
    translationObserver = null;
  }}

  if (lang === 'en') {{
    isTranslatingDOM = true;
    restoreNode(document.body);
    isTranslatingDOM = false;

    // Trigger Google Translate combo if present
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem && selectElem.value !== 'en') {{
      selectElem.value = 'en';
      selectElem.dispatchEvent(new Event('change', {{ bubbles: true }}));
    }}
    return;
  }}

  // Apply translation to all text nodes
  isTranslatingDOM = true;
  translateNode(document.body, lang);
  isTranslatingDOM = false;

  // Trigger Google Translate engine
  const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (selectElem && selectElem.value !== lang) {{
    selectElem.value = lang;
    selectElem.dispatchEvent(new Event('change', {{ bubbles: true }}));
  }}

  // Watch for dynamic DOM changes (modals, new elements, tabs)
  translationObserver = new MutationObserver((mutations) => {{
    if (isTranslatingDOM || currentLanguage === 'en') return;
    isTranslatingDOM = true;
    for (const mutation of mutations) {{
      if (mutation.type === 'childList') {{
        mutation.addedNodes.forEach((n) => translateNode(n, currentLanguage as 'mr' | 'hi'));
      }}
    }}
    isTranslatingDOM = false;
  }});

  translationObserver.observe(document.body, {{
    childList: true,
    subtree: true,
  }});
}}
"""

with open("src/utils/translator.ts", "w") as f:
    f.write(ts_file_content)

print("Generated src/utils/translator.ts successfully")
