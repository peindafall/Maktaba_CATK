class VideoModel {
  final String id;
  final String title;
  final String? titleAr;
  final String? description;
  final String youtubeId;
  final String? thumbnailUrl;
  final int durationSeconds;
  final String category;
  final int viewCount;
  final String? language;
  final DateTime publishedAt;
  final bool isFeatured;

  const VideoModel({
    required this.id,
    required this.title,
    this.titleAr,
    this.description,
    required this.youtubeId,
    this.thumbnailUrl,
    this.durationSeconds = 0,
    required this.category,
    this.viewCount = 0,
    this.language,
    required this.publishedAt,
    this.isFeatured = false,
  });

  String get thumbnailUrlYt =>
      thumbnailUrl ??
      'https://img.youtube.com/vi/$youtubeId/maxresdefault.jpg';

  factory VideoModel.fromJson(Map<String, dynamic> json) {
    return VideoModel(
      id: json['id'] as String,
      title: json['title'] as String,
      titleAr: json['title_ar'] as String?,
      description: json['description'] as String?,
      youtubeId: json['youtube_id'] as String,
      thumbnailUrl: json['thumbnail_url'] as String?,
      durationSeconds: json['duration_seconds'] as int? ?? 0,
      category: json['category'] as String,
      viewCount: json['view_count'] as int? ?? 0,
      language: json['language'] as String?,
      publishedAt: DateTime.parse(json['published_at'] as String),
      isFeatured: json['is_featured'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'title_ar': titleAr,
        'description': description,
        'youtube_id': youtubeId,
        'thumbnail_url': thumbnailUrl,
        'duration_seconds': durationSeconds,
        'category': category,
        'view_count': viewCount,
        'language': language,
        'published_at': publishedAt.toIso8601String(),
        'is_featured': isFeatured,
      };
}
