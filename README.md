# JOLCO Equity IRR Calculator v3

> **Japanese Operating Lease with Call Option** — Equity Return Modelling Tool

A browser-based financial calculator that models the full economics of a JOLCO transaction from the perspective of the Japanese BB Owner / TK (Tokumei Kumiai) equity investors. Built as a single-file React app deployable on GitHub Pages with zero backend.

**Live:** https://sriniwas512.github.io/JOLCO-Calculator-V3/

---

## What is a JOLCO?

A **Japanese Operating Lease with Call Option (JOLCO)** is a Japanese tax-driven vessel financing structure in which:

1. A Japanese Special Purpose Company (**SPC**) purchases a vessel
2. The SPC is financed by two tranches:
   - **~70% Bank Debt** — JPY-denominated loan from a Japanese bank at low JPY rates (TONA/TIBOR + spread), typically swapped into USD
   - **~30% TK Equity** — Tokumei Kumiai (silent partnership) equity from Japanese individual or corporate investors
3. The SPC bareboat charters (**BBC**) the vessel to an international shipowner/charterer
4. The charterer pays **hire** in USD, structured as:
   - **Fixed hire** — covers principal amortisation (VP ÷ amortisation period)
   - **Variable hire** — covers interest (allInRate × outstanding balance)
5. At end of the lease, the charterer exercises a **Purchase Option (PO)** to buy the vessel
6. Japanese tax law allows the SPC's depreciation losses to flow through the TK to investors, shielding their other taxable income — this is the **tax shield**

The equity investor's return has **three distinct streams**:
- **① Charter Hire Spread** — the difference between what the charterer pays on the equity portion and what the bank charges
- **② Tax Shield** — tax savings from Japanese accelerated depreciation (MOF 別表第一)
- **③ Residual / PO Play** — net proceeds from PO exercise after repaying remaining debt and capital gains tax

---

## Calculator Features

| Feature | Detail |
|---|---|
| **Vessel Database** | 15 vessel types with MOF statutory useful lives (JP & Foreign flag) |
| **Dual Interest Rates** | Separate JPY bank rate (with USD/JPY swap cost) and USD equity/BBC hire rate |
| **Full Depreciation Model** | 200% Declining Balance → Straight-Line switchover per MOF tables |
| **Special Depreciation** | Year-1 bonus depreciation for MLIT-qualifying advanced vessels (18–32%) |
| **Two Commissions** | Sale commission (upfront, % of VP) + BBC commission (annual, % of hire) |
| **Purchase Option Schedule** | Editable per-year PO prices with auto-decline or manual override |
| **IRR Solver** | Newton-Raphson with bisection fallback |
| **vs Treasury** | Side-by-side spread comparison against US Treasury yield |
| **Tokyo Night UI** | Dark-themed, fully responsive calculator with live updates |

---

## Tabs

### Tab 1 — Deal Inputs

Everything configurable about the deal. Shows live output at the top at all times.

**Top Summary Strip** (always visible):
- ① Charter Hire Spread total, ② Tax Shield total, ③ Residual total
- Equity Deployed, Total Profit, Equity IRR, Blended IRR, vs UST spread

**Vessel & Structure Panel:**

| Input | Default | Description |
|---|---|---|
| Vessel Type | Bulk ≥2,000 GT | Drives MOF statutory useful life and depreciation |
| Flag State | Foreign (PAN/LBR/MHL) | Japanese flag = longer life + higher special depr |
| Vessel Price | $29.4M | Total acquisition cost |
| Debt / Equity Split | 70% debt | Bank tranche as % of VP; equity = VP − debt |
| Sale Commission | 2.0% | Purchase brokerage on VP; paid at Year 0 from equity |
| BBC Commission | 1.25% | Annual bareboat charter brokerage on gross hire |

**Charter & Interest Panel — two sub-sections:**

*Bank Loan (JPY):*

| Input | Default | Description |
|---|---|---|
| JPY Base Rate (TONA/TIBOR) | 0.10% | Japanese policy rate |
| Bank Spread | 50 bps | Credit spread charged by lending bank |
| USD/JPY Swap Cost | 45 bps | Cross-currency basis swap cost to convert JPY loan to USD |
| → Effective USD cost | *live* | JPY base + bank spread + swap = e.g. 1.05% |

*BBC Hire Rate (USD):*

| Input | Default | Description |
|---|---|---|
| SOFR Rate | 4.3% | USD reference rate |
| Equity Spread | 280 bps | Spread reflecting charterer credit + vessel risk |

*Monthly Hire Display (live, Yr1):*
- **Fixed Hire** — principal component; rate-insensitive
- **Variable — Bank (JPY→USD)** — bank interest on debt balance
- **Variable — Equity (USD)** — equity return on equity balance
- **Total Monthly Hire** — all three combined

**Purchase Options & Tax Panel:**

| Input | Default | Description |
|---|---|---|
| First PO Year | 5 | Earliest year charterer can exercise |
| Last Year (Obligatory) | 10 | Final year; charterer must buy |
| Exercise at Year | 10 | Modelled exit year (drives IRR horizon) |
| PO prices (per year) | Auto | VP − (VP/amortYrs × yr); fully editable per year |
| Effective Tax Rate | 30.62% | Japanese corp tax + local + defense surtax |
| US Treasury Yield | 4.25% | Risk-free benchmark for spread comparison |
| Special Depreciation (Yr1) | 0% | MLIT advanced vessels: 18–30% foreign, 20–32% JP |

---

### Tab 2 — Depreciation Scale

- Full bar chart of annual depreciation over statutory useful life
- Ordinary (DB/SL) vs Special year-1 component shown in two colours
- Years beyond exercise date grayed out
- Summary: Yr1%, 3yr cumulative, total tax shield (within lease), DB→SL switchover year
- MOF Rate Index table: all 15 vessel types, JP and foreign lives, click to switch

---

### Tab 3 — Equity Cashflows

**Waterfall Visualization:**

```
− Equity Invested (n% of VP)
− Sale Commission (n%)
────────────────────────────
+ Principal Returned via Hire
+ ① Interest on Equity Balance (gross)
  − BBC Commission (n% of hire)
+ ② Tax Shield (Net)
+ ③ Residual from PO Exercise
────────────────────────────
= Total Returned
= NET PROFIT → IRR
```

**Year-by-Year Table:**
- Columns: Yr | ① Hire Spread (net) | ② Tax Shield | ③ Residual | Total CF | Cumulative
- Click any year to expand full hire breakdown:
  - Gross hire received (fixed + bank variable + equity variable)
  - BBC commission deducted
  - Bank allocation (principal + interest at bankAllInRate)
  - Equity allocation (principal return + interest income − commission)

**IRR summary:** Equity IRR (hire + residual only) | Blended IRR (all three streams) | MoIC

---

### Tab 4 — vs Treasury

Side-by-side comparison of JOLCO blended IRR against US Treasury yield (same capital, same horizon):
- Spread in basis points
- Qualitative commentary: strong / moderate / thin / negligible / below risk-free

---

## Financial Model

### Dual-Rate Structure

The model correctly separates the two financing relationships:

```
bankAllInRate    = (jpyBaseRate% + bankSpreadBps%) / 100  +  swapCostBps / 10000
                 = e.g. (0.10 + 0.50)% + 0.45%  =  1.05%

equityAllInRate  = (sofrRate + spreadBps / 100) / 100
                 = e.g. (4.3 + 2.8)%            =  7.10%
```

The ~606 bps differential between what the SPC pays the bank and what it charges the charterer for the equity portion is the core source of Stream ① profit.

### Annual Cashflow Loop

For each year 1 → exerciseYear:

```
fixedHire         = VP / amortYrs                              (principal amortisation)
variableHireBank  = outstandingDebt   × bankAllInRate          (JPY interest, hedged)
variableHireEquity= outstandingEquity × equityAllInRate        (equity interest component)
totalHire         = fixedHire + variableHireBank + variableHireEquity
bbcCommCost       = totalHire × bbcCommission%                 (annual brokerage)
netHire           = totalHire − bbcCommCost

bankPrincipal     = annualPrincipal × debtPct%
bankInterest      = outstandingDebt × bankAllInRate
totalToBank       = bankPrincipal + bankInterest

equityPrincipalReturn = annualPrincipal × (1 − debtPct%)
equityInterestIncome  = outstandingEquity × equityAllInRate    ← Stream ①

spcTaxablePL   = netHire − depreciation − bankInterest
taxShield      = −spcTaxablePL × taxRate%                      ← Stream ②

[exit year only]
residualToEquity = (poPriceMil − remainingDebt) − capGainsTax  ← Stream ③

netCF = equityPrincipalReturn + equityInterestIncome
      − bbcCommCost + taxShield + residualToEquity
```

### Depreciation (MOF 200DB → SL)

Per Japanese Ministry of Finance rules (耐用年数省令 別表第一):

```
dbRate = 2 / usefulLife          (200% declining balance)
db     = bookValue × dbRate
sl     = bookValue / remainingYears

method = sl ≥ db ? "SL" : "DB"   (switch to SL permanently when SL first exceeds DB)

year1  = ordinary + special       (special = VP × specialDeprPct%, year 1 only)
```

### IRR Algorithm

Newton-Raphson (1,000 iterations, 1e-8 tolerance) with automatic fallback to bisection (2,000 iterations, bracket [−0.9, 5.0]).

Returns `null` if no valid IRR found (e.g., all-negative cashflows).

### Purchase Option Default Decline

```
annualDecline = vesselPrice / amortYrs     (same as fixed hire)
poPriceYrN    = vesselPrice − annualDecline × N
```

This tracks the remaining financing balance. Any year can be manually overridden.

---

## Key Assumptions & Limitations

| Assumption | Detail |
|---|---|
| Annual periods | No intra-year granularity, no day-count conventions (Actual/360 etc.) |
| Treasury comparison | Simple annual compounding; not actual bond math |
| No salvage value | Depreciation runs to zero; no residual book value assumption |
| No negative equity at exit | Assumes PO price ≥ remaining bank debt |
| No rehedging model | Swap cost is a fixed annual input; no roll cost or basis risk |
| `leaseTerm` input | Currently stored as state but not yet connected to cashflow model |
| Tax shield timing | Shield/liability assumed realised in same year as P&L (no tax deferral) |
| Static tax rate | No progressive rates, no local tax differentiation by municipality |
| Special depr eligibility | No modelling of MLIT qualifying criteria; user-set |
| One charterer | Single credit counterparty; no re-letting or off-hire scenarios |

---

## Vessel Types & MOF Lives

| Vessel | JP Life | Foreign Life | MOF Category |
|---|---|---|---|
| Bulk Carrier ≥2,000 GT | 15 yr | 12 yr | その他 |
| Bulk Carrier <2,000 GT | 14 yr | 12 yr | その他 |
| Oil Tanker ≥2,000 GT | 13 yr | 12 yr | 油そう船 |
| Oil Tanker <2,000 GT | 11 yr | 12 yr | 油そう船 |
| Chemical Tanker | 10 yr | 12 yr | 薬品そう船 |
| LPG Carrier | 13 yr | 12 yr | 油そう船 |
| LNG Carrier ≥2,000 GT | 15 yr | 12 yr | その他 |
| Container ≥2,000 GT | 15 yr | 12 yr | その他 |
| Container <2,000 GT | 14 yr | 12 yr | その他 |
| Car Carrier / PCC | 15 yr | 12 yr | その他 |
| General Cargo ≥2,000 GT | 15 yr | 12 yr | その他 |
| Car Ferry | 11 yr | 12 yr | カーフェリー |
| Tugboat | 12 yr | 10 yr | ひき船 |
| Fishing Vessel ≥500 GT | 12 yr | 8 yr | 漁船 |
| Fishing Vessel <500 GT | 9 yr | 8 yr | 漁船 |

Special depreciation for MLIT-qualifying advanced vessels:
- **Japanese flag**: 20–32% Year-1 bonus
- **Foreign flag (PAN/LBR/MHL)**: 18–30% Year-1 bonus

---

## Technical Architecture

| Aspect | Detail |
|---|---|
| Framework | React 18 (CDN) |
| Build | None — Babel Standalone transpiles JSX in-browser |
| Deployment | GitHub Pages (single `index.html`) |
| State | `useState` hooks only, no Redux |
| Computation | `useMemo` — recalculates full model on any input change |
| Styling | Inline styles only — no CSS framework |
| Dependencies | React 18, ReactDOM 18, Babel Standalone (all CDN) |
| Theme | Tokyo Night (`#1a1b26` bg, `#7aa2f7` blue, `#9ece6a` green, `#e0af68` orange, `#bb9af7` purple) |

### File Structure

```
JOLCO-Calculator-V3/
├── index.html          ← Full app (HTML + JSX inlined, auto-generated)
├── jolco-v3.jsx        ← Source JSX (edit this, regenerate index.html)
├── jolco-logo.png      ← Tokyo Night themed JOLCO logo
└── README.md           ← This file
```

### Regenerating index.html

After editing `jolco-v3.jsx`, run:

```python
python3 -c "
with open('jolco-v3.jsx') as f: jsx = f.read()
jsx = jsx.replace('import React, { useState, useMemo } from \"react\";\n', '')
jsx = jsx.replace('export default function JOLCOv3()', 'function JOLCOv3()')
# ... wrap in HTML boilerplate
"
```

Or simply use the project's existing build pattern.

---

## Return Stream Economics — Deep Dive

### Stream ① — Why it Exists

The SPC borrows JPY at ~1% (bankAllInRate after swap) but the BBC hire formula charges the charterer SOFR + 280bps (~7.1%) on the equity portion of the outstanding balance. That ~610bps differential on the equity balance ($8.82M at 70/30 split on $29.4M) generates roughly **$626k/yr** in Year 1, declining as the balance amortises.

### Stream ② — The Tax Shield Mechanics

In Years 1–3, accelerated DB depreciation ($3.9M Yr1, $3.4M Yr2...) creates large losses in the SPC. These flow via the TK to the Japanese investor's personal/corporate tax return, offsetting other income at 30.62%. In later years, as depreciation falls below hire income, the SPC posts profits and the investor pays additional tax. The **net tax shield** is typically positive and peaks in Year 1.

With special depreciation (e.g. 20%), Yr1 depreciation = ordinary + $5.88M bonus → much larger early-year shield, often making the blended IRR meaningfully higher.

### Stream ③ — The PO Economics

At Year 10 (default), the charterer exercises the PO at ~$9.8M (auto-decline). Remaining bank debt is ~$9.24M. Gross residual = ~$560k. Book value after 10yr DB→SL depreciation is near zero, so the entire PO price may be subject to capital gains tax at 30.62%, potentially making Stream ③ negative or marginal. Adjusting the PO price upward significantly improves IRR.

---

## Glossary

| Term | Meaning |
|---|---|
| **JOLCO** | Japanese Operating Lease with Call Option |
| **TK** | Tokumei Kumiai (匿名組合) — Japanese silent partnership |
| **SPC** | Special Purpose Company — the vessel-owning entity |
| **BBC** | Bareboat Charter — charterer takes full operational control |
| **MOF** | Ministry of Finance (Japan) — sets depreciation rules |
| **MLIT** | Ministry of Land, Infrastructure, Transport and Tourism — sets special depr eligibility |
| **TONA** | Tokyo Overnight Average Rate — JPY risk-free rate |
| **TIBOR** | Tokyo Interbank Offered Rate — JPY term rate |
| **SOFR** | Secured Overnight Financing Rate — USD risk-free rate |
| **PO** | Purchase Option — charterer's right (and eventual obligation) to buy |
| **DB** | Declining Balance depreciation method |
| **SL** | Straight-Line depreciation method |
| **IRR** | Internal Rate of Return |
| **MoIC** | Multiple on Invested Capital |
| **bps** | Basis Points (1 bps = 0.01%) |

---

*For questions, raise an issue on [GitHub](https://github.com/sriniwas512/JOLCO-Calculator-V3/issues).*
