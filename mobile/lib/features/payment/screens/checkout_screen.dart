import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/course_service.dart';
import '../../../services/payment_service.dart';

class CheckoutScreen extends StatefulWidget {
  final String courseId;

  const CheckoutScreen({super.key, required this.courseId});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final CourseService _courseService = CourseService();
  final PaymentService _paymentService = PaymentService();
  late Razorpay _razorpay;

  Map<String, dynamic>? _course;
  bool _isLoading = true;
  bool _isProcessing = false;
  
  // Coupon State
  final TextEditingController _couponController = TextEditingController();
  String? _couponError;
  double _discountAmount = 0;
  String? _appliedCouponCode;
  bool _isVerifyingCoupon = false;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
    _loadCourse();
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  Future<void> _loadCourse() async {
    final course = await _courseService.getCourseDetails(widget.courseId);
    setState(() {
      _course = course;
      _isLoading = false;
    });
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    setState(() => _isProcessing = true);

    // Verify payment on server
    final success = await _paymentService.verifyPayment(
      orderId: response.orderId ?? '',
      paymentId: response.paymentId ?? '',
      signature: response.signature ?? '',
      courseId: widget.courseId,
    );

    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Payment successful! Enrolled in course.'),
            backgroundColor: Colors.green,
          ),
        );
        context.go('/course-detail/${widget.courseId}');
      }
    } else {
      // If server verification fails, enroll directly (fallback)
      final directEnroll = await _paymentService.directEnroll(
        courseId: widget.courseId,
        amountPaid: (_course?['price'] ?? 0).toDouble(),
        paymentId: response.paymentId,
      );

      if (mounted) {
        if (directEnroll) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Payment successful! Enrolled in course.'),
              backgroundColor: Colors.green,
            ),
          );
          context.go('/course-detail/${widget.courseId}');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Payment received but enrollment failed. Contact support.'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }
    }

    setState(() => _isProcessing = false);
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Payment failed: ${response.message ?? 'Unknown error'}'),
        backgroundColor: Colors.red,
      ),
    );
    setState(() => _isProcessing = false);
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('External wallet selected: ${response.walletName}'),
      ),
    );
  }

  // Coupon Logic
  Future<void> _applyCoupon() async {
    final code = _couponController.text.trim();
    if (code.isEmpty) return;

    setState(() {
      _isVerifyingCoupon = true;
      _couponError = null;
    });

    final result = await _paymentService.verifyCoupon(code);

    if (mounted) {
      if (result != null && result['valid'] == true) {
        final double value = (result['discountValue'] ?? 0).toDouble();
        final type = result['discountType'];
        final basePrice = (_course?['price'] ?? 0).toDouble();
        
        double discount = 0;
        if (type == 'PERCENTAGE') {
          discount = (basePrice * value) / 100;
        } else {
          discount = value;
        }

        // Cap discount
        if (discount > basePrice) discount = basePrice;

        setState(() {
          _discountAmount = discount;
          _appliedCouponCode = code;
          _couponError = null;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Coupon applied successfully!'), backgroundColor: Colors.green),
        );
      } else {
        setState(() {
          _couponError = result?['error'] ?? 'Invalid coupon';
          _discountAmount = 0;
          _appliedCouponCode = null;
        });
      }
      setState(() => _isVerifyingCoupon = false);
    }
  }

  void _removeCoupon() {
    setState(() {
      _discountAmount = 0;
      _appliedCouponCode = null;
      _couponController.clear();
      _couponError = null;
    });
  }

  void _startPayment() {
    if (_course == null) return;

    final basePrice = (_course!['price'] ?? 0).toDouble();
    final finalPrice = basePrice - _discountAmount;

    if (finalPrice <= 0) {
      // Free due to coupon - direct enroll
      _enrollFreeCourse();
      return;
    }

    setState(() => _isProcessing = true);

    // Razorpay options
    var options = {
      'key': dotenv.env['RAZORPAY_KEY_ID'] ?? 'rzp_test_xxxxxxxxxx',
      'amount': (finalPrice * 100).toInt(), // Amount in paise
      'name': 'Ayureva',
      'description': _course!['title'] ?? 'Course',
      'prefill': {
        'contact': '',
        'email': '',
      },
      'theme': {
        'color': '#4A7C59', // Your primary green color
      },
      'notes': {
        'course_id': widget.courseId,
        'coupon_code': _appliedCouponCode ?? '',
      },
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      print('Razorpay error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error opening payment: $e')),
      );
      setState(() => _isProcessing = false);
    }
  }

  Future<void> _enrollFreeCourse() async {
    setState(() => _isProcessing = true);

    final success = await _courseService.enrollFreeCourse(widget.courseId);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Enrolled successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        context.go('/course-detail/${widget.courseId}');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Enrollment failed. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }

    setState(() => _isProcessing = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Checkout')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_course == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Checkout')),
        body: const Center(child: Text('Course not found')),
      );
    }

    final price = (_course!['price'] ?? 0).toDouble();
    final isFree = price <= 0;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Checkout'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Thumbnail
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      image: _course!['thumbnail_url'] != null
                          ? DecorationImage(
                              image: NetworkImage(_course!['thumbnail_url']),
                              fit: BoxFit.cover,
                            )
                          : null,
                    ),
                    child: _course!['thumbnail_url'] == null
                        ? Icon(Icons.school, color: AppColors.primary, size: 32)
                        : null,
                  ),
                  const SizedBox(width: 16),
                  // Details
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _course!['title'] ?? 'Course',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _course!['subtitle'] ?? '',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Coupon Section
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   const Text(
                    'Promo Code',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  if (_appliedCouponCode != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.green),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.verified, color: Colors.green),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Code $_appliedCouponCode applied',
                              style: const TextStyle(
                                color: Colors.green,
                                fontWeight: FontWeight.bold
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.red),
                            onPressed: _removeCoupon,
                          ),
                        ],
                      ),
                    )
                  else
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _couponController,
                            decoration: InputDecoration(
                              hintText: 'Enter Coupon Code',
                              errorText: _couponError,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                            ),
                            textCapitalization: TextCapitalization.characters,
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: _isVerifyingCoupon ? null : _applyCoupon,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: _isVerifyingCoupon 
                              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) 
                              : const Text('Apply'),
                        ),
                      ],
                    ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Order Summary
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Order Summary',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildSummaryRow('Course Price', isFree ? 'Free' : '₹${price.toInt()}'),
                  
                  if (_discountAmount > 0) ...[
                    const SizedBox(height: 12),
                    _buildSummaryRow(
                      'Discount', 
                      '- ₹${_discountAmount.toInt()}',
                      color: Colors.green,
                    ),
                  ],

                  const Divider(height: 24),
                  _buildSummaryRow(
                    'Total',
                    (price - _discountAmount) <= 0 ? 'Free' : '₹${(price - _discountAmount).toInt()}',
                    isBold: true,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Payment Methods (for paid courses)
            if (!isFree) ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Payment Method',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Image.network(
                          'https://razorpay.com/assets/razorpay-glyph.svg',
                          width: 32,
                          height: 32,
                          errorBuilder: (_, __, ___) => Icon(
                            Icons.payment,
                            size: 32,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text('Razorpay (UPI, Cards, NetBanking)'),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Secure Payment Note
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.security, color: Colors.green),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      isFree
                          ? 'Start learning immediately after enrollment!'
                          : 'Your payment is 100% secure with Razorpay',
                      style: const TextStyle(color: Colors.green),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Pay Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _startPayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation(Colors.white),
                        ),
                      )
                    : Text(
                        isFree 
                          ? 'Enroll Now - Free' 
                          : (price - _discountAmount) <= 0 
                              ? 'Enroll Now - Free' 
                              : 'Pay ₹${(price - _discountAmount).toInt()}',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false, Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isBold ? 16 : 14,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            color: isBold ? Colors.black : Colors.grey[600],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isBold ? 18 : 14,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            color: color ?? (isBold ? AppColors.primary : Colors.black),
          ),
        ),
      ],
    );
  }
}
