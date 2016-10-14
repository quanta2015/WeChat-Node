/**
 * Created by liyang on 2016/10/6.
 */
var mongoose = require('../db');
var Schema = mongoose.Schema;


/* 用户定义 */
var friendSchema = new Schema({
    // uid: String,
    // fid: String,
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fid:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

friendSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Friend', friendSchema);
