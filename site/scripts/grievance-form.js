/* =============================================================================
   grievance-form.js — client-side validation + POST for the grievance form.
   RBI requires an on-site complaint facility (Digital Lending Directions 2025,
   Para 11). Posts JSON to window.SHUHARI.grievanceApiUrl. No data is stored
   client-side (no localStorage). See CLAUDE.md §9.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("grievance-form");
    if (!form) return;

    var C = window.SHUHARI || {};
    var note = document.getElementById("form-note");
    var submitBtn = form.querySelector('button[type="submit"]');

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phoneRe = /^[0-9+\-\s()]{7,15}$/; // lenient international-ish

    // Per-field validators. Return "" when valid, else the error message.
    var validators = {
      fullName: function (v) { return v.trim() ? "" : "Please enter your full name."; },
      email: function (v) {
        if (!v.trim()) return "Please enter your email address.";
        return emailRe.test(v.trim()) ? "" : "Please enter a valid email address.";
      },
      phone: function (v) {
        if (!v.trim()) return "Please enter your phone number.";
        return phoneRe.test(v.trim()) ? "" : "Please enter a valid phone number.";
      },
      category: function (v) { return v ? "" : "Please select a category."; },
      subject: function (v) { return v.trim() ? "" : "Please enter a subject."; },
      message: function (v) {
        if (!v.trim()) return "Please describe your complaint.";
        return v.trim().length >= 10 ? "" : "Please provide a little more detail (min. 10 characters).";
      },
      consent: function (v, el) { return el.checked ? "" : "Please provide your consent to proceed."; }
    };

    function fieldEl(name) { return form.elements[name]; }
    function errorEl(name) { return form.querySelector('[data-error-for="' + name + '"]'); }
    function wrapEl(el) { return el.closest(".form-field"); }

    function setError(name, msg) {
      var el = fieldEl(name), err = errorEl(name), wrap = el && wrapEl(el);
      if (err) err.textContent = msg;
      if (wrap) wrap.classList.toggle("form-field--error", !!msg);
      if (el) el.setAttribute("aria-invalid", msg ? "true" : "false");
    }

    function validateField(name) {
      var el = fieldEl(name);
      if (!el) return true;
      var msg = validators[name](el.value, el);
      setError(name, msg);
      return !msg;
    }

    // Live-clear errors as the user fixes them.
    Object.keys(validators).forEach(function (name) {
      var el = fieldEl(name);
      if (!el) return;
      var evt = (el.type === "checkbox" || el.tagName === "SELECT") ? "change" : "blur";
      el.addEventListener(evt, function () { validateField(name); });
    });

    function showNote(type, html) {
      if (!note) return;
      note.className = "form-note is-visible form-note--" + type;
      note.innerHTML = html;
      note.setAttribute("role", type === "error" ? "alert" : "status");
    }
    function hideNote() { if (note) note.className = "form-note"; }

    function fallbackContact() {
      var g = C.grievanceOfficer || {};
      var email = (g.email && g.email.indexOf("[") === -1) ? g.email : null;
      var phone = (g.phone && g.phone.indexOf("[") === -1) ? g.phone : null;
      if (!email && !phone) return "";
      var bits = [];
      if (email) bits.push('email <a href="mailto:' + email + '">' + email + "</a>");
      if (phone) bits.push('call <a href="tel:' + phone + '">' + phone + "</a>");
      return " In the meantime you can reach our Grievance Officer directly — " + bits.join(" or ") + ".";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideNote();

      // Validate all.
      var ok = Object.keys(validators).map(validateField).every(Boolean);
      if (!ok) {
        showNote("error", "Please correct the highlighted fields and try again.");
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var payload = {
        fullName: fieldEl("fullName").value.trim(),
        email: fieldEl("email").value.trim(),
        phone: fieldEl("phone").value.trim(),
        loanId: (fieldEl("loanId") ? fieldEl("loanId").value.trim() : ""),
        category: fieldEl("category").value,
        subject: fieldEl("subject").value.trim(),
        message: fieldEl("message").value.trim(),
        consent: fieldEl("consent").checked,
        submittedAt: new Date().toISOString()
      };

      // Loading state.
      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Submitting…";

      fetch(C.grievanceApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function (data) {
          var ref = data && (data.referenceId || data.reference || data.id);
          var refLine = ref ? " Your reference number is <strong>" + ref + "</strong>." : "";
          showNote(
            "success",
            "<strong>Your complaint has been received.</strong>" + refLine +
              " We will respond within " + (C.resolutionDays || 30) + " days."
          );
          form.reset();
          Object.keys(validators).forEach(function (n) { setError(n, ""); });
          note.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function (err) {
          console.error("grievance-form submit failed:", err);
          showNote(
            "error",
            "Sorry — we couldn't submit your complaint just now. Please try again." +
              fallbackContact()
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  });
})();
