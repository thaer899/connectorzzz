export default class TemplateProfile {
  username: string;
  email: string;
  education: { title: string; school: string; period: string; }[];
  employment: { technologies: any[]; }[];
  interests: any[];
  languages: {}[];
  personal: { about: string; }[];
  references: { name: string; email: string; relation: string; }[];
  resume: { title: string; url: string; }[];
  theme: any;
  skills: { name: string; level: number; }[];
  bots: { name: string; description: string; }[];
}
