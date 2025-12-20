import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadTypeScriptModule(filePath: string): Promise<any> {
  const source = await readFile(filePath, 'utf-8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  });

  const moduleExports: Record<string, unknown> = {};
  const moduleObject = { exports: moduleExports };
  const require = createRequire(filePath);

  const context = vm.createContext({
    module: moduleObject,
    exports: moduleExports,
    require,
    __dirname: dirname(filePath),
    __filename: filePath,
    process,
    console,
    Buffer,
    setTimeout,
    setImmediate,
    clearTimeout,
    clearImmediate,
  });

  const script = new vm.Script(transpiled.outputText, {
    filename: filePath,
  });
  script.runInContext(context);

  return moduleObject.exports;
}
