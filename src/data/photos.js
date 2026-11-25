// Photos from elizhappytravel.com (Liza's own photos).
// By default they load from the Weblium CDN. Run `npm run photos` once to download
// them into /public/photos — the site then serves them locally (VITE_LOCAL_PHOTOS=1 in .env).

const CDN = 'https://res2.weblium.site/res/65cb5fe063b9d7000f1ece66/';
const LOCAL = import.meta.env.VITE_LOCAL_PHOTOS === '1';

export const photo = (id) => (LOCAL ? `/photos/${id}.jpg` : `${CDN}${id}_optimized`);

// Named photos used across the site
export const P = {
  hero: '661bb5da7f70f9000ff84ad7',
  heroDolomites: '66277d0ba26858000f0f3fbb',
  heroBalkans: '661be2daa3cef00010176d4e',
  heroRidge: '6626cebac28862000fffe626',
  heroLapland: '66260fbf066a5a000f716e65',
  liza: '661bf4ffa3cef0001017959e',
  lizaJoy: '66276b4ec1152b000edf687e',
  lizaIce: '6626c9dca26858000f0e2257',
  lizaSnow: '6626ce84d6686c000f23f0c4',
  lizaClimb: '6626d136a26858000f0e328b',
  jump: '66276989c1152b000edf63f9',
  armsUp: '66276717a26858000f0efa6a',
  tourBalkans: '661bea1dfd942c000f4ad51c',
  tourTMB: '661bed1a7f70f9000ff8b940',
  tourDolomites: '661bf2557f70f9000ff8c5dd',
  tourSweden: '661bef1711469f000f608221',
  sveta: '661bff717f70f9000ff8e325',
  mikhail: '661c33e5660f5a000f0e880f',
  leonid: '662694a1a26858000f0d79ce',
  dolomitesSunset: '66277dbffc67c0000fe4b064',
  group: '6626d152d6686c000f23f6ae',
  sunsetClimb: '6626d129c28862000fffeb99',
};

// Gallery with categories (interleaved for a lively masonry)
export const gallery = [
  { id: '661bb5da7f70f9000ff84ad7', cat: 'alps' },
  { id: '66276989c1152b000edf63f9', cat: 'people' },
  { id: '66277d0ba26858000f0f3fbb', cat: 'dolomites' },
  { id: '6626cebac28862000fffe626', cat: 'alpinism' },
  { id: '661be2daa3cef00010176d4e', cat: 'balkans' },
  { id: '66260fbf066a5a000f716e65', cat: 'lapland' },
  { id: '6626d136a26858000f0e328b', cat: 'alpinism' },
  { id: '66277dbffc67c0000fe4b064', cat: 'dolomites' },
  { id: '6626d152d6686c000f23f6ae', cat: 'people' },
  { id: '661c25b2660f5a000f0e62cf', cat: 'alps' },
  { id: '66276717a26858000f0efa6a', cat: 'balkans' },
  { id: '6626d7716823e9000f662ee4', cat: 'alpinism' },
  { id: '66260dfea7af09000fa9e18a', cat: 'lapland' },
  { id: '6627761f6823e9000f6716da', cat: 'dolomites' },
  { id: '661bec5fa3cef0001017816b', cat: 'people' },
  { id: '661be0f97f70f9000ff8a078', cat: 'alps' },
  { id: '661c25fda3cef00010180b59', cat: 'balkans' },
  { id: '6626c9fdd6686c000f23e67e', cat: 'alpinism' },
  { id: '66277cc5c1152b000edfa03e', cat: 'dolomites' },
  { id: '6626d129c28862000fffeb99', cat: 'people' },
  { id: '66260f68edeb680010afc3c6', cat: 'lapland' },
  { id: '661c270ca3cef00010180e44', cat: 'alps' },
  { id: '661d198e660f5a000f100d73', cat: 'balkans' },
  { id: '6626cec96823e9000f661d57', cat: 'alpinism' },
  { id: '66277d3d6823e9000f6730d9', cat: 'dolomites' },
  { id: '66276b4ec1152b000edf687e', cat: 'people' },
  { id: '662792d6569a22001015e8e7', cat: 'alps' },
  { id: '661c26f07f70f9000ff943e2', cat: 'balkans' },
  { id: '6626d0a7c28862000fffea2c', cat: 'alpinism' },
  { id: '66260f5a066a5a000f716d6e', cat: 'lapland' },
  { id: '6626d89fc1152b000edea654', cat: 'people' },
  { id: '661bec83a3cef000101781cd', cat: 'alps' },
  { id: '661d1cb5fd942c000f4d18f8', cat: 'balkans' },
  { id: '6626d7fdc1152b000edea51f', cat: 'alpinism' },
  { id: '661bf2557f70f9000ff8c5dd', cat: 'dolomites' },
  { id: '6626d60a6823e9000f662bd5', cat: 'people' },
];

export const galleryCats = ['all', 'alps', 'dolomites', 'balkans', 'lapland', 'alpinism', 'people'];
