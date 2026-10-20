// Moods a quote can be tagged with. `phrase` is what gets stored on the quote doc,
// so renaming one orphans existing posts. Add new ones freely.
export const MOODS = [
  { phrase: 'Motivated', emoji: '🔥' },
  { phrase: 'Determined', emoji: '💪' },
  { phrase: 'Grateful', emoji: '🙏' },
  { phrase: 'Happy', emoji: '😄' },
  { phrase: 'Hopeful', emoji: '🌅' },
  { phrase: 'Confident', emoji: '😎' },
  { phrase: 'Calm', emoji: '🧘' },
  { phrase: 'Focused', emoji: '🎯' },
  { phrase: 'In Love', emoji: '❤️' },
  { phrase: 'Proud', emoji: '🏆' },
  { phrase: 'Tired', emoji: '😮‍💨' },
  { phrase: 'Stressed', emoji: '😣' },
  { phrase: 'Anxious', emoji: '😟' },
  { phrase: 'Sad', emoji: '😢' },
  { phrase: 'Lonely', emoji: '🫥' },
  { phrase: 'Angry', emoji: '😤' },
  { phrase: 'Heartbroken', emoji: '💔' },
  { phrase: 'Lost', emoji: '🧭' },
  { phrase: 'Unmotivated', emoji: '🐢' },
  { phrase: 'Overwhelmed', emoji: '🌊' },
].map((mood, index, all) => ({
  ...mood,
  color: `hsl(${Math.round(index * (360 / all.length))}, 55%, 60%)`,
}));

const byPhrase = Object.fromEntries(MOODS.map((m) => [m.phrase, m]));

// Older posts were tagged with moods that are no longer in the list; fall back gracefully.
export function moodFor(phrase, color) {
  return byPhrase[phrase] ?? { phrase: phrase ?? 'Unknown', emoji: '💬', color: color ?? 'hsl(230, 15%, 55%)' };
}
