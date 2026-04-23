class User {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final bool isAdmin;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.isAdmin,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      isAdmin: json['isAdmin'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'isAdmin': isAdmin,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
