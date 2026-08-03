import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import 'teachings_provider.dart';
import 'widgets/teaching_card.dart';

class TeachingsScreen extends ConsumerWidget {
  const TeachingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(teachingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Enseignements'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterSheet(context, ref),
          ),
        ],
      ),
      body: Column(
        children: [
          _CategoryFilter(
            selected: state.selectedCategory,
            onChanged: (cat) =>
                ref.read(teachingsProvider.notifier).filterByCategory(cat),
          ),
          Expanded(
            child: state.isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                        color: AppColors.primaryGreen))
                : state.error != null
                    ? _ErrorView(
                        error: state.error!,
                        onRetry: () => ref
                            .read(teachingsProvider.notifier)
                            .loadTeachings(refresh: true),
                      )
                    : RefreshIndicator(
                        onRefresh: () => ref
                            .read(teachingsProvider.notifier)
                            .loadTeachings(refresh: true),
                        color: AppColors.primaryGreen,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(
                              AppDimensions.screenPaddingH),
                          itemCount: state.teachings.length +
                              (state.hasMore ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == state.teachings.length) {
                              ref
                                  .read(teachingsProvider.notifier)
                                  .loadMore();
                              return const Padding(
                                padding: EdgeInsets.all(16),
                                child: Center(
                                  child: CircularProgressIndicator(
                                      color: AppColors.primaryGreen,
                                      strokeWidth: 2),
                                ),
                              );
                            }
                            return Padding(
                              padding: const EdgeInsets.only(
                                  bottom: AppDimensions.md),
                              child: TeachingCard(
                                  teaching: state.teachings[index]),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  void _showFilterSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _FilterBottomSheet(
        onSelected: (cat) =>
            ref.read(teachingsProvider.notifier).filterByCategory(cat),
      ),
    );
  }
}

class _CategoryFilter extends StatelessWidget {
  final String? selected;
  final ValueChanged<String?> onChanged;

  const _CategoryFilter(
      {required this.selected, required this.onChanged});

  static const _categories = [
    'Aqida', 'Fiqh', 'Tafsir', 'Hadith', 'Tarbiya', 'Sira',
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: _categories.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return _Chip(
                label: 'Tous',
                selected: selected == null,
                onTap: () => onChanged(null));
          }
          final cat = _categories[index - 1];
          return _Chip(
              label: cat,
              selected: selected == cat,
              onTap: () => onChanged(cat));
        },
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _Chip(
      {required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(right: 8),
        padding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primaryGreen
              : AppColors.primaryGreen.withOpacity(0.08),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.white : AppColors.primaryGreen,
          ),
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String error;
  final VoidCallback onRetry;

  const _ErrorView({required this.error, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.wifi_off,
                size: 64, color: AppColors.textSecondary),
            const SizedBox(height: 16),
            Text(error,
                style:
                    const TextStyle(color: AppColors.textSecondary),
                textAlign: TextAlign.center),
            const SizedBox(height: 16),
            ElevatedButton(
                onPressed: onRetry,
                child: const Text('Réessayer')),
          ],
        ),
      ),
    );
  }
}

class _FilterBottomSheet extends StatelessWidget {
  final ValueChanged<String?> onSelected;

  const _FilterBottomSheet({required this.onSelected});

  static const _categories = [
    'Aqida', 'Fiqh', 'Tafsir', 'Hadith', 'Tarbiya', 'Sira',
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Filtrer par catégorie',
              style:
                  TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              FilterChip(
                label: const Text('Tous'),
                onSelected: (_) {
                  onSelected(null);
                  Navigator.pop(context);
                },
                selected: false,
              ),
              ..._categories.map(
                (cat) => FilterChip(
                  label: Text(cat),
                  onSelected: (_) {
                    onSelected(cat);
                    Navigator.pop(context);
                  },
                  selected: false,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
