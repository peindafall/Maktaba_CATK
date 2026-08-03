class TeachingModel {
  final String id;
  final String title;
  final String? titleAr;
  final String? titleEn;
  final String? description;
  final String? descriptionAr;
  final String? imageUrl;
  final String? pdfUrl;
  final String category;
  final String? categoryColor;
  final int viewCount;
  final int downloadCount;
  final String? language;
  final DateTime publishedAt;
  final bool isFeatured;

  const TeachingModel({
    required this.id,
    required this.title,
    this.titleAr,
    this.titleEn,
    this.description,
    this.descriptionAr,
    this.imageUrl,
    this.pdfUrl,
    required this.category,
    this.categoryColor,
    this.viewCount = 0,
    this.downloadCount = 0,
    this.language,
    required this.publishedAt,
    this.isFeatured = false,
  });

  factory TeachingModel.fromJson(Map<String, dynamic> json) {
    return TeachingModel(
      id: json['id'] as String,
      title: json['title'] as String,
      titleAr: json['title_ar'] as String?,
      titleEn: json['title_en'] as String?,
      description: json['description'] as String?,
      descriptionAr: json['description_ar'] as String?,
      imageUrl: json['image_url'] as String?,
      pdfUrl: json['pdf_url'] as String?,
      category: json['category'] as String,
      categoryColor: json['category_color'] as String?,
      viewCount: json['view_count'] as int? ?? 0,
      downloadCount: json['download_count'] as int? ?? 0,
      language: json['language'] as String?,
      publishedAt: DateTime.parse(json['published_at'] as String),
      isFeatured: json['is_featured'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'title_ar': titleAr,
        'title_en': titleEn,
        'description': description,
        'description_ar': descriptionAr,
        'image_url': imageUrl,
        'pdf_url': pdfUrl,
        'category': category,
        'category_color': categoryColor,
        'view_count': viewCount,
        'download_count': downloadCount,
        'language': language,
        'published_at': publishedAt.toIso8601String(),
        'is_featured': isFeatured,
      };
}
