import gql from "graphql-tag";

export const PIN_ADDED = gql`
  subscription {
    pinAdded {
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
    }
  }
`;

export const PIN_UPDATED = gql`
  subscription {
    pinUpdated {
      __id
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

export const PIN_DELETED = gql`
  subscription {
    pinDeleted {
      _id
    }
  }
`;
