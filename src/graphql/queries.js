export const ME_QUERY = `
  {
    me {
      _id
      email
    }
  }
`;

export const GET_PINS_QUERY = `
  {
    getPins {
      _id
      createdAt
      title
      content
      latitude
      longitude
      author {
        _id
        email
      }
      comments {
        text
        createdAt
        author {
          _id
          email
        }
      }
    }
  }
`;
