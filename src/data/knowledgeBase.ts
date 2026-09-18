import kb1_5 from '../../content/knowledge-base/kb-01-05.json';
import kb6_10 from '../../content/knowledge-base/kb-06-10.json';
import kb11_15 from '../../content/knowledge-base/kb-11-15.json';
import kb16_20 from '../../content/knowledge-base/kb-16-20.json';
import kb21_25 from '../../content/knowledge-base/kb-21-25.json';
import kbIndexRaw from '../../content/knowledge-base/index.json';
import { Category, KBIndex, ExistentialRoot } from '../types';

export const KB_METADATA: KBIndex = kbIndexRaw as unknown as KBIndex;

export const ALL_CATEGORIES: Category[] = [
  ...(kb1_5 as unknown as Category[]),
  ...(kb6_10 as unknown as Category[]),
  ...(kb11_15 as unknown as Category[]),
  ...(kb16_20 as unknown as Category[]),
  ...(kb21_25 as unknown as Category[]),
];

export const EXISTENTIAL_ROOTS_INFO: Record<ExistentialRoot, {
  label: string;
  description: string;
  yalomFraming: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  Isolation: {
    label: 'Isolation',
    description: 'The fundamental boundary between the self and others.',
    yalomFraming: 'No matter how connected we are, each of us is alone in our own experience.',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50/80',
    borderColor: 'border-indigo-200',
  },
  Freedom: {
    label: 'Freedom & Responsibility',
    description: 'The weight of choice, agency, and groundlessness.',
    yalomFraming: 'We have to choose, with no absolute ground for the choice — responsibility, control, groundlessness.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-200',
  },
  Death: {
    label: 'Death & Impermanence',
    description: 'The reality of loss, aging, vulnerability, and change.',
    yalomFraming: 'We want to live, but know we will die — impermanence, time, loss.',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50/80',
    borderColor: 'border-rose-200',
  },
  Meaninglessness: {
    label: 'Meaning & Purpose',
    description: 'The hunger to construct significance in an indifferent universe.',
    yalomFraming: 'We want life to mean something, but the universe supplies no inherent meaning.',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-200',
  },
};

export const PILLAR_INFO: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  badgeColor: string;
  accentBg: string;
}> = {
  eastern_philosophy: {
    title: 'Eastern Philosophy',
    subtitle: 'Metaphysical & Contemplative Grounding',
    description: 'Sourced teachings from Buddhism, Daoism, and classical Eastern non-dual traditions that reframe separateness, craving, and impermanence.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    accentBg: 'from-amber-500/10 to-orange-500/5',
  },
  shadow_work: {
    title: 'Jungian Shadow Work',
    subtitle: 'Depth Psychology & Reclamation',
    description: 'Rigorous insights from Carl Jung and post-Jungian analysts into projected wounds, exiled aspects of the self, and the pursuit of psychological wholeness.',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    accentBg: 'from-indigo-500/10 to-purple-500/5',
  },
  psychology_methodology: {
    title: 'Evidence-Based Psychology',
    subtitle: 'Empirical Frameworks & Living Interventions',
    description: 'Validated contemporary psychological methodologies including ACT, Self-Compassion, Logotherapy, and Cognitive science.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accentBg: 'from-emerald-500/10 to-teal-500/5',
  },
};

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or Text 988',
    url: 'https://988lifeline.org',
    badge: '24/7 Free & Confidential',
    description: 'Immediate compassionate support for individuals experiencing mental health distress, suicidal crisis, or emotional overwhelm.',
    actionLabel: 'Call or Text 988',
    tel: 'tel:988',
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    url: 'https://www.crisistextline.org',
    badge: '24/7 Text Support',
    description: 'Connect with a trained crisis counselor via SMS to receive immediate, non-judgmental human support.',
    actionLabel: 'Text 741741',
    sms: 'sms:741741?body=HOME',
  },
  {
    name: '211 Essential Community Services',
    contact: 'Call 211',
    url: 'https://www.211.org',
    badge: 'Food, Housing, Health',
    description: 'Direct assistance connecting you to local emergency housing, substance recovery programs, food, and basic human services.',
    actionLabel: 'Visit 211.org',
    tel: 'tel:211',
  },
  {
    name: 'National Domestic Violence Hotline',
    contact: '1-800-799-SAFE (7233)',
    url: 'https://www.thehotline.org',
    badge: '24/7 Safe & Confidential',
    description: 'Advocacy, safety planning, and immediate support for anyone experiencing relationship abuse or intimate partner violence.',
    actionLabel: 'Call 1-800-799-7233',
    tel: 'tel:18007997233',
  },
  {
    name: 'RAINN Sexual Assault Hotline',
    contact: '1-800-656-4673',
    url: 'https://www.rainn.org',
    badge: '24/7 Free',
    description: 'Free, confidential support for survivors of sexual assault and violence.',
    actionLabel: 'Call 1-800-656-4673',
    tel: 'tel:18006564673',
  },
  {
    name: 'SAMHSA National Helpline',
    contact: '1-800-662-HELP (4357)',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    badge: 'Substance & Mental Health',
    description: 'Confidential free treatment referral and information service for substance use disorders and mental health crises.',
    actionLabel: 'Call 1-800-662-4357',
    tel: 'tel:18006624357',
  }
];
