class ApiResponse<T> {
  final T? data;
  final String? message;
  final bool success;
  final int? statusCode;

  const ApiResponse({
    this.data,
    this.message,
    this.success = true,
    this.statusCode,
  });

  factory ApiResponse.success(T data, {String? message}) {
    return ApiResponse(data: data, message: message, success: true);
  }

  factory ApiResponse.error(String message, {int? statusCode}) {
    return ApiResponse(
        message: message, success: false, statusCode: statusCode);
  }
}

class PaginatedResponse<T> {
  final List<T> items;
  final int total;
  final int page;
  final int perPage;
  final bool hasMore;

  const PaginatedResponse({
    required this.items,
    required this.total,
    required this.page,
    required this.perPage,
    required this.hasMore,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJson,
  ) {
    final data = json['data'] as Map<String, dynamic>;
    final items = (data['items'] as List)
        .map((e) => fromJson(e as Map<String, dynamic>))
        .toList();
    return PaginatedResponse(
      items: items,
      total: data['total'] as int,
      page: data['page'] as int,
      perPage: data['per_page'] as int,
      hasMore: data['has_more'] as bool,
    );
  }
}
