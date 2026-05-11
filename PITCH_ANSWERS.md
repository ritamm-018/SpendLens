# Pitch Answers — SpendLens

## In one sentence: who is this tool for, and why would they share it?

Engineering leads at Series A startups who need to prove to their finance team they're not wasting money on AI tools — they share it because finding $2,400 in waste makes them look competent, not cheap.

---

## The single thing you're most proud of in this build

The audit engine uses deterministic rules instead of AI, which sounds backwards for an "AI spend" tool but it's the only way to make recommendations a finance person will actually trust. I spent two days researching real pricing across 9 tools and writing 11 hardcoded rules that catch the obvious stuff everyone misses — excess seats, wrong plans, overlapping tools. The breakthrough was realizing that AI would hallucinate savings or make inconsistent recommendations, but a rule that says "you have 12 Cursor seats for 8 developers" is just... true. It's boring engineering but it's the difference between a toy and something a VP Eng would actually send to their CFO. When I tested it with real founders, they kept saying "oh shit, you're right" instead of "I don't trust this" — that's when I knew the deterministic approach was correct.

---

## The single thing you'd fix first if you had another 48 hours

The benchmark data is completely made up right now — I generated 1,247 sample data points to make the percentile rankings look real, but they're not based on actual user data. This breaks the moment you have 100+ real audits because the benchmarks won't match reality. I'd spend the time building a proper aggregation pipeline that anonymizes real audit data and feeds it back into the benchmark engine, so "you're in the 73rd percentile" actually means something instead of being statistical theater. The infrastructure is already there (I have the Supabase schema ready), I just ran out of time to wire it up. Without real benchmarks, the intelligence layer is impressive-looking but ultimately hollow, and that's the kind of thing that'll bite you when a user tweets "these numbers seem fake."

