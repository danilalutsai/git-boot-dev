<<<<<<< HEAD
console.log('hello, world');
=======

// ============================================================
// treesitter-zoo.ts — dense TypeScript syntax sampler
// ============================================================

/* ---------- 1. Literals & primitives ---------- */
const int = 42;
const float = 3.141_59;
const big = 9_007_199_254_740_993n;
const hex = 0xff;
const bin = 0b1010;
const oct = 0o755;
const single = 'single';
const double = "double";
const tpl = `interpolated ${int} and ${single.length}`;
const re = /^(?<year>\d{4})-(\d{2})$/gu;
const nil = null;
const undef = undefined;
const bool = true;

/* ---------- 2. as const & derived unions ---------- */
const ROUTES = ['home', 'projects', 'setup'] as const;
type Route = (typeof ROUTES)[number];

/* ---------- 3. Enums ---------- */
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

const enum Flags {
  None = 0,
  Read = 1 << 0,
  Write = 1 << 1,
  All = Read | Write,
}

/* ---------- 4. Interfaces: call, construct, index signatures ---------- */
interface Callable {
  (input: string): number;
  <T>(input: readonly T[]): T | undefined;
  readonly tag: string;
  [key: `data-${string}`]: unknown;
}

interface Constructable {
  new (x: number): { value: number };
}

/* ---------- 5. Declaration merging ---------- */
interface Merged {
  a: string;
}
interface Merged {
  b: number;
}

/* ---------- 6. Generics: constraints, defaults, variance ---------- */
interface Producer<out T> {
  get(): T;
}
interface Consumer<in T> {
  set(value: T): void;
}
type Dict<V, K extends string = string> = Record<K, V>;

/* ---------- 7. Conditional types + infer ---------- */
type ElementOf<T> = T extends readonly (infer E)[] ? E : never;
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;
type FnReturn<T> = T extends (...args: never[]) => infer R ? R : never;
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never;

/* ---------- 8. Mapped types + key remapping + modifiers ---------- */
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };
type Frozen<T> = { +readonly [K in keyof T]+?: T[K] };

/* ---------- 9. Template literal types ---------- */
type EventName<T extends string> = `on${Capitalize<T>}`;
type CssVar = `--${string}`;
type CssColor = `#${string}`;

/* ---------- 10. Tuples ---------- */
type Pair = [first: number, second: string];
type Variadic<T extends unknown[]> = [head: string, ...rest: T];
type Triple = readonly [1, 2, 3];

/* ---------- 11. Discriminated union + exhaustiveness ---------- */
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'rect'; w: number; h: number };

function assertNever(x: never): never {
  throw new Error(`unhandled: ${JSON.stringify(x)}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    case 'rect':
      return shape.w * shape.h;
    default:
      return assertNever(shape);
  }
}

/* ---------- 12. Type guards & assertion functions ---------- */
function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function assertDefined<T>(v: T | null | undefined): asserts v is T {
  if (v == null) throw new Error('nullish');
}

/* ---------- 13. Function overloads ---------- */
function parse(input: string): object;
function parse(input: string, reviver: (k: string, v: unknown) => unknown): object;
function parse(input: string, reviver?: (k: string, v: unknown) => unknown): object {
  return JSON.parse(input, reviver) as object;
}

/* ---------- 14. Classes: every modifier ---------- */
abstract class Base<T> implements Producer<T> {
  static readonly kind: string = 'base';
  static #instances = 0;

  static {
    Base.#instances = 0;
  }

  #secret: T;
  protected label: string;
  declare readonly brand: string;
  accessor tally = 0;

  constructor(
    protected readonly seed: T,
    label = 'anon',
  ) {
    this.#secret = seed;
    this.label = label;
    Base.#instances++;
  }

  get value(): T {
    return this.#secret;
  }
  set value(next: T) {
    this.#secret = next;
  }

  get(): T {
    return this.#secret;
  }

  abstract describe(): string;

  protected static count(): number {
    return Base.#instances;
  }
}

class Concrete extends Base<number> {
  override describe(): string {
    return `${Concrete.kind}:${this.label}:${this.seed}:${this.tally}`;
  }
}

/* ---------- 15. Standard decorators ---------- */
function logged<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  return function (this: This, ...args: Args): Return {
    console.log(`call ${String(context.name)}`);
    return target.call(this, ...args);
  };
}

class Service {
  @logged
  fetchAll(page: number): string {
    return `page ${page}`;
  }
}

/* ---------- 16. Generators & async ---------- */
function* counter(limit: number): Generator<number, string, undefined> {
  for (let i = 0; i < limit; i++) yield i;
  return 'done';
}

async function* streamChunks(): AsyncGenerator<string> {
  yield await Promise.resolve('chunk');
}

async function consume(): Promise<void> {
  for await (const chunk of streamChunks()) console.log(chunk);
}

/* ---------- 17. Modern operators ---------- */
declare const maybe: { deep?: { value?: string[] } } | undefined;
const chained = maybe?.deep?.value?.[0] ?? 'fallback';
const forced = maybe!.deep!.value!.length;

let acc: number | null = 0;
acc ||= 5;
acc &&= 10;
acc ??= 20;

/* ---------- 18. Destructuring ---------- */
const { a: renamed = 'default', ...rest } = { a: 'x', b: 1, c: 2 };
const [head = 0, , third, ...tail] = [1, 2, 3, 4, 5];

function makeUrl({ host = 'localhost', port = 8080 }: { host?: string; port?: number } = {}) {
  return `${host}:${port}`;
}

/* ---------- 19. satisfies ---------- */
const palette = {
  bg: '#14130f',
  fg: '#e8e3d8',
  accent: '#e0a458',
} satisfies Record<string, CssColor>;

/* ---------- 20. Namespaces & global augmentation ---------- */
namespace Geometry {
  export const ORIGIN = { x: 0, y: 0 } as const;
  export interface Point {
    x: number;
    y: number;
  }
  export namespace Nested {
    export type Vector = readonly [number, number];
  }
}

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

/* ---------- 21. Labels, control flow, try/catch ---------- */
function scan(grid: readonly (readonly number[])[], target: number): [number, number] | null {
  outer: for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (row === undefined) continue outer;
    for (let c = 0; c < row.length; c++) {
      if (row[c] === target) return [r, c];
    }
  }
  return null;
}

function risky(): string {
  try {
    throw new TypeError('boom');
  } catch (err: unknown) {
    if (err instanceof TypeError) return err.message;
    return 'unknown';
  } finally {
    console.log('cleanup');
  }
}

/* ---------- 22. Tagged templates, computed keys, unique symbol ---------- */
function sql(strings: TemplateStringsArray, ...values: readonly (string | number)[]): string {
  return strings.reduce((out, s, i) => out + s + String(values[i] ?? ''), '');
}
const query = sql`SELECT * FROM t WHERE id = ${42} AND name = ${'x'}`;

const KEY: unique symbol = Symbol('key');
const computed = {
  [KEY]: 'symbol-keyed',
  [`dynamic-${int}`]: true,
  ['literal']: 1,
};

/* ---------- 23. Utility types ---------- */
interface Project {
  id: string;
  title: string;
  tags?: readonly string[];
}

type P = Partial<Project>;
type R = Required<Project>;
type O = Omit<Project, 'id'>;
type Pk = Pick<Project, 'id' | 'title'>;
type Ex = Extract<Shape, { kind: 'circle' }>;
type Exc = Exclude<Route, 'home'>;
type NN = NonNullable<string | null>;
type Params = Parameters<typeof area>;
type Ret = ReturnType<typeof area>;
type Inst = InstanceType<typeof Concrete>;
type Keys = keyof Project;
type Indexed = Project['tags'];

/* ---------- 24. Exports ---------- */
export type { Shape, Route, Getters, Callable, Constructable, Merged, Consumer };
export type { Dict, ElementOf, Unwrap, FnReturn, IsUnion, Mutable, Frozen };
export type { EventName, CssVar, Pair, Variadic, Triple, P, R, O, Pk, Ex, Exc, NN };
export type { Params, Ret, Inst, Keys, Indexed };
export { area, isString, assertDefined, parse, counter, consume, scan, risky, Direction };
export { Geometry, Service, makeUrl, palette, computed, query, sql, Flags };
export default Concrete;

>>>>>>> 2816b980da4b0821ed3ca2d849b54b8e0d831946
