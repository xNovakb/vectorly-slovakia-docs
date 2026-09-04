---
name: study-topic
description: Plan and build a new topic under docs/02-study-materials/ (or extend an existing one) — asks scope/depth questions first, proposes a folder structure for approval, then scaffolds and writes bilingual (EN+SK) content with worked examples, diagrams, and admonitions where they earn their place. Use when the user wants to add a new study-materials subject (e.g. "add a Docker topic", "we should learn X", "create a topic for Y") or asks to plan/scaffold study-material structure.
---

# Study Topic Builder

Builds a new `docs/02-study-materials/<topic>/` subject the same way the existing Git,
SSH & Networking, and Linux & Shell topics were built — so the result is consistent with them in
depth, tone, and structure without re-deriving the approach each time.

## 1. Ask before planning

Do not guess these — ask (`AskUserQuestion`), because they change the whole shape of the output:

- **Scope**: general/theory-only for this technology, or specifically tied to how this org uses it
  (cross-linked into `/internal-operations/server-architecture` and `/internal-operations/git-workflow`
  the way Networking and Linux & Shell are)? Default recommendation: tie it to the real setup where
  a real setup exists — it's what made those two topics useful rather than generic.
- **Depth**: skim-level overview, or the same depth as existing topics (each subsection a handful
  of pages, each page ~40-90 lines with 2-5 runnable examples)? Default to matching existing depth
  for consistency unless the user asks for something lighter.
- Only ask what's genuinely ambiguous — don't re-ask something the user already stated in their
  request.

## 2. Propose the structure first, get it approved

Before writing anything, output a folder tree (subfolders → pages, one line each with a short
comment on what it covers) sized comparably to the existing topics (~4-6 subfolders, ~15-22 pages
total). Point out 1-2 natural cross-link spots into other study-materials topics and into the real
internal-operations docs. Wait for the user to confirm or adjust before scaffolding anything —
don't write files on the first pass.

## 3. Scaffold

Read `docs-writing` skill conventions first if not already loaded this session (frontmatter,
`_category_.json`, i18n mirroring, stub format) — this skill assumes those, doesn't repeat them.

- `mkdir` the EN folders under `docs/02-study-materials/<topic>/` and the mirrored SK folders
  under `i18n/sk/docusaurus-plugin-content-docs/current/study-materials/<topic>/`.
- Write `_category_.json` for the topic root and every subfolder, EN and SK, each with a
  `generated-index` `link` and a one-line `description`.
- **Check for label collisions before writing categories**: if a subfolder label (most commonly
  "Basics") already exists under another topic in the same sidebar (`studyMaterialsSidebar`), add
  a unique `"key"` field to `_category_.json` (e.g. `"key": "DockerBasics"`) on **both** the EN and
  SK category file, and use that same key (not the plain label) when adding the corresponding
  entry to `i18n/sk/docusaurus-plugin-content-docs/current.json`. Skipping this produces a
  same-locale-only build failure ("Multiple docs sidebar items produce the same translation key")
  that only surfaces on the SK build.
- Add every new category label's SK translation to `current.json` (`sidebar.studyMaterialsSidebar.category.<Label-or-Key>`).

## 4. Write EN content

For each page: real explanation (not filler), then runnable command/code examples — this is the
"how much examples" the user is asking about calibrating: default to 2-5 short, concrete,
copy-pasteable examples per page, not one abstract example per concept.

- **Mermaid, when a real shape needs showing** — a sequence of steps between systems (handshake,
  resolution flow, request/response), a branching/network topology, or a process tree. Don't reach
  for it to decorate a single-line before/after comparison; plain text or a small table is enough
  there (see how `git/05-conventions/squash-and-rebase.md` mixes one mermaid diagram with two plain
  ones). Confirm Mermaid is enabled (`themes: ['@docusaurus/theme-mermaid']` and
  `markdown: { mermaid: true }` in `docusaurus.config.ts`, `@docusaurus/theme-mermaid` in
  `package.json` pinned to the same version as `@docusaurus/core`) — if not, install and wire it up
  once, first.
- **Admonitions** (`:::warning`, `:::danger`, `:::note`) for a genuine caveat or destructive-action
  callout — not for routine information. `:::danger` only for something that can lock someone out
  or corrupt data if done wrong (e.g. editing `/etc/sudoers` directly); `:::warning` for a costly
  but recoverable mistake; `:::note` for a non-obvious clarification.
- Cross-link liberally to sibling pages in the same topic, to relevant pages in the other
  study-materials topics, and — wherever the content has a real-world counterpart in this org's
  actual setup — into `/internal-operations/server-architecture` and
  `/internal-operations/git-workflow`. Read those two files if unfamiliar with their current
  content before citing specifics from them (container names, key names, branch model) — don't
  invent details, and don't assume last session's facts still hold if the files may have changed.

## 5. Translate to SK

Full parallel content, not a thin stub — same structure, same examples (commands/code stay in
English/as-is, prose translated), same diagrams translated (mermaid labels too). Match the
existing SK style already in this repo's other study-materials topics (informal "ty" register,
technical terms kept in English where that's already the established convention — check a couple
of existing SK pages for tone before starting if unsure).

## 6. Verify

Run `npm run build` — it builds and link-checks both locales in one pass, and is the only reliable
way to catch a broken cross-link, a bad anchor, or a sidebar translation-key collision. Fix and
re-run until clean before calling it done. Never commit unless the user explicitly asks.
