# Country tax-pack research — 2026-09-23

This note records the scope and primary sources used to select four country
artifacts and defer four complicated countries on 2026-09-23. It is
implementation guidance, not tax advice.
Merchants remain responsible for registration, exemptions, product
classification, local taxes, and changes after the pack's effective date.

## Scope comparison

The latest IMF World Economic Outlook available on the research date is the
April 2026 database. Using nominal GDP, the top ten are the United States,
China, Germany, Japan, the United Kingdom, India, France, Italy, Russia, and
Canada. FloCafe already had packs for the United States, Japan, the United
Kingdom, India, and France. This release set adds the straightforward Germany
and Italy profiles, plus the specifically requested Australia and Vietnam
(ticket `RL5-NW5N`). China, Russia, Canada, and Brazil (ticket `2X9-KQZ6`) are
documented below but deliberately have no release artifacts.

IMF source: <https://data.imf.org/Datasets/WEO>

## Built profiles

| Country | Pack behavior | Primary sources |
| --- | --- | --- |
| Australia | Defaults restaurant, dine-in, hot takeaway, and other taxable food/beverages to 10% GST; includes a manual 0% category for qualifying GST-free off-premises food. | [Australian Taxation Office detailed food list](https://www.ato.gov.au/law/view/document?PiT=99991231235958&locid=%27GII%2FGSTIIFL1%2FNAT%2FATO%27) |
| Germany | Uses 7% VAT for restaurant and catering food from 2026-01-01 and 19% for beverages. | [German Federal Ministry of Finance guidance dated 2025-12-22](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-12-22-verpflegungsdienstleistungen.html) |
| Italy | Uses 10% IVA for restaurant supplies of food and beverages. Retail/takeaway goods can require product-specific classification and are outside this restaurant default. | [Agenzia delle Entrate response 231/2022, citing Table A, Part III, no. 121](https://www.agenziaentrate.gov.it/portale/documents/20143/4335071/Risposta_n_231_2022.pdf) |
| Vietnam | Uses the temporary 8% VAT rate for eligible food and restaurant supplies from 2025-07-01 through 2026-12-31 and 10% VAT for alcohol and other excise-taxed goods excluded from the reduction. Product-specific special consumption tax is outside this VAT pack. | [Government Decree 174/2025/NĐ-CP](https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-174-2025-nd-cp-45374.htm), [Ministry of Finance explanation](https://portal.mof.gov.vn/hoidapcstc/home/cthoidap/155493) |

## Researched but deferred

| Country | Why no artifact is being released | Primary sources |
| --- | --- | --- |
| Brazil | The 2026 CBS/IBS test fields coexist with legacy ICMS/ISS/PIS/COFINS. Restaurant reductions, excluded goods, collection relief, state/municipal rates, and taxpayer regimes cannot be represented safely by one national default. | [Receita Federal transition overview](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda), [2026 guidance](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/orientacoes-2026), [Complementary Law 214, arts. 273–276](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm) |
| Canada | Restaurant supplies use 5%, 13%, 14%, or 15% GST/HST based on place of supply, while non-HST provinces can also impose QST/PST. A country-only pack cannot infer the merchant's province or safely supply the full combined tax. | [Canada Revenue Agency rates and place-of-supply rules](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html), [basic groceries memorandum](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/4-3/basic-groceries.html) |
| China | General taxpayers use 6% for catering services, but qualifying small-scale taxpayers can be exempt below the sales threshold or use a temporary 1% rate through 2027. Taxpayer status and threshold eligibility cannot be inferred from the sale. | [VAT Law, arts. 9–13](https://www.npc.gov.cn/npc/c2/c30834/202412/t20241225_442038.html), [Ministry of Finance and State Taxation Administration 2026 transition notice](https://www.mof.gov.cn/jrttts/202602/t20260203_3983175.htm) |
| Russia | The 2026 standard rate is 22%, qualifying food goods may use 10%, and catering services may be exempt only when merchant-specific revenue, activity-share, payroll, and regime conditions are satisfied. | [Federal Tax Service 2026 tax changes](https://www.nalog.gov.ru/new2026/), [Federal Tax Service catering exemption guidance](https://www.nalog.gov.ru/rn25/news/activities_fts/16630226/) |

## Compatibility and deferral policy

The built profiles declare `minFloVersion: 3.2.0`, the first FloCafe version
line containing the wrapped `country-tax-pack-plugin` loader. The four deferred
countries should not receive artifacts until FloCafe has a
jurisdiction/taxpayer-profile mechanism capable of selecting their rules.
