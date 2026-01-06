
import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';
import { createConsoleLoggerAdapter, createNoopLoggerAdapter } from './logger';

describe('Logger Adapter', () => {
    
  describe('Console Logger', () => {
      // Stub console methods to avoid noise
      const originalInfo = console.info;
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalLog = console.log;

      const originalDebug = console.debug;
      const mockConsoleInfo = mock();
      const mockConsoleWarn = mock();
      const mockConsoleError = mock();
      const mockConsoleLog = mock();
      const mockConsoleDebug = mock();

      beforeEach(() => {
          console.info = mockConsoleInfo;
          console.warn = mockConsoleWarn;
          console.error = mockConsoleError;
          console.log = mockConsoleLog;
          console.debug = mockConsoleDebug;
          
          mockConsoleInfo.mockClear();
          mockConsoleWarn.mockClear();
          mockConsoleError.mockClear();
          mockConsoleLog.mockClear();
          mockConsoleDebug.mockClear();
      });

      afterEach(() => {
          console.info = originalInfo;
          console.warn = originalWarn;
          console.error = originalError;
          console.log = originalLog;
          console.debug = originalDebug;
      });

      const logger = createConsoleLoggerAdapter();

      it('should log info', () => {
          logger.info('test');
          expect(mockConsoleInfo).toHaveBeenCalled();
      });

      it('should log warn', () => {
          logger.warn('test');
          expect(mockConsoleWarn).toHaveBeenCalled();
      });

      it('should log error', () => {
          logger.error('test');
          expect(mockConsoleError).toHaveBeenCalled();
      });

      it('should log debug', () => {
          process.env.DEBUG = 'true';
          logger.debug('test');
          expect(mockConsoleDebug).toHaveBeenCalled(); 
          delete process.env.DEBUG;
      });

      it('should support context', () => {
           logger.info('test', { key: 'val' });
           expect(mockConsoleInfo).toHaveBeenCalled(); 
      });
  });

  describe('Noop Logger', () => {
      const logger = createNoopLoggerAdapter();

      it('should not throw', () => {
          expect(() => logger.info('test')).not.toThrow();
          expect(() => logger.warn('test')).not.toThrow();
          expect(() => logger.error('test')).not.toThrow();
          expect(() => logger.debug('test')).not.toThrow();
      });
  });
});
