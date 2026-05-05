module.exports = {
  createUserMutation: `mutation createGuardian($input: CreateGuardianInput!) {
      createGuardian(input: $input) {
        id
        name
        familyName
        email
      }
    }
    `
}
