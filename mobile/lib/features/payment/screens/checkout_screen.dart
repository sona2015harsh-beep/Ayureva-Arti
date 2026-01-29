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

  void _startPayment() {
    if (_course == null) return;

    final price = (_course!['price'] ?? 0).toDouble();
    if (price <= 0) {
      // Free course - direct enroll
      _enrollFreeCourse();
      return;
    }

    setState(() => _isProcessing = true);

    // Razorpay options
    var options = {
      'key': dotenv.env['RAZORPAY_KEY_ID'] ?? 'rzp_test_xxxxxxxxxx',
      'amount': (price * 100).toInt(), // Amount in paise
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
                  const Divider(height: 24),
                  _buildSummaryRow(
                    'Total',
                    isFree ? 'Free' : '₹${price.toInt()}',
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
                        isFree ? 'Enroll Now - Free' : 'Pay ₹${price.toInt()}',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
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
            color: isBold ? AppColors.primary : Colors.black,
          ),
        ),
      ],
    );
  }
}
