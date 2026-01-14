# Botsmann: Three-Tier AI Node Ecosystem

**Created**: 2026-01-13
**Vision**: Private AI nodes that connect individuals, professionals, and their relationships.

---

## The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BOTSMANN ECOSYSTEM                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   TIER 1: INDIVIDUALS              TIER 2: PROFESSIONALS                │
│   ┌─────────────────┐              ┌─────────────────┐                  │
│   │  Personal Node  │              │  Business Node  │                  │
│   │  ─────────────  │              │  ─────────────  │                  │
│   │  • Medical      │              │  • Law Firm     │                  │
│   │  • Financial    │◄────────────►│  • Medical      │                  │
│   │  • Legal        │   TIER 3:    │    Practice     │                  │
│   │  • Learning     │  CONNECTION  │  • Advisory     │                  │
│   │  • Creative     │              │  • Consulting   │                  │
│   └─────────────────┘              └─────────────────┘                  │
│          │                                  │                            │
│          │         ┌──────────────┐         │                            │
│          └────────►│   BOTSMANN   │◄────────┘                            │
│                    │   PLATFORM   │                                      │
│                    │  ───────────  │                                      │
│                    │  • Setup     │                                      │
│                    │  • Hosting   │                                      │
│                    │  • Connect   │                                      │
│                    │  • Certify   │                                      │
│                    └──────────────┘                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tier 1: Individual Nodes (Personal AI)

### Value Proposition

**"Your AI assistant, with YOUR data, under YOUR control."**

An individual can have a private AI that knows:
- Their complete medical history (lab results, prescriptions, symptoms)
- Their financial situation (accounts, investments, tax docs)
- Their legal matters (contracts, correspondence, case files)
- Their learning progress (notes, weaknesses, goals)
- Their creative work (portfolio, style guides, references)

### Why People Want This

| Pain Point | Solution |
|------------|----------|
| "ChatGPT doesn't know my context" | Your node has all your documents |
| "I don't want OpenAI reading my medical records" | Runs locally, data never leaves |
| "I can't afford a financial advisor" | AI + your data = smart assistant |
| "My doctor doesn't remember my history" | You control the complete picture |

### Packages

| Package | Price | What You Get | Target |
|---------|-------|--------------|--------|
| **DIY Free** | CHF 0 | Open-source code, community support | Tech-savvy privacy enthusiasts |
| **DIY Guided** | CHF 100 | Video course + forum access | Motivated self-starters |
| **Assisted Setup** | CHF 500-1000 | We guide you through setup on YOUR hardware | Privacy-focused, less technical |
| **Full Setup** | CHF 1500-3000 | We build and deliver a working system | Busy professionals |
| **Managed** | CHF 100-300/mo | We host and maintain for you | Convenience over privacy |

### Technical Options

```
LOCAL (Maximum Privacy)           CLOUD (Maximum Convenience)
─────────────────────────         ─────────────────────────────
• Runs on your computer           • Runs on our servers
• Ollama + free models            • OpenRouter + any model
• SQLite + LanceDB                • Supabase + pgvector
• Zero ongoing cost               • Monthly subscription
• You handle updates              • We handle everything
• Works offline                   • Access from anywhere
```

---

## Tier 2: Professional Nodes (Business AI)

### Value Proposition

**"Give your entire team AI-powered expertise with your firm's knowledge."**

A law firm, medical practice, or advisory firm can have a shared AI that knows:
- All firm precedents and case history
- Internal procedures and best practices
- Client matter databases
- Compliance requirements
- Training materials

### Why Professionals Want This

| Pain Point | Solution |
|------------|----------|
| "Junior associates ask the same questions" | AI knows firm precedents |
| "Onboarding takes months" | New hires query AI from day one |
| "We pay for research that exists internally" | AI surfaces existing work |
| "Compliance requirements are complex" | AI knows the rules |
| "Knowledge leaves when partners retire" | AI preserves institutional knowledge |

### Packages

| Package | Price | What You Get | Target |
|---------|-------|--------------|--------|
| **Small Firm** | CHF 5-10K setup + CHF 500/mo | Up to 10 users, cloud or on-prem | Boutique practices |
| **Medium Firm** | CHF 15-30K setup + CHF 1500/mo | 10-50 users, custom integrations | Growing firms |
| **Enterprise** | Custom | 50+ users, SSO, compliance, SLA | Large organizations |

### Verticals

| Industry | Primary Use Cases | Special Requirements |
|----------|-------------------|---------------------|
| **Legal** | Case research, document drafting, precedent search | Confidentiality, audit trails |
| **Medical** | Diagnosis support, treatment protocols, patient history | HIPAA, clinical accuracy |
| **Financial** | Portfolio analysis, compliance, client reporting | Regulation, data security |
| **Consulting** | Methodology, past projects, expertise mapping | IP protection |

---

## Tier 3: Client-Professional Connection

### The Innovation

**"When a client visits their professional, their AI nodes can temporarily connect."**

This solves a fundamental problem: professionals need context, but clients don't want to give up their data.

### How It Works

```
BEFORE CONNECTION                    DURING CONNECTION
─────────────────                    ──────────────────

Client Node         Prof Node        Client Node ←──→ Prof Node
[Medical Hist]      [Practice KB]    [Temp Access Granted]
[Lab Results]       [Protocols]
[Prescriptions]     [Cases]          Professional AI can query:
                                     "What medications is this
     NO ACCESS                        patient currently on?"

                                     Client node responds with
                                     ONLY the relevant data.

AFTER SESSION
──────────────
Connection revoked automatically.
Professional node has NO retained client data.
Audit trail on both sides.
```

### Value Delivered

| Stakeholder | Value | Current Alternative |
|-------------|-------|---------------------|
| **Client** | Better service, keeps data ownership | Fill out same forms every visit |
| **Professional** | Complete context from minute one | Ask 100 questions, hope for honesty |
| **Practice** | Streamlined onboarding, fewer errors | Manual intake, incomplete info |

### Use Cases

**Medical:**
- Patient visits new specialist
- Grants temporary access to relevant medical history
- Doctor sees complete picture, makes better diagnosis
- Access revoked after appointment

**Legal:**
- Client needs contract review
- Grants access to relevant prior contracts and correspondence
- Lawyer has full context immediately
- Access limited to matter scope

**Financial:**
- Client meets wealth advisor
- Grants access to complete financial picture
- Advisor can give informed recommendations
- Client maintains control

### Revenue Model

| Feature | Price | Value |
|---------|-------|-------|
| **Basic Connections** | Free | Simple, one-time access grants |
| **Premium Connections** | CHF 20/mo (client) | Persistent connections, multi-professional |
| **Practice Integration** | CHF 200/mo (per practice) | Streamlined workflow, bulk connections |
| **Enterprise API** | Custom | Hospital/firm integration |

---

## Botsmann's Role & Revenue

### What Botsmann Provides

1. **Software** - The node software (open-source core, premium features)
2. **Setup Services** - Consulting to get nodes running
3. **Hosting** - Managed cloud option for convenience
4. **Connection Protocol** - The standard for node-to-node communication
5. **Certification** - "Botsmann Certified" for professionals
6. **Marketplace** - Knowledge base templates and add-ons

### Revenue Streams

```
                          NOW              YEAR 1           YEAR 3
                      ─────────────    ─────────────    ─────────────
Consulting/Setup       PRIMARY          40%              20%
Individual Nodes       Building         30%              25%
Professional Nodes     Future           20%              30%
Connection Fees        Future           5%               15%
Marketplace           Future           5%               10%
                      ─────────────    ─────────────    ─────────────
Total                  Services         CHF 300-500K     CHF 2-5M
```

### Competitive Moats

| Moat | How It Works |
|------|--------------|
| **Switching Costs** | Knowledge bases are huge investments |
| **Network Effects** | More nodes = more valuable connections |
| **Trust Brand** | "The private AI company" |
| **Protocol Standard** | Botsmann connection becomes the standard |
| **Swiss Credibility** | Privacy/banking reputation |

---

## Go-To-Market Phases

### Phase 1: Bootstrap (Now - 6 months)
**Strategy**: Consulting-first, build reference customers

- Offer setup services to early adopters
- Build 10-20 reference customers
- Document everything as case studies
- Revenue target: CHF 50-100K
- Build founding team

**Focus**: Individual nodes for privacy-conscious professionals

### Phase 2: Product (6-18 months)
**Strategy**: Package consulting into products

- Release desktop app for individual nodes
- Open-source core to build community
- Launch DIY and managed tiers
- Revenue target: CHF 200-500K
- 100+ paying users

**Focus**: Establish individual node product-market fit

### Phase 3: Network (18-36 months)
**Strategy**: Launch professional nodes and connections

- Professional node product
- Connection protocol v1
- First vertical deep integration (legal or medical)
- Revenue target: CHF 1-2M
- First enterprise deals

**Focus**: Prove connection value in one vertical

### Phase 4: Platform (3-5 years)
**Strategy**: Network effects and platform economics

- Marketplace for knowledge bases
- Certification program
- API ecosystem
- Revenue target: CHF 10M+
- International expansion

**Focus**: Become the standard for private AI connections

---

## The Billion Dollar Path

### Why This Could Be Huge

1. **Market Size**: Every professional practice needs this (millions)
2. **Network Effects**: Each new node makes others more valuable
3. **Regulatory Tailwinds**: Privacy laws favor this approach
4. **Recurring Revenue**: Subscriptions + transaction fees
5. **Defensibility**: Data gravity + switching costs + network effects

### Acquisition Interest

| Acquirer Type | Why They'd Want It |
|---------------|-------------------|
| **Microsoft** | Enterprise AI + privacy narrative |
| **Apple** | Privacy-first, device ecosystem |
| **Salesforce** | Professional services data |
| **Epic/Cerner** | Healthcare vertical |
| **Thomson Reuters** | Legal vertical |

### Exit Scenarios

- **Acquisition**: $500M-1B if protocol becomes standard
- **IPO**: If network effects kick in at scale
- **Profitable Business**: Even without exit, strong recurring revenue

---

## Immediate Next Steps

### This Week
1. Strip fake code from current site
2. Build ONE working demo (personal medical AI)
3. Rewrite homepage with honest positioning
4. Set up working contact form (Supabase)

### This Month
1. Create case study from first demo
2. Reach out to 10 potential consulting clients
3. Write 3 technical blog posts
4. Design individual node MVP

### This Quarter
1. Close 5 consulting engagements
2. Build individual node desktop app prototype
3. Define connection protocol specification
4. Recruit technical co-founder

---

## Summary

**Botsmann builds private AI nodes for individuals and professionals, then connects them.**

- **Individuals** get AI assistants with their private data
- **Professionals** get AI-powered teams with institutional knowledge
- **Connections** let clients share context without giving up control
- **Botsmann** provides software, services, and the connection standard

This is how we become the Stripe of AI knowledge sharing.
