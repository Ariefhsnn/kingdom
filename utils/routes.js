const routes = [
  {
    url: "/community",
    name: "Community",
    icon: "MdPeopleOutline",
    routes: [
      {
        url: "/community",
        path: "/community",
        name: "Group",
        icon: "",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    url: "/discover",
    name: "Discover",
    icon: "MdSearch",
    routes: [
      {
        url: "/discover",
        path: "/discover",
        name: "Discover Tab",
        icon: "",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        url: "/discover/upload",
        path: "/discover/upload",
        name: "Discover Content",
        icon: "",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    url: "/directory",
    name: "Directory",
    icon: "MdPhone",
    routes: [
      {
        url: "/directory",
        path: "/directory",
        name: "Directory Category",
        icon: "",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        url: "/directory/upload",
        path: "/directory/upload",
        name: "Directory Content",
        icon: "",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    url: "/user",
    name: "User Management",
    icon: "MdPerson",
    path: "/user",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

export { routes };
