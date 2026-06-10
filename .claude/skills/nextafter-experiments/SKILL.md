---
name: nextafter-experiments
description: "Search and synthesize 4,450 A/B testing experiments from NextAfter covering nonprofit fundraising, email marketing, donation page optimization, conversion rate optimization, and digital engagement. Use when the user asks about: fundraising best practices, donation page design, email subject lines, gift arrays, ask amounts, recurring/monthly giving, landing pages, calls to action, sticky bars, pop-ups, value propositions, social proof, urgency/scarcity tactics, form optimization, click-through rates, open rates, revenue optimization, Facebook/social ads for nonprofits, or any A/B testing question related to nonprofit digital strategy and donor conversion."
---

# NextAfter Experiments

Dataset of 4,450 real A/B testing experiments from NextAfter. Experiments span nonprofit fundraising, email marketing, donation pages, and digital engagement. Source: nextafter.com/all-experiments/

## Data Location

All data is in `assets/` relative to this skill's directory. Always read `assets/index.json` first.

```
assets/
  index.json              — master index with file paths and counts
  by-tier/
    tier-1-valid.json     — 2,465 experiments (>=95% confidence) ← PRIMARY SOURCE
    tier-2-directional.json — 613 experiments (80-95% confidence)
    tier-3-inconclusive.json — 1,372 experiments (<80% confidence)
  by-topic/               — 19 topic files
  by-organization/        — 45 organization files
```

Topic files: donation-pages, email-fundraising, email-acquisition, email-subject-lines, landing-pages, facebook-ads, recurring-giving, value-proposition, gift-arrays, calls-to-action, sticky-bars-popups, design-layout, urgency-scarcity, forms-fields, social-proof-trust, revenue-optimization, open-rates, click-rates, other.

Experiments are tagged to multiple topics. Each file is sorted: Tier 1 first, then 2, then 3.

## Experiment Schema

```
id, experimentId, title, date, url, organization, categoryNames, tagNames
tier           — 1 (valid >=95%), 2 (directional 80-95%), 3 (inconclusive <80%)
lift           — percentage lift (number or array for multiple treatments)
confidence     — max confidence % across treatments
metricName     — "Conv. Rate" | "Click Rate" | "Revenue per Visitor" | "Open Rate"
results.rows[] — { code, name, metric, lift, confidence } per treatment
researchQuestion — hypothesis tested
summary        — experiment timeframe and context
keyLearnings   — NextAfter's analysis of results
fluxMetrics    — downstream impact on traffic, conversion, revenue
```

## Query Workflow

### 1. Identify question type and load data

| Question type | Example | Read file |
|---|---|---|
| Topic query | "What works for donation page headlines?" | `by-topic/donation-pages.json` |
| Organization query | "Heritage Foundation email experiments" | `by-organization/the-heritage-foundation.json` |
| Cross-reference | "Email subject lines for recurring giving" | Both topic files, intersect by ID |
| Broad synthesis | "Top 5 fundraising tactics" | `index.json` → sample largest topic files |

For large files (>500 experiments), grep for keywords before loading the full file.

### 2. Filter by tier

- Default to **Tier 1 only**
- Include Tier 2 when Tier 1 has <5 relevant results, with qualifier
- Include Tier 3 **only for keyLearnings text** — never cite its lift/results numbers
- Require 5+ corroborating experiments before stating a pattern

### 3. Respond by depth

**Quick lookup** ("What lift do gift arrays produce?"):
State finding, cite 2-3 experiments with lift % and confidence. One paragraph.

**Strategic recommendation** ("How should we optimize our donation page?"):
Synthesize across experiments into actionable recommendations grouped by sub-tactic. Cite experiment counts and typical lift ranges. Flag thin evidence (<5 experiments).

**Deep dive** ("Tell me everything about subject line testing"):
Comprehensive analysis with sections. Individual citations with title, org, lift, confidence, URL. Include contrasting results and edge cases. Separate Tier 2/3 findings.

### 4. Citation rules

- State how many experiments inform each finding
- Tier 1: cite directly as evidence
- Tier 2: qualify with "directional evidence suggests"
- Tier 3: only reference the keyLearnings analysis, never the numbers
- Never present one experiment as universal truth — require corroboration
- Include experiment URL for specific citations in deep dives
