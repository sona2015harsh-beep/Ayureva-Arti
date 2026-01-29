import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:animate_do/animate_do.dart';
import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                // 1. Gradient Header Background
                Container(
                  height: 240, // Fixed height for header
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: AppColors.heroGradient,
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(32),
                      bottomRight: Radius.circular(32),
                    ),
                  ),
                  child: SafeArea(
                    bottom: false,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 16, right: 16),
                      child: Column(
                        children: [
                          // Top Bar Actions
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                                IconButton(
                                  icon: const Icon(Icons.edit, color: Colors.white),
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Edit Profile coming soon!')),
                                    );
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.settings, color: Colors.white),
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Settings coming soon!')),
                                    );
                                  },
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Student Name',
                            style: AppTypography.h2.copyWith(color: Colors.white),
                          ),
                          Text(
                            'student@example.com',
                            style: AppTypography.bodyMedium.copyWith(color: Colors.white70),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // 2. Profile Picture (Overlapping)
                Positioned(
                  bottom: -50,
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.background, width: 6),
                      boxShadow: AppShadows.medium,
                    ),
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/placeholder-user.jpg',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: AppColors.surfaceVariant,
                              child: const Icon(
                                Icons.person,
                                size: 60,
                                color: AppColors.primary,
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            // Spacer for overlapping avatar
            const SizedBox(height: 60),

            // Stats Row
            FadeInUp(
              delay: const Duration(milliseconds: 100),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.symmetric(vertical: 20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildStatItem('3', 'Courses'),
                    _buildDivider(),
                    _buildStatItem('24h', 'Learning'),
                    _buildDivider(),
                    _buildStatItem('5', 'Streak'),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  FadeInUp(
                    delay: const Duration(milliseconds: 200),
                    child: _buildMenuSection('Learning', [
                      _MenuItem(
                        icon: Icons.person_outline,
                        title: 'About Dr. Arti Singh',
                        onTap: () => context.push('/about-instructor'),
                      ),
                      _MenuItem(
                        icon: Icons.download_outlined,
                        title: 'My Downloads',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Downloads coming soon!'))),
                      ),
                      _MenuItem(
                        icon: Icons.receipt_long_outlined,
                        title: 'My Orders',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Orders coming soon!'))),
                      ),
                      _MenuItem(
                        icon: Icons.bookmark_outline,
                        title: 'Bookmarks',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bookmarks coming soon!'))),
                      ),
                    ]),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 300),
                    child: _buildMenuSection('Settings', [
                      _MenuItem(
                        icon: Icons.settings_outlined,
                        title: 'Settings',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Settings coming soon!'))),
                      ),
                      _MenuItem(
                        icon: Icons.help_outline,
                        title: 'Help & Support',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Help & Support coming soon!'))),
                      ),
                      _MenuItem(
                        icon: Icons.privacy_tip_outlined,
                        title: 'Privacy Policy',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Privacy Policy coming soon!'))),
                      ),
                      _MenuItem(
                        icon: Icons.description_outlined,
                        title: 'Terms & Conditions',
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Terms & Conditions coming soon!'))),
                      ),
                    ]),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Logout Button
                  FadeInUp(
                    delay: const Duration(milliseconds: 400),
                    child: SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          _showLogoutDialog(context);
                        },
                        icon: const Icon(Icons.logout, color: AppColors.error),
                        label: const Text('Logout'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.error,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: const BorderSide(color: AppColors.error),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // App version
                  Text(
                    'Version 1.0.0',
                    style: AppTypography.bodySmall,
                  ),
                  
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: AppTypography.h3.copyWith(color: AppColors.primary),
        ),
        const SizedBox(height: 4),
        Text(label, style: AppTypography.bodySmall),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 40,
      color: Colors.grey.shade200,
    );
  }

  Widget _buildMenuSection(String title, List<_MenuItem> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title,
            style: AppTypography.labelLarge.copyWith(color: AppColors.textMuted),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: AppShadows.small,
          ),
          child: Column(
            children: items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              return Column(
                children: [
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(item.icon, color: AppColors.primary, size: 20),
                    ),
                    title: Text(item.title, style: AppTypography.bodyLarge),
                    trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
                    onTap: item.onTap,
                  ),
                  if (index < items.length - 1)
                    Divider(height: 1, indent: 56, color: Colors.grey.shade100),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.go('/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  _MenuItem({
    required this.icon,
    required this.title,
    required this.onTap,
  });
}
