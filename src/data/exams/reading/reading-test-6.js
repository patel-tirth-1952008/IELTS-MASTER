// Full-length IELTS Academic Reading Practice Test 6
// Passage 1: The Revival of Ancient Grains (13 questions)
// Passage 2: Termite Architecture & Biomimicry (13 questions)
// Passage 3: The Psychology of Deep Time & Long-term Thinking (14 questions)
// Total: 40 questions · 60 minutes · Original Content

const readingTest6 = {
  id: "reading-test-6",
  type: "reading",
  title: "Academic Reading — Practice Test 6",
  description:
    "3 passages · 40 questions · 60 minutes. Complete Academic format: Termite mound engineering, ancient crop resilience, and deep-time psychology.",
  durationMin: 60,
  questions: 40,
  difficulty: "Hard",
  passages: [
    // ============================================================
    // PASSAGE 1 — The Revival of Ancient Grains (Q1 - Q13)
    // ============================================================
    {
      id: "p1",
      title: "The Revival of Ancient Grains",
      text: `For over ten millennia, human civilisation developed in tandem with the cultivation of wild cereal grasses. In the Fertile Crescent of the Middle East, early farmers domesticated einkorn and emmer wheat, crops characterised by tough husks that protected the internal seeds from pests and unpredictable weather. Over generations, these early cultivars were joined by spelt, barley, and millet across Eurasia, while amaranth and quinoa sustained sprawling empires in Mesoamerica and the Andes. Unlike modern agricultural strains, which have been intensively crossbred for uniform height and maximum yield, ancient grains retained substantial genetic diversity, allowing them to withstand droughts, nutrient-poor soils, and sudden shifts in climate.

However, the onset of the industrial era, followed by the Green Revolution of the mid-twentieth century, brought about a radical homogenisation of global grain production. Agricultural scientists engineered high-yielding, dwarf varieties of modern bread wheat (Triticum aestivum) that responded dramatically to synthetic nitrogen fertilisers. These modern cultivars matured rapidly and could be harvested with mechanical combines at unprecedented speeds. Within a few decades, traditional landraces were largely abandoned by commercial farms. By the year 2000, more than 85 percent of all human caloric intake from grains was derived from just three staple crops: modern wheat, rice, and maize.

This narrow reliance on monoculture has created severe vulnerabilities. Modern hybrid cereals require vast inputs of chemical fertilisers, pesticides, and intensive irrigation to maintain their high yields. Furthermore, intensive processing methods strip modern wheat of its nutrient-rich bran and germ, leaving refined flour deficient in dietary fibre, micronutrients, and phenolic antioxidants. In response, nutritionists and agronomists have turned their attention back to ancient grains, initiating a remarkable renaissance in sustainable farming and culinary arts.

Agronomically, ancient grains present extraordinary advantages in an era of escalating climate instability. Einkorn and spelt, for instance, possess robust, unworked husk structures that shield the kernel from fungal pathogens, significantly reducing or eliminating the need for synthetic fungicides. Their extensive root networks penetrate deep into subsoils, drawing up moisture during prolonged dry spells and anchoring topsoil against wind erosion. Quinoa and amaranth, which are technically pseudocereals belonging to broadleaf plant families rather than true grasses, thrive in saline soils and high altitudes where modern commercial wheat inevitably withers.

From a dietary standpoint, ancient grains offer a superior nutritional profile. Research shows that emmer and spelt contain significantly higher concentrations of zinc, magnesium, and iron than conventional wheat. While ancient wheats do contain gluten, their gluten structure is composed of simpler proteins that break down more readily during traditional sourdough fermentation. Many consumers who experience mild gastrointestinal discomfort from industrial white bread report far better tolerance when consuming long-fermented heritage grains.

Despite these evident benefits, scaling the production of ancient grains involves notable hurdles. Their protective husks require specialised de-hulling equipment that is no longer standard in modern commercial milling infrastructure. Moreover, their yields per hectare are generally 30 to 50 percent lower than those of intensive modern hybrids, resulting in higher retail prices that currently restrict their accessibility to niche organic markets. Nonetheless, agricultural cooperatives throughout Europe and North America are collaborating with heritage seed banks to integrate ancient grain traits into modern breeding programmes, aiming to develop climate-resilient crops without sacrificing nutritional integrity.`,

      questions: [
        // Q1-5 — Sentence Completion (ONE WORD ONLY)
        {
          id: "r6q1",
          kind: "sentence-completion",
          text: "Q1. Early domestic crops had resilient ______ that guarded the seeds against pests.",
          hint: "ONE WORD ONLY",
          answer: ["husks", "husk"],
          explanation: "Paragraph 1 states early cultivars were characterised by 'tough husks that protected the internal seeds'.",
        },
        {
          id: "r6q2",
          kind: "sentence-completion",
          text: "Q2. During the mid-twentieth century, scientists bred ______ varieties of modern wheat.",
          hint: "ONE WORD ONLY",
          answer: ["dwarf"],
          explanation: "Paragraph 2 refers to 'high-yielding, dwarf varieties of modern bread wheat'.",
        },
        {
          id: "r6q3",
          kind: "sentence-completion",
          text: "Q3. Processing methods remove the germ and ______ from modern wheat, decreasing its nutritional value.",
          hint: "ONE WORD ONLY",
          answer: ["bran"],
          explanation: "Paragraph 3 states processing strips modern wheat of its 'nutrient-rich bran and germ'.",
        },
        {
          id: "r6q4",
          kind: "sentence-completion",
          text: "Q4. Quinoa and amaranth are able to grow well in ______ soils where commercial crops fail.",
          hint: "ONE WORD ONLY",
          answer: ["saline"],
          explanation: "Paragraph 4 explains quinoa and amaranth 'thrive in saline soils and high altitudes'.",
        },
        {
          id: "r6q5",
          kind: "sentence-completion",
          text: "Q5. Heritage grain proteins decompose more easily when processed using traditional sourdough ______.",
          hint: "ONE WORD ONLY",
          answer: ["fermentation"],
          explanation: "Paragraph 5 notes proteins 'break down more readily during traditional sourdough fermentation'.",
        },

        // Q6-9 — True / False / Not Given
        {
          id: "r6q6",
          kind: "tfng",
          text: "Q6. Modern wheat varieties have greater genetic diversity than ancient crops.",
          answer: "False",
          options: ["True", "False", "Not Given"],
          explanation: "Paragraph 1 notes that ancient grains retained substantial genetic diversity unlike modern strains.",
        },
        {
          id: "r6q7",
          kind: "tfng",
          text: "Q7. Quinoa was first grown in northern Europe before spreading to South America.",
          answer: "False",
          options: ["True", "False", "Not Given"],
          explanation: "Paragraph 1 states quinoa sustained empires in the Andes (South America), not northern Europe.",
        },
        {
          id: "r6q8",
          kind: "tfng",
          text: "Q8. Ancient wheat varieties are completely gluten-free.",
          answer: "False",
          options: ["True", "False", "Not Given"],
          explanation: "Paragraph 5 states 'ancient wheats do contain gluten', although with a simpler structure.",
        },
        {
          id: "r6q9",
          kind: "tfng",
          text: "Q9. Modern commercial mills frequently possess the specialized machinery required to de-hull ancient grains.",
          answer: "False",
          options: ["True", "False", "Not Given"],
          explanation: "Paragraph 6 mentions specialised de-hulling equipment is 'no longer standard in modern commercial milling infrastructure'.",
        },

        // Q10-13 — Short Answer (NO MORE THAN THREE WORDS AND/OR A NUMBER)
        {
          id: "r6q10",
          kind: "short-answer",
          text: "Q10. What percentage of global grain calorie consumption came from just three crops by 2000?",
          hint: "NO MORE THAN THREE WORDS AND/OR A NUMBER",
          answer: ["85 percent", "85%", "more than 85%"],
          explanation: "Paragraph 2 states 'more than 85 percent of all human caloric intake from grains was derived from just three staple crops'.",
        },
        {
          id: "r6q11",
          kind: "short-answer",
          text: "Q11. What biological pathogens are ancient grain kernels naturally shielded against?",
          hint: "NO MORE THAN THREE WORDS",
          answer: ["fungal pathogens", "fungi"],
          explanation: "Paragraph 4 explains their husk structures shield the kernel from 'fungal pathogens'.",
        },
        {
          id: "r6q12",
          kind: "short-answer",
          text: "Q12. What mineral nutrients are found in higher concentrations in emmer and spelt?",
          hint: "NO MORE THAN THREE WORDS",
          answer: ["zinc, magnesium, iron", "zinc magnesium iron"],
          explanation: "Paragraph 5 lists zinc, magnesium, and iron.",
        },
        {
          id: "r6q13",
          kind: "short-answer",
          text: "Q13. By what percentage are ancient grain yields typically lower than modern hybrid crops?",
          hint: "NO MORE THAN THREE WORDS AND/OR A NUMBER",
          answer: ["30 to 50 percent", "30-50%", "30 to 50%"],
          explanation: "Paragraph 6 mentions yields per hectare are generally 30 to 50 percent lower.",
        },
      ],
    },

    // ============================================================
    // PASSAGE 2 — Termite Architecture & Biomimicry (Q14 - Q26)
    // ============================================================
    {
      id: "p2",
      title: "Termite Architecture and Biomimetic Engineering",
      paragraphs: [
        {
          label: "A",
          text: "In the arid savannahs of southern Africa and northern Australia, Macrotermes termites construct towering spires of hardened soil that can exceed eight metres in height. These monumental earthen structures house millions of subterranean insects alongside their primary food source: subterranean fungal gardens that must be kept at a constant temperature of approximately 30°C and a near-saturated relative humidity. Despite external desert temperatures that fluctuate wildly from below freezing at night to over 45°C during the midday sun, the internal climate of the mound remains remarkably stable without the consumption of any mechanical power.",
        },
        {
          label: "B",
          text: "For decades, entomologists and architects accepted the classical 'thermosiphon hypothesis' proposed by Martin Lüscher in the 1950s. Lüscher argued that the metabolic heat generated by millions of active termites and their decomposing fungus beds created a rising plume of warm air in a central vertical chimney. As this heated air ascended, it was pushed outward through porous flutes in the mound's outer walls, releasing carbon dioxide and absorbing oxygen before cooling, sinking, and re-entering the bottom of the nest. However, recent micro-sensor studies led by biological engineer Scott Turner have revealed a far more dynamic picture.",
        },
        {
          label: "C",
          text: "Turner discovered that air currents within the mound do not circulate in a continuous, one-directional loop. Instead, termite mounds function analogously to external lungs. The outer, porous earthen walls are sensitive to external wind turbulence and subtle atmospheric pressure waves. When wind pulses strike the exterior flutes, air is rhythmically forced into and drawn out of the mound's internal chamber network. This process, termed 'respiratory gas exchange', mixes fresh ambient air with deep subterranean chambers while buffering the nest against extreme external temperature swings.",
        },
        {
          label: "D",
          text: "The architectural ingenuity of the termite mound has inspired pioneering developments in biomimetic architecture — the practice of emulating nature's time-tested designs to solve complex human engineering problems. The most famous early example is the Eastgate Centre, a major commercial complex and shopping mall constructed in Harare, Zimbabwe, in 1996. Designed by architect Mick Pearce in partnership with engineering firm Arup, the building dispenses entirely with traditional air conditioning systems, relying instead on passive climate regulation inspired directly by termite mounds.",
        },
        {
          label: "E",
          text: "The Eastgate Centre relies on a combination of high thermal mass concrete and an intricate array of vertical duct networks. Concrete absorbs heat during Harare's blistering daytime hours, preventing interior offices from warming excessively. At night, low-power electric fans pull cool evening air through the basement, flushing it through hollow floors and expelling warm air through rooftop chimneys. By dawn, the building's concrete core is thoroughly pre-cooled, ready to absorb the next day's thermal load. This passive approach consumes 35 percent less energy than conventional office buildings of equivalent dimensions, saving millions of dollars in utility expenses.",
        },
        {
          label: "F",
          text: "Building upon the lessons of Eastgate, contemporary architects in Europe and Asia are integrating Turner's respiratory model into cutting-edge urban structures. The Council House 2 (CH2) building in Melbourne, Australia, employs double-skin facade technology and automated timber shutters that breathe in response to micro-climate sensors. In Singapore, developers have created porous ceramic wall tiles that mimic the micro-tunnels of termite mounds, passively cooling building interiors through evaporative moisture exchange while reducing mechanical HVAC reliance by upwards of 40 percent.",
        },
        {
          label: "G",
          text: "As urban populations swell and global temperatures rise, the built environment accounts for nearly 40 percent of all global carbon emissions, primarily driven by mechanical cooling and heating. Emulating the passive ventilation, thermal dampening, and self-regulating geometry of social insect architecture offers a compelling blueprint for net-zero construction. What blind termites achieved through millions of years of evolutionary pressure is now providing human engineers with their most sophisticated sustainable solutions.",
        },
      ],

      questions: [
        // Q14-18 — Paragraph Matching (A-G)
        {
          id: "r6q14",
          kind: "paragraph-match",
          text: "Q14. An explanation of how modern urban architecture contributes significantly to global carbon output.",
          options: [
            { label: "A", text: "Savannah conditions & internal nest stability" },
            { label: "B", text: "The classical thermosiphon hypothesis" },
            { label: "C", text: "Turner's respiratory lung model" },
            { label: "D", text: "Introduction to biomimicry and Eastgate Centre" },
            { label: "E", text: "Eastgate Centre mechanical & thermal operations" },
            { label: "F", text: "Contemporary buildings applying respiratory concepts" },
            { label: "G", text: "Global carbon impact & future potential" },
          ],
          answer: "G",
          explanation: "Paragraph G states the built environment accounts for nearly 40 percent of global carbon emissions.",
        },
        {
          id: "r6q15",
          kind: "paragraph-match",
          text: "Q15. Reference to an older scientific theory about airflow that was later revised.",
          options: [
            { label: "A", text: "Savannah conditions & internal nest stability" },
            { label: "B", text: "The classical thermosiphon hypothesis" },
            { label: "C", text: "Turner's respiratory lung model" },
            { label: "D", text: "Introduction to biomimicry and Eastgate Centre" },
            { label: "E", text: "Eastgate Centre mechanical & thermal operations" },
            { label: "F", text: "Contemporary buildings applying respiratory concepts" },
            { label: "G", text: "Global carbon impact & future potential" },
          ],
          answer: "B",
          explanation: "Paragraph B discusses the 1950s 'thermosiphon hypothesis' by Martin Lüscher which was revised.",
        },
        {
          id: "r6q16",
          kind: "paragraph-match",
          text: "Q16. Details of specific temperature and humidity requirements inside the subterranean nest.",
          options: [
            { label: "A", text: "Savannah conditions & internal nest stability" },
            { label: "B", text: "The classical thermosiphon hypothesis" },
            { label: "C", text: "Turner's respiratory lung model" },
            { label: "D", text: "Introduction to biomimicry and Eastgate Centre" },
            { label: "E", text: "Eastgate Centre mechanical & thermal operations" },
            { label: "F", text: "Contemporary buildings applying respiratory concepts" },
            { label: "G", text: "Global carbon impact & future potential" },
          ],
          answer: "A",
          explanation: "Paragraph A states fungal gardens must be kept at approximately 30°C and near-saturated humidity.",
        },
        {
          id: "r6q17",
          kind: "paragraph-match",
          text: "Q17. Examples of innovative modern building projects in Australia and Asia.",
          options: [
            { label: "A", text: "Savannah conditions & internal nest stability" },
            { label: "B", text: "The classical thermosiphon hypothesis" },
            { label: "C", text: "Turner's respiratory lung model" },
            { label: "D", text: "Introduction to biomimicry and Eastgate Centre" },
            { label: "E", text: "Eastgate Centre mechanical & thermal operations" },
            { label: "F", text: "Contemporary buildings applying respiratory concepts" },
            { label: "G", text: "Global carbon impact & future potential" },
          ],
          answer: "F",
          explanation: "Paragraph F mentions Council House 2 in Melbourne and porous ceramic tiles in Singapore.",
        },
        {
          id: "r6q18",
          kind: "paragraph-match",
          text: "Q18. A comparison between the outer structure of a termite mound and a mammalian organ.",
          options: [
            { label: "A", text: "Savannah conditions & internal nest stability" },
            { label: "B", text: "The classical thermosiphon hypothesis" },
            { label: "C", text: "Turner's respiratory lung model" },
            { label: "D", text: "Introduction to biomimicry and Eastgate Centre" },
            { label: "E", text: "Eastgate Centre mechanical & thermal operations" },
            { label: "F", text: "Contemporary buildings applying respiratory concepts" },
            { label: "G", text: "Global carbon impact & future potential" },
          ],
          answer: "C",
          explanation: "Paragraph C compares termite mounds to 'external lungs'.",
        },

        // Q19-22 — Sentence Completion (NO MORE THAN TWO WORDS)
        {
          id: "r6q19",
          kind: "sentence-completion",
          text: "Q19. The fungal colonies farmed by termites serve as their main ______.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["food source"],
          explanation: "Paragraph A describes fungal gardens as their 'primary food source'.",
        },
        {
          id: "r6q20",
          kind: "sentence-completion",
          text: "Q20. Scott Turner used ______ to uncover how air currents actually move inside mounds.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["micro-sensor studies", "micro-sensors"],
          explanation: "Paragraph B refers to 'recent micro-sensor studies led by biological engineer Scott Turner'.",
        },
        {
          id: "r6q21",
          kind: "sentence-completion",
          text: "Q21. The Eastgate Centre in Zimbabwe does not have conventional ______ systems.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["air conditioning"],
          explanation: "Paragraph D notes the building dispenses entirely with traditional air conditioning systems.",
        },
        {
          id: "r6q22",
          kind: "sentence-completion",
          text: "Q22. During cooler night-time hours, fans flush air through ______ to cool the structure.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["hollow floors"],
          explanation: "Paragraph E explains evening air is pulled through the basement and flushed through hollow floors.",
        },

        // Q23-26 — Summary Completion (NO MORE THAN TWO WORDS)
        {
          id: "r6q23",
          kind: "sentence-completion",
          text: "Q23. Biomimicry summary: The Eastgate Centre relies on concrete with high ______ to absorb daytime heat.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["thermal mass"],
          explanation: "Paragraph E highlights 'high thermal mass concrete'.",
        },
        {
          id: "r6q24",
          kind: "sentence-completion",
          text: "Q24. Compared to standard commercial complexes, Eastgate uses ______ less energy.",
          hint: "NO MORE THAN TWO WORDS AND/OR A NUMBER",
          answer: ["35 percent", "35%"],
          explanation: "Paragraph E states it consumes 35 percent less energy.",
        },
        {
          id: "r6q25",
          kind: "sentence-completion",
          text: "Q25. In Melbourne, Council House 2 is equipped with ______ that open and close based on environmental data.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["timber shutters", "automated timber shutters"],
          explanation: "Paragraph F mentions automated timber shutters responding to micro-climate sensors.",
        },
        {
          id: "r6q26",
          kind: "sentence-completion",
          text: "Q26. Singaporean engineers have produced ______ that facilitate natural cooling through evaporation.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["ceramic wall tiles", "ceramic tiles"],
          explanation: "Paragraph F discusses porous ceramic wall tiles in Singapore.",
        },
      ],
    },

    // ============================================================
    // PASSAGE 3 — The Psychology of Deep Time (Q27 - Q40)
    // ============================================================
    {
      id: "p3",
      title: "The Psychology of Deep Time and Long-Term Decision Making",
      text: `Humanity currently stands at a perilous evolutionary crossroads. We wield technological powers capable of reshaping the earth's biosphere and altering geological epochs, yet our cognitive decision-making architecture remains largely calibrated for the immediate survival concerns of our hunter-gatherer ancestors. Cognitive scientists and evolutionary psychologists refer to this chronic short-term bias as 'temporal discounting' or 'present bias' — the innate psychological tendency to disproportionately value instant rewards while heavily discounting long-term costs and future benefits.

In classical behavioral economics, researcher George Ainslie demonstrated that human decision-making follows a hyperbolic discounting curve rather than a rational, linear decay. When faced with a choice between receiving $100 today versus $110 tomorrow, most individuals will impulsively take the immediate sum. However, when the exact same choice is projected twelve months into the future — choosing between $100 in 365 days or $110 in 366 days — almost everyone chooses the larger sum. Neuroimaging experiments conducted by neuroscientist Samuel McClure reveal the neurological mechanism behind this paradox: immediate rewards activate the primitive, emotion-driven limbic system and ventral striatum, whereas delayed choices engage the rational, analytical prefrontal cortex. When an immediate gratification cue is present, the limbic system routinely hijacks deliberate cognitive processing.

This evolutionary blind spot has catastrophic ramifications for complex existential challenges such as biodiversity collapse, nuclear waste management, and climate change. As sociologist Roman Krznaric argues, modern financial institutions and democratic political structures institutionalise this cognitive defect. Quarterly earnings reports, 24-hour digital news cycles, and 4-year electoral cycles create an 'iron cage of short-termism' that renders long-term intergenerational planning politically disadvantageous. Future generations, who will inherit the fallout of today's resource exhaustion, hold no political franchise, no legal standing, and no purchasing power in current market economies.

To counter this temporal myopia, philosophers and social innovators advocate cultivating what is termed 'Cathedral Thinking'. The concept derives from the master stonemasons of medieval Europe who laid the foundations for magnificent architectural monuments knowing with absolute certainty that they would not live to witness their completion; the construction of Notre-Dame de Paris, for example, spanned nearly two centuries across multiple generations of artisans. Contemporary philosopher Toby Ord emphasizes that extending our moral circle across time is the defining ethical challenge of our era. Ord maintains that anthropogenic existential risks cannot be mitigated through technological fixes alone; they demand an expansion of our collective temporal empathy.

Encouragingly, novel institutional and neurological interventions are beginning to demonstrate practical success in overcoming present bias. In experimental trials led by social psychologist Hal Hershfield, participants who interacted with photorealistic, digitally aged virtual avatars of their future 70-year-old selves subsequently allocated more than twice as much money into long-term retirement savings accounts compared to control groups. Hershfield’s findings indicate that temporal discounting is fundamentally an empathy deficit: we perceive our future selves as distant strangers rather than extensions of our continuous identity.

On an institutional level, progressive jurisdictions are developing legal mechanisms to formalise long-term accountability. In 2015, the Parliament of Wales passed the pioneering 'Well-being of Future Generations Act', creating an independent statutory commissioner legally empowered to review public infrastructure projects and veto legislation that harms the ecological or socio-economic interests of citizens living fifty years hence. By institutionalising future advocacy into constitutional law, societies can begin to dismantle the cognitive shackles of short-termism and build a civilization worthy of its descendants.`,

      wordBank: [
        { label: "A", text: "rational" },
        { label: "B", text: "emotional" },
        { label: "C", text: "temporary" },
        { label: "D", text: "diminished" },
        { label: "E", text: "beneficial" },
        { label: "F", text: "immediate" },
        { label: "G", text: "indifferent" },
      ],

      questions: [
        // Q27-30 — Multiple Choice (A, B, C, D)
        {
          id: "r6q27",
          kind: "mcq",
          text: "Q27. In paragraph 1, what does the writer suggest about human decision-making?",
          answer: "B",
          options: [
            { label: "A", text: "It has advanced at the same rate as modern technology." },
            { label: "B", text: "It is still influenced by our ancient ancestors' survival instincts." },
            { label: "C", text: "It is primarily shaped by formal educational background." },
            { label: "D", text: "It is better suited for global challenges than localized problems." },
          ],
          explanation: "Paragraph 1 notes our cognitive architecture 'remains largely calibrated for the immediate survival concerns of our hunter-gatherer ancestors'.",
        },
        {
          id: "r6q28",
          kind: "mcq",
          text: "Q28. Neuroimaging studies by Samuel McClure showed that immediate choices:",
          answer: "A",
          options: [
            { label: "A", text: "trigger the primitive limbic areas of the brain." },
            { label: "B", text: "stimulate the analytical prefrontal cortex first." },
            { label: "C", text: "generate linear rational responses." },
            { label: "D", text: "suppress emotional feelings completely." },
          ],
          explanation: "Paragraph 2 states immediate rewards activate 'the primitive, emotion-driven limbic system'.",
        },
        {
          id: "r6q29",
          kind: "mcq",
          text: "Q29. According to Roman Krznaric, modern political systems fail to plan long-term because:",
          answer: "C",
          options: [
            { label: "A", text: "they lack the technological data to forecast risks." },
            { label: "B", text: "scientific advisory panels have too much legal authority." },
            { label: "C", text: "short-term election cycles discourage intergenerational investment." },
            { label: "D", text: "the public opposes long-term environmental legislation." },
          ],
          explanation: "Paragraph 3 notes electoral cycles create an 'iron cage of short-termism' making long-term planning disadvantageous.",
        },
        {
          id: "r6q30",
          kind: "mcq",
          text: "Q30. The example of medieval cathedral builders illustrates that:",
          answer: "D",
          options: [
            { label: "A", text: "modern engineering is inferior to historic craftsmanship." },
            { label: "B", text: "religious devotion is required for major achievements." },
            { label: "C", text: "projects should only begin if completion is guaranteed." },
            { label: "D", text: "humans are capable of initiating work that outlives their own generation." },
          ],
          explanation: "Paragraph 4 explains builders laid foundations knowing they would not live to witness completion.",
        },

        // Q31-35 — Summary Completion with Word Bank (choose A-G)
        {
          id: "r6q31",
          kind: "summary-wordbank",
          text: "Q31. Hyperbolic discounting summary: When presented with ______ rewards, human choices are often impulsive.",
          answer: "F",
          explanation: "Text notes immediate gratification leads people to choose short-term rewards (F: immediate).",
        },
        {
          id: "r6q32",
          kind: "summary-wordbank",
          text: "Q32. Brain scans demonstrate that immediate temptations ignite ______ brain regions.",
          answer: "B",
          explanation: "Text notes the limbic system is emotion-driven (B: emotional).",
        },
        {
          id: "r6q33",
          kind: "summary-wordbank",
          text: "Q33. Conversely, when outcomes are postponed, decisions become more ______ and logical.",
          answer: "A",
          explanation: "Text states delayed choices engage the rational prefrontal cortex (A: rational).",
        },
        {
          id: "r6q34",
          kind: "summary-wordbank",
          text: "Q34. Unfortunately, consideration for unborn generations is largely ______ in current financial markets.",
          answer: "D",
          explanation: "Future generations hold no power or legal standing (D: diminished).",
        },
        {
          id: "r6q35",
          kind: "summary-wordbank",
          text: "Q35. Digital visual simulations of aging have shown to be ______ in increasing retirement contributions.",
          answer: "E",
          explanation: "The avatars doubled money allocated to retirement savings (E: beneficial).",
        },

        // Q36-40 — Person / Researcher Matching
        {
          id: "r6q36",
          kind: "person-match",
          text: "Q36. Illustrated how hyperbolic discounting curves explain non-linear financial decisions.",
          options: [
            { label: "A", text: "George Ainslie" },
            { label: "B", text: "Samuel McClure" },
            { label: "C", text: "Roman Krznaric" },
            { label: "D", text: "Toby Ord" },
            { label: "E", text: "Hal Hershfield" },
          ],
          answer: "A",
          explanation: "Paragraph 2 states researcher George Ainslie demonstrated human decision-making follows hyperbolic discounting.",
        },
        {
          id: "r6q37",
          kind: "person-match",
          text: "Q37. Used fMRI neuroimaging to identify the distinct brain systems activated by immediate vs delayed options.",
          options: [
            { label: "A", text: "George Ainslie" },
            { label: "B", text: "Samuel McClure" },
            { label: "C", text: "Roman Krznaric" },
            { label: "D", text: "Toby Ord" },
            { label: "E", text: "Hal Hershfield" },
          ],
          answer: "B",
          explanation: "Paragraph 2 details neuroimaging experiments by Samuel McClure.",
        },
        {
          id: "r6q38",
          kind: "person-match",
          text: "Q38. Argued that modern democratic institutions lock society into an iron cage of short-termism.",
          options: [
            { label: "A", text: "George Ainslie" },
            { label: "B", text: "Samuel McClure" },
            { label: "C", text: "Roman Krznaric" },
            { label: "D", text: "Toby Ord" },
            { label: "E", text: "Hal Hershfield" },
          ],
          answer: "C",
          explanation: "Paragraph 3 explicitly references sociologist Roman Krznaric.",
        },
        {
          id: "r6q39",
          kind: "person-match",
          text: "Q39. Stressed that surviving existential threats demands extending our moral circle across time.",
          options: [
            { label: "A", text: "George Ainslie" },
            { label: "B", text: "Samuel McClure" },
            { label: "C", text: "Roman Krznaric" },
            { label: "D", text: "Toby Ord" },
            { label: "E", text: "Hal Hershfield" },
          ],
          answer: "D",
          explanation: "Paragraph 4 details philosopher Toby Ord's views on ethical challenges and temporal empathy.",
        },
        {
          id: "r6q40",
          kind: "person-match",
          text: "Q40. Demonstrated that interacting with aged avatars doubled people's long-term financial savings.",
          options: [
            { label: "A", text: "George Ainslie" },
            { label: "B", text: "Samuel McClure" },
            { label: "C", text: "Roman Krznaric" },
            { label: "D", text: "Toby Ord" },
            { label: "E", text: "Hal Hershfield" },
          ],
          answer: "E",
          explanation: "Paragraph 5 details social psychologist Hal Hershfield's avatar experiment.",
        },
      ],
    },
  ],
};

export default readingTest6;