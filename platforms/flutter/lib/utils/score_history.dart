import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';

class SavedRunScore {
  final String id;
  final String updatedAt;
  final String difficultyLabel;
  final String status; // 'playing', 'victory', 'gameOver'
  final int year;
  final int score;
  final double contributionRate;
  final double pensionLevel;
  final double generationCapitalFund;

  const SavedRunScore({
    required this.id,
    required this.updatedAt,
    required this.difficultyLabel,
    required this.status,
    required this.year,
    required this.score,
    required this.contributionRate,
    required this.pensionLevel,
    required this.generationCapitalFund,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'updatedAt': updatedAt,
        'difficultyLabel': difficultyLabel,
        'status': status,
        'year': year,
        'score': score,
        'contributionRate': contributionRate,
        'pensionLevel': pensionLevel,
        'generationCapitalFund': generationCapitalFund,
      };

  factory SavedRunScore.fromJson(Map<String, dynamic> json) {
    return SavedRunScore(
      id: (json['id'] ?? '').toString(),
      updatedAt: (json['updatedAt'] ?? '').toString(),
      difficultyLabel: (json['difficultyLabel'] ?? 'Schwer').toString(),
      status: (json['status'] ?? 'playing').toString(),
      year: (json['year'] as num?)?.toInt() ?? 2026,
      score: (json['score'] as num?)?.toInt() ?? 0,
      contributionRate: (json['contributionRate'] as num?)?.toDouble() ?? 18.6,
      pensionLevel: (json['pensionLevel'] as num?)?.toDouble() ?? 48.0,
      generationCapitalFund:
          (json['generationCapitalFund'] as num?)?.toDouble() ?? 12.0,
    );
  }
}

class ScoreHistoryStore {
  static File? _resolveStorageFile() {
    if (kIsWeb) return null;
    try {
      final String? baseDir = Platform.isWindows
          ? (Platform.environment['APPDATA'] ??
              Platform.environment['USERPROFILE'])
          : Platform.environment['HOME'];
      if (baseDir == null || baseDir.isEmpty) return null;
      final dir = Directory('$baseDir${Platform.pathSeparator}.generation_zukunft');
      if (!dir.existsSync()) {
        dir.createSync(recursive: true);
      }
      return File('${dir.path}${Platform.pathSeparator}scores.json');
    } catch (_) {
      return null;
    }
  }

  static Future<List<SavedRunScore>> load() async {
    final file = _resolveStorageFile();
    if (file == null || !await file.exists()) return [];
    try {
      final raw = await file.readAsString();
      final decoded = jsonDecode(raw);
      if (decoded is! List) return [];
      return decoded
          .whereType<Map<String, dynamic>>()
          .map(SavedRunScore.fromJson)
          .where((e) => e.id.isNotEmpty)
          .toList();
    } catch (_) {
      return [];
    }
  }

  static Future<List<SavedRunScore>> upsert(SavedRunScore entry) async {
    final existing = await load();
    final next = [
      entry,
      ...existing.where((item) => item.id != entry.id),
    ]..sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    final capped = next.take(20).toList();

    final file = _resolveStorageFile();
    if (file != null) {
      try {
        await file.writeAsString(
          jsonEncode(capped.map((e) => e.toJson()).toList()),
        );
      } catch (_) {}
    }
    return capped;
  }

  static Future<List<SavedRunScore>> clear() async {
    final file = _resolveStorageFile();
    if (file != null && await file.exists()) {
      try {
        await file.delete();
      } catch (_) {}
    }
    return [];
  }
}
