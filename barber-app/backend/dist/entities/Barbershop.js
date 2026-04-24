"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barbershop = void 0;
const typeorm_1 = require("typeorm");
const Barber_1 = require("./Barber");
const Service_1 = require("./Service");
let Barbershop = class Barbershop {
};
exports.Barbershop = Barbershop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Barbershop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Barbershop.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Barbershop.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Barbershop.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Barbershop.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Barbershop.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', default: '09:00:00' }),
    __metadata("design:type", String)
], Barbershop.prototype, "openTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', default: '18:00:00' }),
    __metadata("design:type", String)
], Barbershop.prototype, "closeTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Barbershop.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Barber_1.Barber, (barber) => barber.barbershop),
    __metadata("design:type", Array)
], Barbershop.prototype, "barbers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Service_1.Service, (service) => service.barbershop),
    __metadata("design:type", Array)
], Barbershop.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Barbershop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Barbershop.prototype, "updatedAt", void 0);
exports.Barbershop = Barbershop = __decorate([
    (0, typeorm_1.Entity)('barbershops')
], Barbershop);
