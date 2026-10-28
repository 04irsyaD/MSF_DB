import { ScriptParam } from "./schema";

export interface InterpolationResult {
  interpolatedSql: string;
  isValid: boolean;
  errors: Record<string, string>;
  missingRequired: string[];
}

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_$]*$/;
const NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

/**
 * Validates a single parameter value based on its type and required flag.
 */
export function validateParamValue(param: ScriptParam, value: string): string | null {
  const trimmed = value.trim();

  if (param.required && trimmed.length === 0) {
    return `${param.label || param.key} is required.`;
  }

  // If optional and empty, it's valid
  if (trimmed.length === 0) {
    return null;
  }

  if (param.type === "identifier") {
    if (!IDENTIFIER_REGEX.test(trimmed)) {
      return "Must start with a letter/underscore and contain only letters, numbers, or underscores.";
    }
  } else if (param.type === "number") {
    if (!NUMBER_REGEX.test(trimmed)) {
      return "Must be a valid integer or decimal number.";
    }
  }

  return null;
}

/**
 * Replaces placeholders {{key}} in rawSql with validated and escaped parameter values.
 */
export function interpolateSql(
  rawSql: string,
  params: ScriptParam[],
  values: Record<string, string>
): InterpolationResult {
  if (!params || params.length === 0) {
    return {
      interpolatedSql: rawSql,
      isValid: true,
      errors: {},
      missingRequired: [],
    };
  }

  const errors: Record<string, string> = {};
  const missingRequired: string[] = [];

  // Validate all parameters
  for (const p of params) {
    const val = values[p.key] !== undefined ? values[p.key] : p.default || "";
    const err = validateParamValue(p, val);
    if (err) {
      errors[p.key] = err;
      if (p.required && val.trim().length === 0) {
        missingRequired.push(p.key);
      }
    }
  }

  let resultSql = rawSql;

  for (const p of params) {
    const rawVal = values[p.key] !== undefined ? values[p.key] : p.default || "";
    const placeholderRegex = new RegExp(`\\{\\{\\s*${p.key}\\s*\\}\\}`, "g");

    if (rawVal.trim().length === 0) {
      // Keep {{key}} placeholder when required or unset without default
      continue;
    }

    let processedVal = rawVal;
    if (p.type === "string") {
      // Escape single quotes for SQL safety: ' -> ''
      processedVal = rawVal.replace(/'/g, "''");
    }

    resultSql = resultSql.replace(placeholderRegex, processedVal);
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    interpolatedSql: resultSql,
    isValid,
    errors,
    missingRequired,
  };
}

/**
 * Returns default values dictionary for a list of script parameters.
 */
export function getDefaultParamValues(params: ScriptParam[]): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const p of params) {
    defaults[p.key] = p.default || "";
  }
  return defaults;
}

/**
 * Helper to get parameter localStorage key.
 */
export function getParamStorageKey(scriptId: string): string {
  return `msfdb:sqlhelper:v1:params:${scriptId}`;
}
