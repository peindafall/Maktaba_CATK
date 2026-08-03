class QuestionModel {
  final String id;
  final String question;
  final String? questionAr;
  final String answer;
  final String? answerAr;
  final String? askedBy;
  final String category;
  final int viewCount;
  final DateTime publishedAt;
  final bool isFeatured;

  const QuestionModel({
    required this.id,
    required this.question,
    this.questionAr,
    required this.answer,
    this.answerAr,
    this.askedBy,
    required this.category,
    this.viewCount = 0,
    required this.publishedAt,
    this.isFeatured = false,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    return QuestionModel(
      id: json['id'] as String,
      question: json['question'] as String,
      questionAr: json['question_ar'] as String?,
      answer: json['answer'] as String,
      answerAr: json['answer_ar'] as String?,
      askedBy: json['asked_by'] as String?,
      category: json['category'] as String,
      viewCount: json['view_count'] as int? ?? 0,
      publishedAt: DateTime.parse(json['published_at'] as String),
      isFeatured: json['is_featured'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'question': question,
        'question_ar': questionAr,
        'answer': answer,
        'answer_ar': answerAr,
        'asked_by': askedBy,
        'category': category,
        'view_count': viewCount,
        'published_at': publishedAt.toIso8601String(),
        'is_featured': isFeatured,
      };
}
