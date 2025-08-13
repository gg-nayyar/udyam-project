// scraper/udyamScraperExtract.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

function waitForEnterPrompt(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // show browser so you can interact (enter OTP)
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // use realistic UA
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
  );

  console.log("Opening Udyam registration page...");
  await page.goto("https://udyamregistration.gov.in/UdyamRegistration.aspx", {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  // Wait for any common Aadhaar input selector to appear (try a few variants)
  const step1Candidates = [
    "#ctl00_ContentPlaceHolder1_txtadharno",
    "#txtAadhaar",
    "input[name*='adhar']",
    "input[id*='adhar']",
  ];
  await page.waitForFunction(
    (selectors) => selectors.some((s) => !!document.querySelector(s)),
    { timeout: 60000 },
    step1Candidates
  );
  console.log("Step 1 (Aadhaar) detected.");

  // Helper function to choose a root container for a step
  async function detectRootForElement(selectors) {
    for (const s of selectors) {
      const exists = await page.$(s);
      if (exists) {
        // try to find a nearby form/table root (tblFirstStep or ancestor)
        const root = await page.evaluateHandle((sel) => {
          const el = document.querySelector(sel);
          if (!el) return document.body;
          // prefer #tblFirstStep or #tblSecondStep if present
          if (document.querySelector("#tblFirstStep")) return document.querySelector("#tblFirstStep");
          if (document.querySelector("#tblSecondStep")) return document.querySelector("#tblSecondStep");
          // else find nearest ancestor <table> or <form> or a container with many inputs
          let anc = el;
          for (let i = 0; i < 6; i++) {
            if (!anc) break;
            if (anc.tagName && /TABLE|FORM|DIV/.test(anc.tagName)) {
              // check if ancestor contains multiple inputs (likely step container)
              const inputs = anc.querySelectorAll("input, select, textarea, button");
              if (inputs.length >= 2) return anc;
            }
            anc = anc.parentElement;
          }
          return el.closest("form") || document.body;
        }, s);
        return root;
      }
    }
    return null;
  }

  // Evaluate extractor inside page context
  async function extractFormMetadata(rootHandle) {
    const result = await page.evaluate(async (root) => {
      // helper to get label text for an element
      function findLabelText(el) {
        if (!el) return null;
        // 1) label[for="id"]
        if (el.id) {
          const lab = document.querySelector(`label[for="${el.id}"]`);
          if (lab && lab.innerText.trim()) return lab.innerText.trim();
        }
        // 2) closest label ancestor
        const pLabel = el.closest("label");
        if (pLabel && pLabel.innerText.trim()) return pLabel.innerText.trim();
        // 3) previous td trick (table layout)
        const td = el.closest("td");
        if (td && td.previousElementSibling && td.previousElementSibling.innerText) {
          return td.previousElementSibling.innerText.trim();
        }
        // 4) aria-label or title
        if (el.getAttribute && el.getAttribute("aria-label")) return el.getAttribute("aria-label").trim();
        if (el.title) return el.title.trim();
        // 5) fallback: placeholder or name
        if (el.placeholder) return el.placeholder.trim();
        if (el.name) return el.name;
        return null;
      }

      // collect inputs
      const inputs = [];
      const selects = [];
      const buttons = [];

      const inputEls = Array.from(root.querySelectorAll("input, textarea"));
      inputEls.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const type = (el.getAttribute("type") || (tag === "textarea" ? "textarea" : "text")).toLowerCase();
        inputs.push({
          tag: tag,
          id: el.id || null,
          name: el.getAttribute("name") || null,
          type: type,
          placeholder: el.getAttribute("placeholder") || null,
          value: el.value || null,
          maxlength: el.getAttribute("maxlength") ? parseInt(el.getAttribute("maxlength")) : null,
          minlength: el.getAttribute("minlength") ? parseInt(el.getAttribute("minlength")) : null,
          required: el.required || el.hasAttribute("required") || false,
          disabled: el.disabled || el.hasAttribute("disabled") || false,
          classList: el.className ? el.className.split(/\s+/) : [],
          label: findLabelText(el),
          validationPattern: el.getAttribute("pattern") || null,
          ariaLabel: el.getAttribute && el.getAttribute("aria-label") || null,
          title: el.title || null
        });
      });

      // collect selects (dropdowns)
      const selectEls = Array.from(root.querySelectorAll("select"));
      selectEls.forEach((sel) => {
        const options = Array.from(sel.options).map((opt) => ({
          value: opt.value,
          text: opt.text,
          selected: opt.selected
        }));
        selects.push({
          id: sel.id || null,
          name: sel.getAttribute("name") || null,
          label: findLabelText(sel),
          options
        });
      });

      // collect buttons (including input[type=button|submit])
      const buttonEls = Array.from(root.querySelectorAll("button, input[type='button'], input[type='submit']"));
      buttonEls.forEach((btn) => {
        const text = (btn.innerText && btn.innerText.trim()) || (btn.getAttribute("value") || null);
        buttons.push({
          id: btn.id || null,
          name: btn.getAttribute("name") || null,
          text,
          type: btn.getAttribute("type") || (btn.tagName.toLowerCase() === "button" ? "button" : null),
          classList: btn.className ? btn.className.split(/\s+/) : []
        });
      });

      return { inputs, selects, buttons };
    }, rootHandle);

    return result;
  }

  // find root for step1 based on candidate selectors
  const step1RootHandle = await detectRootForElement(step1Candidates);
  let step1Data = { inputs: [], selects: [], buttons: [] };

  try {
    if (step1RootHandle) {
      step1Data = await extractFormMetadata(step1RootHandle);
      console.log("Step 1 metadata extracted.");
    } else {
      console.warn("Could not determine Step 1 root container; extracting from body as fallback.");
      const bodyHandle = await page.$("body");
      step1Data = await extractFormMetadata(bodyHandle);
    }
  } catch (e) {
    console.error("Error extracting Step 1:", e);
  }

  // Extract validation patterns from scripts (page context)
  const extractedValidationPatterns = await page.evaluate(async () => {
    const scripts = Array.from(document.querySelectorAll("script"));
    // fetch remote script text when possible, otherwise use inline text
    const scriptContents = await Promise.all(
      scripts.map(async (s) => {
        try {
          if (s.src) {
            // attempt to fetch script source
            const resp = await fetch(s.src, { mode: "cors" }).catch(() => null);
            if (resp && resp.ok) {
              const text = await resp.text();
              return text;
            }
            // fallback to inline text if fetch fails
            return s.innerText || "";
          } else {
            return s.innerText || "";
          }
        } catch (err) {
          return s.innerText || "";
        }
      })
    );
    const big = scriptContents.join("\n");

    const patterns = {};

    // Try to detect Aadhaar-like regexes
    if (/\b\d{12}\b/.test(big) || /[0-9]{12}/.test(big) || /\^[0-9]{12}\$/.test(big)) {
      patterns.aadhaar = "^[0-9]{12}$";
    }
    // Try to detect PAN-like regexes
    if (/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(big) || /\^[A-Z]{5}[0-9]{4}[A-Z]\$/.test(big)) {
      patterns.pan = "^[A-Z]{5}[0-9]{4}[A-Z]$";
    }

    // Search for explicit regex literals like /.../ or RegExp("...")
    const regexLiterals = [];
    const literalMatches = big.match(/\/[^\n\/]+\/[gimsuy]?/g);
    if (literalMatches) regexLiterals.push(...literalMatches);
    const regExpCtor = [...big.matchAll(/RegExp\((["'`])(.+?)\1\)/g)];
    if (regExpCtor.length) regExpCtor.forEach((m) => regexLiterals.push(m[2]));

    patterns.rawRegexes = Array.from(new Set(regexLiterals)).slice(0, 50); // deduplicate & limit

    return patterns;
  });

  // Save step1 snapshot now
  const output = {
    metadataExtractedAt: new Date().toISOString(),
    step1: step1Data,
    extractedValidationPatterns,
    step2: null,
  };

  fs.writeFileSync("udyam_form_schema_step1.json", JSON.stringify(output, null, 2));
  console.log("Saved Step 1 metadata -> udyam_form_schema_step1.json");

  // Ask user to proceed to Step 2 manually (OTP)
  console.log(
    "\nPlease complete the OTP flow in the opened browser (enter OTP, submit). " +
      "Once the PAN/Organisation form (Step 2) is visible, return here and press ENTER."
  );
  await waitForEnterPrompt("Press ENTER when you've completed OTP and Step 2 is visible: ");

  // Wait for Step 2 to be present (try common selectors), allow some time
  const step2Selectors = [
    "#tblSecondStep",
    "#ctl00_ContentPlaceHolder1_ddlOrganisationType",
    "select[id*=Organisation]",
    "input[id*='Pan']",
    "input[id*='PAN']",
    "input[id*=txtPan]",
  ];

  // Wait for any of these to be present
  await page.waitForFunction(
    (sels) => sels.some((s) => !!document.querySelector(s)),
    { timeout: 120000 },
    step2Selectors
  );

  console.log("Detected Step 2 presence in the page. Extracting metadata...");

  // Choose root for Step 2
  let step2RootHandle = await page.$("#tblSecondStep");
  if (!step2RootHandle) {
    // pick a detected selector
    for (const s of step2Selectors) {
      const h = await page.$(s);
      if (h) {
        // find an ancestor form/table as root
        step2RootHandle = await page.evaluateHandle(
          (el) => {
            let anc = el;
            for (let i = 0; i < 6; i++) {
              if (!anc) break;
              const inputs = anc.querySelectorAll("input, select, textarea, button");
              if (inputs.length >= 2) return anc;
              anc = anc.parentElement;
            }
            return el.closest("form") || document.body;
          },
          h
        );
        break;
      }
    }
  }

  if (!step2RootHandle) {
    step2RootHandle = await page.$("body");
  }

  let step2Data = { inputs: [], selects: [], buttons: [] };
  try {
    step2Data = await extractFormMetadata(step2RootHandle);
    console.log("Step 2 metadata extracted.");
  } catch (e) {
    console.error("Error extracting Step 2:", e);
  }

  // Combine results and save final
  const final = {
    metadataExtractedAt: new Date().toISOString(),
    step1: step1Data,
    step2: step2Data,
    extractedValidationPatterns,
  };

  fs.writeFileSync("udyam_form_schema.json", JSON.stringify(final, null, 2));
  console.log("✅ Full form schema saved to udyam_form_schema.json");
  console.log("Output preview:");
  console.log(JSON.stringify(final, null, 2).slice(0, 1000) + "..."); // brief preview

  await browser.close();
  const outputPath = path.join(process.cwd(), 'shared', 'udyam_form_schema.json');
  
  // Ensure folder exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // Save JSON
  fs.writeFileSync(outputPath, JSON.stringify(final, null, 2), 'utf-8');
  
  console.log(`✅ Schema saved to: ${outputPath}`);
  process.exit(0);
})().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
