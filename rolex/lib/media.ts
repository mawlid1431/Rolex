/** A media entry used by picture / video components. */
export type Media = {
  id: string
  src: string | null
  portraitSrc: string | null
  width?: number
  height?: number
  portraitWidth?: number
  portraitHeight?: number
}

/** Fallback local assets when a media id has no direct file. */
const SUBSTITUTES: Record<string, string> = {
  // Perpetual Padellone
  "rolex-new-watches-2026-padellone-moonphase-disc-autoplay-posterframe": "/images/derived/padellone-moonphase-disc-posterframe.webp",
  "rolex-new-watches-2026-padellone-movement-autoplay-posterframe": "/images/derived/padellone-movement-posterframe.webp",
  "rolex-new-watches-2026-padellone-features-background": "/images/rolex-new-watches-2026-padellone-m53505-0003-video-player-expand-background.avif",
  "rolex-new-watches-2026-padellone-case-aesthetics-m53505-0003": "/images/derived/padellone-case-aesthetics.webp",
  "rolex-new-watches-2026-padellone-calibre-7190": "/images/derived/padellone-calibre-7190.webp",
  "rolex-new-watches-2026-padellone-moon-calendar": "/images/derived/padellone-moon-calendar.webp",
  "rolex-new-watches-2026-padellone-superlative-chronometer": "/images/derived/padellone-superlative-chronometer.webp",
  "rolex-new-watches-2026-padellone-m53505-0003-film-posterframe": "/images/rolex-new-watches-2026-padellone-m53505-0003-autoplay-posterframe.avif",
  "rolex-new-watches-2026-padellone-movement-film-posterframe": "/images/derived/padellone-movement-posterframe.webp",
  "roller-loop-m53505-0003_2608stj_0003-transparent-case-back": "/images/derived/padellone-roller-01-transparent-case-back.webp",
  "roller-loop-m53505-0003_2608stj_0004-beauty-shot": "/images/derived/padellone-roller-02-beauty-shot.webp",
  "roller-loop-m53505-0003_2608stj_0005-and-m53505-0003_2608stj_0007": "/images/derived/padellone-roller-03-dial.webp",
  "roller-loop-m53506-0002_2608stj_0002-beauty-shot": "/images/derived/padellone-roller-04-beauty-shot.webp",
  "roller-loop-m53506-0002_2608stj_0003-and-m53506-0002_2608stj_0004": "/images/derived/padellone-roller-05-strap.webp",
  "roller-loop-m53505-0002_2608stj_0001-upright-beauty-shot": "/images/derived/padellone-roller-06-upright.webp",
  "roller-loop-m53505-0002_2608stj_0003-and-m53505-0002_2608stj_0004": "/images/derived/padellone-roller-07-profile.webp",
  "roller-loop-m53505-0002_2608stj_0004-wristshot": "/images/derived/padellone-roller-08-wrist.webp",
  "new-watches-2026-perpetual-padellone-navigation_m53505-0003": "/images/new-watches-2026-perpetual-padellone-navigation_m53505-0003_2608stj_0005.avif",
  "new-watches-2026-yacht-master-ii-navigation_m126680-0001": "/images/professional-watches-yacht-master-ii-navigation-portrait.avif",
  "new-watches-2026-day-date-navigation_m228235jg-0001": "/images/classic-watches-day-date-naviguation-square.avif",
  "new-watches-2026-cosmograph-daytona-navigation_m126502-0001": "/images/professional-watches-cosmograph-daytona-naviguation-square.avif",
  "new-watches-2026-oyster-perpetual-41-navigation_m134303-0001": "/images/classic-watches-oyster-perpetual-naviguation-portrait.avif",
  "new-watches-2026-oyster-perpetual-36-navigation_m126000-0016": "/images/classic-watches-oyster-perpetual-naviguation-portrait.avif",
  "new-watches-2026-oyster-perpetual-28-navigation_m276208-0002": "/images/classic-watches-lady-datejust-navigation-square.avif",
  "new-watches-2026-datejust-41-navigation_m126334-0033": "/images/classic-watches-datejust-navigation-portrait.avif",

  // Watchmaking
  "watchmaking-hub-2026-dual-grid-wmapplique_2212cw_0002_v2": "/images/derived/watchmaking-our-vision.webp",
  "watchmaking-hub-2026-dual-grid-1931_oysterperpetual_2212th_0001": "/images/derived/watchmaking-our-signature.webp",
  "rolex-watchmaking-seven-pillars-07-durability-elmt_2603fg_054": "/images/derived/watchmaking-seven-pillars-07-durability.webp",

  // Navigation (main menu + sub navigation)
  "professional-watches-air-king-navigation": "/images/model-cover-background.avif",
  "classic-watches-1908-m52508-0008-navigation": "/images/model-cover-background.avif",
  "rolex-main-navigation-watches-and-accessories-accessories-square-navigation_rolexcufflinks_2312jva_002_rvb": "/images/model-cover-background.avif",
  "rolex-main-navigation-oyster-story-bento-landscape-m126233-0015_first_oyster_octagonal_1926_2604_0001_ecirgb": "/images/derived/watchmaking-oyster-story.webp",
  "rolex-main-navigation-oyster-story-the-film-navigation-bento-landscape-951713288_cmyk": "/images/rolex-watchmaking-seven-pillars-02-waterproofness-wmquality_2201fl_006_v2.avif",
  "rolex-main-navigation-about-rolex-sustainability-navigation_v4_gettyimages-85758322": "/images/about-rolex-sustainability-cover-v4_gettyimages-85758322.avif",
  "rolex-main-navigation-about-rolex-the-man-behind-the-crown-navigation_a_stroke_of_genius": "/images/watchmaking-hub-2026-made-in-switzeland-bie_2509cw_056_v03.avif",
  "rolex-main-navigation-about-rolex-history-of-rolex-navigation_1945_oyster_perpetual_datejust_1802jva_m126333_0010_1802jva_002_r": "/images/rolex-watchmaking-seven-pillars-04-autonomy-sav_geneve_19dh_026_xl.avif",
  "rolex-main-navigation-sports-and-planet-rolex-and-sports-navigation-wim22jj_06392_r2": "/images/homepage-navigation-sailgp-geneva-square.avif",
  "rolex-main-navigation-sports-and-planet-perpetual-arts-navigation_perp_music_paris_20at_0059_r": "/images/rolex-four-seasons-navigation-featured.avif",
  "rolex-main-navigation-sports-and-planet-perpetual-planet-navigation_dji_0270-panorama": "/images/about-rolex-sustainability-our-perpetual-initiatives-push-v2.avif",
  "buying-and-servicing-navigation-elmt_2603fg_041": "/images/m126688-0001.avif",
  "rolex-main-navigation-rolex-retailers-rolex-certified-pre-owned-navigation_m16628_2403ac_003": "/images/m124060-0001.avif",
  "care-and-servicing-servicing-your-rolex-navigation_2301_rolex_sav_retailers_175_controle-final_fermoir_v2": "/images/rolex-watchmaking-seven-pillars-06-reliability-elmt_2603fg_023.avif",
  "care-and-servicing-your-rolex-caring-for-your-rolex-how-to-use-your-rolex-navigation_manippos_2002pd_001": "/images/rolex-watchmaking-seven-pillars-03-seff-winding-wmmvmt_2212jb_0002_a.avif",
  "professional-watches-yacht-master-II-features-navigation__m126680-0001": "/images/m126688-0001-51090760.avif",
  "professional-watches-yacht-master-II-myth-navigation": "/images/intro-background-yacht-master-ii.avif",
  "about-rolex-sustainability-sustainability-navigation_gettyimages-85758322_extended2": "/images/about-rolex-sustainability-cover-v4_gettyimages-85758322.avif",
  "about-rolex-sustainability-at-rolex-navigation": "/images/about-rolex-sustainability-sustainability-report-push_ext05_office-entrance_b6.avif",
  "about-rolex-sustainability-our-areas-of-action-navigation_wmfinalassembly_2201fl_003_v2": "/images/rolex-watchmaking-our-values-navigation-wmfinalassembly_2201fl_003_v2-portrait.avif",
  "about-rolex-sustainability-the-traceability-of-our-raw-materials-navigation_m228238-0042_2106jva_002": "/images/about-rolex-csr-sustainability-gas-emissions-v2.avif",
  "about-rolex-sustainability-a-unique-model-for-gold-navigation_wm_gold_2503fm_0010": "/images/derived/watchmaking-seven-pillars-07-durability.webp",
  "about-rolex-sustainability-file-a-report-navigation_centreformation_18ra_276": "/images/watchmaking-hub-2026-made-in-switzeland-bie_2509cw_056_v03.avif",
  "about-rolex-sustainability-italy-packaging-disposal-navigation_rolexapprentices_2210ra_0326r": "/images/about-rolex-sustainability-our-perpetual-initiatives-push-v2.avif",
  "about-rolex-sustainability-our-perpetual-inititatives-navigation": "/images/about-rolex-sustainability-our-perpetual-initiatives-push-v2.avif",
  "about-rolex-sustainability-training-at-rolex-navigation_rolexapprentices_2210ra_0123": "/images/rolex-watchmaking-seven-pillars-01-precision-wmspiral_2212cw_0003_v2.avif",
}

const SUFFIX = /([-_](portrait|landscape|square|pop-in|1|2))+$/

function substitute(id?: string | null) {
  if (!id) return null
  const base = id.split("/").pop() ?? id
  const stripped = base.replace(SUFFIX, "")
  const key = Object.keys(SUBSTITUTES).find((k) => base === k || stripped === k || stripped.endsWith(k))
  return key ? SUBSTITUTES[key] : null
}

export function mediaSrc(media?: Media | null) {
  if (!media) return null
  return media.src ?? substitute(media.id)
}

export function mediaPortraitSrc(media?: Media | null) {
  if (!media) return null
  return media.portraitSrc ?? media.src ?? substitute(media.id)
}
