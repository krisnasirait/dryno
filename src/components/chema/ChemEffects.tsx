"use client";

import { useEffect } from "react";

/**
 * Featherweight AOS replacement (~1KB, zero deps).
 * Honors existing `data-aos="fade-up|fade-left"` attributes with
 * duration 600ms / ease-in-out parity, once:true, reduced-motion safe.
 * Hidden state is JS-gated (html.js-anim) so no-JS still shows content.
 */
export default function ChemEffects() {
  useEffect(() => {
    document.documentElement.classList.add("js-anim");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll<HTMLElement>("[data-aos]")
        .forEach((el) => el.classList.add("aos-in"));
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) {
              en.target.classList.add("aos-in");
              io.unobserve(en.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      let pending = false;
      const watch = () => {
        const fresh = document.querySelectorAll<HTMLElement>(
          "[data-aos]:not(.aos-in)"
        );
        fresh.forEach((el) => io.observe(el));
        // Nothing left to reveal — stop observing entirely.
        if (fresh.length === 0) {
          io.disconnect();
          mo.disconnect();
        }
      };
      watch();
      // CMS content can swap in late nodes — observe, cheap.
      const mo = new MutationObserver(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          watch();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });

      const onScroll = () => {
        if (window.scrollY > 0) document.body.classList.add("scrolled");
        else document.body.classList.remove("scrolled");
        const stats = document.querySelector(".stats-content");
        const el = document.querySelector(".element-on-scroll");
        if (stats instanceof HTMLElement && el) {
          const top =
            stats.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY >= top + stats.offsetHeight - 500)
            el.classList.add("active");
          else el.classList.remove("active");
        }
      };
      let ticking = false;
      const onScrollRaf = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          onScroll();
        });
      };
      window.addEventListener("scroll", onScrollRaf, { passive: true });
      onScroll();
      return () => {
        io.disconnect();
        mo.disconnect();
        window.removeEventListener("scroll", onScrollRaf);
      };
    } else {
      document
        .querySelectorAll<HTMLElement>("[data-aos]")
        .forEach((el) => el.classList.add("aos-in"));
    }
  }, []);
  return null;
}
