# Neverclear

Stupid and extensible at-runtime type checking.

## About

### Why?
**Neverclear is useful in situations requiring at-runtime, static type-checking in a manner where any necessary features can be quickly implemented by-hand, while retaining IntelliSense/autocomplete.**

### Name?
**Neverclear's name is an unintentional play-on-words on the alcoholic beverage, Everclear - However, the name represents an abstract layer over set, runtime type-checking.**

### Comparisons
**Compare Neverclear to popular validation libraries.**

- Zod
  - **NO** coercion: Entirely static type-checking.
  - **NO** excessive validators: Only the essentials.
  - **EXTENDABLE**: Add your own traits and validators.
  - **SIMPLE**: No complex syntax or API.
- IO-TS
  - **LESS** confusing: A simplified API reduces the learning curve and eliminates the need for classes.
  - **OVERALL** similar, excluding class-based APIs, extensible traits & validators.
- Joi
  - **LESS** confusing: No `ref`s, `any`s.
  - **ABSTRACTED**: Rather than `alternative`, `oneOf` is provided with a more easy-to-use schema.
  - **NUMBER DEPTH**: While Joi provides `precision` as an extension of `number`, Neverclear provides set types for `int`, `double` and `long`, with the ability to validate any other precision via the `Accuracy` validator.

## Installation
```bash
bun i github:hrtplanner/neverclear
```

## Usage

### Structs
```js
import { t, struct } from 'neverclear';
import { Range, RegEx } from 'neverclear/validators';
import { string, int, property } from '../src/types';

const Person = t(
    struct(
        property("name", string(), [
            Range(3, 32)
        ]),
        property("age", int(), [
            Range(13, 100)
        ]),
        property("email", string(), [
            RegEx(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
        ])
    )
);

const person = Person.new({
    name: "John Doe",
    age: 25,
    email: "hello@example.arpa"
});

console.log(person); // { name: "John Doe", age: 25, email: "hello@example.arpa" }
```

### Enums
```js
import { t, enumerable } from 'neverclear';
import { applyTraits, EnumTrait } from '../src/traits';

const Role = applyTraits(EnumTrait)(t(
    enumerable(
        "Administrator",
        "Moderator",
        "User"
    )
));

const role = Role.new("Administrator");

console.log(role); // "Administrator"
```

*This horrible code made me cry, too*