import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_theme.dart';

class AboutInstructorScreen extends StatelessWidget {
  const AboutInstructorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Hero Header with gradient
          SliverToBoxAdapter(
            child: _buildHeroHeader(context),
          ),
          
          // Content
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Bio Section
                FadeInUp(
                  child: _buildSection(
                    'About',
                    'Dr. Arti Singh is a highly qualified BAMS practitioner and Medical Officer with extensive experience in both clinical practice and Ayurvedic education. Her passion for teaching has helped thousands of BAMS students across India understand complex concepts with clarity.',
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Qualifications
                FadeInUp(
                  delay: const Duration(milliseconds: 100),
                  child: _buildQualifications(),
                ),
                
                const SizedBox(height: 24),
                
                // Expertise
                FadeInUp(
                  delay: const Duration(milliseconds: 200),
                  child: _buildExpertise(),
                ),
                
                const SizedBox(height: 24),
                
                // Stats
                FadeInUp(
                  delay: const Duration(milliseconds: 300),
                  child: _buildStats(),
                ),
                
                const SizedBox(height: 24),
                
                // Teaching Philosophy
                FadeInUp(
                  delay: const Duration(milliseconds: 400),
                  child: _buildSection(
                    'Teaching Philosophy',
                    'I believe in making Ayurveda accessible and practical. My courses focus on real-world applications, exam preparation, and building a strong foundation in classical texts. Every student deserves to understand, not just memorize.',
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Contact CTA
                FadeInUp(
                  delay: const Duration(milliseconds: 500),
                  child: _buildContactSection(context),
                ),
                
                const SizedBox(height: 32),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Expanded(
                    child: Text(
                      'About Instructor',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(width: 48), // Balance for back button
                ],
              ),
            ),
            
            // Profile Section
            Padding(
              padding: const EdgeInsets.all(24),
              child: FadeInDown(
                child: Column(
                  children: [
                    // Profile Image
                    Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 4),
                        boxShadow: AppShadows.large,
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/dr-arti-real.jpg',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: Colors.white,
                              child: const Icon(
                                Icons.person,
                                size: 70,
                                color: AppColors.primary,
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Name
                    Text(
                      'Dr. Arti Singh',
                      style: AppTypography.h2.copyWith(color: Colors.white),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    // Title
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'BAMS | Medical Officer',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTypography.h4),
          const SizedBox(height: 12),
          Text(
            content,
            style: AppTypography.bodyMedium.copyWith(height: 1.6),
          ),
        ],
      ),
    );
  }

  Widget _buildQualifications() {
    final qualifications = [
      {'icon': Icons.school, 'title': 'BAMS', 'subtitle': 'Bachelor of Ayurvedic Medicine'},
      {'icon': Icons.local_hospital, 'title': 'Medical Officer', 'subtitle': 'Clinical Experience'},
      {'icon': Icons.verified, 'title': 'Certified Educator', 'subtitle': 'Teaching Excellence'},
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Qualifications', style: AppTypography.h4),
          const SizedBox(height: 16),
          ...qualifications.map((q) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    q['icon'] as IconData,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        q['title'] as String,
                        style: AppTypography.labelLarge,
                      ),
                      Text(
                        q['subtitle'] as String,
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildExpertise() {
    final expertise = [
      'Padartha Vigyan',
      'Rachana Sharir',
      'Kriya Sharir',
      'Dravyaguna',
      'Rasa Shastra',
      'Kayachikitsa',
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Areas of Expertise', style: AppTypography.h4),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: expertise.map((e) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.primary.withOpacity(0.3)),
              ),
              child: Text(
                e,
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            )).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildStats() {
    final stats = [
      {'value': '10+', 'label': 'Years Experience'},
      {'value': '5000+', 'label': 'Students Taught'},
      {'value': '15+', 'label': 'Courses Created'},
      {'value': '4.9', 'label': 'Average Rating'},
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.medium,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: stats.map((s) => Column(
          children: [
            Text(
              s['value']!,
              style: AppTypography.h3.copyWith(color: Colors.white),
            ),
            const SizedBox(height: 4),
            Text(
              s['label']!,
              style: AppTypography.bodySmall.copyWith(color: Colors.white70),
              textAlign: TextAlign.center,
            ),
          ],
        )).toList(),
      ),
    );
  }

  Widget _buildContactSection(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Get in Touch', style: AppTypography.h4),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // TODO: Send email
                  },
                  icon: const Icon(Icons.email_outlined),
                  label: const Text('Email'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // TODO: Visit website
                  },
                  icon: const Icon(Icons.language),
                  label: const Text('Website'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    side: const BorderSide(color: AppColors.primary),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
