import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import 'search_provider.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _controller = TextEditingController();
  final _debounce = ValueNotifier<String>('');

  @override
  void initState() {
    super.initState();
    _debounce.addListener(() {
      Future.delayed(const Duration(milliseconds: 400), () {
        if (_debounce.value == _controller.text) {
          ref.read(searchProvider.notifier).search(_controller.text);
        }
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _debounce.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(searchProvider);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primaryGreenDark,
        title: TextField(
          controller: _controller,
          autofocus: true,
          onChanged: (v) => _debounce.value = v,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Rechercher...',
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.6)),
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            fillColor: Colors.transparent,
          ),
        ),
        actions: [
          if (_controller.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear, color: Colors.white),
              onPressed: () {
                _controller.clear();
                ref.read(searchProvider.notifier).clear();
              },
            ),
        ],
      ),
      body: state.isLoading
          ? const Center(
              child: CircularProgressIndicator(
                  color: AppColors.primaryGreen))
          : state.query.isEmpty
              ? _buildEmptyState()
              : state.results == null || state.results!.isEmpty
                  ? _buildNoResults(state.query)
                  : _buildResults(context, state),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search, size: 80, color: AppColors.textSecondary.withOpacity(0.3)),
          const SizedBox(height: 16),
          const Text(
            'Rechercher des enseignements,\naudios, vidéos ou questions',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildNoResults(String query) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off,
              size: 64, color: AppColors.textSecondary),
          const SizedBox(height: 16),
          Text(
            'Aucun résultat pour "$query"',
            style: const TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildResults(BuildContext context, SearchState state) {
    final results = state.results!;
    return ListView(
      padding: const EdgeInsets.all(AppDimensions.screenPaddingH),
      children: [
        Text(
          '${results.totalCount} résultat(s) pour "${state.query}"',
          style: const TextStyle(
              color: AppColors.textSecondary, fontSize: 13),
        ),
        const SizedBox(height: 16),
        if (results.teachings.isNotEmpty) ...[
          _SectionTitle(title: 'Enseignements (${results.teachings.length})'),
          ...results.teachings.map((t) => ListTile(
                leading: const Icon(Icons.menu_book,
                    color: AppColors.primaryGreen),
                title: Text(t.title, maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                subtitle: Text(t.category),
                onTap: () => context.go('/enseignements/${t.id}'),
              )),
        ],
        if (results.audios.isNotEmpty) ...[
          _SectionTitle(title: 'Audios (${results.audios.length})'),
          ...results.audios.map((a) => ListTile(
                leading: const Icon(Icons.music_note,
                    color: AppColors.primaryGreen),
                title: Text(a.title, maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                subtitle: Text(a.category),
                onTap: () => context.go('/audios/${a.id}'),
              )),
        ],
        if (results.videos.isNotEmpty) ...[
          _SectionTitle(title: 'Vidéos (${results.videos.length})'),
          ...results.videos.map((v) => ListTile(
                leading: const Icon(Icons.play_circle_outline,
                    color: AppColors.primaryGreen),
                title: Text(v.title, maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                subtitle: Text(v.category),
                onTap: () => context.go('/videos/${v.id}'),
              )),
        ],
        if (results.questions.isNotEmpty) ...[
          _SectionTitle(title: 'Questions (${results.questions.length})'),
          ...results.questions.map((q) => ListTile(
                leading: const Icon(Icons.question_answer_outlined,
                    color: AppColors.primaryGreen),
                title: Text(q.question, maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                subtitle: Text(q.category),
                onTap: () => context.go('/questions/${q.id}'),
              )),
        ],
      ],
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Text(
        title,
        style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryGreen),
      ),
    );
  }
}
