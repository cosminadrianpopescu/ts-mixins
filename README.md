# Typescript Mixins

Small library to create simple mixins with methods added to the classes and
autocomplete and error checking from the compiler.

## Installation

```
npm install --save ts-mixins
```

## Usage

This library comes handy in the following scenarios: 

* you might want to enrich an existing class with some given features.
* you might want to compose a new class from some existing features. 

Given the following classes: 

```typescript
class WithFeature1 {
    private _f1;
    private _init = 'init';
    public stringParam = 'abc';
    public feature1() {
        this._f1 = 'f1';
    }
}

class WithFeature2 {
    private _f2;
    public feature2() {
        this._f2 = 'f2';
    }
}

class MyService {

}
```

You might want to enrigh the `MyService` class with the features provided by
`WithFeature1` and `WithFeature2`. This being javascript after all, of course
that this is very easy to do. For example: 

```typescript
const x = Object.create(Object.assign(MyService.prototype, WithFeature1.prototype, WithFeature2.prototype));
```

Then `x` would have access to the 2 features, `feature1` and `feature2`. The
problem is that the resulting object `x` is of type `any`, so we don't have
any type checking, references or intellisense autocomplete.

So, while doing `x.feature1()` or `x.feature2()` will work perfectly fine, all
the niceties that come with using Typescript instead of javascript will be
gone. 

This library proposes an alternative way of doing the mixins, keeping all the
type checking that typescript offers. 

## Method 1: `Mixin` annotation

If you are inside of a framework where if you don't instantiate your classes,
or if you want to have the features available inside of the `MyService` other
methods, then you should use the `Mixin` annotation, like this:

```typescript
@Mixin(WithFeature1, WithFeature2)
class ChildWithMixins extends BaseMixin<WithFeature1 & WithFeature2> {
}
```

This will result in a new class enriched with the prototypes of `WithFeature1`
and `WithFeature2`. The `extends` clause is the one telling the compiler what
new features have been added to the class.

```typescript
@Mixin(WithFeature1, WithFeature2)
class ChildWithMixins extends BaseMixin<WithFeature1 & WithFeature2> {
    public method() {
        this.| 
            +------------+ // The only autocomplete option that you have
            | method     | // here, is method.
            +------------+
    }

    public method() {
        this.m.|
              +-------------+ 
              | stringParam | // Using the `m` object (from mixins), you 
              | feature1    | // get all the features added by the `Mixin`
              | feature2    | // annotation
              +-------------+
    }
}
```

## Method 2: `MixinFactory` function

If you don't care about what is inside your classes, or you just want to
create a new class from multiple defined classes, you can use the
`MixinFactory` function. By using this function, you don't have to use the `m`
object anymore. 

```typescript
const instance = MixinFactory(WithFeature1, WithFeature2);

instance.
        +--------------+
        | stringParams |
        | feature1     |
        | feature2     |
        +--------------+
```

As you can see, here you can directly access the properties of the mixins,
without the need of declaring any generic type and without the need to use any
`m` object.

## Downsides

The only downside of this, is the extending of the `BaseMixin` class in order
to make the compiler happy (when using the `m` object).

But please note that the `BaseMixin` has the generic type optional. This is
because you might want to extend your own base class in a bigger project. In
case that you have, let's say a `BaseClass` that will extend the `BaseMixin`
class, then all your classes can extend the `BaseClass`, and you only make
them generic when you need to.

```typescript
export class BaseClass<T = {}> extends BaseMixin<T> {
    ...
}

export class ChildClass1 extends BaseClass {
    ...
}

@Mixin(WithFeature1, WithFeature2)
export class ChildClass2 extends BaseClass<WithFeature1 & WithFeature2> {

}
```

Notice that the `ChildClass1` is not generic, since it does need any features.
But `ChildClass2`, which needs the features `WithFeature1` and `WithFeature2`,
is generic of the type `WithFeature1 & WithFeature2`.
