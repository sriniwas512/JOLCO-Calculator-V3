import React, { useState, useMemo } from "react";

/*
  JOLCO EQUITY IRR CALCULATOR v3
  ==============================
  Models the actual economics of a Japanese JOLCO from the perspective of
  the Japanese BB Owner / TK equity investors.

  REAL JOLCO MECHANICS (based on actual term sheet):
  ──────────────────────────────────────────────────
  1. Japanese Owner buys vessel via SPC (Registered Owner in MHL/LBR/PAN)
  2. Financing: ~70% bank debt + ~30% TK equity from Japanese investors
  3. Vessel bareboat chartered back to original seller/operator
  4. BB Hire = Fixed (principal repayment) + Variable (SOFR + spread on balance)
  5. Purchase options step down over time; final year = obligation
  6. Depreciation on FULL vessel cost flows through TK to equity investors
     → Creates tax losses that offset investors' other business profits
  7. The "return" to equity = tax shield + residual (PO exercise - remaining debt - equity)

  LEGAL FRAMEWORK:
  - Corporation Tax Act Art. 31 (depreciation)
  - MOF Ordinance (耐用年数省令) Beppyō 1: vessel useful lives
  - Special Measures Taxation Act: special depreciation for advanced vessels
  - 200% Declining Balance method (post FY2012), switch to SL
  - LPG tankers use oil tanker useful life per NTA Circular 2-4-2
*/

function solveIRR(cf, guess = 0.1) {
  let r = guess;
  for (let i = 0; i < 1000; i++) {
    let npv = 0, d = 0;
    for (let t = 0; t < cf.length; t++) {
      npv += cf[t] / Math.pow(1 + r, t);
      if (t > 0) d -= t * cf[t] / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(npv) < 1e-8) return r;
    if (Math.abs(d) < 1e-14) break;
    const nr = r - npv / d;
    if (Math.abs(nr - r) < 1e-8) return nr;
    r = nr;
    if (r < -0.99 || r > 10) break;
  }
  let lo = -0.9, hi = 5;
  const f = (x) => cf.reduce((s, v, t) => s + v / Math.pow(1 + x, t), 0);
  if (f(lo) * f(hi) > 0) return null;
  for (let i = 0; i < 2000; i++) {
    const m = (lo + hi) / 2;
    if (Math.abs(f(m)) < 1e-8) return m;
    if (f(lo) * f(m) < 0) hi = m; else lo = m;
  }
  return (lo + hi) / 2;
}

// MOF Ordinance: Beppyō 1 (別表第一) — Vessel Useful Lives
// Source: 減価償却資産の耐用年数等に関する省令
// Two categories:
//   A) 船舶法 Art.4-19 適用 = Japanese-flag (registered under Ship Act)
//   B) その他のもの = Not under Ship Act (foreign-flag: Panama, Liberia, MHL etc.)
//      Foreign-flag steel ships: dredgers=7yr, power/fishing=8yr, tugs=10yr, OTHER=12yr
//      Foreign-flag has NO tanker/chemical sub-category — all non-special types = 12yr
const VESSEL_DB = [
  { id: "bulk_l", label: "Bulk Carrier ≥2,000 GT", jpLife: 15, forLife: 12, cat: "その他 (Other)" },
  { id: "bulk_s", label: "Bulk Carrier <2,000 GT", jpLife: 14, forLife: 12, cat: "その他 (Other)" },
  { id: "oil_l", label: "Oil Tanker ≥2,000 GT", jpLife: 13, forLife: 12, cat: "油そう船 (Tanker)" },
  { id: "oil_s", label: "Oil Tanker <2,000 GT", jpLife: 11, forLife: 12, cat: "油そう船 (Tanker)" },
  { id: "chem", label: "Chemical Tanker", jpLife: 10, forLife: 12, cat: "薬品そう船 (Chemical)" },
  { id: "lpg", label: "LPG Carrier", jpLife: 13, forLife: 12, cat: "油そう船* (per NTA 2-4-2)" },
  { id: "lng", label: "LNG Carrier ≥2,000 GT", jpLife: 15, forLife: 12, cat: "その他 (Other)" },
  { id: "cont_l", label: "Container ≥2,000 GT", jpLife: 15, forLife: 12, cat: "その他 (Other)" },
  { id: "cont_s", label: "Container <2,000 GT", jpLife: 14, forLife: 12, cat: "その他 (Other)" },
  { id: "car", label: "Car Carrier / PCC", jpLife: 15, forLife: 12, cat: "その他 (Other)" },
  { id: "gen_l", label: "General Cargo ≥2,000 GT", jpLife: 15, forLife: 12, cat: "その他 (Other)" },
  { id: "ferry", label: "Car Ferry", jpLife: 11, forLife: 12, cat: "カーフェリー" },
  { id: "tug", label: "Tugboat", jpLife: 12, forLife: 10, cat: "ひき船" },
  { id: "fish_l", label: "Fishing ≥500 GT", jpLife: 12, forLife: 8, cat: "漁船 (Fishing)" },
  { id: "fish_s", label: "Fishing <500 GT", jpLife: 9, forLife: 8, cat: "漁船 (Fishing)" },
];

const FLAG_OPTIONS = [
  { id: "jp", label: "Japanese Flag (日本籍船)", desc: "Ship Act Art. 4-19 (船舶法)", specialMin: 20, specialMax: 32 },
  { id: "foreign", label: "Foreign Flag (PAN/LBR/MHL etc.)", desc: "Not under Ship Act (船舶法適用外)", specialMin: 18, specialMax: 30 },
];

function computeDepr(cost, life, specialPct = 0) {
  const rate = 2 / life;
  const sched = [];
  let bv = cost;
  let switched = false;
  for (let yr = 1; yr <= life; yr++) {
    const rem = life - yr + 1;
    let special = yr === 1 ? cost * specialPct / 100 : 0;
    const db = bv * rate;
    const sl = bv / rem;
    if (!switched && sl >= db) switched = true;
    let ordinary = Math.min(switched ? sl : db, bv);
    let total = Math.min(ordinary + special, bv);
    special = total - ordinary;
    sched.push({ yr, method: switched ? "SL" : "DB", ordinary, special, total, bv: bv - total });
    bv = Math.max(0, bv - total);
  }
  return sched;
}

const $ = (n) => (n == null || isNaN(n)) ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const $d = (n, d = 2) => (n == null || isNaN(n)) ? "—" : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (n) => (n == null || isNaN(n)) ? "—" : (n * 100).toFixed(2) + "%";
const F = "'JetBrains Mono', monospace";

function Inp({ label, value, onChange, unit, help, min, max, step }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min} max={max} step={step || 1}
          style={{ width: "100%", padding: "7px 9px", borderRadius: 5, border: "1px solid #3b4261", background: "#1a1b26", color: "#c0caf5", fontSize: 13, fontFamily: F, outline: "none" }}
          onFocus={(e) => e.target.style.borderColor = "#7aa2f7"} onBlur={(e) => e.target.style.borderColor = "#3b4261"} />
        {unit && <span style={{ fontSize: 10, color: "#565f89", minWidth: 32 }}>{unit}</span>}
      </div>
      {help && <div style={{ fontSize: 9, color: "#565f89", marginTop: 2 }}>{help}</div>}
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step, unit, help }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <label style={{ fontSize: 10, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", fontFamily: F, textTransform: "uppercase" }}>{label}</label>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#bb9af7", fontFamily: F }}>{value}{unit}</span>
      </div>
      <input type="range" value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min} max={max} step={step || 1}
        style={{ width: "100%", height: 6, borderRadius: 3, appearance: "none", background: `linear-gradient(to right, #7aa2f7 ${((value - min) / (max - min)) * 100}%, #3b4261 ${((value - min) / (max - min)) * 100}%)`, cursor: "pointer", outline: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#565f89", marginTop: 2 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
      {help && <div style={{ fontSize: 9, color: "#565f89", marginTop: 2 }}>{help}</div>}
    </div>
  );
}

export default function JOLCOv3() {
  const [tab, setTab] = useState("deal");
  const [expandedYear, setExpandedYear] = useState(null); // for clickable hire detail
  // Deal
  const [vesselTypeId, setVesselTypeId] = useState("bulk_l");
  const [flagId, setFlagId] = useState("foreign");
  const [vesselPrice, setVesselPrice] = useState(29.4);
  const [debtPct, setDebtPct] = useState(70);
  const [amortYrs, setAmortYrs] = useState(15);
  const [leaseTerm, setLeaseTerm] = useState(10);
  const [sofrRate, setSofrRate] = useState(4.3);
  const [spreadBps, setSpreadBps] = useState(280);
  const [jpyBaseRate, setJpyBaseRate] = useState(0.50);   // TONA (BOJ rate ~0.50% as of mid-2024; raised from near-zero)
  const [bankSpreadBps, setBankSpreadBps] = useState(100); // bps over TONA (80–130 bps for JOLCO non-recourse, per market data)
  const [swapCostBps, setSwapCostBps] = useState(35);    // USD/JPY cross-currency basis (20–45 bps in 2024, narrowing trend)
  const [saleCommission, setSaleCommission] = useState(2.0);
  const [bbcCommission, setBbcCommission] = useState(1.25);
  // Purchase Option schedule
  // Default logic: PO price declines by ~(Vessel Price / Amort Period) per year
  // because the PO tracks the remaining financing balance
  const [poFirstYear, setPoFirstYear] = useState(5);
  const [poLastYear, setPoLastYear] = useState(10);
  const [poAnnualDecline, setPoAnnualDecline] = useState(null); // null = auto from vessel/amort
  const effectiveDecline = poAnnualDecline != null ? poAnnualDecline : vesselPrice / amortYrs;

  // Auto-generate schedule but allow per-year overrides
  const [poOverrides, setPoOverrides] = useState({}); // { [yr]: price } for manual edits
  const poSchedule = useMemo(() => {
    const sched = [];
    // PO at first option year ≈ vessel price minus principal repaid up to that point
    const annualRepay = vesselPrice / amortYrs;
    for (let yr = poFirstYear; yr <= poLastYear; yr++) {
      const defaultPrice = Math.max(0, vesselPrice - annualRepay * yr);
      const price = poOverrides[yr] != null ? poOverrides[yr] : Math.round(defaultPrice * 10) / 10;
      sched.push({ yr, price, obligatory: yr === poLastYear, isOverridden: poOverrides[yr] != null });
    }
    return sched;
  }, [vesselPrice, amortYrs, poFirstYear, poLastYear, poOverrides]);

  const [exerciseYear, setExerciseYear] = useState(10);
  // Ensure exerciseYear is within PO range
  const effectiveExerciseYear = Math.max(poFirstYear, Math.min(poLastYear, exerciseYear));
  // Tax
  const [taxRate, setTaxRate] = useState(30.62);
  const [foreignInterestTaxPct, setForeignInterestTaxPct] = useState(27); // JP SME corporate rate on foreign interest — US levies 0% (Portfolio Interest Exemption IRC §871h); Japan taxes at full corp rate (~27% SME, 30.62% large corp)
  const [specialDeprPct, setSpecialDeprPct] = useState(0);
  const [treasuryYield, setTreasuryYield] = useState(4.25);

  const vType = VESSEL_DB.find(v => v.id === vesselTypeId);
  const flagInfo = FLAG_OPTIONS.find(f => f.id === flagId);
  const isJPFlag = flagId === "jp";
  const usefulLife = isJPFlag ? vType.jpLife : vType.forLife;
  const dbRate = 2 / usefulLife;

  const R = useMemo(() => {
    const VP = vesselPrice * 1e6;
    const debt = VP * debtPct / 100;
    const equity = VP - debt;
    const annualPrincipal = VP / amortYrs; // fixed hire covers full vessel amortization
    const monthlyFixed = annualPrincipal / 12;
    // Bank loan: JPY base rate + bank spread + cross-currency swap cost (all converted to USD equivalent)
    const bankAllInRate = (jpyBaseRate + bankSpreadBps / 100) / 100 + swapCostBps / 10000;
    // Equity / charterer hire rate: USD SOFR + spread
    const equityAllInRate = (sofrRate + spreadBps / 100) / 100;

    const poEntry = poSchedule.find(p => p.yr === effectiveExerciseYear);
    const poPriceMil = poEntry ? poEntry.price * 1e6 : 0;
    const depr = computeDepr(VP, usefulLife, specialDeprPct);

    /*
      CORRECT MODEL — trace every dollar
      ────────────────────────────────────
      Outstanding balance starts at VP ($29.4M), declines by annualPrincipal each year.
      
      CASH IN to SPC each year:
        Fixed hire = annualPrincipal ($1.96M) — repays total capital
        Variable hire = allInRate × outstanding balance — covers interest on everything
      
      CASH OUT from SPC each year:
        To bank: debt principal portion + interest on debt
        Bank principal repay = annualPrincipal × (debt / VP) = annualPrincipal × debtPct
          (bank's share of the amortization, proportional to its funding share)
        Bank interest = allInRate × outstanding debt
      
      NET TO EQUITY each year:
        = (Fixed hire − bank principal) + (Variable hire − bank interest)
        = equity share of principal + interest on equity portion of outstanding balance
        = annualPrincipal × equityPct + allInRate × outstanding equity balance
      
      The equity share of principal is just return OF capital.
      The interest on equity's balance is return ON capital — this is Stream 1.
      
      Stream 2 (Tax Shield) is separate — it's tax saved on the investor's OTHER income.
      Stream 3 (Residual) is the PO exercise proceeds minus remaining debt.
    */

    const saleCommCost = VP * saleCommission / 100;
    const equityCF = [-(equity + saleCommCost)];
    const equityCF_noTax = [-(equity + saleCommCost)];
    const years = [];
    let outstandingTotal = VP;
    let outstandingDebt = debt;
    let outstandingEquity = equity;
    let cumulativeEquityCF = -(equity + saleCommCost);
    let totalStream1 = 0, totalStream2 = 0, totalStream3 = 0, totalBbcComm = 0;

    for (let yr = 1; yr <= effectiveExerciseYear; yr++) {
      // ── CASH IN ──
      const fixedHire = annualPrincipal;
      const variableHireBank   = outstandingDebt   * bankAllInRate;   // JPY loan interest (hedged to USD)
      const variableHireEquity = outstandingEquity * equityAllInRate; // equity return component
      const variableHire = variableHireBank + variableHireEquity;
      const totalHire = fixedHire + variableHire;
      const bbcCommCost = totalHire * bbcCommission / 100;
      const netHire = totalHire - bbcCommCost;

      // ── CASH OUT TO BANK ──
      const bankPrincipal = annualPrincipal * (debtPct / 100);
      const bankInterest = outstandingDebt * bankAllInRate;
      const totalToBank = bankPrincipal + bankInterest;

      // ── NET TO EQUITY ──
      const equityPrincipalReturn = annualPrincipal * ((100 - debtPct) / 100);
      const equityInterestIncome = outstandingEquity * equityAllInRate;
      const totalToEquity = equityPrincipalReturn + equityInterestIncome;
      // Verify: totalToEquity should = totalHire - totalToBank
      
      // ── STREAM 1: INTEREST INCOME ON EQUITY BALANCE ──
      // This is the actual RETURN on equity (not return of capital)
      const hireSpread = equityInterestIncome;

      // ── STREAM 2: TAX SHIELD ──
      // SPC P&L for tax purposes: hire income − depreciation − interest expense
      // Note: only bank interest is an expense; the "interest" on equity isn't a real cost
      const dep = yr <= depr.length ? depr[yr - 1] : { total: 0, bv: 0 };
      const spcTaxablePL = netHire - dep.total - bankInterest;
      // If negative → loss flows to TK investor → saves tax on other income
      // If positive → profit flows to investor → owes additional tax
      const taxShieldThisYear = -spcTaxablePL * (taxRate / 100);
      // Positive = tax saved, Negative = extra tax owed

      // ── STREAM 3: RESIDUAL / PO ──
      const isExitYear = yr === effectiveExerciseYear;
      let residualToEquity = 0, capGainTax = 0;
      if (isExitYear) {
        const remainDebt = outstandingDebt - bankPrincipal;
        // PO proceeds: first pay off remaining debt, rest to equity
        const grossResidual = poPriceMil - remainDebt;
        // Cap gains tax on (PO price - book value)
        const bookVal = dep.bv;
        const capGain = Math.max(0, poPriceMil - bookVal);
        capGainTax = capGain * taxRate / 100;
        residualToEquity = grossResidual - capGainTax;
      }

      // ── TOTAL EQUITY CF THIS YEAR ──
      // Return OF capital (equity principal) + return ON capital (interest) + tax shield + residual
      // For IRR purposes, the principal return IS a cashflow (it's cash coming back)
      const netCF = equityPrincipalReturn + hireSpread - bbcCommCost + taxShieldThisYear + (isExitYear ? residualToEquity : 0);
      // CF without tax shield (for pure equity IRR)
      const netCF_noTax = equityPrincipalReturn + hireSpread - bbcCommCost + (isExitYear ? residualToEquity : 0);

      // Update balances — clamp to zero so that if exercise year > amort period
      // the balances don't go negative and corrupt the model
      outstandingTotal   = Math.max(0, outstandingTotal   - annualPrincipal);
      outstandingDebt    = Math.max(0, outstandingDebt    - bankPrincipal);
      outstandingEquity  = Math.max(0, outstandingEquity  - equityPrincipalReturn);
      cumulativeEquityCF += netCF;

      totalStream1 += hireSpread;
      totalStream2 += taxShieldThisYear;
      totalBbcComm += bbcCommCost;
      if (isExitYear) totalStream3 = residualToEquity;

      equityCF.push(netCF);
      equityCF_noTax.push(netCF_noTax);
      years.push({
        yr, fixedHire, variableHireBank, variableHireEquity, variableHire, totalHire, bbcCommCost, netHire,
        bankPrincipal, bankInterest, totalToBank,
        equityPrincipalReturn, equityInterestIncome, hireSpread,
        dep: dep.total, spcTaxablePL, taxShieldThisYear,
        residualGain: isExitYear ? residualToEquity : 0,
        poExercise: isExitYear ? poPriceMil : 0, capGainTax,
        netCF, netCF_noTax, cumulativeEquityCF,
        outstandingDebt, outstandingEquity, outstandingTotal, bookVal: dep.bv,
      });
    }

    const blendedIRR = solveIRR(equityCF);
    const equityIRR = solveIRR(equityCF_noTax);
    const totalEquityDeployed = equity + saleCommCost;
    // Post-tax Treasury yield — uses JP SME corporate rate on foreign interest income
    // US Treasuries: 0% US withholding (Portfolio Interest Exemption, IRC §871h/881c); Japan taxes at full corp rate (no preferential rate for corps on foreign interest)
    // ~27% for typical SME TK investor; 30.62% for large corp TK investor
    const treasPostTaxYield = treasuryYield * (1 - foreignInterestTaxPct / 100);
    const treasTerminal = totalEquityDeployed * Math.pow(1 + treasPostTaxYield / 100, effectiveExerciseYear);
    const treasProfit = treasTerminal - totalEquityDeployed;
    const jolcoProfit = equityCF.reduce((a, b) => a + b, 0);
    const spread = blendedIRR != null ? blendedIRR - treasPostTaxYield / 100 : null;

    return { VP, debt, equity, saleCommCost, totalBbcComm, totalEquityDeployed, equityCF, equityCF_noTax, years, depr, blendedIRR, equityIRR, treasTerminal, treasProfit, jolcoProfit, spread, totalStream1, totalStream2, totalStream3, monthlyFixed, bankAllInRate, equityAllInRate, poPriceMil, treasPostTaxYield };
  }, [vesselPrice, debtPct, amortYrs, sofrRate, spreadBps, jpyBaseRate, bankSpreadBps, swapCostBps, saleCommission, bbcCommission, taxRate, foreignInterestTaxPct, usefulLife, specialDeprPct, treasuryYield, flagId, effectiveExerciseYear, poSchedule]);

  const C = { background: "#1a1b26", borderRadius: 10, padding: 18, border: "1px solid #292e42", marginBottom: 14 };
  const H = (color, text) => <div style={{ fontSize: 12, fontWeight: 700, color: "#c0caf5", marginBottom: 10, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color }}>●</span>{text}</div>;
  const T = (t, label) => <button onClick={() => setTab(t)} style={{ padding: "9px 16px", fontSize: 11, fontFamily: F, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", background: tab === t ? "#1a1b26" : "transparent", color: tab === t ? "#7aa2f7" : "#565f89", border: "none", borderBottom: tab === t ? "2px solid #7aa2f7" : "2px solid transparent", cursor: "pointer" }}>{label}</button>;

  return (
    <div style={{ minHeight: "100vh", background: "#16161e", fontFamily: "'Inter', sans-serif", color: "#a9b1d6" }}>
      <div style={{ background: "linear-gradient(135deg, #1a1b26, #24283b)", borderBottom: "1px solid #292e42", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="latest jolco logo.png" alt="JOLCO" style={{ height: 44, width: "auto", objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#c0caf5", fontFamily: F }}>Equity IRR Calculator <span style={{ fontSize: 11, color: "#9ece6a" }}>v3</span></div>
              <div style={{ fontSize: 10, color: "#565f89" }}>Financed ~{debtPct}% by bank debt, ~{100-debtPct}% by Japanese TK (silent partnership) equity investors · MOF Depreciation · Tax Shield Analysis</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff" }}>Sriniwas Ghate</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#ffffff" }}>Gibson Shipbrokers, Singapore</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", background: "#24283b", borderBottom: "1px solid #292e42", padding: "0 20px", flexWrap: "wrap" }}>
        {T("deal", "Deal Inputs")}{T("depr", "Depreciation Scale")}{T("cf", "Equity Cashflows")}{T("vs", "vs Treasury")}
      </div>

      <div style={{ padding: "20px 28px", maxWidth: 1150, margin: "0 auto" }}>

        {/* ═══ DEAL INPUTS ═══ */}
        {tab === "deal" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            {/* Summary — The 3 Return Streams */}
            <div style={{ gridColumn: "1 / -1", ...C, background: "linear-gradient(135deg, #1a1b26, #1e2030)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
                <div style={{ padding: 12, borderRadius: 8, background: "#16161e", border: "1px solid #292e42", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", letterSpacing: "0.06em" }}>① Charter Hire (net BBC comm)</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#9ece6a", fontFamily: F }}>${$d((R.totalStream1 - R.totalBbcComm) / 1e6, 2)}M</div>
                  <div style={{ fontSize: 9, color: "#565f89" }}>Hire spread after debt service &amp; {bbcCommission}% BBC brokerage</div>
                  <div style={{ marginTop: 5, fontSize: 8, fontWeight: 700, color: "#9ece6a44", background: "rgba(158,206,106,0.08)", padding: "2px 6px", borderRadius: 3, display: "inline-block", letterSpacing: "0.04em" }}>CASH YIELD · pre-tax · from charter hire</div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: "#16161e", border: "1px solid #292e42", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", letterSpacing: "0.06em" }}>② Tax Shield (Net)</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#bb9af7", fontFamily: F }}>${$d(R.totalStream2 / 1e6, 2)}M</div>
                  <div style={{ fontSize: 9, color: "#565f89" }}>Tax saved from depreciation losses</div>
                  <div style={{ marginTop: 5, fontSize: 8, fontWeight: 700, color: "#bb9af744", background: "rgba(187,154,247,0.08)", padding: "2px 6px", borderRadius: 3, display: "inline-block", letterSpacing: "0.04em" }}>TAX ARBITRAGE · depends on investor tax capacity</div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, background: "#16161e", border: "1px solid #292e42", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", letterSpacing: "0.06em" }}>③ Residual / PO Play</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#e0af68", fontFamily: F }}>${$d(R.totalStream3 / 1e6, 2)}M</div>
                  <div style={{ fontSize: 9, color: "#565f89" }}>PO exercise net of debt & cap gains tax</div>
                  <div style={{ marginTop: 5, fontSize: 8, fontWeight: 700, color: "#e0af6844", background: "rgba(224,175,104,0.08)", padding: "2px 6px", borderRadius: 3, display: "inline-block", letterSpacing: "0.04em" }}>TERMINAL EVENT · PO exercise at exit</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[
                  { l: "Equity Deployed", v: `$${$d(R.totalEquityDeployed / 1e6, 1)}M`, c: "#7aa2f7" },
                  { l: "Total Profit", v: `$${$d(R.jolcoProfit / 1e6, 2)}M`, c: R.jolcoProfit >= 0 ? "#9ece6a" : "#f7768e" },
                  { l: "Equity IRR", v: pct(R.equityIRR), c: "#e0af68", sub: "hire + residual" },
                  { l: "Blended IRR", v: pct(R.blendedIRR), c: R.spread > 0 ? "#9ece6a" : "#f7768e", sub: "incl. tax shield" },
                  { l: "vs UST", v: R.spread != null ? (R.spread > 0 ? "+" : "") + (R.spread * 10000).toFixed(0) + "bps" : "—", c: R.spread > 0 ? "#9ece6a" : "#f7768e" },
                ].map((x, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase" }}>{x.l}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: x.c, fontFamily: F }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={C}>
              {H("#9ece6a", "Vessel & Structure")}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" }}>Vessel Type</label>
                <select value={vesselTypeId} onChange={(e) => setVesselTypeId(e.target.value)} style={{ width: "100%", padding: "7px 8px", borderRadius: 5, border: "1px solid #3b4261", background: "#1a1b26", color: "#c0caf5", fontSize: 12, fontFamily: F }}>
                  {VESSEL_DB.map(v => <option key={v.id} value={v.id}>{v.label} (JP:{v.jpLife}yr / For:{v.forLife}yr)</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" }}>Flag State (SPC Registration)</label>
                <select value={flagId} onChange={(e) => setFlagId(e.target.value)} style={{ width: "100%", padding: "7px 8px", borderRadius: 5, border: "1px solid #3b4261", background: "#1a1b26", color: "#c0caf5", fontSize: 12, fontFamily: F }}>
                  {FLAG_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                <div style={{ fontSize: 9, color: "#565f89", marginTop: 2 }}>{flagInfo.desc} · Special depr: {flagInfo.specialMin}–{flagInfo.specialMax}%</div>
              </div>
              <div style={{ padding: 10, borderRadius: 6, background: "#1e2030", border: "1px solid #292e42", marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", marginBottom: 3 }}>Statutory Useful Life</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: "#9ece6a", fontFamily: F }}>{usefulLife}<span style={{ fontSize: 11, color: "#565f89" }}>yr</span></span>
                  <span style={{ fontSize: 10, color: "#565f89" }}>DB: {(dbRate * 100).toFixed(1)}% · SL: {(1/usefulLife * 100).toFixed(2)}%</span>
                </div>
                <div style={{ fontSize: 9, color: "#565f89", marginTop: 2 }}>MOF: {vType.cat}{isJPFlag ? "" : " (foreign: その他のもの 12yr flat)"}</div>
              </div>
              <Inp label="Vessel Price" value={vesselPrice} onChange={setVesselPrice} unit="$M" />
              <Inp label="Debt / Equity Split (Debt %)" value={debtPct} onChange={setDebtPct} unit="%" help={`${debtPct}% bank debt · ${100 - debtPct}% TK equity`} min={0} max={95} />
              <Inp label="Sale Commission" value={saleCommission} onChange={setSaleCommission} unit="%" help="Vessel purchase brokerage · paid upfront at Year 0" step={0.25} />
              <Inp label="BBC Commission" value={bbcCommission} onChange={setBbcCommission} unit="%" help="Annual bareboat charter brokerage on gross hire" step={0.25} />
              <div style={{ padding: 10, borderRadius: 6, background: "#1e2030", border: "1px solid #292e42", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div><div style={{ fontSize: 9, color: "#565f89" }}>EQUITY ({100-debtPct}%)</div><div style={{ fontSize: 14, fontWeight: 700, color: "#7aa2f7", fontFamily: F }}>${$d(R.equity / 1e6, 1)}M</div></div>
                <div><div style={{ fontSize: 9, color: "#f7768e" }}>+SALE COMM</div><div style={{ fontSize: 14, fontWeight: 700, color: "#f7768e", fontFamily: F }}>${$d(R.saleCommCost / 1e6, 2)}M</div></div>
                <div><div style={{ fontSize: 9, color: "#565f89" }}>DEBT ({debtPct}%)</div><div style={{ fontSize: 14, fontWeight: 700, color: "#e0af68", fontFamily: F }}>${$d(R.debt / 1e6, 1)}M</div></div>
              </div>
            </div>

            <div style={C}>
              {H("#7aa2f7", "Charter & Interest")}
              <Inp label="Amortization Period" value={amortYrs} onChange={setAmortYrs} unit="yrs" help="Fixed hire = VP ÷ this. Can differ from lease term — longer amort = lower hire, larger PO residual at exit" min={1} max={25} />
              <Inp label="Lease (BBC) Term" value={leaseTerm} onChange={(v) => {
                setLeaseTerm(v);
                setPoLastYear(v);
                setExerciseYear(v);
                if (poFirstYear > v) setPoFirstYear(Math.max(1, v - 1));
              }} unit="yrs" help="BBC duration — how long charterer pays hire. Often shorter than amort period. Last PO / obligation syncs to this." min={1} max={25} />
              <div style={{ padding: "6px 8px", borderRadius: 4, background: "#1e2030", marginBottom: 8, fontSize: 9, color: "#565f89", lineHeight: 1.5 }}>
                {amortYrs !== leaseTerm && (
                  <span style={{ color: amortYrs > leaseTerm ? "#e0af68" : "#f7768e" }}>
                    {amortYrs > leaseTerm
                      ? `⚡ Amort ${amortYrs}yr > Lease ${leaseTerm}yr — lower hire, outstanding balance of ~$${$d((vesselPrice * 1e6 * (1 - leaseTerm / amortYrs)) / 1e6, 2)}M settled via PO at exit`
                      : `⚠ Amort ${amortYrs}yr < Lease ${leaseTerm}yr — vessel is fully amortized before lease ends; no residual debt at PO`}
                  </span>
                )}
                {amortYrs === leaseTerm && <span>Amort period = Lease term ({amortYrs}yr) — debt fully repaid at lease end, minimal PO residual</span>}
              </div>
              <div style={{ marginTop: 10, marginBottom: 4, fontSize: 9, fontWeight: 700, color: "#e0af68", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #292e42", paddingBottom: 4 }}>Bank Loan — JPY (SPC borrows from Japanese bank)</div>
              <Inp label="JPY Base Rate (TONA/TIBOR)" value={jpyBaseRate} onChange={setJpyBaseRate} unit="%" step={0.05} help="Near-zero JPY policy rate · typically 0.05–0.50%" />
              <Inp label="Bank Spread over JPY Base" value={bankSpreadBps} onChange={setBankSpreadBps} unit="bps" step={5} help="Credit spread charged by lending bank" />
              <Inp label="USD/JPY Cross-Currency Swap Cost" value={swapCostBps} onChange={setSwapCostBps} unit="bps" step={5} help="Cost to swap JPY loan obligation into USD cash flows" />
              <div style={{ padding: "6px 8px", borderRadius: 4, background: "#1e2030", marginBottom: 10, fontSize: 9, color: "#565f89" }}>
                Effective USD cost of bank debt: <span style={{ color: "#e0af68", fontWeight: 700 }}>{(jpyBaseRate + bankSpreadBps/100 + swapCostBps/100).toFixed(2)}%</span> · JPY {(jpyBaseRate + bankSpreadBps/100).toFixed(2)}% + {swapCostBps}bps swap
              </div>
              <div style={{ marginBottom: 4, fontSize: 9, fontWeight: 700, color: "#7aa2f7", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #292e42", paddingBottom: 4 }}>BBC Hire Rate — USD (SPC lends to charterer)</div>
              <Inp label="SOFR Rate (USD)" value={sofrRate} onChange={setSofrRate} unit="%" step={0.1} help="USD reference rate for BBC hire calculation" />
              <Inp label="Equity Spread over SOFR" value={spreadBps} onChange={setSpreadBps} unit="bps" step={10} help="Spread reflecting charterer credit + vessel risk" />
              {(() => {
                const mFixed = R.monthlyFixed;
                const mVariableBank   = R.debt   * R.bankAllInRate   / 12;
                const mVariableEquity = R.equity * R.equityAllInRate / 12;
                const mVariable = mVariableBank + mVariableEquity;
                const mTotal = mFixed + mVariable;
                return (
                  <div style={{ padding: 10, borderRadius: 6, background: "#1e2030", border: "1px solid #292e42" }}>
                    {[
                      { label: "Scheduled Amortization Component (rate-insensitive)", val: mFixed, color: "#9ece6a", sub: `VP ÷ ${amortYrs}yr ÷ 12 · does not move with SOFR or JPY rates` },
                      { label: "Financing Return Component — Bank (JPY→USD · Yr1)", val: mVariableBank, color: "#e0af68", sub: `${(R.bankAllInRate * 100).toFixed(2)}% effective on ${$d(R.debt/1e6,1)}M bank bal. (${jpyBaseRate}% JPY + ${bankSpreadBps}bps + ${swapCostBps}bps swap) · tied to JPY base + swap` },
                      { label: "Financing Return Component — Equity (USD · Yr1)", val: mVariableEquity, color: "#7aa2f7", sub: `${(R.equityAllInRate * 100).toFixed(2)}% on ${$d(R.equity/1e6,1)}M equity bal. (SOFR ${sofrRate}% + ${spreadBps}bps) · tied to SOFR` },
                      { label: "Total Monthly Hire (Yr 1)", val: mTotal, color: "#bb9af7", sub: "Amortization + Financing Return (Bank + Equity) · total cost to charterer" },
                    ].map((row, i, arr) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 8, marginBottom: i < arr.length - 1 ? 8 : 0, borderBottom: i < arr.length - 1 ? "1px solid #292e42" : "none" }}>
                        <div>
                          <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", marginBottom: 1 }}>{row.label}</div>
                          <div style={{ fontSize: 8, color: "#3b4261" }}>{row.sub}</div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: row.color, fontFamily: F, whiteSpace: "nowrap", marginLeft: 8 }}>${$(row.val)}<span style={{ fontSize: 9, color: "#565f89" }}>/mo</span></div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div style={C}>
              {H("#bb9af7", "Purchase Options & Tax")}
              {/* PO range */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <Inp label="First PO Year" value={poFirstYear} onChange={(v) => { setPoFirstYear(v); if (exerciseYear < v) setExerciseYear(v); }} unit="" min={1} max={poLastYear} />
                <Inp label="Last Year (Oblig.)" value={poLastYear} onChange={(v) => { setPoLastYear(v); if (exerciseYear > v) setExerciseYear(v); }} unit="" min={poFirstYear} max={25} />
              </div>
              {/* Exercise Year Selector */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" }}>Exercise at Year</label>
                <select value={exerciseYear} onChange={(e) => setExerciseYear(parseInt(e.target.value))} style={{ width: "100%", padding: "7px 8px", borderRadius: 5, border: `1px solid ${effectiveExerciseYear > amortYrs ? "#f7768e" : "#7aa2f7"}`, background: "#1a1b26", color: "#c0caf5", fontSize: 12, fontFamily: F }}>
                  {poSchedule.map(p => (
                    <option key={p.yr} value={p.yr}>Year {p.yr} — ${$d(p.price, 1)}M {p.obligatory ? "(Obligation)" : ""}</option>
                  ))}
                </select>
                {effectiveExerciseYear > amortYrs && (
                  <div style={{ marginTop: 5, padding: "6px 8px", borderRadius: 4, background: "rgba(247,118,142,0.1)", border: "1px solid #f7768e44", fontSize: 9, color: "#f7768e", lineHeight: 1.5 }}>
                    ⚠ Exercise year ({effectiveExerciseYear}) exceeds amortization period ({amortYrs} yrs). After year {amortYrs} all balances are zero — hire, interest, and residual will be zero. Extend the amortization period or reduce the exercise year.
                  </div>
                )}
              </div>
              {/* Auto-decline info */}
              <div style={{ padding: 8, borderRadius: 5, background: "#1e2030", marginBottom: 10, fontSize: 9, color: "#565f89", lineHeight: 1.5 }}>
                <strong style={{ color: "#bb9af7" }}>Default PO decline:</strong> ${$d(effectiveDecline, 2)}M/yr (= Vessel Price ÷ Amort Period). PO tracks remaining financing balance. Edit any year below to override.
              </div>
              {/* PO Schedule — editable per year */}
              <div style={{ fontSize: 8, color: "#565f89", display: "flex", gap: 4, marginBottom: 4, fontFamily: F }}>
                <span style={{ width: 32 }}>YEAR</span><span style={{ width: 76 }}>PO PRICE</span><span style={{ flex: 1 }}>STATUS</span>
              </div>
              {poSchedule.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, padding: "3px 4px", borderRadius: 4, background: p.yr === effectiveExerciseYear ? "rgba(122,162,247,0.08)" : "transparent" }}>
                  <span style={{ fontSize: 10, color: p.yr === effectiveExerciseYear ? "#7aa2f7" : "#565f89", fontFamily: F, width: 32, fontWeight: p.yr === effectiveExerciseYear ? 700 : 400 }}>Yr{p.yr}</span>
                  <input type="number" value={p.price} step={0.1}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setPoOverrides(prev => ({ ...prev, [p.yr]: val }));
                    }}
                    style={{ width: 68, padding: "3px 6px", borderRadius: 4, border: `1px solid ${p.isOverridden ? "#bb9af7" : "#3b4261"}`, background: "#1a1b26", color: p.isOverridden ? "#bb9af7" : "#c0caf5", fontSize: 11, fontFamily: F }} />
                  <span style={{ fontSize: 9, color: "#565f89" }}>$M</span>
                  {p.isOverridden && (
                    <button onClick={() => setPoOverrides(prev => { const n = { ...prev }; delete n[p.yr]; return n; })}
                      style={{ fontSize: 8, color: "#f7768e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>reset</button>
                  )}
                  <span style={{ fontSize: 7, color: p.obligatory ? "#f7768e" : p.yr === effectiveExerciseYear ? "#7aa2f7" : "#565f89", marginLeft: "auto", fontFamily: F }}>
                    {p.obligatory ? "OBLIG" : p.yr === effectiveExerciseYear ? "◀ EXIT" : "OPT"}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 10, borderTop: "1px solid #292e42", paddingTop: 10 }}>
                <Inp label="Effective Tax Rate" value={taxRate} onChange={setTaxRate} unit="%" help={`${taxRate}% · std JP corp (23.2%) + local + defense surtax`} step={0.01} />
                <Inp label="US Treasury Yield" value={treasuryYield} onChange={setTreasuryYield} unit="%" step={0.01} />
                <Inp label="JP Tax on Foreign Interest" value={foreignInterestTaxPct} onChange={setForeignInterestTaxPct} unit="%" step={0.01} help="JP SME corp rate ~27%, large corp 30.62%. No preferential rate for corps on foreign interest. US charges 0% (Portfolio Interest Exemption, IRC §871h)." />
                <Slider label="Special Depreciation (Yr1)" value={specialDeprPct} onChange={(v) => setSpecialDeprPct(Math.min(v, flagInfo.specialMax))} min={0} max={flagInfo.specialMax} step={1} unit="%" help={`MLIT advanced vessels: ${flagInfo.specialMin}–${flagInfo.specialMax}% for ${flagInfo.label}`} />
              </div>
            </div>

          </div>
        )}

        {/* ═══ DEPRECIATION SCALE ═══ */}
        {tab === "depr" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div style={C}>
              {H("#bb9af7", `Depreciation Scale — ${vType.label}`)}
              <Slider label="Special Depreciation Rate" value={specialDeprPct} onChange={(v) => setSpecialDeprPct(Math.min(v, flagInfo.specialMax))} min={0} max={flagInfo.specialMax} step={1} unit="%" help={`${flagInfo.specialMin}–${flagInfo.specialMax}% for ${flagInfo.label} · slide to see how Yr1 bonus changes the IRR`} />
              <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 8, borderRadius: 2, background: "#7aa2f7", display: "inline-block" }} /> Ordinary</span>
                {specialDeprPct > 0 && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 8, borderRadius: 2, background: "#bb9af7", display: "inline-block" }} /> Special</span>}
              </div>
              {(() => {
                const mx = Math.max(...R.depr.map(d => d.total));
                return R.depr.map((d, i) => {
                  const ordW = (d.ordinary / mx) * 100;
                  const specW = (d.special / mx) * 100;
                  const pctOfVessel = (d.total / R.VP * 100);
                  const inLease = d.yr <= effectiveExerciseYear;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, opacity: inLease ? 1 : 0.4 }}>
                      <div style={{ width: 20, fontSize: 10, color: "#565f89", fontFamily: F, textAlign: "right" }}>{d.yr}</div>
                      <div style={{ flex: 1, height: 22, background: "#16161e", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${ordW}%`, background: "#7aa2f7", borderRadius: "4px 0 0 4px" }} />
                        <div style={{ position: "absolute", left: `${ordW}%`, top: 0, height: "100%", width: `${specW}%`, background: "#bb9af7" }} />
                        <span style={{ position: "absolute", right: 6, top: 3, fontSize: 9, fontFamily: F, color: "#c0caf5" }}>{pctOfVessel.toFixed(1)}%</span>
                      </div>
                      <div style={{ width: 65, fontSize: 10, color: "#a9b1d6", fontFamily: F, textAlign: "right" }}>${$(d.total)}</div>
                      <div style={{ width: 20, fontSize: 9, color: d.method === "DB" ? "#e0af68" : "#9ece6a", fontFamily: F }}>{d.method}</div>
                    </div>
                  );
                });
              })()}
              <div style={{ marginTop: 14, padding: 10, borderRadius: 6, background: "#1e2030", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { l: "Yr1 Total", v: `${(R.depr[0]?.total / R.VP * 100).toFixed(1)}%`, c: "#bb9af7" },
                  { l: "3yr Cumul", v: `${(R.depr.slice(0, 3).reduce((s, d) => s + d.total, 0) / R.VP * 100).toFixed(1)}%`, c: "#7aa2f7" },
                  { l: "Tax Shield (Lease)", v: `$${$d(R.totalStream2 / 1e6, 2)}M`, c: "#9ece6a" },
                  { l: "DB→SL", v: `Yr ${R.depr.findIndex(d => d.method === "SL") + 1 || "N/A"}`, c: "#e0af68" },
                ].map((x, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: "#565f89", textTransform: "uppercase" }}>{x.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: x.c, fontFamily: F }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Index */}
            <div style={C}>
              {H("#e0af68", "MOF Rate Index")}
              <div style={{ fontSize: 9, color: "#565f89", marginBottom: 8 }}>耐用年数省令 別表第一 · Click to select</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 6, fontSize: 8, color: "#565f89", fontFamily: F }}>
                <div style={{ flex: 1 }}>VESSEL TYPE</div>
                <div style={{ width: 32, textAlign: "right" }}>JP</div>
                <div style={{ width: 32, textAlign: "right" }}>FOR</div>
                <div style={{ width: 42, textAlign: "right" }}>DB%</div>
              </div>
              {VESSEL_DB.map((v, i) => {
                const isActive = v.id === vesselTypeId;
                const life = isJPFlag ? v.jpLife : v.forLife;
                const yr1 = 2 / life * 100;
                return (
                  <div key={v.id} onClick={() => setVesselTypeId(v.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", borderRadius: 4, marginBottom: 2, cursor: "pointer", background: isActive ? "rgba(122,162,247,0.08)" : "transparent" }}>
                    <div style={{ flex: 1, fontSize: 9, color: isActive ? "#7aa2f7" : "#a9b1d6", fontWeight: isActive ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.label}</div>
                    <div style={{ fontSize: 9, fontFamily: F, color: isJPFlag ? "#9ece6a" : "#565f89", width: 32, textAlign: "right", fontWeight: isJPFlag ? 600 : 400 }}>{v.jpLife}</div>
                    <div style={{ fontSize: 9, fontFamily: F, color: !isJPFlag ? "#9ece6a" : "#565f89", width: 32, textAlign: "right", fontWeight: !isJPFlag ? 600 : 400 }}>{v.forLife}</div>
                    <div style={{ fontSize: 9, fontFamily: F, color: "#e0af68", width: 42, textAlign: "right" }}>{yr1.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ EQUITY CASHFLOWS ═══ */}
        {tab === "cf" && (
          <div>
            {/* ── EQUATION WITH EXPLAINERS ── */}
            <div style={C}>
              {H("#7aa2f7", "The Equation — How the Economics Work")}
              {(() => {
                const eq = R.totalEquityDeployed;
                const s1 = R.totalStream1;
                const s2 = R.totalStream2;
                const s3 = R.totalStream3;
                const sc = R.saleCommCost;
                const bc = R.totalBbcComm;
                const totalReturned = eq + R.jolcoProfit;
                const principalBack = R.years.reduce((s, y) => s + y.equityPrincipalReturn, 0);
                const profit = R.jolcoProfit;

                const Row = ({ val, label, explain, color, neg = false }) => (
                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "0 18px", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1e2030" }}>
                    <div style={{ textAlign: "right", fontFamily: F, fontSize: 15, fontWeight: 700, color, paddingTop: 1 }}>
                      {neg ? "−" : "+"}&thinsp;${$d(Math.abs(val) / 1e6, 2)}M
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#c0caf5", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 9, color: "#565f89", lineHeight: 1.55 }}>{explain}</div>
                    </div>
                  </div>
                );

                return (
                  <div>
                    <Row val={R.equity} neg color="#f7768e" label={`Equity In — ${100-debtPct}% of Vessel Price`}
                      explain={`TK investors (匿名組合員) put in ${100-debtPct}% of the vessel cost. The remaining ${debtPct}% is a non-recourse JPY bank loan to the SPC at ${(R.bankAllInRate*100).toFixed(2)}% all-in USD equivalent (TONA + ${bankSpreadBps}bps spread + ${swapCostBps}bps cross-currency swap). The bank loan is secured by a vessel mortgage and charter hire assignment — investors are not on the hook for the loan.`} />
                    <Row val={sc} neg color="#f7768e" label={`Sale Commission — ${saleCommission}% of Vessel Price`}
                      explain={`One-time brokerage on the vessel purchase, paid at Year 0. Industry standard is 1% per broker side (buyer's broker + seller's broker). Reduces the equity invested but is deductible for SPC tax purposes.`} />
                    <div style={{ borderTop: "1px dashed #3b4261", margin: "4px 0 12px 0" }} />
                    <Row val={principalBack} color="#7aa2f7" label="Principal Returned via Fixed Hire"
                      explain={`Fixed hire = Vessel Price ÷ amortization period = $${$(R.monthlyFixed)}/mo. The equity investors' ${100-debtPct}% share of each annual fixed hire payment = $${$d(principalBack/effectiveExerciseYear/1e6,2)}M/yr. This is return OF capital — not profit. You are simply recovering what you put in.`} />
                    <Row val={s1} color="#9ece6a" label={`① Charter Hire Spread — SOFR+${spreadBps}bps on equity balance`}
                      explain={`Variable hire is charged on the full outstanding vessel balance at the all-in rate (${(R.equityAllInRate*100).toFixed(2)}%). The bank takes its share to cover JPY loan interest (${(R.bankAllInRate*100).toFixed(2)}% on ${debtPct}% of balance). The equity investors keep the variable hire on their ${100-debtPct}% of the outstanding balance. As principal is repaid, this stream declines each year. This is the actual return ON capital.`} />
                    <Row val={bc} neg color="#f7768e" label={`BBC Commission — ${bbcCommission}% of Gross Hire`}
                      explain={`Annual bareboat charter brokerage paid by the SPC to the shipbroker. BIMCO standard rate for BBC arrangements. Deducted from all hire received before anything reaches equity or bank. Reduces SPC taxable income (deductible expense). Total over ${effectiveExerciseYear}yr lease: $${$d(bc/1e6,2)}M.`} />
                    <Row val={s2} color="#bb9af7" label="② Tax Shield — Depreciation Loss via TK Pass-Through"
                      explain={`The SPC claims Japanese tax depreciation (200% declining balance → straight-line switch, per MOF Ordinance 別表第一) on the full vessel cost. In early years, depreciation exceeds hire income net of bank interest → SPC records an accounting loss. This loss flows through the TK structure (匿名組合) to each investor's own corporate tax return, directly offsetting their operating profits. Tax saved = loss × ${taxRate}% corporate rate. In later years the SPC turns profitable and investors owe incremental tax — Stream ② is the NET over the full term.`} />
                    <Row val={s3} color="#e0af68" label={`③ Residual — PO Exercise at Year ${effectiveExerciseYear}`}
                      explain={`At exit, the charterer exercises the purchase option at $${$d(R.poPriceMil/1e6,1)}M. The SPC first repays the outstanding bank debt from these proceeds. The balance goes to equity investors, less capital gains tax on (PO price − tax book value of the vessel at that date). If the PO price is below remaining debt, equity receives nothing from Stream ③.`} />
                    <div style={{ borderTop: "1px dashed #3b4261", margin: "4px 0 12px 0" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "0 18px" }}>
                      <div style={{ textAlign: "right", fontFamily: F, fontSize: 18, fontWeight: 700, color: profit >= 0 ? "#9ece6a" : "#f7768e", paddingTop: 4 }}>
                        = ${$d(totalReturned / 1e6, 2)}M
                      </div>
                      <div style={{ paddingTop: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#c0caf5" }}>Total Returned · {$d(totalReturned / eq, 2)}x MoIC</div>
                        <div style={{ fontSize: 10, color: "#565f89", marginTop: 3 }}>
                          <span style={{ color: profit >= 0 ? "#9ece6a" : "#f7768e", fontWeight: 700 }}>${$d(profit / 1e6, 2)}M net profit</span>
                          <span style={{ color: "#3b4261" }}> · </span>
                          <span style={{ color: "#e0af68", fontWeight: 700 }}>{pct(R.blendedIRR)} blended IRR</span>
                          <span style={{ color: "#3b4261" }}> · </span>
                          <span style={{ color: "#bb9af7", fontWeight: 700 }}>{pct(R.equityIRR)} pre-tax IRR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── YEAR-BY-YEAR TABLE ── */}
            <div style={C}>
            {H("#9ece6a", "Three Return Streams — Year by Year")}
            <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 10, flexWrap: "wrap" }}>
              <span style={{ color: "#9ece6a" }}>● ① Hire Spread (net of BBC comm)</span>
              <span style={{ color: "#bb9af7" }}>● ② Tax Shield</span>
              <span style={{ color: "#e0af68" }}>● ③ Residual/PO</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #3b4261" }}>
                    {["Yr", "① Hire Spread", "② Tax Shield", "③ Residual", "Total CF", "Cumulative"].map(h => (
                      <th key={h} style={{ padding: "6px 8px", textAlign: "right", color: "#565f89", fontFamily: F, fontSize: 9, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #1e2030", background: "#1e1e2e" }}>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5" }}>0</td>
                    <td colSpan={3} style={{ padding: "5px 8px", textAlign: "center", color: "#565f89", fontSize: 10 }}>Equity ({100-debtPct}%) + Sale Comm ({saleCommission}%)</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#f7768e", fontWeight: 600 }}>-${$(R.totalEquityDeployed)}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#f7768e" }}>-${$(R.totalEquityDeployed)}</td>
                  </tr>
                  {R.years.map((y, i) => {
                    const isExpanded = expandedYear === y.yr;
                    return (
                    <React.Fragment key={i}>
                    <tr style={{ borderBottom: isExpanded ? "none" : "1px solid #1e2030", background: y.yr === effectiveExerciseYear ? "rgba(122,162,247,0.04)" : "transparent" }}>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5" }}>
                        {y.yr}{y.yr === effectiveExerciseYear && <span style={{ color: "#7aa2f7", fontSize: 8, marginLeft: 2 }}>EXIT</span>}
                      </td>
                      <td onClick={() => setExpandedYear(isExpanded ? null : y.yr)}
                        style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#9ece6a", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>
                        ${$(y.hireSpread - y.bbcCommCost)} <span style={{ fontSize: 8, color: "#565f89" }}>{isExpanded ? "▲" : "▼"}</span>
                      </td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.taxShieldThisYear >= 0 ? "#bb9af7" : "#f7768e" }}>
                        {y.taxShieldThisYear >= 0 ? `$${$(y.taxShieldThisYear)}` : `-$${$(Math.abs(y.taxShieldThisYear))}`}
                      </td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.residualGain !== 0 ? "#e0af68" : "#565f89" }}>
                        {y.residualGain !== 0 ? `$${$(y.residualGain)}` : "—"}
                      </td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.netCF >= 0 ? "#9ece6a" : "#f7768e", fontWeight: 600 }}>${$(y.netCF)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.cumulativeEquityCF >= 0 ? "#9ece6a" : "#f7768e" }}>${$(y.cumulativeEquityCF)}</td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ borderBottom: "1px solid #1e2030" }}>
                        <td colSpan={6} style={{ padding: 0 }}>
                          <div style={{ margin: "0 8px 8px", padding: 12, borderRadius: 6, background: "#16161e", border: "1px solid #3b4261" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#c0caf5", marginBottom: 8, fontFamily: F }}>Year {y.yr} — Full Hire Breakdown</div>
                            <div style={{ fontFamily: F, fontSize: 11, lineHeight: 2, color: "#a9b1d6" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Total BB Hire Received</span>
                                <span style={{ color: "#c0caf5", fontWeight: 700 }}>${$(y.totalHire)}</span>
                              </div>
                              <div style={{ paddingLeft: 12, fontSize: 10, color: "#565f89" }}>
                                Sched. Amort.: ${$(y.fixedHire)}/yr (rate-insensitive) · Financing Return — Bank: ${$(y.variableHireBank)} ({((R.bankAllInRate)*100).toFixed(2)}% on ${$(y.outstandingDebt + y.bankPrincipal)} JPY bal.) · Financing Return — Equity: ${$(y.variableHireEquity)} ({((R.equityAllInRate)*100).toFixed(2)}% on ${$(y.outstandingEquity + y.equityPrincipalReturn)} bal.)
                              </div>
                              <div style={{ borderTop: "1px dashed #3b4261", marginTop: 4, paddingTop: 4 }} />
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#f7768e" }}>BBC Commission ({bbcCommission}%)</span>
                                <span style={{ color: "#f7768e" }}>-${$(y.bbcCommCost)}</span>
                              </div>
                              <div style={{ paddingLeft: 12, fontSize: 10, color: "#565f89" }}>
                                Annual brokerage on gross hire · Net hire: ${$(y.netHire)}
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 12, fontSize: 10 }}>
                                <span style={{ color: "#bb9af7" }}>BBC comm tax offset ({taxRate.toFixed(2)}% of commission)</span>
                                <span style={{ color: "#bb9af7" }}>+${$(y.bbcCommCost * taxRate / 100)}</span>
                              </div>
                              <div style={{ paddingLeft: 24, fontSize: 9, color: "#565f89" }}>
                                BBC commission is a deductible SPC expense → saves {taxRate.toFixed(2)}% tax on that amount via the TK P&amp;L
                              </div>
                              <div style={{ borderTop: "1px dashed #3b4261", marginTop: 4, paddingTop: 4 }} />
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#f7768e" }}>To Bank ({debtPct}%)</span>
                                <span style={{ color: "#f7768e" }}>-${$(y.totalToBank)}</span>
                              </div>
                              <div style={{ paddingLeft: 12, fontSize: 10, color: "#565f89" }}>
                                Principal: ${$(y.bankPrincipal)} + Interest: ${$(y.bankInterest)}
                              </div>
                              <div style={{ borderTop: "1px dashed #3b4261", marginTop: 4, paddingTop: 4 }} />
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#9ece6a", fontWeight: 700 }}>To Equity ({100 - debtPct}%)</span>
                                <span style={{ color: "#9ece6a", fontWeight: 700 }}>${$(y.equityPrincipalReturn + y.equityInterestIncome - y.bbcCommCost)}</span>
                              </div>
                              <div style={{ paddingLeft: 12, marginTop: 2 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                                  <span style={{ color: "#7aa2f7" }}>Principal return (return OF capital)</span>
                                  <span style={{ color: "#7aa2f7" }}>${$(y.equityPrincipalReturn)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                                  <span style={{ color: "#9ece6a" }}>Interest income (return ON capital)</span>
                                  <span style={{ color: "#9ece6a" }}>${$(y.equityInterestIncome)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                                  <span style={{ color: "#f7768e" }}>Less BBC commission</span>
                                  <span style={{ color: "#f7768e" }}>-${$(y.bbcCommCost)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                    );
                  })}
                  {/* Totals row */}
                  <tr style={{ borderTop: "2px solid #3b4261", background: "#1e2030" }}>
                    <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5", fontWeight: 700 }}>Σ</td>
                    <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#9ece6a", fontWeight: 700 }}>${$(R.totalStream1 - R.totalBbcComm)}</td>
                    <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#bb9af7", fontWeight: 700 }}>${$(R.totalStream2)}</td>
                    <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#e0af68", fontWeight: 700 }}>${$(R.totalStream3)}</td>
                    <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5", fontWeight: 700 }}>${$(R.jolcoProfit)}</td>
                    <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#565f89", fontSize: 9 }}>net of equity</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { l: "Equity IRR", v: pct(R.equityIRR), s: "Hire + Residual only", c: "#e0af68" },
                { l: "Blended IRR", v: pct(R.blendedIRR), s: "Incl. tax shield", c: R.spread > 0 ? "#9ece6a" : "#f7768e" },
                { l: "MoIC", v: R.totalEquityDeployed > 0 ? $d((R.totalEquityDeployed + R.jolcoProfit) / R.totalEquityDeployed, 2) + "x" : "—", s: "Total returned / equity deployed", c: "#7aa2f7" },
              ].map((x, i) => (
                <div key={i} style={{ textAlign: "center", padding: 12, borderRadius: 8, background: "#16161e" }}>
                  <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase" }}>{x.l}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: x.c, fontFamily: F }}>{x.v}</div>
                  <div style={{ fontSize: 8, color: "#565f89", marginTop: 2 }}>{x.s}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: "#16161e", fontSize: 11, color: "#a9b1d6", lineHeight: 1.7 }}>
              <strong style={{ color: "#c0caf5" }}>How to read this:</strong> The tax shield column shows tax you <em>didn't have to pay</em> because depreciation created paper losses. In early years it's positive (you're saving tax). In later years when depreciation runs out, it may go negative (you're now paying more tax than you would without the JOLCO). The net effect over the lease term is shown in the Σ row. All three streams together, timed correctly, give you the IRR.
            </div>
            <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: "rgba(187,154,247,0.06)", border: "1px solid #bb9af733", fontSize: 10, color: "#a9b1d6", lineHeight: 1.6 }}>
              <span style={{ color: "#bb9af7", fontWeight: 700 }}>⚠ Tax capacity caveat:</span> The Blended IRR assumes the investor has sufficient taxable income from other sources to fully absorb depreciation losses every year. If the investor's tax capacity is limited in any given year (e.g. they are already in a loss position), the Stream ② benefit will be deferred or lost entirely, and actual returns will be lower than shown.
            </div>
          </div>
          </div>
        )}

        {/* ═══ vs TREASURY ═══ */}
        {tab === "vs" && (
          <div>
            <div style={{ ...C, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ padding: 18, borderRadius: 10, background: "#16161e", border: "1px solid #292e42" }}>
                <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", marginBottom: 6 }}>JOLCO Equity — Where the money comes from</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#9ece6a", fontFamily: F }}>{pct(R.blendedIRR)}</div>
                <div style={{ fontSize: 10, color: "#565f89", marginBottom: 12 }}>Equity IRR (all 3 streams combined)</div>
                {[
                  { l: `Equity Deployed (${100-debtPct}%+comm)`, v: `$${$d(R.totalEquityDeployed / 1e6, 2)}M`, c: "#7aa2f7" },
                  { l: "① Hire Spread (net BBC comm)", v: `$${$d((R.totalStream1 - R.totalBbcComm) / 1e6, 2)}M`, c: "#9ece6a" },
                  { l: "② Tax Shield (Net)", v: `$${$d(R.totalStream2 / 1e6, 2)}M`, c: "#bb9af7" },
                  { l: "③ Residual / PO", v: `$${$d(R.totalStream3 / 1e6, 2)}M`, c: "#e0af68" },
                  { l: "Total Profit", v: `$${$d(R.jolcoProfit / 1e6, 2)}M`, c: R.jolcoProfit >= 0 ? "#9ece6a" : "#f7768e" },
                  { l: "MoIC", v: $d((R.totalEquityDeployed + R.jolcoProfit) / R.totalEquityDeployed, 2) + "x" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1e2030" }}>
                    <span style={{ fontSize: 10, color: "#565f89" }}>{r.l}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: r.c || "#c0caf5", fontFamily: F }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: 18, borderRadius: 10, background: "#16161e", border: "1px solid #292e42" }}>
                <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase", marginBottom: 6 }}>US Treasury — Risk-Free Alternative (post-tax)</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#7aa2f7", fontFamily: F }}>{$d(R.treasPostTaxYield, 2)}%</div>
                <div style={{ fontSize: 10, color: "#565f89", marginBottom: 4 }}>{effectiveExerciseYear}Y compound · Same equity deployed</div>
                <div style={{ fontSize: 9, color: "#565f89", marginBottom: 12, padding: "4px 6px", borderRadius: 3, background: "#1e2030" }}>
                  Pre-tax: {$d(treasuryYield, 2)}% × (1 − {$d(foreignInterestTaxPct, 2)}% JP corp tax) = {$d(R.treasPostTaxYield, 2)}% after tax.<br/>US charges 0% withholding on Treasuries (Portfolio Interest Exemption, IRC §871h). Japan taxes at full corp rate — no preferential rate for corps on foreign interest. ~27% for SME TK investors, 30.62% for large corp.
                </div>
                {[
                  { l: "Capital", v: `$${$d(R.totalEquityDeployed / 1e6, 2)}M` },
                  { l: "Terminal (post-tax compounded)", v: `$${$d(R.treasTerminal / 1e6, 2)}M` },
                  { l: "Profit", v: `$${$d(R.treasProfit / 1e6, 2)}M`, c: "#7aa2f7" },
                  { l: "MoIC", v: $d(R.treasTerminal / R.totalEquityDeployed, 2) + "x" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1e2030" }}>
                    <span style={{ fontSize: 10, color: "#565f89" }}>{r.l}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: r.c || "#c0caf5", fontFamily: F }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...C, textAlign: "center", padding: 22, background: R.spread > 0 ? "linear-gradient(135deg, rgba(158,206,106,0.06), #1a1b26)" : "linear-gradient(135deg, rgba(247,118,142,0.06), #1a1b26)", border: `1px solid ${R.spread > 0 ? "#9ece6a33" : "#f7768e33"}` }}>
              <div style={{ fontSize: 9, color: "#565f89", textTransform: "uppercase" }}>Spread over Risk-Free</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: F, color: R.spread > 0 ? "#9ece6a" : "#f7768e" }}>
                {R.spread != null ? (R.spread > 0 ? "+" : "") + (R.spread * 10000).toFixed(0) + " bps" : "—"}
              </div>
              <div style={{ fontSize: 10, color: "#565f89", marginTop: 2 }}>
                {R.spread != null ? `(${pct(R.blendedIRR)} equity IRR vs ${$d(R.treasPostTaxYield, 2)}% UST after-tax)` : ""}
              </div>
              <div style={{ fontSize: 11, color: "#a9b1d6", marginTop: 8 }}>
                {R.spread > 0.03
                  ? "Strong premium over risk-free. JOLCO structure adding clear value."
                  : R.spread > 0.015
                    ? "Moderate premium. Reasonable for investment-grade charterer credit."
                    : R.spread > 0.005
                      ? "Thin spread. Marginal compensation for vessel risk and illiquidity."
                      : R.spread > 0
                        ? "Negligible. Barely above risk-free."
                        : R.spread != null
                          ? "Below risk-free. Owner loses versus US Treasuries."
                          : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
