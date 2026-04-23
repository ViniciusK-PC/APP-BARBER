import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Cores do tema
  static const Color background = Color(0xFF1a1a2e);
  static const Color gold = Color(0xFFC9A84C);
  static const Color secondary = Color(0xFF16213e);
  static const Color cardColor = Color(0xFF0f3460);
  static const Color white = Colors.white;
  static const Color grey = Color(0xFF9E9E9E);
  static const Color error = Color(0xFFE53935);
  static const Color success = Color(0xFF43A047);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: gold,
      colorScheme: const ColorScheme.dark(
        primary: gold,
        secondary: secondary,
        surface: cardColor,
        background: background,
        error: error,
      ),
      
      // Texto
      textTheme: GoogleFonts.poppinsTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: white, fontSize: 32, fontWeight: FontWeight.bold),
          displayMedium: TextStyle(color: white, fontSize: 28, fontWeight: FontWeight.bold),
          displaySmall: TextStyle(color: white, fontSize: 24, fontWeight: FontWeight.bold),
          headlineMedium: TextStyle(color: white, fontSize: 20, fontWeight: FontWeight.w600),
          headlineSmall: TextStyle(color: white, fontSize: 18, fontWeight: FontWeight.w600),
          titleLarge: TextStyle(color: white, fontSize: 16, fontWeight: FontWeight.w600),
          bodyLarge: TextStyle(color: white, fontSize: 16),
          bodyMedium: TextStyle(color: white, fontSize: 14),
          bodySmall: TextStyle(color: grey, fontSize: 12),
        ),
      ),
      
      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(
          color: white,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: const IconThemeData(color: gold),
      ),
      
      // Card
      cardTheme: CardThemeData(
        color: cardColor,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      
      // Botões
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold,
          foregroundColor: background,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // Input
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: gold, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: error, width: 2),
        ),
        labelStyle: const TextStyle(color: grey),
        hintStyle: const TextStyle(color: grey),
      ),
      
      // Bottom Navigation
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: secondary,
        selectedItemColor: gold,
        unselectedItemColor: grey,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
