
const translations = {
  ar: {
    welcome: 'مرحبًا بك في واجهة برمجة تطبيقات التجارة الإلكترونية',
    login_success: 'تم تسجيل الدخول بنجاح',
    product_created: 'تم إنشاء المنتج بنجاح',
    product_deleted: 'تم حذف المنتج بنجاح',
    products_retrieved: 'تم جلب المنتجات بنجاح',
    product_retrieved: 'تم جلب المنتج بنجاح',
    product_updated: 'تم تحديث المنتج بنجاح',
    product_rank_updated: 'تم تحديث ترتيب المنتج بنجاح',
    coupon_created: 'تم إنشاء القسيمة بنجاح',
    coupon_deleted: 'تم حذف القسيمة بنجاح',
    coupons_retrieved: 'تم جلب القسائم بنجاح',
    coupon_retrieved: 'تم جلب القسيمة بنجاح',
    missing_required_fields_name_price: 'الحقول المطلوبة مفقودة: الاسم، السعر',
    no_update_data_provided: 'لم يتم توفير بيانات للتحديث',
    rank_required: 'الترتيب مطلوب',
    validation_error_with_detail: (detail) => `خطأ في التحقق: ${detail}`,
    not_found_with_url: (url) => `لا يمكن العثور على ${url} على هذا الخادم`,
    missing_or_invalid_auth_header: 'رأس التفويض مفقود أو غير صالح',
    no_token_provided: 'تم رفض الوصول. لم يتم توفير رمز.',
    invalid_token: 'رمز غير صالح.',
    access_denied_permissions: 'تم رفض الوصول. ليس لديك الأذونات المطلوبة.',
  },
  en: {
    welcome: 'Welcome to e-commerce API',
    login_success: 'Login success',
    product_created: 'Product created successfully',
    product_deleted: 'Product deleted successfully',
    products_retrieved: 'Products retrieved successfully',
    product_retrieved: 'Product retrieved successfully',
    product_updated: 'Product updated successfully',
    product_rank_updated: 'Product rank updated successfully',
    coupon_created: 'Coupon created successfully',
    coupon_deleted: 'Coupon deleted successfully',
    coupons_retrieved: 'Coupons retrieved successfully',
    coupon_retrieved: 'Coupon retrieved successfully',
    missing_required_fields_name_price: 'Missing required fields: name, price',
    no_update_data_provided: 'No update data provided',
    rank_required: 'Rank is required',
    validation_error_with_detail: (detail) => `Validation error ${detail}`,
    not_found_with_url: (url) => `Cannot find ${url} on this server`,
    missing_or_invalid_auth_header: 'Missing or invalid authorization header',
    no_token_provided: 'Access denied. No token provided.',
    invalid_token: 'Invalid token.',
    access_denied_permissions: 'Access denied. You do not have the required permissions.',
  },
};

const isValidLang = (lang) => (lang === 'ar' || lang === 'en');

function t(lang, key, params) {
  const selected = isValidLang(lang) ? lang : 'ar';
  const table = translations[selected] || translations.ar;
  const value = table[key];
  if (typeof value === 'function') {

    return value(params);
  }
  if (typeof value === 'string') return value;

  return key;
}

module.exports = { t, isValidLang };
