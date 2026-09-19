export default {
  id: "reading-full-2",
  type: "reading",
  title: "Academic Reading — Test 2",
  description: "3 passages · 40 questions · 60 minutes. TFNG, MCQ, gap-fill, summary completion.",
  durationMin: 60,
  questions: 40,
  difficulty: "Hard",
  passages: [
    {
      id: "r2p1",
      title: "The Evolution of Mapmaking",
      text: `The desire to represent the world visually is as old as civilisation itself. The earliest known maps, scratched onto clay tablets in ancient Babylon around 2300 BCE, depicted local landholdings and irrigation channels rather than geographical features. These pragmatic documents served administrative purposes, recording property boundaries and tax obligations for the ruling elite.

The ancient Greeks transformed cartography from a practical craft into a scientific discipline. Eratosthenes of Cyrene, who served as chief librarian at the Library of Alexandria in the third century BCE, calculated the circumference of the Earth with remarkable accuracy using nothing more than the angle of shadows cast by the sun in two different cities. His estimate of approximately 39,375 kilometres is within 2% of the modern measurement of 40,075 kilometres.

During the medieval period in Europe, mapmaking took a decidedly religious turn. The famous Hereford Mappa Mundi, created around 1300 CE, placed Jerusalem at the centre of the world and depicted biblical events alongside geographical features. These maps were not intended for navigation but rather as theological statements about humanity's place in the divine order. Meanwhile, Arab cartographers such as Muhammad al-Idrisi were producing far more accurate and detailed maps based on empirical observation and the accounts of merchants and travellers.

The Age of Exploration in the 15th and 16th centuries revolutionised cartography. The invention of the magnetic compass, the astrolabe, and later the marine chronometer allowed navigators to determine their position at sea with unprecedented precision. Gerardus Mercator's 1569 world map introduced the projection that still bears his name, which allowed sailors to plot straight-line courses across the ocean. However, the Mercator projection dramatically distorts the size of landmasses near the poles, making Greenland appear roughly the same size as Africa when in reality Africa is fourteen times larger.

The 20th century brought the most dramatic transformation in the history of cartography. The development of aerial photography during the First World War, followed by satellite imagery from the 1960s onwards, allowed the entire surface of the Earth to be mapped with extraordinary detail. Today, the Global Positioning System, which relies on a constellation of 31 satellites orbiting the Earth, can pinpoint a location to within a few centimetres.

Modern digital mapping platforms such as Google Maps and OpenStreetMap have democratised cartography in ways that would have been unimaginable to Mercator or Eratosthenes. Anyone with a smartphone can now access real-time satellite imagery, street-level photography, and turn-by-turn navigation for virtually any location on the planet. Yet some cartographers warn that this convenience comes at a cost. The art of reading a physical map — understanding scale, interpreting contour lines, and developing spatial awareness — is being lost as younger generations rely entirely on digital devices.`,
      questions: [
        { id: "r2q1", kind: "tfng", text: "The earliest known maps were primarily used for navigation at sea.", answer: "False", options: ["True", "False", "Not Given"], explanation: "They depicted landholdings and irrigation channels for administrative purposes." },
        { id: "r2q2", kind: "gap", text: "The earliest known maps date back to approximately ___ BCE.", answer: "2300", explanation: "The maps date to around 2300 BCE." },
        { id: "r2q3", kind: "mcq", text: "How accurate was Eratosthenes' calculation of Earth's circumference?", answer: "Within 2%", options: ["Within 0.5%", "Within 2%", "Within 5%", "Within 10%"], explanation: "His estimate is within 2% of the modern measurement." },
        { id: "r2q4", kind: "tfng", text: "The Hereford Mappa Mundi was designed primarily as a navigational tool.", answer: "False", options: ["True", "False", "Not Given"], explanation: "It was a theological statement, not intended for navigation." },
        { id: "r2q5", kind: "tfng", text: "Arab cartographers produced more accurate maps than their European counterparts during the medieval period.", answer: "True", options: ["True", "False", "Not Given"], explanation: "Arab cartographers produced far more accurate maps based on empirical observation." },
        { id: "r2q6", kind: "gap", text: "The Mercator projection was introduced in the year ___.", answer: "1569", explanation: "Mercator's world map was published in 1569." },
        { id: "r2q7", kind: "mcq", text: "How many times larger is Africa than Greenland in reality?", answer: "Fourteen times", options: ["Seven times", "Ten times", "Fourteen times", "Twenty times"], explanation: "Africa is fourteen times larger than Greenland." },
        { id: "r2q8", kind: "tfng", text: "GPS relies on a constellation of 24 satellites.", answer: "False", options: ["True", "False", "Not Given"], explanation: "GPS relies on 31 satellites." },
        { id: "r2q9", kind: "gap", text: "GPS can pinpoint a location to within a few ___.", answer: "centimetres", explanation: "GPS can pinpoint to within a few centimetres." },
        { id: "r2q10", kind: "mcq", text: "What skill do some cartographers fear is being lost?", answer: "Reading physical maps", options: ["Using compasses", "Reading physical maps", "Drawing coastlines", "Calculating longitude"], explanation: "The art of reading a physical map is being lost." },
        { id: "r2q11", kind: "tfng", text: "Aerial photography for mapping was first developed during the Second World War.", answer: "False", options: ["True", "False", "Not Given"], explanation: "It was developed during the First World War." },
        { id: "r2q12", kind: "mcq", text: "Eratosthenes held which position at the Library of Alexandria?", answer: "Chief librarian", options: ["Head astronomer", "Chief librarian", "Royal geographer", "Senior cartographer"], explanation: "He served as chief librarian." },
        { id: "r2q13", kind: "gap", text: "The modern measurement of Earth's circumference is approximately ___ kilometres.", answer: "40,075", explanation: "The modern measurement is 40,075 kilometres." }
      ]
    },
    {
      id: "r2p2",
      title: "Ocean Acidification: The Silent Crisis",
      text: `While climate change dominates headlines with its dramatic manifestations — melting ice caps, intensifying hurricanes, and blazing wildfires — a quieter but equally dangerous consequence of rising carbon dioxide levels is unfolding beneath the ocean's surface. Ocean acidification, often described as the other CO2 problem, threatens to fundamentally alter marine ecosystems within decades.

Since the beginning of the Industrial Revolution, the oceans have absorbed approximately 30% of all carbon dioxide emitted by human activities. When CO2 dissolves in seawater, it reacts with water molecules to form carbonic acid, which then dissociates into hydrogen ions and bicarbonate ions. The increase in hydrogen ions lowers the ocean's pH, making it more acidic. Since 1850, the average surface ocean pH has dropped from 8.2 to 8.1, representing a 26% increase in acidity. While this may sound modest, the pH scale is logarithmic, meaning each unit change represents a tenfold shift in hydrogen ion concentration.

The organisms most immediately threatened are those that build shells and skeletons from calcium carbonate, including corals, oysters, clams, sea urchins, and a class of microscopic plankton called pteropods. As acidity increases, the concentration of carbonate ions in seawater decreases, making it harder for these organisms to form and maintain their calcium carbonate structures. In extreme cases, the water becomes so corrosive that existing shells begin to dissolve.

The Great Barrier Reef, the world's largest coral reef system stretching over 2,300 kilometres along Australia's northeast coast, is already showing severe signs of stress. A 2022 study published in Nature found that the reef's coral cover had declined by 50% since 1995, with ocean acidification acting as a compounding factor alongside rising water temperatures and pollution. If current trends continue, scientists estimate that by 2050, the majority of the world's coral reefs could be functionally extinct.

The economic implications are staggering. The global fishing industry, which employs over 200 million people and provides the primary source of protein for more than 3 billion people, depends heavily on healthy marine ecosystems. Shellfish aquaculture in the Pacific Northwest of the United States has already experienced significant losses. In 2007, oyster hatcheries in Oregon and Washington reported mass die-offs of larvae, which researchers traced directly to upwelling of acidic deep ocean water.

Some scientists are exploring innovative solutions. A technique known as ocean alkalinity enhancement involves adding crushed minerals such as olivine or limestone to coastal waters to neutralise acidity. Early experiments have shown promising results, but scaling the approach to a global level would require mining and distributing billions of tonnes of rock, raising its own environmental concerns. Others advocate for the selective breeding of acid-resistant coral strains, a process sometimes called assisted evolution.

Ultimately, however, most marine biologists agree that the only lasting solution is a dramatic reduction in global CO2 emissions. Without addressing the root cause, all other interventions are merely temporary measures that delay an inevitable ecological catastrophe.`,
      questions: [
        { id: "r2q14", kind: "gap", text: "The oceans have absorbed approximately ___% of all human-emitted CO2 since the Industrial Revolution.", answer: "30", explanation: "The oceans have absorbed approximately 30%." },
        { id: "r2q15", kind: "tfng", text: "Ocean acidification is commonly referred to as the other CO2 problem.", answer: "True", options: ["True", "False", "Not Given"], explanation: "It is often described as the other CO2 problem." },
        { id: "r2q16", kind: "mcq", text: "Since 1850, the average surface ocean pH has dropped from 8.2 to:", answer: "8.1", options: ["7.8", "7.9", "8.0", "8.1"], explanation: "The pH has dropped from 8.2 to 8.1." },
        { id: "r2q17", kind: "tfng", text: "A 0.1 drop in pH represents a 26% increase in acidity.", answer: "True", options: ["True", "False", "Not Given"], explanation: "The drop represents a 26% increase in acidity." },
        { id: "r2q18", kind: "mcq", text: "Which organisms are most immediately threatened by ocean acidification?", answer: "Those that build shells from calcium carbonate", options: ["Deep-sea fish", "Marine mammals", "Those that build shells from calcium carbonate", "Seaweed and kelp"], explanation: "Calcium carbonate shell-builders are most threatened." },
        { id: "r2q19", kind: "gap", text: "The Great Barrier Reef stretches over ___ kilometres along Australia's coast.", answer: "2,300", explanation: "The reef stretches over 2,300 kilometres." },
        { id: "r2q20", kind: "tfng", text: "The Great Barrier Reef's coral cover has declined by 50% since 1995.", answer: "True", options: ["True", "False", "Not Given"], explanation: "Coral cover has declined by 50% since 1995." },
        { id: "r2q21", kind: "gap", text: "By 2050, the majority of the world's coral reefs could be functionally ___.", answer: "extinct", explanation: "Reefs could be functionally extinct by 2050." },
        { id: "r2q22", kind: "mcq", text: "How many people worldwide depend on fishing for their primary source of protein?", answer: "Over 3 billion", options: ["Over 1 billion", "Over 2 billion", "Over 3 billion", "Over 5 billion"], explanation: "More than 3 billion people depend on fishing for protein." },
        { id: "r2q23", kind: "tfng", text: "Oyster hatcheries in Oregon first reported mass die-offs in 2010.", answer: "False", options: ["True", "False", "Not Given"], explanation: "Mass die-offs were reported in 2007, not 2010." },
        { id: "r2q24", kind: "mcq", text: "What is ocean alkalinity enhancement?", answer: "Adding crushed minerals to coastal waters", options: ["Planting underwater forests", "Adding crushed minerals to coastal waters", "Reducing ocean temperatures", "Filtering CO2 from seawater"], explanation: "It involves adding crushed minerals like olivine or limestone." },
        { id: "r2q25", kind: "tfng", text: "Most marine biologists believe ocean alkalinity enhancement alone can solve the problem.", answer: "False", options: ["True", "False", "Not Given"], explanation: "The only lasting solution is a dramatic reduction in CO2 emissions." },
        { id: "r2q26", kind: "gap", text: "The global fishing industry employs over ___ million people.", answer: "200", explanation: "The industry employs over 200 million people." }
      ]
    },
    {
      id: "r2p3",
      title: "Artificial Intelligence in Modern Healthcare",
      text: `The integration of artificial intelligence into healthcare is no longer a futuristic aspiration; it is a present-day reality reshaping how diseases are diagnosed, treated, and managed. From radiology departments that use machine learning algorithms to detect tumours invisible to the human eye, to chatbots that triage patients in emergency rooms, AI is rapidly becoming an indispensable tool in the medical profession.

One of the most promising applications is in medical imaging. Deep learning models trained on millions of annotated X-rays, CT scans, and MRIs can now identify abnormalities with accuracy rates that match or exceed those of experienced radiologists. A 2023 study published in The Lancet Digital Health found that an AI system developed by researchers at Imperial College London detected breast cancer in mammograms with 94.5% accuracy, compared to 88.2% for human radiologists working alone. Crucially, when the AI and human radiologists worked together, accuracy rose to 97.1%, suggesting that the most effective approach is collaborative rather than purely automated.

Drug discovery is another area where AI is delivering transformative results. The traditional process of developing a new pharmaceutical compound takes an average of 10 to 15 years and costs approximately $2.6 billion. AI-powered platforms can screen millions of molecular structures in days, identifying promising drug candidates that would take human researchers years to find. In 2020, the British company Exscientia announced that it had designed the first AI-created drug molecule to enter human clinical trials, a treatment for obsessive-compulsive disorder that reached the trial stage in just 12 months.

However, the deployment of AI in healthcare raises significant ethical and practical concerns. The most pressing is the issue of algorithmic bias. Machine learning models are only as good as the data they are trained on, and if that data is drawn predominantly from one demographic group, the resulting algorithm may perform poorly for others. A widely cited 2019 study found that a healthcare algorithm used by major US hospitals to allocate care resources systematically discriminated against Black patients because it used historical healthcare spending as a proxy for health needs, and Black patients historically had less access to care and therefore lower spending.

Data privacy presents another formidable challenge. Training effective AI models requires vast quantities of patient data, including medical records, genetic information, and imaging scans. While regulations such as the European Union's General Data Protection Regulation and the US Health Insurance Portability and Accountability Act provide legal frameworks for data protection, the practical realities of anonymising large datasets while preserving their clinical utility remain unresolved.

The question of liability is equally complex. If an AI system misdiagnoses a patient or recommends an incorrect treatment, who is responsible? The software developer? The hospital that deployed the system? The physician who relied on its output? Current legal frameworks in most jurisdictions were not designed to address these scenarios, and courts have yet to establish clear precedents.

Despite these challenges, the trajectory is clear. The global AI in healthcare market, valued at approximately $15 billion in 2023, is projected to exceed $180 billion by 2030. As the technology matures and regulatory frameworks evolve, AI is expected to become as fundamental to medical practice as the stethoscope or the microscope.`,
      questions: [
        { id: "r2q27", kind: "tfng", text: "AI systems in radiology have already replaced most human radiologists.", answer: "False", options: ["True", "False", "Not Given"], explanation: "The most effective approach is collaborative, not replacement." },
        { id: "r2q28", kind: "mcq", text: "What was the accuracy of the AI system in detecting breast cancer at Imperial College London?", answer: "94.5%", options: ["88.2%", "91.0%", "94.5%", "97.1%"], explanation: "The AI detected breast cancer with 94.5% accuracy." },
        { id: "r2q29", kind: "gap", text: "When AI and human radiologists worked together, accuracy rose to ___%.", answer: "97.1", explanation: "Collaborative accuracy rose to 97.1%." },
        { id: "r2q30", kind: "mcq", text: "How long does the traditional drug development process typically take?", answer: "10 to 15 years", options: ["3 to 5 years", "5 to 8 years", "10 to 15 years", "20 to 25 years"], explanation: "Traditional development takes 10 to 15 years." },
        { id: "r2q31", kind: "gap", text: "The traditional drug development process costs approximately $___ billion.", answer: "2.6", explanation: "The cost is approximately $2.6 billion." },
        { id: "r2q32", kind: "tfng", text: "Exscientia's AI-designed drug was for treating diabetes.", answer: "False", options: ["True", "False", "Not Given"], explanation: "It was for obsessive-compulsive disorder." },
        { id: "r2q33", kind: "tfng", text: "The 2019 study found that a US healthcare algorithm discriminated against Black patients.", answer: "True", options: ["True", "False", "Not Given"], explanation: "The algorithm systematically discriminated against Black patients." },
        { id: "r2q34", kind: "mcq", text: "Why did the algorithm discriminate against Black patients?", answer: "It used healthcare spending as a proxy for health needs", options: ["It was intentionally biased", "It used healthcare spending as a proxy for health needs", "It had insufficient data", "It was trained only on European patients"], explanation: "It used historical spending as a proxy, and Black patients had lower spending." },
        { id: "r2q35", kind: "tfng", text: "GDPR and HIPAA have fully resolved the challenge of anonymising medical datasets.", answer: "False", options: ["True", "False", "Not Given"], explanation: "The practical realities remain unresolved." },
        { id: "r2q36", kind: "gap", text: "The global AI in healthcare market was valued at approximately $___ billion in 2023.", answer: "15", explanation: "The market was valued at approximately $15 billion." },
        { id: "r2q37", kind: "mcq", text: "By 2030, the AI healthcare market is projected to exceed:", answer: "$180 billion", options: ["$50 billion", "$100 billion", "$180 billion", "$500 billion"], explanation: "Projected to exceed $180 billion by 2030." },
        { id: "r2q38", kind: "tfng", text: "Most legal systems currently have clear precedents for AI medical liability.", answer: "False", options: ["True", "False", "Not Given"], explanation: "Courts have yet to establish clear precedents." },
        { id: "r2q39", kind: "gap", text: "Exscientia's AI drug reached clinical trials in just ___ months.", answer: "12", explanation: "It reached the trial stage in just 12 months." },
        { id: "r2q40", kind: "mcq", text: "What does the author compare AI's future role in medicine to?", answer: "The stethoscope and microscope", options: ["The X-ray machine", "The stethoscope and microscope", "The surgical robot", "The thermometer"], explanation: "AI is expected to become as fundamental as the stethoscope or microscope." }
      ]
    }
  ]
};