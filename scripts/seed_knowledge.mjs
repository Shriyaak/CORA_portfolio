// scripts/seed_knowledge.mjs
// Run once: node scripts/seed_knowledge.mjs
// Re-run any time you update knowledge_base.json

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import ws from 'ws';

config({ path: '.env.local' });

const kb = JSON.parse(readFileSync('./lib/knowledge_base.json', 'utf8'));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { realtime: { transport: ws } }
);

async function embedText(text) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: [text],
      model: 'voyage-3-lite',
    }),
  });
  const json = await res.json();
  if (!json.data) {
    console.error('Voyage error:', JSON.stringify(json));
    throw new Error('Voyage embedding failed');
  }
  return json.data[0].embedding;
}

function buildChunks() {
  const chunks = [];

  // ── Person summary + contact ──────────────────────────────
  chunks.push({
    source: 'manual', category: 'about',
    title: 'About Shreeya',
    content: `${kb.person.summary} ${kb.person.visa.note} Email: ${kb.person.email}. LinkedIn: ${kb.person.linkedin}. GitHub: ${kb.person.github}.`,
    metadata: { email: kb.person.email, linkedin: kb.person.linkedin, github: kb.person.github }
  });

  // ── Work experience ───────────────────────────────────────
  for (const job of kb.work_experience) {
    chunks.push({
      source: 'cv', category: 'experience',
      title: `${job.role} at ${job.company}`,
      content: `${job.role} at ${job.company}, ${job.location}. ${job.period}. Stack: ${job.stack.join(', ')}. Achievements: ${job.achievements.join(' ')}`,
      metadata: { company: job.company, period: job.period, stack: job.stack }
    });
  }

  // ── Education ─────────────────────────────────────────────
  for (const edu of kb.education) {
    chunks.push({
      source: 'cv', category: 'education',
      title: `${edu.degree} — ${edu.institution}`,
      content: `${edu.degree} at ${edu.institution}, ${edu.location}. ${edu.period}. ${edu.highlights.join(' ')}`,
      metadata: { institution: edu.institution, degree: edu.degree }
    });
  }

  // ── Career gap ────────────────────────────────────────────
  if (kb.career_gap) {
    chunks.push({
      source: 'manual', category: 'faq',
      title: 'Career Gap Explanation 2023-2024',
      content: `Career gap period: ${kb.career_gap.period}. ${kb.career_gap.explanation}`,
      metadata: {}
    });
  }

  // ── Projects — individual chunks ──────────────────────────
  for (const proj of kb.projects) {
    chunks.push({
      source: 'cv', category: 'project',
      title: proj.name,
      content: `Project: ${proj.name}. Period: ${proj.period || 'N/A'}. Category: ${proj.category || 'general'}. Stack: ${(proj.stack || []).join(', ')}. ${proj.description}`,
      metadata: { stack: proj.stack, period: proj.period, category: proj.category }
    });
  }

  // ── Project index — master list for counting/cross-ref ────
  chunks.push({
    source: 'manual', category: 'project_index',
    title: 'Complete Project List and Count',
    content: `Shreeya has ${kb.projects.length} projects in total. Categories: AI Engineering, ML Engineering, NLP, Data Engineering, Data Analysis, Virtual Internships. Full list: ${kb.projects.map(p => `${p.name} (${p.period}, category: ${p.category || 'general'}) — Stack: ${(p.stack || []).join(', ')}`).join(' | ')}`,
    metadata: {}
  });

  // ── Skills ────────────────────────────────────────────────
  chunks.push({
    source: 'cv', category: 'skills',
    title: 'Technical Skills — Core and Primary',
    content: `Core skills: ${(kb.skills.core || []).join(', ')}. AI/ML skills: ${(kb.skills.ai_ml || []).join(', ')}. Data engineering: ${(kb.skills.data_engineering || []).join(', ')}. Cloud: ${(kb.skills.cloud || []).join(', ')}. Languages: ${(kb.skills.languages || []).join(', ')}.`,
    metadata: {}
  });

  chunks.push({
    source: 'cv', category: 'skills',
    title: 'Technical Skills — Data Analysis and Familiar',
    content: `Data analysis tools: ${(kb.skills.data_analysis || []).join(', ')}. Familiar with: ${(kb.skills.familiar || []).join(', ')}. Note: Shreeya's primary focus is AI/ML engineering and data engineering. Data analysis and BI tools are supporting skills.`,
    metadata: {}
  });


  // ── FAQ ───────────────────────────────────────────────────
  for (const faq of kb.recruiter_faq) {
    chunks.push({
      source: 'manual', category: 'faq',
      title: faq.q,
      content: `Q: ${faq.q} A: ${faq.a}`,
      metadata: {}
    });
  }

  // ── Website navigation ────────────────────────────────────
  if (kb.website) {
    chunks.push({
      source: 'manual', category: 'navigation',
      title: 'Website Pages and Navigation Guide',
      content: `This portfolio website has three main sections: ${kb.website.pages.map(p => `${p.name} (${p.url}): ${p.description}`).join(' | ')} Navigation tips: ${kb.website.navigation_tips.join(' ')}`,
      metadata: {}
    });
  }

  // ── Personal interests ────────────────────────────────────
  for (const interest of kb.personal.interests) {
    chunks.push({
      source: 'manual', category: 'personal',
      title: interest.name,
      content: `${interest.name}: ${interest.description}`,
      metadata: {}
    });
  }

  chunks.push({
    source: 'manual', category: 'personal',
    title: 'Personality',
    content: kb.personal.personality,
    metadata: {}
  });

  return chunks;
}

async function seed() {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const chunks = buildChunks();
  console.log(`Seeding ${chunks.length} chunks...\n`);

  for (const chunk of chunks) {
    try {
      const embedding = await embedText(chunk.content);
      const { error } = await supabase.from('knowledge_chunks').insert({
        ...chunk,
        embedding,
      });
      if (error) console.error(`✗ ${chunk.title}:`, error.message);
      else console.log(`✓ ${chunk.title}`);
      await sleep(200); // small delay to avoid rate limiting
    } catch (err) {
      console.error(`✗ ${chunk.title}:`, err.message);
    }
  }

  console.log('\nDone! CORA is ready.');
}

seed().catch(console.error);