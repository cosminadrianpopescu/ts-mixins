import 'reflect-metadata';

export type ClassConstructor<T = any> = {new(): T};
const MIXINS = '--mixins--';
const PROPS = '--props--';

export class BaseMixin<T = any> {
    public get m(): T {
        return this as any;
    }
}

function throwError(c: ClassConstructor) {
    console.error(`There are properties in ${c.name} that are found in the child class`);
    throw 'NAME_COLLISION';
}

export function Mixin(...ctors: Array<ClassConstructor>) {
    return function(ctor: ClassConstructor): any {
        ctor[MIXINS] = [];
        (ctors || []).forEach(c => {
            const props = Object.getOwnPropertyNames(ctor.prototype);
            Object.getOwnPropertyNames(c.prototype)
                .filter(k => k != 'constructor')
                .forEach(k => {
                    if (props.indexOf(k) != -1) {
                        throwError(c);
                    }

                    ctor.prototype[k] = c.prototype[k];
                })
        });

        const result = class extends ctor {
            constructor(...args: Array<any>) {
                super(...(args as []));
                ctor[PROPS] = Object.getOwnPropertyNames(ctor.prototype).concat(Object.getOwnPropertyNames(this));

                (ctors || []).forEach(c => {
                    const mixin = new c();
                    const mixinProps = Object.getOwnPropertyNames(mixin);
                    if (mixinProps.filter(p => ctor[PROPS].indexOf(p) != -1).length > 0) {
                        throwError(c);
                    }

                    mixinProps.forEach(p => this[p] = mixin[p]);

                    ctor[PROPS].push(...mixinProps);
                    ctor[MIXINS].push(mixin);
                })
            }
        }

        Object.defineProperty(result, 'name', { value: ctor.name, writable: false });
        Object.getOwnPropertyNames(ctor)
            .filter(k => ['length', 'prototype', 'name'].indexOf(k) == -1)
        .forEach(k => Object.defineProperty(result, k, { value: ctor[k], writable: true, }));
        return result;
    }
}

export function MixinFactory<T1 = {}, T2 = {}, T3 = {}, T4 = {}, T5 = {}, T6 = {}, T7 = {}, T8 = {}, T9 = {}, T10 = {}>(t1?: ClassConstructor<T1>, t2?: ClassConstructor<T2>, t3?: ClassConstructor<T3>, t4?: ClassConstructor<T4>, t5?: ClassConstructor<T5>, t6?: ClassConstructor<T6>, t7?: ClassConstructor<T7>, t8?: ClassConstructor<T8>, t9?: ClassConstructor<T9>, t10?: ClassConstructor<T10>): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 &T9 & T10 {
    const args = [];
    const addArg = (arg) => {
        if (!!arg) {
            args.push(arg);
        }
    }
    addArg(t1);
    addArg(t2);
    addArg(t3);
    addArg(t4);
    addArg(t5);
    addArg(t6);
    addArg(t7);
    addArg(t8);
    addArg(t9);
    addArg(t10);
    const f = Mixin.apply(undefined, args);
    const c = f(class {});
    return new c();
}