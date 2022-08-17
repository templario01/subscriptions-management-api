import { Abstract, Provider, Type } from '@nestjs/common'

export function provideService<
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  TProvide extends string | symbol | Function | Type<any> | Abstract<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TUseClass extends Type<any>,
>(provide: TProvide, useClass: TUseClass): Provider<TProvide> {
  return {
    provide,
    useClass,
  }
}
