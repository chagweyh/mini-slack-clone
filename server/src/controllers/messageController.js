import { Message, validate } from '../models/Message';

async function addMessage(req, res) {
  console.log(req.body);
  const message = new Message(req.body);
  await message.save().then(message => message.populate('author', '-password').execPopulate());
  res.json(message);
}

export { addMessage };
