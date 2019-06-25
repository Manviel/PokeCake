export const CREATE_PIN = `
  mutation($title: String!, $content: String!, $latitude: Float!, $longitude: Float!) {
    createPin(input: {
      title: $title,
      content: $content,
      latitude: $latitude,
      longitude: $longitude
    }) {
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

export const DELETE_PIN = `
  mutation($pinId: ID!) {
    deletePin(pinId: $pinId) {
      _id
    }
  }
`;

export const CREATE_COMMENT = `
  mutation($pinId: ID!, $text: String!) {
    createComment(pinId: $pinId, text: $text) {
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
