class Barbershop {
  final int id;
  final String name;
  final String address;
  final String? phone;
  final String? description;
  final String openingHours;
  final bool active;

  Barbershop({
    required this.id,
    required this.name,
    required this.address,
    this.phone,
    this.description,
    required this.openingHours,
    required this.active,
  });

  factory Barbershop.fromJson(Map<String, dynamic> json) {
    return Barbershop(
      id: json['id'],
      name: json['name'],
      address: json['address'],
      phone: json['phone'],
      description: json['description'],
      openingHours: json['openingHours'],
      active: json['active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'phone': phone,
      'description': description,
      'openingHours': openingHours,
      'active': active,
    };
  }
}
