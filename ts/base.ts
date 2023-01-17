import 'reflect-metadata';

export type ClassConstructor<T = any> = {new(): T};
const MIXINS = '--mixins--';
const PROPS = '--props--';

function buildInstance() {

}

export class BaseMixin<T = any> {
    constructor() {
        const ctor = this.constructor;
        const ctors = ctor[MIXINS];
        ctor[PROPS] = Object.getOwnPropertyNames(ctor.prototype).concat(Object.getOwnPropertyNames(this));

        (ctors || []).forEach((c: ClassConstructor) => {
            const mixin = new c();
            const mixinProps = Object.getOwnPropertyNames(mixin);

            mixinProps.forEach(p => this[p] = mixin[p]);
        });
    }

    public get m(): T {
        return this as any;
    }
}

function _copyProperties(src: ClassConstructor, dest: ClassConstructor) {
    Object.getOwnPropertyNames(src.prototype)
        .filter(k => k != 'constructor')
        .forEach(k => {
            Object.defineProperty(dest.prototype, k, Object.getOwnPropertyDescriptor(src.prototype, k))
        });
}

export function Mixin(...ctors: Array<ClassConstructor>) {
    return function(ctor: ClassConstructor): any {
        ctor[MIXINS] = ctors;
        (ctors || []).forEach(c => {
            _copyProperties(c, ctor);
            if (c[MIXINS]) {
                _copyProperties(Object.getPrototypeOf(c), ctor);
            }
        });

        // const result = class extends ctor {
        //     constructor(...args: Array<any>) {
        //         super(...(args as []));
        //         ctor[PROPS] = Object.getOwnPropertyNames(ctor.prototype).concat(Object.getOwnPropertyNames(this));

        //         (ctors || []).forEach(c => {
        //             const mixin = new c();
        //             const mixinProps = Object.getOwnPropertyNames(mixin);
        //             if (!ALLOW_NAME_DUPLICATES && mixinProps.filter(p => ctor[PROPS].indexOf(p) != -1).length > 0) {
        //                 throwError(c);
        //             }

        //             mixinProps.forEach(p => this[p] = mixin[p]);

        //             ctor[PROPS].push(...mixinProps);
        //             //ctor[MIXINS].push(mixin);
        //         })
        //     }
        // }

        // Object.defineProperty(result, 'name', { value: ctor.name, writable: false });
        // Object.getOwnPropertyNames(ctor)
        //     .filter(k => ['length', 'prototype', 'name'].indexOf(k) == -1)
        // .forEach(k => Object.defineProperty(result, k, { value: ctor[k], writable: true, }));
        // return result;

        return ctor;
    }
}

export function MixinFactory<T1 = {}, T2 = {}, T3 = {}, T4 = {}, T5 = {}, T6 = {}, T7 = {}, T8 = {}, T9 = {}, T10 = {}>(t1?: ClassConstructor<T1>, t2?: ClassConstructor<T2>, t3?: ClassConstructor<T3>, t4?: ClassConstructor<T4>, t5?: ClassConstructor<T5>, t6?: ClassConstructor<T6>, t7?: ClassConstructor<T7>, t8?: ClassConstructor<T8>, t9?: ClassConstructor<T9>, t10?: ClassConstructor<T10>): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 &T9 & T10 {
    const args = [];
    const addArg = (arg: ClassConstructor) => {
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
