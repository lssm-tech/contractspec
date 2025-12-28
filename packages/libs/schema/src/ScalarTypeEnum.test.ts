import { describe, expect, it } from 'bun:test';
import { ScalarTypeEnum } from './ScalarTypeEnum';

describe('ScalarTypeEnum', () => {
  describe('primitive scalars', () => {
    describe('String_unsecure', () => {
      it('should validate strings', () => {
        const field = ScalarTypeEnum.String_unsecure();
        expect(field.getZod().parse('hello')).toBe('hello');
        expect(field.name).toBe('String_unsecure');
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.String_unsecure();
        expect(field.getJsonSchema()).toEqual({ type: 'string' });
      });
    });

    describe('Int_unsecure', () => {
      it('should validate integers', () => {
        const field = ScalarTypeEnum.Int_unsecure();
        expect(field.getZod().parse(42)).toBe(42);
        expect(() => field.getZod().parse(3.14)).toThrow();
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.Int_unsecure();
        expect(field.getJsonSchema()).toEqual({ type: 'integer' });
      });
    });

    describe('Float_unsecure', () => {
      it('should validate floats', () => {
        const field = ScalarTypeEnum.Float_unsecure();
        expect(field.getZod().parse(3.14)).toBe(3.14);
        expect(field.getZod().parse(42)).toBe(42);
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.Float_unsecure();
        expect(field.getJsonSchema()).toEqual({ type: 'number' });
      });
    });

    describe('Boolean', () => {
      it('should validate booleans', () => {
        const field = ScalarTypeEnum.Boolean();
        expect(field.getZod().parse(true)).toBe(true);
        expect(field.getZod().parse(false)).toBe(false);
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.Boolean();
        expect(field.getJsonSchema()).toEqual({ type: 'boolean' });
      });
    });

    describe('ID', () => {
      it('should validate ID strings', () => {
        const field = ScalarTypeEnum.ID();
        expect(field.getZod().parse('abc123')).toBe('abc123');
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.ID();
        expect(field.getJsonSchema()).toEqual({ type: 'string' });
      });
    });
  });

  describe('custom scalars', () => {
    describe('JSON', () => {
      it('should accept any value', () => {
        const field = ScalarTypeEnum.JSON();
        expect(field.getZod().parse({ key: 'value' })).toEqual({
          key: 'value',
        });
        expect(field.getZod().parse([1, 2, 3])).toEqual([1, 2, 3]);
        expect(field.getZod().parse('string')).toBe('string');
      });
    });

    describe('JSONObject', () => {
      it('should validate objects', () => {
        const field = ScalarTypeEnum.JSONObject();
        expect(field.getZod().parse({ key: 'value' })).toEqual({
          key: 'value',
        });
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.JSONObject();
        expect(field.getJsonSchema()).toEqual({ type: 'object' });
      });
    });

    describe('Date', () => {
      it('should parse and serialize dates', () => {
        const field = ScalarTypeEnum.Date();
        const date = new Date('2024-01-15');
        expect(field.serialize(date)).toBe('2024-01-15');
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.Date();
        expect(field.getJsonSchema()).toEqual({
          type: 'string',
          format: 'date',
        });
      });
    });

    describe('DateTime', () => {
      it('should parse and serialize datetime', () => {
        const field = ScalarTypeEnum.DateTime();
        const date = new Date('2024-01-15T10:30:00.000Z');
        expect(field.serialize(date)).toBe('2024-01-15T10:30:00.000Z');
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.DateTime();
        expect(field.getJsonSchema()).toEqual({
          type: 'string',
          format: 'date-time',
        });
      });
    });

    describe('Time', () => {
      it('should validate time format', () => {
        const field = ScalarTypeEnum.Time();
        expect(field.getZod().parse('10:30')).toBe('10:30');
        expect(field.getZod().parse('10:30:45')).toBe('10:30:45');
        expect(() => field.getZod().parse('invalid')).toThrow();
      });
    });

    describe('EmailAddress', () => {
      it('should validate email format', () => {
        const field = ScalarTypeEnum.EmailAddress();
        expect(field.getZod().parse('test@example.com')).toBe(
          'test@example.com'
        );
        expect(() => field.getZod().parse('not-an-email')).toThrow();
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.EmailAddress();
        expect(field.getJsonSchema()).toEqual({
          type: 'string',
          format: 'email',
        });
      });
    });

    describe('URL', () => {
      it('should validate URL format', () => {
        const field = ScalarTypeEnum.URL();
        expect(field.getZod().parse('https://example.com')).toBe(
          'https://example.com'
        );
        expect(() => field.getZod().parse('not-a-url')).toThrow();
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.URL();
        expect(field.getJsonSchema()).toEqual({
          type: 'string',
          format: 'uri',
        });
      });
    });

    describe('PhoneNumber', () => {
      it('should validate phone number format', () => {
        const field = ScalarTypeEnum.PhoneNumber();
        expect(field.getZod().parse('+1234567890')).toBe('+1234567890');
        expect(field.getZod().parse('1234567890')).toBe('1234567890');
        expect(field.getZod().parse('123-456-7890')).toBe('123-456-7890');
      });
    });

    describe('NonEmptyString', () => {
      it('should reject empty strings', () => {
        const field = ScalarTypeEnum.NonEmptyString();
        expect(field.getZod().parse('hello')).toBe('hello');
        expect(() => field.getZod().parse('')).toThrow();
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.NonEmptyString();
        expect(field.getJsonSchema()).toEqual({ type: 'string', minLength: 1 });
      });
    });

    describe('Locale', () => {
      it('should validate locale format', () => {
        const field = ScalarTypeEnum.Locale();
        expect(field.getZod().parse('en')).toBe('en');
        expect(field.getZod().parse('en-US')).toBe('en-US');
        expect(() => field.getZod().parse('invalid!')).toThrow();
      });
    });

    describe('TimeZone', () => {
      it('should validate timezone format', () => {
        const field = ScalarTypeEnum.TimeZone();
        expect(field.getZod().parse('UTC')).toBe('UTC');
        expect(field.getZod().parse('America/New_York')).toBe(
          'America/New_York'
        );
      });
    });

    describe('Latitude', () => {
      it('should validate latitude range', () => {
        const field = ScalarTypeEnum.Latitude();
        expect(field.getZod().parse(45.0)).toBe(45.0);
        expect(field.getZod().parse(-90)).toBe(-90);
        expect(field.getZod().parse(90)).toBe(90);
        expect(() => field.getZod().parse(91)).toThrow();
        expect(() => field.getZod().parse(-91)).toThrow();
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.Latitude();
        expect(field.getJsonSchema()).toEqual({
          type: 'number',
          minimum: -90,
          maximum: 90,
        });
      });
    });

    describe('Longitude', () => {
      it('should validate longitude range', () => {
        const field = ScalarTypeEnum.Longitude();
        expect(field.getZod().parse(0)).toBe(0);
        expect(field.getZod().parse(180)).toBe(180);
        expect(field.getZod().parse(-180)).toBe(-180);
        expect(() => field.getZod().parse(181)).toThrow();
        expect(() => field.getZod().parse(-181)).toThrow();
      });

      it('should have correct JSON schema', () => {
        const field = ScalarTypeEnum.Longitude();
        expect(field.getJsonSchema()).toEqual({
          type: 'number',
          minimum: -180,
          maximum: 180,
        });
      });
    });

    describe('Currency', () => {
      it('should validate currency code format', () => {
        const field = ScalarTypeEnum.Currency();
        expect(field.getZod().parse('USD')).toBe('USD');
        expect(field.getZod().parse('EUR')).toBe('EUR');
        expect(() => field.getZod().parse('usd')).toThrow();
        expect(() => field.getZod().parse('INVALID')).toThrow();
      });
    });

    describe('CountryCode', () => {
      it('should validate country code format', () => {
        const field = ScalarTypeEnum.CountryCode();
        expect(field.getZod().parse('US')).toBe('US');
        expect(field.getZod().parse('FR')).toBe('FR');
        expect(() => field.getZod().parse('usa')).toThrow();
      });
    });
  });

  describe('GraphQL integration', () => {
    it('should return GraphQL scalar from getPothos', () => {
      const field = ScalarTypeEnum.String_unsecure();
      const scalar = field.getPothos();
      expect(scalar.name).toBe('String_unsecure');
    });

    it('should serialize and parse values correctly', () => {
      const intField = ScalarTypeEnum.Int_unsecure();
      expect(intField.parseValue(42)).toBe(42);
      expect(intField.parseValue('42')).toBe(42);
      expect(intField.serialize(42)).toBe(42);
    });
  });
});
