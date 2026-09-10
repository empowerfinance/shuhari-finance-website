/* =============================================================================
   Shuhari Finance Pvt. Ltd. — Central configuration (single source of truth)
   -----------------------------------------------------------------------------
   Every volatile corporate fact lives here. Pages and partials read from
   window.SHUHARI so these values are edited in ONE place.

   Anything wrapped in [TO BE UPDATED] is an INTENTIONAL placeholder pending a
   document/fact owed by another team. The trailing number in square brackets
   (e.g. [17]) is the Ref # from the Notion "Pending items" tracker — keep these
   in sync with it. See CLAUDE.md §11.

   CONFIRMED facts (safe to rely on): legalName, cin, registeredOffice.
   ========================================================================== */
window.SHUHARI = {
  // ---- Corporate identity (RBI disclosure #1) -------------------------------
  legalName: "Shuhari Finance Pvt. Ltd.",
  cin: "U64910KA2025PTC202910",                 // confirmed from company letterhead
  corNumber: "[TO BE UPDATED]",                  // [17] pending CoR issuance
  corNumberRef: "17",
  registeredOffice:
    "36/5, H206, 3rd Floor, Somasundarapalya Main Road, adjacent 27th Main Road, Haralukunte Village, Sector 2, HSR Layout, Bengaluru, Karnataka - 560102", // confirmed

  rbiStatement: "Shuhari Finance Pvt. Ltd. is regulated by the Reserve Bank of India.",

  // ---- Holding / group structure (RBI disclosure #8) ------------------------
  holdingCompany: {
    name: "Shuhari Tech Ventures Pvt. Ltd."
  },

  // NIRA — the digital lending platform / DLA this NBFC powers. NOT a metric source.
  nira: { name: "NIRA", url: "https://www.nirafinance.com" },

  // ---- Customer care --------------------------------------------------------
  // [24] STILL PENDING. The Grievance Redressal Policy lists "NIRA Help & Support"
  // (support@nirafinance.com / 7259947885) — but that is the LSP's support desk, not
  // Shuhari Finance's own customer-care line, which is what contact.html renders here.
  // See TODO.md §C before filling. Note also the e-mail domain conflict flagged there:
  // the Terms of Use uses shuhari.finance, this policy uses shuharifinance.com.
  customerCare: {
    phone: "[TO BE UPDATED]",                     // [24]
    email: "[TO BE UPDATED]",                      // [24]
    ref: "24"
  },

  // ---- Grievance redressal (RBI disclosure #4) ------------------------------
  // Source: Grievance Redressal Policy (SFPL), §12 Contact Details.
  // Escalation runs: NIRA support -> LSP nodal officer -> SFPL's own GRO -> RBI.

  // NIRA Help & Support — general customer support, first port of call.
  niraSupport: {
    email: "support@nirafinance.com",
    phone: "7259947885"
  },

  // Nodal Grievance Redressal Officer at the LSP (NIRA) — day-to-day grievances.
  // Phone from the LSP/DLA website disclosure sheet; the policy gives only the e-mail.
  lspNodalOfficer: {
    name: "Sashikanta Parhi",
    designation: "Nodal Grievance Redressal Officer, NIRA (Lending Service Provider)",
    email: "grievance@nirafinance.com",
    phone: "7618789180"
  },

  // Shuhari Finance's OWN Grievance Redressal Officer (GRO) — the officer RBI
  // requires the NBFC to display. Escalated / unresolved queries.
  // NOTE: the policy designates a "Grievance Redressal Officer", not a "Principal
  // Nodal Officer" — the old principalNodalOfficer key [23] is superseded.
  grievanceOfficer: {
    name: "Pranaya Kumar Biswal",
    designation: "Grievance Redressal Officer",
    phone: "[TO BE UPDATED]",                      // not stated in the policy
    email: "grievance@shuharifinance.com",
    address:
      "Shuhari Finance Private Limited, 36/5, H206, 3rd Floor, Somasundarapalya Main Road, adjacent 27th Main Road, Haralukunte Village, Sector 2, HSR Layout, Bengaluru, Karnataka - 560102"
  },

  // Endpoint the grievance form POSTs to (backend built separately).
  grievanceApiUrl: "https://api.example.com/grievance",

  resolutionDays: 30,

  // ---- External regulator links --------------------------------------------
  links: {
    rbiCms: "https://cms.rbi.org.in",             // RBI Integrated Ombudsman / CMS
    sachet: "https://sachet.rbi.org.in",          // Sachet portal
    rbiNbfcList: "https://nbfc.rbi.org.in"        // verify NBFC registration
  },

  // RBI Ombudsman toll-free helpline (Grievance Redressal Policy §12).
  rbiOmbudsmanTollFree: "14448",

  // ---- Primary navigation (defined once, rendered by include.js) ------------
  // `Investor Relations` hook intentionally disabled — enable when NCDs/debt issued.
  nav: [
    { label: "About Us",             href: "/about.html" },
    { label: "Partners",             href: "/partners.html" }
    // { label: "Investor Relations", href: "/investor-relations.html", disabled: true }
  ]
};
