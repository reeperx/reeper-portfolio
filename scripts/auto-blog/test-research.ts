import { AITrendResearcher } from './research.js';

async function main() {
  const researcher = new AITrendResearcher('fc-15fa12c9231a4726bb9e60852d3b4b74');
  const results = await researcher.researchAllTopics(3);
  console.log('Found', results.length, 'results');
  results.slice(0, 5).forEach(r => console.log('-', r.title, '|', r.source, '| score:', r.relevanceScore));
}

main();