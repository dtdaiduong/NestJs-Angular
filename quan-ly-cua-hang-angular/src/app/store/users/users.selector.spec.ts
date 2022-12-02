import { State } from "./users.reducer";
import {
  getResUsers,
  getAllUsers,
  getPaginator,
  getOneUser,
  isDeleted,
  isCreated,
  getDeleteError,
  getCreateError,
} from "./users.selector";

describe("User Selector", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initialState: State = {
    data: {
      status: "success",
      message: "Get user successfully",
      data: [
        {
          id: 156,
          email: "test@gmail.com",
          firstname: "nhat",
          lastname: "truong",
          phone: "09333333339",
          address: "30 lalala",
          roles: [
            {
              id: 59,
              name: "Teacher",
            },
          ],
          created_at: "2022-10-11T03:46:20.936Z",
          updated_at: "2022-10-11T03:46:20.936Z",
        },
        {
          id: 157,
          email: "test2@gmail.com",
          firstname: "nhat 2",
          lastname: "truong 2",
          phone: "09333333339",
          address: "30 lalala",
          roles: [
            {
              id: 60,
              name: "Student",
            },
          ],
          created_at: "2022-10-11T03:46:20.936Z",
          updated_at: "2022-10-11T03:46:20.936Z",
        },
      ],
      currentPage: 1,
      limit: 5,
      totalCount: 3,
    },
    selected: {
      id: 156,
      email: "test@gmail.com",
      firstname: "nhat",
      lastname: "truong",
      phone: "09333333339",
      address: "30 lalala",
      roles: [
        {
          id: 59,
          name: "Teacher",
        },
      ],
      created_at: "2022-10-11T03:46:20.936Z",
      updated_at: "2022-10-11T03:46:20.936Z",
    },
    action: "[ALL] Users Success",
    done: true,
    error: null,
  };

  it("should select getResUsers when it called", () => {
    const result = getResUsers.projector(initialState);
    expect(result).toEqual(initialState.data);
  });

  it("should select getAllUsers when it called", () => {
    const result = getAllUsers.projector(initialState);
    expect(result).toEqual(initialState.data.data);
  });

  it("should select getPaginator when it called", () => {
    const result = getPaginator.projector(initialState);
    expect(result.currentPage).toEqual(initialState.data.currentPage);
    expect(result.limit).toEqual(initialState.data.limit);
    expect(result.totalCount).toEqual(initialState.data.totalCount);
  });

  it("should select getOneUser when it called with action different '[GET] User'", () => {
    const result = getOneUser.projector(initialState);
    expect(result).toEqual(null);
  });

  it("should select getOneUser when it called with action '[GET] User'", () => {
    const newInitialState: State = {
      data: {
        status: "success",
        message: "Get user successfully",
        data: [
          {
            id: 156,
            email: "test@gmail.com",
            firstname: "nhat",
            lastname: "truong",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 59,
                name: "Teacher",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
          {
            id: 157,
            email: "test2@gmail.com",
            firstname: "nhat 2",
            lastname: "truong 2",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 60,
                name: "Student",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      },
      selected: {
        id: 156,
        email: "test@gmail.com",
        firstname: "nhat",
        lastname: "truong",
        phone: "09333333339",
        address: "30 lalala",
        roles: [
          {
            id: 59,
            name: "Teacher",
          },
        ],
        created_at: "2022-10-11T03:46:20.936Z",
        updated_at: "2022-10-11T03:46:20.936Z",
      },
      action: "[GET] User",
      done: true,
      error: null,
    };
    const result = getOneUser.projector(newInitialState);
    expect(result).toEqual(initialState.selected);
  });

  it("should select isDeleted when it called with error, done and action", () => {
    const newInitialState: State = {
      data: {
        status: "success",
        message: "Get user successfully",
        data: [
          {
            id: 156,
            email: "test@gmail.com",
            firstname: "nhat",
            lastname: "truong",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 59,
                name: "Teacher",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
          {
            id: 157,
            email: "test2@gmail.com",
            firstname: "nhat 2",
            lastname: "truong 2",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 60,
                name: "Student",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      },
      selected: {
        id: 156,
        email: "test@gmail.com",
        firstname: "nhat",
        lastname: "truong",
        phone: "09333333339",
        address: "30 lalala",
        roles: [
          {
            id: 59,
            name: "Teacher",
          },
        ],
        created_at: "2022-10-11T03:46:20.936Z",
        updated_at: "2022-10-11T03:46:20.936Z",
      },
      action: "[DELETE] User",
      done: true,
      error: new Error(),
    };
    const result = isDeleted.projector(newInitialState);
    expect(result).toEqual(false);
  });

  it("should select isCreated when it called with error, done and action", () => {
    const newInitialState: State = {
      data: {
        status: "success",
        message: "Get user successfully",
        data: [
          {
            id: 156,
            email: "test@gmail.com",
            firstname: "nhat",
            lastname: "truong",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 59,
                name: "Teacher",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
          {
            id: 157,
            email: "test2@gmail.com",
            firstname: "nhat 2",
            lastname: "truong 2",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 60,
                name: "Student",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      },
      selected: {
        id: 156,
        email: "test@gmail.com",
        firstname: "nhat",
        lastname: "truong",
        phone: "09333333339",
        address: "30 lalala",
        roles: [
          {
            id: 59,
            name: "Teacher",
          },
        ],
        created_at: "2022-10-11T03:46:20.936Z",
        updated_at: "2022-10-11T03:46:20.936Z",
      },
      action: "[CREATE] User",
      done: true,
      error: new Error(),
    };
    const result = isCreated.projector(newInitialState);
    expect(result).toEqual(false);
  });

  it("should select getDeleteError when it called with action '[DELETE] User'", () => {
    const newInitialState: State = {
      data: {
        status: "success",
        message: "Get user successfully",
        data: [
          {
            id: 156,
            email: "test@gmail.com",
            firstname: "nhat",
            lastname: "truong",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 59,
                name: "Teacher",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
          {
            id: 157,
            email: "test2@gmail.com",
            firstname: "nhat 2",
            lastname: "truong 2",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 60,
                name: "Student",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      },
      selected: {
        id: 156,
        email: "test@gmail.com",
        firstname: "nhat",
        lastname: "truong",
        phone: "09333333339",
        address: "30 lalala",
        roles: [
          {
            id: 59,
            name: "Teacher",
          },
        ],
        created_at: "2022-10-11T03:46:20.936Z",
        updated_at: "2022-10-11T03:46:20.936Z",
      },
      action: "[DELETE] User",
      done: true,
      error: new Error(),
    };
    const result = getDeleteError.projector(newInitialState);
    expect(result).toEqual(newInitialState.error);
  });

  it("should select getDeleteError when it called with action different '[DELETE] User'", () => {
    const result = getDeleteError.projector(initialState);
    expect(result).toEqual(null);
  });

  it("should select getCreateError when it called with action '[CREATE] User Error'", () => {
    const newInitialState: State = {
      data: {
        status: "success",
        message: "Get user successfully",
        data: [
          {
            id: 156,
            email: "test@gmail.com",
            firstname: "nhat",
            lastname: "truong",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 59,
                name: "Teacher",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
          {
            id: 157,
            email: "test2@gmail.com",
            firstname: "nhat 2",
            lastname: "truong 2",
            phone: "09333333339",
            address: "30 lalala",
            roles: [
              {
                id: 60,
                name: "Student",
              },
            ],
            created_at: "2022-10-11T03:46:20.936Z",
            updated_at: "2022-10-11T03:46:20.936Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      },
      selected: {
        id: 156,
        email: "test@gmail.com",
        firstname: "nhat",
        lastname: "truong",
        phone: "09333333339",
        address: "30 lalala",
        roles: [
          {
            id: 59,
            name: "Teacher",
          },
        ],
        created_at: "2022-10-11T03:46:20.936Z",
        updated_at: "2022-10-11T03:46:20.936Z",
      },
      action: "[CREATE] User Error",
      done: true,
      error: new Error(),
    };
    const result = getCreateError.projector(newInitialState);
    expect(result).toEqual(newInitialState.error);
  });

  it("should select getCreateError when it called with action different '[CREATE] User Error'", () => {
    const result = getCreateError.projector(initialState);
    expect(result).toEqual(null);
  });
});
