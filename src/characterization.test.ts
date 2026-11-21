import { describe, expect, it } from '@jest/globals';
import { format, ms, parse } from './index';

describe('Характеризаційні тести (Крок 01 · Лабораторна 4)', () => {
  it('char-01: дефолтна одиниця — ms для числових рядків без зазначення розмірності', () => {
    // Фіксує поведінку: числовий рядок розбирається як мілісекунди
    expect(parse('42')).toBe(42);
    expect(parse('-15')).toBe(-15);
    expect(ms('12345')).toBe(12345);
  });

  it('char-02: коректний розбір відʼємних інтервалів часу для різних одиниць виміру', () => {
    // Фіксує поточний розрахунок відʼємних значень
    expect(ms('-1.5 hrs')).toBe(-5400000);
    expect(ms('-100ms')).toBe(-100);
    expect(ms('-0.5 days')).toBe(-43200000);
  });

  it('char-03: фіксований розрахунок місяця базується на середній тривалості року (30.4375 днів)', () => {
    // 1 y = 365.25 днів; 1 mo = y / 12 = 2,629,800,000 ms
    expect(ms('1mo')).toBe(2629800000);
    expect(ms('1 month')).toBe(2629800000);
    expect(ms('12 months')).toBe(31557600000);
  });

  it('char-04: гранична межа довжини рядка (повідомлення вказує 1-99, але код перевіряє > 100, тому довжина 100 проходить, а 101+ викидає виняток — зафіксовано як баг)', () => {
    // Невідповідність специфікації: довжина 100 пропускається (str.length > 100 повертає false)
    const str100 = `${'1'.repeat(98)}ms`;
    expect(str100.length).toBe(100);
    expect(() => parse(str100)).not.toThrow();

    // Лише довжина 101+ викидає помилку
    const str101 = `${'1'.repeat(99)}ms`;
    expect(str101.length).toBe(101);
    expect(() => parse(str101)).toThrow(
      'Value provided to ms.parse() must be a string with length between 1 and 99',
    );
  });

  it('char-05: поріг переходу в множину у format() спрацьовує строго на 1.5x від поточної одиниці', () => {
    // 1.5 секунди (1500 ms) стає '2 seconds', але 1499 ms лишається '1 second'
    expect(format(1499, { long: true })).toBe('1 second');
    expect(format(1500, { long: true })).toBe('2 seconds');
    // 1.5 хвилини (90000 ms) стає '2 minutes', але 89999 ms лишається '1 minute'
    expect(format(89999, { long: true })).toBe('1 minute');
    expect(format(90000, { long: true })).toBe('2 minutes');
  });

  it('char-06: регістронезалежність працює для комбінацій великих і малих літер в одиницях', () => {
    expect(ms('1.5 DAYS')).toBe(129600000);
    expect(ms('1.5 Days')).toBe(129600000);
    expect(ms('1.5 days')).toBe(129600000);
    expect(ms('500 MILLISECONDS')).toBe(500);
  });

  it('char-07: валідація вхідних даних ms() та format() кидає типізовані винятки на невалідних типах', () => {
    // @ts-expect-error - перевірка рантайм валідації на невалідний тип
    expect(() => ms(null)).toThrow('Value provided to ms() must be a string or number');
    // @ts-expect-error - перевірка рантайм валідації на об'єкт
    expect(() => ms({})).toThrow('Value provided to ms() must be a string or number');

    expect(() => format(Infinity)).toThrow('Value provided to ms.format() must be of type number.');
    expect(() => format(NaN)).toThrow('Value provided to ms.format() must be of type number.');
  });
});
