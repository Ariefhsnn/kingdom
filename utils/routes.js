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
        name: "Create",
        icon: "",
      },
      {
        url: "/discover/upload",
        path: "/discover/upload",
        name: "Upload",
        icon: "",
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
        name: "Create",
        icon: "",
      },
      {
        url: "/directory/upload",
        path: "/directory/upload",
        name: "Upload",
        icon: "",
      },
    ],
  },
  {
    url: "/user",
    name: "User Management",
    icon: "MdPerson",
    path: "/user",
  },
];

export { routes };
