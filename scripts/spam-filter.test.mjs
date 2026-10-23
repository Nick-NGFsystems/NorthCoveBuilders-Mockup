// Unit tests for lib/spam-filter.ts. Run: npm test
// Pure logic only — nothing here touches the database, Resend or the NGF portal.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getSpamReason } from "../lib/spam-filter.ts";

const NOW = 1_800_000_000_000;
const SECOND = 1_000;
const HOUR = 60 * 60 * SECOND;

const human = (overrides = {}) => ({
  name: "Pat Example",
  _gotcha: "",
  startedAt: NOW - 20 * SECOND,
  ...overrides,
});

const without = (body, key) => Object.fromEntries(Object.entries(body).filter(([k]) => k !== key));

test("a normal submission passes", () => {
  assert.equal(getSpamReason(human(), NOW), null);
});

test("filled honeypot is filtered, even with a valid timestamp", () => {
  assert.equal(getSpamReason(human({ _gotcha: "http://spam.example" }), NOW), "honeypot");
  assert.equal(getSpamReason(human({ _gotcha: "x" }), NOW), "honeypot");
});

test("honeypot that is not a string is filtered; empty or absent is fine", () => {
  for (const value of [1, true, { a: 1 }, ["x"]]) {
    assert.equal(getSpamReason(human({ _gotcha: value }), NOW), "honeypot");
  }
  assert.equal(getSpamReason(human({ _gotcha: null }), NOW), null);
  assert.equal(getSpamReason(human({ _gotcha: "   " }), NOW), null);
  assert.equal(getSpamReason(without(human(), "_gotcha"), NOW), null);
});

test("missing timestamp is filtered", () => {
  assert.equal(getSpamReason(without(human(), "startedAt"), NOW), "timestamp_missing");
  assert.equal(getSpamReason(human({ startedAt: null }), NOW), "timestamp_missing");
  assert.equal(getSpamReason(human({ startedAt: "" }), NOW), "timestamp_missing");
});

test("invalid timestamp is filtered", () => {
  for (const value of ["1799999990000", "abc", NaN, Infinity, 0, -5, {}, [], true]) {
    assert.equal(getSpamReason(human({ startedAt: value }), NOW), "timestamp_invalid", String(value));
  }
});

test("submitted under 3 seconds after load is filtered", () => {
  assert.equal(getSpamReason(human({ startedAt: NOW }), NOW), "too_fast");
  assert.equal(getSpamReason(human({ startedAt: NOW - 2_999 }), NOW), "too_fast");
});

test("a timestamp in the future is filtered as too fast", () => {
  assert.equal(getSpamReason(human({ startedAt: NOW + 60 * SECOND }), NOW), "too_fast");
});

test("3 seconds exactly is allowed", () => {
  assert.equal(getSpamReason(human({ startedAt: NOW - 3_000 }), NOW), null);
});

test("older than 1 hour is filtered; exactly 1 hour is allowed", () => {
  assert.equal(getSpamReason(human({ startedAt: NOW - HOUR - 1 }), NOW), "too_old");
  assert.equal(getSpamReason(human({ startedAt: NOW - HOUR }), NOW), null);
});

test("honeypot is reported ahead of a bad timestamp", () => {
  assert.equal(getSpamReason({ _gotcha: "x" }, NOW), "honeypot");
});

test("non-object bodies don't throw and are filtered", () => {
  for (const body of [null, undefined, "text", 42, []]) {
    assert.equal(getSpamReason(body, NOW), "timestamp_missing");
  }
});
