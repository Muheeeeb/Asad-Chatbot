import knowledge from "../src/data/knowledge.json";

type Row = Record<string, any>;

export function searchKnowledge(query: string, limit = 5): Row[] {
  try {
    const q = query.toLowerCase();

    // Ensure knowledge is an array
    if (!Array.isArray(knowledge)) {
      console.warn('[KnowledgeData] knowledge.json is not an array, returning empty results');
      return [];
    }

    // Filter out invalid entries
    const validKnowledge = knowledge.filter((row) => row && typeof row === 'object');

    if (validKnowledge.length === 0) {
      return [];
    }

    return validKnowledge
      .map((row) => {
        try {
          const text = Object.values(row).join(" ").toLowerCase();
          let score = 0;

          for (const word of q.split(/\s+/)) {
            if (word && text.includes(word)) score++;
          }

          return { row, score };
        } catch (error) {
          console.warn('[KnowledgeData] Error processing knowledge row:', error);
          return { row, score: 0 };
        }
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.row);
  } catch (error) {
    console.error('[KnowledgeData] Error searching knowledge:', error);
    return [];
  }
}
