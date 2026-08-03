import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import 'questions_provider.dart';
import '../data/question_model.dart';

class QuestionsScreen extends ConsumerWidget {
  const QuestionsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(questionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Questions & Réponses'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
      ),
      body: state.isLoading
          ? const Center(
              child: CircularProgressIndicator(
                  color: AppColors.primaryGreen))
          : state.error != null
              ? Center(child: Text(state.error!))
              : RefreshIndicator(
                  onRefresh: () => ref
                      .read(questionsProvider.notifier)
                      .loadQuestions(refresh: true),
                  color: AppColors.primaryGreen,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(
                        AppDimensions.screenPaddingH),
                    itemCount: state.questions.length +
                        (state.hasMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == state.questions.length) {
                        ref.read(questionsProvider.notifier).loadMore();
                        return const Padding(
                          padding: EdgeInsets.all(16),
                          child: Center(
                            child: CircularProgressIndicator(
                                color: AppColors.primaryGreen,
                                strokeWidth: 2),
                          ),
                        );
                      }
                      return _QuestionCard(
                        question: state.questions[index],
                        onTap: () => context.go(
                            '/questions/${state.questions[index].id}'),
                      );
                    },
                  ),
                ),
    );
  }
}

class _QuestionCard extends StatelessWidget {
  final QuestionModel question;
  final VoidCallback onTap;

  const _QuestionCard(
      {required this.question, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.cardRadius)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppDimensions.cardRadius),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.goldPrimary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.question_answer_outlined,
                        color: AppColors.goldPrimary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.primaryGreen
                                .withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            question.category,
                            style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.primaryGreen,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          question.question,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              const Divider(height: 1),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(Icons.remove_red_eye_outlined,
                      size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text('${question.viewCount}',
                      style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary)),
                  const Spacer(),
                  const Icon(Icons.arrow_forward_ios_rounded,
                      size: 14, color: AppColors.textSecondary),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
