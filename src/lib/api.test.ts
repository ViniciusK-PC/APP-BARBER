import { describe, expect, it } from "vitest";
import { money } from "./api";

describe("money", () => {
  it("formata valores em real brasileiro", () => {
    expect(money(65)).toContain("65,00");
    expect(money(0)).toContain("0,00");
  });
});
