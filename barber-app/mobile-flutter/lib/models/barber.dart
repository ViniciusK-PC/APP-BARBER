class Barber {
  final String id;
  final String name;
  final String? specialty;
  final String? phone;
  final String? email;
  final bool isActive;
  final String barbershopId;

  Barber({
    required this.id,
    required this.name,
    this.specialty,
    this.phone,
    this.email,
    required this.isActive,
    required this.barbershopId,
  });

  bool get active => isActive;

  factory Barber.fromJson(Map<String, dynamic> json) {
    return Barber(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      specialty: json['specialty'],
      phone: json['phone'],
      email: json['email'],
      isActive: json['isActive'] ?? true,
      barbershopId: json['barbershopId']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'specialty': specialty,
      'phone': phone,
      'email': email,
      'isActive': isActive,
      'barbershopId': barbershopId,
    };
  }
}
