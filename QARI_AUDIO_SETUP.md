# Qari Correction Audio (Juz Amma Pilot)

This plays the real reciter's own audio for a word you got wrong, isolated
to just that word, instead of a generic tone — for Juz Amma only, for now.

## Setup required from you: none

This used to need a separate manual step. It doesn't anymore — fetching
the word-timing data now happens automatically as part of your normal
build, the exact same way you've always built the app (upload files,
push, let Actions run, download the APK). There's no extra button to
click and no script to run yourself.

If you're curious what's happening under the hood: right after checkout,
the build now runs a small Python script that downloads licensed timing
data (CC-BY 4.0, from the open-source
[quran-align](https://github.com/cpfair/quran-align) project) for Juz
Amma and bundles it into the app. If that step ever fails for any reason
(e.g. a temporary network hiccup on GitHub's side), the build **still
continues normally** — the app just falls back to the tone cue
everywhere, exactly like before. It can never break your build.

## How it works once built in

- The timing data (tiny) ships inside the app
- The first time you make a mistake on a given ayah, that ayah's real
  audio downloads once from a public Quran audio archive and is cached
  on your phone
- The app plays just the correct word, cut precisely from that real
  recording
- Outside Juz Amma, or with no internet, it automatically falls back to
  the tone + vibration cue

## Testing checklist

- [ ] Recite a Juz Amma verse and make a deliberate mistake — you should
      hear the real reciter say just that word, not a beep
- [ ] The very first mistake on a given ayah may have a brief pause
      (downloading that ayah's audio); repeat mistakes on the same ayah
      should be instant afterward
- [ ] Try airplane mode — should fall back to the tone cue, not crash
- [ ] Try a mistake outside Juz Amma — should use the tone cue

## Expanding beyond Juz Amma later

The script can be adapted to cover the full Quran (removing the Juz Amma
filter), but that means the app will download/cache audio much more
broadly — worth deciding on a storage strategy (e.g. a per-Surah
"download for offline use" option) before scaling this up, rather than
assuming unlimited downloads are fine at full scale.
