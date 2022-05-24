/**
 * user.js
 * @description :: model of a database collection user
 */

const mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    password: { type: String },

    email: { type: String },

    name: { type: String },

    isActive: { type: Boolean },

    createdAt: { type: Date },

    updatedAt: { type: Date },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method('toJSON', function () {
  const {
    _id, __v, ...object
  } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;

  return object;
});
schema.plugin(idValidator);

const user = mongoose.model('user', schema);
module.exports = user;