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
