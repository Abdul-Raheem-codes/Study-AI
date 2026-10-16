import axios from 'axios';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 150000 });

export async function generateNotes({ file, prompt, mode }) {
  const form = new FormData();
  form.append('file', file);
  form.append('prompt', prompt);
  form.append('mode', mode);
  try {
    const { data } = await http.post('/generate-notes', form);
    return data.notes;
  } catch (err) {
    if (err.response?.data?.error) throw new Error(err.response.data.error);
    if (err.code === 'ECONNABORTED') throw new Error('The request timed out. Try a smaller file.');
    throw new Error('Cannot reach the Study AI server. Check that the backend is running.');
  }
}

export function notesToMarkdown(n) {
  const out = [`# ${n.title}`, ''];
  if (n.summary) out.push(n.summary, '');
  n.sections.forEach((s) => {
    out.push(`## ${s.heading}`, '');
    s.paragraphs.forEach((p) => out.push(p, ''));
    s.bullets.forEach((b) => out.push(`- ${b}`));
    if (s.bullets.length) out.push('');
  });
  if (n.definitions.length) out.push('## Definitions', '', ...n.definitions.map((d) => `- **${d.term}**: ${d.meaning}`), '');
  if (n.keyPoints.length) out.push('## Key points', '', ...n.keyPoints.map((k) => `- ${k}`), '');
  if (n.formulas.length) out.push('## Formulas', '', ...n.formulas.map((f) => `- ${f.name ? f.name + ': ' : ''}\`${f.expression}\` ${f.explanation}`), '');
  if (n.takeaways.length) out.push('## Key takeaways', '', ...n.takeaways.map((k) => `- ${k}`), '');
  if (n.revisionQuestions.length) out.push('## Revision questions', '', ...n.revisionQuestions.map((q, i) => `${i + 1}. ${q}`), '');
  if (n.limitations.length) out.push('## Limitations', '', ...n.limitations.map((k) => `- ${k}`), '');
  return out.join('\n');
}
