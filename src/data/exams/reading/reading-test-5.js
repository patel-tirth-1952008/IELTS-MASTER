// Cambridge-style academic reading test with all 6 IELTS question types:
// flowchart, TFNG, short-answer, paragraph-match, sentence-completion,
// summary-wordbank, MCQ, person-match.
// All passages and questions are original content.

const readingTest5 = {
  id: "reading-test-5",
  type: "reading",
  title: "Academic Reading — Practice Test 5",
  description:
    "3 passages · 40 questions · 60 minutes. Full Cambridge-style variety: flowcharts, paragraph matching, word banks, MCQs, TFNG & more.",
  durationMin: 60,
  questions: 40,
  difficulty: "Hard",
  passages: [
    // ============================================================
    // PASSAGE 1 — Archaeological discovery (matches Cambridge P1 style)
    // ============================================================
    {
      id: "p1",
      title: "The Skerry Iron-Age Roundhouse",
      text: `A remarkable stone roundhouse, built roughly 2,400 years ago and buried beneath centuries of peat, is transforming what we thought we knew about Iron-Age life in northern Scotland.

The discovery took place in 2003. A local farmer on the remote island of Skerry, off the north coast of Scotland, was clearing a drainage ditch when his tractor sank into a hollow. Curious rather than alarmed, he called the regional heritage office. A small team from the Northern Isles Heritage Unit (NIHU) arrived the following week and identified worked stone protruding from the soft peat wall of the collapsed ditch.

Careful excavation over the following summer revealed a circular stone wall almost two metres thick, enclosing an interior floor space of nearly nine metres across. The building had been sunk partially into the ground, a construction technique that would have offered protection from the fierce Atlantic winds. What survived was extraordinary: not only the low stone walls but also a hearth of fired clay at the exact centre, surrounding post-holes indicating a timber roof frame, and — most unexpectedly — a series of small storage compartments built into the wall's inner face.

The roof timbers themselves had long since decayed, but their shadows in the soil allowed a full reconstruction of the frame to be sketched. Charred fragments recovered from the hearth suggested that the building had been abandoned suddenly, possibly following a fire. Yet, unlike many prehistoric sites, there was no sign of violent destruction. The inhabitants appeared simply to have walked away, leaving pottery, tools and even food remains behind.

Fortunately, the roundhouse was found and studied by a mixed team of archaeologists, environmental specialists and community volunteers. Earlier generations of researchers might have focused narrowly on architecture and dating, but the Skerry excavation broke new ground by treating the site as a living community. In 2009, six years after the initial find, a public seminar was held on the island itself. Local residents, academic specialists and international guests exchanged perspectives, and the debate about how isolated northern communities were connected to the wider Iron-Age world was reopened.

By 2011, the physical site had been conserved and protected under a low, transparent shelter — but many questions could not be answered from the stones alone. A partial reconstruction, at either full or reduced scale, would test the various theories about the missing roof and the disputed function of the wall compartments. There was some discussion of returning to the site to look for outbuildings that might once have surrounded the main structure, but funding limits and the delicate condition of the peat made further digging impossible. There was also no certainty that additional structures had survived at all.

Formal plans for a reconstruction were drafted in 2013. Emerging evidence suggested that Iron-Age families in the far north were not isolated at all: pottery styles matched those of communities hundreds of kilometres to the south, and glass beads found in the compartments could only have arrived through long-distance exchange. Archaeologists felt a responsibility to share this story of an interconnected past with modern communities who often thought of themselves as remote.

The reconstruction project began as a Scottish enterprise but was designed from the outset as a partnership between institutions across northern Europe. Building the replica was only part of a wider plan that included a travelling exhibition, an educational programme for local schools, and a documentary film. Discussions opened in late 2014 with universities and heritage bodies in Norway, Denmark and the Faroe Islands. Enthusiasm was widespread, and the initiative — later branded 'IRON NORTH 400BC' — was formally launched at a symposium in Bergen in 2016. Funding was confirmed the following year, and construction began in spring 2019.

A small team started building the replica on open ground near the Skerry visitor centre in April 2019. A single test wall segment had been built in 2005, mainly to see how modern masons could replicate ancient stone-fitting techniques. In 2019, however, the whole structure was the focus, so modern power tools were used to shape the rougher outer stones before iron-age hand tools were used for the finishing work. The team decided to build the reconstruction at two-thirds scale, primarily because of budget and available time, and modern lime mortar was used in hidden joints because of concerns about weathering and the tight completion schedule.

While the reconstruction rose, a major exhibition was being assembled for opening in July 2020 at the Maritime Museum in Bergen. Titled 'Beyond the Waves: Northern Communities of the Iron Age', it brought together for the first time a stunning array of objects, including new finds from rescue excavations across the region and celebrated pieces loaned from national collections. The Skerry roundhouse reconstruction, as a symbol of the northern networks that once linked scattered communities across the sea, was the centrepiece of the show.`,

      questions: [
        // Q1-5 — Flowchart completion (ONE WORD ONLY)
        {
          id: "r5q1",
          kind: "flowchart",
          text: "Q1. 2003 — the roundhouse was discovered while a farmer was clearing a ______.",
          hint: "ONE WORD ONLY",
          answer: "ditch",
          explanation: "The passage says the farmer was clearing a drainage ditch when the tractor sank.",
        },
        {
          id: "r5q2",
          kind: "flowchart",
          text: "Q2. 2009 — a public ______ was held on the island of Skerry.",
          hint: "ONE WORD ONLY",
          answer: "seminar",
          explanation: "A public seminar was held on the island itself in 2009.",
        },
        {
          id: "r5q3",
          kind: "flowchart",
          text: "Q3. 2013 — ______ for the reconstruction were drafted.",
          hint: "ONE WORD ONLY",
          answer: "plans",
          explanation: "Formal plans for a reconstruction were drafted in 2013.",
        },
        {
          id: "r5q4",
          kind: "flowchart",
          text: "Q4. 2016 — the ______ of IRON NORTH 400BC took place in Bergen.",
          hint: "ONE WORD ONLY",
          answer: "launch",
          explanation: "The initiative was formally launched at a symposium in Bergen in 2016.",
        },
        {
          id: "r5q5",
          kind: "flowchart",
          text: "Q5. 2020 — the Iron-Age ______ featured the roundhouse and other objects.",
          hint: "ONE WORD ONLY",
          answer: "exhibition",
          explanation: "A major exhibition opened in July 2020 with the roundhouse as centrepiece.",
        },

        // Q6-9 — TRUE / FALSE / NOT GIVEN
        {
          id: "r5q6",
          kind: "tfng",
          text: "Q6. Archaeologists believe the roundhouse was destroyed in a violent attack.",
          answer: "False",
          options: ["True", "False", "Not Given"],
          explanation: "The passage explicitly says there was no sign of violent destruction — the inhabitants simply walked away.",
        },
        {
          id: "r5q7",
          kind: "tfng",
          text: "Q7. In the early years, roundhouse research usually focused on a narrow range of topics.",
          answer: "True",
          options: ["True", "False", "Not Given"],
          explanation: "The passage says earlier generations of researchers might have focused narrowly on architecture and dating.",
        },
        {
          id: "r5q8",
          kind: "tfng",
          text: "Q8. Excavators returned to Skerry to search for outbuildings around the main roundhouse.",
          answer: "False",
          options: ["True", "False", "Not Given"],
          explanation: "The passage says funding limits and delicate peat made further digging impossible — they did NOT return.",
        },
        {
          id: "r5q9",
          kind: "tfng",
          text: "Q9. Evidence found in 2013 suggested that Iron-Age families in the north traded across long distances.",
          answer: "True",
          options: ["True", "False", "Not Given"],
          explanation: "Pottery matched southern communities and glass beads arrived through long-distance exchange.",
        },

        // Q10-13 — Short answer (NO MORE THAN THREE WORDS AND/OR A NUMBER)
        {
          id: "r5q10",
          kind: "short-answer",
          text: "Q10. How thick was the circular stone wall of the roundhouse?",
          hint: "NO MORE THAN THREE WORDS AND/OR A NUMBER",
          answer: ["two metres", "2 metres"],
          explanation: "The passage says the wall was almost two metres thick.",
        },
        {
          id: "r5q11",
          kind: "short-answer",
          text: "Q11. What material was the hearth in the centre of the building made from?",
          hint: "NO MORE THAN THREE WORDS AND/OR A NUMBER",
          answer: ["fired clay", "clay"],
          explanation: "A hearth of fired clay stood at the exact centre.",
        },
        {
          id: "r5q12",
          kind: "short-answer",
          text: "Q12. What aspect of the roundhouse was the main focus of the 2019 reconstruction?",
          hint: "NO MORE THAN THREE WORDS AND/OR A NUMBER",
          answer: ["the whole structure", "whole structure", "the structure"],
          explanation: "In 2019 the whole structure was the focus, unlike the 2005 test of only a single wall segment.",
        },
        {
          id: "r5q13",
          kind: "short-answer",
          text: "Q13. Which TWO factors led to the decision not to build a full-scale reconstruction?",
          hint: "NO MORE THAN THREE WORDS",
          answer: ["budget and time", "time and budget", "cost and time"],
          explanation: "The team chose two-thirds scale primarily because of budget and available time.",
        },
      ],
    },

    // ============================================================
    // PASSAGE 2 — Business/industry with lettered paragraphs A-H
    // ============================================================
    {
      id: "p2",
      title: "The evolving purpose of public libraries",
      paragraphs: [
        {
          label: "A",
          text: "In recent years, generating community engagement has become harder for public libraries thanks to a mix of pressures, such as growing competition from streaming services, restrictions on certain purchases like specialist journals, and new digital lending rules that have shortened the average time visitors spend inside library buildings. On top of that, the recent economic slowdown has caused a fall in local authority budgets, while the visitors who do come often expect far more services for free. This has meant that the share of income libraries earn from non-lending activities, which peaked at around 48% roughly a decade ago, has since dropped slightly. Meanwhile, pressure to keep book-lending free remains as strong as ever, thanks to the tight finances of many households and the rapid rise of low-cost digital alternatives.",
        },
        {
          label: "B",
          text: "Some of the more obvious solutions to growing community revenue, such as expanding the café area or offering a wider range of print-on-demand services, have already been pushed to their limits in many libraries. A bolder response is to find entirely new sources of activity within the building, and this has been tried in many cities over the last decade. As a result, many libraries are now much more than quiet reading rooms and offer a range of maker spaces, film-screening rooms, and wellness and meditation corners. At this level of provision, the library can even take on the role of a destination in its own right, rather than a simple stop on the way to somewhere else.",
        },
        {
          label: "C",
          text: "At the same time, libraries have been broadening the services they offer specifically for the professional visitor. This includes providing business hubs that supply secretarial support, meeting rooms and space for private consultations. Within this trend, Halden (2012) describes how dedicated professional facilities located inside the library and managed directly by the library authority may be understood as an expansion of the concept of the traditional reading room, or as a way to repurpose underused sections of older buildings. Previously it was mostly nearby coffee chains and rented office suites in the neighbourhood that had filled this role and served as informal working space (Marcus, 2015).",
        },
        {
          label: "D",
          text: "When a library building can be presented as a professional venue, this may lift the wider appeal of the site and help it become more competitive in both attracting and keeping regular users. In particular, the presence of well-designed meeting rooms could become one of the deciding factors taken into consideration when self-employed people choose where to base themselves during the working day. This raised attractiveness may itself help to improve the library's financial position and long-term outlook, but clearly this depends on the competitive advantage that the library is able to build against other local options.",
        },
        {
          label: "E",
          text: "In 2018, an online library survey was conducted, and among the areas investigated were the availability and use of meeting rooms at public libraries and the perceived role and importance of these rooms in generating income and lifting visitor numbers. In total, responses were received from staff at 142 libraries, and 71% of these answered 'yes' to the question: Does your library own and rent out meeting rooms? The existence of meeting rooms therefore seems widespread. In addition, 29% of respondents that did not have such rooms stated that they were likely to invest in them within the next five years. The survey also asked how far respondents agreed or disagreed with a number of statements about the meeting rooms at their library. 52% agreed that they had put more investment into them in recent years; 44% agreed that they would invest more in the immediate future. These are fairly high figures given the recent economic climate.",
        },
        {
          label: "F",
          text: "The survey also asked libraries with meeting rooms to estimate what proportion of users came from the local area, defined as within a 30-minute walk of the library, or from further afield. The findings show that meeting rooms provided by most respondents tend to serve local rather than non-local needs. 66% of respondents estimated that over 60% of their users came from the local area. Only 4% estimated that over 80% of users came from outside the region. It is therefore not surprising that the rooms are of limited importance when it comes to lifting overall visitor numbers from tourism: 18% of respondents estimated that none of the users of their meeting rooms travelled from outside the town to reach them, while 54% estimated that 20% or fewer of the users did.",
        },
        {
          label: "G",
          text: "The survey asked respondents with meeting rooms to estimate how much money their library earned from these rooms during the last financial year. Average revenue per library was just $9,840. Meeting rooms are effectively a non-lending source of library income. Only 2% of respondents generated more than 20% of their non-lending revenue from meeting rooms; none generated more than 40%. Given the focus on local demand, it is not surprising that less than a third of respondents agreed that their meeting rooms genuinely support business and tourism development in their local area or region.",
        },
        {
          label: "H",
          text: "The findings of this study suggest that few libraries provide meeting rooms as a serious commercial venture. It may be that, as holders of large public buildings, space is naturally available for such rooms at libraries and could play an important role in serving the needs of the library, its partners, and stakeholders such as local government and community groups. Thus, while the local orientation means that competition with other libraries is likely to be minimal, competition with local providers of meeting rooms, such as commercial coworking spaces, is likely to be much greater.",
        },
      ],
      // Since text is now split, keep an empty text field for the type
      // Component reads `paragraphs` when present, otherwise `text`
      questions: [
        // Q14-18 — Paragraph matching (A-H)
        {
          id: "r5q14",
          kind: "paragraph-match",
          text: "Q14. Evidence that a significant number of libraries provide meeting rooms.",
          options: [
            { label: "A", text: "Pressures on library income" },
            { label: "B", text: "New services inside library buildings" },
            { label: "C", text: "Services for professional visitors" },
            { label: "D", text: "Libraries as competitive venues" },
            { label: "E", text: "Survey results on availability" },
            { label: "F", text: "Local vs external users" },
            { label: "G", text: "Revenue from meeting rooms" },
            { label: "H", text: "The wider role of library meeting rooms" },
          ],
          answer: "E",
          explanation: "Paragraph E gives the 71% figure showing widespread meeting-room provision.",
        },
        {
          id: "r5q15",
          kind: "paragraph-match",
          text: "Q15. A statement that no further growth is possible in some areas of library service.",
          options: [
            { label: "A", text: "Pressures on library income" },
            { label: "B", text: "New services inside library buildings" },
            { label: "C", text: "Services for professional visitors" },
            { label: "D", text: "Libraries as competitive venues" },
            { label: "E", text: "Survey results on availability" },
            { label: "F", text: "Local vs external users" },
            { label: "G", text: "Revenue from meeting rooms" },
            { label: "H", text: "The wider role of library meeting rooms" },
          ],
          answer: "B",
          explanation: "Paragraph B states obvious solutions like café expansion have been 'pushed to their limits'.",
        },
        {
          id: "r5q16",
          kind: "paragraph-match",
          text: "Q16. Reference to the low level of income that meeting rooms produce for libraries.",
          options: [
            { label: "A", text: "Pressures on library income" },
            { label: "B", text: "New services inside library buildings" },
            { label: "C", text: "Services for professional visitors" },
            { label: "D", text: "Libraries as competitive venues" },
            { label: "E", text: "Survey results on availability" },
            { label: "F", text: "Local vs external users" },
            { label: "G", text: "Revenue from meeting rooms" },
            { label: "H", text: "The wider role of library meeting rooms" },
          ],
          answer: "G",
          explanation: "Paragraph G gives the $9,840 average revenue figure.",
        },
        {
          id: "r5q17",
          kind: "paragraph-match",
          text: "Q17. Mention of the impact of low-cost digital alternatives on library income.",
          options: [
            { label: "A", text: "Pressures on library income" },
            { label: "B", text: "New services inside library buildings" },
            { label: "C", text: "Services for professional visitors" },
            { label: "D", text: "Libraries as competitive venues" },
            { label: "E", text: "Survey results on availability" },
            { label: "F", text: "Local vs external users" },
            { label: "G", text: "Revenue from meeting rooms" },
            { label: "H", text: "The wider role of library meeting rooms" },
          ],
          answer: "A",
          explanation: "Paragraph A refers to the rapid rise of low-cost digital alternatives.",
        },
        {
          id: "r5q18",
          kind: "paragraph-match",
          text: "Q18. Examples of nearby facilities that might once have been used for professional work.",
          options: [
            { label: "A", text: "Pressures on library income" },
            { label: "B", text: "New services inside library buildings" },
            { label: "C", text: "Services for professional visitors" },
            { label: "D", text: "Libraries as competitive venues" },
            { label: "E", text: "Survey results on availability" },
            { label: "F", text: "Local vs external users" },
            { label: "G", text: "Revenue from meeting rooms" },
            { label: "H", text: "The wider role of library meeting rooms" },
          ],
          answer: "C",
          explanation: "Paragraph C mentions coffee chains and rented office suites as previous options.",
        },

        // Q19-22 — Sentence completion (NO MORE THAN TWO WORDS)
        {
          id: "r5q19",
          kind: "sentence-completion",
          text: "Q19. The time visitors spend inside libraries has been shortened by new ______.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["digital lending rules", "lending rules"],
          explanation: "Paragraph A mentions new digital lending rules shortening visit time.",
        },
        {
          id: "r5q20",
          kind: "sentence-completion",
          text: "Q20. Libraries with a wide range of leisure facilities can become a ______ for people rather than just a stop.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["destination"],
          explanation: "Paragraph B says the library can take on the role of a destination in its own right.",
        },
        {
          id: "r5q21",
          kind: "sentence-completion",
          text: "Q21. In particular, meeting rooms may influence where ______ people choose to work during the day.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["self-employed"],
          explanation: "Paragraph D refers to self-employed people choosing where to base themselves.",
        },
        {
          id: "r5q22",
          kind: "sentence-completion",
          text: "Q22. Libraries that provide meeting rooms may need to develop a ______ over other venues.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["competitive advantage"],
          explanation: "Paragraph D refers directly to a competitive advantage over other local options.",
        },

        // Q23-26 — Summary completion (NO MORE THAN TWO WORDS)
        {
          id: "r5q23",
          kind: "sentence-completion",
          text: "Q23. Survey findings: Despite financial constraints due to the recent ______, a large percentage of libraries provide and wish to further develop meeting rooms.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["economic slowdown", "economic climate"],
          explanation: "Paragraphs A and E reference the recent economic slowdown / climate.",
        },
        {
          id: "r5q24",
          kind: "sentence-completion",
          text: "Q24. Just under 30% of surveyed libraries plan to add meeting rooms within ______.",
          hint: "NO MORE THAN THREE WORDS",
          answer: ["five years", "the next five years"],
          explanation: "Paragraph E: 29% likely to invest in them within the next five years.",
        },
        {
          id: "r5q25",
          kind: "sentence-completion",
          text: "Q25. However, the main users of the meeting rooms come from the ______.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["local area"],
          explanation: "Paragraph F says 66% estimated over 60% of users come from the local area.",
        },
        {
          id: "r5q26",
          kind: "sentence-completion",
          text: "Q26. As many as 18% of respondents said that none of their users travelled from ______ the town.",
          hint: "NO MORE THAN TWO WORDS",
          answer: ["outside"],
          explanation: "Paragraph F: 18% estimated none of the users travelled from outside the town.",
        },
      ],
    },

    // ============================================================
    // PASSAGE 3 — Arts / humanities debate with word bank + person matching
    // ============================================================
    {
      id: "p3",
      title: "Is street art really art?",
      text: `To many people today the question seems almost silly. Surrounded as we are by murals in every city — from vast wall-length political statements to small, playful stencils on quiet backstreets — most of us take for granted that, in addition to brightening dull neighbourhoods and drawing tourists, painted walls also serve as decoration, offer social commentary, and provide meaningful insights into modern urban life. But in the decades that followed the rise of aerosol paint and mass-produced markers in the 1970s, the same question sparked a long and heated debate about whether images made outside the traditional studio truly counted as art at all.

The often-quoted pronouncement by the gallery owner Marta Voss that graffiti signalled 'the end of serious painting' is puzzling because this same influential figure had, in a private letter written in 1978, predicted the usefulness of the new spray-based medium for graphic designers. Even so, her comment captures the swing between outright rejection and cautious acceptance of the new medium that was fairly typical of the art establishment. Discussion of the place of street art was especially fierce in the United States, where a large pool of young urban artists had emerged; but it was also picked up by significant voices in France. In both countries, public interest in the topic reflected the belief that international standing in the arts was closely tied to national identity.

From the tangle of conflicting statements and heated articles on the subject, three main positions about the potential of street art gradually emerged. The simplest, held by many traditional painters and a portion of the general public, was that murals and stencils should not be considered 'art' at all because they were made with industrial tools and, often, on surfaces that did not belong to the artist; to some, such work seemed to have more in common with commercial advertising than with paintings created by inspiration and long study. The second widely held view, shared by gallery owners, some street artists, and a number of critics, was that street works could be useful to art but should not be considered equal in creativeness to studio painting. Lastly, by treating the process as comparable to older techniques such as engraving and screen-printing, a small but growing number of individuals recognised that street images were, or could be, as significant as gallery works, and that they might have a positive influence on the arts and on society more broadly.

Traditional artists responded to the rise of street art in various ways. Many portrait painters — miniature specialists in particular — who realised that the new medium represented, as one commentator put it, a message that something bad was coming, became involved with mural work themselves in an effort to save their careers; some blended it with traditional oil painting, while others gave up gallery work altogether. Still other painters, the most prominent among them the American painter, Louise Randall, began almost immediately to use photographs of urban murals to inform their own studio work and to provide themselves with source material for figures and settings, while vigorously denying at the same time the influence of the street on their vision, or its claims as art.

The view that street works might be genuinely useful to the wider art world was set out in some detail by the French critic Julien Roche and by the American writer Peter Halloran. Halloran, an art and cultural critic, who eventually accepted that street images could be inspired as well as informative, suggested that they would lead to greater realism in the depiction of the human figure, clothing, expression and the modern urban landscape. By studying street works, true artists, he claimed, would be freed from tired studio conventions and left free to devote themselves to the more important spiritual aspects of their work.

Halloran left unstated what less talented artists might do instead, but according to the influential British poet and critic George Manley, writing in response to a landmark street-art exhibition in 1985, uninspired and lazy painters would simply become street artists themselves. Fired by a belief in art as a lasting embodiment of cultivated ideas and dreams, Manley regarded the mural movement as 'a very humble servant of art and commerce', a medium largely unable to rise above 'the noise of the street'. For this critic, street art was linked with 'the great commercial madness' of the age, which in his eyes had disastrous consequences for the spiritual qualities of life and art.

Simone Larsson was the most prominent of the Scandinavian artists who welcomed the new medium as a helper while recognising its limitations. Regretting that 'such a lively invention' had appeared so late in her career, she still took evening classes in aerosol technique, and both commissioned and collected examples of mural work. Larsson's enthusiasm can be sensed in a journal entry noting that if street images were used as they should be, an artist might 'raise the studio to heights we do not yet know'.

The question of whether the street mural was really art also sparked interest in France. The most important statement on this came in an unsigned newspaper article that concluded that while street work had a role to play, it should not be 'forced' into 'competition' with studio art; a stricter viewpoint led the critic Anton Duval to dismiss street images as 'narrow in range, loud in claim, telling one truth for every ten falsehoods'.

These writers reflected the opposition of a section of the cultural elite in France and the United States to what they saw as the 'cheapening of art' represented by the growing acceptance and purchase of street works by the middle class. New technology had made photographs of murals a common sight on the covers of design magazines and in the shop windows of major cities. In New York, for example, there were commercial galleries where prints of urban works, together with photographic reproductions of famous paintings, could be bought for modest sums. This appeal to the middle class convinced parts of the elite that street art would foster a taste for realism instead of idealism, even though some critics recognised that the work of individual street artists might display an uplifting style and substance that fully matched the defining characteristics of art.`,

      // Shared word bank for Q31-Q34
      wordBank: [
        { label: "A", text: "inventive" },
        { label: "B", text: "similar" },
        { label: "C", text: "beneficial" },
        { label: "D", text: "next" },
        { label: "E", text: "mixed" },
        { label: "F", text: "justified" },
        { label: "G", text: "inferior" },
      ],

      questions: [
        // Q27-30 — Multiple choice
        {
          id: "r5q27",
          kind: "mcq",
          text: "Q27. What is the writer's main point in the first paragraph?",
          answer: "C",
          options: [
            { label: "A", text: "Street art is used for many different purposes." },
            { label: "B", text: "Street artists and studio artists have the same principal aims." },
            { label: "C", text: "Street art has not always been a readily accepted art form." },
            { label: "D", text: "Street artists today are more creative than those of the past." },
          ],
          explanation: "Paragraph 1 explains that the question sparked a long, heated debate — acceptance took time.",
        },
        {
          id: "r5q28",
          kind: "mcq",
          text: "Q28. What public view about the arts was shared by the United States and France?",
          answer: "D",
          options: [
            { label: "A", text: "that only artists could reflect a culture's true values" },
            { label: "B", text: "that only artists were qualified to judge street art" },
            { label: "C", text: "that artists could lose work as a result of street art" },
            { label: "D", text: "that artistic success was tied to national identity" },
          ],
          explanation: "The passage says national identity was closely tied to international standing in the arts.",
        },
        {
          id: "r5q29",
          kind: "mcq",
          text: "Q29. What does the writer mean by 'a message that something bad was coming'?",
          answer: "D",
          options: [
            { label: "A", text: "an example of poor talent" },
            { label: "B", text: "a message that cannot be trusted" },
            { label: "C", text: "an advertisement for a new product" },
            { label: "D", text: "a warning that a change would harm them" },
          ],
          explanation: "Portrait miniaturists took the warning seriously and switched to murals to save their careers.",
        },
        {
          id: "r5q30",
          kind: "mcq",
          text: "Q30. What was one result of the wide availability of mural prints to the middle class?",
          answer: "A",
          options: [
            { label: "A", text: "The most educated worried about its impact on public taste." },
            { label: "B", text: "It helped artists appreciate the merits of street art." },
            { label: "C", text: "Improvements were made in aerosol methods." },
            { label: "D", text: "It led to a reduction in the price of murals." },
          ],
          explanation: "The cultural elite feared this appeal to the middle class would foster realism instead of idealism.",
        },

        // Q31-34 — Summary with word bank (choose A-G)
        {
          id: "r5q31",
          kind: "summary-wordbank",
          text: "Q31. Street art summary: In the early days, opinions on its future were ______.",
          answer: "E",
          explanation: "The three positions described in the passage were mixed opinions.",
        },
        {
          id: "r5q32",
          kind: "summary-wordbank",
          text: "Q32. A large number of artists and ordinary people saw street works as ______ to studio paintings because of the way they were produced.",
          answer: "G",
          explanation: "The first view held that street works were not real art — i.e. inferior.",
        },
        {
          id: "r5q33",
          kind: "summary-wordbank",
          text: "Q33. Another popular view was that street works could have a role to play, despite the artist being less ______.",
          answer: "A",
          explanation: "The second view accepted usefulness but not equal creativeness — i.e. less inventive.",
        },
        {
          id: "r5q34",
          kind: "summary-wordbank",
          text: "Q34. Finally, a smaller number of people suspected that the impact of street art on art and society could be ______.",
          answer: "C",
          explanation: "The third view saw street works as potentially having a positive influence — i.e. beneficial.",
        },

        // Q35-40 — Person matching
        {
          id: "r5q35",
          kind: "person-match",
          text: "Q35. He claimed that street art would make studio paintings more realistic.",
          options: [
            { label: "A", text: "Louise Randall" },
            { label: "B", text: "Peter Halloran" },
            { label: "C", text: "George Manley" },
            { label: "D", text: "Simone Larsson" },
            { label: "E", text: "Anton Duval" },
          ],
          answer: "B",
          explanation: "Halloran suggested street works would lead to greater realism in figures, clothing, and landscape.",
        },
        {
          id: "r5q36",
          kind: "person-match",
          text: "Q36. He highlighted the limitations and deceptions of street art.",
          options: [
            { label: "A", text: "Louise Randall" },
            { label: "B", text: "Peter Halloran" },
            { label: "C", text: "George Manley" },
            { label: "D", text: "Simone Larsson" },
            { label: "E", text: "Anton Duval" },
          ],
          answer: "E",
          explanation: "Duval called street images 'narrow in range... telling one truth for every ten falsehoods'.",
        },
        {
          id: "r5q37",
          kind: "person-match",
          text: "Q37. She used photographs of murals as source material for her own studio work.",
          options: [
            { label: "A", text: "Louise Randall" },
            { label: "B", text: "Peter Halloran" },
            { label: "C", text: "George Manley" },
            { label: "D", text: "Simone Larsson" },
            { label: "E", text: "Anton Duval" },
          ],
          answer: "A",
          explanation: "Randall used photographs of urban murals to inform studio work while denying influence.",
        },
        {
          id: "r5q38",
          kind: "person-match",
          text: "Q38. He noted the potential for street art to enrich artistic talent.",
          options: [
            { label: "A", text: "Louise Randall" },
            { label: "B", text: "Peter Halloran" },
            { label: "C", text: "George Manley" },
            { label: "D", text: "Simone Larsson" },
            { label: "E", text: "Anton Duval" },
          ],
          answer: "B",
          explanation: "Halloran said true artists would be freed from tired conventions to focus on spiritual aspects.",
        },
        {
          id: "r5q39",
          kind: "person-match",
          text: "Q39. She collected and commissioned examples of mural work despite recognising its limits.",
          options: [
            { label: "A", text: "Louise Randall" },
            { label: "B", text: "Peter Halloran" },
            { label: "C", text: "George Manley" },
            { label: "D", text: "Simone Larsson" },
            { label: "E", text: "Anton Duval" },
          ],
          answer: "D",
          explanation: "Larsson took aerosol classes and both commissioned and collected mural work.",
        },
        {
          id: "r5q40",
          kind: "person-match",
          text: "Q40. He felt street art was part of the wider trend towards commercialism.",
          options: [
            { label: "A", text: "Louise Randall" },
            { label: "B", text: "Peter Halloran" },
            { label: "C", text: "George Manley" },
            { label: "D", text: "Simone Larsson" },
            { label: "E", text: "Anton Duval" },
          ],
          answer: "C",
          explanation: "Manley linked street art with 'the great commercial madness' of the age.",
        },
      ],
    },
  ],
};

export default readingTest5;