export default {
  id: "reading-full-1",
  type: "reading",
  title: "Academic Reading — Test 1",
  description: "3 passages · 40 questions · 60 minutes. TFNG, MCQ, gap-fill, summary completion.",
  durationMin: 60,
  questions: 40,
  difficulty: "Medium",
  passages: [
    {
      id: "r1p1",
      title: "The Science of Sleep",
      text: `Sleep is one of the most fundamental biological processes, yet it remains one of the least understood. For decades, scientists believed that sleep was simply a period of rest during which the brain shut down. Modern research, however, has revealed that the sleeping brain is extraordinarily active, performing critical maintenance tasks that are essential for physical health, cognitive function, and emotional regulation.

The human sleep cycle consists of two main types: rapid eye movement (REM) sleep and non-REM sleep. Non-REM sleep is further divided into three stages, each progressively deeper than the last. Stage 1 is a light transitional phase lasting only a few minutes. Stage 2 involves a drop in body temperature and heart rate as the body prepares for deep sleep. Stage 3, also known as slow-wave sleep, is the most restorative phase, during which the body repairs tissues, builds bone and muscle, and strengthens the immune system.

REM sleep, which typically begins about 90 minutes after falling asleep, is the stage most closely associated with vivid dreaming. During REM, brain activity increases to levels comparable to wakefulness, yet the body's voluntary muscles become temporarily paralysed — a protective mechanism that prevents people from physically acting out their dreams. Researchers at the University of California found that REM sleep plays a crucial role in memory consolidation, particularly for procedural and emotional memories.

The consequences of sleep deprivation are severe and well-documented. A landmark study published in The Lancet demonstrated that individuals who consistently slept fewer than six hours per night had a 48% higher risk of developing coronary heart disease compared to those who slept seven to eight hours. Cognitive performance deteriorates rapidly: after just 24 hours without sleep, reaction times slow by an amount equivalent to a blood alcohol concentration of 0.10%, which exceeds the legal driving limit in most countries.

Despite overwhelming evidence of its importance, modern society continues to undervalue sleep. The widespread use of artificial lighting, electronic screens, and shift work has disrupted natural circadian rhythms for billions of people. The World Health Organisation has declared sleep loss a global epidemic, estimating that over one-third of adults in industrialised nations do not get the recommended seven to nine hours of sleep per night. Public health experts argue that sleep education should be integrated into school curricula alongside nutrition and exercise.`,
      questions: [
        { id: "r1q1", kind: "tfng", text: "Scientists have always understood that the brain remains highly active during sleep.", answer: "False", options: ["True", "False", "Not Given"], explanation: "For decades, scientists believed the brain shut down during sleep." },
        { id: "r1q2", kind: "tfng", text: "Stage 3 non-REM sleep is when the body repairs tissues and strengthens the immune system.", answer: "True", options: ["True", "False", "Not Given"], explanation: "Stage 3 is described as the most restorative phase for tissue repair and immune strengthening." },
        { id: "r1q3", kind: "tfng", text: "REM sleep occurs immediately after a person falls asleep.", answer: "False", options: ["True", "False", "Not Given"], explanation: "REM typically begins about 90 minutes after falling asleep." },
        { id: "r1q4", kind: "tfng", text: "Muscle paralysis during REM sleep serves a protective function.", answer: "True", options: ["True", "False", "Not Given"], explanation: "It is described as a protective mechanism to prevent acting out dreams." },
        { id: "r1q5", kind: "tfng", text: "The University of California study focused exclusively on elderly patients.", answer: "Not Given", options: ["True", "False", "Not Given"], explanation: "The passage mentions the findings but does not specify participant age." },
        { id: "r1q6", kind: "mcq", text: "According to The Lancet study, sleeping fewer than six hours increases coronary heart disease risk by:", answer: "48%", options: ["25%", "36%", "48%", "62%"], explanation: "The passage states a 48% higher risk." },
        { id: "r1q7", kind: "mcq", text: "After 24 hours without sleep, cognitive impairment is comparable to:", answer: "A blood alcohol level of 0.10%", options: ["A mild headache", "A blood alcohol level of 0.10%", "A common cold", "A blood alcohol level of 0.05%"], explanation: "Reaction times slow equivalent to 0.10% blood alcohol." },
        { id: "r1q8", kind: "gap", text: "The WHO estimates that over ___ of adults in industrialised nations do not get enough sleep.", answer: "one-third", explanation: "The passage states over one-third of adults." },
        { id: "r1q9", kind: "gap", text: "The recommended amount of sleep for adults is ___ to nine hours per night.", answer: "seven", explanation: "The passage mentions seven to nine hours." },
        { id: "r1q10", kind: "mcq", text: "What has the WHO declared sleep loss to be?", answer: "A global epidemic", options: ["A minor concern", "A global epidemic", "A genetic disorder", "A lifestyle choice"], explanation: "The WHO has declared it a global epidemic." },
        { id: "r1q11", kind: "tfng", text: "Public health experts suggest that sleep education should be taught in schools.", answer: "True", options: ["True", "False", "Not Given"], explanation: "Experts argue sleep education should be integrated into school curricula." },
        { id: "r1q12", kind: "gap", text: "Stage 1 of non-REM sleep is described as a light ___ phase.", answer: "transitional", explanation: "Stage 1 is a light transitional phase." },
        { id: "r1q13", kind: "mcq", text: "Which factor is NOT mentioned as disrupting natural circadian rhythms?", answer: "Caffeine consumption", options: ["Artificial lighting", "Electronic screens", "Shift work", "Caffeine consumption"], explanation: "Artificial lighting, screens, and shift work are mentioned but not caffeine." }
      ]
    },
    {
      id: "r1p2",
      title: "The Rise of Megacities",
      text: `In 1950, only two cities on Earth had populations exceeding ten million: New York and Tokyo. By 2025, the United Nations projects that there will be at least 43 megacities, the vast majority located in Asia and Africa. This unprecedented wave of urbanisation represents one of the most significant demographic shifts in human history, bringing both extraordinary opportunities and formidable challenges.

The primary driver of megacity growth is rural-to-urban migration. In developing nations, millions of people leave agricultural communities each year in search of better employment, education, and healthcare. Cities like Lagos, Dhaka, and Mumbai are expanding at rates of over 3% annually, adding the equivalent of a small European city's population every twelve months. This rapid influx places immense pressure on infrastructure that was never designed to accommodate such numbers.

Housing is perhaps the most visible crisis. In Mumbai, approximately 40% of the population lives in informal settlements known as slums, where families of six or more may share a single room of less than ten square metres. Despite government initiatives such as India's Pradhan Mantri Awas Yojana, which aims to construct 20 million affordable homes by 2024, the pace of construction consistently falls behind demand.

Transportation presents an equally daunting challenge. Jakarta, a city of over 30 million people, has one of the worst traffic congestion problems in the world. A 2019 study estimated that traffic jams cost the Indonesian economy approximately $6.5 billion annually in lost productivity and fuel waste. The city's new Mass Rapid Transit system, inaugurated in 2019, is a step forward but currently serves only a fraction of the population.

However, megacities are not merely centres of dysfunction. They are also engines of economic growth and innovation. Tokyo, the world's largest metropolitan area with over 37 million residents, generates a GDP larger than that of most nations. Shanghai's Pudong district, which was farmland as recently as 1990, is now one of the world's leading financial centres. Economists at the McKinsey Global Institute estimate that the world's 600 largest cities will account for 60% of global GDP growth by 2030.

The environmental impact of megacities is paradoxical. On one hand, dense urban areas produce significantly lower per-capita carbon emissions than sprawling suburbs because residents rely more on public transport and live in smaller, more energy-efficient dwellings. On the other hand, the sheer concentration of industry, vehicles, and waste in megacities creates severe local pollution. New Delhi regularly records air quality index readings above 500, which is more than ten times the level considered safe by the WHO.

Urban planners increasingly advocate for the concept of the "15-minute city," in which residents can access work, schools, healthcare, and recreation within a 15-minute walk or bicycle ride. Paris, Melbourne, and Portland have all adopted versions of this model. Critics, however, argue that the 15-minute city concept is unrealistic for rapidly growing megacities in the developing world, where infrastructure deficits are too vast to be solved by urban design alone.`,
      questions: [
        { id: "r1q14", kind: "mcq", text: "In 1950, which two cities had populations over ten million?", answer: "New York and Tokyo", options: ["London and Paris", "New York and Tokyo", "Tokyo and Shanghai", "New York and London"], explanation: "The opening sentence names New York and Tokyo." },
        { id: "r1q15", kind: "gap", text: "By 2025, the UN projects there will be at least ___ megacities.", answer: "43", explanation: "The UN projects at least 43 megacities." },
        { id: "r1q16", kind: "tfng", text: "Most future megacities will be located in Europe and North America.", answer: "False", options: ["True", "False", "Not Given"], explanation: "The vast majority will be in Asia and Africa." },
        { id: "r1q17", kind: "tfng", text: "Cities like Lagos and Dhaka are growing at over 3% per year.", answer: "True", options: ["True", "False", "Not Given"], explanation: "The passage states expansion rates of over 3% annually." },
        { id: "r1q18", kind: "gap", text: "In Mumbai, approximately ___% of the population lives in slums.", answer: "40", explanation: "Approximately 40% of Mumbai's population lives in slums." },
        { id: "r1q19", kind: "mcq", text: "India's Pradhan Mantri Awas Yojana aims to build how many affordable homes?", answer: "20 million", options: ["10 million", "15 million", "20 million", "50 million"], explanation: "The programme aims to construct 20 million affordable homes." },
        { id: "r1q20", kind: "gap", text: "Traffic congestion in Jakarta costs the Indonesian economy approximately $___ billion annually.", answer: "6.5", explanation: "The study estimated approximately $6.5 billion annually." },
        { id: "r1q21", kind: "tfng", text: "Tokyo's metropolitan GDP is larger than that of most countries.", answer: "True", options: ["True", "False", "Not Given"], explanation: "Tokyo generates a GDP larger than most nations." },
        { id: "r1q22", kind: "tfng", text: "Shanghai's Pudong district has been a financial centre since the 1970s.", answer: "False", options: ["True", "False", "Not Given"], explanation: "Pudong was farmland as recently as 1990." },
        { id: "r1q23", kind: "mcq", text: "According to McKinsey, the world's 600 largest cities will account for what share of global GDP growth by 2030?", answer: "60%", options: ["40%", "50%", "60%", "75%"], explanation: "McKinsey estimates 60% of global GDP growth." },
        { id: "r1q24", kind: "tfng", text: "Dense urban areas produce higher per-capita carbon emissions than suburbs.", answer: "False", options: ["True", "False", "Not Given"], explanation: "Dense areas produce significantly lower per-capita emissions." },
        { id: "r1q25", kind: "gap", text: "New Delhi regularly records air quality readings above ___, ten times the WHO safe level.", answer: "500", explanation: "New Delhi records air quality index readings above 500." },
        { id: "r1q26", kind: "mcq", text: "Which city is NOT mentioned as adopting the 15-minute city model?", answer: "Tokyo", options: ["Paris", "Melbourne", "Portland", "Tokyo"], explanation: "Paris, Melbourne, and Portland are mentioned but not Tokyo." }
      ]
    },
    {
      id: "r1p3",
      title: "The Ethics of Genetic Engineering",
      text: `The ability to edit the genetic code of living organisms was once the domain of science fiction. Today, it is a laboratory reality. The development of CRISPR-Cas9 technology in 2012 by Jennifer Doudna and Emmanuelle Charpentier — who were awarded the Nobel Prize in Chemistry in 2020 — has made gene editing faster, cheaper, and more precise than any previous method. While the potential benefits are enormous, the ethical implications have ignited fierce debate among scientists, policymakers, and the public.

CRISPR works by using a guide RNA molecule to locate a specific sequence of DNA within a cell and then employing the Cas9 enzyme to cut the DNA at that precise location. Once the cut is made, the cell's natural repair mechanisms can be harnessed to delete, replace, or insert genetic material. The process is so straightforward that a basic CRISPR kit can now be purchased online for under $200, raising concerns about unregulated experimentation.

In medicine, the promise of CRISPR is extraordinary. Clinical trials are already underway for sickle cell disease, a painful and life-shortening genetic disorder that affects millions of people worldwide. In 2023, the UK's Medicines and Healthcare products Regulatory Agency became the first in the world to approve a CRISPR-based therapy, Casgevy, for the treatment of sickle cell disease and transfusion-dependent beta-thalassemia. Early results have been remarkable, with many patients achieving long-term remission after a single treatment.

However, the technology's most controversial application lies in germline editing — modifications to embryos, sperm, or eggs that would be passed down to future generations. In 2018, Chinese biophysicist He Jiankui shocked the world by announcing that he had used CRISPR to edit the genomes of twin baby girls to make them resistant to HIV. The experiment was almost universally condemned by the scientific community. He was subsequently sentenced to three years in prison by a Chinese court for violating medical regulations.

The He Jiankui case exposed the inadequacy of existing international governance frameworks. While many countries have laws restricting germline editing, enforcement varies enormously, and there is no binding international treaty. The World Health Organisation established an expert advisory committee in 2019 to develop global standards, but its recommendations remain non-binding. Critics argue that without enforceable regulations, a genetic arms race between nations is inevitable.

Beyond human applications, CRISPR is transforming agriculture. Scientists have developed gene-edited crops that are resistant to drought, disease, and pests without introducing foreign DNA, which distinguishes them from traditional genetically modified organisms. In Japan, a CRISPR-edited tomato with elevated levels of the calming neurotransmitter GABA went on sale in 2021, becoming the first gene-edited food product to reach consumers. Proponents argue that such innovations are essential to feeding a global population projected to reach 10 billion by 2050.

Opponents, however, raise concerns about unintended ecological consequences. Gene drives — a CRISPR application that forces a genetic modification to spread rapidly through an entire wild population — could theoretically be used to eliminate malaria-carrying mosquitoes. But ecologists warn that removing an entire species from an ecosystem could trigger unpredictable cascading effects on food chains and biodiversity.

The philosophical dimension of the debate is equally complex. If genetic editing becomes safe and widely available, it could deepen existing social inequalities. Wealthy families might use the technology to enhance their children's intelligence, physical appearance, or athletic ability, creating what ethicists call a genetic divide between the rich and the poor. The philosopher Michael Sandel has argued that such practices would fundamentally alter the meaning of human achievement, replacing effort and merit with biological engineering.`,
      questions: [
        { id: "r1q27", kind: "mcq", text: "Who developed CRISPR-Cas9 technology?", answer: "Jennifer Doudna and Emmanuelle Charpentier", options: ["Watson and Crick", "Doudna and Charpentier", "Venter and Mullis", "He Jiankui and Mitalipov"], explanation: "Doudna and Charpentier developed CRISPR in 2012." },
        { id: "r1q28", kind: "gap", text: "A basic CRISPR kit can be purchased online for under $___.", answer: "200", explanation: "A basic kit costs under $200." },
        { id: "r1q29", kind: "tfng", text: "The UK was the first country to approve a CRISPR-based therapy.", answer: "True", options: ["True", "False", "Not Given"], explanation: "The UK's regulatory agency became the first in the world to approve Casgevy." },
        { id: "r1q30", kind: "mcq", text: "What was the name of the first approved CRISPR therapy?", answer: "Casgevy", options: ["Casgevy", "Zynteglo", "Luxturna", "Kymriah"], explanation: "The therapy is named Casgevy." },
        { id: "r1q31", kind: "tfng", text: "He Jiankui edited the genomes of triplet babies.", answer: "False", options: ["True", "False", "Not Given"], explanation: "He edited twin baby girls, not triplets." },
        { id: "r1q32", kind: "gap", text: "He Jiankui was sentenced to ___ years in prison.", answer: "three", explanation: "He was sentenced to three years." },
        { id: "r1q33", kind: "tfng", text: "The WHO's recommendations on germline editing are legally binding on all member states.", answer: "False", options: ["True", "False", "Not Given"], explanation: "The recommendations remain non-binding." },
        { id: "r1q34", kind: "mcq", text: "What distinguishes CRISPR-edited crops from traditional GMOs?", answer: "They do not introduce foreign DNA", options: ["They grow faster", "They do not introduce foreign DNA", "They require more water", "They are always organic"], explanation: "They are modified without introducing foreign DNA." },
        { id: "r1q35", kind: "gap", text: "The CRISPR-edited tomato sold in Japan contained elevated levels of the neurotransmitter ___.", answer: "GABA", explanation: "The tomato had elevated levels of GABA." },
        { id: "r1q36", kind: "tfng", text: "Gene drives could potentially be used to eliminate malaria-carrying mosquitoes.", answer: "True", options: ["True", "False", "Not Given"], explanation: "Gene drives could theoretically eliminate malaria-carrying mosquitoes." },
        { id: "r1q37", kind: "mcq", text: "What does the term 'genetic divide' refer to?", answer: "Inequality between rich and poor in access to genetic enhancement", options: ["DNA vs RNA differences", "Inequality between rich and poor in access to genetic enhancement", "Human vs animal genomes", "Gene separation during cell division"], explanation: "It refers to wealthy families enhancing children, creating inequality." },
        { id: "r1q38", kind: "tfng", text: "Michael Sandel supports the widespread use of genetic enhancement in children.", answer: "False", options: ["True", "False", "Not Given"], explanation: "Sandel argued such practices would fundamentally alter the meaning of human achievement." },
        { id: "r1q39", kind: "gap", text: "The global population is projected to reach ___ billion by 2050.", answer: "10", explanation: "The population is projected to reach 10 billion by 2050." },
        { id: "r1q40", kind: "mcq", text: "In what year was CRISPR-Cas9 technology developed?", answer: "2012", options: ["2005", "2008", "2012", "2018"], explanation: "CRISPR-Cas9 was developed in 2012." }
      ]
    }
  ]
};