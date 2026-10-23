/**
 * Public-safe editorial volumes II–VI of The Whole Life Field Guide.
 * Written as distinct learning chapters, not medical advice and not copied from
 * the private Personality repository. All source IDs resolve against wellnessGuide.ts.
 */
export type VolumeId = 2 | 3 | 4 | 5 | 6;

export interface VolumeChapter {
  id: string;
  title: string;
  tradition: string;
  principle: string;
  discussion: string;
  furtherReading: string;
  application: string;
  reflection: string;
  caution: string;
  sources: string[];
}
export interface VolumeExercise {
  name: string;
  domain: string;
  instructions: string;
  context: string;
  sources: string[];
}
export interface WellnessVolume {
  id: VolumeId;
  title: string;
  subtitle: string;
  introduction: string;
  thesis: string;
  editorialNote: string;
  chapters: VolumeChapter[];
  exercises: VolumeExercise[];
}
export const WELLNESS_VOLUMES: WellnessVolume[] = [
  {
    id: 2, title: 'Eastern Wisdom', subtitle: 'Attention, relationship and the art of living',
    introduction: 'A comparative journey through Buddhist, Daoist, Confucian and classical Indian approaches. These are diverse religious and philosophical systems with histories of debate. Treat each on its own terms rather than as different names for one mystical doctrine.',
    thesis: 'Cultivation is not escape: what we notice, how we act and whom we affect matter together.',
    editorialNote: 'Zen is a Buddhist tradition, not a separate scientific treatment; yogic prāṇāyāma is not a recommendation for forceful breath control. Modern wellness versions do not exhaust the original traditions.',
    chapters: [
      {
        id:'buddhist-ethics',title:'Compassion and the conditions of suffering',tradition:'Buddhist ethics',
        principle:'Attention is inseparable from ethics.',
        discussion:'Many Buddhist schools approach suffering as a condition shaped by attachment, aversion and misunderstanding. The tradition is not just a technique for feeling calm: generosity, ethical speech, compassion and wisdom are integral. There are disagreements among traditions about the self, enlightenment and how practice is taught. The accessible lesson is to notice what aggravates distress while keeping care for others in view.',
        furtherReading:'Compare an ethical account of Buddhist compassion with a modern mindfulness study. The former describes a path of liberation; the latter asks whether a particular intervention changed measured outcomes. Neither substitutes for the other.',
        application:'Choose one small act of non-harm in speech. Before replying to an ordinary frustration, ask whether the message is both accurate and necessary.',
        reflection:'What changes when I treat another person’s well-being as relevant to my decision?',
        caution:'Nonattachment is not indifference, silence about injustice or tolerating mistreatment.',sources:['P1','E1','E2']
      },
      {
        id:'zen-attention',title:'Zen and ordinary attention',tradition:'Zen within Buddhism',
        principle:'Practice can involve the ordinary tasks of everyday life.',
        discussion:'Zen traditions developed in East Asian Buddhist contexts and encompass teaching lineages, ritual, ethics, seated meditation and disciplined attention. Popular descriptions that reduce Zen to relaxed minimalism miss its religious and institutional contexts. For a new reader, the philosophical doorway is ordinary attentiveness: eating, cleaning and speaking can become moments to notice how the mind adds distraction or urgency.',
        furtherReading:'Begin with a reliable introduction to Buddhist ethics, then investigate a specific Zen lineage from its own teachers. Do not assume an online quote or aesthetic represents every Zen community.',
        application:'While doing a routine task, notice three sensory details. Keep eyes open and breathing comfortable; this is ordinary observation, not formal zazen instruction.',
        reflection:'When do I make a simple task more complicated through self-judgment?',
        caution:'Long or intensive meditation retreats are not necessary for this guide; stop any exercise that worsens distress.',sources:['P1','E1']
      },
      {
        id:'daoist-responsiveness',title:'Daoism and responding without forcing',tradition:'Classical Daoism',
        principle:'Skillful action depends on recognizing the situation.',
        discussion:'The Daodejing and Zhuangzi are not instruction manuals for passive living. They challenge confident human systems of control and ask how a person might move responsively within a changing world. Wu wei is often rendered “non-action,” but this shorthand can mislead: the underlying idea is not refusing to act, but acting without futile or artificial strain. Philosophical and religious Daoist communities remain distinct and diverse.',
        furtherReading:'Compare the classical focus on dao with the Confucian emphasis on cultivated social conduct. Their disagreement is productive: one asks whether standards are overconfident, the other asks how standards teach consideration.',
        application:'Choose a small task that you have been overcomplicating. Identify the essential next action and leave one unnecessary step out.',
        reflection:'What is the difference between giving up and removing unhelpful friction?',
        caution:'Do not use “going with the flow” to avoid responsibilities or necessary care.',sources:['P5','P6']
      },
      {
        id:'confucian-relationship',title:'Confucian learning through relationship',tradition:'Classical Chinese ethics',
        principle:'Character is expressed between people.',
        discussion:'Early Confucian thought attends to ren, commonly translated as humaneness, and li, the practices of respect and appropriate conduct. The Analects invites readers to take ordinary interactions seriously: what we say, how we listen, and whether we fulfill reasonable commitments develop social trust. Its history includes real tensions around hierarchy, ritual and political power, which modern readers should examine rather than dismiss.',
        furtherReading:'Study how different historical interpreters understood ritual and humaneness; there is no one undebated Confucian blueprint for family or society.',
        application:'In your next conversation, let the other person finish their thought before offering your view.',
        reflection:'How can respect and independent judgment coexist?',
        caution:'Respect does not mean accepting coercion or harmful hierarchy.',sources:['P6']
      },
      {
        id:'yoga-eight-limbs',title:'Classical Yoga beyond physical poses',tradition:'Indian yoga philosophy',
        principle:'The ethics of practice matters as much as its form.',
        discussion:'Patañjali’s Yoga Sūtras are one influential strand among many Indian yoga traditions. The eight-limbed framework includes yama and niyama, often discussed as ethical restraints and observances, alongside posture, breath regulation, concentration and contemplative absorption. Contemporary fitness classes may be valuable forms of movement but should not be confused with the entire philosophical system.',
        furtherReading:'Distinguish textual Yoga philosophy from contemporary outcome studies of posture-based yoga. A promising trial of one yoga program does not prove a classical metaphysical claim.',
        application:'Reflect on ahiṃsā (non-harm) and choose a comfortably gentle stretch if it suits you; no specific pose is required.',
        reflection:'Am I relating to my body with curiosity, or measuring it against an ideal?',
        caution:'Avoid forced poses or breath-holding; consult appropriate qualified instruction when needed.',sources:['P4','E3']
      },
      {
        id:'eastern-dialogues',title:'Where these approaches disagree',tradition:'Cross-tradition comparison',
        principle:'Comparison should preserve difference.',
        discussion:'Buddhist accounts of the self and liberation do not simply equal Daoist naturalism, Confucian ethics or classical Yoga metaphysics. They use different texts, social settings and aims. Productive comparison asks a precise question—such as how each handles emotion, responsibility or attention—and then records both convergences and disagreements. A wellness guide should never claim that a tradition predicted a modern psychological finding.',
        furtherReading:'Build a four-column notebook: Buddhist ethical training, Daoist responsiveness, Confucian relationships, and yogic discipline. Record one distinctive claim and one open question for each.',
        application:'Pick one shared everyday issue and write how two approaches might frame it differently.',
        reflection:'Which differences challenge my assumptions in a useful way?',
        caution:'Do not appropriate sacred rites as generic productivity hacks.',sources:['P1','P4','P5','P6']
      }
    ],
    exercises:[
      {name:'An ethical pause',domain:'Mind',instructions:'Before a routine reply, consider accuracy, kindness and the consequences of what you say.',context:'Inspired by Buddhist ethical reflection; not a clinical protocol.',sources:['P1']},
      {name:'Reduce unnecessary effort',domain:'Mind',instructions:'Choose one manageable task and simplify the next step without abandoning it.',context:'A contemporary interpretation of Daoist responsiveness.',sources:['P5']},
      {name:'Respectful listening',domain:'Soul',instructions:'Allow someone to finish their thought and ask one sincere clarifying question.',context:'Related to Confucian attention to relationship.',sources:['P6']},
      {name:'Non-harm through movement',domain:'Body',instructions:'Choose comfortable movement and stop if anything hurts or feels unsafe.',context:'An accessible connection between yogic ethics and modern safety guidance.',sources:['P4','E3']}
    ]
  },
  {
    id:3,title:'Western Philosophy',subtitle:'Virtue, friendship, freedom and a considered life',
    introduction:'Western philosophy is not a single tradition. This volume considers ancient schools and modern existential questions as competing but useful ways to examine good judgment, agency, friendship, responsibility and the limits of happiness.',
    thesis:'A meaningful life can be evaluated by how we choose and relate, not merely by how pleasant it feels.',
    editorialNote:'The philosophical chapters are interpretations of arguments, not validated personality typing or medical prescriptions.',
    chapters:[
      {
        id:'stoic-impression',title:'Stoic impressions and deliberate judgment',tradition:'Stoicism',
        principle:'Not every first impression requires assent.',
        discussion:'Stoic writers analyze how initial impressions become judgments and actions. They distinguish circumstances beyond our command from the use we make of our judgments and decisions. This does not mean that illness, inequity, grief or loss are trivial. The challenge is to remain capable of fairness and courage while acknowledging real emotions and limits.',
        furtherReading:'Examine the distinction between a description of an event and a conclusion about what it means. Also consider situations where institutional change, not just personal attitude, is needed.',
        application:'Write two lines: “What happened?” and “What story did I add?” Then identify one constructive choice.',
        reflection:'Which part of this situation needs acceptance, and which part requires action?',
        caution:'Stoicism is not an instruction to suppress feelings or tolerate injustice.',sources:['P2']
      },
      {
        id:'stoic-virtues',title:'The virtues as decision guides',tradition:'Stoicism',
        principle:'Wisdom, justice, courage and moderation are practical questions.',
        discussion:'A virtue is not a flattering identity label. It is tested when important goals compete: truth and gentleness, courage and prudence, self-interest and fairness. The Stoic project treats rational ethical character as central to flourishing. It can offer a reflection vocabulary, though the historical school has broader teachings about physics, logic and nature.',
        furtherReading:'Ask how justice changes the decisions you make around others, rather than interpreting the discipline as private emotional resilience alone.',
        application:'Before a routine decision, ask four questions: Is it informed? Fair? Brave enough? Appropriately measured?',
        reflection:'Which virtue becomes difficult to practice when I am rushed?',
        caution:'An ethical framework should guide inquiry, not enable perfectionism.',sources:['P2']
      },
      {
        id:'aristotle-practical-wisdom',title:'Aristotle and practical wisdom',tradition:'Aristotelian ethics',
        principle:'Good judgment must attend to context.',
        discussion:'For Aristotle, eudaimonia means a kind of flourishing across a life, not a continuous upbeat mood. Ethical habits are cultivated in action, but practical wisdom is needed to know what fits particular circumstances. Friendship, education, health and material conditions matter too: character alone does not erase social or economic reality.',
        furtherReading:'Consider the relationship between habituation and discernment. A routine becomes valuable when it helps someone respond well rather than when it is obeyed without question.',
        application:'Pick a small commitment you can keep while respecting your real capacity and circumstances.',
        reflection:'What would a proportionate action look like, rather than a dramatic one?',
        caution:'Do not turn flourishing into a productivity metric.',sources:['P3']
      },
      {
        id:'epicurus-friendship',title:'Epicurus and the freedom of enough',tradition:'Epicurean ethics',
        principle:'Contentment need not depend on accumulating more.',
        discussion:'Epicurean ethics emphasizes avoiding needless disturbance while appreciating basic satisfactions, prudence and friendship. It is frequently misrepresented as relentless indulgence. Its sharper question is whether a desire actually supports a good life or draws a person into fear and endless comparison.',
        furtherReading:'Read Epicurean views on friendship alongside contemporary public-health research on social connection. Similar concern does not make the ancient argument an epidemiological study.',
        application:'Choose one unhurried ordinary pleasure—conversation, music, a meal or outdoor air—without making it a performance reward.',
        reflection:'What do I already have enough of for today?',
        caution:'Contentment does not require ignoring poverty, material needs or real hardship.',sources:['P7','E7']
      },
      {
        id:'existential-meaning',title:'Existentialism and meaningful choice',tradition:'Modern existential philosophy',
        principle:'Freedom includes responsibility in an uncertain world.',
        discussion:'Existentialist thinkers ask about authenticity, responsibility, anxiety and how individual lives acquire meaning. They differ sharply in theology, politics and views of freedom. An accessible reading avoids pretending that uncertainty is always exciting. It allows difficult feelings while asking what concrete commitment is still available.',
        furtherReading:'Compare existential accounts of authenticity with Aristotle’s habits and Stoic virtue: one may emphasize self-definition, another practiced character, and another ethical judgments.',
        application:'Write: “This week, I want my choices to support…” and complete with one realistic commitment.',
        reflection:'What decision expresses my values even though its outcome is uncertain?',
        caution:'You do not need a dramatic life change to live authentically.',sources:['P12','P3','P2']
      }
    ],
    exercises:[
      {name:'A judgment journal',domain:'Mind',instructions:'Separate one event from the meaning you assign it; add a compassionate alternate interpretation.',context:'Stoic-inspired critical reflection.',sources:['P2']},
      {name:'Four virtue questions',domain:'Soul',instructions:'For one choice, consider wisdom, justice, courage and moderation.',context:'Ethical inquiry, not self-scoring.',sources:['P2']},
      {name:'Practice enoughness',domain:'Soul',instructions:'Name one ordinary satisfaction without ranking it or needing more.',context:'Inspired by Epicurean ethics.',sources:['P7']},
      {name:'A feasible commitment',domain:'Integrated',instructions:'Select one small action aligned with a value and adapt it to circumstances.',context:'Aristotelian and existential perspectives on agency.',sources:['P3','P12']}
    ]
  },
  {
    id:4,title:'Spiritual Growth',subtitle:'Meaning, reverence, character and community',
    introduction:'Spiritual growth need not mean membership in a particular religion. This volume explores distinct traditions that articulate remembrance, sacred reading, moral cultivation, mutual care and secular meaning. Religious practices retain their theological origins.',
    thesis:'Spiritual life can shape ethical commitments and relationships without requiring every reader to share the same beliefs.',
    editorialNote:'No spiritual tradition is a medical treatment, and no one must participate in religious practice to pursue a meaningful life.',
    chapters:[
      {
        id:'sufi-remembrance',title:'Sufi remembrance in Islamic context',tradition:'Islamic Sufi lineages',
        principle:'Remembrance is a religious act, not an interchangeable focus trick.',
        discussion:'Sufi paths within Islam have developed distinct forms of devotion, ethical formation, remembrance of God (dhikr) and forms of spiritual companionship. Their meanings depend on Islamic theology, community and lineage. A non-Muslim reader can understand and respect these teachings without impersonating rituals or assuming all practices are secular meditation.',
        furtherReading:'Notice the difference between studying a practice, interpreting its ethical implications and personally performing it. Each involves different responsibilities.',
        application:'Read a trustworthy introduction to the idea of remembrance, and consider how sustained attention to your own values influences ordinary behavior.',
        reflection:'What commitments deserve to be recalled when life becomes busy?',
        caution:'Specific devotional rites should be learned from an appropriate religious community.',sources:['P8']
      },
      {
        id:'mussar-traits',title:'Mussar and the work of character',tradition:'Jewish ethical spirituality',
        principle:'Character can be examined without declaring oneself good or bad.',
        discussion:'Mussar traditions investigate middot—qualities such as patience, humility, gratitude, generosity and courage—through teaching, study and daily reflection. This is a Jewish ethical practice with distinctive historical developments. Its method of attending to behavior can interest many readers, but adopting isolated terms does not mean one has learned the whole tradition.',
        furtherReading:'Consider the difference between being accountable for a behavior and reducing a whole person to a fixed trait label.',
        application:'Select one character quality and describe one concrete situation in which it could change your response.',
        reflection:'Which quality do I need to practice with others rather than merely admire?',
        caution:'Avoid using reflection as relentless self-criticism.',sources:['P9']
      },
      {
        id:'christian-lectio',title:'Christian lectio divina and attentive reading',tradition:'Christian contemplation',
        principle:'Sacred reading joins reflection and response.',
        discussion:'Lectio divina is a Christian approach to Scripture that is often described through reading, meditation, prayer and contemplation. Traditions and communities differ in how they teach it. It is not simply a productivity-based reading technique; its purpose is rooted in prayer and relation to God.',
        furtherReading:'Compare carefully how religious devotional reading differs from secular critical reading. They can both be meaningful without being identical.',
        application:'If you practice the Christian faith, choose a short passage and follow guidance from a trusted community. Otherwise, study the practice historically and consider a meaningful text from your own background.',
        reflection:'What is the difference between receiving an idea and rushing to use it?',
        caution:'Do not universalize a specifically Christian devotional form.',sources:['P10']
      },
      {
        id:'ubuntu-reciprocity',title:'Ubuntu and reciprocal dignity',tradition:'African relational ethical perspectives',
        principle:'Human life is deeply interdependent.',
        discussion:'Ubuntu is a family of perspectives emphasizing personhood, relationship, solidarity and mutual recognition, particularly associated with parts of southern Africa. It should not be flattened into a claim that all African societies share identical views. Relationships can enable dignity, but genuine community also demands attention to autonomy, consent and fair treatment.',
        furtherReading:'Study how relational ethics differs from isolated self-optimization and how the two can coexist through healthy boundaries.',
        application:'Identify one person whose support helped you and one realistic way you might reciprocate care.',
        reflection:'How do I contribute to a community without disappearing into its expectations?',
        caution:'Interdependence is not permission for coercion or loss of boundaries.',sources:['P11','E7']
      },
      {
        id:'secular-purpose',title:'A meaningful life without imposed doctrine',tradition:'Existential and secular inquiry',
        principle:'Meaning can be developed through values and connection.',
        discussion:'Some people find meaning in faith, some in family and friendship, service, art, craft, curiosity or environmental responsibility. These paths should not be ranked by spiritual superiority. Philosophical existentialism offers one way to explore responsibility and chosen purpose; health research may report associations between purpose and well-being, but does not prove that one worldview is correct.',
        furtherReading:'Distinguish an empirical observation about well-being from metaphysical claims about ultimate purpose. They answer different questions.',
        application:'Write a short description of something that genuinely matters to you, followed by one attainable act of attention.',
        reflection:'Which commitments remain valuable even when they bring no recognition?',
        caution:'A sense of purpose can change; uncertainty is not a personal failure.',sources:['P12','E11']
      }
    ],
    exercises:[
      {name:'Remember what matters',domain:'Soul',instructions:'Identify a value and a situation in which you would like to remember it.',context:'An original secular reflection inspired by questions of remembrance.',sources:['P8','P12']},
      {name:'Cultivate one character quality',domain:'Soul',instructions:'Write one way to practice patience, humility or gratitude in context.',context:'Inspired by Mussar’s character study, not a clinical assessment.',sources:['P9']},
      {name:'Reflective reading',domain:'Mind',instructions:'Read a short passage attentively in its own context; note one question.',context:'Respect sacred and secular reading as different activities.',sources:['P10']},
      {name:'Reciprocal care',domain:'Soul',instructions:'Offer an attainable supportive gesture that respects both people’s boundaries.',context:'A practical reading of relational ethics.',sources:['P11']}
    ]
  },
  {
    id:5,title:'The Mind–Body Connection',subtitle:'Care, rest, movement and a realistic view of evidence',
    introduction:'Mental and physical experiences interact, but neither can be reduced to willpower or spirituality. This volume considers research-informed everyday support while keeping the limits of the evidence visible.',
    thesis:'Support the body as a living necessity, not as an object to perfect.',
    editorialNote:'No restricted diets, extreme exercise challenges, forceful breathing, detox claims or promises that mind–body practices cure illness.',
    chapters:[
      {
        id:'attention-safety',title:'Attention, stress and safe ways to begin',tradition:'Mindfulness research',
        principle:'Attention is a skill, but practices affect individuals differently.',
        discussion:'Contemporary research has evaluated different mindfulness and meditation programs for stress and some emotional outcomes. Results depend on the setting, participant and measure, and trials vary in rigor. While many people find some practices useful, stillness can increase distress for others. Mindfulness in research is not the whole of Buddhist practice.',
        furtherReading:'Look at what outcomes a study actually measured, the ages of its participants and whether a comparison group was included. A single promising result is not a guaranteed individual outcome.',
        application:'Begin with eyes-open orientation: notice ordinary objects, room sounds and the floor underfoot. Breathe naturally. Stop if uncomfortable.',
        reflection:'What helps me feel present without making attention another performance?',
        caution:'Avoid intensive practices when they feel destabilizing; seek appropriate support for persistent symptoms.',sources:['E1','E10','P1']
      },
      {
        id:'sleep-opportunity',title:'Sleep as a basic form of care',tradition:'Public-health guidance',
        principle:'Rest is a biological need, not a moral reward.',
        discussion:'Sleep contributes to cognition, mood and physical functioning. Duration recommendations differ by age; CDC guidance notes that adolescents generally require more sleep than most adults. Work, family, safety and housing circumstances can complicate sleep opportunities. A practical approach considers what is feasible instead of blaming someone for not following an ideal schedule.',
        furtherReading:'Differentiate sleep quality, duration and schedule stability. Public-health recommendations are population guidance, not an individual diagnosis.',
        application:'Consider one calm transition before rest, such as lowering stimulation, setting aside a task or choosing a practical bedtime window.',
        reflection:'What controllable factor would make rest more possible this week?',
        caution:'If sleep problems are severe or persistent, seek appropriate medical advice.',sources:['E6']
      },
      {
        id:'movement-capacity',title:'Movement without punishment',tradition:'Physical activity research',
        principle:'Accessible movement supports health across many abilities.',
        discussion:'The World Health Organization reports benefits of physical activity for physical and mental health. Those benefits do not imply that everyone should exercise identically, exceed their capacity or pursue a particular appearance. Movement is shaped by health status, environments, time and access to safe spaces. Small comfortable activities can be worthwhile as part of ordinary life.',
        furtherReading:'Notice the difference between broad population guidelines and advice for someone with an injury, illness or disability.',
        application:'Choose comfortable movement compatible with your day—walking, gentle mobility or an ordinary active task.',
        reflection:'What kind of movement feels supportive rather than compulsory?',
        caution:'Stop if there is pain, dizziness or concerning symptoms; seek medical guidance when appropriate.',sources:['E4']
      },
      {
        id:'food-adequacy',title:'Nourishment, sufficiency and self-respect',tradition:'Nutrition guidance',
        principle:'Adequate food is care; it is not a measure of virtue.',
        discussion:'Nutrition advice can become tangled with identity, shame and commercial wellness claims. WHO guidance emphasizes dietary variety, adequacy and balance at a population level. Circumstances like accessibility, cost and culture matter. This chapter does not prescribe calories, food restrictions, purifying diets or body ideals.',
        furtherReading:'Consider the difference between a public-health dietary principle and claims that a food determines spiritual purity or moral worth.',
        application:'Respond to ordinary hunger and thirst when able, choosing accessible satisfying food and water.',
        reflection:'What would a caring, realistic relationship with food look like?',
        caution:'Do not replace professional advice for a medical condition with restrictive wellness rules.',sources:['E5']
      },
      {
        id:'yoga-tai-chi',title:'Yoga, tai chi and embodied awareness',tradition:'Traditional movement practices and research',
        principle:'Movement traditions have cultural histories and measurable but limited evidence.',
        discussion:'Contemporary yoga and tai chi classes are sometimes studied for balance, pain or well-being outcomes. Findings differ by the intervention and population. The traditions also have philosophical, historical or religious contexts that an exercise study does not explain. The best starting point is comfortable participation with appropriate instruction, without demanding flexibility, mastery or special states of consciousness.',
        furtherReading:'Compare the historical context of the Yoga Sūtras with modern research on yoga, and distinguish classical Chinese contexts from studies of tai chi programs.',
        application:'If interested, explore a beginner-friendly gentle movement class with a qualified teacher.',
        reflection:'How can I practice movement while respecting both my limits and the tradition’s origins?',
        caution:'Do not force poses or breathing. Modify or stop if uncomfortable.',sources:['P4','E3','E8']
      },
      {
        id:'nature-connection',title:'Nature, connection and ordinary restoration',tradition:'Environmental and social well-being',
        principle:'Context, belonging and surroundings shape opportunities for care.',
        discussion:'Some research associates exposure to natural environments with mental well-being, but study quality and causality vary. Public-health work also emphasizes social connection, while recognizing that relationships can be complicated. Neither being outdoors nor maintaining relationships automatically produces good health. Meaningful connection may take modest forms including conversation, cooperation and shared attention.',
        furtherReading:'Evaluate whether a nature study is experimental or observational; ask which populations and environmental conditions it includes.',
        application:'Spend a short, accessible interval noticing the outdoors from a safe place, or check in with someone you trust.',
        reflection:'What surroundings and relationships genuinely support me?',
        caution:'Do not use social or nature practices to avoid needed professional care.',sources:['E7','E9']
      }
    ],
    exercises:[
      {name:'Eyes-open grounding',domain:'Mind',instructions:'Look around your environment, identify familiar objects and notice contact with a chair or floor.',context:'A gentle option; stop if distress increases.',sources:['E1','E10']},
      {name:'Rest-supporting transition',domain:'Body',instructions:'Choose one feasible step toward an adequate sleep opportunity tonight.',context:'Age-specific sleep guidance is population-level.',sources:['E6']},
      {name:'Movement that fits',domain:'Body',instructions:'Select a comfortable movement break that fits your ability and circumstances.',context:'No exercise quota or appearance goal.',sources:['E4']},
      {name:'Practical nourishment',domain:'Body',instructions:'Notice a food or hydration need and respond in a realistic way when possible.',context:'Nutrition emphasis is adequacy, not restriction.',sources:['E5']},
      {name:'Safe connection',domain:'Soul',instructions:'Enjoy a supportive conversation, or take a break from a draining interaction.',context:'Relationships can support well-being; boundaries still matter.',sources:['E7']}
    ]
  },
  {
    id:6,title:'Living the Philosophy',subtitle:'Everyday decisions, habits, relationships and self-reflection',
    introduction:'This final volume connects the earlier philosophical and health lenses to daily life. Rather than collecting ever more insights, it asks how care, responsibility and meaning appear in decisions, conversations, routines and relationships.',
    thesis:'A philosophy is most useful when it informs proportionate choices and allows revision.',
    editorialNote:'The activities are reflective prompts, not treatment protocols, and do not grade a person’s success or worth.',
    chapters:[
      {
        id:'values-choices',title:'Let values guide a real decision',tradition:'Stoic and Aristotelian ethics',
        principle:'Values become visible in specific actions.',
        discussion:'It is easy to admire fairness, courage and wisdom in the abstract. Harder cases involve competing obligations, imperfect information and uncertain outcomes. Stoic ethics offers the language of virtue, while Aristotle emphasizes judgment appropriate to circumstances. Neither demands a rigid rule for every decision. Notice the stakes, your responsibilities and what help or information you may need.',
        furtherReading:'Read a philosophical account of virtue, then consider a small case from ordinary life: a deadline, disagreement or request for help.',
        application:'Write the decision, the people affected, two options, and the value each would express. Choose a proportionate next step.',
        reflection:'How can a good process matter even when I cannot control the result?',
        caution:'Not all problems can be solved by attitude; ask for support when needed.',sources:['P2','P3']
      },
      {
        id:'habits-with-flexibility',title:'Routines with room for human needs',tradition:'Virtue cultivation and wellness',
        principle:'Consistency is useful when it serves life rather than dominates it.',
        discussion:'Aristotle’s account of habituation invites repeated ethical practice, not the pursuit of flawless streaks. Real lives contain illness, disrupted schedules, family obligations and changes in resources. A useful routine can be small, revisable and compatible with rest. A habit should be evaluated by its consequences for care and integrity, not by how rigidly it can be maintained.',
        furtherReading:'Compare ethical habituation with public-health guidance on rest and movement, recognizing that they justify different kinds of claims.',
        application:'Choose one small repeatable action that supports a value or a basic need, and name a gentler fallback for hard days.',
        reflection:'Does this routine support my life, or have I begun serving the routine?',
        caution:'Do not punish yourself for interruptions or reduced capacity.',sources:['P3','E4','E6']
      },
      {
        id:'listen-and-repair',title:'Listening, conflict and repair',tradition:'Confucian and relational ethics',
        principle:'Humaneness is practiced between people.',
        discussion:'Confucian teaching highlights respect and social practice, while Ubuntu emphasizes mutual dignity and relational belonging. Real conversations also require individual agency and boundaries. Good listening is not passive agreement. In an ordinary disagreement, it may mean checking what someone intended, acknowledging harm where relevant, expressing your own limits and looking for fair repair.',
        furtherReading:'Examine whether a tradition treats conflict principally as a problem of character, roles or community. Ask what each view explains well and what it can overlook.',
        application:'In a low-stakes disagreement, summarize the other perspective accurately before giving your own view.',
        reflection:'What does respectful disagreement look like when both people deserve dignity?',
        caution:'Repair is not obligatory when contact is unsafe or unwanted.',sources:['P6','P11','E7']
      },
      {
        id:'boundaries-and-care',title:'Compassion with boundaries',tradition:'Buddhist and relational ethics',
        principle:'Care for others should not require abandoning care for yourself.',
        discussion:'Compassion can be mistaken for endless availability. Buddhist ethics teaches the importance of non-harm and skillful conduct, while relational traditions emphasize responsibilities to others. Modern readers must still consider consent, safety and personal limits. A boundary can protect the conditions for a respectful relationship rather than deny concern for the other person.',
        furtherReading:'Consider how caring intentions differ from actions that are actually helpful. Good motives do not make every request reasonable.',
        application:'Practice a simple respectful limit for an everyday request, without overexplaining: “I cannot do that today.”',
        reflection:'Where can kindness and clarity strengthen each other?',
        caution:'Do not use spiritual ideals as pressure to remain in a harmful situation.',sources:['P1','P11']
      },
      {
        id:'work-rest-worth',title:'Worth beyond constant output',tradition:'Epicurean ethics and body care',
        principle:'A life includes pleasure, connection and necessary rest.',
        discussion:'Epicurus centers a considered form of contentment and friendship, while public-health research helps clarify bodily needs such as rest and movement. People may have pressing work and financial responsibilities, so “slow down” is not always practical. The philosophical question is whether every moment has become a test of usefulness. Some activities are valuable simply because they support life and connection.',
        furtherReading:'Compare the Epicurean distinction between desires with evidence-based public-health discussion of sleep and social relationships.',
        application:'Identify one accessible moment of rest or ordinary enjoyment that needs no productivity justification.',
        reflection:'Who am I when nothing is being measured?',
        caution:'Rest and pleasure are not indulgences to be earned only after exhaustion.',sources:['P7','E6','E7']
      },
      {
        id:'ongoing-inquiry',title:'A philosophy you can revise',tradition:'Existential and comparative inquiry',
        principle:'Growth includes changing your mind.',
        discussion:'A living philosophy allows questions that do not resolve quickly. Existential inquiry explores responsibility and meaning, while the other traditions in this collection offer different visions of character, discipline, belonging and liberation. There is no need to force them into one doctrine. You can learn, reject what does not fit, seek reliable evidence and remain respectful of beliefs you do not share.',
        furtherReading:'Revisit a passage from two traditions and list one agreement, one disagreement and one question that deserves further study.',
        application:'Write a short personal statement: “I want to pay attention to…, care for…, and remain open to learning about…”.',
        reflection:'Which view did I refine, rather than merely confirm, while reading these volumes?',
        caution:'The aim is inquiry and practical support, not final certainty or a perfect self.',sources:['P12','P1','P3','P5']
      }
    ],
    exercises:[
      {name:'A values decision',domain:'Mind',instructions:'Map a small choice to two values and the people it affects.',context:'Stoic/Aristotelian ethical reflection.',sources:['P2','P3']},
      {name:'A flexible routine',domain:'Body',instructions:'Choose one caring habit and an easier alternative for difficult days.',context:'A practical editorial synthesis; no health claim.',sources:['P3','E6']},
      {name:'Listen before replying',domain:'Soul',instructions:'Accurately summarize another viewpoint before sharing yours.',context:'Relational ethics with consent and boundaries.',sources:['P6','P11']},
      {name:'A respectful limit',domain:'Soul',instructions:'Practice wording for declining a reasonable but unworkable request.',context:'Ethical care need not erase personal autonomy.',sources:['P1','P11']},
      {name:'A revised life statement',domain:'Integrated',instructions:'Write what matters, one action and one question you will leave open.',context:'A continuing philosophical practice, not a personality test.',sources:['P12']}
    ]
  }
];

export const VOLUME_DIRECTORY = [
  {id:1,title:'Foundations of Wellness',subtitle:'Mind, body and soul'},
  ...WELLNESS_VOLUMES.map(v=>({id:v.id,title:v.title,subtitle:v.subtitle}))
] as const;
