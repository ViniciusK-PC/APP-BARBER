class Service {
  final String id;
  final String name;
  final String? description;
  final double price;
  final int duration;
  final bool isActive;
  final String barbershopId;

  Service({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    required this.duration,
    required this.isActive,
    required this.barbershopId,
  });

  bool get active => isActive;

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      description: json['description'],
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      duration: json['duration'] ?? 30,
      isActive: json['isActive'] ?? true,
      barbershopId: json['barbershopId']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'duration': duration,
      'isActive': isActive,
      'barbershopId': barbershopId,
    };
  }

  String get formattedPrice => 'R\$ ${price.toStringAsFixed(2)}';
  String get formattedDuration => '$duration min';
}
