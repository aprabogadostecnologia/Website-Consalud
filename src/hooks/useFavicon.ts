import { useEffect } from "react";

/**
 * Cambia el favicon mientras el componente que lo invoca está montado,
 * y restaura el favicon original al desmontarse (p. ej. al salir de la sección).
 */
export function useFavicon(href: string) {
  useEffect(() => {
    const existingLinks = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']")
    );
    const originalHrefs = existingLinks.map((link) => link.getAttribute("href"));

    const tempLink = document.createElement("link");
    tempLink.rel = "icon";
    tempLink.type = "image/svg+xml";
    tempLink.href = href;
    document.head.appendChild(tempLink);
    existingLinks.forEach((link) => link.setAttribute("href", href));

    return () => {
      existingLinks.forEach((link, i) => {
        const original = originalHrefs[i];
        if (original) link.setAttribute("href", original);
      });
      document.head.removeChild(tempLink);
    };
  }, [href]);
}
