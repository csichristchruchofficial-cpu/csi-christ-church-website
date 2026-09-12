"use client";

import { useEffect } from "react";

/**
 * GoogleTranslateCorrector
 * 
 * Automatically monitors the DOM and corrects mistranslations caused by
 * Google Translate / browser auto-translate:
 * - "CSI Christ Temple" -> "CSI Christ Church"
 * - "Christ Temple" -> "Christ Church"
 * - "WELCOME Do" -> "WELCOME TO"
 * - "Gallidetarichi" -> "Kallidaikurichi"
 * - "Clyde churches" -> "Sub Churches"
 * - "Prayer application" -> "Prayer Request"
 */
export default function GoogleTranslateCorrector() {
  useEffect(() => {
    function correctTranslations() {
      // Check if page has been translated or if Google Translate font elements exist
      const isTranslated =
        document.documentElement.classList.contains("translated-ltr") ||
        document.documentElement.classList.contains("translated-rtl") ||
        document.documentElement.getAttribute("lang") === "en" ||
        document.querySelector(".goog-te-banner-frame") !== null ||
        document.querySelector("font[style*='vertical-align']") !== null;

      if (!isTranslated) {
        // Even if class isn't on html yet, check if text nodes contain obvious Google Translate anomalies
        const bodyText = document.body ? document.body.innerText : "";
        if (
          !bodyText.includes("Temple") &&
          !bodyText.includes("WELCOME Do") &&
          !bodyText.includes("Gallidetarichi") &&
          !bodyText.includes("Clyde")
        ) {
          return;
        }
      }

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );

      let node: Node | null = walker.nextNode();
      while (node) {
        const text = node.nodeValue;
        if (text) {
          let updated = text;

          // 1. Fix "CSI Christ Temple" / "Christ Temple" -> "CSI Christ Church" / "Christ Church"
          if (/Temple/i.test(updated)) {
            updated = updated.replace(/CSI\s+Christ\s+Temple/gi, "CSI Christ Church");
            updated = updated.replace(/Christ\s+Temple/gi, "Christ Church");
            updated = updated.replace(/CSI\s+Temple/gi, "CSI Church");
            updated = updated.replace(/\bMain\s+Temple\b/gi, "Main Church");
            updated = updated.replace(/\bBranch\s+Temple\b/gi, "Branch Church");
            updated = updated.replace(/\bSub\s+Temple\b/gi, "Sub Church");
          }

          // 2. Fix "WELCOME Do" -> "WELCOME TO"
          if (/WELCOME\s+Do/i.test(updated)) {
            updated = updated.replace(/WELCOME\s+Do/gi, "WELCOME TO");
            updated = updated.replace(/Welcome\s+Do/gi, "Welcome to");
          }

          // 3. Fix "Gallidetarichi" -> "Kallidaikurichi"
          if (/Gallidetarichi/i.test(updated)) {
            updated = updated.replace(/Gallidetarichi/gi, "Kallidaikurichi");
          }

          // 4. Fix "Clyde churches" -> "Sub Churches"
          if (/Clyde\s+church/i.test(updated)) {
            updated = updated.replace(/Clyde\s+churches/gi, "Sub Churches");
            updated = updated.replace(/Clyde\s+church/gi, "Sub Church");
          }

          if (updated !== text) {
            node.nodeValue = updated;
          }
        }
        node = walker.nextNode();
      }
    }

    // Run initial scan
    correctTranslations();

    // Observe changes created by Google Translate inserting font nodes or translating text
    const observer = new MutationObserver((mutations) => {
      let needsCorrection = false;
      for (const m of mutations) {
        if (
          m.type === "childList" ||
          m.type === "characterData" ||
          (m.type === "attributes" &&
            (m.attributeName === "class" || m.attributeName === "lang"))
        ) {
          needsCorrection = true;
          break;
        }
      }
      if (needsCorrection) {
        correctTranslations();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "lang"],
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Interval checks for async translation engines (Chrome, Edge, Google Translate)
    const intervalId = setInterval(correctTranslations, 500);
    const timeoutId = setTimeout(() => clearInterval(intervalId), 12000);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

