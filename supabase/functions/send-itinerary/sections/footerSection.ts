
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawText } from "../utils/pdfUtils.ts";

export const addFooterAndPageNumbers = (pdfDoc: any, font: any, settings?: PdfSettings) => {
  console.log("Adding footer and page numbers...");
  
  // Add custom footer text if provided
  if (settings?.footerText) {
    // Footer appears on every page
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const currentPage = pdfDoc.getPage(i);
      drawText(
        currentPage,
        settings.footerText,
        currentPage.getSize().width / 2 - 100,
        30,
        font,
        10,
        rgb(0.5, 0.5, 0.5)
      );
    }
  }

  // Add page numbers if showPageNumbers is true or undefined (default)
  if (settings?.showPageNumbers !== false) {
    console.log("Adding page numbers...");
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const currentPage = pdfDoc.getPage(i);
      drawText(
        currentPage,
        `Page ${i + 1} of ${pageCount}`,
        currentPage.getSize().width / 2 - 30,
        15,
        font,
        10,
        rgb(0.5, 0.5, 0.5)
      );
    }
  }
  
  console.log("Footer and page numbers added successfully");
};
