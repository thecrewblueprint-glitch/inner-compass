/**
 * Public, general-education excerpt from the standalone Whole Life Field Guide.
 * No private Personality records, assessments, profile notes, or identifiers.
 * Editorial source separation: traditions describe philosophy; research addresses outcomes.
 */
export type WellnessDomain = 'Mind' | 'Body' | 'Soul' | 'Integrated';
export interface WellnessTradition {
  name: string; region: string; domain: WellnessDomain; principle: string;
  description: string; reflection: string; source: string;
}
export interface WellnessPractice {
  title: string; domain: WellnessDomain; time: string; description: string;
  evidenceNote: string; source: string;
}
export interface WellnessSource {
  id: string; title: string; publisher: string; url: string; kind: 'Tradition' | 'Research';
}
export const WELLNESS_TRADITIONS: WellnessTradition[] = [
  {name:'Buddhism',region:'South and East Asian traditions',domain:'Mind',principle:'Compassion and insight',description:'Diverse Buddhist schools connect attention with ethical action, compassion and understanding suffering; mindfulness is not the whole tradition.',reflection:'Consider a gentle wish for well-being for yourself and another person.',source:'P1'},
  {name:'Classical Yoga',region:'Indian philosophical traditions',domain:'Body',principle:'Ethics and embodied attention',description:'Patañjali’s eight limbs include non-harm, truthful living, posture, breath regulation and forms of meditation. Yoga is not merely exercise.',reflection:'Try comfortable movement with the principle of non-harm in mind; do not force a pose.',source:'P4'},
  {name:'Daoism',region:'Chinese philosophical and religious traditions',domain:'Soul',principle:'Responsive, unforced action',description:'The Dao (way) and wu wei invite responsiveness to circumstances rather than trying to control everything. Daoist lineages are varied.',reflection:'Notice where a modest task becomes simpler with less unnecessary forcing.',source:'P5'},
  {name:'Confucian thought',region:'Chinese ethical philosophy',domain:'Soul',principle:'Humaneness expressed in relationships',description:'Ren (humaneness), li (ritual/propriety), learning and respectful responsibilities inform the cultivation of character.',reflection:'Treat one ordinary conversation as an opportunity for genuine attention.',source:'P6'},
  {name:'Stoicism',region:'Greek and Roman philosophy',domain:'Mind',principle:'Agency and virtue',description:'Wisdom, courage, justice and moderation guide choices; distinguish what you can influence from the results you cannot command.',reflection:'Write one action available to you and one outcome you cannot guarantee.',source:'P2'},
  {name:'Aristotle',region:'Ancient Greek ethics',domain:'Integrated',principle:'Flourishing through habits',description:'Eudaimonia names a flourishing life involving practical wisdom, good habits, friendship and supportive circumstances—not uninterrupted happiness.',reflection:'Choose a specific act of fairness, generosity or sound judgment.',source:'P3'},
  {name:'Epicurus',region:'Ancient Greek ethics',domain:'Soul',principle:'Friendship and enoughness',description:'Epicurean philosophy values simplicity, prudence, friendship and release from needless anxiety; it does not mean excess.',reflection:'Enjoy a small ordinary pleasure without first making it a reward.',source:'P7'},
  {name:'Sufi contemplative paths',region:'Islamic religious traditions',domain:'Soul',principle:'Remembrance and character',description:'Dhikr (remembrance of God) and related contemplative practices occur in specific Islamic religious and communal contexts.',reflection:'Read about the original context or, if part of the tradition, learn from your community.',source:'P8'},
  {name:'Jewish Mussar',region:'Jewish ethical and spiritual practice',domain:'Mind',principle:'Deliberate character cultivation',description:'Mussar focuses on middot, character qualities such as humility, gratitude, patience and courage, developed in everyday life.',reflection:'Choose one quality and a small way it could guide your next interaction.',source:'P9'},
  {name:'Christian contemplation',region:'Christian religious traditions',domain:'Soul',principle:'Sacred reading and discernment',description:'Lectio divina is reflective engagement with Scripture through reading, meditation, prayer and contemplation in Christian contexts.',reflection:'Learn its stages and, if it fits your faith, engage with a short passage.',source:'P10'},
  {name:'Ubuntu',region:'African relational ethical perspectives',domain:'Soul',principle:'Mutual dignity and interdependence',description:'Ubuntu emphasizes human relationships, solidarity and reciprocity; it is not a summary of every African philosophy.',reflection:'Recognize a person who supported you and consider an appropriate act of care in return.',source:'P11'},
  {name:'Existential inquiry',region:'Modern philosophical approaches',domain:'Mind',principle:'Authenticity and chosen commitments',description:'Existential thinkers examine responsibility, freedom, authenticity and meaning without prescribing one universal worldview.',reflection:'Complete: “This week, I want my attention to serve…”',source:'P12'}
];
export const WELLNESS_PRACTICES: WellnessPractice[] = [
  {title:'Two-minute orientation',domain:'Mind',time:'2 minutes',description:'With eyes open, notice several objects in the room and feel the ground beneath your feet. Breathe naturally.',evidenceNote:'Attention practice is optional; responses vary. Not a medical protocol.',source:'E1'},
  {title:'Fact / interpretation / choice',domain:'Mind',time:'4 minutes',description:'Write what happened, what you concluded, one alternative interpretation, and one constructive next action.',evidenceNote:'Stoic-inspired reflection; this precise exercise is not clinically validated.',source:'P2'},
  {title:'Kind intention',domain:'Mind',time:'3 minutes',description:'Offer a simple wish for basic well-being to yourself and someone else. Do not force any emotion.',evidenceNote:'Kindness-based meditation research exists; outcomes and certainty vary.',source:'E2'},
  {title:'Contemplative reading',domain:'Mind',time:'5 minutes',description:'Read a short primary text or commentary. Note one insight and one question without self-grading.',evidenceNote:'Philosophical practice, not an evidence-based treatment.',source:'P3'},
  {title:'Comfortable everyday movement',domain:'Body',time:'5–20 minutes',description:'Walk or move gently at your own pace, adapting for your environment, ability and energy.',evidenceNote:'Regular physical activity supports health; avoid forcing personal targets.',source:'E4'},
  {title:'Gentle movement break',domain:'Body',time:'3–8 minutes',description:'Move hands, shoulders or ankles through easy, comfortable ranges. Stop for pain or dizziness.',evidenceNote:'General movement guidance, not individualized care.',source:'E4'},
  {title:'A sleep-friendly transition',domain:'Body',time:'10 minutes',description:'Reduce stimulation when practical and give yourself an age-appropriate opportunity to rest.',evidenceNote:'Sleep needs vary with age and circumstances.',source:'E6'},
  {title:'Nourishment without rules',domain:'Body',time:'As needed',description:'Notice hunger or thirst and choose accessible food and water that satisfy your needs.',evidenceNote:'Adequacy and variety matter more than spiritual food rules.',source:'E5'},
  {title:'Gentle yoga',domain:'Body',time:'Flexible',description:'Learn comfortable foundational movements with a qualified teacher; never force flexibility or breath.',evidenceNote:'Benefits and physical risks depend on the practice and individual.',source:'E3'},
  {title:'Tai chi exploration',domain:'Body',time:'Flexible',description:'Consider a beginner-friendly, low-impact movement class focused on balance and coordination.',evidenceNote:'Evidence is outcome- and population-specific.',source:'E8'},
  {title:'Sincere check-in',domain:'Soul',time:'3 minutes',description:'Ask a trusted person how they are and listen without rushing to fix anything.',evidenceNote:'Social connection supports well-being; relationships should respect boundaries.',source:'E7'},
  {title:'Values before speed',domain:'Soul',time:'4 minutes',description:'Choose one principle—such as honesty, kindness or fairness—and an attainable action that expresses it.',evidenceNote:'Ethical inquiry, not a clinical intervention.',source:'P3'},
  {title:'Nature noticing',domain:'Soul',time:'5–15 minutes',description:'Observe sky, plants, trees or weather from an accessible, safe place.',evidenceNote:'Research on nature and mental health is promising but varies in quality.',source:'E9'},
  {title:'A freely chosen act of service',domain:'Soul',time:'Flexible',description:'Offer useful help that respects consent, resources and your own limits.',evidenceNote:'Philosophical application; no promised treatment benefit.',source:'P11'},
  {title:'Everyday wonder',domain:'Soul',time:'3 minutes',description:'Contemplate music, art or an ordinary mystery with curiosity. No special emotional state required.',evidenceNote:'Meaning prompt, not a clinically tested protocol.',source:'E11'},
  {title:'Morning intention',domain:'Integrated',time:'2 minutes',description:'Ask what matters today, what care your body needs, and where your attention could make a difference.',evidenceNote:'Editorial synthesis, not a medical protocol.',source:'P6'},
  {title:'Gentle midday check-in',domain:'Integrated',time:'3 minutes',description:'Notice physical comfort, acknowledge one feeling, and select one reasonable next step.',evidenceNote:'Reflective suggestion; not a treatment claim.',source:'E1'},
  {title:'Evening reflection without grades',domain:'Integrated',time:'5 minutes',description:'Name something that supported you, one challenge, and a small adjustment for tomorrow.',evidenceNote:'Philosophical reflection; not a treatment claim.',source:'P2'}
];
export const WELLNESS_JOURNEY: string[] = [
'Choose one value','Orient to your surroundings','Notice one physical need','Take a comfortable walk or stretch','Separate fact from assumption','Offer a sincere check-in','Reflect on what felt useful',
'Act with courage in an ordinary moment','Consider non-harm toward yourself or others','Make space for rest','Meet a task with less forcing','Appreciate an ordinary pleasure','Read a meaningful passage in context','Keep or revise one practice',
'Offer service without pressure','Practice compassionate attention','Respect a personal limit','Ask for or offer connection','Revisit an assumption gently','Write a short values statement','Make a flexible one-week plan'
];
export const WELLNESS_SOURCES: WellnessSource[] = [
{id:'P1',title:'Ethics in Indian and Tibetan Buddhism',publisher:'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/archives/spr2017/entries/ethics-indian-buddhism/',kind:'Tradition'},
{id:'P2',title:'Stoicism',publisher:'Internet Encyclopedia of Philosophy',url:'https://iep.utm.edu/stoicism/',kind:'Tradition'},
{id:'P3',title:'Aristotle’s Ethics',publisher:'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/entries/aristotle-ethics/',kind:'Tradition'},
{id:'P4',title:'Yoga Sutras of Patanjali',publisher:'Internet Encyclopedia of Philosophy',url:'https://iep.utm.edu/yoga/',kind:'Tradition'},
{id:'P5',title:'Daoism',publisher:'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/entries/daoism/',kind:'Tradition'},
{id:'P6',title:'Confucius',publisher:'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/entries/Confucius/',kind:'Tradition'},
{id:'P7',title:'Epicurus',publisher:'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/entries/epicurus/',kind:'Tradition'},
{id:'P8',title:'Islam and Meditation',publisher:'Oxford Academic',url:'https://academic.oup.com/edited-volume/40700/chapter-abstract/348428972',kind:'Tradition'},
{id:'P9',title:'The Musar Movement',publisher:'My Jewish Learning',url:'https://www.myjewishlearning.com/article/the-musar-movement/',kind:'Tradition'},
{id:'P10',title:'Lectio Divina',publisher:'US Conference of Catholic Bishops',url:'https://www.usccb.org/resources/lectio-divina-0',kind:'Tradition'},
{id:'P11',title:'African philosophies of personhood, healthcare and difference',publisher:'PMC journal article',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9286638/',kind:'Tradition'},
{id:'P12',title:'Existentialism',publisher:'Stanford Encyclopedia of Philosophy',url:'https://plato.stanford.edu/archives/fall2020/entries/existentialism/',kind:'Tradition'},
{id:'E1',title:'Meditation and Mindfulness: Effectiveness and Safety',publisher:'NIH NCCIH',url:'https://www.nccih.nih.gov/health/meditation-and-mindfulness-effectiveness-and-safety/',kind:'Research'},
{id:'E2',title:'Kindness-based meditation systematic review',publisher:'PubMed',url:'https://pubmed.ncbi.nlm.nih.gov/24979314/',kind:'Research'},
{id:'E3',title:'5 Things You Should Know About Yoga',publisher:'NIH NCCIH',url:'https://www.nccih.nih.gov/health/tips/things-you-should-know-about-yoga',kind:'Research'},
{id:'E4',title:'Physical activity',publisher:'World Health Organization',url:'https://www.who.int/news-room/fact-sheets/detail/physical-activity/',kind:'Research'},
{id:'E5',title:'Healthy diet',publisher:'World Health Organization',url:'https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet',kind:'Research'},
{id:'E6',title:'Sleep and Health',publisher:'US CDC',url:'https://www.cdc.gov/healthy-schools/sleep/',kind:'Research'},
{id:'E7',title:'Our Epidemic of Loneliness and Isolation',publisher:'US Surgeon General',url:'https://www.ncbi.nlm.nih.gov/books/NBK595227/',kind:'Research'},
{id:'E8',title:'Tai Chi: What You Need To Know',publisher:'NIH NCCIH',url:'https://www.nccih.nih.gov/health/tai-chi-what-you-need-to-know',kind:'Research'},
{id:'E9',title:'Nature exposure and mental health systematic review',publisher:'PubMed',url:'https://pubmed.ncbi.nlm.nih.gov/38821342/',kind:'Research'},
{id:'E10',title:'Relaxation Techniques: What You Need To Know',publisher:'NIH NCCIH',url:'https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know',kind:'Research'},
{id:'E11',title:'Meaning, Purpose, and Spirituality in Lifestyle Medicine',publisher:'PubMed (2026 review)',url:'https://pubmed.ncbi.nlm.nih.gov/41798879/',kind:'Research'},
{id:'E12',title:'Qigong: What You Need To Know',publisher:'NIH NCCIH',url:'https://www.nccih.nih.gov/health/qigong-what-you-need-to-know',kind:'Research'}
];
