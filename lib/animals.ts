export interface Animal {
  id: string;
  name: string;
  emoji: string;
  twemojiCode: string;
}

export const ANIMALS: Animal[] = [
  { id: 'dog', name: 'Dog', emoji: '🐕', twemojiCode: '1f415' },
  { id: 'cat', name: 'Cat', emoji: '🐈', twemojiCode: '1f408' },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', twemojiCode: '1f42d' },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', twemojiCode: '1f439' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', twemojiCode: '1f430' },
  { id: 'fox', name: 'Fox', emoji: '🦊', twemojiCode: '1f98a' },
  { id: 'bear', name: 'Bear', emoji: '🐻', twemojiCode: '1f43b' },
  { id: 'panda', name: 'Panda', emoji: '🐼', twemojiCode: '1f43c' },
  { id: 'koala', name: 'Koala', emoji: '🐨', twemojiCode: '1f428' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', twemojiCode: '1f42f' },
  { id: 'lion', name: 'Lion', emoji: '🦁', twemojiCode: '1f981' },
  { id: 'cow', name: 'Cow', emoji: '🐮', twemojiCode: '1f42e' },
  { id: 'pig', name: 'Pig', emoji: '🐷', twemojiCode: '1f437' },
  { id: 'frog', name: 'Frog', emoji: '🐸', twemojiCode: '1f438' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', twemojiCode: '1f435' },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', twemojiCode: '1f414' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', twemojiCode: '1f427' },
  { id: 'bird', name: 'Bird', emoji: '🐦', twemojiCode: '1f426' },
  { id: 'duck', name: 'Duck', emoji: '🦆', twemojiCode: '1f986' },
  { id: 'eagle', name: 'Eagle', emoji: '🦅', twemojiCode: '1f985' },
];

export function getTwemojiUrl(code: string): string {
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${code}.png`;
}

export function getAnimalById(id: string): Animal | undefined {
  return ANIMALS.find(animal => animal.id === id);
}

export function getRandomAvailableAnimal(takenIds: string[]): Animal | null {
  const available = ANIMALS.filter(animal => !takenIds.includes(animal.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}
