const { t } = require('../utils/i18n');

// Locale middleware: read ?lang=ar|en, default to 'ar'
module.exports = function locale(req, res, next) {
  const q = (req.query && typeof req.query.lang === 'string') ? req.query.lang : undefined;

  const normalizeLang = (val) => {
    if (!val) return 'ar';
    const s = String(val).trim().toLowerCase();

    if (s.startsWith('en')) return 'en';
    if (s.startsWith('ar')) return 'ar';
    return 'ar';
  };

  const lang = normalizeLang(q);
  req.lang = lang;
  req.t = (key, params) => t(lang, key, params);
  next();
};
