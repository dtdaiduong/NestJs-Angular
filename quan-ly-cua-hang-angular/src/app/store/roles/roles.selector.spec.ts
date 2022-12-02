import {
  selectc,
  selectpaginator,
  selectResAPIRoles,
  selectRoles,
  selectRoleslise,
} from "./roles.selector";

describe("Roles", () => {
  const initialState = {
    roles: [
      {
        key: 1,
        Action: "",
        Created: "string",
        id: 1,
        name: "string",
        Updated: "string",
      },
    ],
    currentPage: 5,
    limit: 5,
    totalPage: 5,
    totalCount: 5,
    search: "string",
  };

  it("should select the roles state", () => {
    const result = selectRoles.projector(initialState);
    expect(result).toBeTruthy();
  });
  describe("select the roles list", () => {
    it("should select the roles data of roles state ", () => {
      const result = selectRoleslise.projector(initialState);
      expect(result.length).toEqual(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toEqual("string");
    });
    it("should select the roles data of roles state when list roles is not exist", () => {
      const result = selectRoleslise.projector({
        ...initialState,
        roles: null,
      });
      expect(result.length).toEqual(0);
    });
  });
  describe("select the roles list", () => {
    it("should select the paginator data of roles state", () => {
      const result = selectpaginator.projector(initialState);
      expect(result.currentPage).toEqual(5);
      expect(result.totalPage).toEqual(5);
    });
    it("should select the paginator data of roles state when list roles is not exist", () => {
      const result = selectpaginator.projector({
        ...initialState,
        roles: null,
      });
      expect(result).toEqual({});
    });
  });
  it("should select the total count  of roles state", () => {
    const result = selectc.projector(initialState);
    expect(result).toEqual(5);
  });
  it("should select the message  of roles state", () => {
    const result = selectResAPIRoles.projector({
      status: "string",
      statusCode: 5,
      message: "string",
      error: "string",
    });
    expect(result).toBeTruthy();
  });
});
