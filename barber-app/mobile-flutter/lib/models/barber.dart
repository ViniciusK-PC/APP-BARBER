class Barber {
  final int id;
  final String name;
  final String? specialty;
  final bool active;
  final int barbershopId;

  Barber({
    required this.id,
    required this.name,
    this.specialty,
    required this.active,
    required this.barbershopId,
  });

  factory Barber.fromJson(Map<String, dynamic> json) {
    return Barber(
      id: json['id'],
      name: json['name'],
      specialty: json['specialty'],
      active: json['active'] ?? true,
      barbershopId: json['barbershopId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'specialty': specialty,
      'active': active,
      'barbershopId': barbershopId,
    };
  }
}
