const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mongo-exercises',{ useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.error('Cannot connect to db... ',err));

const courseSchema = new mongoose.Schema({
    _id : String,
    name: String,
    author: String,
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    },
    isPublish: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    return await Course
        .find({ isPublished: true, tags: 'backend' })
        .sort({ name: 1 })
        .select({ name: 1, author: 1 });
}

async function run() {
    const courses = await getCourses();
    console.log('#1\n',courses);
}

run();


async function getCoursesInDescPrice() {
    return await Course
        .find({ isPublished: true})
        .or([ {tags: 'frontend'}, {tags: 'backend'} ])
        .sort('-price')
        .select('name author price');
}

async function run2() {
    const courses = await getCoursesInDescPrice();
    console.log('\n\n#2\n',courses);
}

run2();


async function getCoursesInPrice15OrMore() {
    return await Course
        .find({ isPublished: true})
        .or([ {name: /.*by.*/i} , {price: {$gte: 15}} ])
        .sort('-price')
        .select('name author price');
}

async function run3() {
    const courses = await getCoursesInPrice15OrMore();
    console.log('\n\n#3\n',courses);
}

run3();


async function updateCourses(id,id2) {
    const result = await Course.update({
        _id: id
    },{
        $set: {
            author: 'Wen Jie',
            isPublished: false
        }
    });

    console.log('\n\n#4\n',result);

    const result2 = await Course.findByIdAndUpdate(id2,{
        $set: {
            author: 'Wen',
            isPublished: false
        }
    },{
        new : true
    });

    console.log('\n\n#5\n',result2);
}

updateCourses('5a68fde3f09ad7646ddec17e','5a68fdc3615eda645bc6bdec');



async function removeCourses(id,id2) {
    const result = await Course.deleteOne({_id:id});
    console.log('\n\n#6\n',result);

    const result2 = await Course.findByIdAndRemove(id2)
    console.log('\n\n#7\n',result2);
}

removeCourses('5a68ff090c553064a218a547','5a68ff090c553064a218a547');
