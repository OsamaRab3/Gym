
const translations = {
  ar: {
    welcome: 'مرحبًا بك في واجهة برمجة تطبيقات التجارة الإلكترونية',
    login_success: 'تم تسجيل الدخول بنجاح',
    invalid_email_or_password: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    product_created: 'تم إنشاء المنتج بنجاح',
    product_deleted: 'تم حذف المنتج بنجاح',
    products_retrieved: 'تم جلب المنتجات بنجاح',
    product_retrieved: 'تم جلب المنتج بنجاح',
    product_updated: 'تم تحديث المنتج بنجاح',
    product_rank_updated: 'تم تحديث ترتيب المنتج بنجاح',
    product_not_found: 'المنتج غير موجود',
    
    // Category messages
    category_created: 'تم إنشاء الفئة بنجاح',
    category_retrieved:'تم جلب الفئة بنجاح ',
    category_updated: 'تم تحديث الفئة بنجاح',
    category_deleted: 'تم حذف الفئة بنجاح',
    categories_retrieved: 'تم جلب الفئات بنجاح',
    category_not_found: 'الفئة غير موجودة',
    category_exists: 'هذه الفئة موجودة بالفعل',
    category_name_taken: 'اسم الفئة مستخدم بالفعل',
    category_has_products: 'لا يمكن حذف الفئة لأنها تحتوي على منتجات',

    
    coupon_created: 'تم إنشاء القسيمة بنجاح',
    coupon_deleted: 'تم حذف القسيمة بنجاح',
    coupons_retrieved: 'تم جلب القسائم بنجاح',
    coupon_retrieved: 'تم جلب القسيمة بنجاح',
    coupon_not_found: 'القسيمة غير موجودة',
    coupon_code_exists: 'كود الخصم مستخدم بالفعل',
    coupon_code_required: 'كود الخصم مطلوب',
    coupon_discount_required: 'قيمة الخصم مطلوبة',
    coupon_discount_positive: 'يجب أن تكون قيمة الخصم رقم موجب',
    coupon_valid_to_required: 'تاريخ انتهاء صلاحية القسيمة مطلوب',
    coupon_invalid_type: 'نوع الخصم غير صالح',
    coupon_invalid_dates: 'تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية',
    coupon_product_required: 'معرف المنتج مطلوب',
    coupon_product_not_found: 'المنتج غير موجود',
    missing_required_fields_name_price: 'الحقول المطلوبة مفقودة: الاسم، السعر',
    no_update_data_provided: 'لم يتم توفير بيانات للتحديث',
    rank_required: 'الترتيب مطلوب',
    validation_error_with_detail: (detail) => `خطأ في التحقق: ${detail}`,
    not_found_with_url: (url) => `لا يمكن العثور على ${url} على هذا الخادم`,
    missing_or_invalid_auth_header: 'رأس التفويض مفقود أو غير صالح',
    no_token_provided: 'تم رفض الوصول. لم يتم توفير رمز.',
    invalid_token: 'رمز غير صالح.',
    access_denied_permissions: 'تم رفض الوصول. ليس لديك الأذونات المطلوبة.',

    // Validation messages (auth)
    email_is_required: 'البريد الإلكتروني مطلوب',
    email_must_be_valid: 'يجب أن يكون البريد الإلكتروني صالحًا',
    password_is_required: 'كلمة المرور مطلوبة',
    password_must_be_string: 'يجب أن تكون كلمة المرور نصية',
    password_min_length_6: 'يجب ألا تقل كلمة المرور عن 6 أحرف',

    // Validation messages (product common)
    id_is_required: 'المعرّف مطلوب',
    id_must_be_positive_integer: 'يجب أن يكون المعرف عددًا صحيحًا موجبًا',
    name_is_required: 'الاسم مطلوب',
    name_length: 'يجب أن يكون الاسم بين 2 و 50 حرفًا',
    invalid_id: 'معرّف غير صالح',
    name_must_be_string: 'يجب أن يكون الاسم نصًا',
    name_length_2_100: 'يجب أن يكون طول الاسم بين 2 و100 حرف',
    price_is_required: 'السعر مطلوب',
    price_must_be_positive_number: 'يجب أن يكون السعر رقمًا موجبًا',
    description_must_be_string: 'يجب أن يكون الوصف نصًا',
    description_max_2000: 'يجب ألا يزيد طول الوصف عن 2000 حرف',
    stock_must_be_non_negative_integer: 'يجب أن يكون المخزون عددًا صحيحًا غير سالب',
    discount_must_be_between_0_100: 'يجب أن تكون نسبة الخصم بين 0 و100',
    color_must_be_string: 'يجب أن يكون اللون نصًا',
    color_max_50: 'يجب ألا يزيد طول اللون عن 50 حرفًا',
    manufacturer_must_be_string: 'يجب أن يكون اسم الشركة المصنعة نصًا',
    manufacturer_max_100: 'يجب ألا يزيد طول اسم الشركة المصنعة عن 100 حرف',
    category_name_must_be_string: 'يجب أن يكون اسم الفئة نصًا',
    category_name_length_2_100: 'يجب أن يكون طول اسم الفئة بين 2 و100 حرف',
    image_url_must_be_valid_url: 'يجب أن يكون رابط الصورة عنوان URL صالحًا',
    no_valid_fields_to_update: 'لا توجد حقول صالحة للتحديث',
    rank_is_required: 'الترتيب مطلوب',
    rank_must_be_non_negative_integer: 'يجب أن يكون الترتيب عددًا صحيحًا غير سالب',
    stock_is_required: 'المخزون مطلوب',
    
    // Contact Us Messages
    contact_message_sent: 'تم إرسال رسالتك بنجاح',
    contact_message_failed: 'عذراً، حدث خطأ أثناء إرسال رسالتك',
    contact_form_submission: 'نموذج الاتصال',
    from: 'من',
    subject: 'الموضوع',
    message: 'الرسالة',
    name_is_required: 'الاسم مطلوب',
    name_must_be_string: 'يجب أن يكون الاسم نصاً',
    name_length_2_100: 'يجب أن يكون طول الاسم بين 2 و100 حرف',
    email_is_required: 'البريد الإلكتروني مطلوب',
    email_must_be_valid: 'يجب أن يكون البريد الإلكتروني صالحاً',
    message_is_required: 'الرسالة مطلوبة',
    message_length_6_2000: 'يجب أن يكون طول الرسالة بين 6 و2000 حرف',
    email_sent_from_contact_form: 'تم إرسال هذه الرسالة من نموذج الاتصال الخاص بموقعنا',

    // Order Messages
    order_created: 'تم إنشاء الطلب بنجاح',
    orders_retrieved: 'تم جلب الطلبات بنجاح',
    order_retrieved: 'تم جلب الطلب بنجاح',
    order_updated: 'تم تحديث الطلب بنجاح',
    order_not_found: 'الطلب غير موجود',
    order_status_updated: 'تم تحديث حالة الطلب بنجاح',
    invalid_order_status: 'حالة الطلب غير صالحة',
    
    // Province Messages
    province_created: 'تم إنشاء المحافظة بنجاح',
    province_updated: 'تم تحديث المحافظة بنجاح',
    province_deleted: 'تم حذف المحافظة بنجاح',
    province_retrieved: 'تم جلب بيانات المحافظة بنجاح',
    provinces_retrieved: 'تم جلب المحافظات بنجاح',
    province_not_found: 'المحافظة غير موجودة',
    cannot_delete_province_with_orders: 'لا يمكن حذف محافظة تحتوي على طلبات',
    
    // Delivery Fee Messages
    delivery_fee_updated: 'تم تحديث رسوم التوصيل بنجاح',
    delivery_fee_removed: 'تم إزالة رسوم التوصيل بنجاح',
    delivery_fee_not_found: 'رسوم التوصيل غير موجودة',
    invalid_fee_amount: 'يجب أن تكون قيمة الرسوم رقماً موجباً',
    
    // Order Validation Messages
    province_id_must_be_integer: 'يجب أن يكون معرف المحافظة رقم صحيح',
    first_name_required: 'الاسم الأول مطلوب',
    first_name_length: 'يجب أن يكون طول الاسم الأول بين 2 و50 حرفاً',
    last_name_required: 'اسم العائلة مطلوب',
    last_name_length: 'يجب أن يكون طول اسم العائلة بين 2 و50 حرفاً',
    city_required: 'المدينة مطلوبة',
    city_length: 'يجب أن يكون طول اسم المدينة بين 2 و100 حرف',
    address_required: 'العنوان مطلوب',
    address_length: 'يجب أن يكون طول العنوان بين 5 و255 حرفاً',
    phone_required: 'رقم الهاتف مطلوب',
    invalid_phone_format: 'صيغة رقم الهاتف غير صالحة',
    at_least_one_item_required: 'يجب إضافة منتج واحد على الأقل',
    invalid_items_format: 'تنسيق العناصر غير صالح',
    invalid_order_id: 'معرف الطلب غير صالح',
  },
  en: {
    welcome: 'Welcome to e-commerce API',
    login_success: 'Login success',
    invalid_email_or_password: 'Email or password is not correct',
    product_created: 'Product created successfully',
    product_deleted: 'Product deleted successfully',
    products_retrieved: 'Products retrieved successfully',
    product_retrieved: 'Product retrieved successfully',
    product_updated: 'Product updated successfully',
    product_rank_updated: 'Product rank updated successfully',
    product_not_found: 'Product not found',
    
    // Category messages
    category_created: 'Category created successfully',
    category_updated: 'Category updated successfully',
    category_deleted: 'Category deleted successfully',
    categories_retrieved: 'Categories retrieved successfully',
    category_retrieved: 'Categorie retrieved successfully',
    category_not_found: 'Category not found',
    category_exists: 'Category already exists',
    category_name_taken: 'Category name is already taken',
    category_has_products: 'Cannot delete category with existing products',
    // Coupon messages
    coupon_created: 'Coupon created successfully',
    coupon_deleted: 'Coupon deleted successfully',
    coupons_retrieved: 'Coupons retrieved successfully',
    coupon_retrieved: 'Coupon retrieved successfully',
    coupon_not_found: 'Coupon not found',
    coupon_code_exists: 'Coupon code already exists',
    coupon_code_required: 'Coupon code is required',
    coupon_discount_required: 'Discount is required',
    coupon_discount_positive: 'Discount must be a positive number',
    coupon_valid_to_required: 'Valid to date is required',
    coupon_invalid_type: 'Invalid coupon type',
    coupon_invalid_dates: 'Valid from date cannot be after valid to date',
    coupon_product_required: 'Product ID is required',
    coupon_product_not_found: 'Product not found',
    missing_required_fields_name_price: 'Missing required fields: name, price',
    no_update_data_provided: 'No update data provided',
    rank_required: 'Rank is required',
    validation_error_with_detail: (detail) => `Validation error ${detail}`,
    not_found_with_url: (url) => `Cannot find ${url} on this server`,
    missing_or_invalid_auth_header: 'Missing or invalid authorization header',
    no_token_provided: 'Access denied. No token provided.',
    invalid_token: 'Invalid token.',
    access_denied_permissions: 'Access denied. You do not have the required permissions.',
    
    // Contact Us Messages
    contact_message_sent: 'Your message has been sent successfully',
    contact_message_failed: 'Sorry, there was an error sending your message',
    contact_form_submission: 'Contact Form Submission',
    from: 'From',
    subject: 'Subject',
    message: 'Message',
    name_is_required: 'Name is required',
    name_must_be_string: 'Name must be a string',
    name_length_2_100: 'Name must be between 2 and 100 characters',
    email_is_required: 'Email is required',
    email_must_be_valid: 'Email must be a valid email address',
    message_is_required: 'Message is required',
    message_length_6_2000: 'Message must be between 6 and 2000 characters',
    email_sent_from_contact_form: 'This email was sent from our contact form',
    email_send_failed: 'Failed to send email',
    
    // Contact Us messages
    contact_message_sent: 'Your message has been sent successfully',
    contact_message_failed: 'Sorry, there was an error sending your message',

    // Validation messages (auth)
    email_must_be_valid: 'Email must be valid',
    password_is_required: 'Password is required',
    password_must_be_string: 'Password must be a string',
    password_min_length_6: 'Password must be at least 6 characters',

    // Validation messages (product common)
    id_is_required: 'ID is required',
    id_must_be_positive_integer: 'ID must be a positive integer',
    name_is_required: 'Name is required',
    name_length: 'Name must be between 2 and 50 characters',
    invalid_id: 'Invalid ID',
    name_must_be_string: 'Name must be a string',
    name_length_2_100: 'Name length must be between 2 and 100 characters',
    price_is_required: 'Price is required',
    price_must_be_positive_number: 'Price must be a positive number',
    description_must_be_string: 'Description must be a string',
    description_max_2000: 'Description must be at most 2000 characters',
    stock_must_be_non_negative_integer: 'Stock must be a non-negative integer',
    discount_must_be_between_0_100: 'Discount must be between 0 and 100',
    color_must_be_string: 'Color must be a string',
    color_max_50: 'Color must be at most 50 characters',
    manufacturer_must_be_string: 'Manufacturer must be a string',
    manufacturer_max_100: 'Manufacturer must be at most 100 characters',
    category_name_must_be_string: 'Category name must be a string',
    category_name_length_2_100: 'Category name length must be between 2 and 100 characters',
    image_url_must_be_valid_url: 'Image URL must be a valid URL',
    no_valid_fields_to_update: 'No valid fields to update',
    rank_is_required: 'Rank is required',
    rank_must_be_non_negative_integer: 'Rank must be a non-negative integer',
    stock_is_required: 'Stock is required',
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
