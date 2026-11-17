import { Sponsor } from '@/types/sponsor';

// Hand-curated tiles, always shown first. Paid sponsors from Dodo checkout are appended after these.
export const sponsors: Sponsor[] = [
  {
    id: 'kylix',
    name: 'Kylix Studio',
    logo: '/sponsers/kylix.svg',
    url: 'https://kylix.studio',
    tagline: 'Design & development studio',
  },
  {
    id: 'easyui',
    name: 'EasyUI',
    logo: '/sponsers/easyui.png',
    url: 'https://easyui.site',
    tagline: 'Animated React UI components',
  },
];
