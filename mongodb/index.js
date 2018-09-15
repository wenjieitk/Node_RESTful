const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/playground',{ useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.error('Cannot connect to db... ',err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: String,
        required: true,
        enum: ['web','mobile','network']
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator(v,callback){
                const result = v && v.length > 0;
                callback(result);
            },
            mesaage :'tages should have at least 1 tag'
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    isPublish: Boolean,
    price: {
        type: Number,
        required() {
            return this.isPublish; // if isPublished is true, price is require
        }
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'HAHA Course',
        category: '-', //enum
        author: 'Wen Jie',
        tags: ['frontend'],
        isPublish: true,
        price: 10
    });

    try{
        const result = await course.save();
        console.log('create : ',result);
    }
    catch(ex){
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
}

createCourse();

/**
 * eq - equal
 * ne - not equal
 * gt - greater than
 * gte - greater than or equal
 * lt - less than
 * lte - less than or equal
 * in - include
 * nin - not include
 */
async function getCourse() {
    const courses = await Course
        .find()
        .countDocuments();

    const pageNumber = 2,pageSize = 3; // /api?pageNumber=2&pageSize=10
    const courses2 = await Course
        .find({
            author: 'Wen Jie',
            isPublish: true,
            name: {
                $in: ['React Course','Node.js Course']
            },
            price: {
                $gt: 9
            }
        })
        .skip((pageNumber-1) * pageSize) //skip 3
        .limit(pageSize) // show only 3
        .sort({name: -1})
        .select({ // only show name and tags
            name: 1,
            tags: 1
        });

    /**
     * published by wenjie or isPublish
     * and price > 10
     * name start with Node (Regex)
     */
    const courses3 = await Course
        .find({name: /.*Node.*/})
        .or([{author: 'Wen Jie'},{isPublish: true}])
        .and([{price:{$gt:10}}]);

    console.log('find 1 : ',courses);
    console.log('\n\nfind 2 : ',courses2);
    console.log('\n\nfind 3 : ',courses3);
}

// getCourse();


