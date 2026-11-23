export interface HeroSlideImage {
  id: string;
  src: string;
  alt: string;
}

export interface BilingualText {
  EN: string;
  ID: string;
}

export interface HeroContent {
  tagline: BilingualText;
  headline: BilingualText;
  description: BilingualText;
  ctaDiscuss: BilingualText;
  ctaServices: BilingualText;
  location: string;
  images: HeroSlideImage[];
}

export interface AboutContent {
  category: BilingualText;
  titleLine1: BilingualText;
  titleLine2: BilingualText;
  titleLine3: BilingualText;
  description: BilingualText;
  learnMore: BilingualText;
  showLess: BilingualText;
  yearsExperience: string;
  fieldExp: BilingualText;
  coverageLine1: string;
  coverageLine2: string;
  approach: BilingualText;
  technical: BilingualText;
  image: string;
  bannerOverlayText: BilingualText;
  sectorsTitle: BilingualText;
  sectorsDesc: BilingualText;
  processTitle: BilingualText;
  processDesc: BilingualText;
  dataDrivenTitle: BilingualText;
  dataDrivenDesc: BilingualText;
  permitTitle: BilingualText;
  permitDesc: BilingualText;
}

export interface ChallengeArticle {
  id: string;
  publisher: BilingualText;
  date: BilingualText;
  type: BilingualText;
  description: BilingualText;
  url: string;
  domain: string;
  badgeColor: string;
}

export interface WaterChallengesContent {
  eyebrow: BilingualText;
  headlinePart1: BilingualText;
  headlinePart2: BilingualText;
  description: BilingualText;
  bannerImage: string;
  ctaCalculator: BilingualText;
  ctaSolutions: BilingualText;
  referencesEyebrow: BilingualText;
  referencesTitle: BilingualText;
  readArticle: BilingualText;
  articles: ChallengeArticle[];
}

export interface ProductItem {
  id: string;
  number: string;
  name: BilingualText;
  category: string;
  priceLabel: BilingualText;
  price: BilingualText;
  shortDesc: BilingualText;
  fullDesc: BilingualText;
  image: string;
  status: "Active" | "Featured" | "Draft";
  includesEN: string[];
  includesID: string[];
  casingTypes: string[];
  note: BilingualText;
  disclaimer: BilingualText;
}

export interface ServicesSectionMeta {
  eyebrow: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  modalScope: BilingualText;
  modalCasing: BilingualText;
  modalConsultation: BilingualText;
  modalCta: BilingualText;
}

export interface ProjectMediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  titleEN?: string;
  description?: string;
  descriptionEN?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  date: string;
  scope: string;
  finalDepth: string;
  waterEncounter: string;
  waterDischarge: string;
  image: string;
  status: "Completed" | "Ongoing" | "Featured";
  gallery: ProjectMediaItem[];
}

export interface EquipmentItem {
  id: string;
  category: string;
  title: BilingualText;
  spec: BilingualText;
  image: string;
}

export interface EquipmentSectionContent {
  eyebrow: BilingualText;
  titleLine1: BilingualText;
  titleLine2: BilingualText;
  desc: BilingualText;
  cta: BilingualText;
  items: EquipmentItem[];
}

export interface FaqItem {
  id: string;
  question: BilingualText;
  answer: BilingualText;
}

export interface FaqSectionContent {
  eyebrow: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  ctaButton: BilingualText;
  items: FaqItem[];
}

export interface ContactContent {
  eyebrow: BilingualText;
  title: BilingualText;
  desc: BilingualText;
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  coverage: string;
  experienceHighlight: BilingualText;
  footerBrandDesc: BilingualText;
  collaborationName: string;
  collaborationUrl: string;
}

export interface CMSContent {
  updatedAt: string;
  hero: HeroContent;
  about: AboutContent;
  waterChallenges: WaterChallengesContent;
  servicesMeta: ServicesSectionMeta;
  products: ProductItem[];
  projects: ProjectItem[];
  equipment: EquipmentSectionContent;
  faq: FaqSectionContent;
  contact: ContactContent;
}

