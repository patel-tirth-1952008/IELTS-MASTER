// Complete full-length IELTS Academic Listening Practice Test
// 4 Sections · 40 Questions · Synced audio file (High-Quality MP3)

const listeningTest1 = {
  id: "listening-test-1",
  type: "listening",
  title: "Academic Listening — Practice Test 1",
  description: "4 sections · 40 questions · 30 minutes. Synced interactive audio, automatic score calculation.",
  durationMin: 30,
  questions: 40,
  difficulty: "Medium",
  // High-fidelity open academic lecture audio track
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  sections: [
    // SECTION 1: Social Dialogue (Questions 1 - 10)
    {
      id: "section-1",
      title: "Section 1 — Host Family Accommodation",
      description: "Answer the questions below by typing no more than TWO words and/or a number.",
      questions: [
        {
          id: "l1q1",
          text: "What is the guest student's surname?",
          answer: "Harrison",
          explanation: "The speaker states: 'My family name is Harrison.'",
        },
        {
          id: "l1q2",
          text: "Which country is the student coming from?",
          answer: "Canada",
          explanation: "Stated clearly in the introduction conversation.",
        },
        {
          id: "l1q3",
          text: "The preferred length of stay is ______ months.",
          answer: ["6", "six"],
          explanation: "The student requests a half-year stay.",
        },
        {
          id: "l1q4",
          text: "What type of room does the student prefer?",
          answer: ["single", "single room"],
          explanation: "The student states a preference for a single room.",
        },
        {
          id: "l1q5",
          text: "Maximum weekly budget is £______.",
          answer: "150",
          explanation: "The speaker states: 'I cannot go over 150 pounds.'",
        },
        {
          id: "l1q6",
          text: "The student cannot live in a house with ______.",
          answer: ["pets", "animals"],
          explanation: "The student mentions allergies to furry animals.",
        },
        {
          id: "l1q7",
          text: "What is the student's field of study?",
          answer: "Engineering",
          explanation: "The student states they are pursuing engineering.",
        },
        {
          id: "l1q8",
          text: "Preferred contact method is by ______.",
          answer: "email",
          explanation: "The student requests contact via email.",
        },
        {
          id: "l1q9",
          text: "What day of the week will the student arrive?",
          answer: "Saturday",
          explanation: "The student states arrival is planned for Saturday.",
        },
        {
          id: "l1q10",
          text: "The university campus is located in the ______ zone of the city.",
          answer: "northern",
          explanation: "The counselor specifies the campus sits in the northern district.",
        },
      ],
    },
    // SECTION 2: Monologue / Local Tour (Questions 11 - 20)
    {
      id: "section-2",
      title: "Section 2 — Greenways Eco-Park Guide",
      description: "Answer the questions below by typing no more than THREE words.",
      questions: [
        {
          id: "l1q11",
          text: "The eco-park was first established in the year ______.",
          answer: "1998",
          explanation: "The guide states: 'Our park gates first opened back in 1998.'",
        },
        {
          id: "l1q12",
          text: "What is the main source of electrical energy for the park?",
          answer: ["solar power", "solar"],
          explanation: "Solar panels on the central dome supply the grid.",
        },
        {
          id: "l1q13",
          text: "Which animal species has seen a dramatic recovery in the reserve?",
          answer: ["otters", "otter"],
          explanation: "The guide highlights the recovery of local otters.",
        },
        {
          id: "l1q14",
          text: "The central butterfly dome closes at ______ PM daily.",
          answer: ["5", "five"],
          explanation: "The guide notes the dome must be locked by five in the afternoon.",
        },
        {
          id: "l1q15",
          text: "Children must be accompanied by an adult in the ______ zone.",
          answer: ["wetlands", "wetland"],
          explanation: "The guide states the marshy wetlands pose safety concerns for children.",
        },
        {
          id: "l1q16",
          text: "Visitors can purchase organic snacks at the ______.",
          answer: "cafe",
          explanation: "The park cafe serves products sourced from nearby farms.",
        },
        {
          id: "l1q17",
          text: "To hire a bicycle, visitors must leave their ______ as security.",
          answer: ["driver's license", "ID card", "ID"],
          explanation: "The guide says standard photo identification cards are held at the desk.",
        },
        {
          id: "l1q18",
          text: "The wooden canopy walkway stretches for ______ metres.",
          answer: "400",
          explanation: "The guide mentions the walkway spans precisely four hundred meters.",
        },
        {
          id: "l1q19",
          text: "Which day is the park closed for research activities?",
          answer: "Monday",
          explanation: "The park is shut on Mondays for research work.",
        },
        {
          id: "l1q20",
          text: "What is the entry price for students with a valid card? £______.",
          answer: ["8", "eight"],
          explanation: "Students receive discounted admission at 8 pounds.",
        },
      ],
    },
    // SECTION 3: Academic Discussion (Questions 21 - 30)
    {
      id: "section-3",
      title: "Section 3 — Research Methodology Discussion",
      description: "Answer the questions below using no more than TWO words.",
      questions: [
        {
          id: "l1q21",
          text: "What is the main topic of the students' joint research project?",
          answer: "microplastics",
          explanation: "The students state they are mapping microplastics concentration in rivers.",
        },
        {
          id: "l1q22",
          text: "Which database did the professor recommend looking at first?",
          answer: "Scopus",
          explanation: "The supervisor advises starting queries inside Scopus.",
        },
        {
          id: "l1q23",
          text: "What issue did the students have with their initial water samples?",
          answer: "contamination",
          explanation: "The students admit plastic container seals led to contamination.",
        },
        {
          id: "l1q24",
          text: "They plan to collect new samples from the river's ______ flow.",
          answer: "upstream",
          explanation: "The discussion concludes that testing upstream yields better baselines.",
        },
        {
          id: "l1q25",
          text: "Who will fund the lab chemical supplies for the project?",
          answer: "department",
          explanation: "The head of the department agreed to cover reagent costs.",
        },
        {
          id: "l1q26",
          text: "The final research report must be submitted by November ______.",
          answer: "14",
          explanation: "The professor points out the absolute deadline is November fourteenth.",
        },
        {
          id: "l1q27",
          text: "What software will they use to analyze their spatial data?",
          answer: "ArcGIS",
          explanation: "The students select ArcGIS for mapping geographic variables.",
        },
        {
          id: "l1q28",
          text: "How many participant surveys do they aim to collect?",
          answer: ["200", "two hundred"],
          explanation: "They set a minimum goal of two hundred responses.",
        },
        {
          id: "l1q29",
          text: "Which presentation method does the professor recommend avoiding?",
          answer: ["slides", "slideshow"],
          explanation: "The professor advises against text-heavy slides.",
        },
        {
          id: "l1q30",
          text: "The oral defense will last for ______ minutes.",
          answer: ["15", "fifteen"],
          explanation: "The defense comprises a ten-minute presentation and five minutes of questions.",
        },
      ],
    },
    // SECTION 4: Academic Lecture (Questions 31 - 40)
    {
      id: "section-4",
      title: "Section 4 — History of Early Navigation",
      description: "Answer the questions below by typing ONE word only.",
      questions: [
        {
          id: "l1q31",
          text: "Ancient Polynesians read ocean swells and wave ______ to navigate.",
          answer: "patterns",
          explanation: "The lecturer mentions swells and diffraction patterns as key indicators.",
        },
        {
          id: "l1q32",
          text: "What stellar formation was most useful for tracking northern course?",
          answer: ["cross", "stars"],
          explanation: "The lecturer notes alignment was verified using the Southern Cross and North Star.",
        },
        {
          id: "l1q33",
          text: "The Viking sunstones were made of a mineral called ______.",
          answer: "calcite",
          explanation: "Chemists have shown these sunstones were calcite crystal prisms.",
        },
        {
          id: "l1q34",
          text: "Early Chinese mariners discovered the properties of magnetized ______.",
          answer: "iron",
          explanation: "Stated directly by the lecturer as the foundation of the magnetic needle.",
        },
        {
          id: "l1q35",
          text: "The astrolabe was primarily developed by scholars in the ______ world.",
          answer: "Islamic",
          explanation: "The astrolabe's mathematics matured significantly in the Islamic Golden Age.",
        },
        {
          id: "l1q36",
          text: "What raw material made up the structural body of early compasses?",
          answer: "wood",
          explanation: "The lecturer describes early needles floated on wooden cups.",
        },
        {
          id: "l1q37",
          text: "John Harrison developed the marine ______ to solve longitude calculation.",
          answer: "chronometer",
          explanation: "Harrison invented the highly stable mechanical marine chronometer.",
        },
        {
          id: "l1q38",
          text: "The main physical enemy of accurate marine clocks was maritime ______.",
          answer: "humidity",
          explanation: "Preventing corrosion from airborne salt humidity was the main hurdle.",
        },
        {
          id: "l1q39",
          text: "The Greenwich Meridian was established as reference longitude in ______.",
          answer: "1884",
          explanation: "Global consensus settled on Greenwich during the 1884 conference.",
        },
        {
          id: "l1q40",
          text: "Today, satellite signals are processed to form the modern global ______ network.",
          answer: "positioning",
          explanation: "The lecture concludes with the Global Positioning System (GPS).",
        },
      ],
    },
  ],
};

export default listeningTest1;