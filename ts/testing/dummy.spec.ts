import { BaseMixin, Mixin, MixinFactory } from "../base";

class BaseApp<T = any> extends BaseMixin<T> {
    private _x: string;

    public baseMethod() {
        this._x = 'x';
    }
}

class ChildWithoutMixin extends BaseApp {
    constructor() {
        super();
        this.baseMethod();
    }
}

class WithFeature1 {
    private _f1;
    private _init = 'init';
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

class WithFeatureDuplicate {
    private _f2;
    public feature2() {

    }
}

@Mixin(WithFeature1, WithFeature2)
class ChildWithMixins extends BaseApp<WithFeature1 & WithFeature2> {
}

class ChildWithMixinsError extends BaseApp<WithFeature2 & WithFeatureDuplicate> {

}

describe('Tests the library', () => {
    it('Jasmine should word', () => {
        expect(true).toBeTrue();
    });

    it('Tests that mixins can be ignored', () => {
        const x = new ChildWithoutMixin();
        expect(x['_x']).toEqual('x');
    });

    it('Tests that the mixins work', () => {
        const x = new ChildWithMixins();
        const props = Object.getOwnPropertyNames(x);
        expect(props.indexOf('_f1') != -1).toBeTrue();
        expect(props.indexOf('_f2') != -1).toBeTrue();
        expect(props.indexOf('_init') != -1).toBeTrue();
        expect(props.indexOf('_x') != -1).toBeTrue();
        expect(x.m['_f1']).toBeUndefined();
        expect(x.m['_f2']).toBeUndefined();
        expect(x.m['_init']).toEqual('init')
        x.m.feature1();
        x.m.feature2();

        expect(x.m['_f1']).toEqual('f1');
        expect(x.m['_f2']).toEqual('f2');
    })

    it('Tests an error', () => {
        return new Promise<void>(resolve => {
            try {
                Mixin(WithFeature2, WithFeatureDuplicate)(ChildWithMixinsError);
            }
            catch (err) {
                expect(err).toEqual('NAME_COLLISION');
                resolve();
            }
        })
    });

    it('Tests the factory', () => {
        const x = MixinFactory(WithFeature1, WithFeature2);
        const props = Object.getOwnPropertyNames(x);
        expect(props.indexOf('_f1') != -1).toBeTrue();
        expect(props.indexOf('_f2') != -1).toBeTrue();
        expect(props.indexOf('_init') != -1).toBeTrue();
        expect(x['_f1']).toBeUndefined();
        expect(x['_f2']).toBeUndefined();
        expect(x['_init']).toEqual('init')
        x.feature1();
        x.feature2();

        expect(x['_f1']).toEqual('f1');
        expect(x['_f2']).toEqual('f2');
    });
})
