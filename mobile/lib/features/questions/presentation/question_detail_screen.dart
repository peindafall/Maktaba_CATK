import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import 'questions_provider.dart';

class QuestionDetailScreen extends ConsumerWidget {
  final String id;

  const QuestionDetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final questionAsync = ref.watch(questionDetailProvider(id));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Question & Réponse'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
      ),
      body: questionAsync.when(
        loading: () => const Center(
            child: CircularProgressIndicator(
                color: AppColors.primaryGreen)),
        error: (e, _) => const Center(
            child: Text('Impossible de charger cette question')),
        data: (q) => SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.primaryGreen.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  q.category,
                  style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.primaryGreen,
                      fontWeight: FontWeight.w600),
                ),
              ),
              const SizedBox(height: 16),
              // Question
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.goldPrimary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                      color: AppColors.goldPrimary.withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.help_outline_rounded,
                            color: AppColors.goldPrimary, size: 20),
                        const SizedBox(width: 8),
                        const Text(
                          'Question',
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.goldPrimary),
                        ),
                        if (q.askedBy != null) ...[
                          const Spacer(),
                          Text(
                            'par ${q.askedBy}',
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      q.question,
                      style: const TextStyle(
                          fontSize: 15,
                          height: 1.6,
                          fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Answer
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primaryGreen.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                      color: AppColors.primaryGreen.withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.lightbulb_outlined,
                            color: AppColors.primaryGreen, size: 20),
                        const SizedBox(width: 8),
                        const Text(
                          'Réponse du Professeur KEBE',
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primaryGreen),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      q.answer,
                      style: const TextStyle(
                          fontSize: 15, height: 1.8),
                    ),
                  ],
                ),
              ),
              if (q.answerAr != null) ...[
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color:
                        AppColors.goldPrimary.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    q.answerAr!,
                    textDirection: TextDirection.rtl,
                    style: const TextStyle(
                      fontFamily: 'Amiri',
                      fontSize: 18,
                      height: 2.0,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
