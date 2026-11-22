import { describe, expect, it } from '@jest/globals';
import { parse } from './index';

describe('Нова поведінка: валідація межі довжини рядка (Крок 02 · Лабораторна 4)', () => {
  it('відхиляє винятком рядок довжиною рівно 100 символів згідно з повідомленням "between 1 and 99"', () => {
    // Рядок довжиною рівно 100 символів: 98 одиниць + 'ms'
    const str100 = `${'1'.repeat(98)}ms`;
    expect(str100.length).toBe(100);

    // Очікувана нова поведінка: довжина 100 символів має викидати помилку
    expect(() => parse(str100)).toThrow(
      'Value provided to ms.parse() must be a string with length between 1 and 99',
    );
  });
});
