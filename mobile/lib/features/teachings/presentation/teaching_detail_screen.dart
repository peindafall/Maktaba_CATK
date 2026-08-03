import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import 'teachings_provider.dart';
import 'widgets/pdf_viewer_screen.dart';

class TeachingDetailScreen extends ConsumerWidget {
  final String id;

  const TeachingDetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teaching = ref.watch(teachingDetailProvider(id));

    return Scaffold(
      body: teaching.when(
        loading: () => const Center(
            child: CircularProgressIndicator(color: AppColors.primaryGreen)),
        error: (e, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: AppColors.error),
              const SizedBox(height: 16),
              const Text('Impossible de charger cet enseignement'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () =>
                    ref.invalidate(teachingDetailProvider(id)),
                child: const Text('Réessayer'),
              ),
            ],
          ),
        ),
        data: (t) => CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 250,
              pinned: true,
              backgroundColor: AppColors.primaryGreenDark,
              foregroundColor: Colors.white,
              flexibleSpace: FlexibleSpaceBar(
                title: Text(
                  t.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                background: t.imageUrl != null
                    ? Image.network(t.imageUrl!, fit: BoxFit.cover)
                    : Container(
                        decoration: const BoxDecoration(
                            gradient: AppColors.primaryGradient),
                      ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category + stats
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.primaryGreen
                                .withOpacity(0.12),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            t.category,
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.primaryGreen,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Icon(Icons.remove_red_eye_outlined,
                            size: 16, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text('${t.viewCount}',
                            style: const TextStyle(
                                color: AppColors.textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 20),
                    if (t.description != null) ...[
                      const Text('Description',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Text(
                        t.description!,
                        style: const TextStyle(
                            fontSize: 14,
                            height: 1.7,
                            color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 24),
                    ],
                    if (t.pdfUrl != null) ...[
                      const Divider(),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () =>
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => PdfViewerScreen(
                                        pdfUrl: t.pdfUrl!,
                                        title: t.title,
                                      ),
                                    ),
                                  ),
                              icon: const Icon(Icons.picture_as_pdf),
                              label: const Text('Lire le PDF'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(
                                  Icons.download_rounded),
                              label: const Text('Télécharger'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
