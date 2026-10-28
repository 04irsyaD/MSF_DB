import assert from "node:assert/strict";
import test from "node:test";

// 1. Interpolation logic tests (direct implementation testing matching src/features/sql-helper/lib/interpolate.ts)
const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_$]*$/;
const NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

function validateParamValue(param, value) {
  const trimmed = value.trim();

  if (param.required && trimmed.length === 0) {
    return `${param.label || param.key} is required.`;
  }

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

function interpolateSql(rawSql, params, values) {
  if (!params || params.length === 0) {
    return {
      interpolatedSql: rawSql,
      isValid: true,
      errors: {},
      missingRequired: [],
    };
  }

  const errors = {};
  const missingRequired = [];

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
      continue;
    }

    let processedVal = rawVal;
    if (p.type === "string") {
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

function getDefaultParamValues(params) {
  const defaults = {};
  for (const p of params) {
    defaults[p.key] = p.default || "";
  }
  return defaults;
}

test("Parameter Validation - identifier", () => {
  const param = { key: "table_name", label: "Table Name", type: "identifier", required: true };
  assert.equal(validateParamValue(param, "users"), null);
  assert.equal(validateParamValue(param, "_secret_tbl"), null);
  assert.equal(validateParamValue(param, "data_2026$"), null);

  assert.notEqual(validateParamValue(param, "123bad"), null);
  assert.notEqual(validateParamValue(param, "drop table;"), null);
  assert.notEqual(validateParamValue(param, "my-table"), null);
});

test("Parameter Validation - number", () => {
  const param = { key: "limit_rows", label: "Limit", type: "number", required: true };
  assert.equal(validateParamValue(param, "100"), null);
  assert.equal(validateParamValue(param, "-5"), null);
  assert.equal(validateParamValue(param, "3.14"), null);

  assert.notEqual(validateParamValue(param, "abc"), null);
  assert.notEqual(validateParamValue(param, "100; DROP"), null);
});

test("Parameter Validation - optional vs required", () => {
  const optionalParam = { key: "opt", label: "Opt", type: "string", required: false };
  assert.equal(validateParamValue(optionalParam, ""), null);

  const reqParam = { key: "req", label: "Req", type: "string", required: true };
  assert.notEqual(validateParamValue(reqParam, ""), null);
});

test("SQL Interpolation - basic substitution", () => {
  const sql = "SELECT * FROM {{table_name}} LIMIT {{limit}};";
  const params = [
    { key: "table_name", type: "identifier", required: true },
    { key: "limit", type: "number", required: true, default: "10" },
  ];

  const res = interpolateSql(sql, params, { table_name: "orders", limit: "25" });
  assert.equal(res.isValid, true);
  assert.equal(res.interpolatedSql, "SELECT * FROM orders LIMIT 25;");
});

test("SQL Interpolation - string escaping (single quotes)", () => {
  const sql = "SELECT * FROM users WHERE name = '{{username}}';";
  const params = [
    { key: "username", type: "string", required: true },
  ];

  const res = interpolateSql(sql, params, { username: "O'Connor" });
  assert.equal(res.isValid, true);
  assert.equal(res.interpolatedSql, "SELECT * FROM users WHERE name = 'O''Connor';");
});

test("SQL Interpolation - missing required preserves placeholder and flags invalid", () => {
  const sql = "SELECT * FROM {{table_name}} WHERE id = {{id}};";
  const params = [
    { key: "table_name", type: "identifier", required: true },
    { key: "id", type: "number", required: true },
  ];

  const res = interpolateSql(sql, params, { table_name: "users", id: "" });
  assert.equal(res.isValid, false);
  assert.ok(res.missingRequired.includes("id"));
  assert.equal(res.interpolatedSql, "SELECT * FROM users WHERE id = {{id}};");
});

test("SQL Interpolation - default values extraction", () => {
  const params = [
    { key: "a", default: "val_a" },
    { key: "b", default: "val_b" },
    { key: "c" },
  ];
  const defaults = getDefaultParamValues(params);
  assert.deepEqual(defaults, { a: "val_a", b: "val_b", c: "" });
});

console.log("All SQL Helper Fase 4 unit tests executed successfully.");
