Drop your real photos here, named after the keys in src/data/media.mjs.

  hero-main.jpg
  club-fitness-hamouchi-1.jpg
  discipline-boxe.jpg
  coach-khalid-hamouchi.jpg
  ...

Any of .jpg .jpeg .png .webp .heic .avif works. Then run:

  npm run media && npm run build

Files in this folder are the originals and are never served directly: the
pipeline crops, resizes, converts and strips metadata into ../  Keep the
originals here (or in your own backup) so you can regenerate at any time.

Use the largest version you have. Instagram and Facebook re-compress what they
serve, so download the original from your phone or camera rather than saving the
image from the app.
