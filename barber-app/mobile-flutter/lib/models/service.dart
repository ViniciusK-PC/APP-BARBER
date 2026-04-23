class Service {
  final int id;
  final String name;
  final String? description;
  final double price;
  final int duration;
  final bool active;
  final int barbershopId;

  Service({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    required this.duration,
    required this.active,
    required this.barbershopId,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: (json['price'] as num).toDouble(),
      duration: json['duration'],
      active: json['active'] ?? true,
      barbershopId: json['barbershopId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'duration': duration,
      'active': active,
      'barbershopId': barbershopId,
    };
  }

  String get formattedPrice => 'R\$ ${price.toStringAsFixed(2)}';
  String get formattedDuration => '$duration min';
}
