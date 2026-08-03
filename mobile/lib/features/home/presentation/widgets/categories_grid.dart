import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';

class CategoriesGrid extends StatelessWidget {
  final List<Map<String, dynamic>> categories;

  const CategoriesGrid({super.key, required this.categories});

  @override
  Widget build(BuildContext context) {
    final cats = categories.isNotEmpty
        ? categories
        : HomeRepository._defaultCategories;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.screenPaddingH),
          child: Text(
            'Catégories',
            style: Theme.of(context)
                .textTheme
                .titleLarge
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.screenPaddingH),
          child: GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.1,
            ),
            itemCount: cats.length,
            itemBuilder: (context, index) {
              final cat = cats[index];
              return _CategoryItem(
                category: cat,
                onTap: () => context
                    .go('/enseignements?category=${cat['id']}'),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _CategoryItem extends StatelessWidget {
  final Map<String, dynamic> category;
  final VoidCallback onTap;

  const _CategoryItem({required this.category, required this.onTap});

  Color _parseColor(String? hex) {
    if (hex == null) return AppColors.primaryGreen;
    try {
      return Color(
          int.parse(hex.replaceFirst('#', '0xFF')));
    } catch (_) {
      return AppColors.primaryGreen;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _parseColor(category['color'] as String?);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      child: Container(
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius:
              BorderRadius.circular(AppDimensions.radiusLg),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              category['icon'] as String? ?? '📖',
              style: const TextStyle(fontSize: 28),
            ),
            const SizedBox(height: 6),
            Text(
              category['name'] as String? ?? '',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: color,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// Expose default categories for CategoriesGrid
class HomeRepository {
  static const List<Map<String, dynamic>> _defaultCategories = [
    {'id': 'aqida', 'name': 'Aqida', 'icon': '📖', 'color': '#1EA478'},
    {'id': 'fiqh', 'name': 'Fiqh', 'icon': '⚖️', 'color': '#BF8B28'},
    {'id': 'tafsir', 'name': 'Tafsir', 'icon': '🌟', 'color': '#114D0D'},
    {'id': 'hadith', 'name': 'Hadith', 'icon': '📜', 'color': '#B35214'},
    {'id': 'tarbiya', 'name': 'Tarbiya', 'icon': '🌱', 'color': '#1FA645'},
    {'id': 'sira', 'name': 'Sira', 'icon': '🕌', 'color': '#A67723'},
  ];
}
