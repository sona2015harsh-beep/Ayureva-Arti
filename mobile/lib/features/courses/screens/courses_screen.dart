import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/course_service.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  final TextEditingController _searchController = TextEditingController();
  final CourseService _courseService = CourseService();
  
  String _selectedCategory = 'All';
  String _selectedSort = 'newest'; // newest, popular, price_low, price_high
  bool _isFreeOnly = false;
  
  List<String> _categories = ['All'];
  List<Map<String, dynamic>> _courses = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
    // Pass filters to service
    final courses = await _courseService.getCourses(
      category: _selectedCategory == 'All' ? null : _selectedCategory,
      sortBy: _selectedSort,
      isFree: _isFreeOnly ? true : null,
    );
    
    final categories = await _courseService.getCategories();
    
    if (mounted) {
      setState(() {
        _courses = courses;
        if (_categories.length <= 1) {
           _categories = ['All', ...categories];
        }
        _isLoading = false;
      });
    }
  }

  void _showFilterOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Filters & Sort', style: AppTypography.h3),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const Divider(),
                  const SizedBox(height: 16),
                  
                  // Sort By
                  Text('Sort By', style: AppTypography.labelLarge),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    children: [
                      _buildFilterChip('Newest', 'newest', setModalState),
                      _buildFilterChip('Popular', 'popular', setModalState),
                      _buildFilterChip('Price: Low to High', 'price_low', setModalState),
                      _buildFilterChip('Price: High to Low', 'price_high', setModalState),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Price Filter
                  Text('Price', style: AppTypography.labelLarge),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      FilterChip(
                        label: const Text('All Courses'),
                        selected: !_isFreeOnly,
                        onSelected: (val) => setModalState(() => _isFreeOnly = false),
                        checkmarkColor: Colors.white,
                        selectedColor: AppColors.primary,
                        labelStyle: TextStyle(
                          color: !_isFreeOnly ? Colors.white : AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      FilterChip(
                        label: const Text('Free Only'),
                        selected: _isFreeOnly,
                        onSelected: (val) => setModalState(() => _isFreeOnly = true),
                        checkmarkColor: Colors.white,
                        selectedColor: AppColors.primary,
                        labelStyle: TextStyle(
                          color: _isFreeOnly ? Colors.white : AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Apply Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _loadData();
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Apply Filters'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFilterChip(String label, String value, StateSetter setModalState) {
    final isSelected = _selectedSort == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setModalState(() => _selectedSort = value);
        }
      },
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textPrimary,
      ),
    );
  }

  // .. search logic remains ..

  Future<void> _searchCourses(String query) async {
    if (query.isEmpty) {
      _loadData();
      return;
    }
    
    setState(() => _isLoading = true);
    final results = await _courseService.searchCourses(query);
    setState(() {
      _courses = results;
      _isLoading = false;
    });
  }

  List<Map<String, dynamic>> get _filteredCourses {
    if (_selectedCategory == 'All') return _courses;
    return _courses.where((course) {
      final subtitle = course['subtitle'] ?? '';
      return subtitle.toLowerCase().contains(_selectedCategory.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeInDown(
                    child: Text('Courses', style: AppTypography.h2),
                  ),
                  const SizedBox(height: 16),
                  
                  // Search Bar
                  FadeInDown(
                    delay: const Duration(milliseconds: 100),
                    child: TextField(
                      controller: _searchController,
                      onSubmitted: _searchCourses,
                      decoration: InputDecoration(
                        hintText: 'Search courses...',
                        prefixIcon: const Icon(Icons.search),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  _searchController.clear();
                                  _loadData();
                                },
                              )
                            : IconButton(
                                icon: const Icon(Icons.tune),
                                onPressed: () {
                                  _showFilterOptions();
                                },
                              ),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Category Chips
                  FadeInDown(
                    delay: const Duration(milliseconds: 200),
                    child: SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _categories.length,
                        itemBuilder: (context, index) {
                          final category = _categories[index];
                          final isSelected = category == _selectedCategory;
                          return GestureDetector(
                            onTap: () => setState(() => _selectedCategory = category),
                            child: Container(
                              margin: const EdgeInsets.only(right: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.primary : Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected ? AppColors.primary : Colors.grey.shade300,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  category,
                                  style: TextStyle(
                                    color: isSelected ? Colors.white : AppColors.textSecondary,
                                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            // Course List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _filteredCourses.isEmpty
                      ? _buildEmptyState()
                      : RefreshIndicator(
                          onRefresh: _loadData,
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: _filteredCourses.length,
                            itemBuilder: (context, index) {
                              return FadeInUp(
                                delay: Duration(milliseconds: 100 * index),
                                child: _buildCourseCard(_filteredCourses[index]),
                              );
                            },
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 64,
            color: AppColors.textMuted,
          ),
          const SizedBox(height: 16),
          Text(
            'No courses found',
            style: AppTypography.h4.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your search or filters',
            style: AppTypography.bodyMedium,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _loadData,
            child: const Text('Refresh'),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(Map<String, dynamic> course) {
    final instructor = course['instructor'];
    final instructorName = instructor?['full_name'] ?? 'Instructor';
    final moduleCount = course['modules']?[0]?['count'] ?? 0;
    final price = (course['price'] ?? 0).toDouble();
    final rating = (course['rating'] ?? 4.5).toDouble();
    final thumbnailUrl = course['thumbnail_url'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: InkWell(
        onTap: () => context.push('/course-detail/${course['id']}'),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course header with gradient or image
            Container(
              height: 120,
              decoration: BoxDecoration(
                gradient: thumbnailUrl == null
                    ? LinearGradient(
                        colors: [AppColors.primary, AppColors.primaryDark],
                      )
                    : null,
                image: thumbnailUrl != null
                    ? DecorationImage(
                        image: NetworkImage(thumbnailUrl),
                        fit: BoxFit.cover,
                      )
                    : null,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Stack(
                children: [
                  // Category badge
                  if (course['subtitle'] != null)
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          course['subtitle'],
                          style: AppTypography.bodySmall.copyWith(color: Colors.white),
                        ),
                      ),
                    ),
                  // Center icon if no thumbnail
                  if (thumbnailUrl == null)
                    Center(
                      child: Icon(
                        Icons.menu_book,
                        size: 48,
                        color: Colors.white.withOpacity(0.3),
                      ),
                    ),
                ],
              ),
            ),
            
            // Course details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    course['title'] ?? 'Course',
                    style: AppTypography.h4,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundImage: instructor?['avatar_url'] != null
                            ? NetworkImage(instructor['avatar_url'])
                            : null,
                        child: instructor?['avatar_url'] == null
                            ? const Icon(Icons.person, size: 16)
                            : null,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        instructorName,
                        style: AppTypography.bodyMedium,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildInfoChip(Icons.folder_outlined, '$moduleCount modules'),
                      const SizedBox(width: 16),
                      Row(
                        children: [
                          const Icon(Icons.star, size: 16, color: AppColors.warning),
                          const SizedBox(width: 4),
                          Text(
                            rating.toStringAsFixed(1),
                            style: AppTypography.labelLarge,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        price > 0 ? '₹${price.toInt()}' : 'Free',
                        style: AppTypography.h3.copyWith(
                          color: price > 0 ? AppColors.primary : Colors.green,
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          context.push('/course-detail/${course['id']}');
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          minimumSize: Size.zero,
                        ),
                        child: Text(price > 0 ? 'Enroll Now' : 'Start Free'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.textMuted),
        const SizedBox(width: 4),
        Text(text, style: AppTypography.bodySmall),
      ],
    );
  }
}
