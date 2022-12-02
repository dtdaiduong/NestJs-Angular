import {
  deltetRoles,
  getListRoles,
  getListRolesSuccess,
  sortListRoles,
} from "./roles.action";

describe("getListRolesSuccess", () => {
  it("call func with default value", () => {
    const action = getListRolesSuccess();

    expect(action).toEqual({
      prop: {
        roles: [],
        currentPage: 1,
        limit: 5,
        totalPage: 0,
        totalCount: 0,
        search: "",
      },
      type: "[Get list Success]",
    });
  });
  it("call func with prameter", () => {
    const action = getListRolesSuccess({
      roles: [],
      currentPage: 5,
      limit: 5,
      totalPage: 5,
      totalCount: 2,
      search: "dsa",
    });

    expect(action).toEqual({
      prop: {
        roles: [],
        currentPage: 5,
        limit: 5,
        totalPage: 5,
        totalCount: 2,
        search: "dsa",
      },
      type: "[Get list Success]",
    });
  });
});
describe("getListRoles", () => {
  it("call func with default value", () => {
    const action = getListRoles();

    expect(action).toEqual({
      prop: { currentPage: 1, limit: 5, search: "", col: "", criteria: "" },
      type: "[Get list]",
    });
  });
  it("call func with parameter", () => {
    const action = getListRoles({
      currentPage: 10,
      limit: 10,
      search: "search",
      col: "",
      criteria: "",
    });

    expect(action).toEqual({
      prop: {
        currentPage: 10,
        limit: 10,
        search: "search",
        col: "",
        criteria: "",
      },
      type: "[Get list]",
    });
  });
});
describe("deltetRoles ", () => {
  it("call func with default value", () => {
    const action = deltetRoles(2);

    expect(action).toEqual({ id: 2, type: "[Delete list]" });
  });
});
describe("sortListRoles ", () => {
  it("call func with default value", () => {
    const action = sortListRoles({
      roles: [
        {
          id: 474,
          name: "x89ra",
          Created: "2022-11-03T02:01:59.252Z",
          Updated: "2022-11-03T02:01:59.252Z",
        },
      ],
    });
    // roles:[], type: "[Sort list]"
    expect(action).toEqual({
      prop: {
        roles: [
          {
            id: 474,
            name: "x89ra",
            Created: "2022-11-03T02:01:59.252Z",
            Updated: "2022-11-03T02:01:59.252Z",
          },
        ],
      },
      type: "[Sort list]",
    });
  });
});
