# Customer Discovery Interviews — SpendLens

---

## Interview 1 — DM

**Role:** Engineering Lead, 18-person startup (fintech)

**Context:** Series A, building compliance automation. Team uses ChatGPT, Claude, Cursor, GitHub Copilot. Talked to him after he mentioned "our AI bill is getting weird" in a Slack group.

**Key quotes:**

"Honestly I don't even know what we're spending. Like, I know we have Cursor for the team, and I think half the engineers have their own ChatGPT Plus? Maybe? Some people expense it, some don't. It's... yeah it's a mess."

"The thing that actually bothers me isn't the cost, it's that I have no idea if we're duplicating stuff. Like are we paying for Copilot AND Cursor? I think so? But I'm not sure if that's dumb or if people actually use both."

"Wait, you're saying we could be spending like $200/month less? That's... I mean that's not nothing but also it's not gonna move the needle. But I guess if it's just sitting there..."

**What confused or surprised me:** He kept saying cost doesn't matter, but then would circle back to specific dollar amounts and get visibly annoyed. Like he'd say "we don't optimize for cost" but then immediately complain about "wasting money on seats nobody uses." The contradiction was constant.

**Tension or contradiction noticed:** Said "we move fast, we don't nickel and dime" but also mentioned they just went through a budget review where finance asked him to justify every tool. He's clearly feeling pressure but doesn't want to admit it matters.

**Impact on design:** This made me realize the "savings calculator" framing might be wrong. He doesn't want to feel cheap. Changed the messaging from "save money" to "eliminate waste" — same outcome, different psychology. Also made me think about adding a "what are we even paying for" view before showing savings, because discovery matters more than optimization for some people.

---

## Interview 2 — KL

**Role:** Solo founder / technical

**Context:** Pre-seed, building dev tools. Just him and one contractor. Uses Claude API heavily, ChatGPT Plus, and just started trying Cursor.

**Key quotes:**

"Dude I literally don't care about AI costs right now. Like, at all. I'm spending $80/month maybe? My AWS bill is $300. My problem is I don't know if I'm using the right tools, not if I'm overspending."

"The thing I actually want to know is like... should I be using Claude API or ChatGPT API? Should I switch from Plus to API? I have no idea. I just picked whatever seemed good at the time."

"Wait, there are startup credits? For OpenAI? How do I... okay yeah I should probably look into that. That's actually useful."

**What confused or surprised me:** He said cost doesn't matter THREE times but then got really interested when I mentioned startup credits. Also he's clearly spending more than he thinks — he forgot about Cursor ($20), GitHub Copilot ($10), and his contractor's ChatGPT Plus ($20) that he reimburses. So actually $130/month not $80.

**Tension or contradiction noticed:** "I don't care about costs" but he's bootstrapped and clearly watching every dollar. He just doesn't want to FEEL like he's optimizing for cost because that's not founder-y or whatever. But he lit up at "free credits."

**Impact on design:** This interview made me almost kill the whole project. If solo founders don't care and small teams don't care, who's this for? But then I realized — he DOES care about "am I using the right setup" even if he doesn't care about "am I overspending." That's a different problem. Decided to deprioritize the savings calculator for solo users and focus on "stack health check" framing instead. Also realized startup credits might be the actual hook, not savings.

---

## Interview 3 — RP

**Role:** VP Engineering, 60-person company (B2B SaaS)

**Context:** Series B, profitable. They have a formal AI tools policy. She manages budget for eng tools.

**Key quotes:**

"We spend about $4K/month on AI tools. It's in the budget, it's approved, it's fine. I'm not really looking to optimize it."

"The problem isn't the cost, it's the chaos. People keep asking for new tools. 'Can we try Windsurf?' 'Can we get Claude Pro?' 'What about Perplexity?' I don't even know what half these things do. I just want to know what we should standardize on."

"If you told me we could cut our AI spend in half I'd be like... okay cool, but that's $2K/month. We just hired someone at $180K. The AI tools are a rounding error."

**What confused or surprised me:** She's the first person who actually has budget authority and she genuinely doesn't care about savings. Like, at all. She cares about standardization, governance, and "not having 12 different tools." This is completely different from what I expected. I thought budget owners would care most about cost.

**Tension or contradiction noticed:** She says cost doesn't matter but she still has a budget line item and tracks it monthly. Also she mentioned "we had to cut some tools last quarter" when they missed revenue targets. So cost DOES matter, just not right now while they're growing.

**Impact on design:** This interview made me realize I'm building for the wrong persona. I was building for the budget owner, but she doesn't care. The person who cares is the eng lead who's getting pressure from finance but doesn't have visibility. Or the founder who's about to hit a budget crunch. Decided to add a "benchmark against similar companies" feature because she kept asking "is $4K normal? Are we overspending compared to other Series B companies?" That's the question she actually has.

---

## Interview 4 — TC

**Role:** CTO, 12-person startup (AI/ML product company)

**Context:** Seed stage, building AI-powered analytics. Ironically, they sell AI but are also heavy AI tool users.

**Key quotes:**

"Our AI spend is like... $800/month on tools, maybe $2K/month on API costs for our product. The API costs I track obsessively because that's COGS. The tools? I literally have no idea what we're paying for."

"Here's the thing — we're an AI company. We need to be using the best tools. If that means paying for Cursor AND Copilot AND Claude Pro, fine. I don't want to be the CTO who's like 'sorry team, we're too cheap for good tools.'"

"But also... yeah, we probably have like 5 unused seats on our GitHub Copilot plan because people switched to Cursor. That's dumb. I should fix that. I just haven't."

**What confused or surprised me:** He's super analytical about product API costs (tracks per-user, per-query, has dashboards) but completely hands-off about internal tool costs. It's the same category of spend but totally different mental models. He called product API costs "COGS" and tool costs "overhead" and clearly thinks about them differently.

**Tension or contradiction noticed:** "We need the best tools" but also "we probably have unused seats that's dumb." He wants to be generous but also hates waste. Also interesting: he said "I don't want to nickel and dime" but then spent 10 minutes explaining their API cost optimization strategy.

**Impact on design:** Made me realize there are two types of AI spend and people think about them completely differently. Product/COGS spend (APIs for your product) vs. internal/overhead spend (tools for your team). I was conflating them. Decided to focus ONLY on internal tools, not API costs for products. That's a different product. Also his comment about "unused seats" made me prioritize the seat optimization detection — that's the thing that feels dumb enough that people will actually fix it.

---

## Interview 5 — AS

**Role:** Finance/Ops person, 25-person startup (edtech)

**Context:** Series A, she manages all SaaS spend. Founder asked her to "figure out what we're spending on AI stuff."

**Key quotes:**

"I have a spreadsheet with every subscription but honestly I don't know what half of these are. Like what's the difference between ChatGPT Team and ChatGPT Plus? Why do we have both?"

"The engineers just expense stuff and I approve it. I don't know if it's redundant or not. I'm not technical. I just see '$20/month for Cursor' and I'm like... okay?"

"The thing that would actually help me is just like... a list of what we're paying for and whether it's redundant. I don't even care about the savings number. I just want to know if we're being dumb."

**What confused or surprised me:** She's the person who actually sees all the spend but has the least context to evaluate it. She can't tell if something is redundant or necessary. She's approving expenses blind. This is a huge gap I didn't expect.

**Tension or contradiction noticed:** She's supposed to control costs but has no ability to evaluate if costs are justified. She said "I just approve whatever engineers ask for" but also "I need to cut $5K/month from our SaaS budget." Those two things don't work together.

**Impact on design:** This interview made me realize there's a third persona I wasn't thinking about: the non-technical person who manages spend. She doesn't care about "efficiency scores" or "benchmarks" — she just wants a simple list of "you're paying for X and Y which do the same thing." Decided to add a "plain English" export mode that explains what each tool does and why it might be redundant, written for non-technical people. Also made me think about adding a "who's using what" view because she kept asking "is anyone even using this?"

---

## Meta Notes (for myself)

- Interviews 1, 4, 5 care about waste/redundancy more than absolute cost
- Interview 2 doesn't care about cost at all (but does care about credits)
- Interview 3 cares about standardization, not optimization
- Nobody asked for an "efficiency score" — I made that up
- The "benchmark" thing came up twice (interviews 3, 4) but in different contexts
- Startup credits are more interesting than I thought (interviews 2, 4 mentioned)
- The seat optimization thing resonated with everyone who has a team
- Non-technical finance people are a persona I completely missed

**Biggest takeaway:** I built a cost savings calculator but people don't actually want to "save money" — they want to "not be dumb" or "not waste money" or "know what they're paying for." The psychology is different. Need to reframe everything.

**What I'm NOT building (based on these):**
- API cost optimization (interview 4 made it clear that's different)
- Tool recommendation engine (interview 2 wanted this but it's too hard)
- Procurement workflow (interview 3 mentioned but that's a different product)
- Real-time spend tracking (interview 5 wanted this but that requires integrations)

**What I AM building:**
- Redundancy detection (everyone cared about this)
- Seat optimization (clear, obvious, feels dumb not to fix)
- Startup credits finder (easy win, people care)
- Benchmark comparison (for the people who care about "is this normal")
- Plain English explanations (for non-technical stakeholders)
