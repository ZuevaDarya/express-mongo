export default m => {
  const UserSchema = m.Schema({
    login: String,
    password: {
      type: String,
      required: [true, 'Password is a necessary!']
    }
  });
  
  return m.model('User', UserSchema);
}