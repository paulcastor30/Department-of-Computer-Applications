export function LearningResourceCredits() {
  return <aside aria-labelledby="learning-credits-title" className="mt-8 rounded-md border border-border bg-background p-5 text-sm leading-6">
    <h3 id="learning-credits-title" className="text-lg font-semibold">Source, attribution & reuse</h3>
    <p className="mt-2">The imported collection is adapted from <a className="text-link" href="https://github.com/m3y54m/Embedded-Engineering-Roadmap/blob/0738fcbd8fa3f3382d6958cc851829543475cdba/README.md">Embedded Systems Engineering Roadmap by m3y54m and contributors</a>, licensed under <a className="text-link" href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</a>. This adaptation is also available under CC BY-SA 4.0.</p>
    <p className="mt-2">Changes: resource entries have been reorganized into BSCA learning topics; symbols have become text labels; search, filters, and pagination have been added; one source link without a scheme has been given an HTTPS prefix. Additional starter guidance and IoT references are identified separately. The original engineering career sequence and diagram are not reproduced.</p>
    <p className="mt-2">Source version: <code>0738fcb</code> · Imported October 9, 2026. This is a saved collection, not a live feed. Attribution links let you check the original; the collection can be browsed here.</p>
    <p className="mt-2">The authors do not endorse or sponsor this department website. The original repository is not affiliated with or financially supported by any content creator, publisher, or organization, and does not endorse or recommend specific paid resources.</p>
    <p className="mt-2">Licensed material is provided without warranties. Books, articles, videos, and courses linked from the collection retain their providers’ own rights and access conditions. The CC BY-SA notice applies to the adapted collection, not university branding or unrelated website content.</p>
    <nav aria-label="Learning resource source downloads" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
      <a className="text-link inline-flex min-h-11 items-center" href="/learning-resources/collection.json" download>Download the adapted collection (JSON)</a>
      <a className="text-link inline-flex min-h-11 items-center" href="/learning-resources/LICENSE.txt">Read the full license</a>
      <a className="text-link inline-flex min-h-11 items-center" href="/learning-resources/ATTRIBUTION.txt">Read attribution and change notes</a>
    </nav>
  </aside>;
}
