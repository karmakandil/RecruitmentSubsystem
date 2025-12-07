"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinLessThanMax = void 0;
const class_validator_1 = require("class-validator");
let MinLessThanMax = class MinLessThanMax {
    validate(value, args) {
        const relatedPropertyName = args.constraints[0];
        const relatedValue = args.object[relatedPropertyName];
        if (value === undefined || relatedValue === undefined)
            return true;
        return value < relatedValue;
    }
    defaultMessage(args) {
        const relatedPropertyName = args.constraints[0];
        return `${args.property} must be less than ${relatedPropertyName}`;
    }
};
exports.MinLessThanMax = MinLessThanMax;
exports.MinLessThanMax = MinLessThanMax = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'minLessThanMax', async: false })
], MinLessThanMax);
//# sourceMappingURL=min-less-than-max.validator.js.map