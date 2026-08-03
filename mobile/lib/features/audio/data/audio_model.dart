class AudioModel {
  final String id;
  final String title;
  final String? titleAr;
  final String? description;
  final String audioUrl;
  final String? imageUrl;
  final int durationSeconds;
  final String category;
  final int playCount;
  final int downloadCount;
  final String? language;
  final DateTime publishedAt;
  final bool isFeatured;

  const AudioModel({
    required this.id,
    required this.title,
    this.titleAr,
    this.description,
    required this.audioUrl,
    this.imageUrl,
    this.durationSeconds = 0,
    required this.category,
    this.playCount = 0,
    this.downloadCount = 0,
    this.language,
    required this.publishedAt,
    this.isFeatured = false,
  });

  factory AudioModel.fromJson(Map<String, dynamic> json) {
    return AudioModel(
      id: json['id'] as String,
      title: json['title'] as String,
      titleAr: json['title_ar'] as String?,
      description: json['description'] as String?,
      audioUrl: json['audio_url'] as String,
      imageUrl: json['image_url'] as String?,
      durationSeconds: json['duration_seconds'] as int? ?? 0,
      category: json['category'] as String,
      playCount: json['play_count'] as int? ?? 0,
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
        'description': description,
        'audio_url': audioUrl,
        'image_url': imageUrl,
        'duration_seconds': durationSeconds,
        'category': category,
        'play_count': playCount,
        'download_count': downloadCount,
        'language': language,
        'published_at': publishedAt.toIso8601String(),
        'is_featured': isFeatured,
      };
}
