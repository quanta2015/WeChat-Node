/**
 * Created by liyang on 2016/10/6.
 */
var mongoose = require('../db');
var Schema = mongoose.Schema;


/* 用户定义 */
var messageSchema = new Schema({
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: String,
    msg: String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

messageSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Message', messageSchema);
