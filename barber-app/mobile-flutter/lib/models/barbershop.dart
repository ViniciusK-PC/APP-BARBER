class Barbershop {
  final String id;
  final String name;
  final String address;
  final String? phone;
  final String? description;
  final String? openTime;
  final String? closeTime;
  final bool isActive;

  Barbershop({
    required this.id,
    required this.name,
    required this.address,
    this.phone,
    this.description,
    this.openTime,
    this.closeTime,
    required this.isActive,
  });

  // Compatibilidade com telas que usam openingHours
  String get openingHours {
    if (openTime != null && closeTime != null) {
      return '$openTime - $closeTime';
    }
    return 'Horário não informado';
  }

  bool get active => isActive;

  factory Barbershop.fromJson(Map<String, dynamic> json) {
    return Barbershop(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      phone: json['phone'],
      description: json['description'],
      openTime: json['openTime'],
      closeTime: json['closeTime'],
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'phone': phone,
      'description': description,
      'openTime': openTime,
      'closeTime': closeTime,
      'isActive': isActive,
    };
  }
}
