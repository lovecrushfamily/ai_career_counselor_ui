import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { MarketSnapshot, RangeKey } from "@/lib/marketData";
import { APP_NAME } from "@/lib/brand";

const RANGE_LABEL: Record<RangeKey, string> = {
  week: "Weekly",
  month: "Monthly",
  quarter: "Quarterly",
  year: "Annual",
};

/**
 * Snapshot dashboard DOM → PDF + thêm trang text với số liệu aggregate.
 * KHÔNG chứa raw JD — chỉ aggregate (đúng tinh thần sản phẩm).
 */
export async function exportDashboardPdf(opts: {
  element: HTMLElement;
  snapshot: MarketSnapshot;
  lang: "vi" | "en";
}) {
  const { element, snapshot, lang } = opts;

  const canvas = await html2canvas(element, {
    backgroundColor: getComputedStyle(document.body).backgroundColor || "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 32;

  // ---- Cover ----
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 110, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(APP_NAME, margin, 50);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(
    lang === "vi"
      ? `Báo cáo thị trường tuyển dụng — ${RANGE_LABEL[snapshot.range]}`
      : `Job market report — ${RANGE_LABEL[snapshot.range]}`,
    margin,
    72
  );
  pdf.setFontSize(9);
  pdf.text(
    `Generated: ${new Date(snapshot.generatedAt).toLocaleString()}`,
    margin,
    90
  );

  // ---- KPIs ----
  pdf.setTextColor(15, 23, 42);
  let y = 140;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(lang === "vi" ? "Chỉ số chính" : "Key indicators", margin, y);
  y += 18;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const kpis: [string, string][] = [
    [lang === "vi" ? "Tổng JD aggregate" : "Total aggregate JDs", snapshot.totalJds.toLocaleString()],
    [lang === "vi" ? "Biến động vs kỳ trước" : "Change vs prev. period", `${snapshot.deltaPct >= 0 ? "+" : ""}${snapshot.deltaPct}%`],
    [lang === "vi" ? "Công ty mới đăng tuyển" : "New companies posting", `${snapshot.newCompanies}`],
    [lang === "vi" ? "Mức lương trung vị" : "Median salary", snapshot.medianSalary],
    [lang === "vi" ? "Kỹ năng tăng nhanh nhất" : "Top growing skill", `${snapshot.topSkill.name} (+${snapshot.topSkill.delta}%)`],
    [lang === "vi" ? "Lĩnh vực dẫn đầu" : "Leading industry", `${snapshot.topField.name} (+${snapshot.topField.delta}%)`],
  ];
  for (const [k, v] of kpis) {
    pdf.text(`• ${k}:`, margin, y);
    pdf.setFont("helvetica", "bold");
    pdf.text(v, margin + 200, y);
    pdf.setFont("helvetica", "normal");
    y += 16;
  }

  // ---- Snapshot image ----
  y += 12;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const fitted = Math.min(imgHeight, pageHeight - y - margin - 30);
  pdf.addImage(imgData, "PNG", margin, y, imgWidth, fitted);

  // ---- New page: tables ----
  pdf.addPage();
  y = margin + 10;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(lang === "vi" ? "Nền tảng tuyển dụng" : "Recruitment platforms", margin, y);
  y += 16;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  for (const p of snapshot.platforms) {
    pdf.text(`${p.name}`, margin, y);
    pdf.text(`${p.share}% · ${p.jds.toLocaleString()} JDs · ${p.delta >= 0 ? "+" : ""}${p.delta}%`, margin + 200, y);
    y += 14;
  }

  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(lang === "vi" ? "Top công ty" : "Top companies", margin, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  for (const c of snapshot.companies) {
    pdf.text(`${c.name} — ${c.industry}`, margin, y);
    pdf.text(`${c.jds} JDs · ${c.delta >= 0 ? "+" : ""}${c.delta}%`, margin + 280, y);
    y += 14;
    if (y > pageHeight - margin) { pdf.addPage(); y = margin + 10; }
  }

  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(lang === "vi" ? "Lĩnh vực / Ngành" : "Industries", margin, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  for (const ind of snapshot.industries) {
    pdf.text(`${ind.name}`, margin, y);
    pdf.text(`${ind.jds.toLocaleString()} JDs · ${ind.delta >= 0 ? "+" : ""}${ind.delta}%`, margin + 200, y);
    y += 14;
  }

  // ---- Footer note ----
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  pdf.text(
    lang === "vi"
      ? "Aggregate-only · Không lưu trữ JD gốc · Nguồn: TopCV, VietnamWorks, ITviec, LinkedIn VN, Glints"
      : "Aggregate-only · No raw JD stored · Sources: TopCV, VietnamWorks, ITviec, LinkedIn VN, Glints",
    margin,
    pageHeight - 18
  );

  const fname = `market-report-${snapshot.range}-${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fname);
}